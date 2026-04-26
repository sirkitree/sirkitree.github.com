/**
 * Quantum Weave Interactive Enhancements
 * Performance-optimized particle system, scroll animations, and interactions
 */

(function() {
  'use strict';

  // Check if we're on a QW page
  if (!document.querySelector('.qw-hero') && !document.querySelector('.qw-post')) {
    return;
  }

  // ================================
  // DEVICE AND PERFORMANCE DETECTION
  // ================================

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isLowPerformance = isMobile || navigator.hardwareConcurrency <= 2;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Performance budget based on device
  const performanceBudget = {
    particles: isLowPerformance ? 8 : (isMobile ? 12 : 25),
    enableParallax: !isMobile,
    enableCursorGlow: !isTouchDevice,
    enable3DTilt: !isTouchDevice && !isLowPerformance,
    enableConnections: !isLowPerformance
  };

  // ================================
  // PARTICLE ANIMATION SYSTEM
  // ================================

  // Pre-render the cyan glow sprite once.
  // Replaces per-particle ctx.shadowBlur (one of canvas2D's most expensive ops).
  function createGlowSprite() {
    const size = 64;
    const sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const sctx = sprite.getContext('2d');
    const cx = size / 2;
    const grad = sctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
    grad.addColorStop(0, 'rgba(0, 229, 255, 1)');
    grad.addColorStop(0.25, 'rgba(0, 229, 255, 0.6)');
    grad.addColorStop(0.6, 'rgba(0, 229, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, size, size);
    return sprite;
  }

  const glowSprite = createGlowSprite();

  class QuantumParticle {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;

      // Wrap around edges
      if (this.x < 0) this.x = this.canvas.width;
      if (this.x > this.canvas.width) this.x = 0;
      if (this.y < 0) this.y = this.canvas.height;
      if (this.y > this.canvas.height) this.y = 0;
    }

    draw() {
      const pulseFactor = Math.sin(this.pulsePhase) * 0.3 + 0.7;
      const alpha = this.opacity * pulseFactor;
      const drawSize = (this.size + 8) * 2;

      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(
        glowSprite,
        this.x - drawSize / 2,
        this.y - drawSize / 2,
        drawSize,
        drawSize
      );
    }
  }

  class ParticleSystem {
    constructor(containerId, particleCount = 30) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;

      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '1';

      this.container.style.position = 'relative';
      this.container.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = particleCount;
      this.animationId = null;
      this.animateBound = this.animate.bind(this);

      this.resize();
      this.init();

      // Debounced resize — avoids re-laying-out the canvas on every resize event
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.resize(), 150);
      });
    }

    resize() {
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    init() {
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(new QuantumParticle(this.canvas, this.ctx));
      }
      this.animate();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Stamp the cached glow sprite for each particle (cheap drawImage + globalAlpha)
      this.ctx.globalCompositeOperation = 'lighter';
      const particles = this.particles;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      this.ctx.globalAlpha = 1;
      this.ctx.globalCompositeOperation = 'source-over';

      this.drawConnections();

      this.animationId = requestAnimationFrame(this.animateBound);
    }

    drawConnections() {
      if (!performanceBudget.enableConnections) {
        return;
      }

      const maxDistance = isMobile ? 100 : 150;
      const maxDistanceSq = maxDistance * maxDistance;
      const particles = this.particles;
      const ctx = this.ctx;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const opacity = (1 - Math.sqrt(distSq) / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // ================================
  // ENHANCED DISCIPLINE INTERACTIONS
  // ================================

  function initDisciplineCards() {
    const cards = document.querySelectorAll('.qw-discipline-card');

    cards.forEach(card => {
      // 3D tilt effect on mouse move (desktop only)
      if (performanceBudget.enable3DTilt) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      }

      // Touch feedback for mobile
      if (isTouchDevice) {
        card.addEventListener('touchstart', () => {
          card.style.opacity = '0.9';
        });

        card.addEventListener('touchend', () => {
          card.style.opacity = '';
        });
      }

      // Click/tap to pulse animation (skip if reduced motion preferred)
      if (!prefersReducedMotion) {
        card.addEventListener('click', () => {
          card.style.animation = 'qw-pulse 0.6s ease-out';
          setTimeout(() => {
            card.style.animation = '';
          }, 600);
        });
      }
    });
  }

  // ================================
  // SCROLL-TRIGGERED ANIMATIONS
  // ================================

  class ScrollAnimations {
    constructor() {
      this.elements = [];
      this.init();
    }

    init() {
      // Find all animatable elements
      const selectors = [
        '.qw-card',
        '.qw-narrative-card',
        '.qw-discipline-card',
        '.qw-hero-content'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          // Skip if already visible (like hero)
          if (selector === '.qw-hero-content') {
            return;
          }

          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';

          // Faster transitions on mobile for snappier feel
          const transitionDuration = isMobile ? '0.4s' : '0.6s';
          el.style.transition = `opacity ${transitionDuration} ease-out, transform ${transitionDuration} ease-out`;

          this.elements.push({
            element: el,
            animated: false
          });
        });
      });

      // Use Intersection Observer for performance
      // Adjust threshold for mobile to trigger earlier
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: isMobile ? 0.05 : 0.1,
          rootMargin: isMobile ? '30px' : '50px'
        }
      );

      this.elements.forEach(item => {
        this.observer.observe(item.element);
      });
    }

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = this.elements.find(el => el.element === entry.target);
          if (item && !item.animated) {
            // Reduced stagger on mobile for faster feel
            const staggerDelay = isMobile ? 50 : 100;
            const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * staggerDelay;

            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, delay);

            item.animated = true;

            // Unobserve after animation to save resources
            this.observer.unobserve(entry.target);
          }
        }
      });
    }

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  // ================================
  // HERO PARALLAX EFFECT
  // ================================

  function initHeroParallax() {
    // Skip parallax on mobile devices for better performance
    if (!performanceBudget.enableParallax || prefersReducedMotion) {
      return;
    }

    const hero = document.querySelector('.qw-hero');
    const heroBackground = document.querySelector('.qw-hero-background');

    if (!hero || !heroBackground) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroHeight = hero.offsetHeight;

          if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true }); // Passive listener for better scroll performance
  }

  // ================================
  // CURSOR GLOW EFFECT
  // ================================

  function initCursorGlow() {
    // Skip cursor glow on touch devices
    if (!performanceBudget.enableCursorGlow) {
      return;
    }

    const hero = document.querySelector('.qw-hero');
    if (!hero) return;

    let cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    `;
    hero.appendChild(cursorGlow);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left - 150;
      const y = e.clientY - rect.top - 150;

      cursorGlow.style.left = x + 'px';
      cursorGlow.style.top = y + 'px';
      cursorGlow.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // ================================
  // INITIALIZE ALL ENHANCEMENTS
  // ================================

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize particle system on hero with device-appropriate particle count
    const hero = document.querySelector('.qw-hero');
    if (hero && !prefersReducedMotion) {
      hero.id = 'qw-hero-particles';
      setTimeout(() => {
        new ParticleSystem('qw-hero-particles', performanceBudget.particles);
      }, 100);
    }

    // Initialize scroll animations (skip if reduced motion preferred)
    if (!prefersReducedMotion) {
      new ScrollAnimations();
    }

    // Initialize discipline card interactions
    initDisciplineCards();

    // Initialize hero parallax (desktop only)
    initHeroParallax();

    // Initialize cursor glow (desktop only)
    initCursorGlow();

    // Log performance settings for debugging
    if (window.location.search.includes('debug')) {
      console.log('✨ Quantum Weave loaded with settings:', {
        isMobile,
        isTouchDevice,
        isLowPerformance,
        prefersReducedMotion,
        performanceBudget
      });
    } else {
      console.log('✨ Quantum Weave interactive enhancements loaded');
    }
  }

  // Start initialization
  init();

})();
