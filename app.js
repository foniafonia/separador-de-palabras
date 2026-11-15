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
  var REDUCIDO = false; try { REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }

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
  var A = { modelo: 'medio', color: 'mix', fw: 12, frase: '_var', otra: '', piel: '_var', regla: true, firma: FONIA ? 'fonia' : 'ambas', firmaPropia: '' };
  try { var g = JSON.parse(localStorage.getItem('separa-ajustes3') || 'null'); if (g) for (var k in g) if (A.hasOwnProperty(k)) A[k] = g[k]; } catch (e) { }
  if (!/^(medio|puntas)$/.test(A.modelo)) A.modelo = 'medio';
  if ([10, 12, 16].indexOf(+A.fw) < 0) A.fw = 12;
  function guarda() { try { localStorage.setItem('separa-ajustes3', JSON.stringify(A)); } catch (e) { } }
  function nombre() { return String($('nombre').value || '').replace(/[<>]/g, '').trim(); }
  function limpio(s) { return String(s || '').replace(/[<>]/g, '').trim(); }
  function marca() {
    var m = { ambas: 'ColmenIA · Gabinete Fönia', colmenia: 'ColmenIA', fonia: 'Gabinete Fönia', no: '' };
    return m.hasOwnProperty(A.firma) ? m[A.firma] : limpio(A.firmaPropia);
  }
  function tira(n) {
    var uno = A.modelo !== 'puntas';
    return S.tira({
      L: uno ? 88 : 184, fw: +A.fw, modelo: A.modelo, lado: uno ? 'izq' : '', regla: A.regla, zurdo: false, i: n,
      color: A.color === 'mix' ? S.ORDEN[n % S.ORDEN.length] : A.color,
      piel: A.piel === '_var' ? PIELES[n % 3] : A.piel,
      frase: A.frase === '_var' ? FRASES[n % FRASES.length] : (A.frase === '_otra' ? limpio(A.otra) : A.frase),
      nombre: nombre(), marca: marca()
    });
  }
  /* folio vertical (los móviles no hacen caso al folio tumbado): caja útil 194 × 280 mm */
  function porFolio() {
    var t = tira(0), col = Math.max(1, Math.floor((194 + 2) / (t.w + 2))), fil = Math.max(1, Math.floor((280 + 3) / (t.h + 3)));
    return col * fil;
  }

  function grupo(id, clave, num) {
    var bs = $(id).querySelectorAll('button');
    function pinta() { for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i].getAttribute('data-v')) === String(A[clave])); }
    for (var i = 0; i < bs.length; i++) bs[i].onclick = function () { var v = this.getAttribute('data-v'); A[clave] = num ? +v : v; pinta(); cambia(); };
    pinta();
  }
  grupo('oModelo', 'modelo'); grupo('oPiel', 'piel'); grupo('oDedo', 'fw', true);

  var NOMBRES = { mix: 'De colores', turquesa: 'Turquesa', coral: 'Coral', naranja: 'Naranja', verde: 'Verde', lila: 'Lila', azul: 'Azul', tinta: 'Blanco y negro (ahorra tinta)' };
  var cc = $('oColor');
  ['mix'].concat(S.ORDEN, ['tinta']).forEach(function (v) {
    var b = el('button'); b.type = 'button'; b.setAttribute('data-v', v); b.setAttribute('aria-label', NOMBRES[v]); b.title = NOMBRES[v];
    if (v === 'mix') b.className = 'mix'; else if (v === 'tinta') { b.className = 'bn'; b.textContent = 'B/N'; } else b.style.background = S.COLORES[v][0];
    b.onclick = function () { A.color = v; marcaColor(); cambia(); }; cc.appendChild(b);
  });
  function marcaColor() { var bs = cc.querySelectorAll('button'); for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-v') === A.color); }
  marcaColor();

  var sel = $('frasePre');
  (function () { var ok = false; for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === A.frase) ok = true; if (!ok) A.frase = '_var'; sel.value = A.frase; })();
  $('fraseOtra').value = A.otra || '';
  function verOtra() { $('fraseOtra').style.display = A.frase === '_otra' ? 'block' : 'none'; }
  sel.onchange = function () { A.frase = sel.value; verOtra(); if (A.frase === '_otra') $('fraseOtra').focus(); cambia(); };
  $('fraseOtra').oninput = function () { A.otra = this.value; cambia(); };
  $('cRegla').checked = A.regla; $('cRegla').onchange = function () { A.regla = this.checked; cambia(); };
  $('firma').value = A.firma; $('firmaPropia').value = A.firmaPropia || '';
  function verFirma() { $('firmaPropia').style.display = A.firma === 'propia' ? 'block' : 'none'; }
  $('firma').onchange = function () { A.firma = this.value; verFirma(); if (A.firma === 'propia') $('firmaPropia').focus(); cambia(); };
  $('firmaPropia').oninput = function () { A.firmaPropia = this.value; cambia(); };
  verOtra(); verFirma();

  var tPersonal = null;
  function cambia() {
    guarda();
    $('vista').className = A.modelo === 'puntas' ? 'vista una' : 'vista';
    $('vista').innerHTML = A.modelo === 'puntas' ? tira(0).svg : tira(0).svg + tira(1).svg;
    $('cuantas').textContent = porFolio();
    clearTimeout(tPersonal); tPersonal = setTimeout(function () { una('separa_personaliza'); }, 4000);
  }
  $('nombre').oninput = cambia;
  cambia();

  /* las manos se piden antes, para que estén cuando se imprima */
  setTimeout(function () {
    ['clara', 'morena', 'oscura'].forEach(function (p) { for (var i = 1; i <= 6; i++) new Image().src = 'arte/mano-' + p + '-' + i + '.png'; });
    new Image().src = 'arte/mano-linea.png';
  }, 1500);

  /* desplegables abiertos: se cuentan (sin datos) para saber cuáles se usan */
  var ds = document.querySelectorAll('.mas details');
  for (var di = 0; di < ds.length; di++) (function (d, n) { d.addEventListener('toggle', function () { if (d.open) una('separa_abre_' + n); }); })(ds[di], di);

  /* ---------- verlo paso a paso (animación; solo se mueve si está abierta y a la vista) ---------- */
  (function () {
    var PASOS = ['Así se usa la tira.', '1. Escribe la primera palabra.', '2. Pon el dedo justo donde acaba.', '3. Escribe la siguiente al otro lado del dedo.',
      '4. Corre la tira y vuelve a poner el dedo.', '5. Escribe la siguiente palabra.', '6. Quita la tira: ¡los huecos quedan perfectos!'];
    var p1 = $('p1'), p2 = $('p2'), p3 = $('p3'), tm = $('tiraMini'), h1 = $('h1'), h2 = $('h2'), txt = $('pasoTxt'), bol = $('bolitas'), caja = $('dAnim');
    PASOS.forEach(function () { bol.appendChild(el('i')); });
    var DEDO = 14, x1 = 20, w1, w2, d1, d2, x2, x3;
    function mide() {
      try { w1 = p1.getComputedTextLength(); w2 = p2.getComputedTextLength(); } catch (e) { w1 = 0; }
      if (!w1) { w1 = 30; w2 = 62; }
      d1 = x1 + w1 + 3 + DEDO / 2; x2 = d1 + DEDO / 2 + 3; d2 = x2 + w2 + 3 + DEDO / 2; x3 = d2 + DEDO / 2 + 3;
      p2.setAttribute('x', x2); p3.setAttribute('x', x3);
      h1.setAttribute('x', d1 - DEDO / 2); h2.setAttribute('x', d2 - DEDO / 2);
    }
    var paso = 0, auto = !REDUCIDO, reloj = null, enVista = false;
    function pon(n) {
      paso = (n + PASOS.length) % PASOS.length; mide();
      p1.setAttribute('class', 'pal' + (paso >= 1 ? ' on' : ''));
      p2.setAttribute('class', 'pal' + (paso >= 3 ? ' on' : ''));
      p3.setAttribute('class', 'pal' + (paso >= 5 ? ' on' : ''));
      h1.setAttribute('class', 'hueco' + (paso === 6 ? ' on' : '')); h2.setAttribute('class', 'hueco' + (paso === 6 ? ' on' : ''));
      var x = paso < 2 ? -120 : (paso < 4 ? d1 : (paso < 6 ? d2 : 470));
      tm.style.transform = 'translate(' + x + 'px,0)';
      txt.textContent = PASOS[paso];
      var bs = bol.children; for (var i = 0; i < bs.length; i++) bs[i].className = i === paso ? 'on' : '';
    }
    function sigue() { clearTimeout(reloj); if (!auto || document.hidden || !enVista || !caja.open) return; reloj = setTimeout(function () { pon(paso + 1); sigue(); }, paso === 6 ? 3400 : 2400); }
    function boton() { $('pPausa').textContent = auto ? '⏸' : '▶︎ Auto'; $('pPausa').setAttribute('aria-label', auto ? 'Pausar' : 'Reproducir solo'); }
    $('pAdelante').onclick = function () { auto = false; boton(); clearTimeout(reloj); pon(paso + 1); };
    $('pAtras').onclick = function () { auto = false; boton(); clearTimeout(reloj); pon(paso - 1); };
    $('pPausa').onclick = function () { auto = !auto; boton(); sigue(); };
    document.addEventListener('visibilitychange', sigue);
    caja.addEventListener('toggle', function () { if (caja.open) { enVista = true; pon(0); } sigue(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { enVista = es[0].isIntersecting; sigue(); }).observe($('escena'));
    boton(); pon(0);
  })();

  /* ---------- pruébalo: ¿dónde va el hueco? ---------- */
  (function () {
    var FR = ['el sol', 'mi mamá', 'la casa', 'el gato come', 'mamá me mima', 'el perro corre', 'la luna brilla', 'papá lee un cuento', 'me gusta el helado', 'la abeja vuela alto', 'veo un pez rojo', 'mi oso tiene sueño'];
    var caja = $('frase'), msg = $('jmsg'), n = 0, frase = '', faltan = 0, terminadas = 0;
    function voz(t) {
      try {
        if (!window.speechSynthesis) return; speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(t); u.lang = 'es-ES'; u.rate = 0.85;
        var vs = speechSynthesis.getVoices().filter(function (v) { return /^es/i.test(v.lang); }); if (vs.length) u.voice = vs.filter(function (v) { return /es-ES/i.test(v.lang); })[0] || vs[0];
        speechSynthesis.speak(u);
      } catch (e) { }
    }
    function monta() {
      frase = FR[n % FR.length]; caja.innerHTML = ''; msg.textContent = '';
      var pal = frase.split(' '), letras = pal.join(''), cortes = {}, acc = 0;
      pal.forEach(function (w, i) { acc += w.length; if (i < pal.length - 1) cortes[acc - 1] = true; });
      faltan = pal.length - 1;
      for (var i = 0; i < letras.length; i++) {
        caja.appendChild(el('span', 'letra', letras.charAt(i)));
        if (i < letras.length - 1) {
          var b = el('button', 'hu'); b.type = 'button'; b.setAttribute('aria-label', 'Hueco entre «' + letras.charAt(i) + '» y «' + letras.charAt(i + 1) + '»');
          b.setAttribute('data-bien', cortes[i] ? '1' : ''); b.onclick = toca; caja.appendChild(b);
        }
      }
    }
    function toca() {
      var b = this; if (b.className.indexOf('ok') >= 0) return;
      if (b.getAttribute('data-bien')) {
        b.className = 'hu ok'; b.setAttribute('aria-label', 'Hueco puesto'); faltan--;
        if (faltan <= 0) { msg.textContent = '¡Muy bien! «' + frase + '»'; voz(frase); terminadas++; if (terminadas === 1) una('separa_juego_frase'); }
        else msg.textContent = '¡Eso es! Busca el siguiente hueco.';
      } else {
        b.className = 'hu mal'; msg.textContent = 'Ahí no acaba ninguna palabra. Léelo despacio.'; setTimeout(function () { b.className = 'hu'; }, 450);
      }
    }
    $('jSig').onclick = function () { n++; monta(); };
    $('jOir').onclick = function () { voz(frase); };
    monta();
  })();

  /* ---------- imprimir: folio vertical ---------- */
  var caja = $('imprimir'), pendiente = false;
  function imprime(paginas, giro, clave) {
    caja.innerHTML = '';
    paginas.forEach(function (svgs) { var p = el('div', 'pag' + (giro ? ' giro' : '')); p.innerHTML = svgs.join(''); caja.appendChild(p); });
    suma('separa_' + clave); suma('separa_imprime_dia_' + hoy());
    pendiente = true;
    var urls = {}, faltan = 0, hecho = false;
    caja.innerHTML.replace(/href="(arte\/[^"]+)"/g, function (m, u) { urls[u] = 1; });
    function ya() { if (hecho) return; hecho = true; setTimeout(function () { try { window.print(); } catch (e) { } }, 80); }
    Object.keys(urls).forEach(function (u) { faltan++; var im = new Image(); im.onload = im.onerror = function () { if (--faltan <= 0) ya(); }; im.src = u; });
    if (!faltan) ya(); setTimeout(ya, 2500);
  }
  $('bTiras').onclick = function () {
    var svgs = [], N = porFolio(); for (var n = 0; n < N; n++) svgs.push(tira(n).svg);
    imprime([svgs], false, 'imprime_tiras');
  };
  function pielUna() { return A.piel === '_var' ? 'clara' : A.piel; }
  function colorUno() { return A.color === 'mix' ? 'turquesa' : A.color; }
  $('bHoja').onclick = function () {
    var fr = String($('frasesHoja').value || '').split('\n').map(limpio).filter(Boolean).slice(0, 12);
    if (!fr.length) fr = ['el sol sale'];
    imprime(S.hoja(fr, { fw: +A.fw, piel: pielUna(), color: colorUno(), nombre: nombre() }).map(function (s) { return [s]; }), true, 'imprime_hoja');
  };
  $('bDiploma').onclick = function () { imprime([[S.diploma({ piel: pielUna(), color: colorUno(), nombre: nombre() })]], true, 'imprime_diploma'); };

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
