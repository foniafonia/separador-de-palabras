const vm = require('vm'), fs = require('fs'), path = require('path');
const R = process.env.SEP || (__dirname + '/../');
const w = { Math, Date, JSON, console, setTimeout, clearTimeout, Uint8Array, Float32Array, String, Object, Array, RegExp, encodeURIComponent, URL, Blob, document: { createElement() { return { getContext() { return null; } }; } }, Image: function () { }, location: { search: '' } };
w.window = w; vm.createContext(w);
for (const f of ['dibujo.js', 'pdf.js']) vm.runInContext(fs.readFileSync(R + f, 'utf8'), w, { filename: f });
const S = w.SepDibujo || w.SEPARADOR || w.Separador || Object.keys(w).filter(k => /^S/.test(k)).map(k => w[k]).find(x => x && x.tira);
let fallos = 0; const ok = (n, c, x) => { if (!c) fallos++; console.log((c ? 'ok     ' : 'FALLO  ') + n + (x !== undefined ? '  ' + x : '')); };
ok('dibujo.js expone tira/hoja/diploma', S && S.tira && S.hoja && S.diploma);
const P = w.SeparadorPdf;
ok('pdf.js se carga', !!P && !!P.folio && !!P.pdf);
const PIELES = ['clara', 'media', 'oscura'];
function tira(n, modelo) { const uno = modelo !== 'puntas'; return S.tira({ L: uno ? 88 : 184, fw: 12, modelo, lado: uno ? 'izq' : '', regla: true, zurdo: false, i: n, color: S.ORDEN[n % S.ORDEN.length], piel: PIELES[n % 3], frase: 'DEJA ESPACIO', nombre: 'Lucía', marca: 'ColmenIA · Gabinete Fönia' }); }
const out = process.argv[2] || require('os').tmpdir();
for (const modelo of ['medio', 'puntas']) {
  const ts = []; for (let n = 0; n < 12; n++) ts.push(tira(n, modelo));
  const t0 = ts[0], col = Math.max(1, Math.floor((194 + 2) / (t0.w + 2))), fil = Math.max(1, Math.floor((280 + 3) / (t0.h + 3))), esperadas = col * fil;
  const f = P.folio(ts.map(t => ({ svg: t.svg, w: t.w, h: t.h })), false);
  ok(modelo + ': caben las mismas tiras que dice la página (' + esperadas + ')', f.colocadas === esperadas, 'colocadas ' + f.colocadas + ' · tira ' + t0.w + '×' + t0.h + ' mm');
  const svg = P.paginaSvg(f.cuerpo, '', null);
  fs.writeFileSync(path.join(out, 'folio-' + modelo + '.svg'), svg.replace(/href="arte\/([^"]+)"/g, 'href="' + R + 'arte/$1"'));
}
const h = S.hoja(['el sol sale', 'mi gato come pan'], { fw: 12, piel: 'clara', color: 'turquesa', nombre: 'Lucía' });
const fh = P.folio([{ svg: h[0], w: 281, h: 194 }], true);
ok('hoja: 1 folio girado', fh.colocadas === 1 && /rotate\(90\)/.test(fh.cuerpo));
fs.writeFileSync(path.join(out, 'folio-hoja.svg'), P.paginaSvg(fh.cuerpo, '', null).replace(/href="arte\/([^"]+)"/g, 'href="' + R + 'arte/$1"'));
const d = S.diploma({ piel: 'clara', color: 'turquesa', nombre: 'Lucía' });
const fd = P.folio([{ svg: d, w: 281, h: 194 }], true);
fs.writeFileSync(path.join(out, 'folio-diploma.svg'), P.paginaSvg(fd.cuerpo, '', null).replace(/href="arte\/([^"]+)"/g, 'href="' + R + 'arte/$1"'));
ok('diploma: 1 folio girado', fd.colocadas === 1);
// escritor de PDF con JPEG reales hechos por Python
const jp = fs.readdirSync(out).filter(f => /^jpg\d\.jpg$/.test(f)).sort();
if (jp.length) {
  const pags = jp.map(f => { const b = fs.readFileSync(path.join(out, f)); const W = b.readUInt16BE(b.indexOf(Buffer.from([0xFF, 0xC0])) + 7), H = b.readUInt16BE(b.indexOf(Buffer.from([0xFF, 0xC0])) + 5); return { bytes: new Uint8Array(b), w: W, h: H }; });
  const bytes = P.pdf(pags); fs.writeFileSync(path.join(out, 'prueba.pdf'), Buffer.from(bytes));
  ok('pdf escrito: ' + bytes.length + ' bytes, ' + pags.length + ' folios', bytes.length > 1000 && Buffer.from(bytes).slice(0, 5).toString() === '%PDF-');
}
ok('nombre de archivo sin acentos ni símbolos', P.nombreArchivo('separador', 'Lucía Ñ/..') === 'separador-Lucia-N.pdf' && P.nombreArchivo('separador', '') === 'separador.pdf', P.nombreArchivo('separador', 'Lucía Ñ/..'));
console.log(fallos ? 'FALLOS: ' + fallos : 'todo bien');
