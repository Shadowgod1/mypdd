const fs = require('fs');
const path = require('path');

// 1. Authentic SVG symbols from index.html (verified Wikimedia Commons ГОСТ signs)
const svgSymbolMap = {
  '1.1': 'sg-rwBarrier',
  '1.2': 'sg-rwNoBar',
  '1.6': 'sg-crossWarn',
  '1.15': 'sg-slippery',
  '1.16': 'sg-bump',
  '1.19': 'sg-twoWay',
  '1.21': 'sg-children',
  '2.1': 'sg-main',
  '2.2': 'sg-mainEnd',
  '2.4': 'sg-giveway',
  '2.5': 'sg-stop',
  '3.1': 'sg-noentry',
  '3.2': 'sg-novehicle',
  '3.18.1': 'sg-noRight',
  '3.18.2': 'sg-noLeft',
  '3.20': 'sg-noOvertake',
  '3.24': 'sg-sp50',
  '3.24 (20)': 'sg-sp20',
  '3.24 (40)': 'sg-sp40',
  '3.24 (50)': 'sg-sp50',
  '3.24 (60)': 'sg-sp60',
  '3.27': 'sg-noStop',
  '3.28': 'sg-noPark',
  '4.1.1': 'sg-fwdOnly',
  '4.1.2': 'sg-rightOnly',
  '4.3': 'sg-roundabout',
  '5.16.1': 'sg-crosswalk',
  '5.38': 'sg-residential'
};

// Group definitions
const GROUPS = [
  { id: '1', title: '1. Предупреждающие знаки', titleKk: '1. Ескерту белгілері' },
  { id: '2', title: '2. Знаки приоритета', titleKk: '2. Басымдық белгілері' },
  { id: '3', title: '3. Запрещающие знаки', titleKk: '3. Тыйым салатын белгілер' },
  { id: '4', title: '4. Предписывающие знаки', titleKk: '4. Бұйыру белгілері' },
  { id: '5', title: '5. Информационно-указательные знаки', titleKk: '5. Ақпараттық-нұсқағыш белгілер' },
  { id: '6', title: '6. Знаки сервиса', titleKk: '6. Сервис белгілері' },
  { id: '7', title: '7. Знаки дополнительной информации (таблички)', titleKk: '7. Қосымша ақпарат белгілері (тақтайшалар)' },
  { id: '8', title: '8. Опознавательные знаки транспортных средств', titleKk: '8. Көлік құралдарының айырым белгілері' }
];

const rawText = fs.readFileSync('source/pdd-rk-ru.txt', 'utf8');

// Parse signs from the source text
const lines = rawText.split(/\r?\n/);
let currentGroup = '1';
let inApp1 = false;
let inAppVehicle = false;

const cleanSigns = [];

