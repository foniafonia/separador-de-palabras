/* Separador de palabras · la página (Gabinete Fönia · ColmenIA)
   Página corta: cómo se usa, nombre, un dedo o dos, color e imprimir (4 tiras por folio,
   frases y pieles variadas como las hojas de José). Tarjeta de Skool y recuento anónimo, también
   por canal (?c=wa, tg, fb, ig, sk, ln). Con ?yo=1 un aparato deja de contar. El nombre del niño
   no se guarda ni se envía. Sin sintaxis nueva: iPad antiguos. */
(function () {
  'use strict';
  var S = window.SEPARADOR, QS;
  try { QS = new URLSearchParams(location.search); } catch (e) { QS = { get: function () { return null; } }; }
  function $(i) { return document.getElementById(i); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined && x !== null) e.textContent = x; return e; }

  /* ---------- dentro de Fönia: sin recuento ni Skool, con la marca de Fönia ---------- */
  var FONIA = /fonia-materiales|fonia-demo/.test(location.hostname) || QS.get('fonia') === '1' || !!window.SEPARADOR_FONIA;
  if (FONIA) {
    document.body.className += ' fonia';
    document.title = 'Separador de palabras · Gabinete Fönia';
    $('marca').href = window.SEPARADOR_VOLVER || '/';
    $('nombre').placeholder = 'Nombre del paciente';
  }

  /* ---------- recuento anónimo (solo sumas) ---------- */
  var SKOOL = 'https://www.skool.com/logopedia-7339/about';
  var CONTADOR = 'https://abacus.jasoncameron.dev/hit/foniafonia-separador-lanz/';
  var MIO = FONIA;
  if (!FONIA) try { if (QS.get('yo') === '1') localStorage.setItem('separa-no-contar', '1'); if (QS.get('yo') === '0') localStorage.removeItem('separa-no-contar'); MIO = localStorage.getItem('separa-no-contar') === '1'; } catch (e) { }
  function hoy() { var d = new Date(); return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2); }
  function suma(k) { if (MIO) return; try { new Image().src = CONTADOR + k + '?t=' + Date.now().toString(36); } catch (e) { } }
  var CANAL = (function () { var c = (QS.get('c') || '').toLowerCase(); return /^(wa|tg|fb|ig|sk|ln)$/.test(c) ? c : ''; })();
  suma('separa_aperturas'); suma('separa_aperturas_' + hoy());
  if (CANAL) suma('separa_canal_' + CANAL);
  try {
    if (!MIO && !localStorage.getItem('separa-visto')) { localStorage.setItem('separa-visto', hoy()); suma('separa_personas'); suma('separa_personas_' + hoy()); if (CANAL) suma('separa_personas_canal_' + CANAL); }
  } catch (e) { }
  function una(k) { try { if (sessionStorage.getItem('separa-' + k)) return; sessionStorage.setItem('separa-' + k, '1'); } catch (e) { } suma(k); }

  /* ---------- tarjeta de la comunidad ---------- */
  function tarjeta(donde) {
    var a = el('a', 'cta'); a.href = SKOOL; a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(el('span', 'abeja', '🐝'));
    var t = el('span', 'txt'); t.appendChild(el('b', null, '¿Quieres más material como este?'));
    t.appendChild(el('span', null, 'En ColmenIA, la comunidad de logopedas, maestras y familias, sale material nuevo cada semana.'));
    a.appendChild(t); a.appendChild(el('span', 'ir', 'Entrar en Skool →'));
    a.appendChild(el('span', 'vuelta', 'Se abre aparte y esta página sigue aquí; si no la ves, vuelve con la flecha ← de atrás.'));
    a.addEventListener('click', function (ev) {
      if (!MIO) { suma('separa_skool_' + donde); suma('separa_skool_dia_' + hoy()); try { if (!localStorage.getItem('separa-fue-a-skool')) { localStorage.setItem('separa-fue-a-skool', '1'); suma('separa_skool_personas'); if (CANAL) suma('separa_skool_canal_' + CANAL); } } catch (e) { } }
      ev.preventDefault(); var w = null; try { w = window.open(SKOOL, '_blank'); if (w) w.opener = null; } catch (e) { w = null; }
      if (!w) setTimeout(function () { location.href = SKOOL; }, 350);
    });
    return a;
  }
  if (!FONIA) $('comunidad').appendChild(tarjeta('pagina'));
  (function () {
    var p = $('pie');
    p.appendChild(el('p', null, 'Gabinete Fönia y ColmenIA. Material de apoyo: no sustituye a la logopeda.'));
    if (FONIA) return;
    var n = el('p'); n.appendChild(document.createTextNode('Sin registro. El nombre no sale de este aparato. Solo se cuenta, sin datos, cuánta gente lo usa. '));
    var a = el('a', null, 'Privacidad'); a.href = 'privacidad.html'; n.appendChild(a); p.appendChild(n);
  })();

  /* ---------- la tira ---------- */
  var FRASES = ['DEJA ESPACIO', 'AQUÍ VA EL HUECO', 'SEPARA', 'ESPACIO'];
  var PIELES = ['clara', 'media', 'oscura'];
  var A = { modelo: 'medio', color: 'mix' };
  try { var g = JSON.parse(localStorage.getItem('separa-ajustes2') || 'null'); if (g) { if (/^(medio|puntas)$/.test(g.modelo)) A.modelo = g.modelo; if (g.color) A.color = g.color; } } catch (e) { }
  function guarda() { try { localStorage.setItem('separa-ajustes2', JSON.stringify(A)); } catch (e) { } }
  function nombre() { return String($('nombre').value || '').replace(/[<>]/g, '').trim(); }
  function tira(n) {
    return S.tira({
      L: 130, fw: 14, modelo: A.modelo, regla: true, zurdo: false, i: n,
      color: A.color === 'mix' ? S.ORDEN[n % S.ORDEN.length] : A.color,
      piel: PIELES[n % 3], frase: FRASES[n % FRASES.length], nombre: nombre(),
      marca: FONIA ? 'Gabinete Fönia' : 'ColmenIA · Gabinete Fönia'
    });
  }

  var bm = $('oModelo').querySelectorAll('button');
  function marcaModelo() { for (var i = 0; i < bm.length; i++) bm[i].setAttribute('aria-pressed', bm[i].getAttribute('data-v') === A.modelo); }
  for (var i = 0; i < bm.length; i++) bm[i].onclick = function () { A.modelo = this.getAttribute('data-v'); marcaModelo(); cambia(); };
  marcaModelo();

  var NOMBRES = { mix: 'De colores', turquesa: 'Turquesa', coral: 'Coral', naranja: 'Naranja', verde: 'Verde', lila: 'Lila', azul: 'Azul', tinta: 'Blanco y negro (ahorra tinta)' };
  var cc = $('oColor');
  ['mix'].concat(S.ORDEN, ['tinta']).forEach(function (v) {
    var b = el('button'); b.type = 'button'; b.setAttribute('data-v', v); b.setAttribute('aria-label', NOMBRES[v]); b.title = NOMBRES[v];
    if (v === 'mix') b.className = 'mix'; else if (v === 'tinta') { b.className = 'bn'; b.textContent = 'B/N'; } else b.style.background = S.COLORES[v][0];
    b.onclick = function () { A.color = v; marcaColor(); cambia(); }; cc.appendChild(b);
  });
  function marcaColor() { var bs = cc.querySelectorAll('button'); for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-v') === A.color); }
  marcaColor();

  var tPersonal = null;
  function cambia() {
    guarda();
    $('vista').innerHTML = tira(0).svg + tira(1).svg;
    clearTimeout(tPersonal); tPersonal = setTimeout(function () { una('separa_personaliza'); }, 4000);
  }
  $('nombre').oninput = cambia;
  cambia();

  /* las manos se piden antes, para que estén cuando se imprima */
  setTimeout(function () {
    ['clara', 'morena', 'oscura'].forEach(function (p) { for (var i = 1; i <= 6; i++) new Image().src = 'arte/mano-' + p + '-' + i + '.png'; });
    new Image().src = 'arte/mano-linea.png';
  }, 1500);

  /* ---------- imprimir: 4 tiras por folio tumbado ---------- */
  var caja = $('imprimir'), pendiente = false;
  $('bTiras').onclick = function () {
    var svgs = []; for (var n = 0; n < 4; n++) svgs.push(tira(n).svg);
    caja.innerHTML = ''; var p = el('div', 'pag'); p.innerHTML = svgs.join(''); caja.appendChild(p);
    suma('separa_imprime_tiras'); suma('separa_imprime_dia_' + hoy());
    pendiente = true;
    var urls = {}, faltan = 0, hecho = false;
    caja.innerHTML.replace(/href="(arte\/[^"]+)"/g, function (m, u) { urls[u] = 1; });
    function ya() { if (hecho) return; hecho = true; setTimeout(function () { try { window.print(); } catch (e) { } }, 80); }
    Object.keys(urls).forEach(function (u) { faltan++; var im = new Image(); im.onload = im.onerror = function () { if (--faltan <= 0) ya(); }; im.src = u; });
    if (!faltan) ya(); setTimeout(ya, 2500);
  };

  /* ---------- después de imprimir: «¿ya la tienes?» (una vez por visita, si no ha ido ya a Skool) ---------- */
  var gracias = $('vGracias');
  if (!FONIA) $('gCta').appendChild(tarjeta('tras_imprimir'));
  function cierra() { gracias.className = 'velo'; }
  $('gX').onclick = cierra; gracias.addEventListener('click', function (e) { if (e.target === gracias) cierra(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cierra(); });
  window.addEventListener('afterprint', function () {
    if (!pendiente) return; pendiente = false; if (FONIA) return;
    try { if (localStorage.getItem('separa-fue-a-skool') || sessionStorage.getItem('separa-gracias')) return; sessionStorage.setItem('separa-gracias', '1'); } catch (e) { }
    setTimeout(function () { gracias.className = 'velo on'; suma('separa_gracias_vista'); $('gX').focus(); }, 400);
  });
})();
