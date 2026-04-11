# Copilot OVH — Microsoft Copilot Landing Page

A modern, futuristic single-page website showcasing **Microsoft 365 Copilot** — built with pure HTML, CSS, and vanilla JavaScript. No frameworks, no build step.

🌐 **Live:** [copilot.ovh](https://www.copilot.ovh/)

---

## ✨ Features

- **Adaptive theme** — automatically matches OS light/dark mode via `prefers-color-scheme`, with a stunning dark-first and a clean light variant
- **Animated particle canvas** — neural-network style floating dots with interactive mouse-reactive connections
- **AI-generated hero imagery** — abstract data-flow background behind the hero section
- **Glassmorphism cards** — translucent feature cards with backdrop blur, neon border glow, and hover effects
- **Gradient animated headline** — smoothly shifting white → cyan → violet text gradient
- **SVG icon stroke-draw** — card icons animate their stroke path when scrolled into view
- **Scroll-triggered reveals** — sections fade and slide in via `IntersectionObserver` with staggered delays
- **Bilingual** — full German (DE) and English (EN) support with automatic browser language detection
- **Responsive** — optimized for desktop, tablet, and mobile viewports
- **Accessible** — skip-link, ARIA labels, `prefers-contrast: more` support, semantic HTML
- **Secure** — Content Security Policy, strict referrer, `rel="noopener noreferrer"` on external links

---

## 📁 Project Structure

```
copilotovh/
├── index.html          # Landing page (German)
├── index_en.html       # Landing page (English)
├── pk.html             # Personal portfolio page
├── styles.css          # Shared stylesheet (landing page + dive-page styles)
├── lang-detect.js      # Language detection, redirection & scroll-reveal logic
├── particles.js        # Neural-network particle canvas animation
├── hero-ai.png         # AI-generated hero background image
├── og-image.png        # Open Graph social media preview image
├── favicon.ico         # Favicon
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
| **Logic** | Vanilla JavaScript (ES5-compatible, no transpiler needed) |
| **Font** | System font stack (no external dependencies) |
| **Hosting** | Azure Static Web Apps |
| **CI/CD** | GitHub Actions → Azure SWA |

---

## 🚀 Getting Started

No build step required — just open `index.html` in a browser.

```bash
# Clone the repo
git clone https://github.com/pkostelnik/copilotovh.git
cd copilotovh

# Open locally
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or use any local development server:

```bash
npx serve .
```

---

## 🌍 Language Support

The site auto-detects the browser language and redirects accordingly:

- **German (`de`)** → `index.html`
- **All other languages** → `index_en.html`

Users can manually switch via the DE/EN toggle in the top-right corner. The preference is saved in `localStorage`.

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a0e1a` | Page background |
| `--accent-cyan` | `#00f0ff` | Primary accent, links |
| `--accent-violet` | `#8b5cf6` | Secondary accent |
| `--accent-magenta` | `#ff2d7b` | Tertiary accent |
| `--text-bright` | `#ffffff` | Headings |
| `--muted` | `#9ba4b8` | Body text |

### Visual Effects

- Circuit grid overlay (CSS linear-gradient pattern)
- Ambient glow blobs (fixed radial gradients)
- Glassmorphism (`backdrop-filter: blur(20px)`)
- Neon glow shadows on focus and hover
- SVG stroke-draw animation on scroll

---

## ♿ Accessibility

- Skip-to-content link
- ARIA labels on all landmarks and interactive elements
- `prefers-contrast: more` media query disables decorative effects
- `prefers-reduced-motion` respected by browser defaults
- Focus-visible outlines on all interactive elements
- Semantic HTML5 structure

---

## 🔒 Security

- **Content Security Policy** — restricts script, style, font, and image sources
- **Strict referrer policy** — `strict-origin-when-cross-origin`
- **Frame protection** — `frame-ancestors 'none'`
- **External links** — all use `rel="noopener noreferrer"`
- **No tracking** — no analytics, cookies, or third-party scripts (zero external requests)

---

## 📄 License

This project is private. All rights reserved.
