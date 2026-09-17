/**
 * init.js — Theme + Language initialization
 * Loaded synchronously (no defer) before stylesheet to prevent FOUC.
 * Extracted from inline <script> for CSP compliance (script-src 'self').
 */

// JS-capability flag.
// Reveal hiding is enabled separately by main.js only after observers exist.
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

	var path = window.location.pathname;
	// Azure normalizes .html URLs; match only known root routes, not 404 paths.
	var currentLang = /^\/(?:index(?:\.html)?\/?)?$/.test(path) ? 'de' :
		(/^\/index_en(?:\.html)?\/?$/.test(path) ? 'en' : null);
	if (currentLang && pref !== currentLang) {
		var target = pref === 'en' ? '/index_en.html' : '/index.html';
		window.location.replace(target + window.location.search + window.location.hash);
	}
})();
