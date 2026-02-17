(function () {
  'use strict';

  var nav       = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  var bgShift   = document.getElementById('bgShift');

  /* ── Scroll-reactive background + nav ──────────────
     bgShift moves vertically as you scroll, creating
     a subtle parallax between the ambient gradient mesh
     and the foreground content surfaces.
     ──────────────────────────────────────────────────── */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      var scrollY = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docH > 0 ? scrollY / docH : 0;

      // Background parallax: mesh drifts up 80px total
      bgShift.style.transform = 'translateY(' + (progress * -80) + 'px)';

      // Nav solid on scroll
      nav.classList.toggle('scrolled', scrollY > 40);

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────────── */
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Normal scroll for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  });

  /* ── Reveal on scroll ──────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Active nav link ───────────────────────────────── */
  var sections  = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav__link');

  function highlightNav() {
    var y = window.scrollY + 160;
    sections.forEach(function (s) {
      var top = s.offsetTop;
      var id  = s.getAttribute('id');
      if (y >= top && y < top + s.offsetHeight) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // Fullpage scroll snap disabled — normal scrolling enabled

})();
