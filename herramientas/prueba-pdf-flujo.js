const vm = require('vm'), fs = require('fs');
const R = process.env.SEP || (__dirname + '/../');
const llamadas = { fetch: [], dibujos: 0, svgs: [], canvases: [] };
class FR { readAsDataURL(b) { setTimeout(() => { this.result = 'data:application/octet-stream;base64,' + Buffer.from(b.__d).toString('base64'); this.onload(); }, 0); } readAsArrayBuffer(b) { setTimeout(() => { this.result = b.__d.buffer.slice(b.__d.byteOffset, b.__d.byteOffset + b.__d.length); this.onload(); }, 0); } }
const w = { Math, Date, JSON, console, setTimeout, clearTimeout, Promise, Uint8Array, String, Object, Array, RegExp, atob, encodeURIComponent, FileReader: FR,
  Blob: function (parts, o) { this.type = o && o.type; const s = parts[0]; this.__d = typeof s === 'string' ? Buffer.from(s) : Buffer.from(s); this.size = this.__d.length; if (this.type === 'image/svg+xml;charset=utf-8') llamadas.svgs.push(parts[0]); },
  URL: { createObjectURL(b) { return 'blob:' + b.type; }, revokeObjectURL() {} },
  fetch(u) { llamadas.fetch.push(u); if (/fuentes\.css$/.test(u)) return Promise.resolve({ ok: true, text: () => Promise.resolve("@font-face{font-family:'Jost';font-weight:600;src:url(jost-latin.woff2) format('woff2');}") });
    if (/missing/.test(u)) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve({ ok: true, blob: () => Promise.resolve({ __d: Buffer.from('DATOS-' + u) }) }); },
  Image: function () { const im = this; Object.defineProperty(im, 'src', { set(v) { setTimeout(() => im.onload(), 0); } }); },
  document: { createElement(t) { if (t === 'canvas') { const c = { width: 0, height: 0, getContext() { return { fillRect() {}, drawImage(i, x, y, W, H) { llamadas.dibujos++; llamadas.canvases.push([W, H]); }, set fillStyle(v) {} }; }, toBlob(cb) { cb({ __d: Buffer.from([0xFF, 0xD8, 0xFF, 0xC0, 0, 17, 8, 0x08, 0xB4, 0x06, 0x27, 3, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1, 0xFF, 0xD9]) }); } }; return c; } return { style: {}, click() { llamadas.click = true; }, setAttribute() {} }; }, body: { appendChild() {}, removeChild() {} } },
  location: { search: '' } };
w.window = w; vm.createContext(w);
for (const f of ['dibujo.js', 'pdf.js']) vm.runInContext(fs.readFileSync(R + f, 'utf8'), w, { filename: f });
const S = w.SEPARADOR, P = w.SeparadorPdf;
let fallos = 0; const ok = (n, c, x) => { if (!c) fallos++; console.log((c ? 'ok     ' : 'FALLO  ') + n + (x !== undefined ? '  ' + x : '')); };
const ts = []; for (let n = 0; n < 6; n++) { const t = S.tira({ L: 88, fw: 12, modelo: 'medio', lado: 'izq', regla: true, zurdo: false, i: n, color: S.ORDEN[n], piel: 'clara', frase: 'SEPARA', nombre: 'Lucía', marca: 'ColmenIA' }); ts.push({ svg: t.svg, w: t.w, h: t.h }); }
(async () => {
  const r = await P.crea([{ items: ts, giro: false }, { items: ts.slice(0, 2), giro: false }], '');
  ok('crea devuelve un PDF de 2 folios con 8 tiras', r.paginas === 2 && r.colocadas === 8 && Buffer.from(r.bytes).slice(0, 5).toString() === '%PDF-', r.paginas + ' folios, ' + r.colocadas + ' tiras');
  ok('cada folio se pinta 2 veces (la segunda, con las letras ya cargadas) a 1575×2228', llamadas.dibujos === 4 && llamadas.canvases.every(c => c[0] === 1575 && c[1] === 2228), JSON.stringify(llamadas.canvases[0]) + ' ×' + llamadas.dibujos);
  const s = llamadas.svgs[0];
  ok('el SVG del folio lleva las letras incrustadas (@font-face con data:)', /@font-face/.test(s) && /url\(data:font\/woff2;base64,/.test(s));
  ok('el SVG lleva las manos incrustadas y ya no pide archivos fuera', /href="data:application\/octet-stream;base64,|href="data:image\/png/.test(s) && !/href="arte\//.test(s));
  const pedidas = llamadas.fetch.filter(u => /arte\//.test(u)); ok('cada mano se pide una sola vez (caché)', new Set(pedidas).size === pedidas.length, pedidas.length + ' peticiones');
  ok('no se pide nada fuera del sitio', llamadas.fetch.every(u => !/^https?:/.test(u)), llamadas.fetch.slice(0, 3).join(' '));
  // fallo de recursos: una mano que no existe no rompe
  const r2 = await P.incrustaImagenes('<svg><image href="arte/missing.png"/></svg>'); ok('una imagen que falta no rompe: queda como estaba', /href="arte\/missing\.png"/.test(r2));
  // guardar
  const tam = P.guarda(r.bytes, 'separador-Lucia.pdf'); ok('guarda crea el archivo y pulsa el enlace de descarga', tam === r.bytes.length && llamadas.click === true, tam + ' bytes');
  console.log(fallos ? 'FALLOS: ' + fallos : 'todo bien');
})().catch(e => { console.log('EXCEPCIÓN', e); process.exit(1); });
