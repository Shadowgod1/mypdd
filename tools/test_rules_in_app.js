const { loadApp } = require('./validate');
const app = loadApp();

console.log('Testing app with rules section...');
console.log('RULES_DATA length:', app.RULES_DATA ? app.RULES_DATA.length : 'undefined');

// Test search function
const res1 = app.searchRules('140');
console.log('Search "140":', res1.length, 'results');
if (res1.length) console.log('Sample:', res1[0].chapterTitle, '->', res1[0].paragraph.text.slice(0, 100));

const res2 = app.searchRules('буксировка');
console.log('Search "буксировка":', res2.length, 'results');

const res3 = app.searchRules('самокат');
console.log('Search "самокат":', res3.length, 'results');

const res4 = app.searchRules('люфт');
console.log('Search "люфт":', res4.length, 'results');

console.log('All tests completed successfully!');
