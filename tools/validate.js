const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadApp() {
  const root = path.join(__dirname, '..');
  const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const scriptStart = src.indexOf('<script>');
  const scriptEnd = src.lastIndexOf('</script>');
  if (scriptStart === -1 || scriptEnd === -1) {
    throw new Error('Could not find <script> block in index.html');
  }
  const scriptCode = src.slice(scriptStart + 8, scriptEnd);

  const mockEl = () => ({
    setAttribute: () => {},
    removeAttribute: () => {},
    dataset: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: () => {},
    querySelector: () => mockEl(),
    querySelectorAll: () => [],
    scrollIntoView: () => {},
    innerHTML: '',
    textContent: '',
    style: {}
  });

  const domEl = mockEl();
  const sandbox = {
    window: {
      addEventListener: () => {},
      matchMedia: () => ({ matches: false, addEventListener: () => {} }),
      location: { hash: '' },
      scrollTo: () => {}
    },
    document: {
      getElementById: () => mockEl(),
      querySelector: () => mockEl(),
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      documentElement: domEl,
      body: mockEl(),
      title: ''
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    navigator: { userAgent: 'node' },
    console,
    setTimeout: () => {},
    clearTimeout: () => {},
    setInterval: () => {},
    clearInterval: () => {}
  };

  const scriptToRun = scriptCode + '\n;globalThis.__EXPORTS__ = { Q, KKQ, TOPICS, RULES_DATA, SIGNS_DATA, MARKINGS_DATA, FINES_DATA, PROCHIE_DATA, PMP_DATA, searchRules, searchSigns, searchMarkings, searchFines, screenRules, screenSigns, screenMarkings, screenFines, screenProchie, screenPmp, screenHome, screenAbout };';
  vm.createContext(sandbox);
  vm.runInContext(scriptToRun, sandbox);
  return sandbox.__EXPORTS__;
}

function runChecks() {
  const app = loadApp();
  const Q = app.Q;
  const KKQ = app.KKQ;
  const TOPICS = app.TOPICS;

  console.log(`Loaded ${Q.length} questions, ${Object.keys(KKQ).length} Kazakh translations.`);

  let errors = [];

  // Check 1: Question structure
  Q.forEach((q, i) => {
    if (!q.t) errors.push(`Q[${i}]: missing topic 't'`);
    if (!q.q || typeof q.q !== 'string' || !q.q.trim()) errors.push(`Q[${i}]: empty or invalid 'q'`);
    if (!Array.isArray(q.o) || q.o.length !== 4) errors.push(`Q[${i}]: options 'o' must have exactly 4 items (found ${q.o ? q.o.length : 0})`);
    else {
      q.o.forEach((opt, oi) => {
        if (!opt || typeof opt !== 'string' || !opt.trim()) errors.push(`Q[${i}].o[${oi}]: option is empty`);
      });
    }
    if (q.a !== 0) errors.push(`Q[${i}]: 'a' must be 0 (found ${q.a})`);
    if (!q.e || typeof q.e !== 'string' || !q.e.trim()) errors.push(`Q[${i}]: explanation 'e' is empty`);

    // Check Kazakh translation if present
    if (KKQ[q.q]) {
      const kk = KKQ[q.q];
      if (!kk.q) errors.push(`KKQ[${i}]: empty 'q'`);
      if (!Array.isArray(kk.o) || kk.o.length !== q.o.length) errors.push(`KKQ[${i}]: options length (${kk.o ? kk.o.length : 0}) !== ru options length (${q.o.length})`);
      if (!kk.e) errors.push(`KKQ[${i}]: empty 'e'`);
    }
  });

  // Check 2: Test all img() calls
  let imgCount = 0;
  Q.forEach((q, i) => {
    if (typeof q.img === 'function') {
      imgCount++;
      try {
        const svg = q.img();
        if (typeof svg !== 'string') {
          errors.push(`Q[${i}].img() did not return a string`);
        } else {
          if (svg.includes('undefined')) errors.push(`Q[${i}].img() output contains 'undefined'`);
          if (svg.includes('NaN')) errors.push(`Q[${i}].img() output contains 'NaN'`);
          if (!svg.startsWith('<svg') && !svg.startsWith('<div class="figure')) {
            errors.push(`Q[${i}].img() output does not start with expected tag: ${svg.slice(0, 30)}`);
          }
        }
      } catch (err) {
        errors.push(`Q[${i}].img() threw error: ${err.message}`);
      }
    }
  });
  console.log(`Verified ${imgCount} illustrations.`);

  // Check 3: Jaccard similarity between questions to find near-duplicates
  function tokenize(str) {
    return new Set(str.toLowerCase().replace(/[^a-zа-яё0-9]/gi, ' ').split(/\s+/).filter(w => w.length > 2));
  }
  function jaccard(s1, s2) {
    const inter = new Set([...s1].filter(x => s2.has(x))).size;
    const union = new Set([...s1, ...s2]).size;
    return union === 0 ? 0 : inter / union;
  }

  let duplicates = [];
  for (let i = 0; i < Q.length; i++) {
    const t1 = tokenize(Q[i].q);
    for (let j = i + 1; j < Q.length; j++) {
      const t2 = tokenize(Q[j].q);
      const score = jaccard(t1, t2);
      if (score >= 0.55) {
        duplicates.push({ i, j, score: score.toFixed(3), q1: Q[i].q, q2: Q[j].q });
      }
    }
  }

  // Check 4: Rules data integrity and search
  const RULES = app.RULES_DATA;
  if (!Array.isArray(RULES) || RULES.length === 0) {
    errors.push('RULES_DATA is missing or empty');
  } else {
    let paraCount = 0;
    RULES.forEach((ch, ci) => {
      if (!ch.id || !ch.title || !Array.isArray(ch.paragraphs)) {
        errors.push(`RULES[${ci}]: invalid chapter format`);
      } else {
        paraCount += ch.paragraphs.length;
      }
    });
    console.log(`Verified ${RULES.length} rules chapters (${paraCount} total paragraphs).`);

    // Test search
    const testSearch = app.searchRules('140');
    if (!testSearch || testSearch.length === 0) {
      errors.push('searchRules("140") returned 0 results');
    }
  }
  // Check 5: Signs data integrity
  const SIGNS = app.SIGNS_DATA;
  if (!Array.isArray(SIGNS) || SIGNS.length === 0) {
    errors.push('SIGNS_DATA is missing or empty');
  } else {
    SIGNS.forEach((s, si) => {
      if (!s.num || !s.title || !s.group) errors.push(`SIGNS[${si}]: missing required fields`);
    });
    console.log(`Verified ${SIGNS.length} road signs.`);
    const testSign = app.searchSigns('3.27');
    if (!testSign || testSign.length === 0) errors.push('searchSigns("3.27") returned 0 results');
  }

  // Check 6: Markings data integrity
  const MARKINGS = app.MARKINGS_DATA;
  if (!Array.isArray(MARKINGS) || MARKINGS.length === 0) {
    errors.push('MARKINGS_DATA is missing or empty');
  } else {
    console.log(`Verified ${MARKINGS.length} road markings.`);
    const testMark = app.searchMarkings('1.1');
    if (!testMark || testMark.length === 0) errors.push('searchMarkings("1.1") returned 0 results');
  }

  // Check 7: Fines data integrity
  const FINES = app.FINES_DATA;
  if (!Array.isArray(FINES) || FINES.length === 0) {
    errors.push('FINES_DATA is missing or empty');
  } else {
    console.log(`Verified ${FINES.length} traffic fine articles (КоАП РК).`);
    const testFine = app.searchFines('592');
    if (!testFine || testFine.length === 0) errors.push('searchFines("592") returned 0 results');
  }

  // Check 8: Prochie sections integrity
  const PROCHIE = app.PROCHIE_DATA;
  if (!Array.isArray(PROCHIE) || PROCHIE.length === 0) {
    errors.push('PROCHIE_DATA is missing or empty');
  } else {
    console.log(`Verified ${PROCHIE.length} prochie portal sections.`);
  }

  // Check 9: First aid data integrity
  const PMP = app.PMP_DATA;
  if (!PMP || !Array.isArray(PMP.sections) || PMP.sections.length === 0) {
    errors.push('PMP_DATA is missing or empty');
  } else {
    console.log(`Verified ${PMP.sections.length} first aid (ПМП) sections.`);
  }

  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} potential duplicates (Jaccard >= 0.55):`);
    duplicates.forEach(d => {
      console.log(`  [${d.i} vs ${d.j}] (${d.score})\n   1: ${d.q1}\n   2: ${d.q2}`);
    });
  } else {
    console.log('No duplicates found (Jaccard >= 0.55 threshold).');
  }

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} errors:`);
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  } else {
    console.log('All checks PASSED!');
  }
}

if (require.main === module) {
  runChecks();
}

module.exports = { loadApp, runChecks };
