/**
 * init.js — Theme + Language initialization
 * Loaded synchronously (no defer) before stylesheet to prevent FOUC.
 * Extracted from inline <script> for CSP compliance (script-src 'self').
 */

// JS-capability flag.
// Everything that JS later has to "undo" (e.g. .reveal starting at opacity 0)
// must be scoped to :root.js — otherwise the page renders blank when this
// script is blocked or fails. Set first, before anything can throw.
document.documentElement.classList.add('js');

// Theme-init
(function () {
	try {
		var t = localStorage.getItem('theme');
		if (t === 'light' || t === 'dark' || t === 'contrast' || t === 'auto') {
			if (t !== 'auto') {
				document.documentElement.setAttribute('data-theme', t);
			}
		}
	} catch (e) {}
})();

// Language detection and redirect
(function () {
	'use strict';
	var pref = null;
	try {
		pref = localStorage.getItem('langPref');
		if (pref !== 'de' && pref !== 'en') pref = null;
	} catch (e) {}

	if (!pref) {
		var browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
		pref = browserLang.startsWith('de') ? 'de' : 'en';
	}

	var pagePairs = [{ de: 'index.html', en: 'index_en.html' }];
	var path = window.location.pathname;
	var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

	var currentPair = null;
	var currentLang = null;
	for (var p = 0; p < pagePairs.length; p++) {
		if (pagePairs[p].de === file) { currentPair = pagePairs[p]; currentLang = 'de'; break; }
		if (pagePairs[p].en === file) { currentPair = pagePairs[p]; currentLang = 'en'; break; }
	}

	if (currentPair && pref !== currentLang) {
		var targetFile = pref === 'en' ? currentPair.en : currentPair.de;
		if (targetFile !== file && targetFile.indexOf(':') === -1) {
			window.location.replace('./' + encodeURIComponent(targetFile));
		}
	}
})();
