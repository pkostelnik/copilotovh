/**
 * Theme-init: runs synchronously in <head> before stylesheet
 * to prevent FOUC. Reads localStorage('theme') and applies
 * data-theme to <html>. Only valid values: auto/light/dark/contrast.
 */
(function () {
	try {
		var t = localStorage.getItem('theme');
		if (t === 'light' || t === 'dark' || t === 'contrast' || t === 'auto') {
			if (t !== 'auto') {
				document.documentElement.setAttribute('data-theme', t);
			}
		}
	} catch (e) { /* localStorage blocked */ }
})();
