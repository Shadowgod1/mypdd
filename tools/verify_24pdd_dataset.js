const fs = require('fs');
const dataset = JSON.parse(fs.readFileSync('tools/signs_24pdd_dataset.json', 'utf8'));

console.log('Total signs in 24pdd dataset:', dataset.length);
console.log('Signs with dataUri:', dataset.filter(s => s.dataUri).length);

// Sample print
dataset.slice(0, 10).forEach(s => {
  console.log(`[${s.num}] ${s.title}`);
  console.log(`  Desc: ${s.desc.slice(0, 70)}...`);
  if (s.features) console.log(`  Features: ${s.features.slice(0, 70)}...`);
  console.log(`  Has image: ${!!s.dataUri}`);
});
