/**
 * Main application script for copilot.ovh
 * Combines navigation, interactivity, theme handling, and particles background.
 */

// --- PARTICLE BACKGROUND ANIMATION ---
(function () {
  'use strict';
  var canvas = document.getElementById('particles');
  if (!canvas) return;

  // Respect user motion preferences (a11y)
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (motionQuery && motionQuery.matches) {
    canvas.style.display = 'none';
    return;
  }

  var ctx = canvas.getContext('2d');
  var particles = [];
  var animationId = null;
  var CONNECT_DIST = 140;
  var MAX_PARTICLES = 80;
  var inView = true;
  var mouse = { x: -9999, y: -9999 };

  // The draw loop is O(n²) in the particle count (80 particles ≈ 3160 distance
  // checks per frame). On phones that is pure battery burn for a decorative
  // effect that also can't be interacted with — there is no cursor to follow.
  // Skip it entirely unless we have a fine pointer on a reasonably large canvas.
  function canRunEffect() {
    var finePointer = !window.matchMedia || window.matchMedia('(pointer: fine)').matches;
    return finePointer && window.innerWidth >= 861;
  }

  // Honour Save-Data / metered connections.
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && conn.saveData) return;
  if (!canRunEffect()) {
    canvas.style.display = 'none';
    return;
  }

  function resize() {
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  }

  function createParticles() {
    particles = [];
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    // Scale with canvas area instead of using a fixed count, so a 900px
    // laptop doesn't pay the same cost as a 2560px desktop.
    var count = Math.min(MAX_PARTICLES, Math.round((w * h) / 16000));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  function draw() {
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // Update positions
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    }

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var alpha = 1 - dist / CONNECT_DIST;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 240, 255, ' + (alpha * 0.15) + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.fill();
    }

    // Mouse glow connections
    for (var i = 0; i < particles.length; i++) {
      var dx = mouse.x - particles[i].x;
      var dy = mouse.y - particles[i].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        var alpha = 1 - dist / 180;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(139, 92, 246, ' + (alpha * 0.3) + ')';
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  // Single place that decides whether the loop should be running.
  // Guards against double-scheduling (which would double the frame rate).
  function start() {
    if (animationId === null && inView && !document.hidden) {
      animationId = requestAnimationFrame(draw);
    }
  }
  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Pause when the tab is hidden (saves CPU/battery)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  // Pause once the hero is scrolled off screen — previously the loop kept
  // running for the entire page even though the canvas was long gone.
  var heroEl = canvas.closest('.hero-v2');
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0 }).observe(heroEl);
  }

  // React to motion preference change at runtime
  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) {
      if (e.matches) {
        stop();
        canvas.style.display = 'none';
      }
    });
  }

  // Throttled resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Viewport may have shrunk below the threshold (or rotated into it).
      if (!canRunEffect()) {
        stop();
        canvas.style.display = 'none';
        return;
      }
      canvas.style.display = '';
      resize();
      createParticles();
      start();
    }, 200);
  });

  // Mouse tracking (on parent because canvas has pointer-events:none)
  if (heroEl) {
    heroEl.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroEl.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  resize();
  createParticles();
  start();
})();

// --- NAVIGATION & INTERACTIVITY ---
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		// Mobile nav toggle
		var nav = document.querySelector('.nav');
		var toggle = document.querySelector('.mobile-toggle');
		if (nav && toggle) {
			var setOpen = function (open) {
				nav.classList.toggle('open', open);
				toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			};

			toggle.addEventListener('click', function () {
				setOpen(!nav.classList.contains('open'));
			});

			nav.querySelectorAll('.nav-links a').forEach(function (link) {
				link.addEventListener('click', function () { setOpen(false); });
			});

			// Escape closes the menu and returns focus to the trigger.
			// Expected behaviour for any disclosure widget (WCAG 2.1.2).
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && nav.classList.contains('open')) {
					setOpen(false);
					toggle.focus();
				}
			});

			// Clicking outside dismisses it, like every other mobile menu.
			document.addEventListener('click', function (e) {
				if (nav.classList.contains('open') && !nav.contains(e.target)) {
					setOpen(false);
				}
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

		// Showcase video: attach the source only when it's worth 7.7 MB.
		// Small viewports, reduced-motion users and metered connections keep
		// the poster image instead. <video controls> covers WCAG 2.2.2.
		var frame = document.querySelector('.showcase-frame');
		var video = frame && frame.querySelector('video[data-src]');
		if (video) {
			var conn2 = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
			var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			var highContrast = document.documentElement.getAttribute('data-theme') === 'contrast' ||
				(window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches);
			var wideEnough = window.innerWidth >= 861;

			if (wideEnough && !reduced && !highContrast && !(conn2 && conn2.saveData)) {
				var src = document.createElement('source');
				src.src = video.getAttribute('data-src');
				src.type = video.getAttribute('data-type') || 'video/mp4';
				video.appendChild(src);
				video.load();
				// Only swap out the poster once we know playback actually works,
				// so a failed load leaves the static image in place.
				video.addEventListener('loadeddata', function () {
					frame.classList.add('video-ready');
					var p = video.play();
					if (p && p.catch) p.catch(function () { /* autoplay blocked: controls remain */ });
				}, { once: true });
			}
		}

		// FAQ accordion
		// NOTE: the previous "single open" behaviour was removed on purpose.
		// Auto-closing the answer a user is reading takes away control (and
		// prevents comparing two answers) without any upside.

		// Lang switch persistence
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
				de: { action: 'Design wechseln', announce: 'Design: ', auto: 'Automatisch (System)', light: 'Hell', dark: 'Dunkel', contrast: 'Hoher Kontrast' },
				en: { action: 'Change theme',    announce: 'Theme: ',  auto: 'Automatic (system)',   light: 'Light', dark: 'Dark',  contrast: 'High contrast'   }
			};
			var lang = (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'de';
			var labels = labelMap[lang];

			// Screen readers need the *action* on the button, not the current
			// state — "Theme: Dark, button" doesn't tell you what a click does.
			// State changes go to a live region instead.
			var live = document.getElementById('theme-announce');

			function currentTheme() {
				var t = document.documentElement.getAttribute('data-theme');
				return (t === 'light' || t === 'dark' || t === 'contrast') ? t : 'auto';
			}

			function applyTheme(theme, announce) {
				if (theme === 'auto') {
					document.documentElement.removeAttribute('data-theme');
				} else {
					document.documentElement.setAttribute('data-theme', theme);
				}
				themeBtn.setAttribute('aria-label', labels.action);
				themeBtn.setAttribute('title', labels.announce + labels[theme]);
				if (announce && live) live.textContent = labels.announce + labels[theme];
				try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
			}

			// Initialize labels based on whatever init.js applied
			applyTheme(currentTheme(), false);

			themeBtn.addEventListener('click', function () {
				var idx = THEMES.indexOf(currentTheme());
				applyTheme(THEMES[(idx + 1) % THEMES.length], true);
			});
		}
	});
})();
