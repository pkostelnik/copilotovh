/**
 * Neural-network style particle canvas animation.
 * Draws floating dots connected by thin lines when nearby.
 * Lightweight, runs at 60 fps via requestAnimationFrame.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
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

    requestAnimationFrame(draw);
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

  // Mouse tracking
  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  createParticles();
  draw();
})();
