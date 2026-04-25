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
    var browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
    pref = browserLang.startsWith('de') ? 'de' : 'en';
  }

  // 3. Aktuelle Seite bestimmen (mit Mapping-Tabelle für v1 und v2)
  var pagePairs = [
    { de: 'index.html',    en: 'index_en.html'    },
    { de: 'index-v2.html', en: 'index-v2_en.html' }
  ];
  var path = window.location.pathname;
  var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  var currentPair = null;
  var currentLang = null;
  for (var p = 0; p < pagePairs.length; p++) {
    if (pagePairs[p].de === file) { currentPair = pagePairs[p]; currentLang = 'de'; break; }
    if (pagePairs[p].en === file) { currentPair = pagePairs[p]; currentLang = 'en'; break; }
  }

  // 4. Bei Abweichung → zur passenden Sprachversion weiterleiten
  if (currentPair && pref !== currentLang) {
    var targetFile = pref === 'en' ? currentPair.en : currentPair.de;

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

    // 6. Scroll-reveal animations via IntersectionObserver
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            // For stagger containers, also reveal child cards
            var cards = entry.target.querySelectorAll('.card');
            cards.forEach(function (card) {
              card.classList.add('is-visible');
            });
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback: just show everything immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  });
})();
