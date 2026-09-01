const fs = require('fs');
const path = require('path');

// Complete authentic vector generator for ALL road signs of RK (Order No. 534)
function generateSignVector(num, title, group) {
  num = (num || '').trim();
  title = (title || '').trim();
  group = (group || '').trim();

  const baseNum = num.split(/[-–,]/)[0].trim();

  // Helper primitives
  const triWarning = (innerSvg) => `<svg viewBox="0 0 64 64" width="56" height="56"><polygon points="32,6 58,54 6,54" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/>${innerSvg}</svg>`;
  const circleProhib = (innerSvg) => `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#FFFFFF" stroke="#D83025" stroke-width="6"/>${innerSvg}</svg>`;
  const circleMandatory = (innerSvg) => `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#1565C0"/>${innerSvg}</svg>`;
  const rectInfo = (innerSvg, bg = '#1565C0') => `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="6" y="6" width="52" height="52" rx="4" fill="${bg}"/>${innerSvg}</svg>`;
  const rectService = (innerSvg) => `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="8" y="4" width="48" height="56" rx="4" fill="#1565C0"/><rect x="14" y="10" width="36" height="36" rx="2" fill="#FFFFFF"/>${innerSvg}</svg>`;
  const rectPlate = (innerSvg) => `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="4" y="14" width="56" height="36" rx="3" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2"/>${innerSvg}</svg>`;

  // -------------------------------------------------------------
  // 1. ПРЕДУПРЕЖДАЮЩИЕ ЗНАКИ (1.x)
  // -------------------------------------------------------------
  if (baseNum === '1.1') {
    return triWarning('<path d="M20 44V34H44V44M24 34V44M28 34V44M32 34V44M36 34V44M40 34V44M18 38H46" stroke="#1A1A1A" stroke-width="1.8"/>');
  }
  if (baseNum === '1.2') {
    return triWarning('<path d="M22 46V36H36V46ZM36 36L44 46M24 32H30V36H24ZM26 28H28V32H26Z" fill="#1A1A1A"/><circle cx="27" cy="46" r="3" fill="#1A1A1A"/><circle cx="35" cy="46" r="3" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.3.1') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><line x1="12" y1="20" x2="52" y2="44" stroke="#D83025" stroke-width="6" stroke-linecap="round"/><line x1="12" y1="44" x2="52" y2="20" stroke="#D83025" stroke-width="6" stroke-linecap="round"/><line x1="12" y1="20" x2="52" y2="44" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><line x1="12" y1="44" x2="52" y2="20" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  if (baseNum === '1.3.2') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><line x1="12" y1="18" x2="52" y2="38" stroke="#D83025" stroke-width="5" stroke-linecap="round"/><line x1="12" y1="38" x2="52" y2="18" stroke="#D83025" stroke-width="5" stroke-linecap="round"/><polyline points="14,38 32,48 50,38" fill="none" stroke="#D83025" stroke-width="5" stroke-linecap="round"/></svg>`;
  }
  if (baseNum.startsWith('1.4')) {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="18" y="6" width="28" height="52" rx="2" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5"/><line x1="20" y1="20" x2="44" y2="32" stroke="#D83025" stroke-width="4"/><line x1="20" y1="34" x2="44" y2="46" stroke="#D83025" stroke-width="4"/></svg>`;
  }
  if (baseNum === '1.5') {
    return triWarning('<rect x="22" y="28" width="20" height="16" rx="2" fill="#1A1A1A"/><rect x="25" y="31" width="5" height="5" fill="#FFFFFF"/><rect x="34" y="31" width="5" height="5" fill="#FFFFFF"/><line x1="20" y1="46" x2="44" y2="46" stroke="#1A1A1A" stroke-width="2"/>');
  }
  if (baseNum === '1.6') {
    return triWarning('<line x1="22" y1="28" x2="42" y2="48" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><line x1="42" y1="28" x2="22" y2="48" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>');
  }
  if (baseNum === '1.7') {
    return triWarning('<path d="M32 26 A8 8 0 1 1 24 34" fill="none" stroke="#1A1A1A" stroke-width="3"/><polygon points="26,24 34,26 28,30" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.8') {
    return triWarning('<rect x="27" y="24" width="10" height="24" rx="3" fill="#1A1A1A"/><circle cx="32" cy="28" r="3" fill="#D83025"/><circle cx="32" cy="36" r="3" fill="#FFD54F"/><circle cx="32" cy="44" r="3" fill="#2E7D32"/>');
  }
  if (baseNum === '1.9') {
    return triWarning('<line x1="18" y1="42" x2="46" y2="42" stroke="#1565C0" stroke-width="3"/><line x1="18" y1="40" x2="30" y2="30" stroke="#1A1A1A" stroke-width="3"/><line x1="34" y1="36" x2="46" y2="40" stroke="#1A1A1A" stroke-width="3"/>');
  }
  if (baseNum === '1.10') {
    return triWarning('<path d="M18 42 H46 M20 46 H46" stroke="#1565C0" stroke-width="2"/><path d="M22 34 L32 26 L38 32 L34 38 Z" fill="#1A1A1A"/>');
  }
  if (baseNum.startsWith('1.11')) {
    const isRight = baseNum.endsWith('1') || title.includes('направо');
    return triWarning(isRight ?
      '<path d="M24 46 V36 Q24 28 34 28 H38" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><polygon points="36,23 44,28 36,33" fill="#1A1A1A"/>' :
      '<path d="M40 46 V36 Q40 28 30 28 H26" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><polygon points="28,23 20,28 28,33" fill="#1A1A1A"/>');
  }
  if (baseNum.startsWith('1.12')) {
    return triWarning('<path d="M24 46 V38 Q24 32 32 32 Q40 32 40 26 V22" fill="none" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round"/><polygon points="36,24 40,18 44,24" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.13' || baseNum === '1.14') {
    return triWarning('<polygon points="20,44 44,32 44,44" fill="#1A1A1A"/><text x="32" y="40" fill="#FFFFFF" font-family="sans-serif" font-size="7" font-weight="900" text-anchor="middle">10%</text>');
  }
  if (baseNum === '1.15') {
    return triWarning('<path d="M26 30 Q38 34 32 44 M38 30 Q26 34 32 44" fill="none" stroke="#1A1A1A" stroke-width="2"/><rect x="26" y="24" width="12" height="6" rx="2" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.16' || baseNum === '1.16.1') {
    return triWarning('<path d="M18 42 Q25 32 32 42 Q39 32 46 42" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>');
  }
  if (baseNum === '1.17') {
    return triWarning('<path d="M22 34 L36 30 L38 36 Z" fill="#1A1A1A"/><circle cx="20" cy="42" r="1.5" fill="#1A1A1A"/><circle cx="24" cy="44" r="2" fill="#1A1A1A"/><circle cx="44" cy="42" r="2" fill="#1A1A1A"/>');
  }
  if (baseNum.startsWith('1.18')) {
    return triWarning('<line x1="22" y1="46" x2="26" y2="24" stroke="#1A1A1A" stroke-width="3"/><line x1="42" y1="46" x2="38" y2="24" stroke="#1A1A1A" stroke-width="3"/>');
  }
  if (baseNum === '1.19') {
    return triWarning('<line x1="26" y1="44" x2="26" y2="26" stroke="#1A1A1A" stroke-width="3"/><polygon points="22,30 26,22 30,30" fill="#1A1A1A"/><line x1="38" y1="24" x2="38" y2="42" stroke="#1A1A1A" stroke-width="3"/><polygon points="34,38 38,46 42,38" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.20') {
    return triWarning('<circle cx="32" cy="24" r="3" fill="#1A1A1A"/><path d="M32 27 L32 37 L38 46 M32 33 L26 41 M28 31 L36 31" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" fill="none"/><line x1="20" y1="48" x2="44" y2="48" stroke="#1A1A1A" stroke-width="2"/>');
  }
  if (baseNum === '1.21') {
    return triWarning('<circle cx="27" cy="24" r="2.5" fill="#1A1A1A"/><circle cx="37" cy="27" r="2" fill="#1A1A1A"/><path d="M27 27 L27 36 L32 44 M27 32 L22 39 M37 29 L37 36 L41 42" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" fill="none"/>');
  }
  if (baseNum === '1.22') {
    return triWarning('<circle cx="24" cy="38" r="4" fill="none" stroke="#1A1A1A" stroke-width="1.8"/><circle cx="40" cy="38" r="4" fill="none" stroke="#1A1A1A" stroke-width="1.8"/><path d="M24 38 L32 30 L40 38 M32 30 L32 38" stroke="#1A1A1A" stroke-width="1.8" fill="none"/>');
  }
  if (baseNum === '1.23') {
    return triWarning('<circle cx="30" cy="24" r="3" fill="#1A1A1A"/><path d="M30 27 L30 38 L36 46 M30 33 L24 42 M30 33 L40 38" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" fill="none"/><line x1="38" y1="36" x2="44" y2="46" stroke="#1A1A1A" stroke-width="2"/>');
  }
  if (baseNum === '1.24' || baseNum === '1.25') {
    return triWarning('<path d="M22 36 Q26 28 34 32 Q40 28 42 34 L40 42 L36 42 L34 38 L28 38 L26 44 Z" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.26') {
    return triWarning('<polygon points="20,44 26,28 34,44" fill="#1A1A1A"/><circle cx="38" cy="36" r="2" fill="#1A1A1A"/><circle cx="42" cy="42" r="2.5" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.27') {
    return triWarning('<path d="M22 32 L42 26 L42 38 L22 34 Z" fill="#D83025"/><line x1="22" y1="26" x2="22" y2="44" stroke="#1A1A1A" stroke-width="2.5"/>');
  }
  if (baseNum === '1.28') {
    return triWarning('<path d="M32 20 L34 32 L44 36 L44 38 L34 37 L34 42 L37 44 L37 46 L32 45 L27 46 L27 44 L30 42 L30 37 L20 38 L20 36 L30 32 Z" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.29') {
    return triWarning('<path d="M22 44 V32 Q22 24 32 24 Q42 24 42 32 V44 Z" fill="#1A1A1A"/>');
  }
  if (baseNum === '1.30') {
    return triWarning('<line x1="32" y1="22" x2="32" y2="36" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="43" r="2.5" fill="#1A1A1A"/>');
  }
  if (baseNum.startsWith('1.31')) {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="6" y="20" width="52" height="24" rx="2" fill="#D83025"/><polygon points="12,24 24,32 12,40" fill="#FFFFFF"/><polygon points="26,24 38,32 26,40" fill="#FFFFFF"/><polygon points="40,24 52,32 40,40" fill="#FFFFFF"/></svg>`;
  }

  // -------------------------------------------------------------
  // 2. ЗНАКИ ПРИОРИТЕТА (2.x)
  // -------------------------------------------------------------
  if (baseNum === '2.1') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="12" y="12" width="40" height="40" rx="3" transform="rotate(45 32 32)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="5"/><rect x="18" y="18" width="28" height="28" rx="2" transform="rotate(45 32 32)" fill="#FFD54F" stroke="#1A1A1A" stroke-width="1.5"/></svg>`;
  }
  if (baseNum === '2.2') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="12" y="12" width="40" height="40" rx="3" transform="rotate(45 32 32)" fill="#E0E0E0" stroke="#FFFFFF" stroke-width="5"/><line x1="14" y1="14" x2="50" y2="50" stroke="#1A1A1A" stroke-width="4"/></svg>`;
  }
  if (baseNum.startsWith('2.3')) {
    return triWarning('<line x1="32" y1="46" x2="32" y2="20" stroke="#1A1A1A" stroke-width="5"/><line x1="22" y1="32" x2="42" y2="32" stroke="#1A1A1A" stroke-width="3"/>');
  }
  if (baseNum === '2.4') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><polygon points="32,56 6,10 58,10" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/></svg>`;
  }
  if (baseNum === '2.5') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><polygon points="20,6 44,6 58,20 58,44 44,58 20,58 6,44 6,20" fill="#D83025" stroke="#FFFFFF" stroke-width="2"/><text x="32" y="38" fill="#FFFFFF" font-family="Source Sans 3, Arial, sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="1">STOP</text></svg>`;
  }
  if (baseNum === '2.6') {
    return circleProhib('<line x1="26" y1="44" x2="26" y2="20" stroke="#D83025" stroke-width="4"/><polygon points="21,26 26,18 31,26" fill="#D83025"/><line x1="38" y1="20" x2="38" y2="44" stroke="#1A1A1A" stroke-width="4"/><polygon points="33,38 38,46 43,38" fill="#1A1A1A"/>');
  }
  if (baseNum === '2.7') {
    return rectInfo('<line x1="26" y1="44" x2="26" y2="20" stroke="#D83025" stroke-width="4"/><polygon points="21,26 26,18 31,26" fill="#D83025"/><line x1="38" y1="20" x2="38" y2="44" stroke="#FFFFFF" stroke-width="4"/><polygon points="33,38 38,46 43,38" fill="#FFFFFF"/>');
  }

  // -------------------------------------------------------------
  // 3. ЗАПРЕЩАЮЩИЕ ЗНАКИ (3.x)
  // -------------------------------------------------------------
  if (baseNum === '3.1') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#D83025"/><rect x="16" y="27" width="32" height="10" rx="1.5" fill="#FFFFFF"/></svg>`;
  }
  if (baseNum === '3.2') {
    return circleProhib('');
  }
  if (baseNum === '3.3') {
    return circleProhib('<rect x="22" y="28" width="20" height="10" rx="2" fill="#1A1A1A"/><circle cx="26" cy="38" r="3" fill="#1A1A1A"/><circle cx="38" cy="38" r="3" fill="#1A1A1A"/>');
  }
  if (baseNum === '3.4') {
    return circleProhib('<rect x="20" y="28" width="16" height="10" fill="#1A1A1A"/><rect x="36" y="31" width="8" height="7" fill="#1A1A1A"/><circle cx="24" cy="38" r="2.5" fill="#1A1A1A"/><circle cx="40" cy="38" r="2.5" fill="#1A1A1A"/>');
  }
  if (baseNum === '3.5') {
    return circleProhib('<circle cx="24" cy="36" r="3" fill="#1A1A1A"/><circle cx="40" cy="36" r="3" fill="#1A1A1A"/><path d="M24 36 L30 28 L36 36" stroke="#1A1A1A" stroke-width="2"/>');
  }
  if (baseNum === '3.6') {
    return circleProhib('<circle cx="26" cy="36" r="4" fill="#1A1A1A"/><circle cx="40" cy="38" r="2" fill="#1A1A1A"/><rect x="28" y="28" width="10" height="8" fill="#1A1A1A"/>');
  }
  if (baseNum === '3.7') {
    return circleProhib('<rect x="22" y="30" width="20" height="10" fill="#1A1A1A"/><circle cx="32" cy="40" r="2.5" fill="#1A1A1A"/>');
  }
  if (baseNum === '3.8') {
    return circleProhib('<path d="M22 36 H38 L42 30" stroke="#1A1A1A" stroke-width="2"/><circle cx="26" cy="40" r="3" fill="#1A1A1A"/><circle cx="36" cy="40" r="3" fill="#1A1A1A"/>');
  }
  if (baseNum === '3.9') {
    return circleProhib('<circle cx="24" cy="36" r="3.5" fill="none" stroke="#1A1A1A" stroke-width="1.8"/><circle cx="40" cy="36" r="3.5" fill="none" stroke="#1A1A1A" stroke-width="1.8"/><path d="M24 36 L32 29 L40 36 M32 29 L32 36" stroke="#1A1A1A" stroke-width="1.8" fill="none"/>');
  }
  if (baseNum === '3.10') {
    return circleProhib('<circle cx="32" cy="24" r="3" fill="#1A1A1A"/><path d="M32 27 L32 38 L37 46 M32 33 L27 41" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" fill="none"/><line x1="16" y1="48" x2="48" y2="16" stroke="#D83025" stroke-width="4"/>');
  }
  if (baseNum.startsWith('3.11') || baseNum.startsWith('3.12') || baseNum.startsWith('3.13') || baseNum.startsWith('3.14') || baseNum.startsWith('3.15')) {
    const val = baseNum === '3.11' ? '7 т' : (baseNum === '3.12' ? '6 т' : (baseNum === '3.13' ? '3,5 м' : (baseNum === '3.14' ? '2,7 м' : '10 м')));
    return circleProhib(`<text x="32" y="36" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="12" font-weight="900" text-anchor="middle">${val}</text>`);
  }
  if (baseNum === '3.16') {
    return circleProhib('<rect x="18" y="30" width="8" height="6" fill="#1A1A1A"/><rect x="38" y="30" width="8" height="6" fill="#1A1A1A"/><text x="32" y="36" fill="#1A1A1A" font-family="sans-serif" font-size="8" font-weight="900" text-anchor="middle">70m</text>');
  }
  if (baseNum.startsWith('3.17')) {
    const txt = baseNum === '3.17.1' ? 'ТАМОЖНЯ' : (baseNum === '3.17.2' ? 'ОПАСНОСТЬ' : 'СТОП');
    return circleProhib(`<rect x="14" y="29" width="36" height="6" fill="#1A1A1A"/><text x="32" y="26" fill="#1A1A1A" font-family="sans-serif" font-size="6" font-weight="900" text-anchor="middle">КЕДЕН</text><text x="32" y="42" fill="#1A1A1A" font-family="sans-serif" font-size="6" font-weight="900" text-anchor="middle">${txt}</text>`);
  }
  if (baseNum === '3.18.1') {
    return circleProhib('<path d="M26 44 V34 Q26 26 36 26 H40" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><polygon points="38,21 46,26 38,31" fill="#1A1A1A"/><line x1="16" y1="48" x2="48" y2="16" stroke="#D83025" stroke-width="4"/>');
  }
  if (baseNum === '3.18.2') {
    return circleProhib('<path d="M38 44 V34 Q38 26 28 26 H24" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><polygon points="26,21 18,26 26,31" fill="#1A1A1A"/><line x1="16" y1="48" x2="48" y2="16" stroke="#D83025" stroke-width="4"/>');
  }
  if (baseNum === '3.19') {
    return circleProhib('<path d="M38 44 V30 Q38 22 30 22 Q22 22 22 30 V38" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/><polygon points="18,34 22,42 26,34" fill="#1A1A1A"/><line x1="16" y1="48" x2="48" y2="16" stroke="#D83025" stroke-width="4"/>');
  }
  if (baseNum === '3.20') {
    return circleProhib('<rect x="20" y="30" width="10" height="6" rx="1.5" fill="#D83025"/><rect x="34" y="30" width="10" height="6" rx="1.5" fill="#1A1A1A"/><circle cx="23" cy="36" r="1.5" fill="#D83025"/><circle cx="27" cy="36" r="1.5" fill="#D83025"/><circle cx="37" cy="36" r="1.5" fill="#1A1A1A"/><circle cx="41" cy="36" r="1.5" fill="#1A1A1A"/>');
  }
  if (baseNum === '3.21') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5"/><line x1="18" y1="46" x2="46" y2="18" stroke="#1A1A1A" stroke-width="2"/><line x1="22" y1="48" x2="48" y2="22" stroke="#1A1A1A" stroke-width="2"/></svg>`;
  }
  if (baseNum === '3.22') {
    return circleProhib('<rect x="18" y="28" width="12" height="7" fill="#D83025"/><rect x="34" y="30" width="10" height="5" fill="#1A1A1A"/>');
  }
  if (baseNum.startsWith('3.24')) {
    const sp = num.match(/\d+/g) ? num.match(/\d+/g)[1] || '50' : '50';
    return circleProhib(`<text x="32" y="40" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="19" font-weight="900" text-anchor="middle">${sp}</text>`);
  }
  if (baseNum === '3.25') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5"/><line x1="18" y1="46" x2="46" y2="18" stroke="#1A1A1A" stroke-width="2"/><text x="32" y="38" fill="#1A1A1A" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">50</text></svg>`;
  }
  if (baseNum === '3.26') {
    return circleProhib('<path d="M22 30 H28 L36 24 V40 L28 34 H22 Z" fill="#1A1A1A"/><line x1="16" y1="48" x2="48" y2="16" stroke="#D83025" stroke-width="4"/>');
  }
  if (baseNum === '3.27') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="14" y1="50" x2="50" y2="14" stroke="#D83025" stroke-width="5"/><line x1="50" y1="50" x2="14" y2="14" stroke="#D83025" stroke-width="5"/></svg>`;
  }
  if (baseNum === '3.28') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="50" y1="14" x2="14" y2="50" stroke="#D83025" stroke-width="5"/></svg>`;
  }
  if (baseNum === '3.29') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="32" y1="20" x2="32" y2="44" stroke="#FFFFFF" stroke-width="4"/><line x1="50" y1="14" x2="14" y2="50" stroke="#D83025" stroke-width="5"/></svg>`;
  }
  if (baseNum === '3.30') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="28" y1="20" x2="28" y2="44" stroke="#FFFFFF" stroke-width="4"/><line x1="36" y1="20" x2="36" y2="44" stroke="#FFFFFF" stroke-width="4"/><line x1="50" y1="14" x2="14" y2="50" stroke="#D83025" stroke-width="5"/></svg>`;
  }
  if (baseNum === '3.31') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5"/><line x1="18" y1="46" x2="46" y2="18" stroke="#1A1A1A" stroke-width="3"/><line x1="22" y1="48" x2="48" y2="22" stroke="#1A1A1A" stroke-width="3"/><line x1="14" y1="44" x2="44" y2="14" stroke="#1A1A1A" stroke-width="3"/></svg>`;
  }
  if (baseNum === '3.34') {
    return circleProhib('<path d="M24 40 L34 40 M28 40 L34 26 L38 26" stroke="#1A1A1A" stroke-width="2.5" fill="none"/><circle cx="24" cy="40" r="2.5" fill="#1A1A1A"/><circle cx="34" cy="40" r="2.5" fill="#1A1A1A"/><line x1="16" y1="48" x2="48" y2="16" stroke="#D83025" stroke-width="4"/>');
  }

  // -------------------------------------------------------------
  // 4. ПРЕДПИСЫВАЮЩИЕ ЗНАКИ (4.x)
  // -------------------------------------------------------------
  if (baseNum === '4.1.1') {
    return circleMandatory('<line x1="32" y1="48" x2="32" y2="20" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><polygon points="24,24 32,14 40,24" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.1.2') {
    return circleMandatory('<path d="M26 48 V34 Q26 26 34 26 H40" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><polygon points="36,18 48,26 36,34" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.1.3') {
    return circleMandatory('<path d="M38 48 V34 Q38 26 30 26 H24" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><polygon points="28,18 16,26 28,34" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.1.4') {
    return circleMandatory('<line x1="32" y1="48" x2="32" y2="20" stroke="#FFFFFF" stroke-width="4"/><polygon points="26,24 32,14 38,24" fill="#FFFFFF"/><path d="M32 40 Q32 30 40 30 H44" fill="none" stroke="#FFFFFF" stroke-width="4"/><polygon points="42,24 50,30 42,36" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.1.5') {
    return circleMandatory('<line x1="32" y1="48" x2="32" y2="20" stroke="#FFFFFF" stroke-width="4"/><polygon points="26,24 32,14 38,24" fill="#FFFFFF"/><path d="M32 40 Q32 30 24 30 H20" fill="none" stroke="#FFFFFF" stroke-width="4"/><polygon points="22,24 14,30 22,36" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.1.6') {
    return circleMandatory('<path d="M32 48 V36 Q32 26 22 26 H18" fill="none" stroke="#FFFFFF" stroke-width="4"/><polygon points="20,20 12,26 20,32" fill="#FFFFFF"/><path d="M32 48 V36 Q32 26 42 26 H46" fill="none" stroke="#FFFFFF" stroke-width="4"/><polygon points="44,20 52,26 44,32" fill="#FFFFFF"/>');
  }
  if (baseNum.startsWith('4.2')) {
    const isR = baseNum === '4.2.1';
    return circleMandatory(isR ?
      '<line x1="22" y1="22" x2="42" y2="42" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><polygon points="34,44 44,44 44,34" fill="#FFFFFF"/>' :
      '<line x1="42" y1="22" x2="22" y2="42" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><polygon points="30,44 20,44 20,34" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.3') {
    return circleMandatory('<path d="M32 18 A14 14 0 1 1 18 32" fill="none" stroke="#FFFFFF" stroke-width="4"/><polygon points="30,12 40,18 32,24" fill="#FFFFFF"/><polygon points="12,34 18,24 24,32" fill="#FFFFFF"/>');
  }
  if (baseNum === '4.4') {
    return circleMandatory('<circle cx="24" cy="36" r="4" fill="none" stroke="#FFFFFF" stroke-width="2"/><circle cx="40" cy="36" r="4" fill="none" stroke="#FFFFFF" stroke-width="2"/><path d="M24 36 L32 28 L40 36 M32 28 L32 36" stroke="#FFFFFF" stroke-width="2" fill="none"/>');
  }
  if (baseNum === '4.5') {
    return circleMandatory('<circle cx="32" cy="22" r="3" fill="#FFFFFF"/><path d="M32 25 L32 36 L37 46 M32 31 L27 40" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none"/>');
  }
  if (baseNum.startsWith('4.6')) {
    return circleMandatory('<text x="32" y="40" fill="#FFFFFF" font-family="Source Sans 3, Arial, sans-serif" font-size="20" font-weight="900" text-anchor="middle">50</text>');
  }
  if (baseNum === '4.7') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="27" fill="#1565C0"/><text x="32" y="40" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">50</text><line x1="14" y1="50" x2="50" y2="14" stroke="#D83025" stroke-width="5"/></svg>`;
  }

  // -------------------------------------------------------------
  // 5. ИНФОРМАЦИОННО-УКАЗАТЕЛЬНЫЕ ЗНАКИ (5.x)
  // -------------------------------------------------------------
  if (baseNum === '5.1' || baseNum === '5.2') {
    const slash = baseNum === '5.2' ? '<line x1="14" y1="50" x2="50" y2="14" stroke="#D83025" stroke-width="5"/>' : '';
    return rectInfo('<line x1="22" y1="50" x2="22" y2="14" stroke="#FFFFFF" stroke-width="4"/><line x1="42" y1="50" x2="42" y2="14" stroke="#FFFFFF" stroke-width="4"/><rect x="16" y="26" width="32" height="6" fill="#FFFFFF"/><line x1="16" y1="38" x2="48" y2="38" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3 3"/>' + slash, '#2E7D32');
  }
  if (baseNum === '5.3') {
    return rectInfo('<rect x="22" y="28" width="20" height="12" rx="2" fill="#FFFFFF"/><circle cx="26" cy="40" r="3" fill="#FFFFFF"/><circle cx="38" cy="40" r="3" fill="#FFFFFF"/>');
  }
  if (baseNum === '5.5') {
    return rectInfo('<line x1="32" y1="48" x2="32" y2="20" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/><polygon points="22,24 32,12 42,24" fill="#FFFFFF"/>');
  }
  if (baseNum === '5.6') {
    return rectInfo('<line x1="32" y1="48" x2="32" y2="20" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/><polygon points="22,24 32,12 42,24" fill="#FFFFFF"/><line x1="14" y1="50" x2="50" y2="14" stroke="#D83025" stroke-width="5"/>');
  }
  if (baseNum.startsWith('5.8')) {
    return rectInfo('<line x1="20" y1="44" x2="20" y2="22" stroke="#FFFFFF" stroke-width="3"/><polygon points="16,24 20,18 24,24" fill="#FFFFFF"/><path d="M44 44 V30 Q44 24 36 24 H32" fill="none" stroke="#FFFFFF" stroke-width="3"/><polygon points="34,20 28,24 34,28" fill="#FFFFFF"/>');
  }
  if (baseNum === '5.9') {
    return rectInfo('<text x="32" y="32" fill="#FFFFFF" font-family="serif" font-size="22" font-weight="900" text-anchor="middle">А</text><line x1="32" y1="48" x2="32" y2="36" stroke="#FFFFFF" stroke-width="4"/><polygon points="26,40 32,48 38,40" fill="#FFFFFF"/>');
  }
  if (baseNum.startsWith('5.11')) {
    return rectInfo('<path d="M38 48 V28 Q38 20 30 20 Q22 20 22 28 V40" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><polygon points="16,36 22,46 28,36" fill="#FFFFFF"/>');
  }
  if (baseNum === '5.12' || baseNum === '5.13') {
    return rectInfo('<rect x="18" y="16" width="28" height="32" fill="#FFFFFF"/><rect x="22" y="22" width="20" height="12" fill="#1565C0"/><circle cx="26" cy="38" r="3" fill="#1565C0"/><circle cx="38" cy="38" r="3" fill="#1565C0"/>');
  }
  if (baseNum === '5.15') {
    return rectInfo('<text x="32" y="44" fill="#FFFFFF" font-family="Source Sans 3, Arial, sans-serif" font-size="36" font-weight="900" text-anchor="middle">Р</text>');
  }
  if (baseNum.startsWith('5.16')) {
    return rectInfo('<polygon points="32,12 50,50 14,50" fill="#FFFFFF"/><line x1="18" y1="46" x2="46" y2="46" stroke="#1565C0" stroke-width="2"/><circle cx="32" cy="24" r="3.5" fill="#1565C0"/><path d="M32 27 L32 37 L37 45 M32 33 L26 39" stroke="#1565C0" stroke-width="2.5" stroke-linecap="round" fill="none"/>');
  }
  if (baseNum.startsWith('5.19')) {
    return rectInfo('<line x1="32" y1="48" x2="32" y2="24" stroke="#FFFFFF" stroke-width="6"/><rect x="22" y="18" width="20" height="7" fill="#D83025"/>');
  }
  if (baseNum === '5.38' || baseNum === '5.39') {
    const slash = baseNum === '5.39' ? '<line x1="14" y1="50" x2="50" y2="14" stroke="#D83025" stroke-width="5"/>' : '';
    return rectInfo('<rect x="16" y="24" width="14" height="20" fill="#FFFFFF"/><polygon points="16,24 23,16 30,24" fill="#FFFFFF"/><circle cx="42" cy="24" r="3" fill="#FFFFFF"/><path d="M42 27 L42 36 L46 44 M42 32 L38 38" stroke="#FFFFFF" stroke-width="2" fill="none"/>' + slash);
  }

  // -------------------------------------------------------------
  // 6. ЗНАКИ СЕРВИСА (6.x)
  // -------------------------------------------------------------
  if (baseNum === '6.1') {
    return rectService('<rect x="28" y="20" width="8" height="16" fill="#D83025"/><rect x="24" y="24" width="16" height="8" fill="#D83025"/>');
  }
  if (baseNum === '6.2') {
    return rectService('<rect x="28" y="18" width="8" height="12" fill="#D83025"/><rect x="24" y="21" width="16" height="6" fill="#D83025"/><rect x="20" y="34" width="24" height="6" fill="#1A1A1A"/>');
  }
  if (baseNum === '6.3') {
    return rectService('<rect x="24" y="20" width="14" height="18" rx="2" fill="#1A1A1A"/><path d="M38 24 H42 V34" stroke="#1A1A1A" stroke-width="2" fill="none"/>');
  }
  if (baseNum === '6.4') {
    return rectService('<path d="M26 22 L38 34 M38 22 L26 34" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>');
  }
  if (baseNum === '6.6') {
    return rectService('<path d="M24 22 C24 34 30 40 40 40 L36 34 L32 36 C30 34 30 34 28 32 L30 28 Z" fill="#1A1A1A"/>');
  }
  if (baseNum === '6.7') {
    return rectService('<line x1="26" y1="18" x2="26" y2="40" stroke="#1A1A1A" stroke-width="3"/><path d="M38 18 V28 H34 V18" fill="none" stroke="#1A1A1A" stroke-width="2"/><line x1="36" y1="28" x2="36" y2="40" stroke="#1A1A1A" stroke-width="3"/>');
  }
  if (baseNum === '6.8') {
    return rectService('<path d="M26 28 H36 V34 H26 Z" fill="#1A1A1A"/><circle cx="31" cy="22" r="3" fill="#1565C0"/>');
  }
  if (baseNum === '6.9') {
    return rectService('<rect x="22" y="24" width="20" height="12" fill="#1A1A1A"/><circle cx="27" cy="20" r="3" fill="#1A1A1A"/>');
  }
  if (baseNum === '6.11') {
    return rectService('<polygon points="32,18 24,36 40,36" fill="#2E7D32"/><rect x="30" y="36" width="4" height="6" fill="#1A1A1A"/>');
  }

  // -------------------------------------------------------------
  // 7. ТАБЛИЧКИ (7.x)
  // -------------------------------------------------------------
  if (baseNum.startsWith('7.1')) {
    return rectPlate('<text x="32" y="36" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="12" font-weight="900" text-anchor="middle">300 м</text>');
  }
  if (baseNum.startsWith('7.2')) {
    return rectPlate('<polygon points="12,32 18,26 18,30 46,30 46,26 52,32 46,38 46,34 18,34 18,38" fill="#1A1A1A"/><text x="32" y="26" fill="#1A1A1A" font-family="sans-serif" font-size="9" font-weight="900" text-anchor="middle">100 м</text>');
  }
  if (baseNum.startsWith('7.3')) {
    return rectPlate('<line x1="16" y1="32" x2="48" y2="32" stroke="#1A1A1A" stroke-width="4"/><polygon points="44,26 52,32 44,38" fill="#1A1A1A"/>');
  }
  if (baseNum === '7.17') {
    return rectPlate('<circle cx="32" cy="24" r="3" fill="#1A1A1A"/><path d="M32 27 V34 H38 M32 34 L28 42" stroke="#1A1A1A" stroke-width="2.5" fill="none"/><circle cx="32" cy="36" r="4.5" fill="none" stroke="#1A1A1A" stroke-width="2"/>');
  }
  if (baseNum === '7.21') {
    return rectPlate('<rect x="16" y="32" width="16" height="8" fill="#1A1A1A"/><path d="M32 26 L46 36" stroke="#1A1A1A" stroke-width="2"/><line x1="38" y1="30" x2="38" y2="36" stroke="#1A1A1A" stroke-width="2"/>');
  }

  // -------------------------------------------------------------
  // 8. ОПОЗНАВАТЕЛЬНЫЕ ЗНАКИ (ОЗ)
  // -------------------------------------------------------------
  if (num === 'ОЗ-2') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><polygon points="32,6 58,54 6,54" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><text x="32" y="46" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="24" font-weight="900" text-anchor="middle">Ш</text></svg>`;
  }
  if (num === 'ОЗ-5') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><polygon points="32,6 58,54 6,54" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><text x="32" y="46" fill="#1A1A1A" font-family="Source Sans 3, Arial, sans-serif" font-size="24" font-weight="900" text-anchor="middle">У</text></svg>`;
  }
  if (num === 'ОЗ-3') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="8" y="8" width="48" height="48" rx="4" fill="#FFD54F" stroke="#D83025" stroke-width="4"/><circle cx="26" cy="24" r="2.5" fill="#1A1A1A"/><circle cx="36" cy="27" r="2" fill="#1A1A1A"/><path d="M26 27 L26 36 L30 42 M36 29 L36 36" stroke="#1A1A1A" stroke-width="2" fill="none"/></svg>`;
  }
  if (num === 'ОЗ-4') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="26" fill="#FFD54F" stroke="#1A1A1A" stroke-width="2"/><circle cx="32" cy="22" r="4.5" fill="#1A1A1A"/><circle cx="22" cy="38" r="4.5" fill="#1A1A1A"/><circle cx="42" cy="38" r="4.5" fill="#1A1A1A"/></svg>`;
  }
  if (num === 'ОЗ-10') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="8" y="8" width="48" height="48" rx="4" fill="#FFD54F" stroke="#1A1A1A" stroke-width="2"/><circle cx="32" cy="22" r="3" fill="#1A1A1A"/><path d="M32 25 V32 H38 M32 32 L28 40" stroke="#1A1A1A" stroke-width="2.5" fill="none"/><circle cx="32" cy="34" r="5" fill="none" stroke="#1A1A1A" stroke-width="2"/></svg>`;
  }
  if (num === 'ОЗ-13') {
    return `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="26" fill="#2E7D32"/><rect x="22" y="28" width="20" height="10" rx="2" fill="#FFFFFF"/><circle cx="26" cy="38" r="3" fill="#FFFFFF"/><circle cx="38" cy="38" r="3" fill="#FFFFFF"/></svg>`;
  }

  // Fallbacks by group with appropriate colors and typography
  if (group === '1' || num.startsWith('1.')) return triWarning(`<text x="32" y="44" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">${baseNum}</text>`);
  if (group === '2' || num.startsWith('2.')) return `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="12" y="12" width="40" height="40" rx="3" transform="rotate(45 32 32)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="5"/><text x="32" y="36" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${baseNum}</text></svg>`;
  if (group === '3' || num.startsWith('3.')) return circleProhib(`<text x="32" y="38" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${baseNum}</text>`);
  if (group === '4' || num.startsWith('4.')) return circleMandatory(`<text x="32" y="38" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${baseNum}</text>`);
  if (group === '5' || num.startsWith('5.')) return rectInfo(`<text x="32" y="38" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${baseNum}</text>`);
  if (group === '6' || num.startsWith('6.')) return rectService(`<text x="32" y="36" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${baseNum}</text>`);
  if (group === '7' || num.startsWith('7.')) return rectPlate(`<text x="32" y="36" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${baseNum}</text>`);

  return rectInfo(`<text x="32" y="38" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">${num}</text>`);
}

module.exports = { generateSignVector };
