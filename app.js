/* Separador de palabras · la página (Gabinete Fönia · ColmenIA)
   Animación «cómo se usa», juego «¿dónde va el hueco?», taller para diseñar la tira,
   impresión (tiras, hoja de práctica y diploma) y lo de la comunidad: tarjeta de Skool y
   recuento anónimo, también por canal (?c=wa, tg, fb, ig, sk, ln). Con ?yo=1 un aparato deja
   de contar. El nombre del niño no se guarda ni se envía. Sin sintaxis nueva: iPad antiguos. */
(function () {
  'use strict';
  var S = window.SEPARADOR, QS;
  try { QS = new URLSearchParams(location.search); } catch (e) { QS = { get: function () { return null; } }; }
  function $(i) { return document.getElementById(i); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined && x !== null) e.textContent = x; return e; }
  var REDUCIDO = false; try { REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }

  /* ---------- recuento anónimo (solo sumas) ---------- */
  var SKOOL = 'https://www.skool.com/logopedia-7339/about';
  var CONTADOR = 'https://abacus.jasoncameron.dev/hit/foniafonia-separador-lanz/';
  var MIO = false;
  try { if (QS.get('yo') === '1') localStorage.setItem('separa-no-contar', '1'); if (QS.get('yo') === '0') localStorage.removeItem('separa-no-contar'); MIO = localStorage.getItem('separa-no-contar') === '1'; } catch (e) { }
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
    t.appendChild(el('span', null, 'En ColmenIA, la comunidad de logopedas, maestras y familias, salen juegos y materiales nuevos cada semana: Snake de palabras, Suena igual y los que van saliendo.'));
    a.appendChild(t); a.appendChild(el('span', 'ir', 'Entrar en Skool →'));
    a.appendChild(el('span', 'vuelta', 'La comunidad está en Skool: te registras una vez. Se abre aparte y esta página sigue aquí; si no la ves, vuelve con la flecha ← de atrás.'));
    a.addEventListener('click', function (ev) {
      if (!MIO) { suma('separa_skool_' + donde); suma('separa_skool_dia_' + hoy()); try { if (!localStorage.getItem('separa-fue-a-skool')) { localStorage.setItem('separa-fue-a-skool', '1'); suma('separa_skool_personas'); if (CANAL) suma('separa_skool_canal_' + CANAL); } } catch (e) { } }
      ev.preventDefault(); var w = null; try { w = window.open(SKOOL, '_blank'); if (w) w.opener = null; } catch (e) { w = null; }
      if (!w) setTimeout(function () { location.href = SKOOL; }, 350);
    });
    return a;
  }
  $('comunidad').appendChild(tarjeta('pagina'));
  (function () {
    var p = $('pie');
    p.appendChild(el('p', null, 'Una pieza del laboratorio de Gabinete Fönia y ColmenIA. Material de apoyo: no sustituye a la logopeda.'));
    var n = el('p'); n.appendChild(document.createTextNode('Sin registro. Lo que escribes no sale de este aparato. Solo se cuenta, de forma anónima, cuánta gente lo usa. '));
    var a = el('a', null, 'Privacidad'); a.href = 'privacidad.html'; n.appendChild(a); p.appendChild(n);
  })();

  /* ---------- cómo se usa (animación por pasos) ---------- */
  (function () {
    var PASOS = ['Así se usa la tira.', '1. Escribe la primera palabra.', '2. Pon el dedo justo donde acaba.', '3. Escribe la siguiente al otro lado del dedo.',
      '4. Corre la tira y vuelve a poner el dedo.', '5. Escribe la siguiente palabra.', '6. Quita la tira: ¡los huecos quedan perfectos!'];
    var p1 = $('p1'), p2 = $('p2'), p3 = $('p3'), tm = $('tiraMini'), h1 = $('h1'), h2 = $('h2'), txt = $('pasoTxt'), bol = $('bolitas');
    PASOS.forEach(function () { bol.appendChild(el('i')); });
    var DEDO = 14, x1 = 20, w1, w2, d1, d2, x2, x3;
    function mide() {
      try { w1 = p1.getComputedTextLength(); w2 = p2.getComputedTextLength(); } catch (e) { w1 = 30; w2 = 62; }
      if (!w1) { w1 = 30; w2 = 62; }
      d1 = x1 + w1 + 3 + DEDO / 2; x2 = d1 + DEDO / 2 + 3; d2 = x2 + w2 + 3 + DEDO / 2; x3 = d2 + DEDO / 2 + 3;
      p2.setAttribute('x', x2); p3.setAttribute('x', x3);
      h1.setAttribute('x', d1 - DEDO / 2); h2.setAttribute('x', d2 - DEDO / 2);
    }
    var paso = 0, auto = !REDUCIDO, reloj = null, enVista = true;
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
    function sigue() { clearTimeout(reloj); if (!auto || document.hidden || !enVista) return; reloj = setTimeout(function () { pon(paso + 1); sigue(); }, paso === 6 ? 3400 : 2400); }
    function boton() { $('pPausa').textContent = auto ? '⏸' : '▶︎ Auto'; $('pPausa').setAttribute('aria-label', auto ? 'Pausar' : 'Reproducir solo'); }
    $('pAdelante').onclick = function () { auto = false; boton(); clearTimeout(reloj); pon(paso + 1); una('separa_animacion'); };
    $('pAtras').onclick = function () { auto = false; boton(); clearTimeout(reloj); pon(paso - 1); };
    $('pPausa').onclick = function () { auto = !auto; boton(); sigue(); };
    document.addEventListener('visibilitychange', sigue);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { enVista = es[0].isIntersecting; sigue(); }).observe($('escena'));
    boton();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { pon(paso); });
    pon(0); sigue();
  })();

  /* ---------- pruébalo: ¿dónde va el hueco? ---------- */
  (function () {
    var FRASES = ['el sol', 'mi mamá', 'la casa', 'el gato come', 'mamá me mima', 'el perro corre', 'la luna brilla', 'papá lee un cuento', 'me gusta el helado', 'la abeja vuela alto', 'veo un pez rojo', 'mi oso tiene sueño'];
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
      frase = FRASES[n % FRASES.length]; caja.innerHTML = ''; msg.textContent = '';
      var pal = frase.split(' '), letras = pal.join(''), cortes = {}, acc = 0;
      pal.forEach(function (w, i) { acc += w.length; if (i < pal.length - 1) cortes[acc - 1] = true; });
      faltan = pal.length - 1;
      for (var i = 0; i < letras.length; i++) {
        caja.appendChild(el('span', 'letra', letras.charAt(i)));
        if (i < letras.length - 1) {
          var b = el('button', 'hu'); b.type = 'button'; b.setAttribute('aria-label', 'Hueco entre «' + letras.charAt(i) + '» y «' + letras.charAt(i + 1) + '»');
          b.dataset.bien = cortes[i] ? '1' : ''; b.onclick = toca; caja.appendChild(b);
        }
      }
    }
    function toca() {
      var b = this; if (b.className.indexOf('ok') >= 0) return;
      if (b.dataset.bien) {
        b.className = 'hu ok'; b.setAttribute('aria-label', 'Hueco puesto'); faltan--;
        if (faltan <= 0) { msg.textContent = '¡Muy bien! «' + frase + '»'; voz(frase); terminadas++; if (terminadas === 1) una('separa_juego_frase'); if (terminadas === 5) una('separa_juego_cinco'); }
        else msg.textContent = '¡Eso es! Busca el siguiente hueco.';
      } else {
        b.className = 'hu mal'; msg.textContent = 'Ahí no acaba ninguna palabra. Léelo despacio.'; setTimeout(function () { b.className = 'hu'; }, 450);
      }
    }
    $('jSig').onclick = function () { n++; monta(); };
    $('jOir').onclick = function () { voz(frase); };
    monta();
  })();

  /* ---------- taller ---------- */
  var A = { modelo: 'punta', color: 'turquesa', piel: 'clara', fw: 14, L: 260, zurdo: false, regla: true, mezcla: false, frase: 'DEJA ESPACIO', otra: '' };
  try { var g = JSON.parse(localStorage.getItem('separa-ajustes') || 'null'); if (g) for (var k in g) if (A.hasOwnProperty(k)) A[k] = g[k]; } catch (e) { }
  function guarda() { try { localStorage.setItem('separa-ajustes', JSON.stringify(A)); } catch (e) { } }
  function nombre() { return String($('nombre').value || '').replace(/[<>]/g, '').trim(); }
  function frase() { return A.frase === '_otra' ? (A.otra || '').trim() : A.frase; }
  function opciones(o) { return { L: A.L, fw: A.fw, modelo: A.modelo, color: o && o.color || A.color, piel: A.piel, zurdo: A.zurdo, regla: A.regla, frase: frase(), nombre: nombre(), marca: true, i: o && o.i || 0 }; }

  function grupo(id, clave, num) {
    var bs = $(id).querySelectorAll('button');
    function marca() { for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i].getAttribute('data-v')) === String(A[clave])); }
    for (var i = 0; i < bs.length; i++) bs[i].onclick = function () { var v = this.getAttribute('data-v'); A[clave] = num ? +v : v; marca(); cambia(); };
    marca();
  }
  function muestras(id, clave, lista, nombres) {
    var c = $(id);
    lista.forEach(function (v) {
      var b = el('button'); b.type = 'button'; b.setAttribute('data-v', v); b.setAttribute('aria-label', nombres[v] || v); b.title = nombres[v] || v;
      if (v === 'tinta') { b.className = 'tinta'; b.textContent = 'B/N'; } else b.style.background = (clave === 'piel' ? S.PIELES[v] : S.COLORES[v])[0];
      b.onclick = function () { A[clave] = v; marca(); cambia(); }; c.appendChild(b);
    });
    function marca() { var bs = c.querySelectorAll('button'); for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-v') === A[clave]); }
    marca();
  }
  muestras('oColor', 'color', S.ORDEN.concat(['tinta']), { turquesa: 'Turquesa', coral: 'Coral', naranja: 'Naranja', verde: 'Verde', lila: 'Lila', azul: 'Azul', tinta: 'Blanco y negro (ahorra tinta)' });
  muestras('oPiel', 'piel', ['clara', 'media', 'oscura'], { clara: 'Piel clara', media: 'Piel morena', oscura: 'Piel oscura' });
  grupo('oModelo', 'modelo'); grupo('oDedo', 'fw', true); grupo('oLargo', 'L', true);
  $('cZurdo').checked = A.zurdo; $('cRegla').checked = A.regla; $('cMezcla').checked = A.mezcla;
  $('cZurdo').onchange = function () { A.zurdo = this.checked; cambia(); };
  $('cRegla').onchange = function () { A.regla = this.checked; cambia(); };
  $('cMezcla').onchange = function () { A.mezcla = this.checked; cambia(); };
  var sel = $('frasePre');
  (function () { var ok = false; for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === A.frase) ok = true; if (!ok) A.frase = 'DEJA ESPACIO'; sel.value = A.frase; })();
  $('fraseOtra').value = A.otra || '';
  function verOtra() { $('fraseOtra').style.display = A.frase === '_otra' ? 'block' : 'none'; }
  sel.onchange = function () { A.frase = sel.value; verOtra(); if (A.frase === '_otra') $('fraseOtra').focus(); cambia(); };
  $('fraseOtra').oninput = function () { A.otra = this.value; cambia(); };
  $('nombre').oninput = function () { cambia(); };
  verOtra();

  function reparto(t) {
    var porFila = Math.max(1, Math.floor((281 + 2) / (t.w + 2))), filas = Math.max(1, Math.floor((193 + 3) / (t.h + 3)));
    return { porFila: porFila, filas: filas, porHoja: porFila * filas };
  }
  var tPersonal = null;
  function cambia() {
    guarda();
    $('modeloAyuda').textContent = {
      punta: 'La tira se pone cruzando el renglón y el dedo entra justo donde acaba la palabra.',
      dospuntas: 'Como la de la punta, con un dedo en cada extremo: vale para los dos lados y para diestros y zurdos.',
      medio: 'La tira va a lo largo, debajo del renglón: una palabra antes del dedo y la siguiente después.',
      puntas: 'Los dos dedos marcan dónde empieza y dónde acaba una palabra: la palabra se escribe entre ellos.'
    }[A.modelo] || '';
    var t = S.tira(opciones());
    $('vista').innerHTML = t.svg;
    var r = reparto(t);
    $('medidas').textContent = 'Cada tira mide ' + (t.w / 10).toFixed(1).replace('.', ',') + ' × ' + (t.h / 10).toFixed(1).replace('.', ',') + ' cm con el borde. Caben ' + r.porHoja + ' en un folio tumbado.';
    clearTimeout(tPersonal); tPersonal = setTimeout(function () { una('separa_personaliza'); }, 4000);
  }
  cambia();

  /* las manos se piden antes, para que estén cuando se imprima */
  setTimeout(function () {
    ['clara', 'morena', 'oscura'].forEach(function (p) { for (var i = 1; i <= 6; i++) new Image().src = 'arte/mano-' + p + '-' + i + '.png'; });
    new Image().src = 'arte/mano-linea.png';
  }, 1500);

  /* ---------- imprimir ---------- */
  var caja = $('imprimir');
  function paginas(lista) {
    caja.innerHTML = '';
    lista.forEach(function (svgs) { var p = el('div', 'pag'); p.innerHTML = svgs.join(''); caja.appendChild(p); });
  }
  function imprime(clave) {
    suma('separa_' + clave); suma('separa_imprime_dia_' + hoy());
    pendiente = true;
    var urls = {}, faltan = 0, hecho = false;
    caja.innerHTML.replace(/href="(arte\/[^"]+)"/g, function (m, u) { urls[u] = 1; });
    function ya() { if (hecho) return; hecho = true; setTimeout(function () { try { window.print(); } catch (e) { } }, 80); }
    Object.keys(urls).forEach(function (u) { faltan++; var im = new Image(); im.onload = im.onerror = function () { if (--faltan <= 0) ya(); }; im.src = u; });
    if (!faltan) ya(); setTimeout(ya, 2500);
  }
  $('bTiras').onclick = function () {
    var t0 = S.tira(opciones()), r = reparto(t0), hojas = $('cDos').checked ? 2 : 1, lista = [];
    for (var h = 0; h < hojas; h++) {
      var svgs = [];
      for (var i = 0; i < r.porHoja; i++) {
        var n = h * r.porHoja + i;
        svgs.push(S.tira(opciones(A.mezcla ? { color: S.ORDEN[n % S.ORDEN.length], i: n } : { i: n })).svg);
      }
      lista.push(svgs);
    }
    paginas(lista); imprime('imprime_tiras');
  };
  $('bHoja').onclick = function () {
    var fr = String($('frasesHoja').value || '').split('\n').map(function (x) { return x.replace(/[<>]/g, '').trim(); }).filter(Boolean).slice(0, 12);
    if (!fr.length) fr = ['el sol sale'];
    paginas(S.hoja(fr, { fw: A.fw, piel: A.piel, color: A.color, nombre: nombre() }).map(function (s) { return [s]; }));
    imprime('imprime_hoja');
  };
  $('bDiploma').onclick = function () { paginas([[S.diploma({ piel: A.piel, color: A.color, nombre: nombre() })]]); imprime('imprime_diploma'); };

  /* ---------- después de imprimir: «¿ya la tienes?» (una vez por visita, si no ha ido ya a Skool) ---------- */
  var pendiente = false, gracias = $('vGracias');
  $('gCta').appendChild(tarjeta('tras_imprimir'));
  function cierra() { gracias.className = 'velo'; }
  $('gX').onclick = cierra; gracias.addEventListener('click', function (e) { if (e.target === gracias) cierra(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cierra(); });
  window.addEventListener('afterprint', function () {
    if (!pendiente) return; pendiente = false;
    try { if (localStorage.getItem('separa-fue-a-skool') || sessionStorage.getItem('separa-gracias')) return; sessionStorage.setItem('separa-gracias', '1'); } catch (e) { }
    setTimeout(function () { gracias.className = 'velo on'; suma('separa_gracias_vista'); $('gX').focus(); }, 400);
  });
})();
