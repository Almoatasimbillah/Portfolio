/* =========================================================
   effects.js
   ·  anatomy scroll-scrub (canvas + WebP frame sequence)
   ·  hero word reveal
   ·  side-rail chapter dots
   ·  scroll velocity damping
   ·  phase parallax
   ·  konami easter egg
   ========================================================= */

(() => {

  /* ------------------------------------------------------------------
     1) UNIFIED scroll-scrubber — intro (85 frames) + anatomy (158 frames)
        chained into one continuous 243-frame sequence
     ------------------------------------------------------------------ */
  const section   = document.querySelector('.anatomy');
  const canvas    = document.querySelector('.anatomy-canvas');
  const loader    = document.querySelector('.anatomy-loader');
  const loaderFill= document.querySelector('.loader-bar-fill');
  const introPhases = Array.from(document.querySelectorAll('.intro-phase'));
  const phases    = Array.from(document.querySelectorAll('.phase'));
  const allPhases = [...introPhases, ...phases];   // 5 intro + 5 anatomy = 10
  const introMeta = document.querySelector('.intro-meta');
  const introHint = document.querySelector('.intro-scroll-hint');
  const progress  = document.querySelector('.progress');
  const chapters  = document.querySelector('.chapters');
  const chapterDots = chapters ? Array.from(chapters.querySelectorAll('.chapter-dot')) : [];

  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  const INTRO_COUNT   = 85;
  const ANATOMY_COUNT = 158;
  const FRAME_COUNT   = INTRO_COUNT + ANATOMY_COUNT;  // 243
  // Narrow viewports get the *_mobile/ frame set (640px wide, ~54% smaller
  // payload) — decided once at load, not on resize, so the sequence never
  // swaps source mid-scrub. Matches the site's existing 820px breakpoint.
  const isMobileFrames = matchMedia('(max-width: 820px)').matches;
  const introDir  = isMobileFrames ? 'intro_frames_mobile' : 'intro_frames';
  const anatomyDir = isMobileFrames ? 'frames_mobile' : 'frames';
  // First INTRO_COUNT frames come from intro_frames/, the rest from frames/
  // (the original cinematic disassembly that covers all five chapters)
  const FRAME_PATH = i => i < INTRO_COUNT
    ? `${introDir}/${String(i + 1).padStart(3, '0')}.webp`
    : `${anatomyDir}/${String(i - INTRO_COUNT + 1).padStart(3, '0')}.webp`;

  // The "handoff point" in normalized progress (85 / 243 ≈ 0.35)
  const HANDOFF = INTRO_COUNT / FRAME_COUNT;

  // Phase ranges in normalized progress (0..1). NON-OVERLAPPING.
  const PHASE_RANGES = [
    // — Intro phases (3 — greet+name, bio+location, CTAs) —
    [0.04, 0.13],             // 1 · greet + name
    [0.15, 0.24],             // 2 · bio + location
    [0.26, HANDOFF],          // 3 · CTAs
    // — Anatomy phases (5 — full disassembly) —
    [HANDOFF + 0.02, 0.50],   // 4 · A machine, opened up
    [0.52, 0.63],             // 5 · The mind (processor)
    [0.65, 0.76],             // 6 · Active memory (RAM)
    [0.78, 0.88],             // 7 · Long-term storage (SSD)
    [0.90, 1.00],             // 8 · The board (mainboard)
  ];

  const frames = new Array(FRAME_COUNT);
  let framesLoaded = 0;

  let target = 0, current = 0;
  let pageScrollPct = 0;
  let lastDrawnIdx = -1;
  let needsDraw = true;

  /* ---- canvas sizing (HiDPI-aware, capped) ---- */
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);
    needsDraw = true;
  }

  /* ---- draw a frame with "cover" semantics ---- */
  function drawFrame(img) {
    if (!img || !img.complete) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    const canvasAR = cw / ch, imgAR = iw / ih;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgAR > canvasAR) { sw = ih * canvasAR; sx = (iw - sw) / 2; }
    else                  { sh = iw / canvasAR; sy = (ih - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  /* ---- progressive loading ---- */
  function loadOne(i) {
    return new Promise(resolve => {
      const img = new Image();
      img.decoding = 'async';
      img.onload  = () => { frames[i] = img; framesLoaded++; updateLoaderUI(); resolve(); };
      img.onerror = () => { framesLoaded++; updateLoaderUI(); resolve(); };
      img.src = FRAME_PATH(i);
    });
  }
  function updateLoaderUI() {
    const pct = framesLoaded / FRAME_COUNT;
    if (loaderFill) loaderFill.style.width = (pct * 100).toFixed(1) + '%';
    if (pct >= 0.18 && loader && !loader.classList.contains('is-done')) {
      loader.classList.add('is-done');
    }
    needsDraw = true;
  }
  async function loadSequence() {
    await loadOne(0);
    needsDraw = true;
    const stride = 6;
    const coarse = [];
    for (let i = stride; i < FRAME_COUNT; i += stride) coarse.push(loadOne(i));
    await Promise.all(coarse);
    const remaining = [];
    for (let i = 1; i < FRAME_COUNT; i++) if (!frames[i]) remaining.push(i);
    const CHUNK = 8;
    for (let k = 0; k < remaining.length; k += CHUNK) {
      await Promise.all(remaining.slice(k, k + CHUNK).map(loadOne));
    }
  }

  function nearestLoadedFrame(idx) {
    if (frames[idx]) return frames[idx];
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (frames[idx - d]) return frames[idx - d];
      if (frames[idx + d]) return frames[idx + d];
    }
    return null;
  }

  /* ---- progress computation ---- */
  function computeProgress() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    target = scrollable > 0 ? scrolled / scrollable : 0;

    const doc = document.documentElement;
    const pageScrollable = doc.scrollHeight - window.innerHeight;
    pageScrollPct = pageScrollable > 0 ? window.scrollY / pageScrollable : 0;
  }

  /* ---- phases — NON-OVERLAPPING: at any p, ONLY the active phase shows.
            All other phases get opacity 0 immediately. Fade-in / fade-out
            happens INSIDE each phase's own range, never crossing into another's. ---- */
  function updatePhases(p) {
    // Determine which phase owns p (if any)
    let activeIdx = -1;
    for (let i = 0; i < PHASE_RANGES.length; i++) {
      const [s, e] = PHASE_RANGES[i];
      if (p >= s && p < e) { activeIdx = i; break; }
    }
    // Past the very last phase end → stay on the last one
    if (activeIdx === -1 && p >= PHASE_RANGES[PHASE_RANGES.length - 1][1]) {
      activeIdx = PHASE_RANGES.length - 1;
    }

    for (let i = 0; i < allPhases.length; i++) {
      let opacity = 0;
      let parallax = 0;
      if (i === activeIdx) {
        const [s, e] = PHASE_RANGES[i];
        const len = e - s;
        // Fade in/out occupies 25% of each end of the range
        const fade = Math.max(0.008, len * 0.25);
        if (p < s + fade)      opacity = (p - s) / fade;
        else if (p > e - fade) opacity = (e - p) / fade;
        else                   opacity = 1;
        opacity = Math.max(0, Math.min(1, opacity));
        // subtle drift up while phase is active
        parallax = ((p - s) / len) * -8;
      }
      const el = allPhases[i];
      el.classList.toggle('is-active', opacity > 0.5);
      const fadeOffset = (1 - opacity) * 14;
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translateY(${(fadeOffset + parallax).toFixed(2)}px)`;
    }

    // Intro meta + scroll hint: visible only during the intro half
    if (introMeta) {
      const introVisible = p < HANDOFF - 0.02;
      introMeta.style.opacity = introVisible ? 1 : Math.max(0, 1 - (p - (HANDOFF - 0.02)) / 0.04);
    }
    if (introHint) {
      if (p < 0.04) introHint.classList.add('is-revealed');
      else introHint.style.opacity = '0';
    }
  }

  /* ---- chapter dots active state — only anatomy phases (indices 3..7) ---- */
  const ANATOMY_PHASE_OFFSET = 3;     // first anatomy phase index (3 intro + 5 anatomy)
  function updateChapters(p) {
    if (!chapterDots.length) return;
    let activeIdx = -1;
    for (let i = ANATOMY_PHASE_OFFSET; i < PHASE_RANGES.length; i++) {
      const [s, e] = PHASE_RANGES[i];
      if (p >= s && p < e) { activeIdx = i - ANATOMY_PHASE_OFFSET; break; }
    }
    if (activeIdx === -1 && p >= PHASE_RANGES[PHASE_RANGES.length - 1][0]) {
      activeIdx = PHASE_RANGES.length - 1 - ANATOMY_PHASE_OFFSET;
    }
    chapterDots.forEach((d, i) => d.classList.toggle('is-active', i === activeIdx));
  }
  function updateChaptersVisibility() {
    if (!chapters) return;
    const rect = section.getBoundingClientRect();
    // visible during the anatomy half only (top is past the handoff)
    const scrollable = section.offsetHeight - window.innerHeight;
    const passed = Math.max(0, -rect.top);
    const p = scrollable > 0 ? passed / scrollable : 0;
    const inView = p > HANDOFF && rect.bottom > window.innerHeight * 0.4;
    chapters.classList.toggle('is-visible', inView);
  }

  /* ---- click a dot to jump to that anatomy phase ---- */
  chapterDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const [s, e] = PHASE_RANGES[i + ANATOMY_PHASE_OFFSET];
      const mid = (s + e) / 2;
      const scrollable = section.offsetHeight - window.innerHeight;
      const targetY = section.offsetTop + mid * scrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ---- Emerge fade — canvas opacity ramps 0 → 1 over the first ~7% of
          scroll, and the top vignette fades out over the first ~12%.
          Result: the face frame appears to emerge from blackness, so the
          robot→anatomy boundary feels like one continuous black moment
          rather than a hard cut. ---- */
  function updateEmergeFade(p) {
    // Canvas reveal: 0..0.07 of progress → 0..1 opacity (eased)
    const emergeP = Math.max(0, Math.min(1, p / 0.07));
    const emerge = emergeP * emergeP * (3 - 2 * emergeP); // smoothstep
    // Top vignette fade: 0..0.12 of progress → 1..0 opacity (linear is fine)
    const fadeIn = 1 - Math.max(0, Math.min(1, p / 0.12));
    section.style.setProperty('--anatomy-emerge', emerge.toFixed(3));
    section.style.setProperty('--anatomy-fade-in', fadeIn.toFixed(3));
  }

  /* ---- velocity-damped animation loop (sleeps when idle) ---- */
  let running = false;
  function tick() {
    const delta = Math.abs(target - current);
    const lerp = delta > 0.08 ? 0.09 : 0.22;
    current += (target - current) * lerp;
    if (delta < 0.0002) current = target;

    const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(current * (FRAME_COUNT - 1))));
    if (idx !== lastDrawnIdx || needsDraw) {
      const img = nearestLoadedFrame(idx);
      if (img) drawFrame(img);
      lastDrawnIdx = idx;
      needsDraw = false;
    }

    updatePhases(current);
    updateChapters(current);
    updateEmergeFade(current);
    if (window.__updateHotspots) window.__updateHotspots(current);
    if (progress) progress.style.width = (pageScrollPct * 100).toFixed(2) + '%';

    if (Math.abs(target - current) > 0.0002 || needsDraw) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(tick); } }

  resizeCanvas();
  computeProgress();
  loadSequence();
  wake();

  // Make sure paint happens once layout settles (preview tabs can suspend rAF).
  window.addEventListener('load', () => { needsDraw = true; wake(); });

  window.addEventListener('scroll', () => {
    computeProgress();
    updateChaptersVisibility();
    needsDraw = true;
    wake();
  }, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas(); computeProgress(); wake();
  });
  updateChaptersVisibility();
  // periodic wake while frames stream in, then stop
  const loadWake = setInterval(() => { needsDraw = true; wake(); if (framesLoaded >= FRAME_COUNT) clearInterval(loadWake); }, 250);


  /* ------------------------------------------------------------------
     Magnetic buttons — CTAs translate toward the cursor on hover
     Subtle (max ~10px), spring-damped, resets on pointerleave.
     Disabled on touch / coarse pointers and when prefers-reduced-motion.
     ------------------------------------------------------------------ */
  (() => {
    const coarse  = matchMedia('(pointer: coarse)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return;

    const SELECTOR = '.link-primary, .form-submit, .tmodal-submit, .quote-add-btn, .avatar-cta, .modal-close, .tmodal-close, .chapter-dot';
    const STRENGTH = 0.28;     // 0..1 — how much of the cursor offset to apply
    const MAX      = 10;       // px clamp
    const RADIUS   = 80;       // px — how close cursor must be to engage

    function bind(el) {
      if (el.dataset.magnetized === '1') return;
      el.dataset.magnetized = '1';
      let tx = 0, ty = 0, cx = 0, cy = 0;
      let raf = 0, inside = false;

      const tick = () => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
        if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
          raf = requestAnimationFrame(tick);
        } else { raf = 0; }
      };
      const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

      const move = (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top  + r.height / 2);
        const dist = Math.hypot(mx, my);
        if (!inside && dist > RADIUS) return;
        tx = Math.max(-MAX, Math.min(MAX, mx * STRENGTH));
        ty = Math.max(-MAX, Math.min(MAX, my * STRENGTH));
        wake();
      };
      const leave = () => { inside = false; tx = 0; ty = 0; wake(); };
      const enter = () => { inside = true; };

      el.addEventListener('pointermove',  move,  { passive: true });
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);
    }

    // Initial pass + watch for dynamically-added buttons (modal, testimonials)
    document.querySelectorAll(SELECTOR).forEach(bind);
    const mo = new MutationObserver(() => {
      document.querySelectorAll(SELECTOR).forEach(bind);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  })();


  /* ------------------------------------------------------------------
     Stat counters — about section numbers count up when section enters view
     Re-runs on language change so Arabic numerals appear correctly in AR mode.
     ------------------------------------------------------------------ */
  (() => {
    const counters = [...document.querySelectorAll('[data-count]')];
    if (!counters.length) return;
    const arDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    const formatNum = (n) => {
      const lang = (window.getLang && window.getLang()) || 'en';
      const s = String(Math.round(n));
      if (lang !== 'ar') return s;
      return s.replace(/\d/g, d => arDigits[+d]);
    };
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function animate(el) {
      if (el.dataset.countDone === '1') {
        // already done — just re-format for current language
        const valueEl = el.querySelector('.stat-num-value');
        if (valueEl) valueEl.textContent = formatNum(+el.dataset.count);
        return;
      }
      el.dataset.countDone = '1';
      const valueEl = el.querySelector('.stat-num-value');
      if (!valueEl) return;
      const target = +el.dataset.count;
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const v = easeOutExpo(t) * target;
        valueEl.textContent = formatNum(v);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => io.observe(c));
    } else {
      counters.forEach(animate);
    }

    // Re-format on language switch so Arabic numerals show after AR toggle
    document.addEventListener('i18n:changed', () => {
      counters.forEach(c => {
        if (c.dataset.countDone === '1') {
          const valueEl = c.querySelector('.stat-num-value');
          if (valueEl) valueEl.textContent = formatNum(+c.dataset.count);
        }
      });
    });
  })();


  /* ------------------------------------------------------------------
     Split-text on anatomy phase + intro phase titles — chars come in
     staggered when the phase activates. One-shot per title.
     ------------------------------------------------------------------ */
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Per-char splitting BREAKS Arabic letter joining (initial / medial /
    // final forms). In Arabic mode we split per WORD so connected forms are
    // preserved. The CSS .split-char class handles both — chars or words.
    const isArabic = () => (window.getLang && window.getLang() === 'ar') ||
                           document.documentElement.lang === 'ar';

    const splitOnce = (el) => {
      if (el.dataset.split === '1') return;
      el.dataset.split = '1';
      const splitByWord = isArabic();
      // Wrap top-level text nodes; preserve nested <em> structure.
      const wrap = (node) => {
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const txt = child.textContent;
            if (!txt.trim()) return;
            const frag = document.createDocumentFragment();
            if (splitByWord) {
              // Split on whitespace, keep spaces as separators.
              const parts = txt.split(/(\s+)/);
              parts.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                  frag.appendChild(document.createTextNode(part));
                } else {
                  const s = document.createElement('span');
                  s.className = 'split-char';
                  s.textContent = part;
                  frag.appendChild(s);
                }
              });
            } else {
              // Group each word's char-spans in one nowrap wrapper — bare
              // inline-block chars hand the browser a break opportunity
              // between EVERY letter ("door." can wrap as "doo / r.").
              const parts = txt.split(/(\s+)/);
              parts.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                  frag.appendChild(document.createTextNode(' '));
                  return;
                }
                const w = document.createElement('span');
                w.className = 'split-word';
                for (const ch of part) {
                  const s = document.createElement('span');
                  s.className = 'split-char';
                  s.textContent = ch;
                  w.appendChild(s);
                }
                frag.appendChild(w);
              });
            }
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            wrap(child);
          }
        });
      };
      wrap(el);
      const units = el.querySelectorAll('.split-char');
      // Larger stagger for words so the whole title doesn't run too long.
      const stride = splitByWord ? 90 : 26;
      units.forEach((s, i) => {
        s.style.setProperty('--split-i', i);
        s.style.animationDelay = `${i * stride}ms`;
      });
    };

    const SEL = '.phase-title, .intro-name, .avatar-title';
    const apply = () => {
      document.querySelectorAll(SEL).forEach(splitOnce);
    };
    function reset() {
      document.querySelectorAll(SEL).forEach(el => { el.dataset.split = ''; });
    }
    // First pass: defer until after i18n has populated text on load.
    if (document.readyState === 'complete') {
      setTimeout(apply, 50);
    } else {
      window.addEventListener('load', () => setTimeout(apply, 50));
    }
    // Every language switch wipes innerHTML — clear markers and re-split.
    document.addEventListener('i18n:changed', () => {
      reset();
      setTimeout(apply, 30);
    });
  })();


  /* ------------------------------------------------------------------
     Marquee velocity-aware — strips briefly accelerate while user scrolls
     fast, then ease back to base speed. Subtle, never distracting.
     ------------------------------------------------------------------ */
  (() => {
    const tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let last = window.scrollY;
    let velocity = 0;
    let tickQueued = false;

    function tick() {
      tickQueued = false;
      // Map velocity (0..~60) to a duration multiplier (1.0 → 0.4)
      const mult = Math.max(0.4, 1 - Math.min(1, velocity / 60) * 0.6);
      tracks.forEach(t => {
        t.style.setProperty('--marquee-speed', mult.toFixed(2));
      });
      // Decay
      velocity *= 0.88;
      if (velocity > 0.5) {
        tickQueued = true; requestAnimationFrame(tick);
      } else {
        // settle to base
        tracks.forEach(t => t.style.removeProperty('--marquee-speed'));
      }
    }

    window.addEventListener('scroll', () => {
      const now = window.scrollY;
      const dy = Math.abs(now - last);
      last = now;
      velocity = Math.max(velocity, dy);
      if (!tickQueued) { tickQueued = true; requestAnimationFrame(tick); }
    }, { passive: true });
  })();


  /* ------------------------------------------------------------------
     Footer live clock — Cairo / EET (auto-handles DST)
     ------------------------------------------------------------------ */
  (() => {
    const timeEl = document.querySelector('.footer-clock-time');
    if (!timeEl) return;
    const fmtEN = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const fmtAR = new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: false, numberingSystem: 'arab',
    });
    function paint() {
      const lang = (window.getLang && window.getLang()) || 'en';
      const fmt = lang === 'ar' ? fmtAR : fmtEN;
      try { timeEl.textContent = fmt.format(new Date()); } catch {}
    }
    paint();
    setInterval(paint, 60_000);
    document.addEventListener('i18n:changed', paint);
  })();

  /* ------------------------------------------------------------------
     Page-load shell — dismiss after window 'load' or 1.4s ceiling.
     ------------------------------------------------------------------ */
  (() => {
    const shell = document.getElementById('page-shell');
    if (!shell) return;
    const dismiss = () => {
      if (shell.classList.contains('is-done')) return;
      shell.classList.add('is-done');
    };
    if (document.readyState === 'complete') {
      // Browser already finished loading before this script ran — dismiss shortly.
      setTimeout(dismiss, 250);
    } else {
      window.addEventListener('load', () => setTimeout(dismiss, 300));
    }
    // Safety ceiling — never let the shell hang past 1.6s.
    setTimeout(dismiss, 1600);
  })();

  /* ------------------------------------------------------------------
     Stamp-in section watermarks — fires once per section, on enter.
     ------------------------------------------------------------------ */
  (() => {
    if (!('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.querySelectorAll('section[data-num]').forEach(s => s.classList.add('is-watermark-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-watermark-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('section[data-num]').forEach(s => io.observe(s));
  })();

  /* ------------------------------------------------------------------
     Work-row magnetic tilt — like buttons, the entire work-row tilts
     toward the cursor with subtle perspective. Skipped on touch.
     ------------------------------------------------------------------ */
  (() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const MAX = 4; // degrees
    function attach(row) {
      if (row.dataset.tilted === '1') return;
      row.dataset.tilted = '1';
      let raf = 0;
      const move = (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = row.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - 0.5;
          const y = (e.clientY - r.top)  / r.height - 0.5;
          row.style.transform =
            `perspective(1400px) rotateX(${(-y * MAX).toFixed(2)}deg) rotateY(${(x * MAX).toFixed(2)}deg)`;
        });
      };
      const leave = () => {
        cancelAnimationFrame(raf);
        row.style.transform = '';
      };
      row.addEventListener('pointermove', move, { passive: true });
      row.addEventListener('pointerleave', leave);
    }
    // Initial pass + watch for newly rendered rows
    document.querySelectorAll('.work-row').forEach(attach);
    const mo = new MutationObserver(() => {
      document.querySelectorAll('.work-row').forEach(attach);
    });
    const host = document.getElementById('work-rows');
    if (host) mo.observe(host, { childList: true });
  })();

  /* ------------------------------------------------------------------
     Robot subtle perspective tilt — the avatar stage tilts forward as
     visitor scrolls toward the bottom of the section. "Looking down"
     visual cue handing off into the anatomy section below.
     ------------------------------------------------------------------ */
  (() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const avatarSection = document.querySelector('.avatar-section');
    const stage = document.getElementById('avatar-stage');
    if (!avatarSection || !stage) return;

    let raf = 0;
    function tick() {
      raf = 0;
      const r = avatarSection.getBoundingClientRect();
      const h = r.height;
      // 0 when section top is at viewport top; 1 when section bottom is at viewport top
      const p = Math.max(0, Math.min(1, -r.top / h));
      // Tilt activates only in the last 35% of the section
      const t = Math.max(0, Math.min(1, (p - 0.65) / 0.35));
      const deg = (t * 6).toFixed(2); // up to 6deg forward
      stage.style.transform = `perspective(1800px) rotateX(${deg}deg)`;
      stage.style.transformOrigin = 'center top';
    }
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    tick();
  })();

  /* ------------------------------------------------------------------
     Section wipe — thin mint hairline sweeps across when a new section
     becomes the dominant one in the viewport. Cinematic "cut" feel.
     ------------------------------------------------------------------ */
  (() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wipe = document.createElement('div');
    wipe.className = 'section-wipe';
    wipe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wipe);

    let currentSection = null;
    const sections = [...document.querySelectorAll('main > section, main > .marquee')];
    if (!sections.length) return;

    function trigger() {
      wipe.classList.remove('is-wiping');
      // force reflow so the animation can restart
      void wipe.offsetWidth;
      wipe.classList.add('is-wiping');
    }

    const io = new IntersectionObserver((entries) => {
      // Pick the section closest to the viewport's vertical middle
      let best = null, bestScore = Infinity;
      const mid = window.innerHeight * 0.5;
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const sectionMid = r.top + r.height / 2;
        const dist = Math.abs(sectionMid - mid);
        if (dist < bestScore) { best = s; bestScore = dist; }
      });
      if (best && best !== currentSection) {
        currentSection = best;
        // Skip the very first trigger (initial paint) to avoid an unwanted wipe
        if (wipe.dataset.bootstrapped === '1') trigger();
        else wipe.dataset.bootstrapped = '1';
      }
    }, { threshold: [0.15, 0.4, 0.6] });

    sections.forEach(s => io.observe(s));
  })();

  /* ------------------------------------------------------------------
     Browser language suggestion — first-visit only, if mismatch.
     ------------------------------------------------------------------ */
  (() => {
    const toast = document.getElementById('lang-toast');
    if (!toast) return;
    const KEY = 'portfolio.lang.suggested.v1';
    try { if (localStorage.getItem(KEY)) return; } catch {}

    const stored = (() => { try { return localStorage.getItem('portfolio-lang'); } catch { return null; } })();
    if (stored) { try { localStorage.setItem(KEY, '1'); } catch {} return; }

    const browser = (navigator.language || 'en').toLowerCase();
    const wantsAr = browser.startsWith('ar');
    const current = (window.getLang && window.getLang()) || 'en';
    if (wantsAr === (current === 'ar')) {
      try { localStorage.setItem(KEY, '1'); } catch {}
      return;
    }

    const acceptBtn = document.getElementById('lang-toast-accept');
    const denyBtn   = document.getElementById('lang-toast-deny');
    const remember = () => { try { localStorage.setItem(KEY, '1'); } catch {} };
    const hide = () => { toast.classList.remove('is-shown'); toast.setAttribute('aria-hidden', 'true'); remember(); };

    // Show after a short delay so it doesn't fight the page-load shell
    setTimeout(() => {
      toast.setAttribute('aria-hidden', 'false');
      toast.classList.add('is-shown');
    }, 2200);

    acceptBtn?.addEventListener('click', () => {
      const target = wantsAr ? 'ar' : 'en';
      if (typeof window.applyI18n === 'function') window.applyI18n(target);
      hide();
    });
    denyBtn?.addEventListener('click', hide);
  })();


  /* ------------------------------------------------------------------
     Time-of-day greeting — swap the avatar kicker based on Cairo hour.
     Re-runs on i18n switch so the Arabic variant picks up correctly.
     ------------------------------------------------------------------ */
  (() => {
    const kicker = document.querySelector('[data-i18n="avatar.kicker"]');
    if (!kicker) return;
    const slot = (h) => h < 5 ? 'night' : h < 12 ? 'morning' : h < 17 ? 'midday' : h < 23 ? 'evening' : 'night';
    function paint() {
      // Cairo hour
      const cairoHour = +new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Cairo', hour: '2-digit', hour12: false,
      }).format(new Date());
      const variant = `avatar.kicker.${slot(cairoHour)}`;
      const lang = (window.getLang && window.getLang()) || 'en';
      const dict = window.I18N && window.I18N[lang];
      const txt = dict && dict[variant];
      if (txt) kicker.textContent = txt;
    }
    paint();
    document.addEventListener('i18n:changed', paint);
    // Update once an hour in case visitor lingers
    setInterval(paint, 60 * 60 * 1000);
  })();


  /* ------------------------------------------------------------------
     PWA install banner — captures beforeinstallprompt, shows after a
     gentle delay, remembers dismissal in localStorage.
     ------------------------------------------------------------------ */
  (() => {
    const banner = document.getElementById('install-banner');
    if (!banner) return;
    const acceptBtn = document.getElementById('install-accept');
    const dismissBtn = document.getElementById('install-dismiss');
    const KEY = 'portfolio.install.dismissed.v1';

    let deferredPrompt = null;
    const dismissed = () => {
      try {
        const at = +localStorage.getItem(KEY);
        // re-ask after 30 days
        return at && (Date.now() - at) < 30 * 24 * 60 * 60 * 1000;
      } catch { return false; }
    };

    function show() {
      if (dismissed()) return;
      banner.setAttribute('aria-hidden', 'false');
      banner.classList.add('is-shown');
    }
    function hide() {
      banner.classList.remove('is-shown');
      banner.setAttribute('aria-hidden', 'true');
    }
    function remember() {
      try { localStorage.setItem(KEY, String(Date.now())); } catch {}
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // Give visitors time to look around before nudging
      setTimeout(show, 25_000);
    });

    acceptBtn?.addEventListener('click', async () => {
      if (!deferredPrompt) { hide(); return; }
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch {}
      deferredPrompt = null;
      remember();
      hide();
    });
    dismissBtn?.addEventListener('click', () => { remember(); hide(); });

    // Hide if the app is already installed
    window.addEventListener('appinstalled', () => { remember(); hide(); });
  })();


  /* ------------------------------------------------------------------
     Footer terminal hint — click to open the existing terminal easter egg
     ------------------------------------------------------------------ */
  (() => {
    const hint = document.querySelector('.footer-hint');
    const term = document.getElementById('terminal');
    if (!hint || !term) return;
    hint.style.cursor = 'pointer';
    hint.addEventListener('click', () => {
      // dispatch the same backtick that opens the terminal
      const evt = new KeyboardEvent('keydown', { key: '`', bubbles: true });
      document.dispatchEvent(evt);
    });
  })();

  /* ------------------------------------------------------------------
     2) hero word reveal — runs once on first paint
     ------------------------------------------------------------------ */
  requestAnimationFrame(() => {
    const heroName = document.querySelector('.hero-name');
    if (heroName) heroName.classList.add('is-revealed');
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
    const hint = document.querySelector('.hero-scroll-hint');
    if (hint) hint.classList.add('is-revealed');
  });


  /* ------------------------------------------------------------------
     3) active nav link
     ------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('.nav-links a');
  const navSections = Array.from(navLinks).map(a => {
    const id = a.getAttribute('href').slice(1);
    return { link: a, el: document.getElementById(id) };
  }).filter(s => s.el);

  function updateActiveNav() {
    const probeY = window.innerHeight * 0.4;
    let active = null;
    for (const s of navSections) {
      const r = s.el.getBoundingClientRect();
      if (r.top <= probeY) active = s;
    }
    navLinks.forEach(l => l.classList.remove('is-active'));
    if (active) active.link.classList.add('is-active');
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ------------------------------------------------------------------
     4) IntersectionObserver-based section reveals
     ------------------------------------------------------------------ */
  // Tag elements that should reveal on scroll. Section titles, kickers,
  // bodies, and grouped lists get the class. Stagger within groups.
  function setupReveals() {
    const sectionsToReveal = document.querySelectorAll(
      '.about-grid, .capabilities .container > *, .experience .container > *, ' +
      '.credentials .container > *, .work .container > *, ' +
      '.testimonials .container > *, .contact .container > *, .handoff .container > *'
    );
    sectionsToReveal.forEach(el => {
      // .exp-rows has its own dedicated reveal handler (line draw + stagger) — skip
      if (el.classList.contains('exp-rows')) return;
      el.classList.add('reveal-on-scroll');
    });

    // stagger groups: each work-row gets staggered if multiple in viewport
    document.querySelectorAll('.work-row').forEach((row, i) => {
      row.classList.add('reveal-on-scroll');
      row.dataset.stagger = (i % 3) + 1;
    });
    document.querySelectorAll('.quote').forEach((q, i) => {
      q.classList.add('reveal-on-scroll');
      q.dataset.stagger = i + 1;
    });
    document.querySelectorAll('.skill-row').forEach((r, i) => {
      r.classList.add('reveal-on-scroll');
      r.dataset.stagger = (i % 5) + 1;
    });
    document.querySelectorAll('.cred-row').forEach((r, i) => {
      r.classList.add('reveal-on-scroll');
      r.dataset.stagger = (i % 4) + 1;
    });

    // Experience: trigger the whole .exp-rows container so the line draws + rows stagger together
    const expRoot = document.querySelector('.exp-rows');
    if (expRoot && 'IntersectionObserver' in window) {
      const expIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            // rAF ensures the browser commits the initial state before adding the
            // revealing class, so the transitions fire (vs. snapping to end state).
            requestAnimationFrame(() => e.target.classList.add('is-revealed'));
            expIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      expIO.observe(expRoot);
    } else if (expRoot) {
      expRoot.classList.add('is-revealed');
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => io.observe(el));
  }
  setupReveals();


  /* ------------------------------------------------------------------
     Experience timeline — interactive bits:
       · dot tracks scroll position within the section (--scroll-pos: 0..1)
       · line + dot drift laterally with cursor X (--mouse-drift: -1..1)
       · the row closest to viewport centre gets .is-active (mint year, others dim)
     ------------------------------------------------------------------ */
  (() => {
    const expSection = document.getElementById('experience');
    const expRoot    = document.querySelector('.exp-rows');
    if (!expSection || !expRoot) return;

    let rows = [];
    let lastActive = -1;
    let driftTarget = 0, driftCurrent = 0;
    let scrollTarget = 0, scrollCurrent = 0;
    let inView = false;
    let rafQueued = false;

    function refreshRows() { rows = [...expRoot.querySelectorAll('.career-row')]; }
    refreshRows();
    // re-grab rows when language switch re-renders
    document.addEventListener('i18n:changed', () => setTimeout(refreshRows, 80));

    function compute() {
      const rect = expSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // Section progress: 0 at top of section meeting top of viewport,
      // 1 at bottom of section meeting bottom of viewport. Clamped.
      const total = rect.height + vh;
      const passed = vh - rect.top;
      scrollTarget = Math.max(0, Math.min(1, passed / total));

      // Engaged once the user has actually entered the section
      inView = rect.bottom > 0 && rect.top < vh;
      expRoot.classList.toggle('is-engaged', inView && rect.top < vh * 0.7);

      // Pick the row whose centre is closest to the viewport's centre
      if (rows.length) {
        const vmid = vh * 0.5;
        let bestIdx = -1, bestDist = Infinity;
        rows.forEach((r, i) => {
          const rr = r.getBoundingClientRect();
          const mid = rr.top + rr.height * 0.5;
          // only score rows actually overlapping the viewport
          if (rr.bottom < 0 || rr.top > vh) return;
          const d = Math.abs(mid - vmid);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        });
        if (bestIdx !== lastActive) {
          rows.forEach((r, i) => r.classList.toggle('is-active', i === bestIdx));
          lastActive = bestIdx;
        }
      }
    }

    function tick() {
      rafQueued = false;
      // Lerp both signals so the dot eases instead of jumping
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.18;
      driftCurrent  += (driftTarget  - driftCurrent)  * 0.10;
      expRoot.style.setProperty('--scroll-pos',   (scrollCurrent * 100).toFixed(2) + '%');
      expRoot.style.setProperty('--mouse-drift-px',     (driftCurrent * 4).toFixed(2) + 'px');
      expRoot.style.setProperty('--mouse-drift-line-px', (driftCurrent * 6).toFixed(2) + 'px');
      if (Math.abs(scrollTarget - scrollCurrent) > 0.001 ||
          Math.abs(driftTarget  - driftCurrent)  > 0.001) {
        schedule();
      }
    }
    function schedule() {
      if (!rafQueued) { rafQueued = true; requestAnimationFrame(tick); }
    }

    window.addEventListener('scroll', () => { compute(); schedule(); }, { passive: true });
    window.addEventListener('resize', () => { compute(); schedule(); });
    expSection.addEventListener('pointermove', (e) => {
      if (!inView) return;
      const rect = expSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;       // 0..1
      driftTarget = Math.max(-1, Math.min(1, (x - 0.5) * 2)); // -1..1
      schedule();
    });
    expSection.addEventListener('pointerleave', () => {
      driftTarget = 0;
      schedule();
    });

    compute();
    schedule();
  })();


  /* ------------------------------------------------------------------
     5) project modal — gallery + case study
     ------------------------------------------------------------------ */
  const modal      = document.getElementById('project-modal');
  const modalVideo = modal && modal.querySelector('.modal-video');
  const modalPrev  = modal && modal.querySelector('.modal-prev');
  const modalNext  = modal && modal.querySelector('.modal-next');
  const modalCounter = modal && modal.querySelector('.modal-counter');
  const modalBuffering = modal && modal.querySelector('.modal-buffering');
  const modalThumbs = modal && modal.querySelector('.modal-thumbs');
  const modalType  = modal && modal.querySelector('.modal-type');
  const modalYear  = modal && modal.querySelector('.modal-year');
  const modalRead  = modal && modal.querySelector('.modal-read');
  const modalTitle = modal && modal.querySelector('.modal-title');
  const modalCaption = modal && modal.querySelector('.modal-caption');
  const modalLede  = modal && modal.querySelector('.modal-lede');
  const modalProblem = modal && modal.querySelector('.modal-problem');
  const modalApproach = modal && modal.querySelector('.modal-approach');
  const modalOutcome = modal && modal.querySelector('.modal-outcome');
  const modalTech  = modal && modal.querySelector('.modal-tech');
  const modalLinks = modal && modal.querySelector('.modal-links');

  let activeProject = null;
  let activeClip = 0;

  function esc(s){ return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  window.__esc = esc; // share with other IIFEs in this file

  function loadClip(i) {
    if (!activeProject || !modalVideo) return;
    const g = activeProject.gallery || [];
    if (!g.length) return;
    activeClip = Math.max(0, Math.min(g.length - 1, i));
    const clip = g[activeClip];
    modalBuffering.classList.add('is-shown');
    modalVideo.pause();
    modalVideo.src = clip.video;
    modalVideo.poster = clip.poster || '';
    modalVideo.load();
    modalVideo.play().catch(() => {});
    if (modalCaption) modalCaption.textContent = (window.__pickLang ? window.__pickLang(clip, 'caption') : clip.caption) || '';
    if (modalCounter) modalCounter.textContent = `${activeClip + 1} / ${g.length}`;

    // thumbs active state
    if (modalThumbs) {
      Array.from(modalThumbs.children).forEach((t, idx) =>
        t.classList.toggle('is-active', idx === activeClip));
    }
    if (modalPrev) modalPrev.disabled = activeClip === 0;
    if (modalNext) modalNext.disabled = activeClip === g.length - 1;
  }

  function openProject(project, opts) {
    if (!modal || !project) return;
    activeProject = project;
    activeClip = 0;

    // Modal "expand from card": when invoked from a work-row click, use the
    // card's centre as the transform-origin so the modal looks like it grows
    // out of the card the visitor clicked. Falls back to viewport centre.
    const origin = opts && opts.origin;
    if (origin) {
      const x = ((origin.x / window.innerWidth) * 100).toFixed(1) + '%';
      const y = ((origin.y / window.innerHeight) * 100).toFixed(1) + '%';
      modal.style.setProperty('--tmodal-origin', `${x} ${y}`);
    } else {
      modal.style.setProperty('--tmodal-origin', '50% 50%');
    }

    const pick = window.__pickLang || ((o, f) => (o ? o[f] : undefined));

    modalType.textContent = pick(project, 'type') || '';
    modalYear.textContent = project.year || '';
    modalTitle.textContent = pick(project, 'title') || '';
    modalLede.textContent = pick(project, 'description') || '';

    // Reading time — based on case study text (200 wpm)
    if (modalRead) {
      const cs0 = project.caseStudy || {};
      const text = [
        pick(project, 'description') || '',
        pick(cs0, 'problem') || '',
        ...(pick(cs0, 'approach') || []),
        pick(cs0, 'outcome') || ''
      ].join(' ');
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.round(words / 200));
      const lang = (window.getLang && window.getLang()) || 'en';
      const label = lang === 'ar' ? `${mins} د قراءة` : `${mins} min read`;
      modalRead.textContent = label;
    }

    const cs = project.caseStudy || {};
    modalProblem.textContent = pick(cs, 'problem') || '';
    modalApproach.innerHTML = (pick(cs, 'approach') || []).map(s => `<li>${esc(s)}</li>`).join('');
    modalOutcome.textContent = pick(cs, 'outcome') || '';

    modalTech.innerHTML = (project.tech || []).map(t => `<li>${esc(t)}</li>`).join('');

    const links = [];
    if (project.github) links.push(`<a href="${esc(project.github)}" target="_blank" rel="noopener">Source <span>→</span></a>`);
    if (project.demo)   links.push(`<a href="${esc(project.demo)}" target="_blank" rel="noopener">Live demo <span>→</span></a>`);
    // No public links → say so honestly (client work, delivered locally).
    if (!project.github && !project.demo) {
      const lang = (window.getLang && window.getLang()) || 'en';
      const txt = lang === 'ar'
        ? 'تسليم لدى العميل · المصدر خاص'
        : 'Delivered to client · source private';
      links.push(`<span class="modal-private">${txt}</span>`);
    }
    modalLinks.innerHTML = links.join('');

    // build thumbs
    if (modalThumbs) {
      const g = project.gallery || [];
      modalThumbs.innerHTML = g.map((clip, i) =>
        `<button class="modal-thumb" role="tab" aria-label="Clip ${i + 1}" data-clip="${i}" style="background-image:url('${esc(clip.poster || '')}')"></button>`
      ).join('');
    }

    if (project.gallery && project.gallery.length) {
      modalVideo.parentElement.style.display = '';
      loadClip(0);
    } else {
      // lab project — hide stage
      modalVideo.parentElement.style.display = 'none';
      modalCaption.textContent = '';
    }

    // Wire share buttons (re-wired per project open since they need this project's data)
    const shareBtns = modal.querySelectorAll('.modal-share-btn');
    const slug = (window.__slugify ? window.__slugify(project.title) : project.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
    const url = `${location.origin}${location.pathname}?project=${slug}`;
    const shareText = `${project.title} — ${project.type || 'project'}`;
    shareBtns.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', async () => {
        const kind = newBtn.dataset.share;
        if (kind === 'copy') {
          try {
            await navigator.clipboard.writeText(url);
            const span = newBtn.querySelector('span');
            const orig = span.textContent;
            const lang = (window.getLang && window.getLang()) || 'en';
            span.textContent = lang === 'ar' ? 'تم!' : 'copied!';
            newBtn.classList.add('is-copied');
            setTimeout(() => { span.textContent = orig; newBtn.classList.remove('is-copied'); }, 1500);
          } catch {}
        } else if (kind === 'twitter') {
          const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
          window.open(u, '_blank', 'noopener,width=560,height=520');
        } else if (kind === 'linkedin') {
          const u = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          window.open(u, '_blank', 'noopener,width=560,height=620');
        }
      });
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeProject() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (modalVideo) { modalVideo.pause(); modalVideo.removeAttribute('src'); modalVideo.load(); }
    activeProject = null;
  }

  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(el =>
      el.addEventListener('click', closeProject));

    modalPrev && modalPrev.addEventListener('click', () => loadClip(activeClip - 1));
    modalNext && modalNext.addEventListener('click', () => loadClip(activeClip + 1));

    modalThumbs && modalThumbs.addEventListener('click', e => {
      const t = e.target.closest('.modal-thumb');
      if (t) loadClip(Number(t.dataset.clip));
    });

    modalVideo && modalVideo.addEventListener('canplay',
      () => modalBuffering.classList.remove('is-shown'));
    modalVideo && modalVideo.addEventListener('waiting',
      () => modalBuffering.classList.add('is-shown'));

    window.addEventListener('keydown', e => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeProject();
      else if (e.key === 'ArrowLeft' && activeProject) loadClip(activeClip - 1);
      else if (e.key === 'ArrowRight' && activeProject) loadClip(activeClip + 1);
    });
  }

  // expose for main.js to wire click handlers
  window.__openProject = openProject;


  /* ------------------------------------------------------------------
     6) language toggle (EN ↔ AR)
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-i18n-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.applyI18n !== 'function') return;
      const next = (window.getLang && window.getLang() === 'ar') ? 'en' : 'ar';
      window.applyI18n(next);
    });
  });


  /* ------------------------------------------------------------------
     7) hero name glitch — subtle, periodic
     ------------------------------------------------------------------ */
  const heroName = document.querySelector('.hero-name');
  if (heroName && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function glitchOnce() {
      heroName.classList.add('is-glitching');
      setTimeout(() => {
        heroName.classList.remove('is-glitching');
        heroName.classList.add('is-glitching-2');
        setTimeout(() => heroName.classList.remove('is-glitching-2'), 80);
      }, 90);
    }
    function scheduleGlitch() {
      const wait = 6000 + Math.random() * 6000;   // every 6–12s
      setTimeout(() => { glitchOnce(); scheduleGlitch(); }, wait);
    }
    scheduleGlitch();
  }


  /* ------------------------------------------------------------------
     8) custom cursor — mint dot
     ------------------------------------------------------------------ */
  const cursor = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    document.body.classList.add('has-custom-cursor');
    let cx = 0, cy = 0, tx = 0, ty = 0;
    let gx = 0, gy = 0;                  // glow position (lags further behind)
    let cursorActive = false;

    window.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!cursorActive) {
        cursorActive = true;
        cursor.classList.add('is-active');
        if (cursorGlow) cursorGlow.classList.add('is-active');
      }
    });
    window.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active'); cursorActive = false;
      if (cursorGlow) cursorGlow.classList.remove('is-active');
    });

    function follow() {
      cx += (tx - cx) * 0.25;
      cy += (ty - cy) * 0.25;
      // Glow lags further behind for a soft "afterimage" feel
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      if (cursorGlow) cursorGlow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);

    // Context-aware cursor morphing — pick the most specific class from the target.
    const cursorLabel = cursor.querySelector('.cursor-label');
    const CURSOR_STATES = ['is-hover', 'is-card', 'is-text', 'is-close'];
    function setCursorState(state, label) {
      CURSOR_STATES.forEach(s => cursor.classList.toggle(s, s === state));
      if (cursorLabel) cursorLabel.setAttribute('data-label', label || '');
      if (cursorGlow) cursorGlow.classList.toggle('is-hover', state === 'is-card' || state === 'is-hover');
    }
    function detectState(target) {
      if (target.closest('.modal-close, .tmodal-close, .terminal-close, .quote-delete, [data-close-modal], [data-tclose], [data-palette-close]'))
        return ['is-close', null];
      if (target.closest('.work-row'))
        return ['is-card', 'view'];
      if (target.closest('input[type="text"], input[type="email"], input[type="search"], textarea, .palette-input, .terminal-input'))
        return ['is-text', null];
      if (target.closest('a, button, .chapter-dot, .modal-thumb, .filter-chip, .hotspot'))
        return ['is-hover', null];
      return [null, null];
    }
    document.body.addEventListener('mouseover', e => {
      const [state, label] = detectState(e.target);
      if (state) setCursorState(state, label);
    });
    document.body.addEventListener('mouseout', e => {
      const [state] = detectState(e.target);
      if (state) setCursorState(null, null);
    });
    window.addEventListener('mousedown', () => cursor.classList.add('is-click'));
    window.addEventListener('mouseup',   () => cursor.classList.remove('is-click'));
  }


  /* ------------------------------------------------------------------
     9) 3D tilt on portrait + project cards
     ------------------------------------------------------------------ */
  function attachTilt(el, max = 4) {
    if (!el) return;
    let raf = 0;
    const onMove = e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        const rx = (-y * max).toFixed(2);
        const ry = ( x * max).toFixed(2);
        el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  }
  attachTilt(document.querySelector('.about-portrait'), 6);
  document.querySelectorAll('.work-media').forEach(m => attachTilt(m, 4));


  /* ------------------------------------------------------------------
     10) mobile hamburger menu
     ------------------------------------------------------------------ */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose= document.querySelector('.mobile-menu-close');
  function openMenu()  { hamburger.classList.add('is-open');  mobileMenu.classList.add('is-open');  document.body.classList.add('menu-open'); mobileMenu.setAttribute('aria-hidden','false'); }
  function closeMenu() { hamburger.classList.remove('is-open');mobileMenu.classList.remove('is-open');document.body.classList.remove('menu-open');mobileMenu.setAttribute('aria-hidden','true'); }
  if (hamburger) hamburger.addEventListener('click', () =>
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu());
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));


  /* ------------------------------------------------------------------
     11) terminal easter egg
     ------------------------------------------------------------------ */
  const terminal = document.getElementById('terminal');
  const tBody    = document.getElementById('terminal-body');
  const tInput   = document.getElementById('terminal-input');
  const history = []; let histIdx = -1;

  function tPrint(html, cls = 'terminal-output') {
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = html;
    tBody.appendChild(div);
    tBody.scrollTop = tBody.scrollHeight;
  }
  function tEcho(cmd) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = `<span class="terminal-prompt">guest@almoatasim:~$</span><span>${esc(cmd)}</span>`;
    tBody.appendChild(div);
  }

  const JOKES = [
    'Two SQL tables walk into a bar. They tried to join. It didn\'t work out.',
    'There are 10 kinds of people: those who understand binary, and those who don\'t.',
    'A QA engineer walks into a bar. Orders a beer. Orders 0 beers. Orders -1 beers. Orders NULL beers.',
    'It\'s not a bug. It\'s an undocumented feature.',
  ];

  const COMMANDS = {
    help: () => tPrint(
      `<strong>available commands</strong>
help     · list commands
whoami   · about me
skills   · what I work with
projects · client &amp; lab work
contact  · how to reach me
cv       · download my CV
joke     · programmer joke
coffee   · ☕
matrix   · ...
secrets  · hidden things
clear    · clear screen
exit     · close terminal`),

    whoami: () => tPrint(
      `<strong>AlMoatasimbillah Medhat</strong> — software engineer &amp; penetration tester
based in Cairo. building software carefully, breaking it on purpose.
five years in the field. Computer Engineering, BHI University.`),

    skills: () => tPrint(
      `<strong>six categories, ~40 tools</strong>
cybersecurity   · penetration testing, OWASP Top 10, Burp Suite, Nmap, Metasploit
engineering     · Java, OOP, ISTQB, test case design, SDLC
automation      · Python, Bash, CLI tooling
networking      · TCP/IP, VPN, firewalls, Wireshark
systems &amp; IT    · Windows Server, Linux, virtualization, Active Directory
tools           · Git, VS Code, Postman, Jira, Trello`),

    projects: () => tPrint(
      `<strong>11 projects total</strong>
client work    · BoxStore, Salsabeel, Ali Baba POS, Clothes POS, Al-Noor School, CW App, Portfolio Evolution
lab / security · Web Vuln Scanner, Network Monitor, CTF Writeups, Pentest Lab
scroll down or type <strong>exit</strong> + click any card.`),

    contact: () => tPrint(
      `<strong>reach me</strong>
WhatsApp · <a href="https://wa.me/201060058378" target="_blank">+20 106 005 8378</a>
Email    · <a href="mailto:almoatasimhasanain@gmail.com">almoatasimhasanain@gmail.com</a>
LinkedIn · <a href="https://www.linkedin.com/in/almoatasimhasanain/" target="_blank">linkedin.com/in/almoatasimhasanain</a>
GitHub   · <a href="https://github.com/Almoatasimbillah" target="_blank">github.com/Almoatasimbillah</a>`),

    cv: () => { tPrint('<strong>opening CV...</strong>'); setTimeout(() => window.open('images/cv.pdf', '_blank'), 400); },

    joke: () => tPrint(JOKES[Math.floor(Math.random()*JOKES.length)]),

    coffee: () => tPrint(
`     )  (
    (   ) )
     ) ( (
   _______)_
.-'---------|
( C|/\\/\\/\\/|
 '-./\\/\\/\\/|
   '_________'
    '-------'
i run on bash, chai, and an unhealthy amount of curiosity.`),

    matrix: () => {
      const chars = '01アイウエオカキクケコサシスセソタチツテト';
      let out = '';
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 60; c++) out += chars[Math.floor(Math.random()*chars.length)];
        out += '\n';
      }
      tPrint(`<pre class="matrix-pre">${out}</pre>`);
    },

    secrets: () => tPrint(
      `<strong>hidden things</strong>
- press <em>↑↑↓↓←→←→ b a</em> for developer mode
- press <em>backtick</em> (\`) to open / close this terminal
- arrow keys navigate the project gallery
- <em>Ctrl+P</em> prints a CV-friendly version of the page`),

    clear: () => { tBody.innerHTML = ''; },

    exit:  () => closeTerminal(),
  };

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    tEcho(raw);
    if (COMMANDS[cmd]) COMMANDS[cmd]();
    else tPrint(`<strong>${esc(cmd)}</strong>: command not found. type <em>help</em>.`, 'terminal-output');
    history.unshift(raw); histIdx = -1;
  }

  function openTerminal() {
    if (!terminal) return;
    terminal.classList.add('is-open');
    terminal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('terminal-open');
    setTimeout(() => tInput && tInput.focus(), 50);
  }
  function closeTerminal() {
    if (!terminal) return;
    terminal.classList.remove('is-open');
    terminal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('terminal-open');
  }

  if (terminal && tInput) {
    document.querySelector('.terminal-close').addEventListener('click', closeTerminal);

    tInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const v = tInput.value;
        tInput.value = '';
        runCommand(v);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history[histIdx + 1] !== undefined) { histIdx++; tInput.value = history[histIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; tInput.value = history[histIdx]; }
        else { histIdx = -1; tInput.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const partial = tInput.value.toLowerCase();
        const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
        if (match) tInput.value = match;
      }
    });

    window.addEventListener('keydown', e => {
      // ignore if typing in another input
      const inField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (inField && e.target !== tInput) return;
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        terminal.classList.contains('is-open') ? closeTerminal() : openTerminal();
      } else if (e.key === 'Escape' && terminal.classList.contains('is-open')) {
        closeTerminal();
      }
    });
  }


  /* ------------------------------------------------------------------
     12) ANATOMY component hotspots (show at the final frame)
     ------------------------------------------------------------------ */
  const hotspots = document.querySelector('.hotspots');
  if (hotspots) {
    // expose a setter the scrubber loop calls each tick.
    // The unified scroll runs 0→1 covering intro+anatomy. Hotspots should
    // only appear at the very end (after the full disassembly).
    window.__updateHotspots = (progress) => {
      const shown = progress > 0.97;
      if (shown !== hotspots.classList.contains('is-shown')) {
        hotspots.classList.toggle('is-shown', shown);
      }
    };
    hotspots.querySelectorAll('.hotspot').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = btn.dataset.target;
        const el = document.querySelector(sel);
        if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
      });
    });
  }


  /* ------------------------------------------------------------------
     13) PROJECT filter chips — with live counts
     ------------------------------------------------------------------ */
  const filterChips = document.querySelectorAll('.filter-chip');

  // Compute counts per category once
  function paintFilterCounts() {
    const rows = [...document.querySelectorAll('.work-row')];
    const counts = { all: rows.length };
    rows.forEach(r => {
      const c = r.dataset.category || 'other';
      counts[c] = (counts[c] || 0) + 1;
    });
    filterChips.forEach(chip => {
      const k = chip.dataset.filter;
      const n = counts[k] || 0;
      let countEl = chip.querySelector('.filter-count');
      if (!countEl) {
        countEl = document.createElement('span');
        countEl.className = 'filter-count';
        chip.appendChild(countEl);
      }
      countEl.textContent = n;
    });
  }
  // Wait a tick for the DOM to be populated by main.js, then paint
  setTimeout(paintFilterCounts, 0);

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      filterChips.forEach(c => c.classList.toggle('is-active', c === chip));
      document.querySelectorAll('.work-row').forEach(row => {
        const cat = row.dataset.category || '';
        row.dataset.hidden = (filter === 'all' || cat === filter) ? 'false' : 'true';
      });
    });
  });


  /* ------------------------------------------------------------------
     14) SHAREABLE project URLs — ?project=slug deep links into the modal
     ------------------------------------------------------------------ */
  function slugify(s) {
    return String(s).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  // expose so main.js can read/store slugs on cards
  window.__slugify = slugify;

  function projectBySlug(slug) {
    if (!window.PORTFOLIO_DATA) return null;
    return window.PORTFOLIO_DATA.projects.find(p => slugify(p.title) === slug) || null;
  }

  // intercept modal open to push to URL
  const _origOpen = window.__openProject;
  if (_origOpen) {
    window.__openProject = function(project) {
      _origOpen(project);
      if (project && project.title) {
        const slug = slugify(project.title);
        const url = new URL(window.location.href);
        url.searchParams.set('project', slug);
        history.pushState({ project: slug }, '', url);
      }
    };
  }
  // close → strip the param
  const modalForUrl = document.getElementById('project-modal');
  if (modalForUrl) {
    modalForUrl.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => {
        const url = new URL(window.location.href);
        if (url.searchParams.has('project')) {
          url.searchParams.delete('project');
          history.pushState({}, '', url);
        }
      });
    });
  }
  window.addEventListener('popstate', e => {
    const url = new URL(window.location.href);
    const slug = url.searchParams.get('project');
    if (slug) {
      const p = projectBySlug(slug);
      if (p && window.__openProject) window.__openProject(p);
    } else if (modalForUrl && modalForUrl.classList.contains('is-open')) {
      // closed via back button
      document.querySelector('.modal-close')?.click();
    }
  });
  // initial load: open from URL
  (() => {
    const slug = new URLSearchParams(location.search).get('project');
    if (!slug) return;
    const start = () => {
      const p = projectBySlug(slug);
      if (p && window.__openProject) window.__openProject(p);
    };
    if (window.PORTFOLIO_DATA) setTimeout(start, 400);
    else document.addEventListener('DOMContentLoaded', () => setTimeout(start, 400));
  })();


  /* ------------------------------------------------------------------
     15) CONTACT form (Web3Forms)
     ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('.form-submit');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const accessKey = form.querySelector('[name="access_key"]').value;
      const dict = (window.I18N && window.I18N[window.getLang ? window.getLang() : 'en']) || {};

      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        status.textContent = '(Web3Forms key not configured — see index.html)';
        status.className = 'form-status is-error';
        return;
      }

      status.textContent = dict['form.sending'] || 'sending...';
      status.className = 'form-status';
      submit.disabled = true;

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        const json = await res.json();
        if (json.success) {
          status.textContent = dict['form.sent'] || 'sent — talk soon.';
          status.className = 'form-status is-ok';
          form.reset();
          celebrateFormSuccess(form);
        } else throw new Error(json.message || 'failed');
      } catch (err) {
        status.textContent = dict['form.error'] || 'something went wrong.';
        status.className = 'form-status is-error';
      } finally {
        submit.disabled = false;
      }
    });
  }


  /* ------------------------------------------------------------------
     Form success celebration — small mint particle burst around the
     submit button, with a serif "talk soon" overlay that fades out.
     ------------------------------------------------------------------ */
  function celebrateFormSuccess(form) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const submit = form.querySelector('button[type="submit"], .form-submit');
    if (!submit) return;
    const r = submit.getBoundingClientRect();
    const ox = r.left + r.width / 2;
    const oy = r.top + r.height / 2;
    const burst = document.createElement('div');
    burst.className = 'form-burst';
    burst.style.left = ox + 'px';
    burst.style.top  = oy + 'px';
    const lang = (window.getLang && window.getLang()) || 'en';
    const msg  = lang === 'ar' ? 'نتكلّم قريب' : 'talk soon';
    burst.innerHTML = `
      <em class="form-burst-text">${msg}</em>
      ${Array.from({length: 14}, (_, i) => {
        const angle = (Math.PI * 2 * i) / 14;
        const dist = 70 + Math.random() * 60;
        const dx = (Math.cos(angle) * dist).toFixed(1);
        const dy = (Math.sin(angle) * dist).toFixed(1);
        const delay = (Math.random() * 0.1).toFixed(2);
        return `<span class="form-burst-dot" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${delay}s"></span>`;
      }).join('')}
    `;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 2200);
  }


  /* ------------------------------------------------------------------
     16) Cmd+K SEARCH palette
     ------------------------------------------------------------------ */
  const palette = document.getElementById('palette');
  const palInput = document.getElementById('palette-input');
  const palList = document.getElementById('palette-results');
  let palIndex = 0;
  let palItems = [];

  function buildPaletteIndex() {
    const items = [];
    // sections
    document.querySelectorAll('main section[id]').forEach(s => {
      const t = s.querySelector('.section-title, .handoff-title, .hero-name');
      if (!t) return;
      items.push({ kind: 'section', title: t.textContent.trim().replace(/\s+/g,' '), target: '#' + s.id });
    });
    // projects
    if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) {
      window.PORTFOLIO_DATA.projects.forEach(p => {
        items.push({ kind: 'project', title: p.title, meta: p.type, project: p });
      });
    }
    // skills
    if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.skills) {
      window.PORTFOLIO_DATA.skills.forEach(s => {
        s.tags.forEach(tag => items.push({ kind: 'skill', title: tag, meta: s.title, target: '#capabilities' }));
      });
    }
    return items;
  }
  let palDataset = [];
  function renderPaletteResults(q) {
    if (!palDataset.length) palDataset = buildPaletteIndex();
    const query = q.trim().toLowerCase();
    let hits = palDataset;
    if (query) {
      hits = palDataset.filter(it =>
        it.title.toLowerCase().includes(query) ||
        (it.meta && it.meta.toLowerCase().includes(query))
      );
    }
    hits = hits.slice(0, 12);
    palItems = hits;
    if (!hits.length) {
      const lang = (window.getLang && window.getLang()) || 'en';
      const headline = lang === 'ar'
        ? `لا نتائج لـ "${esc(q)}"`
        : `Nothing matched “${esc(q)}”`;
      const hint = lang === 'ar'
        ? 'جرّب: <kbd>أعمال</kbd> · <kbd>قدرات</kbd> · <kbd>تواصل</kbd> · أو اسم مشروع.'
        : 'Try: <kbd>work</kbd> · <kbd>skills</kbd> · <kbd>contact</kbd> · or a project name.';
      palList.innerHTML = `
        <li class="pr-empty">
          <span class="pr-empty-headline">${headline}</span>
          <span class="pr-empty-hint">${hint}</span>
        </li>`;
      return;
    }
    palList.innerHTML = hits.map((it, i) => `
      <li role="option" data-i="${i}" aria-selected="${i === 0}">
        <span class="pr-kind">${esc(it.kind)}</span>
        <span class="pr-title">${esc(it.title)}</span>
        ${it.meta ? `<span class="pr-meta">${esc(it.meta)}</span>` : ''}
      </li>
    `).join('');
    palIndex = 0;
  }
  function activatePaletteItem(it) {
    closePalette();
    if (it.kind === 'project' && it.project && window.__openProject) {
      window.__openProject(it.project);
    } else if (it.target) {
      const el = document.querySelector(it.target);
      if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
    }
  }
  function openPalette() {
    if (!palette) return;
    palette.classList.add('is-open');
    palette.setAttribute('aria-hidden', 'false');
    document.body.classList.add('palette-open');
    palDataset = []; // rebuild to pick up current data
    renderPaletteResults('');
    setTimeout(() => palInput && palInput.focus(), 50);
  }
  function closePalette() {
    if (!palette) return;
    palette.classList.remove('is-open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('palette-open');
    if (palInput) palInput.value = '';
  }
  if (palette && palInput && palList) {
    palette.querySelectorAll('[data-palette-close]').forEach(el =>
      el.addEventListener('click', closePalette));
    palInput.addEventListener('input', () => renderPaletteResults(palInput.value));
    palInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePalette();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        palIndex = Math.min(palItems.length - 1, palIndex + 1);
        palList.querySelectorAll('li').forEach((li, i) => li.setAttribute('aria-selected', i === palIndex));
        palList.children[palIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        palIndex = Math.max(0, palIndex - 1);
        palList.querySelectorAll('li').forEach((li, i) => li.setAttribute('aria-selected', i === palIndex));
        palList.children[palIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (palItems[palIndex]) activatePaletteItem(palItems[palIndex]);
      }
    });
    palList.addEventListener('click', e => {
      const li = e.target.closest('li[data-i]');
      if (li) activatePaletteItem(palItems[Number(li.dataset.i)]);
    });
    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.classList.contains('is-open') ? closePalette() : openPalette();
      }
    });
  }


  /* ------------------------------------------------------------------
     17) CURSOR-AWARE aurora — gradient drifts toward the pointer
     ------------------------------------------------------------------ */
  const aurora = document.querySelector('.hero-aurora');
  if (aurora && window.matchMedia('(hover: hover)').matches) {
    let mx = 0.5, my = 0.5, cmx = 0.5, cmy = 0.5;
    window.addEventListener('mousemove', e => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    });
    function auroraTick() {
      cmx += (mx - cmx) * 0.04;
      cmy += (my - cmy) * 0.04;
      const dx = (cmx - 0.5) * 6;   // ±3% drift
      const dy = (cmy - 0.5) * 6;
      aurora.style.translate = `${dx}% ${dy}%`;
      requestAnimationFrame(auroraTick);
    }
    requestAnimationFrame(auroraTick);
  }


  /* ------------------------------------------------------------------
     18) SECTION SCROLL PROGRESS — thin mint line at the top of each section
     ------------------------------------------------------------------ */
  const numberedSections = document.querySelectorAll('section[data-num]');
  function updateSectionProgress() {
    const vh = window.innerHeight;
    numberedSections.forEach(s => {
      const rect = s.getBoundingClientRect();
      const total = rect.height;
      const passed = Math.min(total, Math.max(0, -rect.top + vh * 0.4));
      const p = total > 0 ? passed / total : 0;
      s.style.setProperty('--p', p.toFixed(3));
    });
  }
  window.addEventListener('scroll', updateSectionProgress, { passive: true });
  updateSectionProgress();


  /* ------------------------------------------------------------------
     19) LIVE GitHub stats — cached 1h in localStorage
     ------------------------------------------------------------------ */
  async function loadGhStats() {
    const grid = document.getElementById('gh-stats');
    if (!grid) return;
    const KEY = 'gh-stats-cache-v1';
    const TTL = 60 * 60 * 1000; // 1h
    try {
      const cached = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (cached && Date.now() - cached.t < TTL) { paint(cached.data); return; }
    } catch {}

    try {
      const user = await fetch('https://api.github.com/users/Almoatasimbillah').then(r => r.json());
      const repos = await fetch('https://api.github.com/users/Almoatasimbillah/repos?per_page=100').then(r => r.json());
      const stars = Array.isArray(repos) ? repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) : 0;
      const data = {
        repos:     user.public_repos ?? '—',
        followers: user.followers     ?? '—',
        stars,
        since:     user.created_at ? new Date(user.created_at).getFullYear() : '—',
      };
      localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data }));
      paint(data);
    } catch (err) {
      // fail silently — leave dashes
    }

    function paint(d) {
      grid.querySelectorAll('[data-gh]').forEach(el => {
        const k = el.dataset.gh;
        if (d[k] !== undefined) el.textContent = d[k];
      });
    }
  }
  loadGhStats();

  /* ------------------------------------------------------------------
     GitHub contributions heatmap — last 12 months × 7 days, cached 6h.
     Uses jogruber's free contributions API (no auth needed).
     ------------------------------------------------------------------ */
  async function loadGhHeatmap() {
    const root = document.getElementById('gh-heatmap');
    const grid = document.getElementById('gh-heatmap-grid');
    const totalEl = document.getElementById('gh-heatmap-total');
    if (!root || !grid) return;
    const KEY = 'gh-heatmap-cache-v1';
    const TTL = 6 * 60 * 60 * 1000;
    const USER = 'Almoatasimbillah';

    let data = null;
    try {
      const c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < TTL) data = c.data;
    } catch {}

    if (!data) {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`);
        if (!res.ok) throw 0;
        const j = await res.json();
        data = { contributions: j.contributions || [], total: (j.total && j.total.lastYear) || 0 };
        try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data })); } catch {}
      } catch {
        root.classList.add('is-error');
        return;
      }
    }

    paint(data);

    function paint(d) {
      const cells = d.contributions || [];
      if (!cells.length) { root.classList.add('is-error'); return; }
      // 0–4 levels using percentile-ish thresholds
      const counts = cells.map(c => c.count).filter(n => n > 0).sort((a, b) => a - b);
      const t = (p) => counts[Math.floor(counts.length * p)] || 0;
      const lvl = (n) => n === 0 ? 0 : n <= t(0.25) ? 1 : n <= t(0.50) ? 2 : n <= t(0.85) ? 3 : 4;

      // Bucket into weeks (cols) × 7 days
      const startDay = new Date(cells[0].date).getDay(); // pad start so weeks align
      const weeks = [];
      for (let i = 0; i < startDay; i++) weeks[0] = (weeks[0] || []), weeks[0].push(null);
      let week = weeks[0] || [];
      if (!weeks[0]) weeks.push(week);

      cells.forEach(c => {
        if (week.length === 7) { week = []; weeks.push(week); }
        week.push(c);
      });

      grid.style.setProperty('--gh-cols', String(weeks.length));
      grid.innerHTML = weeks.map(w => `
        <div class="gh-week">
          ${Array.from({length: 7}, (_, di) => {
            const c = w[di];
            if (!c) return `<span class="gh-cell" data-level="-1"></span>`;
            return `<span class="gh-cell" data-level="${lvl(c.count)}" title="${c.date}: ${c.count}"></span>`;
          }).join('')}
        </div>
      `).join('');

      if (totalEl) {
        const lang = (window.getLang && window.getLang()) || 'en';
        const word = (window.I18N && window.I18N[lang] && window.I18N[lang]['gh.contributions']) || 'contributions';
        const num  = d.total.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
        totalEl.textContent = `${num} ${word}`;
      }
    }
    document.addEventListener('i18n:changed', () => { if (data) paint(data); });
  }
  loadGhHeatmap();


  /* ------------------------------------------------------------------
     20) PWA — register the production service worker (caching enabled).
        sw.js handles cache-first/network-first/SWR strategies per asset.
        Calls update() on each load so JS/CSS edits propagate on next visit.
     ------------------------------------------------------------------ */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('sw.js');
        // Check for SW updates each page load
        reg.update().catch(() => {});
        // When a new SW is waiting, prompt it to take over immediately
        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              sw.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      } catch {}
    });
  }


  /* ------------------------------------------------------------------
     21) konami easter egg
     ------------------------------------------------------------------ */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  const toast = document.querySelector('.toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-shown'), 2400);
  }

  window.addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) {
        kIdx = 0;
        document.body.classList.toggle('konami');
        showToast(document.body.classList.contains('konami')
          ? 'developer mode · on'
          : 'developer mode · off');
      }
    } else {
      kIdx = (k === KONAMI[0]) ? 1 : 0;
    }
  });

})();

/* =========================================================
   Desk-loop self-portrait — only decode video while it's on
   screen. Autoplay resumes when the About section scrolls in.
   ========================================================= */
(() => {
  const v = document.querySelector('.about-desk video');
  if (!v || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const p = v.play();
        if (p) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.1 }).observe(v);
})();
