/**
 * disclaimer.js — Client-side i18n for disclaimer.html
 * Single-file multilingual page: auto-detects browser language (DE/EN),
 * lets the user switch in place (no navigation/redirect), and keeps the
 * <html lang>, document title, meta description, theme-toggle label and an
 * aria-live announcement in sync. ES5-compatible, CSP-safe (no inline code).
 */
(function () {
	'use strict';

	var I18N = {
		de: {
			documentTitle: 'KI-Hinweis – copilot.ovh',
			metaDescription: 'KI-Hinweis für copilot.ovh – diese Seite wurde mit Microsoft Copilot gebaut, plus ein freundlicher Leitfaden zum verantwortungsvollen Umgang mit KI.',
			skipLink: 'Zum Inhalt springen',
			brandHome: 'Copilot Startseite',
			langGroup: 'Sprachwahl',
			themeToggle: 'Design wechseln',
			navHome: 'Zurück zur Startseite',
			heroEyebrow: 'KI-Hinweis',
			heroTitle: 'Ja, ein Roboter hat hier mitgebaut.',
			heroLead: 'Diese Website – ihre Texte, ihr Code, sogar dieser Satz – ist Hand in Hand mit Microsoft Copilot entstanden. KI ist clever, schnell und erfindet gelegentlich Dinge mit voller Überzeugung. Hier kommt die ehrliche, leicht augenzwinkernde Zusammenfassung.',
			heroTldr: '⚡ Kurzfassung: Mit KI gebaut. Wichtiges immer prüfen. Keine Passwörter einfügen. Bleib nett.',
			card1Title: 'Von Menschen + KI gebaut',
			card1Body: 'Ein echter Mensch hatte die Ideen und traf die Entscheidungen; Copilot half beim Markup, den Styles, Skripten und Texten. Stell dir Pair-Programming vor, bei dem ein Partner nie Kaffee braucht und beunruhigend schnell tippt.',
			card2Title: 'KI kann selbstbewusst falsch liegen',
			card2Body: 'Generative KI „halluziniert“ manchmal – sie behauptet Falsches, als wäre es in Stein gemeißelt. Sieh alles hier als hilfreichen Startpunkt, nicht als rechtliche, medizinische, finanzielle oder lebenswichtige Beratung. Wenn es darauf ankommt: mit einer vertrauenswürdigen Quelle gegenprüfen.',
			card3Title: 'Dein Teil der Abmachung',
			card3Body: 'Nutze KI verantwortungsvoll: behalte den Menschen in der Schleife, prüfe vor dem Veröffentlichen und füge niemals Geheimnisse, Passwörter oder sensible persönliche Daten in einen Chatbot ein. Du bist Kapitän – die KI ist nur ein sehr enthusiastischer Co-Pilot.',
			card4Title: 'Datenschutz, ganz einfach',
			card4Body: 'Diese Seite selbst hat kein Tracking, keine Cookies und keine Analyse – null Anfragen an Dritte. Wir schauen dir beim Lesen nicht zu. (Wir stellen uns einfach vor, dass du gerade lächelst.)',
			calloutTitle: 'Die Kurzfassung',
			calloutBody: 'KI ist ein Werkzeug, kein Orakel. Sie hat diese Seite schnell und ansprechend gemacht – aber das Urteilsvermögen bringst du mit. Bleib neugierig, prüfe das Wichtige und denk dran: Hinter jedem guten Co-Piloten steht ein Mensch, der entscheidet, wo gelandet wird. 🛬',
			calloutCta: 'Zurück zu den schönen Dingen',
			footerCopy: '© 2026 copilot.ovh – alle Rechte vorbehalten.',
			footerPowered: 'Powered by Microsoft Copilot',
			footerNewTab: ' (öffnet in neuem Tab)',
			themeLabel: 'Design: ',
			theme: { auto: 'Automatisch (System)', light: 'Hell', dark: 'Dunkel', contrast: 'Hoher Kontrast' },
			announce: 'Sprache auf Deutsch umgestellt.'
		},
		en: {
			documentTitle: 'AI Disclaimer – copilot.ovh',
			metaDescription: 'AI disclaimer for copilot.ovh — this site was built with Microsoft Copilot, plus a friendly guide to using AI responsibly.',
			skipLink: 'Skip to content',
			brandHome: 'Copilot home',
			langGroup: 'Language selection',
			themeToggle: 'Change theme',
			navHome: 'Back home',
			heroEyebrow: 'AI Disclaimer',
			heroTitle: 'Yes, a robot helped build this.',
			heroLead: 'This website — its words, its code, even this very sentence — was crafted hand-in-hand with Microsoft Copilot. AI is clever, fast, and occasionally makes things up with supreme confidence. Here\u2019s the honest, slightly cheeky rundown.',
			heroTldr: '⚡ TL;DR: Built with AI. Double-check anything important. Don\u2019t paste your passwords. Be kind.',
			card1Title: 'Built by humans + AI',
			card1Body: 'A real person had ideas and made the calls; Copilot helped write the markup, styles, scripts and copy. Think of it as pair programming where one partner never needs coffee and types alarmingly fast.',
			card2Title: 'AI can be confidently wrong',
			card2Body: 'Generative AI sometimes “hallucinates” — it states wrong things as if they were gospel. Treat anything here as a helpful starting point, not legal, medical, financial or life-or-death advice. When it matters, verify with a trusted source.',
			card3Title: 'Your part of the deal',
			card3Body: 'Use AI responsibly: keep a human in the loop, review before you ship, and never paste secrets, passwords or sensitive personal data into a chatbot. You\u2019re the captain — AI is just a very enthusiastic co-pilot.',
			card4Title: 'Privacy, plainly',
			card4Body: 'This page itself has no tracking, no cookies and no analytics — zero third-party requests. We\u2019re not watching you read this. (We\u2019d just like to imagine you\u2019re smiling.)',
			calloutTitle: 'The short version',
			calloutBody: 'AI is a tool, not an oracle. It helped make this site delightful and fast — but you still bring the judgement. Stay curious, verify the important stuff, and remember: behind every good co-pilot, there\u2019s a human who decides where to land. 🛬',
			calloutCta: 'Take me back to the good stuff',
			footerCopy: '© 2026 copilot.ovh – all rights reserved.',
			footerPowered: 'Powered by Microsoft Copilot',
			footerNewTab: ' (opens in a new tab)',
			themeLabel: 'Theme: ',
			theme: { auto: 'Automatic (system)', light: 'Light', dark: 'Dark', contrast: 'High contrast' },
			announce: 'Language set to English.'
		}
	};

	function detectLang() {
		var pref = null;
		try {
			pref = localStorage.getItem('langPref');
			if (pref !== 'de' && pref !== 'en') pref = null;
		} catch (e) {}
		if (pref) return pref;
		var nav = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
		return nav.indexOf('de') === 0 ? 'de' : 'en';
	}

	function currentTheme() {
		var t = document.documentElement.getAttribute('data-theme');
		return (t === 'light' || t === 'dark' || t === 'contrast') ? t : 'auto';
	}

	function applyLang(lang, announce) {
		var dict = I18N[lang] || I18N.en;

		document.documentElement.setAttribute('lang', lang);
		document.title = dict.documentTitle;

		var metaDesc = document.querySelector('meta[name="description"]');
		if (metaDesc) metaDesc.setAttribute('content', dict.metaDescription);

		// Text content
		var nodes = document.querySelectorAll('[data-i18n]');
		for (var i = 0; i < nodes.length; i++) {
			var key = nodes[i].getAttribute('data-i18n');
			if (dict[key] != null) nodes[i].textContent = dict[key];
		}

		// aria-label content
		var ariaNodes = document.querySelectorAll('[data-i18n-aria]');
		for (var j = 0; j < ariaNodes.length; j++) {
			var aKey = ariaNodes[j].getAttribute('data-i18n-aria');
			if (dict[aKey] != null) ariaNodes[j].setAttribute('aria-label', dict[aKey]);
		}

		// Theme-toggle label stays localized.
		// aria-label carries the action; the current state goes in title
		// (and into the live region on change) — see main.js.
		var themeBtn = document.getElementById('theme-toggle');
		if (themeBtn) {
			var th = currentTheme();
			themeBtn.setAttribute('aria-label', dict.themeToggle);
			themeBtn.setAttribute('title', dict.themeLabel + dict.theme[th]);
		}

		// Active language link
		var links = document.querySelectorAll('.lang-switch .lang-link');
		for (var k = 0; k < links.length; k++) {
			var isActive = links[k].getAttribute('data-lang') === lang;
			if (isActive) {
				links[k].classList.add('active');
				links[k].setAttribute('aria-current', 'true');
			} else {
				links[k].classList.remove('active');
				links[k].removeAttribute('aria-current');
			}
		}

		try { localStorage.setItem('langPref', lang); } catch (e) {}

		if (announce) {
			var live = document.getElementById('lang-announce');
			if (live) live.textContent = dict.announce;
		}
	}

	// Run immediately (defer guarantees the DOM is parsed) so the correct
	// language is in place before main.js reads <html lang> on DOMContentLoaded.
	applyLang(detectLang(), false);

	var switchLinks = document.querySelectorAll('.lang-switch .lang-link');
	for (var n = 0; n < switchLinks.length; n++) {
		switchLinks[n].addEventListener('click', function (ev) {
			ev.preventDefault();
			applyLang(this.getAttribute('data-lang'), true);
		});
	}
})();
