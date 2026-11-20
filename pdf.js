/* Separador de palabras · «Guardar como PDF» (Gabinete Fönia · ColmenIA, 20/11/2026)
   Pedido en Skool por Mariló: poder descargar un PDF en vez de depender del diálogo de imprimir.
   Todo en el aparato, sin librerías ni servicios: se compone cada folio A4 con las mismas tiras de la página,
   se dibuja en un lienzo (canvas) a unos 190 ppp y se guarda como un PDF de una imagen JPEG por folio.
   El tamaño es el real: A4 = 210 × 297 mm, así que imprimiendo al 100 % la regla sigue midiendo centímetros.
   El nombre del niño solo sale en el dibujo y, si se quiere, en el nombre del archivo; no va en los metadatos.
   Sin sintaxis nueva: iPad antiguos. */
(function () {
  'use strict';
  var A4W = 210, A4H = 297, PPM = 7.5;              /* píxeles por milímetro: 1575 × 2228 px por folio */
  var CAJA_X = 8, CAJA_Y = 8, CAJA_W = 194, CAJA_H = 280, GAP_X = 2, GAP_Y = 3;   /* igual que @page{margin:8mm} y .pag de index.html */

  /* ---------- composición de un folio (las mismas reglas que el CSS de impresión) ---------- */
  function num(v) { return Math.round(v * 100) / 100; }
  /* {svg, w, h} → <svg x y width height viewBox> anidado, sin unidades «mm» (la página entera va en mm) */
  function anida(it, x, y) {
    var s = String(it.svg), m = /^\s*<svg\b[^>]*viewBox="([^"]+)"[^>]*>/.exec(s);
    if (!m) return '';
    return '<svg x="' + num(x) + '" y="' + num(y) + '" width="' + num(it.w) + '" height="' + num(it.h) + '" viewBox="' + m[1] + '" overflow="hidden">' + s.slice(m[0].length);
  }
  /* devuelve {svg, colocadas}: tiras en filas centradas, de izquierda a derecha, hasta llenar la caja útil */
  function folio(items, giro) {
    var cuerpo = '', colocadas = 0;
    if (giro) {
      /* hoja de práctica y diploma están dibujados tumbados (281 × 194): se giran para el folio vertical, como en la impresión */
      if (items.length) { cuerpo = '<g transform="translate(' + (CAJA_X + CAJA_W) + ',' + CAJA_Y + ') rotate(90) scale(.99)">' + anida(items[0], 0, 0) + '</g>'; colocadas = 1; }
    } else {
      var filas = [], fila = null, i, it;
      for (i = 0; i < items.length; i++) {
        it = items[i];
        if (!fila || fila.w + GAP_X + it.w > CAJA_W + 0.001) { fila = { w: 0, h: 0, its: [] }; filas.push(fila); }
        fila.w += (fila.its.length ? GAP_X : 0) + it.w; fila.h = Math.max(fila.h, it.h); fila.its.push(it);
      }
      var y = CAJA_Y;
      for (i = 0; i < filas.length; i++) {
        if (y + filas[i].h > CAJA_Y + CAJA_H + 0.001) break;
        var x = CAJA_X + (CAJA_W - filas[i].w) / 2;
        filas[i].its.forEach(function (t) { cuerpo += anida(t, x, y); x += t.w + GAP_X; colocadas++; });
        y += filas[i].h + GAP_Y;
      }
    }
    return { cuerpo: cuerpo, colocadas: colocadas };
  }
  function paginaSvg(cuerpo, estilo, imgs) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + A4W + 'mm" height="' + A4H + 'mm" viewBox="0 0 ' + A4W + ' ' + A4H + '">';
    if (estilo) s += '<defs><style type="text/css"><![CDATA[' + estilo + ']]></style></defs>';
    s += '<rect x="0" y="0" width="' + A4W + '" height="' + A4H + '" fill="#FFFFFF"/>' + cuerpo + '</svg>';
    return imgs ? imgs(s) : s;
  }

  /* ---------- recursos del propio sitio, en el mismo aparato ---------- */
  var cacheRec = {};
  function aDataUri(url, tipo) {
    if (cacheRec[url]) return cacheRec[url];
    cacheRec[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); }).then(function (b) {
      return new Promise(function (ok, mal) { var fr = new FileReader(); fr.onload = function () { var d = String(fr.result); ok(tipo ? 'data:' + tipo + d.slice(d.indexOf(';base64,')) : d); }; fr.onerror = mal; fr.readAsDataURL(b); });
    });
    cacheRec[url].catch(function () { delete cacheRec[url]; });
    return cacheRec[url];
  }
  /* las letras de la página (fuentes/fuentes.css) con sus archivos dentro del dibujo: un SVG dibujado como imagen no puede pedir nada fuera */
  var estiloFuentes = null;
  function cargaFuentes(base) {
    if (estiloFuentes) return estiloFuentes;
    estiloFuentes = fetch(base + 'fuentes/fuentes.css').then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (css) {
      var urls = [], re = /url\(([^)]+\.woff2)\)/g, m;
      while ((m = re.exec(css))) if (urls.indexOf(m[1]) < 0) urls.push(m[1]);
      return Promise.all(urls.map(function (u) { return aDataUri(base + 'fuentes/' + u.replace(/['"]/g, ''), 'font/woff2').then(function (d) { return [u, d]; }); })).then(function (ps) {
        ps.forEach(function (p) { css = css.split('url(' + p[0] + ')').join('url(' + p[1] + ')'); });
        return css;
      });
    }).catch(function () { return ''; });   /* sin letras guardadas se usan las del aparato */
    return estiloFuentes;
  }
  /* sustituye href="…png" por la imagen incrustada */
  function incrustaImagenes(svg) {
    var urls = [], re = /href="([^"#:][^":]*\.(?:png|jpg|jpeg|webp))"/g, m;
    while ((m = re.exec(svg))) if (urls.indexOf(m[1]) < 0) urls.push(m[1]);
    return Promise.all(urls.map(function (u) { return aDataUri(u).then(function (d) { return [u, d]; }, function () { return [u, null]; }); })).then(function (ps) {
      ps.forEach(function (p) { if (p[1]) svg = svg.split('href="' + p[0] + '"').join('href="' + p[1] + '"'); });
      return svg;
    });
  }

  /* ---------- SVG → JPEG ---------- */
  function pausa(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function cargaImagen(svg) {
    return new Promise(function (ok, mal) {
      var url = null, im = new Image();
      try { url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })); } catch (e) { url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
      im.onload = function () { ok({ im: im, url: url }); };
      im.onerror = function () { mal(new Error('No se pudo dibujar el folio')); };
      im.src = url;
    });
  }
  function aJpeg(canvas) {
    return new Promise(function (ok, mal) {
      function desdeDataUrl() { try { var b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1], bin = atob(b64), u = new Uint8Array(bin.length), i; for (i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); ok(u); } catch (e) { mal(e); } }
      if (!canvas.toBlob) { desdeDataUrl(); return; }
      canvas.toBlob(function (b) {
        if (!b) { desdeDataUrl(); return; }
        var fr = new FileReader(); fr.onload = function () { ok(new Uint8Array(fr.result)); }; fr.onerror = function () { desdeDataUrl(); }; fr.readAsArrayBuffer(b);
      }, 'image/jpeg', 0.92);
    });
  }
  function rasteriza(svg) {
    var W = Math.round(A4W * PPM), H = Math.round(A4H * PPM), c = document.createElement('canvas'); c.width = W; c.height = H;
    var ctx = c.getContext('2d');
    return cargaImagen(svg).then(function (r) {
      function pinta() { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.drawImage(r.im, 0, 0, W, H); }
      pinta();
      /* las letras incrustadas pueden tardar un instante en decodificarse: se vuelve a pintar una vez */
      return pausa(120).then(function () { pinta(); try { if (r.url.indexOf('blob:') === 0) URL.revokeObjectURL(r.url); } catch (e) { } return aJpeg(c).then(function (u) { c.width = 1; c.height = 1; return { bytes: u, w: W, h: H }; }); });
    });
  }

  /* ---------- escribir el PDF (una imagen JPEG por folio) ---------- */
  function txt(s) { var u = new Uint8Array(s.length), i; for (i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; }
  function pdf(jpegs) {
    var PW = 595.28, PH = 841.89, partes = [], pos = 0, offs = [], n = jpegs.length, i;
    function mete(u) { partes.push(u); pos += u.length; }
    function obj(id, cabecera, flujo) { offs[id] = pos; mete(txt(id + ' 0 obj\n' + cabecera + (flujo ? '\nstream\n' : '\n'))); if (flujo) { mete(flujo); mete(txt('\nendstream\n')); } mete(txt('endobj\n')); }
    /* 1 catálogo, 2 páginas, 3 info; por folio: página, contenido, imagen */
    mete(txt('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'));
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    var kids = []; for (i = 0; i < n; i++) kids.push((4 + i * 3) + ' 0 R');
    obj(2, '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>');
    obj(3, '<< /Title (Separador de palabras) /Producer (Gabinete Fonia y ColmenIA) >>');
    for (i = 0; i < n; i++) {
      var p = 4 + i * 3, cont = txt('q ' + PW + ' 0 0 ' + PH + ' 0 0 cm /Im0 Do Q');
      obj(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /XObject << /Im0 ' + (p + 2) + ' 0 R >> >> /Contents ' + (p + 1) + ' 0 R >>');
      obj(p + 1, '<< /Length ' + cont.length + ' >>', cont);
      obj(p + 2, '<< /Type /XObject /Subtype /Image /Width ' + jpegs[i].w + ' /Height ' + jpegs[i].h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegs[i].bytes.length + ' >>', jpegs[i].bytes);
    }
    var total = 3 + n * 3, xref = pos, x = 'xref\n0 ' + (total + 1) + '\n0000000000 65535 f \n';
    for (i = 1; i <= total; i++) x += ('0000000000' + offs[i]).slice(-10) + ' 00000 n \n';
    mete(txt(x + 'trailer\n<< /Size ' + (total + 1) + ' /Root 1 0 R /Info 3 0 R >>\nstartxref\n' + xref + '\n%%EOF\n'));
    var out = new Uint8Array(pos), o = 0; partes.forEach(function (u) { out.set(u, o); o += u.length; });
    return out;
  }

  /* ---------- guardar ---------- */
  function nombreArchivo(base, nombre) {
    var n = String(nombre || '').normalize ? String(nombre || '').normalize('NFD').replace(/[̀-ͯ]/g, '') : String(nombre || '');
    n = n.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20);
    return base + (n ? '-' + n : '') + '.pdf';
  }
  function guarda(bytes, archivo) {
    var blob = new Blob([bytes], { type: 'application/pdf' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = archivo; a.style.display = 'none'; document.body.appendChild(a);
    var ok = true;
    try { a.click(); } catch (e) { ok = false; }
    setTimeout(function () { try { document.body.removeChild(a); } catch (e) { } }, 1000);
    /* algunos navegadores de móvil ignoran «download»: se abre el PDF para guardarlo desde su visor */
    if (!ok || typeof a.download === 'undefined') { try { window.open(url, '_blank'); } catch (e) { } }
    setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) { } }, 60000);
    return blob.size;
  }

  /* paginas: [{items:[{svg,w,h}], giro:false}] → Promise<{bytes, paginas, colocadas}> */
  function crea(paginas, base) {
    base = base || window.SEPARADOR_BASE || '';
    return cargaFuentes(base).then(function (estilo) {
      var jpegs = [], total = 0;
      return paginas.reduce(function (cadena, pg) {
        return cadena.then(function () {
          var f = folio(pg.items, !!pg.giro); total += f.colocadas;
          return incrustaImagenes(paginaSvg(f.cuerpo, estilo)).then(rasteriza).then(function (j) { jpegs.push(j); });
        });
      }, Promise.resolve()).then(function () { return { bytes: pdf(jpegs), paginas: jpegs.length, colocadas: total }; });
    });
  }

  window.SeparadorPdf = { crea: crea, guarda: guarda, nombreArchivo: nombreArchivo, folio: folio, paginaSvg: paginaSvg, pdf: pdf, incrustaImagenes: incrustaImagenes, A4W: A4W, A4H: A4H, PPM: PPM };
})();
