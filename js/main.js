/* ═══════════════════════════════════════════════════════════════
   ATHERA TECHNOLOGIES — main.js
   Lightweight vanilla JS. CSS-first philosophy.
   Only what cannot be done with CSS alone.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var nav       = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  var bgShift   = document.getElementById('bgShift');

  /* ── Scroll: Nav background + background parallax ──────── */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      var scrollY = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docH > 0 ? scrollY / docH : 0;

      /* Subtle background parallax */
      if (bgShift) {
        bgShift.style.transform = 'translateY(' + (progress * -60) + 'px)';
      }

      /* Nav solid state */
      if (nav) {
        nav.classList.toggle('scrolled', scrollY > 60);
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────────────── */
  if (hamburger && navLinks) {
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
  }

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Reveal on scroll (IntersectionObserver) ───────────── */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Counter animation ─────────────────────────────────── 
     Metrics with data-count animate from 0 to target.
     Metrics with data-text swap text when visible.
     Runs once, triggered by IntersectionObserver.
     ──────────────────────────────────────────────────────── */
  var counters = document.querySelectorAll('[data-count], [data-text]');

  if ('IntersectionObserver' in window && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        counterObserver.unobserve(el);

        /* Text replacement (e.g., "EU") */
        if (el.dataset.text) {
          el.textContent = el.dataset.text;
          return;
        }

        /* Numeric counter */
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var duration = 1800; /* ms */
        var start = performance.now();

        function step(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          /* Ease-out cubic */
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ── Active nav link (for single-page sections) ────────── */
  var sections  = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav__link');

  if (sections.length > 0 && navAnchors.length > 0) {
    function highlightNav() {
      var y = window.scrollY + 200;
      sections.forEach(function (s) {
        var top = s.offsetTop;
        var id  = s.getAttribute('id');
        if (y >= top && y < top + s.offsetHeight) {
          navAnchors.forEach(function (a) {
            var href = a.getAttribute('href');
            a.classList.toggle('active', href === '#' + id || href.endsWith('#' + id));
          });
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
  }

})();
