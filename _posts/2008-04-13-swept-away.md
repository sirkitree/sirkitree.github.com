---
layout : post
title : "Swept Away"
created : 1208127648
permalink : /poems/swept-away
category : "poem"
---

<div class="poem-swept-away">
<canvas class="sweep-canvas" aria-hidden="true"></canvas>

<p>
<span class="sweep">Swept away</span><br/>
<span class="i1">are the remnants of old,</span><br/>
<span class="i2">smaller dreams thought too impossible</span><br/>
<span class="i3">now become reality,</span><br/>
<span class="i4"><em>even though torn</em></span>
</p>

<p>
<em>Reality torn</em> asunder,<br/>
<span class="i1">pulling back the curtain to reveal</span><br/>
<span class="i2">the secrets of life lived fully,</span><br/>
<span class="i3"><em>unhindered by shame</em></span>
</p>

<p>
<em>Shameful</em> regrets, <span class="sweep">swept away</span>,<br/>
<span class="i1">replaced by a new reality,</span><br/>
<span class="i2">revealed through conscious will</span><br/>
<span class="i3">and positive karmic <em>energy</em></span>
</p>

<p>
<em>Positive energies</em> flow<br/>
<span class="i1">through willful projections</span><br/>
<span class="i2">when unhindered by fear,</span><br/>
<span class="i3">guided by respect and <em>discipline</em></span>
</p>

<p>
<em>Respect</em> being key,<br/>
<span class="i1">replaces that which eats at everyone's soul of late,</span><br/>
<span class="i2">fear and the assumption of security,</span><br/>
<span class="i3"><em>apathy</em></span>
</p>

<hr class="ornament" />

<p>
<span class="sweep">Swept away</span> and free to dream,<br/>
<span class="i1">your life becomes clay</span><br/>
<span class="i2">in which to mold a destiny,</span><br/>
<span class="i3">in harmony with the <em>lines</em> which exist</span>
</p>

<p>
<em>See the lines,</em><br/>
<span class="i1">look ahead down that path</span><br/>
<span class="i2">which your decision may take you</span><br/>
<span class="i3">to make a wise choice&hellip; <em>prosper</em></span>
</p>

<p>
Fear and doubt be <span class="sweep">swept away</span>,<br/>
<span class="i1">leaving assured security</span><br/>
<span class="i2">molded by discipline and experience,</span><br/>
<span class="i3">always increasing, <em>improving</em></span>
</p>

<p>
Constant reshaping of thoughts<br/>
<span class="i1">and patterns of reasoning,</span><br/>
<span class="i2">learning to optimize,</span><br/>
<span class="i3">conceptualize, <em>visualize</em></span>
</p>

<p class="closing">
Look forward<br/>
<span class="i1">to what is to come,</span><br/>
<span class="i2">and what will be</span><br/>
<span class="i3 sweep finale"><em>swept&nbsp;&nbsp;away</em></span>
</p>

</div>

<style>
.poem-swept-away {
  position: relative;
  font-family: Georgia, "Cormorant Garamond", "Iowan Old Style", serif;
  font-size: 1.1em;
  line-height: 1.75;
  max-width: 680px;
  margin: 3em auto 4em;
  letter-spacing: 0.005em;
}
.poem-swept-away .sweep-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.poem-swept-away p,
.poem-swept-away hr {
  position: relative;
  z-index: 2;
}
.poem-swept-away p {
  margin: 0 0 2.25em 0;
}
.poem-swept-away .i1 { display: inline-block; padding-left: 2em; }
.poem-swept-away .i2 { display: inline-block; padding-left: 4em; }
.poem-swept-away .i3 { display: inline-block; padding-left: 6em; }
.poem-swept-away .i4 { display: inline-block; padding-left: 8em; }
.poem-swept-away em {
  font-style: italic;
  opacity: 0.78;
  letter-spacing: 0.04em;
}
.poem-swept-away .sweep {
  position: relative;
  display: inline-block;
}
.poem-swept-away hr.ornament {
  border: none;
  height: 2.5em;
  margin: 1em 0 2.5em;
  text-align: center;
}
.poem-swept-away hr.ornament::before {
  content: "\223F  \223F  \223F";
  letter-spacing: 1em;
  opacity: 0.35;
  font-size: 1.2em;
  display: block;
  line-height: 2.5em;
}
.poem-swept-away p.closing {
  margin-top: 2.5em;
}
.poem-swept-away p.closing em {
  opacity: 1;
  font-size: 1.15em;
  letter-spacing: 0.12em;
}
@media (max-width: 600px) {
  .poem-swept-away { font-size: 1em; }
  .poem-swept-away .i1 { padding-left: 1em; }
  .poem-swept-away .i2 { padding-left: 2em; }
  .poem-swept-away .i3 { padding-left: 3em; }
  .poem-swept-away .i4 { padding-left: 4em; }
}
@media (prefers-reduced-motion: reduce) {
  .poem-swept-away .sweep-canvas { display: none; }
}
</style>

<script>
(function () {
  var container = document.querySelector('.poem-swept-away');
  if (!container) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = container.querySelector('.sweep-canvas');
  var ctx = canvas.getContext('2d');
  var sweeps = container.querySelectorAll('.sweep');
  var particles = [];
  var dpr = window.devicePixelRatio || 1;
  var rafId = null;
  var emitAccum = 0;
  var lastTime = 0;

  function readColor() {
    var c = getComputedStyle(container).color;
    var m = c.match(/(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
    return m ? [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])] : [120, 120, 120];
  }
  var rgb = readColor();

  function resize() {
    dpr = window.devicePixelRatio || 1;
    var rect = container.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function emitFrom(span, count, finale) {
    var cRect = container.getBoundingClientRect();
    var rect = span.getBoundingClientRect();
    var originX = rect.right - cRect.left;
    var originYTop = rect.top - cRect.top;
    var h = rect.height;
    for (var i = 0; i < count; i++) {
      var startX = originX - Math.random() * rect.width * 0.35;
      var startY = originYTop + Math.random() * h;
      particles.push({
        x: startX,
        y: startY,
        vx: 0.35 + Math.random() * 1.4 + (finale ? 0.4 : 0),
        vy: (Math.random() - 0.5) * 0.35,
        ax: 0.004,
        life: 1,
        decay: 0.006 + Math.random() * 0.012,
        size: 0.5 + Math.random() * (finale ? 2.2 : 1.6),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04
      });
    }
  }

  function tick(t) {
    if (!lastTime) lastTime = t;
    var dt = Math.min(64, t - lastTime);
    lastTime = t;
    emitAccum += dt;

    if (emitAccum > 90) {
      emitAccum = 0;
      rgb = readColor();
      for (var s = 0; s < sweeps.length; s++) {
        var span = sweeps[s];
        var isFinale = span.classList.contains('finale');
        emitFrom(span, isFinale ? 3 : 2, isFinale);
      }
    }

    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    var alive = [];
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.vx += p.ax;
      p.wobble += p.wobbleSpeed;
      p.x += p.vx;
      p.y += p.vy + Math.sin(p.wobble) * 0.15;
      p.life -= p.decay;
      if (p.life <= 0 || p.x > w + 10) continue;
      var a = p.life * 0.55;
      ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      alive.push(p);
    }
    particles = alive;

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    cancelAnimationFrame(rafId);
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      lastTime = 0;
      rafId = requestAnimationFrame(tick);
    }
  });

  // Re-read colors when the theme toggles (site uses class/attribute on <html>/<body>)
  var themeObserver = new MutationObserver(function () { rgb = readColor(); });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
</script>
