const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace searchMarkings
const oldSm = html.slice(html.indexOf('function searchMarkings('), html.indexOf('function screenMarkings('));
const newSm = `function searchMarkings(query, group){
  const q = (query || '').trim().toLowerCase();
  let list = MARKINGS_DATA;
  if(group && group !== 'all'){
    list = list.filter(m => m.group === group);
  }
  if(!q) return list;
  const words = q.split(/\s+/).filter(Boolean);
  return list.filter(m => {
    const full = ((m.num||'') + ' ' + (m.title||'') + ' ' + (m.desc||'') + ' ' + (m.features||'')).toLowerCase();
    return words.every(w => full.includes(w));
  });
}

`;
html = html.replace(oldSm, newSm);

// Replace searchFines
const oldSf = html.slice(html.indexOf('function searchFines('), html.indexOf('function screenFines('));
const newSf = `function searchFines(query, group){
  const q = (query || '').trim().toLowerCase();
  let list = FINES_DATA;
  if(group && group !== 'all'){
    if(group === 'speed') list = list.filter(f => (f.group||'').includes('СКОРОСТ') || (f.title||'').includes('скорост'));
    else if(group === 'inter') list = list.filter(f => (f.group||'').includes('ПЕРЕКРЕСТ') || (f.title||'').includes('перекрест') || (f.title||'').includes('светофор'));
    else if(group === 'maneuver') list = list.filter(f => (f.group||'').includes('МАНЕВР') || (f.group||'').includes('ОБГОН') || (f.title||'').includes('обгон') || (f.title||'').includes('разворот'));
    else if(group === 'stop') list = list.filter(f => (f.group||'').includes('ОСТАНОВК') || (f.title||'').includes('стоянк') || (f.title||'').includes('остановк'));
    else if(group === 'docs') list = list.filter(f => (f.title||'').includes('документ') || (f.title||'').includes('номер') || (f.title||'').includes('страхов'));
    else if(group === 'alc') list = list.filter(f => (f.title||'').includes('опьянен') || (f.title||'').includes('алкогол'));
    else if(group === 'police') list = list.filter(f => (f.title||'').includes('полици') || (f.title||'').includes('требован'));
    else if(group === 'ped') list = list.filter(f => (f.title||'').includes('пешеход'));
  }
  if(!q) return list;
  const words = q.split(/\s+/).filter(Boolean);
  return list.filter(f => {
    const full = ((f.article||'') + ' ' + (f.title||'') + ' ' + (f.repeat||'') + ' ' + (f.sum||'')).toLowerCase();
    return words.every(w => full.includes(w));
  });
}

`;
html = html.replace(oldSf, newSf);

fs.writeFileSync(indexPath, html);
console.log('Successfully updated searchMarkings and searchFines in index.html!');
