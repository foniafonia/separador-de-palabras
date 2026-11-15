/* Separador de palabras · los dibujos (Gabinete Fönia · ColmenIA)
   Todo en milímetros: el SVG lleva width/height en mm y al imprimir a tamaño real (100 %)
   la regla mide centímetros de verdad y el dedo tiene el ancho elegido.
   Sin sintaxis nueva: iPad antiguos. */
(function () {
  'use strict';
  var TINTA = '#3A2449';
  var NUBE = '#FFF6DE';
  var COLORES = {
    turquesa: ['#22A39C', '#9BE2D9'], coral: ['#F2706B', '#FFC4BA'], naranja: ['#F7931E', '#FFD495'],
    verde: ['#5CC98A', '#C3F0D2'], lila: ['#B98AE6', '#E8D9F9'], azul: ['#4BB0EE', '#C3E6FB'], tinta: ['#FFFFFF', '#FFFFFF']
  };
  var ORDEN = ['turquesa', 'coral', 'naranja', 'verde', 'lila', 'azul'];
  var PIELES = { clara: ['#FAD3AA', '#FDEBD8'], media: ['#E3A06C', '#F5CFAE'], oscura: ['#A0653C', '#D8A27C'] };
  var MANGAS = [['#3B7DD8', 'rayas'], ['#F5C431', 'lunares'], ['#8E5CC9', 'corazon'], ['#2FA866', 'estrella'], ['#E84D8A', 'lunares'], ['#2E5FA8', 'estrella']];
  var LETRA_T = "Jost, 'Atkinson Hyperlegible', system-ui, sans-serif";
  var LETRA = "'Atkinson Hyperlegible', system-ui, sans-serif";
  var uid = 0;

  function f(n) { return Math.round(n * 100) / 100; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rr(x, y, w, h, r, extra) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" rx="' + f(r) + '" ' + (extra || '') + '/>'; }

  function estrella(cx, cy, r, fill) {
    var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; p.push(f(cx + q * Math.cos(a)) + ',' + f(cy + q * Math.sin(a))); }
    return '<polygon points="' + p.join(' ') + '" fill="' + fill + '" stroke="none"/>';
  }
  function corazon(cx, cy, r, fill) {
    return '<path d="M' + f(cx) + ' ' + f(cy + r * 0.9) + ' C' + f(cx - r * 1.6) + ' ' + f(cy - r * 0.2) + ' ' + f(cx - r * 0.6) + ' ' + f(cy - r * 1.3) + ' ' + f(cx) + ' ' + f(cy - r * 0.4) +
      ' C' + f(cx + r * 0.6) + ' ' + f(cy - r * 1.3) + ' ' + f(cx + r * 1.6) + ' ' + f(cy - r * 0.2) + ' ' + f(cx) + ' ' + f(cy + r * 0.9) + 'Z" fill="' + fill + '" stroke="none"/>';
  }

  /* Puño con el índice hacia arriba. Unidades propias: el dedo mide 14 de ancho; (0,0) es el
     centro del dedo a la altura del borde de la tira. giro = -1 lo pone en espejo. */
  function mano(cx, y0, s, giro, piel, manga, bn) {
    var sk = bn ? '#FFFFFF' : piel[0], un = bn ? '#FFFFFF' : piel[1], mc = bn ? '#FFFFFF' : manga[0], pat = manga[1], sw = 0.9 / s;
    var g = '<g transform="translate(' + f(cx) + ' ' + f(y0) + ') scale(' + f(s * giro) + ' ' + f(s) + ')" stroke="' + TINTA + '" stroke-width="' + f(sw) + '" stroke-linejoin="round" stroke-linecap="round">';
    g += rr(-7, -18, 14, 30, 7, 'fill="' + sk + '"');
    g += '<path d="M-3.4 -9.5 q3.4 1.3 6.8 0M-3.4 -4 q3.4 1.3 6.8 0" fill="none" stroke-width="' + f(sw * 0.6) + '"/>';
    g += rr(-10, 1, 29, 22, 8, 'fill="' + sk + '"');
    for (var i = 0; i < 3; i++) g += rr(5, 1.5 + i * 7, 14, 7.2, 3.6, 'fill="' + sk + '"');
    g += rr(-11, 10.5, 18, 7.5, 3.75, 'fill="' + sk + '"');
    g += rr(-11.5, 21, 31, 16, 2.5, 'fill="' + mc + '"');
    if (!bn) {
      if (pat === 'rayas') g += '<path d="M-11 25.6h30M-11 29.6h30" stroke="#FFFFFF" stroke-width="1.6"/>';
      else if (pat === 'lunares') g += [[-6.5, 25], [0.5, 27.2], [7.5, 25], [14.5, 27.2], [-3, 30.5], [11, 30.5]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.4" fill="#FFFFFF" stroke="none"/>'; }).join('');
      else if (pat === 'estrella') g += estrella(4, 27.6, 3.8, '#FFFFFF');
      else if (pat === 'corazon') g += corazon(4, 27.8, 3, '#FFFFFF');
    }
    return g + '</g>';
  }

  /* Partir una frase en una o dos líneas parecidas */
  function trozos(t) {
    t = String(t || '').replace(/\s+/g, ' ').trim(); if (!t) return [];
    if (t.length <= 11 || t.indexOf(' ') < 0) return [t];
    var w = t.split(' '), mejor = null;
    for (var i = 1; i < w.length; i++) { var a = w.slice(0, i).join(' '), b = w.slice(i).join(' '), m = Math.max(a.length, b.length); if (!mejor || m < mejor.m) mejor = { m: m, l: [a, b] }; }
    return mejor.l;
  }
  /* ancho en «em»: medido de verdad con la letra cargada si hay navegador; si no, aproximado por lo alto */
  var CTX = null; try { CTX = document.createElement('canvas').getContext('2d'); } catch (e) { CTX = null; }
  function mide(s, familia, peso) {
    if (!CTX) return null;
    try { CTX.font = (peso || 600) + ' 100px ' + familia; var w = CTX.measureText(s).width; return w > 0 ? w / 100 * 1.04 : null; } catch (e) { return null; }
  }
  function ancho(s, familia, peso) {
    var m = mide(s, familia || LETRA_T, peso); if (m) return m;
    var w = 0; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); w += c === ' ' ? 0.3 : (/[MWÑ@]/.test(c) ? 0.86 : (c !== c.toLowerCase() ? 0.66 : (/[ijlt.,'!¡]/.test(c) ? 0.3 : 0.54))); }
    return w;
  }
  /* Nube color crema con la frase (y una línea pequeña debajo, si hay) centrada en la caja */
  function nube(x1, x2, y1, y2, principal, secundario, bn) {
    var W = x2 - x1, H = y2 - y1; if (W < 8 || H < 5) return '';
    var L = trozos(principal), sec = String(secundario || '').trim();
    if (!L.length && !sec) return '';
    var maxw = 0.1; L.forEach(function (l) { maxw = Math.max(maxw, ancho(l)); });
    var rs = L.length ? 0.6 : 1, secw = sec ? ancho(sec) * rs : 0;
    var lineas = L.length * 1.06 + (sec ? rs * 1.12 : 0), pad = 1.5;
    var fs = Math.min(9.5, (H - pad * 2) / lineas, (W - pad * 3.2) / Math.max(maxw, secw));
    var tw = Math.max(maxw, secw) * fs, th = lineas * fs, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    var o = rr(cx - tw / 2 - pad * 1.5, cy - th / 2 - pad, tw + pad * 3, th + pad * 2, Math.min(th / 2 + pad, 6), 'fill="' + NUBE + '"' + (bn ? ' stroke="' + TINTA + '" stroke-width=".45"' : ''));
    var y = cy - th / 2;
    L.forEach(function (l) { y += fs * 1.06; o += '<text x="' + f(cx) + '" y="' + f(y - fs * 0.24) + '" font-size="' + f(fs) + '" text-anchor="middle" font-family="' + LETRA_T + '" font-weight="600" fill="' + TINTA + '">' + esc(l) + '</text>'; });
    if (sec) { y += fs * rs * 1.12; o += '<text x="' + f(cx) + '" y="' + f(y - fs * rs * 0.26) + '" font-size="' + f(fs * rs) + '" text-anchor="middle" font-family="' + LETRA_T + '" font-weight="500" fill="' + TINTA + '">' + esc(sec) + '</text>'; }
    return o;
  }

  /* La tira. o = {L, fw, modelo:'medio'|'puntas', color, piel, zurdo, regla, frase, nombre, marca, i} */
  function tira(o) {
    var s = o.fw / 14, L = o.L, H = 30, x0 = 4, y0 = f(18 * s + 4), bn = o.color === 'tinta';
    var col = COLORES[o.color] || COLORES.turquesa, piel = PIELES[o.piel] || PIELES.clara, manga = MANGAS[(o.i || 0) % MANGAS.length];
    var W = L + 8, HT = y0 + H + 4, id = 'sp' + (++uid), manos = [];
    if (o.modelo === 'puntas') { manos.push({ cx: x0 + 3 + 11.5 * s, g: 1 }); manos.push({ cx: x0 + L - 3 - 11.5 * s, g: -1 }); }
    else manos.push({ cx: x0 + L / 2, g: o.zurdo ? -1 : 1 });

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="tira-svg" width="' + f(W) + 'mm" height="' + f(HT) + 'mm" viewBox="0 0 ' + f(W) + ' ' + f(HT) + '" role="img" aria-label="Tira separadora de palabras">';
    svg += '<defs><clipPath id="' + id + '">' + rr(x0, y0, L, H, 6) + '<rect x="' + x0 + '" y="0" width="' + L + '" height="' + f(y0 + 8) + '"/></clipPath></defs>';
    /* línea de corte: las formas agrandadas 3 mm, primero el trazo de puntos y encima el relleno blanco: queda solo el contorno de fuera */
    var formas = [[x0 - 3, y0 - 3, L + 6, H + 6, 9]];
    manos.forEach(function (m) { formas.push([m.cx - 7 * s - 3, y0 - 18 * s - 3, 14 * s + 6, 18 * s + 8, 7 * s + 3]); });
    formas.forEach(function (r) { svg += rr(r[0], r[1], r[2], r[3], r[4], 'fill="none" stroke="#8F8499" stroke-width=".35" stroke-dasharray="1.6 1.1"'); });
    formas.forEach(function (r) { svg += rr(r[0], r[1], r[2], r[3], r[4], 'fill="#FFFFFF"'); });
    svg += rr(x0, y0, L, H, 6, 'fill="' + col[0] + '"');
    if (o.regla) {
      var ry = y0 + H - 7.5, t = '';
      t += rr(x0, ry, L, 7.5, 0, 'fill="' + col[1] + '"') + '<line x1="' + x0 + '" x2="' + (x0 + L) + '" y1="' + f(ry) + '" y2="' + f(ry) + '" stroke="' + TINTA + '" stroke-width=".3"/>';
      var maxmm = Math.floor(L - 8), path = '', num = '';
      for (var mm = 0; mm <= maxmm; mm++) {
        var x = x0 + 4 + mm, l = mm % 10 === 0 ? 2.8 : (mm % 5 === 0 ? 1.9 : 1.1);
        path += 'M' + f(x) + ' ' + f(ry) + 'v' + l;
        if (mm % 10 === 0) num += '<text x="' + f(x) + '" y="' + f(ry + 5.9) + '" font-size="2.3" text-anchor="middle" font-family="' + LETRA + '" font-weight="700" fill="' + TINTA + '">' + (mm / 10) + '</text>';
      }
      t += '<path d="' + path + '" stroke="' + TINTA + '" stroke-width=".22" fill="none"/>' + num;
      svg += '<g clip-path="url(#' + id + ')">' + t + '</g>';
    }
    svg += rr(x0, y0, L, H, 6, 'fill="none" stroke="' + TINTA + '" stroke-width=".9"');
    var ty1 = y0 + 2.6, ty2 = y0 + H - (o.regla ? 9.2 : 2.6), nombre = String(o.nombre || '').trim(), frase = String(o.frase || '').trim();
    if (o.modelo === 'puntas') {
      svg += nube(x0 + 3 + 31 * s + 2, x0 + L - 3 - 31 * s - 2, ty1, ty2, frase, nombre, bn);
    } else {
      var m = manos[0], izq = o.zurdo ? m.cx - 19.5 * s - 2.5 : m.cx - 11.5 * s - 2.5, der = o.zurdo ? m.cx + 11.5 * s + 2.5 : m.cx + 19.5 * s + 2.5;
      svg += nube(x0 + 4, izq, ty1, ty2, frase, '', bn);
      svg += nube(der, x0 + L - 4, ty1, ty2, nombre || 'UN DEDO DE ESPACIO', '', bn);
    }
    svg += '<g clip-path="url(#' + id + ')">' + manos.map(function (m) { return mano(m.cx, y0, s, m.g, piel, manga, bn); }).join('') + '</g>';
    if (o.marca) svg += '<text x="' + f(x0 + L - 9) + '" y="' + f(y0 + H + 2.3) + '" font-size="1.9" text-anchor="end" font-family="' + LETRA + '" fill="#8F8499">ColmenIA · Gabinete Fönia</text>';
    return { svg: svg + '</svg>', w: W, h: HT };
  }

  /* Dedo pequeño suelto (para la hoja de práctica): de pie sobre la línea, ancho = hueco */
  function dedito(cx, base, fw, piel, bn) {
    var h = fw * 1.5, sk = bn ? '#FFFFFF' : piel[0], y = base - h;
    return rr(cx - fw / 2, y, fw, h, fw / 2, 'fill="' + sk + '" stroke="' + TINTA + '" stroke-width=".45"') +
      '<path d="M' + f(cx - fw * 0.25) + ' ' + f(y + h * 0.42) + ' q' + f(fw * 0.25) + ' ' + f(fw * 0.1) + ' ' + f(fw * 0.5) + ' 0M' + f(cx - fw * 0.25) + ' ' + f(y + h * 0.6) + ' q' + f(fw * 0.25) + ' ' + f(fw * 0.1) + ' ' + f(fw * 0.5) + ' 0" fill="none" stroke="' + TINTA + '" stroke-width=".35"/>';
  }

  /* Hoja de práctica (A4 apaisado, caja útil 281 × 194 mm): frase modelo con dedos entre palabras y dos renglones para copiarla */
  function hoja(frases, o) {
    var W = 281, H = 194, piel = PIELES[o.piel] || PIELES.clara, bn = o.color === 'tinta', col = COLORES[o.color] || COLORES.turquesa;
    var fw = o.fw, paginas = [], porHoja = 3;
    for (var p = 0; p < frases.length; p += porHoja) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'mm" height="' + H + 'mm" viewBox="0 0 ' + W + ' ' + H + '">';
      svg += '<text x="4" y="10" font-size="7" font-family="' + LETRA_T + '" font-weight="600" fill="' + TINTA + '">Deja un dedo entre palabra y palabra</text>';
      svg += '<text x="' + (W - 4) + '" y="10" font-size="5" text-anchor="end" font-family="' + LETRA + '" fill="' + TINTA + '">' + esc(o.nombre ? o.nombre : 'Nombre: ____________________') + '</text>';
      svg += '<line x1="4" x2="' + (W - 4) + '" y1="14" y2="14" stroke="' + (bn ? TINTA : col[0]) + '" stroke-width=".8"/>';
      frases.slice(p, p + porHoja).forEach(function (fr, k) {
        var top = 22 + k * 58, base = top + 16, fs = 11, x = 8;
        var pal = fr.replace(/\s+/g, ' ').trim().split(' ');
        var aw = function (w) { return ancho(w, LETRA, 400) * 1.06; }, sep = fw + 6;
        var tot = 0; pal.forEach(function (w) { tot += aw(w) * fs; }); tot += (pal.length - 1) * sep;
        if (tot > W - 16) fs = fs * (W - 16 - (pal.length - 1) * sep) / (tot - (pal.length - 1) * sep);
        pal.forEach(function (w, i) {
          svg += '<text x="' + f(x) + '" y="' + f(base) + '" font-size="' + f(fs) + '" font-family="' + LETRA + '" fill="' + TINTA + '">' + esc(w) + '</text>';
          x += aw(w) * fs + 3;
          if (i < pal.length - 1) { svg += dedito(x + fw / 2, base + 1, fw, piel, bn); x += fw + 3; }
        });
        for (var r = 0; r < 2; r++) {
          var b = base + 17 + r * 17;
          svg += '<line x1="8" x2="' + (W - 8) + '" y1="' + f(b - 11) + '" y2="' + f(b - 11) + '" stroke="#C9C2D3" stroke-width=".3"/>';
          svg += '<line x1="8" x2="' + (W - 8) + '" y1="' + f(b - 5.5) + '" y2="' + f(b - 5.5) + '" stroke="#C9C2D3" stroke-width=".3" stroke-dasharray="1.5 1.5"/>';
          svg += '<line x1="8" x2="' + (W - 8) + '" y1="' + f(b) + '" y2="' + f(b) + '" stroke="' + TINTA + '" stroke-width=".45"/>';
        }
      });
      svg += '<text x="' + (W - 4) + '" y="' + (H - 2) + '" font-size="2.6" text-anchor="end" font-family="' + LETRA + '" fill="#8F8499">ColmenIA · Gabinete Fönia · Separador de palabras</text>';
      paginas.push(svg + '</svg>');
    }
    return paginas;
  }

  /* Diploma (A4 apaisado) */
  function diploma(o) {
    var W = 281, H = 194, piel = PIELES[o.piel] || PIELES.clara, bn = o.color === 'tinta', col = COLORES[o.color] || COLORES.turquesa;
    var c0 = bn ? TINTA : col[0], c1 = bn ? '#FFFFFF' : col[1];
    var nombre = String(o.nombre || '').trim();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'mm" height="' + H + 'mm" viewBox="0 0 ' + W + ' ' + H + '">';
    svg += rr(3, 3, W - 6, H - 6, 12, 'fill="' + c1 + '" stroke="' + c0 + '" stroke-width="3"');
    svg += rr(11, 11, W - 22, H - 22, 8, 'fill="#FFFFFF" stroke="' + TINTA + '" stroke-width=".6" stroke-dasharray="2 1.6"');
    svg += mano(38, 128, 1.55, 1, piel, MANGAS[0], bn) + mano(W - 38, 128, 1.55, -1, piel, MANGAS[2], bn);
    svg += '<text x="' + W / 2 + '" y="44" font-size="20" text-anchor="middle" font-family="' + LETRA_T + '" font-weight="600" fill="' + TINTA + '">¡Diploma!</text>';
    svg += '<text x="' + W / 2 + '" y="60" font-size="7" text-anchor="middle" font-family="' + LETRA + '" fill="' + TINTA + '">de escritor o escritora con espacios</text>';
    svg += rr(W / 2 - 70, 70, 140, 26, 13, 'fill="' + NUBE + '" stroke="' + (bn ? TINTA : 'none') + '" stroke-width=".5"');
    svg += '<text x="' + W / 2 + '" y="88.5" font-size="' + (nombre.length > 14 ? 11 : 14) + '" text-anchor="middle" font-family="' + LETRA_T + '" font-weight="600" fill="' + TINTA + '">' + esc(nombre || '..............................') + '</text>';
    svg += '<text x="' + W / 2 + '" y="112" font-size="7" text-anchor="middle" font-family="' + LETRA + '" fill="' + TINTA + '">ya deja un dedo de espacio</text>';
    svg += '<text x="' + W / 2 + '" y="122" font-size="7" text-anchor="middle" font-family="' + LETRA + '" fill="' + TINTA + '">entre palabra y palabra.</text>';
    svg += '<text x="' + (W / 2 - 60) + '" y="160" font-size="5" font-family="' + LETRA + '" fill="' + TINTA + '">Fecha: ______________</text>';
    svg += '<text x="' + (W / 2 + 8) + '" y="160" font-size="5" font-family="' + LETRA + '" fill="' + TINTA + '">Firma: ______________</text>';
    svg += '<text x="' + W / 2 + '" y="176" font-size="3" text-anchor="middle" font-family="' + LETRA + '" fill="#8F8499">ColmenIA · Gabinete Fönia</text>';
    return svg + '</svg>';
  }

  window.SEPARADOR = { tira: tira, hoja: hoja, diploma: diploma, mano: mano, COLORES: COLORES, ORDEN: ORDEN, PIELES: PIELES, MANGAS: MANGAS, TINTA: TINTA };
})();
