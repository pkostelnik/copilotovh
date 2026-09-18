# Copilot OVH — Microsoft Copilot Landing Page

A modern, futuristic single-page website showcasing **Microsoft 365 Copilot** — built with pure HTML, CSS, and vanilla JavaScript. No frameworks, no build step.

🌐 **Live:** [copilot.ovh](https://www.copilot.ovh/)

---

## ✨ Features

- **Adaptive theme** — four modes via a single toggle: **Auto** (follows OS `prefers-color-scheme`/`prefers-contrast`), **Light**, **Dark**, and **High Contrast** (WCAG-AAA oriented); the choice is saved in `localStorage`
- **Animated particle canvas** — neural-network style floating dots with mouse-reactive connections; gated by viewport, pointer, reduced motion and Save-Data, and paused offscreen or in hidden tabs
- **Local intro showcase** — MP4 video with a static poster fallback; the source is attached only on eligible desktop-sized viewports
- **Glassmorphism cards** — translucent feature cards with backdrop blur, neon border glow, and hover effects
- **Gradient animated headline** — smoothly shifting cyan → violet → magenta text gradient
- **Embedded SVG icons** — icons are included directly in HTML without an icon library
- **Scroll-triggered reveals** — sections fade and slide in via `IntersectionObserver` with staggered delays
- **Bilingual** — full German (DE) and English (EN) support with automatic browser language detection
- **AI disclaimer page** — a friendly, slightly cheeky `disclaimer.html` explaining that the site was built with Copilot AI plus responsible-AI-use guidance; a **single file** that auto-detects the browser language and switches DE/EN in place (no redirect), announcing changes via an `aria-live` region
- **Responsive** — optimized for desktop, tablet, and mobile viewports
- **Accessible** — skip-link, ARIA labels, `prefers-contrast: more` and `prefers-reduced-motion` support, semantic HTML; the brand intro video falls back to a static poster image for reduced-motion and high-contrast users; WCAG-AA button contrast in light mode
- **Secure** — strict HTTP security headers via `staticwebapp.config.json` (strict CSP with **no `'unsafe-inline'`**, `frame-ancestors 'none'`, `base-uri 'none'`, `form-action 'none'`; HSTS preload; `X-Content-Type-Options`; `X-Frame-Options`; `Permissions-Policy`; `Cross-Origin-*-Policy`); `rel="noopener noreferrer"` on external links
- **SEO-ready** — full Open Graph + Twitter Card meta, canonical URLs, `hreflang` (incl. `x-default`), `robots.txt`, `sitemap.xml`, JSON-LD structured data
- **Web App Manifest and icons** — SVG favicon, Apple Touch Icon and maskable icon; no service worker or offline-cache implementation

---

## 📁 Project Structure

```
copilotovh/
├── index.html             # Landing page (German, default) – Glassmorphism Premium
├── index_en.html          # Landing page (English)
├── disclaimer.html        # AI disclaimer page (single file, client-side DE/EN switching)
├── disclaimer.js          # i18n logic for disclaimer.html (auto-detect + in-place language switch)
├── 404.html               # Custom 404 error page
├── 410.html               # Standalone removed-page information (not wired to /pk)
├── styles.css             # Stylesheet (incl. 404 + disclaimer page styles – CSP-friendly, no inline CSS)
├── init.js                # Synchronous theme + language init (runs before CSS to prevent FOUC)
├── main.js                # Nav, scroll reveal, particles, conditional video loading, theme toggle
├── intro.mp4              # 15s seamless brand intro loop (1920×1080)
├── intro-poster.jpg       # Poster frame for the video
├── og-image.jpg           # Open Graph social media preview (1200×630)
├── icon.svg               # Scalable favicon
├── apple-touch-icon.png   # iOS home-screen icon (180×180)
├── icon-192.png           # PWA icon
├── icon-512.png           # PWA icon
├── icon-maskable-512.png  # PWA maskable icon
├── manifest.json          # Web App Manifest (PWA)
├── robots.txt             # Crawler directives
├── sitemap.xml            # Sitemap (DE + EN, incl. disclaimer)
├── staticwebapp.config.json # Azure SWA config (security headers, routes, MIME)
├── favicon.ico            # Legacy favicon
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       └── azure-static-web-apps-*.yml   # CI/CD deployment
└── .gitignore
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic) |
| **Styling** | Vanilla CSS3 (custom properties, `@media`, glassmorphism, gradients) |
| **Logic** | Vanilla JavaScript, classic scripts using native browser APIs; no transpiler or polyfills |
| **Font** | System font stack (no external dependencies) |
| **Hosting** | Azure Static Web Apps |
| **CI/CD** | GitHub Actions → Azure SWA |

The site has no backend, authentication, database, or Copilot API integration. Scripts use APIs such as `IntersectionObserver`, `matchMedia`, `Element.closest` and `NodeList.forEach`; older syntax in parts of the code does not imply ES5-browser compatibility.

---

## 🚀 Getting Started

No build step or application dependency installation is required. For a consistent HTTP origin and language/theme storage, preview from the repository root with Node/npm installed:

```bash
# Clone the repo
git clone https://github.com/pkostelnik/copilotovh.git
cd copilotovh

# Start the static preview
npx serve .
```

Open the URL printed by the server. A plain static server does not apply Azure's `staticwebapp.config.json`, so production headers and error routing need separate verification on Azure Static Web Apps. `.vscode/tasks.json` contains historical machine-specific commands, not the current development workflow.

### Verification

There is no lint, formatter or typecheck suite, and no package manifest or lockfile. With Node 22+, syntax-check the scripts and run dependency-free regression tests:

```bash
node --check init.js
node --check main.js
node --check disclaimer.js
node --test tests/runtime.test.cjs tests/deployment.test.cjs
```

For UI changes, use the browser checks in [AGENTS.md](AGENTS.md), including both languages, mobile navigation, independent FAQ expansion, themes, reduced motion and content without JavaScript. Set or clear `localStorage.langPref` deliberately when testing redirects.

### Contributor instructions

[AGENTS.md](AGENTS.md) is the shared repository guidance. `CLAUDE.md`, `GEMINI.md` and the Copilot instruction files reference it. [design.md](design.md) documents the current design patterns; `styles.css` holds their implementation.

### Deployment

`.github/workflows/azure-static-web-apps-salmon-sand-0c2aea603.yml` deploys pushes and pull requests targeting `main`; closing a PR closes its preview. SHA-pinned actions use job-scoped permissions. Syntax checks and tests run before `.github/scripts/prepare-site.cjs` copies an explicit public-file allowlist into a fresh `.site/` directory; Azure uploads that directory with `skip_app_build: true`. Add new website assets to the allowlist. Documentation and tooling are excluded.

After upload, `.github/scripts/verify-deployment.cjs` checks the deployment URL for security headers, document exclusions and routing: `/pk.html`, `/pk` and `/pk/` must return exactly **404**. This requirement was explicitly changed from 410 after the deployed status-only 410 rules continued to return 404. The check remains strict; it does not accept arbitrary error codes or successful responses for removed pages. `/remotion/*` is blocked and missing pages serve `/404.html` with status 404. Azure rejects `rewrite` combined with `statusCode` inside `routes`; `410.html` remains a standalone informational page, not an HTTP-410 route. To verify manually: `node .github/scripts/verify-deployment.cjs https://<deployment-host>`.

Azure also rejects separate `/pk` and `/pk/` rules as duplicates. Only `/pk` is configured alongside `/pk.html`; both trailing-slash variants remain covered by the live verification.

---

## 🌍 Language Support

The landing pages first honor a saved `localStorage.langPref` (`de` or `en`); otherwise they detect the browser language and redirect accordingly:

- **German (`de`)** → `index.html`
- **All other languages** → `index_en.html`

Users can manually switch via the DE/EN toggle in the top-right corner. The preference is saved in `localStorage`.

The **disclaimer page** (`disclaimer.html`) takes a different, single-file approach: instead of redirecting between two files, it auto-detects the browser language and swaps all content **in place** via `disclaimer.js` (DE/EN dictionary), updating `<html lang>`, the document title and meta description, and announcing the change through an `aria-live` region. The same `langPref` is reused.

---

## 🎨 Design System

### Theme Tokens

Use the tokens in `styles.css`: `--bg` and surface tokens for backgrounds, `--text`/`--text-bright` and muted tokens for text, and accent tokens for decoration. Cyan text uses `--accent-cyan-text`, whose light-theme value differs from decorative `--accent-cyan`. Both OS-auto and explicit theme branches must be maintained. See [design.md](design.md) for layout and component guidance.

### Visual Effects

- Circuit grid overlay (CSS linear-gradient pattern)
- Ambient glow blobs (fixed radial gradients)
- Glassmorphism (`backdrop-filter: blur(20px)`)
- Neon glow shadows on focus and hover
- Scroll reveals and layered depth/hover effects

---

## ♿ Accessibility

- Skip-to-content link
- ARIA labels for navigation and controls, with live regions for theme and disclaimer-language changes
- Four theme modes (Auto / Light / Dark / High Contrast); `prefers-contrast: more` disables decorative effects
- `prefers-reduced-motion` honored — particle canvas is disabled and the brand intro video is replaced by a static poster image when the user requests reduced motion
- WCAG-AA contrast for the primary button in light mode
- Focus-visible outlines on all interactive elements
- Semantic HTML5 structure

These are implementation features, not a claim of audited WCAG conformance.

---

## 🔒 Security

- **Content Security Policy** — scripts, styles and fonts are same-origin; images also allow `data:` URLs. No `'unsafe-inline'`; executable scripts and styles live in external files.
- **Strict referrer policy** — `strict-origin-when-cross-origin`
- **Frame protection** — `frame-ancestors 'none'`
- **External links** — all use `rel="noopener noreferrer"`
- **No tracking** — no analytics, cookies, or third-party scripts (zero external requests)

---

## 📄 License

This project is private. All rights reserved.
