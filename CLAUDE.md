# Claude-Projektkontext

## Gemeinsame Repository-Regeln
@AGENTS.md

`AGENTS.md` enthält die gemeinsamen Entwicklungsbefehle, Browser-Prüfungen und Vorgaben zu Sprachwechsel, Script-Reihenfolge, Themes, Medien und Deployment. Diese Regeln dort zentral pflegen.

## Tatsächlich eingesetzte Technologien
- **Projekt:** copilot.ovh, eine deutsch-/englischsprachige Landingpage zu Microsoft 365 Copilot. Die Website selbst implementiert keine Copilot- oder KI-API-Anbindung.
- **Frontend:** statisches HTML5, Vanilla CSS und Vanilla JavaScript; kein Frontend-Framework, TypeScript, Bundler oder Transpiler. Die Dateien werden direkt aus dem Repository-Root ausgeliefert.
- **CSS:** gemeinsame `styles.css` mit Custom Properties, Grid, Flexbox, Media Queries, Animationen und `backdrop-filter`. Eigenes Glassmorphism-Design mit Systemschriftarten; keine Tailwind-, Bootstrap- oder Fluent-UI-Bibliothek.
- **JavaScript:** klassische externe Scripts mit IIFEs, überwiegend `var` und Funktionsausdrücken; keine ES-Module. Native DOM-APIs, `IntersectionObserver`, `matchMedia`, `requestAnimationFrame` und Canvas 2D übernehmen Interaktion und Animation.
- **Browser-Kompatibilität:** Trotz „ES5-compatible“ in Script-Kommentaren verwendet der Code neuere APIs wie `String.prototype.startsWith`, `NodeList.prototype.forEach` und `Element.closest`. Es gibt keine Polyfill- oder Transpilations-Pipeline; keine pauschale ES5-Browser-Kompatibilität voraussetzen.
- **Zustand und Übersetzung:** `localStorage` speichert `theme` und `langPref`. Zwei manuell gepflegte Landingpages; das Disclaimer-i18n läuft über eigene DE/EN-Dictionaries und `data-i18n`-Attribute, ohne Übersetzungsbibliothek.
- **Medien und Metadaten:** lokale SVG-/Bilddateien, HTML5-MP4-Video mit Poster, Open Graph, Twitter Cards, JSON-LD und Web App Manifest. Kein Service Worker oder implementierter Offline-Cache.
- **Backend:** keine serverseitige Anwendung, Authentifizierung oder Datenbank im Repository; kein NextAuth, Prisma, PostgreSQL oder Docker-Setup.
- **Hosting/CI:** Azure Static Web Apps über SHA-gepinnte GitHub Actions. Eine explizite Dateiauswahl wird nach `.site/` kopiert und ohne Oryx-Build veröffentlicht. `staticwebapp.config.json` definiert Routing, MIME-Typen, Cache- und Sicherheitsheader; ein HTTP-Check prüft das Deployment.
- **Entwicklungswerkzeuge:** `npx serve .` für die lokale Vorschau; Node 22+ für Syntaxchecks und dependency-freie `node:test`-Regressionstests. Kein `package.json`/Lockfile und keine konfigurierte Lint-, Formatter- oder Typecheck-Suite. Befehle und Packaging-Regeln stehen in `AGENTS.md`.

## Maßgebliche Quellen
- Stack und Laufzeitverhalten aus HTML, `init.js`, `main.js`, `disclaimer.js` und `styles.css` ableiten; Deployment aus `.github/workflows/azure-static-web-apps-salmon-sand-0c2aea603.yml` und `staticwebapp.config.json`.
- `design.md` beschreibt die vorhandenen Gestaltungsmuster; konkrete CSS-Tokens und Overrides werden in `styles.css` gepflegt.
