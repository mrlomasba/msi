/* ============================================
   MSI - Mantenimiento y Servicios Industriales
   main.js
   ============================================ */

'use strict';

/* ── LOADER ── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const bar     = document.querySelector('.loader-bar');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2400);
  });

  // Fallback: hide after 3.5s regardless
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3500);
})();


/* ── HEADER SCROLL ── */
(function initHeader() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── HAMBURGER / MOBILE NAV ── */
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const header    = document.querySelector('header');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    if (header) {
      header.classList.toggle('open-menu');
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      if (header) {
        header.classList.remove('open-menu');
      }
    });
  });
})();


/* ── HERO CAROUSEL ── */
(function initCarousel() {
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.carousel-dot');
  const prevBtn  = document.querySelector('.carousel-arrow.prev');
  const nextBtn  = document.querySelector('.carousel-arrow.next');
  let current    = 0;
  let timer      = null;
  const INTERVAL = 5000;

  if (!slides.length) return;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function start() {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function reset() {
    clearInterval(timer);
    start();
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); reset(); });
  });

  // Arrow clicks
  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); reset(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); reset(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); reset(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); reset(); }
  });

  // Touch / swipe
  let touchStartX = 0;
  const heroEl = document.getElementById('hero');
  heroEl && heroEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  heroEl && heroEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); reset(); }
  }, { passive: true });

  // Init
  goTo(0);
  start();
})();


/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .feature-item');

  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
})();


/* ── SMOOTH SCROLL for nav links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // header height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.count-up');

  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const step   = target / (dur / 16);
      let  current = 0;

      const tick = () => {
        current += step;
        if (current >= target) {
          el.textContent = target + (el.dataset.suffix || '');
          return;
        }
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ── CONTACT FORM ── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = form.querySelector('.form-submit');
    const name = form.querySelector('[name="nombre"]').value.trim();
    const phone= form.querySelector('[name="telefono"]').value.trim();
    const serv = form.querySelector('[name="servicio"]').value;
    const msg  = form.querySelector('[name="mensaje"]').value.trim();

    if (!name || !phone || !serv) {
      showFormMsg(form, '⚠ Por favor completa los campos requeridos.', 'warn');
      return;
    }

    // Build WhatsApp message
    const waText = encodeURIComponent(
      `Hola MSI, me llamo *${name}*.\n` +
      `📞 Teléfono: ${phone}\n` +
      `🔧 Servicio: ${serv}\n` +
      (msg ? `📝 Mensaje: ${msg}` : '')
    );

    btn.textContent = '¡Enviando a WhatsApp...';
    btn.disabled    = true;

    setTimeout(() => {
      window.open(`https://wa.me/528126358842?text=${waText}`, '_blank');
      form.reset();
      btn.textContent = 'Enviar Solicitud →';
      btn.disabled    = false;
      showFormMsg(form, '✔ ¡Solicitud enviada por WhatsApp!', 'ok');
    }, 600);
  });

  function showFormMsg(form, text, type) {
    let msg = form.querySelector('.form-msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form-msg';
      Object.assign(msg.style, {
        marginTop: '12px', fontFamily: "'Barlow', sans-serif",
        fontSize: '0.9rem', borderRadius: '3px', padding: '10px 14px'
      });
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.background = type === 'ok' ? 'rgba(1,151,224,0.1)' : 'rgba(255,160,50,0.1)';
    msg.style.color       = type === 'ok' ? '#0197e0'            : '#c97f00';
    msg.style.border      = type === 'ok' ? '1px solid rgba(1,151,224,0.3)' : '1px solid rgba(255,160,50,0.3)';
    setTimeout(() => { if (msg.parentNode) msg.remove(); }, 4000);
  }
})();


/* ── Active nav link on scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a[href^="#"], .mobile-nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
})();


/* ── VIDEOS CONTROL ── */
window.togglePlayVideo = function(id) {
  const video = document.getElementById(id);
  if (!video) return;

  const wrapper = video.closest('.video-wrapper');
  if (!wrapper) return;

  if (video.paused) {
    // Pause other project videos
    document.querySelectorAll('.video-wrapper video').forEach(v => {
      if (v.id !== id) {
        v.pause();
        const otherWrapper = v.closest('.video-wrapper');
        if (otherWrapper) {
          otherWrapper.classList.remove('playing');
        }
      }
    });

    video.play().then(() => {
      wrapper.classList.add('playing');
    }).catch(err => {
      console.warn("Video play interrupted or failed: ", err);
    });
  } else {
    video.pause();
    wrapper.classList.remove('playing');
  }
};

(function initVideoClicks() {
  document.querySelectorAll('.video-wrapper video').forEach(video => {
    // Directly click on video tag to pause
    video.addEventListener('click', () => {
      window.togglePlayVideo(video.id);
    });
  });
})();

