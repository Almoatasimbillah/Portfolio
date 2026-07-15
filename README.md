# AlMoatasimbillah Medhat — Portfolio

> Software engineer who tests what others ship. Penetration tester who looks for what breaks before it does. Working from Sharkia.

Pure HTML / CSS / vanilla JS portfolio. No frameworks, no bundler — built to deploy as a static site.

**Live:** _(deploy URL goes here)_

---

## Stack

- HTML5 / CSS3 / Vanilla ES2022 JavaScript
- Three.js hero (self-hosted bundle, built from `avatar-src/` with esbuild) — a
  Blender/MPFB-built 3D character (`models/hero_tracking.glb`, 4.5 MB) whose
  head + eyes follow the cursor; falls back to a waving WebM loop or a static
  poster on touch / reduced-motion / no-WebGL visits
- Blender-rendered desk-loop MP4 self-portrait in the About section
- FFmpeg-extracted WebP frame sequences for the scroll-scrub intro
- Google Fonts: Instrument Serif, Inter, JetBrains Mono, Amiri, IBM Plex Sans Arabic
- Service Worker for offline caching (cache-first / network-first / SWR)
- Web3Forms for the contact form

## Design system (locked)

- **Palette:** midnight `#0B0F1A` + mint teal `#7DD3C0` (single accent)
- **Type:** Instrument Serif (italic headlines), Inter (UI), JetBrains Mono (technical)
- **Discipline:** editorial / magazine, no neon, no cyber-cosplay clichés

## Sections

1. Avatar (live 3D self-portrait welcome — cursor-tracking head/eyes, full viewport)
2. Anatomy scroll-scrub (243 webp frames, 5 chapters)
3. Marquee strip
4. Experience (interactive timeline)
5. Capabilities (skills sphere + tech rows + live GitHub heatmap)
6. About (animated stat counters + "Now" line)
7. Credentials (status-badge cards)
8. Marquee strip 2
9. Work (11 projects with video previews, filters, deep-link modals)
10. Testimonials (with visitor submission form)
11. Contact (form + 5 channels)

## Features

- Full EN ↔ AR bilingual support with RTL
- Custom mint cursor with 5 morph states + ambient glow
- Magnetic buttons + scroll-driven animations
- Cmd+K search palette
- Terminal easter egg (`` ` `` key)
- Konami code
- PWA install banner
- Time-of-day greeting (Cairo timezone)
- Reading time on case studies
- Share buttons per project
- Service Worker offline support

## Local preview

This is a static site. Use any static server. The included `.claude/launch.json` runs one on port 5173:

```bash
# Any static server works:
npx serve .
# or
python -m http.server 5173
```

## Deploy

Configured for **Vercel** out of the box (`vercel.json` ships security headers).

```bash
npm i -g vercel
vercel --prod
```

## Pre-deploy checklist

- [ ] Replace `YOUR_ACCESS_KEY_HERE` in `index.html` with a real Web3Forms key
- [ ] Update canonical / hreflang / sitemap URLs to the final domain
- [ ] Update CV PDF at `images/cv.pdf`
- [ ] (optional) Set up Plausible analytics — uncomment the `<script>` in `index.html`

## License

Personal portfolio code. Content (copy, images, video, identity) © AlMoatasimbillah Medhat.
