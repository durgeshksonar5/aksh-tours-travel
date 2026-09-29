/**
 * AKSH TOURS & TRAVELS - ANIMATIONS SYSTEM
 * Integrates Lenis Smooth Scroll, GSAP 3, and ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenisScroll();
  initGsapAnimations();
  initHorizontalScroll();
  initVerticalSplitShowcase();
  initTimelineProgress();
  initStatsCounter();
});

// Refresh ScrollTrigger when all assets/images are loaded
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
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
   3. PINNED HORIZONTAL SCROLL (EXPLORE INDIA - DESKTOP)
   ========================================================================== */
function initHorizontalScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const horizontalSection = document.querySelector('.horizontal-scroll-section');
  const track = document.querySelector('.horizontal-track');
  
  if (!horizontalSection || !track || window.innerWidth < 1024) return;

  const getScrollDistance = () => track.scrollWidth - window.innerWidth + (window.innerWidth * 0.08);

  gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalSection,
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
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
