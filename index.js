/* ============================================================
   SADDIQUE PORTFOLIO — index.js
   Loading screen · Custom cursor · Scroll animations ·
   Stats counter · Project filters · Magnetic buttons ·
   Scroll progress · Glassmorphism navbar
   ============================================================ */

// ===== LOADING SCREEN =====
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal animations after loader hides
    document.querySelectorAll('.reveal-up').forEach((el, i) => {
      el.style.animationDelay = `${0.05 + i * 0.14}s`;
    });
  }, 1800);
});

// ===== SCROLL PROGRESS BAR =====
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = scrolled + '%';
});

// ===== GLASSMORPHISM NAVBAR (+ hide on scroll down / show on scroll up) =====
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

const updateHeader = () => {
  const y = window.scrollY;

  if (y > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }

  // Only hide once past the hero, and never while the mobile menu is open
  const menuOpen = document.getElementById('smMenu').classList.contains('header__sm-menu--active');
  if (!menuOpen) {
    if (y > lastScrollY && y > 160) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
  }
  lastScrollY = y;
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ===== MOBILE HAMBURGER MENU =====
const hamBtn    = document.getElementById('hamBtn');
const smMenu    = document.getElementById('smMenu');
const hamIcon   = document.getElementById('hamIcon');
const closeIcon = document.getElementById('closeIcon');

hamBtn.addEventListener('click', () => {
  const isOpen = smMenu.classList.toggle('header__sm-menu--active');
  hamIcon.classList.toggle('d-none', isOpen);
  closeIcon.classList.toggle('d-none', !isOpen);
});

document.querySelectorAll('.header__sm-menu-link a').forEach(link => {
  link.addEventListener('click', () => {
    smMenu.classList.remove('header__sm-menu--active');
    hamIcon.classList.remove('d-none');
    closeIcon.classList.add('d-none');
  });
});

// ===== LOGO → HOME =====
document.getElementById('logoHome').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== BACK TO TOP (footer) =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== SCROLL REVEAL (IntersectionObserver) =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTER (STATS) =====
const animateCounter = (el, target, duration = 1800) => {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start;
  }, 16);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-card__num');
        if (numEl) {
          const target = parseInt(numEl.dataset.target, 10);
          animateCounter(numEl, target);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));

// ===== PROJECT FILTERS =====
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('active');
        setTimeout(() => card.classList.add('active'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CUSTOM CURSOR (desktop only) =====
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
if (!isTouchDevice) {
  const cursorDot  = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  document.body.classList.add('custom-cursor-active');

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  document.querySelectorAll('a, button, .tech-badge, .tag-pill, .project-card, .service-card, .why-card, .tech-card, .wf-step, .stat-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--active'));
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
} else {
  document.body.classList.add('using-touch');
}

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px) translateY(-4px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__link');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('header__link--active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => navObserver.observe(s));

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0); animation:ripple-anim 0.6s linear;
      pointer-events:none;
    `;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe if not present
if (!document.querySelector('#ripple-style')) {
  const s = document.createElement('style');
  s.id = 'ripple-style';
  s.textContent = '@keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }';
  document.head.appendChild(s);
}
