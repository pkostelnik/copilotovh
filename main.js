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
  var PARTICLE_COUNT = 80;
  var CONNECT_DIST = 140;
  var mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  }

  function createParticles() {
    particles = [];
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
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

  // Pause animation when tab is hidden (saves CPU/battery)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!animationId) {
      draw();
    }
  });

  // React to motion preference change at runtime
  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) {
      if (e.matches && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        canvas.style.display = 'none';
      }
    });
  }

  // Throttled resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      createParticles();
    }, 200);
  });

  // Mouse tracking (on parent because canvas has pointer-events:none)
  var hero = canvas.closest('.hero-v2');
  if (hero) {
    hero.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  resize();
  createParticles();
  draw();
})();

// --- NAVIGATION & INTERACTIVITY ---
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
				var titlePrefix = 'Theme: ';
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
