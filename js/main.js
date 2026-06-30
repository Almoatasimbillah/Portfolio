/* =========================================================
   main.js — render real sections from PORTFOLIO_DATA
   ========================================================= */

(() => {
  const D = window.PORTFOLIO_DATA;
  if (!D) { console.warn('PORTFOLIO_DATA missing'); return; }

  const $ = sel => document.querySelector(sel);

  /* ---------- helpers ---------- */
  const escapeHtml = s => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  /* ---------- Skills / Capabilities ---------- */
  // Count how many shipped projects use each tool, by case-insensitive substring
  // match against project.tech entries. Tools used in 2+ projects get a small
  // mono badge so the visitor can see what's actually in production.
  function buildTechCounts() {
    const counts = new Map();
    (D.projects || []).forEach(p => {
      (p.tech || []).forEach(t => {
        const key = String(t).toLowerCase().trim();
        if (!key) return;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });
    return counts;
  }
  function lookupTechCount(counts, tag) {
    const lc = String(tag).toLowerCase().trim();
    if (counts.has(lc)) return counts.get(lc);
    // partial/substring match for variations (e.g., "Java" vs "JavaScript")
    let best = 0;
    for (const [k, v] of counts) {
      if (k === lc) return v;
      if (k.includes(lc) || lc.includes(k)) best = Math.max(best, v);
    }
    return best;
  }
  function renderSkills() {
    const host = $('#skill-rows');
    if (!host || !D.skills) return;
    const counts = buildTechCounts();
    host.innerHTML = D.skills.map(cat => `
      <div class="skill-row">
        <div class="skill-cat"><em>${escapeHtml(cat.title)}</em></div>
        <ul class="skill-chips">
          ${cat.tags.map(t => {
            const n = lookupTechCount(counts, t);
            const badge = n >= 2 ? `<span class="skill-count" aria-label="used in ${n} projects">${n}</span>` : '';
            return `<li>${escapeHtml(t)}${badge}</li>`;
          }).join('')}
        </ul>
      </div>
    `).join('');
  }

  /* ---------- Experience (red1-style career timeline) ---------- */
  function renderExperience() {
    const host = $('#exp-rows');
    if (!host || !D.experience) return;

    // Pull a "year" label out of each date range — first one is "NOW" only if the
    // end date is still in the future (proper month-aware comparison, not year-only).
    const MONTHS = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
    const parseDateEnd = (str) => {
      // Look at the part AFTER the dash if there is one
      const parts = str.split(/–|—|-/);
      const tail = (parts[parts.length - 1] || str).trim().toLowerCase();
      if (/present|now|current|ongoing/.test(tail)) return Infinity;
      const m = tail.match(/([a-z]{3,})?\s*(20\d{2})/i);
      if (!m) return null;
      const year = +m[2];
      const month = m[1] ? (MONTHS[m[1].slice(0,3).toLowerCase()] ?? 11) : 11;
      // Use end-of-month so "May 2026" is treated as ongoing through May 31
      return new Date(year, month + 1, 0).getTime();
    };

    const yearLabel = (date, isFirst) => {
      if (isFirst) {
        const end = parseDateEnd(date);
        if (end !== null && end >= Date.now()) return 'NOW';
      }
      // Prefer the END year of the range (the year this chapter closed in),
      // not the start year. Falls back to the only year if no range.
      const years = date.match(/20\d{2}/g);
      return years ? years[years.length - 1] : date;
    };

    host.innerHTML = `
      <div class="career-line" aria-hidden="true">
        <span class="career-line-fill"></span>
        <span class="career-line-dot"></span>
      </div>
      ${D.experience.map((role, i) => `
        <article class="career-row" style="--i:${i}">
          <div class="career-role">
            <h3 class="career-title">${escapeHtml(role.title)}</h3>
            <p class="career-company"><em>${escapeHtml(role.company)}</em></p>
          </div>
          <div class="career-year"><span>${escapeHtml(yearLabel(role.date, i === 0))}</span></div>
          <div class="career-desc">
            <p>${escapeHtml(role.description[0] || '')}</p>
            ${role.description.length > 1 ? `<ul>${role.description.slice(1).map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
          </div>
        </article>
      `).join('')}
    `;
  }

  /* ---------- Credentials — cards with status pills ---------- */
  function renderCredentials() {
    const host = $('#cred-rows');
    if (!host || !D.certifications) return;
    // map data statuses → display labels (i18n later if needed)
    const statusLabel = (s) => {
      const lang = (window.getLang && window.getLang()) || 'en';
      const en = { certified: 'Certified', completed: 'Completed', active: 'In progress', upcoming: 'Scheduled' };
      const ar = { certified: 'حاصل عليها', completed: 'مكتملة', active: 'جارية', upcoming: 'مجدولة' };
      const m = lang === 'ar' ? ar : en;
      return m[s] || s;
    };
    host.innerHTML = D.certifications.map(c => `
      <article class="cred-row cred-card" data-status="${escapeHtml(c.status || '')}">
        <span class="cred-icon" aria-hidden="true">${c.icon || '●'}</span>
        <div class="cred-year">${escapeHtml(c.year)}</div>
        <div class="cred-main">
          <h3 class="cred-title">${escapeHtml(c.name)}</h3>
          <p class="cred-org"><em>${escapeHtml(c.org)}</em>${c.note ? ' · <span class="muted">' + escapeHtml(c.note) + '</span>' : ''}</p>
        </div>
        <div class="cred-status">
          <span class="cred-pill" data-status="${escapeHtml(c.status || '')}">
            <span class="cred-pill-dot" aria-hidden="true"></span>
            <em>${escapeHtml(statusLabel(c.status))}</em>
          </span>
        </div>
      </article>
    `).join('');
  }

  /* ---------- Selected Work ---------- */
  function renderProjects() {
    const host = $('#work-rows');
    if (!host || !D.projects) return;

    // Sort: client (has gallery) first, then lab / security
    const sorted = [...D.projects].sort((a, b) => {
      const aHas = (a.gallery || []).length > 0 ? 0 : 1;
      const bHas = (b.gallery || []).length > 0 ? 0 : 1;
      return aHas - bHas;
    });

    host.innerHTML = sorted.map((p, i) => {
      const isLab = !(p.gallery && p.gallery.length);
      const side = i % 2 === 0 ? 'left' : 'right';
      const firstClip = !isLab ? p.gallery[0] : null;

      const mediaHTML = isLab ? `
        <div class="work-media lab-media">
          <div class="lab-card">
            <span class="lab-num">${String(i + 1).padStart(2, '0')}</span>
            <span class="lab-type"><em>${escapeHtml(p.type || 'Lab')}</em></span>
            <span class="lab-title">${escapeHtml(p.title)}</span>
            <span class="lab-meta">recording in production</span>
          </div>
        </div>
      ` : `
        <div class="work-media" data-clips="${p.gallery.length}">
          <video
            class="work-video"
            src="${escapeHtml(firstClip.video)}"
            data-poster="${escapeHtml(firstClip.poster)}"
            muted playsinline loop preload="none"></video>
          ${p.gallery.length > 1 ? `<span class="work-counter">1 / ${p.gallery.length}</span>` : ''}
        </div>
      `;

      const techHTML = (p.tech || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');

      const linksHTML = [
        p.github ? `<a href="${escapeHtml(p.github)}" target="_blank" rel="noopener" class="work-link">Source <span>→</span></a>` : '',
        p.demo   ? `<a href="${escapeHtml(p.demo)}"   target="_blank" rel="noopener" class="work-link">Live demo <span>→</span></a>` : '',
      ].filter(Boolean).join('');

      const slug = (window.__slugify ? window.__slugify(p.title) : p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
      return `
        <article class="work-row" data-side="${side}" data-category="${escapeHtml(p.category || 'other')}" data-slug="${escapeHtml(slug)}" data-hidden="false">
          ${mediaHTML}
          <div class="work-text">
            <div class="work-meta">
              <span class="work-type"><em>${escapeHtml(p.type)}</em></span>
              <span class="work-year">${escapeHtml(String(p.year || ''))}</span>
            </div>
            <h3 class="work-title">${escapeHtml(p.title)}</h3>
            <p class="work-desc">${escapeHtml(p.description || '')}</p>
            ${techHTML ? `<ul class="work-tech">${techHTML}</ul>` : ''}
            ${linksHTML ? `<div class="work-links">${linksHTML}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Lazy-set poster only when row is close to viewport (saves ~210KB on first paint)
    if ('IntersectionObserver' in window) {
      const posterIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const v = e.target.querySelector('video[data-poster]');
          if (v && !v.poster) v.poster = v.dataset.poster;
          posterIO.unobserve(e.target);
        });
      }, { rootMargin: '600px 0px' });
      host.querySelectorAll('.work-media').forEach(m => posterIO.observe(m));
    } else {
      // Fallback: set posters immediately
      host.querySelectorAll('video[data-poster]').forEach(v => { v.poster = v.dataset.poster; });
    }

    // Hover-to-play preview
    host.querySelectorAll('.work-media').forEach(m => {
      const v = m.querySelector('video');
      if (!v) return;
      m.addEventListener('mouseenter', () => {
        // ensure poster is set before play (in case IO hasn't fired yet)
        if (!v.poster && v.dataset.poster) v.poster = v.dataset.poster;
        if (v.readyState < 2) v.preload = 'auto';
        v.play().catch(() => {});
      });
      m.addEventListener('mouseleave', () => {
        v.pause();
        v.currentTime = 0;
      });
    });

    // Click → open modal with case study; pass click origin so the modal
    // expands from the clicked card position.
    Array.from(host.querySelectorAll('.work-row')).forEach((row, idx) => {
      row.addEventListener('click', e => {
        // ignore clicks on inline links
        if (e.target.closest('a')) return;
        if (typeof window.__openProject === 'function') {
          const r = row.getBoundingClientRect();
          window.__openProject(sorted[idx], {
            origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 }
          });
        }
      });
    });
  }

  /* ---------- Testimonials (canonical + visitor-submitted via localStorage) ---------- */
  const USER_TESTIMONIALS_KEY = 'portfolio.testimonials.v1';

  function readUserTestimonials() {
    try {
      const raw = localStorage.getItem(USER_TESTIMONIALS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function writeUserTestimonials(list) {
    try { localStorage.setItem(USER_TESTIMONIALS_KEY, JSON.stringify(list)); } catch {}
  }

  function tLabel(key, fallback) {
    const lang = (window.getLang && window.getLang()) || 'en';
    return (window.I18N && window.I18N[lang] && window.I18N[lang][key]) || fallback;
  }

  function renderTestimonials() {
    const host = $('#quote-grid');
    if (!host || !D.testimonials) return;

    const canonical = D.testimonials.map(q => `
      <figure class="quote">
        <blockquote>${escapeHtml(q.text)}</blockquote>
        <figcaption>
          <span class="quote-name">${escapeHtml(q.name)}</span>
          <span class="quote-role"><em>${escapeHtml(q.role)}</em></span>
        </figcaption>
      </figure>
    `).join('');

    const users = readUserTestimonials();
    const userMarkup = users.map((q, i) => `
      <figure class="quote quote-user" data-user-idx="${i}">
        <span class="quote-badge"><em>${escapeHtml(tLabel('test.yours', 'your draft'))}</em></span>
        <button class="quote-delete" data-user-del="${i}" type="button" aria-label="${escapeHtml(tLabel('test.delete','remove'))}">✕</button>
        <blockquote>${escapeHtml(q.text)}</blockquote>
        <figcaption>
          <span class="quote-name">${escapeHtml(q.name)}</span>
          ${q.role ? `<span class="quote-role"><em>${escapeHtml(q.role)}</em></span>` : ''}
        </figcaption>
      </figure>
    `).join('');

    // Graceful empty state when neither canonical nor visitor quotes exist
    const emptyMarkup = (canonical || userMarkup) ? '' : `
      <div class="quote-empty">
        <span class="quote-empty-kicker"><em>${escapeHtml(tLabel('test.empty.kicker', 'nothing here yet'))}</em></span>
        <p class="quote-empty-body">${escapeHtml(tLabel('test.empty.body', "I'm holding this space for the people I've actually worked with — once they send words, they go here. Until then, the floor is open."))}</p>
        <span class="quote-empty-arrow">↓</span>
        <p class="quote-empty-cta">${escapeHtml(tLabel('test.empty.cta', 'You can be the first.'))}</p>
      </div>
    `;

    host.innerHTML = canonical + userMarkup + emptyMarkup;

    // Wire delete buttons (user-side only — they can remove their own draft anytime)
    host.querySelectorAll('[data-user-del]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = +btn.dataset.userDel;
        const list = readUserTestimonials();
        list.splice(idx, 1);
        writeUserTestimonials(list);
        renderTestimonials();
      });
    });
  }

  // Re-render when the language changes so the badge label updates
  document.addEventListener('i18n:changed', () => { renderTestimonials(); renderCredentials(); });

  /* ---------- Testimonial submission modal ---------- */
  function setupTestimonialModal() {
    const openBtn = $('#quote-add-btn');
    const modal   = $('#testimonial-modal');
    const form    = $('#tmodal-form');
    const status  = modal && modal.querySelector('.tmodal-status');
    const count   = $('#tmodal-count');
    if (!openBtn || !modal || !form) return;

    const textarea = form.querySelector('textarea[name="text"]');
    const submitBtn = form.querySelector('.tmodal-submit');

    function openModal() {
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => form.querySelector('input[name="name"]')?.focus(), 50);
    }
    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (status) status.textContent = '';
      form.reset();
      if (count) count.textContent = '0 / 500';
    }

    openBtn.addEventListener('click', openModal);
    modal.querySelectorAll('[data-tclose]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    if (textarea && count) {
      textarea.addEventListener('input', () => {
        count.textContent = `${textarea.value.length} / 500`;
      });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const role = form.role.value.trim();
      const text = form.text.value.trim();

      if (!name || text.length < 20) {
        if (status) status.textContent = tLabel('test.modal.short', 'A little more detail, please.');
        return;
      }

      submitBtn.disabled = true;

      // 1) Save to localStorage (visitor sees it immediately)
      const list = readUserTestimonials();
      list.unshift({ name, role, text, ts: Date.now() });
      writeUserTestimonials(list);
      renderTestimonials();

      // 2) Notify owner via Web3Forms (if access key is configured)
      try {
        const accessKey = document.querySelector('input[name="access_key"]')?.value;
        if (accessKey && !accessKey.includes('YOUR_ACCESS_KEY')) {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: accessKey,
              subject:   'New testimonial submitted on portfolio',
              from_name: 'Portfolio Testimonial',
              name, role, message: text,
              source: 'testimonial-form',
            }),
          });
        }
      } catch {/* swallow — the visitor already sees their entry */ }

      if (status) status.textContent = tLabel('test.modal.thanks', 'Added below — thank you.');
      submitBtn.disabled = false;
      setTimeout(closeModal, 1400);

      // Scroll the new entry into view so they see it
      const grid = $('#quote-grid');
      grid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- run ---------- */
  renderSkills();
  renderExperience();
  renderCredentials();
  renderProjects();
  renderTestimonials();
  setupTestimonialModal();
})();
