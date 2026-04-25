/**
 * V2 navigation & interactivity helpers.
 * - Mobile menu toggle
 * - Smooth-scroll active link highlighting
 * - Scroll-reveal via IntersectionObserver
 * - FAQ accordion (single-open behaviour)
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		// Mobile nav toggle
		var nav = document.querySelector('.nav');
		var toggle = document.querySelector('.mobile-toggle');
		if (nav && toggle) {
			toggle.addEventListener('click', function () {
				var open = nav.classList.toggle('open');
				toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			});
			nav.querySelectorAll('.nav-links a').forEach(function (link) {
				link.addEventListener('click', function () {
					nav.classList.remove('open');
					toggle.setAttribute('aria-expanded', 'false');
				});
			});
		}

		// Scroll reveal
		if ('IntersectionObserver' in window) {
			var io = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						io.unobserve(entry.target);
					}
				});
			}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
			document.querySelectorAll('.reveal').forEach(function (el, idx) {
				if (el.parentElement && el.parentElement.classList.contains('reveal-stagger')) {
					el.style.setProperty('--i', String(idx));
				}
				io.observe(el);
			});
		} else {
			document.querySelectorAll('.reveal').forEach(function (el) {
				el.classList.add('is-visible');
			});
		}

		// FAQ accordion: single-open behaviour
		var faqItems = document.querySelectorAll('.faq-item');
		faqItems.forEach(function (item) {
			item.addEventListener('toggle', function () {
				if (item.open) {
					faqItems.forEach(function (other) {
						if (other !== item && other.open) other.open = false;
					});
				}
			});
		});

		// Lang switch persistence (re-uses langPref key from lang-detect.js)
		document.querySelectorAll('.lang-switch a').forEach(function (link) {
			link.addEventListener('click', function () {
				try { localStorage.setItem('langPref', this.getAttribute('lang')); }
				catch (e) { /* ignore */ }
			});
		});

		// Theme cycle: Auto → Light → Dark → Contrast → Auto …
		var themeBtn = document.getElementById('theme-toggle');
		if (themeBtn) {
			var THEMES = ['auto', 'light', 'dark', 'contrast'];
			var labelMap = {
				de: { auto: 'Automatisch (System)', light: 'Hell', dark: 'Dunkel', contrast: 'Hoher Kontrast' },
				en: { auto: 'Automatic (system)',   light: 'Light', dark: 'Dark',  contrast: 'High contrast'   }
			};
			var lang = (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'de';
			var labels = labelMap[lang];

			function currentTheme() {
				var t = document.documentElement.getAttribute('data-theme');
				return (t === 'light' || t === 'dark' || t === 'contrast') ? t : 'auto';
			}

			function applyTheme(theme) {
				if (theme === 'auto') {
					document.documentElement.removeAttribute('data-theme');
				} else {
					document.documentElement.setAttribute('data-theme', theme);
				}
				var titlePrefix = (lang === 'de') ? 'Theme: ' : 'Theme: ';
				themeBtn.setAttribute('aria-label', titlePrefix + labels[theme]);
				themeBtn.setAttribute('title', labels[theme]);
				try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
			}

			// Initialize labels based on whatever theme-init.js applied
			applyTheme(currentTheme());

			themeBtn.addEventListener('click', function () {
				var idx = THEMES.indexOf(currentTheme());
				applyTheme(THEMES[(idx + 1) % THEMES.length]);
			});
		}
	});
})();
