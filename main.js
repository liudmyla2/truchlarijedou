/* ============================================
   TRUHLARI JEDOU — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Navigation =====
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.mobile-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      overlay.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close nav on link click
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== Scroll to Top =====
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Active Navigation Link =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== Testimonials Carousel =====
  const carousel = document.querySelector('.testimonials__track');
  if (carousel) {
    const cards = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonials__btn--prev');
    const nextBtn = document.querySelector('.testimonials__btn--next');
    const dotsContainer = document.querySelector('.testimonials__dots');

    if (cards.length === 0) return;

    let currentIndex = 0;
    let visibleCards = getVisibleCards();
    let totalSlides = cards.length;
    let autoplayInterval;

    // Clone cards for infinite loop
    const clonedCards = [];
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      carousel.appendChild(clone);
      clonedCards.push(clone);
    });

    function getVisibleCards() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getCardWidth() {
      const card = carousel.querySelector('.testimonial-card');
      if (!card) return 0;
      const style = getComputedStyle(card);
      return card.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    function updateCarousel(animate = true) {
      const cardWidth = getCardWidth();
      if (!animate) {
        carousel.style.transition = 'none';
      } else {
        carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
      }
      carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === (currentIndex % totalSlides));
        });
      }
    }

    function nextSlide() {
      currentIndex++;
      updateCarousel();

      // Reset to beginning for infinite loop
      if (currentIndex >= totalSlides) {
        setTimeout(() => {
          currentIndex = 0;
          updateCarousel(false);
        }, 600);
      }
    }

    function prevSlide() {
      if (currentIndex <= 0) {
        currentIndex = totalSlides;
        updateCarousel(false);
        setTimeout(() => {
          currentIndex = totalSlides - 1;
          updateCarousel();
        }, 50);
      } else {
        currentIndex--;
        updateCarousel();
      }
    }

    // Generate dots
    if (dotsContainer) {
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Recenze ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 4500);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carousel.parentElement.addEventListener('mouseleave', startAutoplay);

    // Resize handler
    window.addEventListener('resize', () => {
      visibleCards = getVisibleCards();
      updateCarousel(false);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetAutoplay();
      }
    }, { passive: true });
  }

  // ===== Gallery Lightbox =====
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImgIndex = 0;

    function openLightbox(index) {
      currentImgIndex = index;
      const img = galleryItems[index].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentImgIndex = (currentImgIndex + 1) % galleryItems.length;
      const img = galleryItems[currentImgIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    function showPrev() {
      currentImgIndex = (currentImgIndex - 1 + galleryItems.length) % galleryItems.length;
      const img = galleryItems[currentImgIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  // ===== Contact Form Validation =====
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const fields = [
        { el: document.querySelector('#name'), msg: 'Prosím vyplňte jméno' },
        { el: document.querySelector('#email'), msg: 'Prosím vyplňte platný e-mail' },
        { el: document.querySelector('#phone'), msg: 'Prosím vyplňte telefon' },
        { el: document.querySelector('#message'), msg: 'Prosím napište zprávu' },
      ];

      fields.forEach(({ el, msg }) => {
        const errorEl = el.parentElement.querySelector('.error-msg');
        if (!el.value.trim()) {
          el.classList.add('error');
          if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          el.classList.remove('error');
          if (errorEl) errorEl.style.display = 'none';
        }
      });

      // Simple email validation
      const emailEl = document.querySelector('#email');
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.classList.add('error');
        const errorEl = emailEl.parentElement.querySelector('.error-msg');
        if (errorEl) {
          errorEl.textContent = 'Prosím vyplňte platný e-mail';
          errorEl.style.display = 'block';
        }
        isValid = false;
      }

      if (isValid) {
        // Show success state
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Odesláno! ✓';
        btn.style.background = 'var(--clr-accent)';
        btn.style.color = 'var(--clr-primary-dark)';
        btn.disabled = true;

        setTimeout(() => {
          contactForm.reset();
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // ===== Scroll Animations =====
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));
  }

});
