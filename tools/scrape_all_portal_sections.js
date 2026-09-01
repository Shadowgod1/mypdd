const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function scrapeMarkings() {
  console.log('Scraping Markings from 24pdd.kz...');
  const hHtml = await fetchText('https://24pdd.kz/1-gorizontalnaya-razmetka/');
  const vHtml = await fetchText('https://24pdd.kz/2-vertikalnaya-razmetka/');

  function parseTable(html, group, groupTitle, groupTitleKk) {
    const items = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowHtml = rowMatch[1];
      if (!rowHtml.includes('<td')) continue;

      const cells = [];
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
        cells.push(cellMatch[1]);
      }
      if (cells.length < 2) continue;

      const leftCell = cells[0];
      const rightCell = cells[1];

      // Extract num & image
      const numMatch = leftCell.match(/<strong>([^<]+)<\/strong>/i) || leftCell.match(/(\d+\.\d+(?:\.\d+)?(?:\s*[-–,]\s*\d+\.\d+(?:\.\d+)?)?)/);
      const num = numMatch ? cleanHtml(numMatch[1]) : '';
      if (!num || num.length > 20) continue;

      const imgMatch = leftCell.match(/data-src="([^">]+)"/i) || leftCell.match(/src="([^">]+)"/i);
      let imgUrl = imgMatch ? imgMatch[1] : '';
      if (imgUrl.startsWith('data:image')) {
        const secondImg = leftCell.match(/data-srcset="([^">]+)"/i);
        if (secondImg) imgUrl = secondImg[1].split(' ')[0];
      }

      // Title & Desc & Features
      let title = '';
      const titleMatch = rightCell.match(/<h\d[^>]*>([\s\S]*?)<\/h\d>/i) || rightCell.match(/<strong>([^<]+)<\/strong>/i);
      if (titleMatch) title = cleanHtml(titleMatch[1]).replace(/^[«"']+|[»"']+$/g, '');

      let desc = '';
      let features = '';
      if (rightCell.includes('Особенности:')) {
        const parts = rightCell.split(/Особенности:/i);
        desc = cleanHtml(parts[0]);
        features = cleanHtml(parts[1]);
      } else {
        desc = cleanHtml(rightCell);
      }

      if (title && desc.startsWith(title)) desc = desc.slice(title.length).trim();
      desc = desc.replace(/^[«"'\s.–-]+/, '').trim();
      if (!title && desc) title = desc.split('.')[0];

      items.push({
        num,
        title: title || `Разметка ${num}`,
        titleKk: title || `Разметка ${num}`,
        desc: desc || title,
        features: features || '',
        imgUrl,
        group,
        groupTitle,
        groupTitleKk
      });
    }
    return items;
  }

  const hItems = parseTable(hHtml, 'h', '1. Горизонтальная разметка', '1. Көлденең таңбалар');
  const vItems = parseTable(vHtml, 'v', '2. Вертикальная разметка', '2. Тік таңбалар');

  const allMarkings = [...hItems, ...vItems];
  console.log(`Scraped ${allMarkings.length} markings`);
  return allMarkings;
}

async function scrapeFines() {
  console.log('Scraping Fines from 24pdd.kz...');
  const html = await fetchText('https://24pdd.kz/tablitsa-shtrafov-za-narushenie-pdd-rk/');
  
  // Extract all rows
  const fines = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  let currentGroup = 'Общие нарушения';

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    if (rowHtml.includes('<th') || !rowHtml.includes('<td')) continue;

    // Check if row is a group header
    if (rowHtml.includes('colspan') || rowHtml.includes('background-color: #f3f3f3')) {
      const gTitle = cleanHtml(rowHtml);
      if (gTitle && gTitle.length < 80) currentGroup = gTitle;
      continue;
    }

    const cells = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(cellMatch[1]);
    }

    if (cells.length >= 5) {
      const num = cleanHtml(cells[0]);
      const title = cleanHtml(cells[1]);
      const article = cleanHtml(cells[2]);
      const mrp = cleanHtml(cells[3]);
      const sum = cleanHtml(cells[4]);
      const repeat = cells[5] ? cleanHtml(cells[5]) : '';
      
      if (!title || !article) continue;

      fines.push({
        num,
        title,
        titleKk: title,
        article,
        mrp,
        sum,
        repeat,
        group: currentGroup
      });
    }
  }

  console.log(`Scraped ${fines.length} fine articles`);
  return fines;
}

async function scrapeProchie() {
  console.log('Scraping Prochie sections from 24pdd.kz...');
  const prochieSections = [
    { id: 'docs', title: 'Перечень документов водителя', url: 'https://24pdd.kz/perechen/' },
    { id: 'faults', title: 'Перечень неисправностей ТС', url: 'https://24pdd.kz/perechen-neispravnostej/' },
    { id: 'law', title: 'Закон «О дорожном движении» РК', url: 'https://24pdd.kz/law/' },
    { id: 'tax', title: 'Налог на транспорт в РК', url: 'https://24pdd.kz/tax/' },
    { id: 'categories', title: 'Категории и подкатегории ТС', url: 'https://24pdd.kz/kategorii-ts/' },
    { id: 'regions', title: 'Коды регионов на автономерах РК', url: 'https://24pdd.kz/tsifrovye-kodi/' },
    { id: 'ranks', title: 'Звания и погоны сотрудников МВД РК', url: 'https://24pdd.kz/zvaniya-sotrudnikov-mvd-rk-i-sootvetstvuyushhie-im-pogony/' },
    { id: 'cycles', title: 'ПДД для велосипедистов и самокатов', url: 'https://24pdd.kz/1-pdd-dlya-velosipedistov/' },
    { id: 'autodrome', title: 'Методика экзамена на автодроме СпецЦОН', url: 'https://24pdd.kz/metodika-provedeniya-prakticheskogo-ekzamena-na-avtomatizirovannom-avtodrome/' },
    { id: 'auto_kit', title: 'Что должно быть в машине', url: 'https://24pdd.kz/chto-dolzhno-byt-v-mashine/' }
  ];

  const scrapedProchie = [];
  for (const p of prochieSections) {
    try {
      const html = await fetchText(p.url);
      // Extract main content
      const entryStart = html.indexOf('<div class="entry-content') !== -1 ? html.indexOf('<div class="entry-content') : html.indexOf('<article');
      const entryEnd = html.indexOf('</article>') !== -1 ? html.indexOf('</article>') : html.indexOf('<footer');
      const contentHtml = html.slice(entryStart, entryEnd !== -1 ? entryEnd : entryStart + 15000);
      const text = cleanHtml(contentHtml);

      scrapedProchie.push({
        id: p.id,
        title: p.title,
        content: text.slice(0, 8000)
      });
      console.log(`Scraped prochie [${p.id}] ${p.title} (${text.length} chars)`);
    } catch (e) {
      console.error(`Failed to scrape ${p.title}:`, e.message);
    }
  }
  return scrapedProchie;
}

async function main() {
  const markings = await scrapeMarkings();
  const fines = await scrapeFines();
  const prochie = await scrapeProchie();

  fs.writeFileSync('tools/markings_24pdd.json', JSON.stringify(markings, null, 2));
  fs.writeFileSync('tools/fines_24pdd.json', JSON.stringify(fines, null, 2));
  fs.writeFileSync('tools/prochie_24pdd.json', JSON.stringify(prochie, null, 2));
  console.log('All sections scraped and saved successfully!');
}

main().catch(console.error);
