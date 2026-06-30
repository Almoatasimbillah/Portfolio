/* =========================================================
   sphere.js
   3D rotating sphere of skill LOGOS — pure vanilla
   · Fibonacci distribution on a unit sphere
   · Perspective projection
   · Mouse + touch drag + inertia
   · Constellation lines between nearest neighbours
   · Mint glow on closest labels
   · Click to scroll & ping the matching skill row
   ========================================================= */

(() => {
  const host = document.getElementById('skill-sphere');
  if (!host) return;
  const D = window.PORTFOLIO_DATA;
  if (!D || !D.skills) return;

  /* ----- map tool names → simple-icons slugs (monochrome SVG CDN) ----- */
  const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/';
  // Only well-known simple-icons slugs — no fakes / substitutes.
  // If a skill (or project tech) has no real logo it's skipped.
  const LOGO_MAP = {
    // Languages
    'Python':            'python',
    'Java':              'openjdk',
    'JavaScript':        'javascript',
    'PHP':               'php',
    // Frameworks / runtimes
    'Laravel':           'laravel',
    'React':             'react',
    'Node.js':           'nodedotjs',
    'Express':           'express',
    'Electron':          'electron',
    // Databases
    'MySQL':             'mysql',
    'MongoDB':           'mongodb',
    'PostgreSQL':        'postgresql',
    // Security
    'OWASP Top 10':      'owasp',
    'OWASP ZAP':         'owasp',
    'Burp Suite':        'burpsuite',
    'Wireshark':         'wireshark',
    'Metasploit':        'metasploit',
    // Shells
    'Bash':              'gnubash',
    'Bash Scripting':    'gnubash',
    // Systems
    'Linux (Kali/Ubuntu)':'kalilinux',
    'Linux':             'linux',
    'Virtualization (VMware/VirtualBox)': 'vmware',
    // Tools
    'Git & GitHub':      'github',
    'Git':               'git',
    'GitHub':            'github',
    'VS Code':           'visualstudiocode',
    'Postman':           'postman',
    'Jira':              'jira',
    'Trello':            'trello',
  };

  /* ----- collect labels — from skills AND project tech, dedup by slug ----- */
  const seen = new Set();
  const labels = [];
  function add(text, category) {
    const slug = LOGO_MAP[text];
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      labels.push({ text, category, slug });
    }
  }
  D.skills.forEach(cat => cat.tags.forEach(tag => add(tag, cat.title)));
  if (D.projects) {
    D.projects.forEach(p => (p.tech || []).forEach(t => add(t, 'Project tech')));
  }

  // Bail out if we somehow have nothing
  if (!labels.length) { host.style.display = 'none'; return; }

  const N = labels.length;

  /* ----- create label DOM nodes ----- */
  const els = labels.map((lab, i) => {
    const span = document.createElement('span');
    span.className = 'sphere-label sphere-logo';
    span.title = `${lab.text} · ${lab.category}`;
    span.dataset.idx = i;
    span.style.animationDelay = (0.05 + i * 0.035) + 's';

    const img = document.createElement('img');
    img.alt = lab.text;
    img.draggable = false;
    img.src = `${CDN}${lab.slug}.svg`;
    img.onerror = () => {
      // Fallback: show the tool's first letter as a serif glyph
      span.removeChild(img);
      span.classList.remove('sphere-logo');
      span.classList.add('sphere-glyph');
      span.textContent = lab.text.charAt(0).toUpperCase();
    };
    span.appendChild(img);

    // Tooltip caption that fades in on hover (over the logo)
    const cap = document.createElement('span');
    cap.className = 'sphere-cap';
    cap.textContent = lab.text;
    span.appendChild(cap);

    host.appendChild(span);
    return span;
  });

  /* ----- Fibonacci sphere positions (unit sphere) ----- */
  const positions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / Math.max(1, N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * golden;
    positions.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
    });
  }

  /* ----- nearest-neighbour pairs (for constellation lines) ----- */
  const K = 2;
  const pairs = new Set();
  for (let i = 0; i < N; i++) {
    const dists = [];
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const dz = positions[i].z - positions[j].z;
      dists.push({ j, d: dx*dx + dy*dy + dz*dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < K; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      pairs.add(key);
    }
  }
  const pairList = Array.from(pairs).map(p => p.split('-').map(Number));

  const svg = host.querySelector('.sphere-lines');
  const lineEls = pairList.map(() => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg.appendChild(l);
    return l;
  });

  /* ----- sizing ----- */
  let RADIUS = 220;
  let PERSP  = 700;
  function recomputeSize() {
    const w = host.clientWidth;
    RADIUS = Math.max(120, Math.min(290, w * 0.42));
    PERSP  = RADIUS * 3.0;
  }
  recomputeSize();
  window.addEventListener('resize', recomputeSize);

  let rx = 0, ry = 0;
  let vx = 0, vy = 0;
  let auto = true;
  let dragging = false;
  let lastX = 0, lastY = 0;
  let downX = 0, downY = 0;
  let idleSince = performance.now();
  let interacted = false;
  const hint = document.getElementById('sphere-hint');

  function rotate(p) {
    const cy = Math.cos(ry), sy = Math.sin(ry);
    let x =  p.x * cy + p.z * sy;
    let z = -p.x * sy + p.z * cy;
    let y =  p.y;
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const ny =  y * cx - z * sx;
    const nz =  y * sx + z * cx;
    return { x, y: ny, z: nz };
  }
  function project(p) {
    const f = PERSP / (PERSP - p.z * RADIUS);
    return { x: p.x * RADIUS * f, y: p.y * RADIUS * f, scale: f };
  }

  const cache = els.map(() => ({ op: -1, sc: -1, zi: -1, front: false, back: false }));
  const rotatedCache = new Array(N);

  function render() {
    for (let i = 0; i < N; i++) {
      const r = rotate(positions[i]);
      rotatedCache[i] = r;
      const p = project(r);

      const depth = (r.z + 1) / 2;
      const opacity = 0.20 + depth * 0.80;
      const scale   = 0.55 + depth * 0.55;
      const blur    = depth < 0.30 ? (0.30 - depth) * 4 : 0;

      const el = els[i];
      const c  = cache[i];

      el.style.transform =
        `translate(-50%,-50%) translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;

      const opR = Math.round(opacity * 100) / 100;
      if (opR !== c.op) { el.style.opacity = opR; c.op = opR; }

      const zi = Math.round(p.scale * 1000);
      if (zi !== c.zi) { el.style.zIndex = zi; c.zi = zi; }

      const wantBack = blur > 0.05;
      if (wantBack !== c.back) {
        el.classList.toggle('is-back', wantBack);
        c.back = wantBack;
      }
      if (wantBack) el.style.filter = `blur(${blur.toFixed(2)}px) brightness(0) invert(0.7)`;
      else if (el.style.filter) el.style.filter = '';

      const wantFront = depth > 0.78;
      if (wantFront !== c.front) {
        el.classList.toggle('is-front', wantFront);
        c.front = wantFront;
      }
    }

    /* lines */
    for (let k = 0; k < pairList.length; k++) {
      const [i, j] = pairList[k];
      const a = rotatedCache[i];
      const b = rotatedCache[j];
      const pa = project(a);
      const pb = project(b);
      const halfW = host.clientWidth * 0.5 || 300;
      const x1 = pa.x / halfW;
      const y1 = pa.y / halfW;
      const x2 = pb.x / halfW;
      const y2 = pb.y / halfW;
      const depth = ((a.z + 1) / 2 + (b.z + 1) / 2) / 2;
      const op = depth < 0.4 ? 0 : Math.min(0.28, (depth - 0.4) * 0.5);
      const line = lineEls[k];
      line.setAttribute('x1', x1.toFixed(3));
      line.setAttribute('y1', y1.toFixed(3));
      line.setAttribute('x2', x2.toFixed(3));
      line.setAttribute('y2', y2.toFixed(3));
      line.setAttribute('opacity', op.toFixed(2));
    }
  }

  function tick() {
    const now = performance.now();
    if (!dragging) {
      if (Math.abs(vx) > 0.0001 || Math.abs(vy) > 0.0001) {
        ry += vy;
        rx += vx;
        vx *= 0.965;
        vy *= 0.965;
        idleSince = now;
      } else if (auto && now - idleSince > 600) {
        ry += 0.0028;
        rx += Math.sin(now * 0.00018) * 0.0007;
      }
    }
    render();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function maybeHideHint() {
    if (!interacted && hint) {
      interacted = true;
      hint.classList.add('is-gone');
    }
  }

  function onDown(x, y) {
    dragging = true;
    auto = false;
    lastX = x; lastY = y;
    downX = x; downY = y;
    vx = vy = 0;
    host.classList.add('is-dragging');
    maybeHideHint();
  }
  function onMove(x, y) {
    if (!dragging) return;
    const dx = (x - lastX) * 0.007;
    const dy = (y - lastY) * 0.007;
    ry += dx;
    rx += dy;
    vx = dy; vy = dx;
    lastX = x; lastY = y;
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    host.classList.remove('is-dragging');
    auto = true;
    idleSince = performance.now();
  }

  host.addEventListener('pointerdown', e => {
    host.setPointerCapture(e.pointerId);
    onDown(e.clientX, e.clientY);
  });
  host.addEventListener('pointermove', e => onMove(e.clientX, e.clientY));
  host.addEventListener('pointerup',   () => onUp());
  host.addEventListener('pointercancel', () => onUp());
  host.addEventListener('pointerleave',  () => { if (dragging) onUp(); });

  /* ----- click on a logo → scroll to that skill row, ping it ----- */
  els.forEach((el, i) => {
    el.addEventListener('click', e => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return;
      const cat = labels[i].category;
      const rows = document.querySelectorAll('.skill-row');
      let targetRow = null;
      rows.forEach(r => {
        const t = r.querySelector('.skill-cat')?.textContent.trim();
        if (t === cat) targetRow = r;
      });
      if (!targetRow) return;

      const top = targetRow.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
      targetRow.classList.remove('is-pinged');
      void targetRow.offsetWidth;
      targetRow.classList.add('is-pinged');

      const chips = targetRow.querySelectorAll('.skill-chips li');
      chips.forEach(li => {
        if (li.textContent.trim() === labels[i].text) {
          li.classList.remove('is-pinged');
          void li.offsetWidth;
          li.classList.add('is-pinged');
          setTimeout(() => li.classList.remove('is-pinged'), 1400);
        }
      });
      setTimeout(() => targetRow.classList.remove('is-pinged'), 1500);
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        host.dataset.visible = e.isIntersecting ? 'true' : 'false';
      });
    }, { threshold: 0.05 });
    io.observe(host);
  }
})();
