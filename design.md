# Designhinweise für copilot.ovh

Dieses Dokument beschreibt die vorhandene HTML-/CSS-Umsetzung. `styles.css` ist die maßgebliche Quelle der Tokens und Komponentenregeln; gemeinsame Funktions- und Prüfvorgaben stehen in [AGENTS.md](AGENTS.md).

## Gestaltungsrichtung
- Die Website verwendet ein eigenes Glassmorphism-Design: transparente Karten, Cyan-/Violett-/Magenta-Verläufe, Glows und geschichtete Schatten. Eine Fluent-UI- oder andere Komponentenbibliothek ist nicht eingebunden.
- Vorhandene Klassen wie `.container`, `.section`, `.card-v2`, `.btn-primary`, `.btn-ghost`, `.step`, `.testimonial` und `.faq-item` wiederverwenden. Disclaimer (`.disc-*`) und Fehlerseite (`.error-*`) nutzen dieselbe Stylesheet-Datei.
- Die spätere Sektion „3D / DEPTH PASS“ in `styles.css` überschreibt frühere Schatten-, Button- und Hover-Regeln. Vor Änderungen die gesamte Kaskade des betroffenen Selektors prüfen; auch Light-/Contrast-Korrekturen stehen weiter unten.

## Farben und Themes
- Farbwerte aus den vorhandenen CSS-Variablen beziehen, statt eine zusätzliche Palette einzuführen: `--bg`, `--bg-soft`, `--surface`, `--surface-strong`, `--surface-solid`, `--text`, `--text-bright`, `--muted`, `--muted-strong`, `--border` und `--border-strong`.
- Cyan für Text verwendet `--accent-cyan-text`; `--accent-cyan` ist für dekorative Flächen und Verläufe gedacht. Im hellen Theme unterscheiden sich diese Werte bewusst zugunsten der Lesbarkeit.
- Auto verwendet kein `data-theme`-Attribut und folgt den OS-Einstellungen. Light-, Dark- und Contrast-Overrides explizit sowie die zugehörigen Auto-Media-Queries gemeinsam pflegen.
- High Contrast ersetzt dekorative Transparenz, Verläufe und Schatten durch kontrastreiche Flächen und Konturen. Die Light-Button-Korrektur am Ende des Stylesheets verwendet weiße Schrift auf einem dunkleren Verlauf; nicht durch den allgemeinen Akzentverlauf ersetzen.

## Typografie und Layout
- Die Schrift kommt aus `--font` (Systemschrift-Stack); keine Font-CDN-Abhängigkeit. Überschriften sind responsiv über `clamp()` skaliert, nicht über eine globale feste h1/h2/h3-Pixelskala.
- `--max-w` begrenzt den Container; `--radius-sm` bis `--radius-xl` steuern Radien. Für Abstände gibt es keine allgemeine Token-Skala: an der jeweiligen Komponente und ihren Media-Queries orientieren.
- Der Navigationswechsel liegt bei 860px; die JS-Medienfreigabe beginnt bei 861px. Das mobile Menü verwendet absichtlich `--surface-solid`, damit darunterliegender Text nicht durchscheint. Die Header-CTA bleibt mobil auch bei geöffnetem Menü verborgen.
- SVG-Icons sind direkt im Markup eingebettet. Dekorative Icons mit `aria-hidden="true"` behandeln; bestehende Icons verwenden und keine Icon-Bibliothek voraussetzen.

## Bewegung und Bedienung
- Animationen entstehen durch CSS und native Browser-APIs. Die Hero-Partikel verwenden Canvas 2D; das Showcase spielt eine lokale MP4-Datei ab. Eine Animations- oder Remotion-Laufzeit ist nicht eingebunden.
- Reveal-Zustände nur unter `:root.js.reveal-ready` verbergen, nachdem Beobachter eingerichtet sind. Video-Poster, reduzierte Bewegung, High Contrast und die Geräte-/Save-Data-Bedingungen aus `AGENTS.md` auch bei laufenden Zustandswechseln erhalten.
- FAQ bleibt bei nativen `<details>` mit unabhängig geöffneten Antworten. Theme-Buttons benennen die Aktion, Zustandsänderungen werden über Live-Regionen angekündigt.
- Änderungen in beiden Landingpage-Sprachen und den betroffenen gemeinsamen Seiten prüfen; ausreichenden Kontrast und Tastaturbedienung prüfen, statt eine pauschale WCAG-Konformität aus dem Theme-Namen abzuleiten.
