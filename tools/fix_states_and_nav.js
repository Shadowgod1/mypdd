const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add MARKINGS_STATE and FINES_STATE
if (!html.includes('let MARKINGS_STATE')) {
  html = html.replace('let SIGNS_STATE = { g: \'all\', q: \'\' };', 'let SIGNS_STATE = { g: \'all\', q: \'\' };\nlet MARKINGS_STATE = { g: \'all\', q: \'\' };\nlet FINES_STATE = { g: \'all\', q: \'\' };');
}

// 2. Replace header nav with all buttons including "Прочие"
const navStart = html.indexOf('<nav class="nav-links"');
const navEnd = html.indexOf('</nav>', navStart) + 6;

const fullNav = `<nav class="nav-links" id="main-nav">
      <button class="nav-link" data-nav="tests"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span data-t="navTests">Тесты</span></button>
      <button class="nav-link" data-nav="rules"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span data-t="navRules">Правила</span></button>
      <button class="nav-link" data-nav="signs"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span data-t="navSigns">Знаки</span></button>
      <button class="nav-link" data-nav="markings"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span data-t="navMarkings">Разметка</span></button>
      <button class="nav-link" data-nav="fines"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span data-t="navFines">Штрафы</span></button>
      <button class="nav-link" data-nav="pmp"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg><span data-t="navPmp">ПМП</span></button>
      <button class="nav-link" data-nav="prochie"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg><span data-t="navProchie">Прочие</span></button>
    </nav>`;

html = html.slice(0, navStart) + fullNav + html.slice(navEnd);

// 3. Update renderMobileNav to include 'prochie'
const oldMobNav = `function renderMobileNav(activeTab){
  const tabs = [
    { id: 'tests', label: t('navTests') },
    { id: 'rules', label: t('navRules') },
    { id: 'signs', label: t('navSigns') },
    { id: 'markings', label: t('navMarkings') },
    { id: 'fines', label: t('navFines') },
    { id: 'pmp', label: t('navPmp') }
  ];`;

const newMobNav = `function renderMobileNav(activeTab){
  const tabs = [
    { id: 'tests', label: t('navTests') },
    { id: 'rules', label: t('navRules') },
    { id: 'signs', label: t('navSigns') },
    { id: 'markings', label: t('navMarkings') },
    { id: 'fines', label: t('navFines') },
    { id: 'pmp', label: t('navPmp') },
    { id: 'prochie', label: t('navProchie') }
  ];`;

html = html.replace(oldMobNav, newMobNav);

// 4. Update hookMobileNav to handle 'prochie'
const oldHookMob = `else if(id === 'pmp') screenPmp();`;
const newHookMob = `else if(id === 'pmp') screenPmp();\n      else if(id === 'prochie') screenProchie('docs');`;
html = html.replace(oldHookMob, newHookMob);

fs.writeFileSync(indexPath, html);
console.log('Successfully fixed state variables and updated navigation with Прочие!');
