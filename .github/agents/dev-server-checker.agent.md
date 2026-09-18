---
description: "Startet die lokale Vorschau von copilot.ovh und prüft Seiten, Browserfehler und die repository-spezifischen Interaktionen."
name: dev-server-checker
---

# Lokale Website prüfen

Lies zuerst [AGENTS.md](../../AGENTS.md). Dieses Repository enthält eine statische Website ohne Frontend-Build, Backend oder Health-Endpunkt; dependency-freie Regressionstests laufen mit `node:test`.

## Ablauf
1. Prüfe, ob bereits eine Vorschau dieses Repositorys läuft. Andernfalls starte mit installiertem Node/npm `npx serve .` im Repository-Root. Verwende die tatsächlich ausgegebene URL. Bei belegtem Port einen freien Port wählen, z. B. `npx serve . -l 3001`; fremde Prozesse nicht beenden.
2. Prüfe die Erreichbarkeit über eine echte Seite und ihren Inhalt, etwa `/index_en.html`, sowie lokale CSS-/JS-Dateien. Ein offener Port allein genügt nicht. `.vscode/tasks.json` enthält keine gültige Entwicklungsroutine.
3. Führe die Syntaxchecks und Regressionstests aus `AGENTS.md` aus. Erfasse zusätzlich Browser-Konsole, fehlgeschlagene Requests und fehlende Assets.
4. Setze vor Navigation oder Reload gezielt `localStorage.langPref` auf `de` bzw. `en`. Prüfe beide Landingpages und die Sprachumschaltung des Disclaimers; teste automatische Spracherkennung zusätzlich mit gelöschter Präferenz. Eine direkte Sprach-URL umgeht den Redirect nicht.
5. Prüfe die in `AGENTS.md` genannten UI-Fälle: Desktop/Mobil, Navigation einschließlich Escape/Fokus, mehrere offene FAQ-Antworten, alle vier Themes, OS-Voreinstellungen, reduzierte Bewegung und sichtbare Inhalte ohne JavaScript. Bei Änderungen an `styles.css` auch `/404.html` und `/410.html` direkt ansehen.
6. Prüfe Medienbedingungen initial und nach Änderungen zur Laufzeit: unter 861px, mit reduzierter Bewegung, hohem Kontrast oder Save-Data muss der Poster sichtbar sein und das Video pausiert/ohne Quelle. Partikel benötigen zusätzlich einen feinen Zeiger und pausieren außerhalb des sichtbaren Hero-Bereichs bzw. bei verborgenem Tab. Simuliere auch einen fehlenden Canvas-Kontext; Inhalte und Theme-Steuerung müssen funktionieren.

## Ergebnis und Grenzen
- Melde URL/Port, ausgeführte Prüfungen, konkrete Fehler und nicht geprüfte Fälle. „Fehlerfrei“ nur auf die tatsächlich geprüften Fälle beziehen.
- `npx serve` wendet `staticwebapp.config.json` nicht an. Produktions-CSP, Cache-Header und 404-Routing (einschließlich aller `/pk`-Varianten) separat an einem Azure-SWA-Deployment prüfen; eine lokale Ansicht der 404-Seite belegt keine korrekte Fehlerroute.
- Dokumentiere, ob der gestartete Server weiterläuft. Beim Aufräumen nur den für diese Prüfung selbst gestarteten Prozess beenden.
