const fs = require('fs');
const dataset = JSON.parse(fs.readFileSync('tools/signs_24pdd_dataset.json', 'utf8'));

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&#171;/g, '«')
    .replace(/&#187;/g, '»')
    .replace(/&nbsp;/g, ' ')
    .replace(/^[»"'\s.–-]+/, '')
    .trim();
}

function cleanNum(num) {
  return num
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/\s*—\s*/g, '–')
    .trim();
}

const cleaned = dataset.map(s => {
  let title = cleanText(s.title);
  let desc = cleanText(s.desc);
  let features = cleanText(s.features);
  let num = cleanNum(s.num);

  // If desc starts with title repeated, remove it
  if (title && desc.startsWith(title)) {
    desc = desc.slice(title.length).trim();
    desc = cleanText(desc);
  }

  return {
    num,
    title,
    titleKk: title,
    desc: desc || title,
    features: features || '',
    group: s.group,
    groupTitle: s.groupTitle,
    groupTitleKk: s.groupTitleKk,
    img: s.dataUri
  };
});

fs.writeFileSync('tools/signs_24pdd_clean.json', JSON.stringify(cleaned, null, 2));
console.log('Cleaned 24pdd signs:', cleaned.length);
