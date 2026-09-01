/* Генератор иконок приложения без внешних зависимостей.
   Рисует знак марки (сходящиеся полосы дороги + осевая разметка)
   и кодирует результат в PNG вручную: zlib есть в самом Node. */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const BG   = [0x0F, 0x1D, 0x16];
const LANE = [0x4F, 0xB8, 0x84];
const MARK = [0xED, 0xF3, 0xEE];

/* расстояние от точки до отрезка — им рисуем линии нужной толщины */
function distSeg(px, py, x1, y1, x2, y2){
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx*dx + dy*dy;
  let tt = len2 ? ((px-x1)*dx + (py-y1)*dy) / len2 : 0;
  tt = Math.max(0, Math.min(1, tt));
  const cx = x1 + tt*dx, cy = y1 + tt*dy;
  return Math.hypot(px-cx, py-cy);
}

function render(size){
  /* геометрия задана в системе 24×24, как в SVG логотипа */
  const k = size / 24;
  const lanes = [ [4,21, 9,3], [20,21, 15,3] ];
  const dashes = [ [12,5, 12,8], [12,11, 12,14], [12,17, 12,20] ];
  const wLane = 2.05 * k, wMark = 1.85 * k;
  const SS = 3;                       /* сглаживание: 3×3 подвыборки */
  const buf = Buffer.alloc(size*size*4);

  for(let y=0; y<size; y++){
    for(let x=0; x<size; x++){
      let aLane = 0, aMark = 0;
      for(let sy=0; sy<SS; sy++){
        for(let sx=0; sx<SS; sx++){
          const px = x + (sx+0.5)/SS, py = y + (sy+0.5)/SS;
          let dL = Infinity, dM = Infinity;
          for(const s of lanes)  dL = Math.min(dL, distSeg(px,py, s[0]*k,s[1]*k, s[2]*k,s[3]*k));
          for(const s of dashes) dM = Math.min(dM, distSeg(px,py, s[0]*k,s[1]*k, s[2]*k,s[3]*k));
          if(dL <= wLane/2) aLane++;
          if(dM <= wMark/2) aMark++;
        }
      }
      const n = SS*SS;
      let c = BG.slice();
      if(aLane){ const a = aLane/n; c = c.map((v,i)=>Math.round(v*(1-a) + LANE[i]*a)); }
      if(aMark){ const a = aMark/n; c = c.map((v,i)=>Math.round(v*(1-a) + MARK[i]*a)); }
      const o = (y*size + x)*4;
      buf[o]=c[0]; buf[o+1]=c[1]; buf[o+2]=c[2]; buf[o+3]=255;
    }
  }
  return buf;
}

/* --- минимальный кодировщик PNG --- */
const CRC = (()=>{ const t=[]; for(let n=0;n<256;n++){ let c=n;
  for(let k=0;k<8;k++) c = c&1 ? 0xEDB88320 ^ (c>>>1) : c>>>1; t[n]=c>>>0; } return t; })();
function crc32(b){ let c=0xFFFFFFFF; for(const x of b) c = CRC[(c ^ x) & 0xFF] ^ (c>>>8); return (c ^ 0xFFFFFFFF)>>>0; }
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type,'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, rgba){
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;
  const raw = Buffer.alloc(size*(size*4+1));
  for(let y=0;y<size;y++){
    raw[y*(size*4+1)] = 0;                                  /* фильтр строки: none */
    rgba.copy(raw, y*(size*4+1)+1, y*size*4, (y+1)*size*4);
  }
  return Buffer.concat([sig, chunk('IHDR',ihdr), chunk('IDAT', zlib.deflateSync(raw,{level:9})), chunk('IEND',Buffer.alloc(0))]);
}

const out = process.argv[2] || '.';
fs.mkdirSync(out, {recursive:true});
[['icon-192.png',192], ['icon-512.png',512], ['apple-touch-icon.png',180], ['favicon-32.png',32]]
  .forEach(([name,size])=>{
    const file = path.join(out, name);
    fs.writeFileSync(file, png(size, render(size)));
    console.log('  ' + name + '  ' + size + '×' + size + '  ' + Math.round(fs.statSync(file).size/1024*10)/10 + ' КБ');
  });
