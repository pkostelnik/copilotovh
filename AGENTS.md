# Repository guidance

## Run and verify
- This is a root-served static HTML/CSS/vanilla-JS site. There is no package manifest, lockfile, frontend build step, or lint/typecheck suite.
- Preview from the repository root with `npx serve .` (README command). `.vscode/tasks.json` contains historical, machine-specific commands referencing missing scripts; it is not the development workflow.
- With Node installed, syntax-check scripts individually: `node --check init.js`, `node --check main.js`, `node --check disclaimer.js`.
- With Node 22+, run dependency-free regression tests: `node --test tests/runtime.test.cjs tests/deployment.test.cjs`. A single file can be run separately. Tests cover language routing and deployment packaging/checks; browser checks are still needed.
- For UI changes, browser-check both landing-page languages and the disclaimer, mobile navigation, independent FAQ expansion, Auto/Light/Dark/Contrast themes, reduced motion, and JavaScript-disabled content. Set or clear `localStorage.langPref` (`de`/`en`) deliberately: visiting a language URL alone does not bypass the redirect.
- A plain static server does not apply `staticwebapp.config.json`; local rendering alone cannot verify production headers or routing.

## Page wiring
- `index.html` (DE) and `index_en.html` (EN) are hand-maintained counterparts. Mirror structural changes, links, accessibility labels, and metadata in both; there is no template generator.
- `init.js` must remain synchronous, before `styles.css`: it sets the `js` class, restores the theme, and redirects landing pages using `langPref`, then browser language (German → DE; everything else → EN).
- `main.js` is deferred and shared. Its interactivity initializes on `DOMContentLoaded`. `disclaimer.js` is also deferred but applies its initial translation immediately, before that event; preserve this timing so `main.js` reads the correct language.
- The disclaimer switches language in place using `data-i18n`/`data-i18n-aria` and the DE/EN dictionaries in `disclaimer.js`. Update its English fallback HTML as well as both dictionaries; do not add a second disclaimer page.

## Behavior to preserve
- `styles.css` is shared by landing, disclaimer, and 404 pages. Theme tokens and overrides have separate OS-auto and explicit `data-theme` branches; update both. Auto is represented by removing `data-theme`, while the saved `theme` value is `auto`.
- Use `--accent-cyan-text` for cyan text; `--accent-cyan` is tuned for decoration and lacks sufficient light-theme text contrast.
- Keep reveal-hiding rules scoped to `:root.js.reveal-ready`; `main.js` enables this only after observers are installed, so absent/failed scripts leave content visible. FAQ uses native `<details>` and intentionally allows multiple answers open.
- Keep the showcase video URL in `data-src`, not an eager `src`: `main.js` attaches it only at widths ≥861px without reduced motion, high contrast, or Save-Data. Its shared media policy reacts to runtime changes, pauses/removes disallowed video sources and restores the poster. Particles additionally require a fine pointer and pause offscreen or in hidden tabs.

## Deployment and instruction sources
- The Azure workflow deploys pushes/PRs to `main` and closes previews on PR closure. It syntax-checks/tests, stages `.site/` via `.github/scripts/prepare-site.cjs`, then uploads with `skip_app_build: true`. Add new public files to that explicit allowlist; documentation/tooling must stay out. `.site/` must not already exist when preparing.
- Actions are SHA-pinned with job-scoped permissions. Post-deployment verification uses `node .github/scripts/verify-deployment.cjs https://<deployment-host>` to check headers, private-document exclusions and HTTP routes; a local server is not equivalent.
- Production CSP in `staticwebapp.config.json` permits only same-origin scripts/styles and no `unsafe-inline`. Keep executable JS and CSS in external files; avoid inline handlers/styles and CDN dependencies.
- Routing intends 410 for `/pk.html`, `/pk` and `/pk/` via `/410.html`; live effectiveness must pass the deployment check. `/remotion/*` is blocked; missing pages rewrite to `/404.html` with status 404. Error-page assets use root-relative paths, and language detection must not redirect nested missing URLs.
- Keep shared development rules here; `CLAUDE.md`, `GEMINI.md`, and the Copilot instruction files reference them. `design.md` describes the existing design; actual tokens and overrides live in `styles.css`.
