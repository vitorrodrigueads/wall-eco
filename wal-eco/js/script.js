/* =========================================================
   WALL-ECO — Green Friday | script.js
   ========================================================= */
(function () {
  'use strict';

  // ===== CONFIGURAÇÃO EDITÁVEL =====
  var WHATSAPP_NUMBER = '5500000000000'; // DDI + DDD + número, sem símbolos
  var IMG_PATH = 'assets/';              // pasta das imagens

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  // ----- Menu: muda de aparência ao rolar -----
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Menu hambúrguer -----
  function toggleMenu(force) {
    var open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () { toggleMenu(); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  // ----- Link ativo conforme a seção visível -----
  var links = menu.querySelectorAll('a[href^="#"]:not(.btn)');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });

  // ----- Scroll reveal -----
  var reveal = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });

  // ----- Contador animado (30%) -----
  function countUp(el) {
    var target = +el.dataset.count, start = null, dur = 1800;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counter = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(function (el) { counter.observe(el); });

  // ----- Botões com WhatsApp (data-wa) -----
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // ----- Imagens opcionais: se existir o arquivo em assets/, substitui a ilustração -----
  document.querySelectorAll('[data-img]').forEach(function (box) {
    var img = new Image();
    img.alt = '';
    img.loading = 'lazy';
    img.onload = function () {
      var old = box.querySelector('svg, span');
      if (old) old.style.display = 'none';
      box.appendChild(img);
    };
    img.src = IMG_PATH + box.dataset.img; // se não existir, nada acontece (mantém o SVG/emoji)
  });

  // ----- Ano no rodapé -----
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
