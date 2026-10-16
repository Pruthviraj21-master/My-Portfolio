/* ============================================================
   Pruthviraj Chavan — Portfolio scripts
   Plain JS. No dependencies. Works on GitHub Pages as-is.
   ============================================================ */

/* ---------- mobile menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuIcon = document.getElementById('menuIcon');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuIcon) menuIcon.innerHTML = `<use href="#i-${open ? 'x' : 'menu'}"/>`;
  });
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      if (menuIcon) menuIcon.innerHTML = '<use href="#i-menu"/>';
    })
  );
}

/* ---------- header scrolled state ---------- */
const siteNav = document.getElementById('siteNav');
const onScroll = () => siteNav && siteNav.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- scroll-spy: active nav link ---------- */
const sections = document.querySelectorAll('section[id]');
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        document.querySelectorAll('.nav-link').forEach((link) => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-20% 0px -60% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ---------- reveal on scroll ---------- */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealEls.forEach((el) => revealObs.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('revealed'));
}

/* ---------- section divider lines draw in on scroll ---------- */
const sectionEls = document.querySelectorAll('.section');
if ('IntersectionObserver' in window && !reducedMotion) {
  const lineObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-in');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );
  sectionEls.forEach((s) => lineObs.observe(s));
} else {
  sectionEls.forEach((s) => s.classList.add('line-in'));
}

/* ---------- videos: cascade reveal + scroll hint ---------- */
const videosLayout = document.querySelector('.videos-layout');
const videoScroll = document.querySelector('.video-scroll');
if (videosLayout) {
  if ('IntersectionObserver' in window && !reducedMotion) {
    const videosObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('videos-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    videosObs.observe(videosLayout);
  } else {
    videosLayout.classList.add('videos-in');
  }
}
if (videoScroll) {
  videoScroll.addEventListener(
    'scroll',
    () => videoScroll.closest('.video-frame').classList.add('scrolled'),
    { passive: true, once: true }
  );
}

/* ---------- cycling word in hero ---------- */
const cyclingWord = document.getElementById('cyclingWord');
if (cyclingWord && !reducedMotion) {
  const words = ['build', 'ship', 'deploy', 'document'];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % words.length;
    cyclingWord.innerHTML = `${words[idx]}<span class="type-caret">|</span>`;
  }, 2500);
}

