/**
 * AKSH TOURS & TRAVELS - CORE JAVASCRIPT
 * Handles Navigation, Custom Cursor, Modals, Lightbox, FAQs, Forms, and Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCustomCursor();
  initFaqAccordions();
  initLightbox();
  initBackToTop();
  initFormValidation();
  initSearchFinder();
  initDestinationFilters();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerCloseBtn = document.querySelector('.mobile-drawer-close');
  
  let lastScrollY = window.scrollY;

  // Scroll Hide/Reveal & Background glass change
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (header) {
      if (currentScrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > 200 && currentScrollY > lastScrollY && !mobileDrawer?.classList.contains('is-open')) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Open / Close Mobile Drawer
  function openDrawer() {
    mobileDrawer?.classList.add('is-open');
    drawerOverlay?.classList.add('is-open');
    toggleBtn?.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('is-open');
    drawerOverlay?.classList.remove('is-open');
    toggleBtn?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  toggleBtn?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
  if (isTouch) return;

  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate3d(${followerX - 21}px, ${followerY - 21}px, 0)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive links/buttons
  const interactiveEls = document.querySelectorAll('a, button, input, select, textarea, .glass-card, .bento-card');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.style.borderColor = 'var(--color-secondary)';
      follower.style.transform = `translate3d(${followerX - 26}px, ${followerY - 26}px, 0) scale(1.3)`;
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.style.borderColor = 'rgba(232, 184, 109, 0.7)';
      follower.style.transform = `translate3d(${followerX - 21}px, ${followerY - 21}px, 0) scale(1)`;
    });
  });
}

/* ==========================================================================
   3. ACCORDION (FAQ)
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close other accordions in the same list
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   4. LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  if (!lightboxModal || !galleryItems.length) return;

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    const src = item.getAttribute('data-lightbox-src') || item.querySelector('img')?.src;
    const caption = item.getAttribute('data-caption') || item.querySelector('.bento-title, h3, h4')?.textContent || 'Aksh Tours & Travels Experience';

    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lightboxModal.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightboxModal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   5. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.fab-back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ==========================================================================
   6. CLIENT-SIDE FORM VALIDATION & INTERACTIVE TOAST
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#E63946';
          input.classList.add('shake');
          setTimeout(() => input.classList.remove('shake'), 400);
        } else {
          input.style.borderColor = 'var(--color-primary)';
        }
      });

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Crafting Your Trip Plan... ✈️';
        }

        setTimeout(() => {
          showToast('Thank you! Your travel inquiry has been received. Our travel curator will contact you shortly.', 'success');
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }, 1200);
      } else {
        showToast('Please fill out all required fields marked with *', 'error');
      }
    });
  });
}

function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#0B3D2E' : type === 'error' ? '#842029' : '#081C17';
  const borderColor = type === 'success' ? '#E8B86D' : '#F5C2C7';
  
  toast.style.cssText = `
    background: ${bgColor};
    color: #FFFFFF;
    border: 1px solid ${borderColor};
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
    font-family: var(--font-accent, sans-serif);
    font-size: 0.92rem;
    max-width: 380px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Trigger reveal
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   7. TRIP FINDER / QUICK SEARCH HANDLER
   ========================================================================== */
function initSearchFinder() {
  const searchForm = document.querySelector('.quick-search-form');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dest = searchForm.querySelector('select[name="destination"]')?.value || 'all';
    const type = searchForm.querySelector('select[name="travel-type"]')?.value || 'all';
    
    // Smooth redirect or filter to destinations/packages
    window.location.href = `destinations.html?dest=${encodeURIComponent(dest)}&type=${encodeURIComponent(type)}`;
  });
}

/* ==========================================================================
   8. DESTINATIONS & PACKAGES TAB FILTERING
   ========================================================================== */
function initDestinationFilters() {
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-category]');

  if (!filterButtons.length || !filterItems.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter-btn');

      filterItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || itemCat.includes(filterValue)) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.display = 'none';
        }
      });
      
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });
  });
}
