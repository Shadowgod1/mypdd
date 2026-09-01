const fs = require('fs');
const signs = JSON.parse(fs.readFileSync('tools/signs_dataset.json', 'utf8'));

console.log('Total signs:', signs.length);

// Check sample of signs
signs.slice(0, 20).forEach(s => {
  console.log(`[${s.num}] Title: "${s.title}" | Desc: "${s.desc.slice(0, 60)}..."`);
});

// Map of real SVG symbol IDs to sign numbers
const symbolMap = {
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
  '3.24 (20)': 'sg-sp20',
  '3.24 (40)': 'sg-sp40',
  '3.24 (50)': 'sg-sp50',
  '3.24 (60)': 'sg-sp60',
  '3.24': 'sg-sp50',
  '3.27': 'sg-noStop',
  '3.28': 'sg-noPark',
  '4.1.1': 'sg-fwdOnly',
  '4.1.2': 'sg-rightOnly',
  '4.3': 'sg-roundabout',
  '5.16.1': 'sg-crosswalk',
  '5.38': 'sg-residential'
};

console.log('\nMatching signs:');
signs.forEach(s => {
  if (symbolMap[s.num] || symbolMap[s.num.split(' ')[0]]) {
    console.log(`  MATCH: [${s.num}] -> ${symbolMap[s.num] || symbolMap[s.num.split(' ')[0]]} (${s.title})`);
  }
});
