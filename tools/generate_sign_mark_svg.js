const fs = require('fs');
const path = require('path');

// Test programmatic SVG generator for all signs and markings
function getSignSvg(num, title, group) {
  num = (num || '').trim();
  group = (group || '').trim();

  // 2.1 Главная дорога
  if (num === '2.1') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="4"/><rect x="16" y="16" width="28" height="28" rx="2" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#1A1A1A" stroke-width="1.5"/></svg>`;
  }
  // 2.2 Конец главной дороги
  if (num === '2.2') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#E0E0E0" stroke="#FFFFFF" stroke-width="4"/><line x1="12" y1="12" x2="48" y2="48" stroke="#1A1A1A" stroke-width="4"/></svg>`;
  }
  // 2.4 Уступите дорогу
  if (num === '2.4') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><polygon points="30,52 6,10 54,10" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/></svg>`;
  }
  // 2.5 STOP (Движение без остановки запрещено)
  if (num === '2.5') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><polygon points="19,6 41,6 54,19 54,41 41,54 19,54 6,41 6,19" fill="#D83025" stroke="#FFFFFF" stroke-width="2"/><text x="30" y="36" fill="#FFFFFF" font-family="Source Sans 3, Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">STOP</text></svg>`;
  }
  // 3.1 Въезд запрещен ("Кирпич")
  if (num === '3.1') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="26" fill="#D83025"/><rect x="14" y="25" width="32" height="10" rx="1.5" fill="#FFFFFF"/></svg>`;
  }
  // 3.27 Остановка запрещена
  if (num === '3.27') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="26" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="12" y1="12" x2="48" y2="48" stroke="#D83025" stroke-width="5"/><line x1="48" y1="12" x2="12" y2="48" stroke="#D83025" stroke-width="5"/></svg>`;
  }
  // 3.28 Стоянка запрещена
  if (num === '3.28') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="26" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="48" y1="12" x2="12" y2="48" stroke="#D83025" stroke-width="5"/></svg>`;
  }
  // 3.24 Ограничение максимальной скорости
  if (num.startsWith('3.24')) {
    const sp = num.split('(')[1] ? num.split('(')[1].replace(')', '') : '50';
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="26" fill="#FFFFFF" stroke="#D83025" stroke-width="6"/><text x="30" y="38" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="18" font-weight="900" text-anchor="middle">${sp || '50'}</text></svg>`;
  }
  // 5.1 Автомагистраль
  if (num === '5.1') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="6" y="6" width="48" height="48" rx="4" fill="#2E7D32"/><line x1="20" y1="48" x2="20" y2="12" stroke="#FFFFFF" stroke-width="3"/><line x1="40" y1="48" x2="40" y2="12" stroke="#FFFFFF" stroke-width="3"/><rect x="14" y="24" width="32" height="5" fill="#FFFFFF"/><line x1="14" y1="36" x2="46" y2="36" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3 3"/></svg>`;
  }
  // 5.16.1 / 5.16.2 Пешеходный переход
  if (num.startsWith('5.16')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="6" y="6" width="48" height="48" rx="4" fill="#1565C0"/><polygon points="30,12 48,46 12,46" fill="#FFFFFF"/><line x1="18" y1="42" x2="42" y2="42" stroke="#1565C0" stroke-width="2"/><circle cx="30" cy="22" r="3.5" fill="#1565C0"/><path d="M30 25 L30 35 L35 43 M30 31 L24 37" stroke="#1565C0" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`;
  }
  // 5.5 Дорога с односторонним движением
  if (num === '5.5') {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="6" y="6" width="48" height="48" rx="4" fill="#1565C0"/><line x1="30" y1="46" x2="30" y2="16" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/><polygon points="30,10 20,24 40,24" fill="#FFFFFF"/></svg>`;
  }

  // Generic 1.x (Предупреждающие - красный треугольник)
  if (group === '1' || num.startsWith('1.')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><circle cx="30" cy="38" r="3" fill="#1A1A1A"/><rect x="28" y="24" width="4" height="10" rx="1" fill="#1A1A1A"/></svg>`;
  }

  // Generic 2.x (Приоритет)
  if (group === '2' || num.startsWith('2.')) {
    if (num.startsWith('2.3')) {
      return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><line x1="30" y1="46" x2="30" y2="18" stroke="#1A1A1A" stroke-width="4"/><line x1="20" y1="32" x2="40" y2="32" stroke="#1A1A1A" stroke-width="2.5"/></svg>`;
    }
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="4"/></svg>`;
  }

  // Generic 3.x (Запрещающие - красный круг)
  if (group === '3' || num.startsWith('3.')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="26" fill="#FFFFFF" stroke="#D83025" stroke-width="6"/><line x1="12" y1="48" x2="48" y2="12" stroke="#D83025" stroke-width="4"/><circle cx="30" cy="30" r="8" fill="none" stroke="#1A1A1A" stroke-width="2"/></svg>`;
  }

  // Generic 4.x (Предписывающие - синий круг)
  if (group === '4' || num.startsWith('4.')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="26" fill="#1565C0"/><line x1="30" y1="44" x2="30" y2="18" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><polygon points="30,12 22,24 38,24" fill="#FFFFFF"/></svg>`;
  }

  // Generic 5.x (Информационно-указательные - синий квадрат)
  if (group === '5' || num.startsWith('5.')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="6" y="6" width="48" height="48" rx="4" fill="#1565C0"/><rect x="14" y="14" width="32" height="32" rx="2" fill="none" stroke="#FFFFFF" stroke-width="2"/><text x="30" y="35" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" text-anchor="middle">${num.slice(0, 4)}</text></svg>`;
  }

  // Generic 6.x (Знаки сервиса - синий прямоугольник с белым полем)
  if (group === '6' || num.startsWith('6.')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="8" y="4" width="44" height="52" rx="4" fill="#1565C0"/><rect x="14" y="10" width="32" height="32" rx="2" fill="#FFFFFF"/><rect x="24" y="20" width="12" height="12" rx="1" fill="#D83025"/></svg>`;
  }

  // Generic 7.x (Таблички - белый прямоугольник)
  if (group === '7' || num.startsWith('7.')) {
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="4" y="14" width="52" height="32" rx="3" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2"/><text x="30" y="34" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600" text-anchor="middle">${num}</text></svg>`;
  }

  // Generic 8.x (Опознавательные знаки)
  if (group === '8' || num.startsWith('ОЗ')) {
    if (num === 'ОЗ-2') { // Шипы
      return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><text x="30" y="44" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle">Ш</text></svg>`;
    }
    if (num === 'ОЗ-5') { // Учебное
      return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><text x="30" y="44" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle">У</text></svg>`;
    }
    if (num === 'ОЗ-10' || num === 'ОЗ-4') { // Инвалид / глухой
      return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="8" y="8" width="44" height="44" rx="4" fill="#FFD54F" stroke="#1A1A1A" stroke-width="2"/><circle cx="30" cy="22" r="4" fill="#1A1A1A"/><circle cx="20" cy="36" r="4" fill="#1A1A1A"/><circle cx="40" cy="36" r="4" fill="#1A1A1A"/></svg>`;
    }
    return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="8" y="8" width="44" height="44" rx="4" fill="#FFD54F" stroke="#D83025" stroke-width="3"/><text x="30" y="34" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${num}</text></svg>`;
  }

  // Fallback default
  return `<svg class="sign-graphic" viewBox="0 0 60 60" width="56" height="56"><rect x="8" y="8" width="44" height="44" rx="6" fill="#1565C0"/><text x="30" y="35" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" text-anchor="middle">${num}</text></svg>`;
}

