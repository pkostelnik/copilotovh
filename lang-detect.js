/**
 * Automatische Spracherkennung und Weiterleitung.
 * - Prüft zuerst localStorage auf manuelle Sprachwahl
 * - Falls keine Präferenz: erkennt Browsersprache
 * - Deutsch (de*) → deutsche Seite, alles andere → englische Seite
 */
(function () {
  'use strict';

  // 1. Gespeicherte Präferenz prüfen
  var pref = null;
  try {
    pref = localStorage.getItem('langPref');
    if (pref !== 'de' && pref !== 'en') pref = null;
  } catch (e) {
    // localStorage nicht verfügbar (z.B. Private Mode in manchen Browsern)
  }

  // 2. Falls keine Präferenz → Browsersprache erkennen
  if (!pref) {
    var browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    pref = browserLang.startsWith('de') ? 'de' : 'en';
  }

  // 3. Aktuelle Seite bestimmen
  var path = window.location.pathname;
  var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  var isEnglishPage = file.indexOf('_en.html') !== -1;
  var currentLang = isEnglishPage ? 'en' : 'de';

  // 4. Bei Abweichung → zur passenden Sprachversion weiterleiten
  if (pref !== currentLang) {
    var targetFile;
    if (pref === 'en') {
      targetFile = file.replace('.html', '_en.html');
    } else {
      targetFile = file.replace('_en.html', '.html');
    }
    
    // Sicherheitsprüfung: Endlos-Schleifen und XSS (z.B. javascript:-Schema) abfangen
    if (targetFile === file || targetFile.indexOf(':') !== -1) {
      return;
    }

    window.location.replace('./' + encodeURIComponent(targetFile));
    return;
  }

  // 5. Klick-Handler für den Sprachwechsler (speichert Präferenz)
  document.addEventListener('DOMContentLoaded', function () {
    var switchLinks = document.querySelectorAll('.lang-switch a');
    for (var i = 0; i < switchLinks.length; i++) {
      switchLinks[i].addEventListener('click', function () {
        try {
          localStorage.setItem('langPref', this.getAttribute('lang'));
        } catch (e) {
          // localStorage nicht beschreibbar
        }
      });
    }

    // 6. OS Theme synchronisieren (Light / Dark) für Fluent UI
    var provider = document.querySelector('fluent-design-system-provider');
    if (provider && window.matchMedia) {
      var updateTheme = function() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          provider.setAttribute('base-layer-luminance', '0.15');
        } else {
          provider.setAttribute('base-layer-luminance', '1');
        }
      };
      updateTheme();
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
    }
  });
})();