/* ---------- count-up stats (never displays a zero) ---------- */
document.querySelectorAll('.count').forEach((el) => {
  const target = Number(el.dataset.value || 0);
  if (reducedMotion || !('IntersectionObserver' in window)) {
    el.textContent = String(target);
    return;
  }
  const obs = new IntersectionObserver(
    (entries, o) => {
      if (!entries[0].isIntersecting) return;
      o.disconnect();
      const from = Math.max(1, Math.round(target * 0.3));
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1100, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(from + (target - from) * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    { threshold: 0.4 }
  );
  obs.observe(el);
});

/* ---------- custom cursor (desktop only) ---------- */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
if (cursorDot && cursorRing && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  let x = -100, y = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    cursorDot.classList.add('visible');
    cursorRing.classList.add('visible');
  });
  document.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('visible');
    cursorRing.classList.remove('visible');
  });
  const tick = () => {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    cursorDot.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
    cursorRing.style.transform = `translate(${rx - 13}px, ${ry - 13}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- contact: scratch-to-reveal cards (G Pay coupon style) ---------- */
if (!reducedMotion) {
  document.querySelectorAll('.contact-method').forEach((card) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    canvas.className = 'scratch-layer';
    canvas.setAttribute('aria-hidden', 'true');
    card.appendChild(canvas);

    const rootStyle = getComputedStyle(document.documentElement);
    const gold = rootStyle.getPropertyValue('--primary').trim() || '#d8b45c';
    const base = rootStyle.getPropertyValue('--accent').trim() || '#241f38';
    const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

    let drawing = false;
    let revealed = false;
    let moveCount = 0;
    let downX = 0;
    let downY = 0;
    let downAt = 0;
    let revealedAt = 0;

    function sizeCanvas() {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    }

    function paintFoil() {
      const rect = sizeCanvas();
      const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      g.addColorStop(0, base);
      g.addColorStop(0.5, '#332c50');
      g.addColorStop(1, base);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, rect.width, rect.height);
      const shine = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      shine.addColorStop(0.4, 'rgba(255,255,255,0)');
      shine.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      shine.addColorStop(0.6, 'rgba(255,255,255,0)');
      ctx.fillStyle = shine;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let i = 0; i < 130; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * rect.width,
          Math.random() * rect.height,
          Math.random() * 1.5 + 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = gold;
      ctx.font = '600 12px ' + mono;
      ctx.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 - 9);
      ctx.globalAlpha = 0.55;
      ctx.font = '500 10px ' + mono;
      ctx.fillText('(or just tap)', rect.width / 2, rect.height / 2 + 9);
      ctx.globalAlpha = 1;
    }

    paintFoil();
    window.addEventListener('resize', () => {
      if (!revealed) paintFoil();
    });

    function eraseAt(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      const r = 22;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    function scratchedShare() {
      const step = 16;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      let cleared = 0;
      let total = 0;
      try {
        const data = ctx.getImageData(0, 0, w, h).data;
        for (let y = step * dpr * 0.5; y < h; y += step * dpr) {
          for (let x = step * dpr * 0.5; x < w; x += step * dpr) {
            total++;
            if (data[((y | 0) * w + (x | 0)) * 4 + 3] < 24) cleared++;
          }
        }
      } catch (err) {
        return 1;
      }
      return total ? cleared / total : 0;
    }

    function reveal() {
      if (revealed) return;
      revealed = true;
      revealedAt = Date.now();
      card.classList.add('revealed');
      card.removeAttribute('data-cursor');
      canvas.classList.add('fading');
      window.setTimeout(() => canvas.remove(), 500);
      /* phones get a tiny tick when the reveal lands */
      if (window.navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) {
        try {
          window.navigator.vibrate(18);
        } catch (err) {
          /* haptics unavailable */
        }
      }
    }

    /* clicks only work once the card is fully revealed (and not from the scratch gesture itself) */
    card.addEventListener(
      'click',
      (e) => {
        if (!revealed || Date.now() - revealedAt < 400) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    canvas.addEventListener('pointerdown', (e) => {
      if (revealed) return;
      e.preventDefault();
      drawing = true;
      downAt = Date.now();
      const rect = canvas.getBoundingClientRect();
      downX = e.clientX - rect.left;
      downY = e.clientY - rect.top;
      canvas.setPointerCapture(e.pointerId);
      eraseAt(downX, downY);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drawing || revealed) return;
      const rect = canvas.getBoundingClientRect();
      eraseAt(e.clientX - rect.left, e.clientY - rect.top);
      if (++moveCount % 6 === 0 && scratchedShare() > 0.7) reveal();
    });

    function finish(e) {
      if (!drawing) return;
      drawing = false;
      if (revealed) return;
      const rect = canvas.getBoundingClientRect();
      const moved = Math.hypot(e.clientX - rect.left - downX, e.clientY - rect.top - downY);
      if ((Date.now() - downAt < 300 && moved < 10) || scratchedShare() > 0.7) reveal();
    }

    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', () => {
      drawing = false;
    });
    /* keyboard users: focusing the card reveals it instantly */
    card.addEventListener('focusin', reveal);
  });
}

/* ---------- signature system: spotlight, progress, magnetic, tilt, labels ---------- */
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* intro ceremony cleanup (veil has lifted by then) */
if (document.documentElement.classList.contains('intro-play')) {
  window.setTimeout(() => document.documentElement.classList.remove('intro-play'), 1600);
}

/* gold scroll-progress line */
const progressBar = document.querySelector('.progress-bar');
if (progressBar && !reducedMotion) {
  const setProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  };
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress, { passive: true });
  setProgress();
}

if (finePointer && !reducedMotion) {
  /* golden spotlight glides after the cursor */
  const spotlight = document.querySelector('.spotlight');
  if (spotlight) {
    let sx = window.innerWidth * 0.72;
    let sy = window.innerHeight * 0.18;
    let tx = sx;
    let ty = sy;
    window.addEventListener(
      'pointermove',
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );
    (function glide() {
      sx += (tx - sx) * 0.08;
      sy += (ty - sy) * 0.08;
      spotlight.style.setProperty('--sx', sx.toFixed(1) + 'px');
      spotlight.style.setProperty('--sy', sy.toFixed(1) + 'px');
      requestAnimationFrame(glide);
    })();
  }

  /* magnetic pull on the primary actions */
  document.querySelectorAll('.hero .portfolio-button, .resume-button, .socials a').forEach((el) => {
    el.classList.add('magnetic');
    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.2).toFixed(1) + 'px, ' + (dy * 0.28).toFixed(1) + 'px)';
      },
      { passive: true }
    );
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  /* tilt with travelling glare on project and certificate cards */
  document.querySelectorAll('.project-card, .cert-card').forEach((card) => {
    card.classList.add('tilt');
    card.addEventListener(
      'pointermove',
      (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform =
          'perspective(900px) rotateX(' +
          ((0.5 - py) * 5).toFixed(2) +
          'deg) rotateY(' +
          ((px - 0.5) * 6).toFixed(2) +
          'deg) translateY(-4px)';
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      },
      { passive: true }
    );
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  /* contextual cursor labels: VIEW on work, SCRATCH on contact */
  const cursorLabel = document.querySelector('.cursor-label');
  if (cursorLabel) {
    document.querySelectorAll('.project-card, .video-card').forEach((el) => {
      el.dataset.cursor = 'VIEW';
    });
    document.querySelectorAll('.contact-method').forEach((el) => {
      el.dataset.cursor = 'SCRATCH';
    });
    document.addEventListener(
      'pointermove',
      (e) => {
        const host = e.target.closest ? e.target.closest('[data-cursor]') : null;
        if (host) {
          if (cursorLabel.textContent !== host.dataset.cursor) cursorLabel.textContent = host.dataset.cursor;
          cursorLabel.classList.add('visible', 'show');
          cursorLabel.style.left = e.clientX + 'px';
          cursorLabel.style.top = e.clientY + 26 + 'px';
        } else {
          cursorLabel.classList.remove('show');
        }
      },
      { passive: true }
    );
  }
}

/* ---------- journey: the portfolio answers like the RAG chatbot he built ---------- */
const journeyChat = document.querySelector('.journey-chat');
if (journeyChat) {
  const thread = journeyChat.querySelector('.chat-thread');
  const chips = Array.from(journeyChat.querySelectorAll('.chip'));
  const exchanges = Array.from(journeyChat.querySelectorAll('.exchange'));
  const greet = journeyChat.querySelector('.chat-greeting');
  journeyChat.classList.add('armed');

  const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? 0 : ms));
  const scrollThread = () => {
    thread.scrollTop = thread.scrollHeight;
  };
  const streamWords = (el) =>
    new Promise((resolve) => {
      const full = el.dataset.text || el.textContent.trim();
      el.dataset.text = full;
      if (reducedMotion) {
        el.textContent = full;
        resolve();
        return;
      }
      el.textContent = '';
      el.classList.add('typing');
      const words = full.split(' ');
      let i = 0;
      const tick = () => {
        i += 1;
        el.textContent = words.slice(0, i).join(' ');
        scrollThread();
        if (i >= words.length) {
          el.classList.remove('typing');
          resolve();
        } else {
          setTimeout(tick, 24 + Math.random() * 46);
        }
      };
      tick();
    });

  if (greet) {
    greet.dataset.text = greet.textContent.trim();
    if (!reducedMotion) greet.textContent = '';
  }

  const askQueue = [];
  let asking = false;
  const runAsk = async () => {
    if (asking || !askQueue.length) return;
    asking = true;
    const idx = askQueue.shift();
    const exchange = exchanges[idx];
    if (exchange && !exchange.classList.contains('shown')) {
      exchange.classList.add('shown');
      const thinking = exchange.querySelector('.thinking');
      if (thinking && !reducedMotion) thinking.classList.add('show');
      scrollThread();
      await wait(520);
      if (thinking) thinking.classList.remove('show');
      const lines = exchange.querySelectorAll('.msg.ai .stream-text');
      for (let n = 0; n < lines.length; n += 1) {
        await streamWords(lines[n]);
      }
      const card = exchange.querySelector('.experience-card');
      if (card) {
        await wait(140);
        card.classList.add('in');
      }
      scrollThread();
      if (chips[idx]) chips[idx].disabled = true;
    }
    asking = false;
    runAsk();
  };
  const ask = (idx) => {
    if (idx < 0 || idx >= exchanges.length) return;
    if (exchanges[idx].classList.contains('shown') || askQueue.includes(idx)) return;
    askQueue.push(idx);
    runAsk();
  };

  chips.forEach((chip, idx) => {
    chip.addEventListener('click', () => ask(idx));
  });

  let chatStarted = false;
  const startChat = async () => {
    if (chatStarted) return;
    chatStarted = true;
    if (greet && !reducedMotion) await streamWords(greet);
    ask(0);
  };
  if ('IntersectionObserver' in window) {
    const chatObs = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          startChat();
        }
      },
      { threshold: 0.25 }
    );
    chatObs.observe(journeyChat);
  } else {
    startChat();
  }
}

/* ---------- footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- phone experience: tap ripples, portrait parallax, details toggles ---------- */
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

/* project cards collapse behind a "View details" tap on phones */
document.querySelectorAll('.details-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    if (!card) return;
    const open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    const label = btn.querySelector('span');
    if (label) label.textContent = open ? 'Hide details' : 'View details';
  });
});

if (coarsePointer && !reducedMotion) {
  /* a soft gold ripple blooms wherever the thumb lands */
  document.addEventListener(
    'pointerdown',
    (e) => {
      const host = e.target.closest(
        '.portfolio-button, .contact-method, .chip, .details-toggle'
      );
      if (!host || host.disabled) return;
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      host.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 640);
    },
    { passive: true }
  );

  /* the portrait drifts gently upward as the hero scrolls away */
  const portraitFrame = document.querySelector('.portrait-frame');
  const hero = document.querySelector('.hero');
  if (portraitFrame && hero) {
    let queued = false;
    const drawParallax = () => {
      queued = false;
      const span = hero.offsetHeight || 1;
      const p = Math.min(Math.max(window.scrollY / span, 0), 1);
      portraitFrame.style.transform =
        'rotate(2deg) translateY(' + (-p * 26).toFixed(1) + 'px)';
    };
    window.addEventListener(
      'scroll',
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(drawParallax);
      },
      { passive: true }
    );
  }
}