// Test programmatic SVG generator for markings
function getMarkingSvg(num, group) {
  num = (num || '').trim();
  group = (group || '').trim();

  // Vertical markings (2.1-2.7)
  if (group === 'v' || num.startsWith('2.')) {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><polygon points="0,0 20,0 0,48" fill="#FFFFFF"/><polygon points="25,0 45,0 5,48" fill="#FFFFFF"/><polygon points="50,0 70,0 30,48" fill="#FFFFFF"/><polygon points="75,0 95,0 55,48" fill="#FFFFFF"/><polygon points="100,0 100,20 80,48 100,48" fill="#FFFFFF"/></svg>`;
  }

  // 1.1 Сплошная
  if (num === '1.1') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="4"/></svg>`;
  }
  // 1.3 Двойная сплошная
  if (num === '1.3') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="20" x2="100" y2="20" stroke="#FFFFFF" stroke-width="3"/><line x1="0" y1="28" x2="100" y2="28" stroke="#FFFFFF" stroke-width="3"/></svg>`;
  }
  // 1.4 Желтая сплошная
  if (num === '1.4') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="8" x2="100" y2="8" stroke="#FFD54F" stroke-width="5"/></svg>`;
  }
  // 1.5 Прерывистая
  if (num === '1.5') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="10 16"/></svg>`;
  }
  // 1.6 Линия приближения
  if (num === '1.6') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="20 6"/></svg>`;
  }
  // 1.10 Желтая прерывистая
  if (num === '1.10') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="8" x2="100" y2="8" stroke="#FFD54F" stroke-width="5" stroke-dasharray="16 10"/></svg>`;
  }
  // 1.11 Сплошная с прерывистой
  if (num === '1.11') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="20" x2="100" y2="20" stroke="#FFFFFF" stroke-width="3"/><line x1="0" y1="28" x2="100" y2="28" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="12 8"/></svg>`;
  }
  // 1.12 Стоп-линия
  if (num === '1.12') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="28" y1="0" x2="28" y2="48" stroke="#FFFFFF" stroke-width="8"/><text x="65" y="28" fill="#FFFFFF" font-family="Source Sans 3, sans-serif" font-size="10" font-weight="700">STOP</text></svg>`;
  }
  // 1.14 Зебра
  if (num.startsWith('1.14')) {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="15" y1="0" x2="15" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="30" y1="0" x2="30" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="45" y1="0" x2="45" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="60" y1="0" x2="60" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="75" y1="0" x2="75" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="90" y1="0" x2="90" y2="48" stroke="#FFFFFF" stroke-width="6"/></svg>`;
  }
  // 1.17 Зигзаг
  if (num === '1.17') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><path d="M5 8 L20 38 L35 8 L50 38 L65 8 L80 38 L95 8" stroke="#FFD54F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  }
  // 1.23 Выделенная полоса А
  if (num === '1.23') {
    return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><text x="50" y="34" fill="#FFFFFF" font-family="Source Serif 4, Georgia, serif" font-size="26" font-weight="700" text-anchor="middle">А</text></svg>`;
  }

  // Generic horizontal
  return `<svg class="mark-graphic" viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 10"/></svg>`;
}

console.log('Sample sign 2.1 SVG:', getSignSvg('2.1', 'Главная дорога', '2'));
console.log('Sample mark 1.14 SVG:', getMarkingSvg('1.14.1', 'h'));
