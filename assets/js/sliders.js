/**
 * AKSH TOURS & TRAVELS - SLIDERS INITIALIZATION
 * Configures Swiper.js instances for International destinations, Testimonials, and Inner Galleries
 */

document.addEventListener('DOMContentLoaded', () => {
  initInternationalSlider();
  initTestimonialsSlider();
  initExperiencesSlider();
  initPackageGallerySlider();
});

/* ==========================================================================
   1. INTERNATIONAL DESTINATIONS SLIDER
   ========================================================================== */
function initInternationalSlider() {
  if (typeof Swiper === 'undefined') return;

  const internationalSwiper = new Swiper('.international-swiper', {
    slidesPerView: 1.15,
    spaceBetween: 20,
    grabCursor: true,
    speed: 700,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.swiper-btn-next-intl',
      prevEl: '.swiper-btn-prev-intl',
    },
    pagination: {
      el: '.swiper-pagination-intl',
      type: 'fraction',
      formatFractionCurrent: (number) => (number < 10 ? '0' + number : number),
      formatFractionTotal: (number) => (number < 10 ? '0' + number : number),
    },
    breakpoints: {
      640: {
        slidesPerView: 2.2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 28,
      },
      1440: {
        slidesPerView: 3.8,
        spaceBetween: 32,
      },
    },
  });
}

/* ==========================================================================
   2. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  if (typeof Swiper === 'undefined') return;

  const testimonialSwiper = new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    grabCursor: true,
    speed: 650,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.swiper-btn-next-testi',
      prevEl: '.swiper-btn-prev-testi',
    },
    pagination: {
      el: '.swiper-pagination-testi',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}

/* ==========================================================================
   3. EXPERIENCES / TRAVEL STYLES SLIDER (FOR MOBILE/TABLET)
   ========================================================================== */
function initExperiencesSlider() {
  if (typeof Swiper === 'undefined') return;

  const expSwiper = new Swiper('.experiences-swiper', {
    slidesPerView: 1.2,
    spaceBetween: 16,
    grabCursor: true,
    breakpoints: {
      640: {
        slidesPerView: 2.2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
}

/* ==========================================================================
   4. PACKAGE DETAILS GALLERY CAROUSEL
   ========================================================================== */
function initPackageGallerySlider() {
  if (typeof Swiper === 'undefined') return;

  const packageSwiper = new Swiper('.package-gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 12,
    grabCursor: true,
    speed: 600,
    loop: true,
    pagination: {
      el: '.swiper-pagination-package',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-btn-next-pkg',
      prevEl: '.swiper-btn-prev-pkg',
    },
  });
}
