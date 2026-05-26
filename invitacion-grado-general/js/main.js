/* ============================================================
   CONFIGURACIÓN — Grado Andrés Morales
   ============================================================ */
const GRADO = {
  name:       'Juan Camilo Zarta Campo',
  degree:     'Ingeniero de Sistemas',
  university: 'Universidad Nacional de Colombia',
  phone:      '573128622945',
  eventDate:  new Date('2026-12-06T10:00:00'),
};

document.title = `Grado · ${GRADO.name}`;

/* ============================================================
   MÚSICA
   ============================================================ */
const musicBtn = document.getElementById('music-btn');
const bgMusic  = document.getElementById('bg-music');

window.addEventListener('load', () => {
  if (!bgMusic) return;

  bgMusic.volume = 0.6;
  bgMusic.muted  = true;

  bgMusic.play().then(() => {
    musicBtn.classList.add('playing');

    const unmute = () => { bgMusic.muted = false; };
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(e =>
      document.addEventListener(e, unmute, { once: true, passive: true })
    );
  }).catch(() => {
    const startOnClick = () => {
      bgMusic.muted = false;
      bgMusic.play()
        .then(() => musicBtn.classList.add('playing'))
        .catch(() => {});
    };
    document.addEventListener('click', startOnClick, { once: true });
    document.addEventListener('touchstart', startOnClick, { once: true });
  });
});

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      musicBtn.classList.add('paused');
    }
  });
}

/* ============================================================
   CONFETTI DORADO — Canvas
   ============================================================ */
(function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Paleta dorada y champagne
  const COLORS = [
    '#C9A84C', '#FFD700', '#F0E0B0',
    '#FFFFFF', '#E8C96A', '#FFF5CC',
  ];

  class Particle {
    constructor(burst) {
      this.reset(burst);
    }

    reset(burst) {
      this.x      = Math.random() * canvas.width;
      this.y      = burst ? (Math.random() * canvas.height * .4) - canvas.height * .4 : -16;
      this.w      = Math.random() * 5 + 2;
      this.h      = Math.random() * 3 + 1;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.vx     = (Math.random() - 0.5) * 1.6;
      this.vy     = Math.random() * 2.0 + 0.8;
      this.rot    = Math.random() * Math.PI * 2;
      this.rotV   = (Math.random() - 0.5) * 0.10;
      this.alpha  = Math.random() * 0.40 + 0.25;
      this.dAlpha = -(Math.random() * 0.003 + 0.001);
    }

    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.rot += this.rotV;
      this.vx  += (Math.random() - 0.5) * 0.08;
      this.vy  *= 0.999;
      this.alpha += this.dAlpha;

      if (this.y > canvas.height + 20 || this.alpha <= 0.02) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  // Burst inicial + lluvia sutil
  const COUNT_BURST   = 50;
  const COUNT_AMBIENT = 20;
  const particles = [];

  for (let i = 0; i < COUNT_BURST;   i++) particles.push(new Particle(true));
  for (let i = 0; i < COUNT_AMBIENT; i++) {
    const p = new Particle(false);
    p.y = Math.random() * canvas.height;   // distribución vertical inicial
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   COUNTDOWN — doble (hero + sección)
   ============================================================ */
const EVENT_DATE = GRADO.eventDate;

const cdDays    = document.getElementById('cd-days');
const cdHours   = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');
const cdSeconds = document.getElementById('cd-seconds');

const crDays    = document.getElementById('cr-days');
const crHours   = document.getElementById('cr-hours');
const crMinutes = document.getElementById('cr-minutes');
const crSeconds = document.getElementById('cr-seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function animateFlip(el, newVal) {
  if (!el || el.textContent === newVal) return;
  el.classList.add('flip-out');
  setTimeout(() => {
    el.textContent = newVal;
    el.classList.remove('flip-out');
    el.classList.add('flip-in');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('flip-in')));
  }, 130);
}

function tick() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) {
    const hw = document.querySelector('.hero-countdown');
    if (hw) hw.innerHTML =
      '<p style="font-family:var(--ff-serif);font-size:1.8rem;color:var(--clr-gold);letter-spacing:.08em">¡Hoy es el gran día!</p>';
    const cw = document.querySelector('.cr-circles');
    if (cw) cw.innerHTML =
      '<p style="font-family:var(--ff-serif);font-size:1.8rem;color:var(--clr-gold)">¡Hoy es el gran día!</p>';
    return;
  }

  const days    = pad(Math.floor(diff / 86400000));
  const hours   = pad(Math.floor((diff % 86400000) / 3600000));
  const minutes = pad(Math.floor((diff % 3600000)  / 60000));
  const seconds = pad(Math.floor((diff % 60000)    / 1000));

  animateFlip(cdDays,    days);
  animateFlip(cdHours,   hours);
  animateFlip(cdMinutes, minutes);
  animateFlip(cdSeconds, seconds);

  if (crDays)    crDays.textContent    = days;
  if (crHours)   crHours.textContent   = hours;
  if (crMinutes) crMinutes.textContent = minutes;
  if (crSeconds) crSeconds.textContent = seconds;
}

tick();
setInterval(tick, 1000);

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const GALLERY_SRCS = [
  'Fotos/img (1).png',
  'Fotos/img (3).png',
  'Fotos/img (4).png',
  'Fotos/img (5).png',
];

let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLightbox(idx) {
  lbIndex = ((idx % GALLERY_SRCS.length) + GALLERY_SRCS.length) % GALLERY_SRCS.length;
  lbImg.src = GALLERY_SRCS[lbIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

if (lightbox) {
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
  document.getElementById('lb-next').addEventListener('click', () => openLightbox(lbIndex + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}

document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = window.scrollY + target.getBoundingClientRect().top - 72;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
