/**
 * AKSH TOURS & TRAVELS - ANIMATIONS SYSTEM
 * Integrates Lenis Smooth Scroll, GSAP 3, and ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenisScroll();
  initGsapAnimations();
  initHeroTypewriter();
  initHorizontalScroll();
  initVerticalSplitShowcase();
  initTimelineProgress();
  initStatsCounter();
});

// Refresh ScrollTrigger when all assets/images are loaded or resized
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 250);
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER INTEGRATION
   ========================================================================== */
function initLenisScroll() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
  });

  window.lenis = lenis;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/* ==========================================================================
   2. GSAP ENTRANCE & SCROLL REVEALS
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // 1. Hero Section Entrance Timeline
  if (document.querySelector('.hero-section')) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    if (document.querySelector('.hero-meta-badge')) {
      heroTl.fromTo('.hero-meta-badge', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
    }
    if (document.querySelector('.hero-title')) {
      heroTl.fromTo('.hero-title', { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: 1.1 }, 0.4);
    }
    if (document.querySelector('.hero-description')) {
      heroTl.fromTo('.hero-description', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 0.65);
    }
    if (document.querySelector('.hero-cta-group')) {
      heroTl.fromTo('.hero-cta-group', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, 0.85);
    }
    if (document.querySelector('.quick-search-wrapper')) {
      heroTl.fromTo('.quick-search-wrapper', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.9 }, 1.05);
    }
  }

  // 2. Section Headers Reveal
  const sectionHeaders = document.querySelectorAll('.section-header, .section-header-split');
  sectionHeaders.forEach((header) => {
    gsap.fromTo(header.children, 
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 3. Featured Bento Grid Cards Reveal
  const bentoGrids = document.querySelectorAll('.bento-grid');
  bentoGrids.forEach((grid) => {
    const cards = grid.children;
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });

  // 4. Standalone Solid Cards & Testimonials Reveal
  const standaloneSections = document.querySelectorAll('#international-section, #testimonials, #trip-planner, #faq');
  standaloneSections.forEach((section) => {
    const cards = section.querySelectorAll('.solid-card, .trip-planner-card, .faq-item');
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
}

/* ==========================================================================
   3. PINNED HORIZONTAL SCROLL (EXPLORE INDIA - DESKTOP & MOBILE)
   ========================================================================== */
function initHorizontalScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const horizontalSection = document.querySelector('.horizontal-scroll-section');
  const track = document.querySelector('.horizontal-track');
  
  if (!horizontalSection || !track) return;

  // Clear any existing ScrollTriggers on this section
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars && st.vars.trigger === horizontalSection) {
      st.kill();
    }
  });

  const getScrollDistance = () => {
    const isMobile = window.innerWidth < 768;
    const paddingOffset = isMobile ? 32 : window.innerWidth * 0.08;
    return Math.max(0, track.scrollWidth - window.innerWidth + paddingOffset);
  };

  const horizontalTween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalSection,
      start: 'top top',
      end: () => `+=${getScrollDistance() * (window.innerWidth < 768 ? 1.25 : 1.15)}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 1
    }
  });

  // Re-calculate on image loads inside the track
  const trackImages = track.querySelectorAll('img');
  trackImages.forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', () => {
        ScrollTrigger.refresh();
      }, { once: true });
    }
  });
}

/* ==========================================================================
   4. VERTICAL SPLIT-SCREEN SHOWCASE
   ========================================================================== */
function initVerticalSplitShowcase() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const showcaseItems = document.querySelectorAll('.split-showcase-item');
  const imageLayers = document.querySelectorAll('.split-image-layer');

  if (!showcaseItems.length || !imageLayers.length) return;

  showcaseItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          showcaseItems.forEach((it) => it.classList.remove('is-active'));
          imageLayers.forEach((img) => img.classList.remove('is-active'));

          item.classList.add('is-active');
          if (imageLayers[index]) {
            imageLayers[index].classList.add('is-active');
          }
        }
      }
    });
  });
}

/* ==========================================================================
   5. TIMELINE PROGRESS BAR ANIMATION
   ========================================================================== */
function initTimelineProgress() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const timelineTrack = document.querySelector('.timeline-track');
  const progressBar = document.querySelector('.timeline-progress-bar');

  if (!timelineTrack || !progressBar) return;

  gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: timelineTrack,
      start: 'top 75%',
      end: 'bottom 60%',
      scrub: 0.8
    }
  });
}

/* ==========================================================================
   6. STATS NUMBER COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('[data-counter-target]');
  if (!statNumbers.length) return;

  statNumbers.forEach((el) => {
    const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
    const suffix = el.getAttribute('data-counter-suffix') || '';

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const countObj = { val: 0 };
      gsap.to(countObj, {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          el.textContent = Math.floor(countObj.val).toLocaleString() + suffix;
        }
      });
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  });
}

/* ==========================================
   7. HERO TYPEWRITER TRANSITION
   ========================================== */
function initHeroTypewriter() {
  const typedEl = document.querySelector('.typed-text');
  if (!typedEl) return;

  const phrases = [
    'Our Expertise.',
    'Timeless Stories.',
    'Bespoke Luxury.',
    'Unforgettable Escapes.',
    'Authentic Memories.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  // Clear static placeholder
  typedEl.textContent = '';

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause when phrase is fully typed
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next phrase
    }

    setTimeout(type, typingSpeed);
  }

  // Initial delay after hero entrance completes
  setTimeout(type, 1000);
}

