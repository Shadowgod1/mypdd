const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SECTIONS = [
  { id: '1', url: 'https://24pdd.kz/1-preduprezhdayushhie-znaki/', groupTitle: '1. Предупреждающие знаки', groupTitleKk: '1. Ескерту белгілері' },
  { id: '2', url: 'https://24pdd.kz/2-znaki-prioriteta/', groupTitle: '2. Знаки приоритета', groupTitleKk: '2. Басымдық белгілері' },
  { id: '3', url: 'https://24pdd.kz/3-zapreshhayushhie-znaki/', groupTitle: '3. Запрещающие знаки', groupTitleKk: '3. Тыйым салатын белгілер' },
  { id: '4', url: 'https://24pdd.kz/4-predpisyvayushhie-znaki/', groupTitle: '4. Предписывающие знаки', groupTitleKk: '4. Бұйыру белгілері' },
  { id: '5', url: 'https://24pdd.kz/5-informatsionno-ukazatelnye-znaki/', groupTitle: '5. Информационно-указательные знаки', groupTitleKk: '5. Ақпараттық-нұсқағыш белгілер' },
  { id: '6', url: 'https://24pdd.kz/6-znaki-servisa/', groupTitle: '6. Знаки сервиса', groupTitleKk: '6. Сервис белгілері' },
  { id: '7', url: 'https://24pdd.kz/7-znaki-dopolnitelnoj-informatsii-tablichki/', groupTitle: '7. Знаки дополнительной информации (таблички)', groupTitleKk: '7. Қосымша ақпарат белгілері (тақтайшалар)' },
  { id: '8', url: 'https://24pdd.kz/8-znaki-opasnyh-gruzov/', groupTitle: '8. Опознавательные знаки', groupTitleKk: '8. Айырым белгілері' }
];

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

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadImage(res.headers.location, destPath));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
    }).on('error', err => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
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
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function scrapeSection(sec) {
  console.log(`Scraping group ${sec.id}: ${sec.url}...`);
  let html = '';
  try {
    html = await fetchText(sec.url);
  } catch (err) {
    console.error(`Failed to fetch ${sec.url}:`, err.message);
    return [];
  }

  const signs = [];
  // Match rows in table
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

    // Extract sign number from left cell: <strong>2.1</strong> or similar
    const numMatch = leftCell.match(/<strong>([^<]+)<\/strong>/i) || leftCell.match(/(\d+\.\d+(?:\.\d+)?(?:\s*[-–,]\s*\d+\.\d+(?:\.\d+)?)?)/);
    const num = numMatch ? cleanHtml(numMatch[1]) : '';
    if (!num || num.length > 20) continue;

    // Extract image URL from left cell: data-src="https://..." or src="https://..."
    const imgMatch = leftCell.match(/data-src="([^">]+)"/i) || leftCell.match(/src="([^">]+)"/i);
    let imgUrl = imgMatch ? imgMatch[1] : '';
    if (imgUrl.startsWith('data:image')) {
      const secondImg = leftCell.match(/data-srcset="([^">]+)"/i);
      if (secondImg) {
        imgUrl = secondImg[1].split(' ')[0];
      }
    }

    // Extract title from right cell: <h5 ...><span>«Главная дорога»</span></h5> or similar
    let title = '';
    const titleMatch = rightCell.match(/<h\d[^>]*>([\s\S]*?)<\/h\d>/i) || rightCell.match(/<strong>([^<]+)<\/strong>/i);
    if (titleMatch) {
      title = cleanHtml(titleMatch[1]).replace(/^[«"']+|[»"']+$/g, '');
    }

    // Extract description & features
    let desc = '';
    let features = '';

    if (rightCell.includes('Особенности:')) {
      const parts = rightCell.split(/Особенности:/i);
      desc = cleanHtml(parts[0]);
      features = cleanHtml(parts[1]);
    } else {
      desc = cleanHtml(rightCell);
    }

    // Clean title out of desc if present
    if (title && desc.startsWith(title)) {
      desc = desc.slice(title.length).trim();
    }
    desc = desc.replace(/^[«"'\s.–-]+/, '').trim();

    if (!title && desc) {
      title = desc.split('.')[0];
    }

    signs.push({
      num,
      title: title || `Знак ${num}`,
      titleKk: title || `Знак ${num}`,
      desc: desc || title,
      features: features || '',
      imgUrl,
      group: sec.id,
      groupTitle: sec.groupTitle,
      groupTitleKk: sec.groupTitleKk
    });
  }

  console.log(`Found ${signs.length} signs in group ${sec.id}`);
  return signs;
}

async function main() {
  const assetsDir = path.join(__dirname, '../assets/signs');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  let allSigns = [];
  for (const sec of SECTIONS) {
    const signs = await scrapeSection(sec);
    allSigns = allSigns.concat(signs);
  }

  console.log(`Total scraped signs: ${allSigns.length}`);

  // Download all images locally and store as base64 or local paths
  console.log('Downloading sign images...');
  for (let i = 0; i < allSigns.length; i++) {
    const s = allSigns[i];
    if (s.imgUrl && s.imgUrl.startsWith('http')) {
      const safeNum = s.num.replace(/[^a-zA-Z0-9.-]/g, '_');
      const ext = path.extname(s.imgUrl.split('?')[0]) || '.png';
      const filename = `sign_${s.group}_${safeNum}${ext}`;
      const localFile = path.join(assetsDir, filename);

      try {
        if (!fs.existsSync(localFile)) {
          await downloadImage(s.imgUrl, localFile);
          console.log(`[${i + 1}/${allSigns.length}] Downloaded: ${filename}`);
        }
        s.localImage = filename;
        // Convert to data URI for offline PWA inclusion
        const imgBuffer = fs.readFileSync(localFile);
        s.dataUri = `data:image/png;base64,${imgBuffer.toString('base64')}`;
      } catch (err) {
        console.error(`Failed to download image for ${s.num}:`, err.message);
      }
    }
  }

  fs.writeFileSync('tools/signs_24pdd_dataset.json', JSON.stringify(allSigns, null, 2));
  console.log('Saved rich dataset to tools/signs_24pdd_dataset.json');
}

main().catch(console.error);