function cleanTitleText(t) {
  return t
    .replace(/^[,.\s"'-]+/, '')
    .replace(/["']$/g, '')
    .replace(/^Ъукав/i, 'Буква')
    .replace(/^Букав/i, 'Буква')
    .trim();
}

function cleanNumText(n) {
  return n
    .replace(/^[–—\s,]+/, '')
    .replace(/[–—\s,]+$/, '')
    .trim();
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  if (line.includes('1. Дорожные знаки') || line.includes('Приложение 1')) {
    inApp1 = true;
    inAppVehicle = false;
  }
  if (line.includes('ОСНОВНЫЕ ПОЛОЖЕНИЯ') || line.includes('Опознавательные знаки')) {
    inAppVehicle = true;
  }

  // Detect group headers
  if (line.match(/^1\.\s+Предупреждающие знаки/i)) currentGroup = '1';
  else if (line.match(/^2\.\s+Знаки приоритета/i)) currentGroup = '2';
  else if (line.match(/^3\.\s+Запрещающие знаки/i)) currentGroup = '3';
  else if (line.match(/^4\.\s+Предписывающие знаки/i)) currentGroup = '4';
  else if (line.match(/^5\.\s+Информационно-указательные знаки/i)) currentGroup = '5';
  else if (line.match(/^6\.\s+Знаки сервиса/i)) currentGroup = '6';
  else if (line.match(/^7\.\s+Знаки дополнительной информации/i)) currentGroup = '7';

  // Match sign lines like: 1.1 "Железнодорожный переезд со шлагбаумом".
  // or: 1.11.1, 1.11.2 "Опасный поворот".
  // or: 1.4.1 - 1.4.6 "Приближение к железнодорожному переезду".
  const signMatch = line.match(/^(\d+\.\d+(?:\.\d+)?(?:\s*[-–,]\s*\d+\.\d+(?:\.\d+)?)?)\s*["«]([^"»]+)["»]\.?\s*(.*)$/);
  if (signMatch && inApp1 && !inAppVehicle) {
    let num = cleanNumText(signMatch[1]);
    let title = cleanTitleText(signMatch[2]);
    let desc = signMatch[3] || title;

    // Filter out footnote exceptions lines that got matched
    if (title.startsWith('на маршрутные') || title.startsWith('на транспортные') || title.startsWith('на такси')) {
      continue;
    }

    const grp = GROUPS.find(g => g.id === currentGroup) || GROUPS[0];
    const baseNum = num.split(/[-–,]/)[0].trim();
    const svgId = svgSymbolMap[num] || svgSymbolMap[baseNum] || null;

    cleanSigns.push({
      num,
      title,
      titleKk: title, // will be displayed in KK or fallback
      desc: desc || title,
      group: currentGroup,
      groupTitle: grp.title,
      groupTitleKk: grp.titleKk,
      svgId
    });
  }
}

// Add vehicle identification plates
const vehiclePlates = [
  { num: 'ОЗ-1', title: 'Автопоезд', desc: 'Три круглых фонаря оранжевого цвета на крыше кабины грузовых автомобилей и тягачей.', svgId: null },
  { num: 'ОЗ-2', title: 'Шипы', desc: 'Равносторонний треугольник белого цвета вершиной вверх с каймой красного цвета, в который вписана буква «Ш» черного цвета. Устанавливается сзади механических транспортных средств, имеющих ошипованные шины.', svgId: null },
  { num: 'ОЗ-3', title: 'Перевозка детей', desc: 'Квадрат желтого цвета с каймой красного цвета, с изображением символа дорожного знака 1.21. Устанавливается спереди и сзади автобусов при перевозке групп детей.', svgId: null },
  { num: 'ОЗ-4', title: 'Глухой водитель', desc: 'Желтый круг с тремя черными точками. Устанавливается спереди и сзади механических ТС, управляемых глухонемыми или глухими водителями.', svgId: null },
  { num: 'ОЗ-5', title: 'Учебное транспортное средство', desc: 'Равносторонний треугольник белого цвета вершиной вверх с каймой красного цвета, в который вписана буква «У» черного цвета.', svgId: null },
  { num: 'ОЗ-6', title: 'Ограничение скорости', desc: 'Уменьшенное цветное изображение дорожного знака 3.24 с указанием разрешенной скорости. Устанавливается на задней стороне кузова слева.', svgId: null },
  { num: 'ОЗ-7', title: 'Опасный груз', desc: 'Прямоугольник оранжевого цвета со световозвращающей поверхностью, с указанием номера ООН и кода экстренных мер.', svgId: null },
  { num: 'ОЗ-8', title: 'Крупногабаритный груз', desc: 'Щиток с нанесенными по диагонали чередующимися красными и белыми полосами со световозвращающей поверхностью.', svgId: null },
  { num: 'ОЗ-9', title: 'Длинномерное транспортное средство', desc: 'Прямоугольник желтого цвета с каймой красного цвета, устанавливается сзади ТС длиной более 20 м и автопоездов с двумя и более прицепами.', svgId: null },
  { num: 'ОЗ-10', title: 'Инвалид', desc: 'Квадрат желтого цвета с изображением символа дорожного знака 7.17 черного цвета. Устанавливается спереди и сзади ТС, управляемых лицами с инвалидностью I и II групп.', svgId: null },
  { num: 'ОЗ-11', title: 'Врач', desc: 'Квадрат синего цвета с вписанным белым кругом, на который нанесен красный крест.', svgId: null },
  { num: 'ОЗ-12', title: 'Колонна', desc: 'Прямоугольник желтого цвета с каймой красного цвета и надписью «КОЛОННА» черного цвета. Устанавливается спереди и сзади ТС при следовании в колонне.', svgId: null },
  { num: 'ОЗ-13', title: 'Электромобиль', desc: 'Круг зеленого цвета с изображением легкового автомобиля черного цвета и электрического шнура со штепсельной вилкой.', svgId: null }
];

vehiclePlates.forEach(p => {
  cleanSigns.push({
    num: p.num,
    title: p.title,
    titleKk: p.title,
    desc: p.desc,
    group: '8',
    groupTitle: '8. Опознавательные знаки транспортных средств',
    groupTitleKk: '8. Көлік құралдарының айырым белгілері',
    svgId: p.svgId
  });
});

console.log('Cleaned signs count:', cleanSigns.length);
console.log('Signs with authentic SVGs:', cleanSigns.filter(s => s.svgId).length);

// Save to tools/signs_dataset_clean.json
fs.writeFileSync('tools/signs_dataset_clean.json', JSON.stringify(cleanSigns, null, 2));
console.log('Saved to tools/signs_dataset_clean.json');
