/**
 * Waseem Car Rental - Main JavaScript
 * Mobile menu, smooth scroll, counters, slider, lightbox, FAQ, form validation
 */

(function () {
  'use strict';

  /* --- DOM Elements --- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.getElementById('testimonialDots');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const faqItems = document.querySelectorAll('.faq__item');
  const fadeElements = document.querySelectorAll('.fade-up');

  /* --- Mobile Menu --- */
  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navOverlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* --- Sticky Navbar --- */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  /* --- Smooth Scrolling & Active Nav Links --- */
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --- Back to Top --- */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', function () {
    setActiveNavLink();
    handleBackToTop();
  });

  /* --- Scroll Animations (Intersection Observer) --- */
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* --- Counter Animation --- */
  function animateCounter(element, target, suffix, duration) {
    const start = 0;
    const startTime = performance.now();
    const isTextOnly = element.classList.contains('stat-item__num--text');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      if (isTextOnly && suffix === '/7') {
        element.textContent = current + suffix;
      } else {
        element.textContent = current + (suffix || '');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + (suffix || '');
      }
    }

    requestAnimationFrame(update);
  }

  document.querySelectorAll('.about-counter').forEach(function (counter) {
    const numEl = counter.querySelector('.about-counter__num');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !numEl.dataset.counted) {
            numEl.dataset.counted = 'true';
            const target = parseInt(numEl.dataset.target, 10);
            animateCounter(numEl, target, '', 2000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(counter);
  });

  document.querySelectorAll('.stat-item').forEach(function (stat) {
    const numEl = stat.querySelector('.stat-item__num');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !numEl.dataset.counted) {
            numEl.dataset.counted = 'true';
            const target = parseInt(numEl.dataset.target, 10);
            const suffix = numEl.dataset.suffix || '+';
            animateCounter(numEl, target, suffix, 2000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(stat);
  });

  /* --- Testimonial Slider --- */
  let currentSlide = 0;
  let slideInterval;
  const slides = testimonialTrack ? testimonialTrack.children : [];
  const totalSlides = slides.length;

  function createDots() {
    if (!testimonialDots) return;

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-slider__dot');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoSlide();
      });
      testimonialDots.appendChild(dot);
    }
  }

  function updateDots() {
    if (!testimonialDots) return;
    const dots = testimonialDots.querySelectorAll('.testimonial-slider__dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    if (!testimonialTrack) return;
    currentSlide = index;
    testimonialTrack.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
    updateDots();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  if (totalSlides > 0) {
    createDots();
    startAutoSlide();

    testimonialTrack.addEventListener('mouseenter', function () {
      clearInterval(slideInterval);
    });

    testimonialTrack.addEventListener('mouseleave', startAutoSlide);
  }

  /* --- Gallery Lightbox --- */
  let currentGalleryIndex = 0;
  const galleryImages = [];

  galleryItems.forEach(function (item, index) {
    const img = item.querySelector('img');
    const category = item.dataset.category;
    galleryImages.push({ src: img.src, alt: img.alt, category: category });

    item.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxFn() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const current = galleryImages[currentGalleryIndex];
    lightboxImg.src = current.src;
    lightboxImg.alt = current.alt;
    lightboxCaption.textContent = current.category;
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxFn);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightboxFn();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightboxFn();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  /* --- FAQ Accordion --- */
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      faqItems.forEach(function (other) {
        other.classList.remove('active');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Form Validation --- */
  const validators = {
    fullName: function (value) {
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return 'Please enter a valid name';
      return '';
    },
    phone: function (value) {
      if (!value.trim()) return 'Phone number is required';
      const cleaned = value.replace(/[\s-]/g, '');
      if (!/^(\+92|0)?3[0-9]{9}$/.test(cleaned)) return 'Enter a valid Pakistani phone number';
      return '';
    },
    email: function (value) {
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address';
      return '';
    },
    message: function (value) {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return '';
    }
  };

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (input) input.classList.toggle('error', !!message);
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input || !validators[fieldId]) return true;
    const error = validators[fieldId](input.value);
    showError(fieldId, error);
    return !error;
  }

  if (contactForm) {
    ['fullName', 'phone', 'email', 'message'].forEach(function (fieldId) {
      const input = document.getElementById(fieldId);
      if (input) {
        input.addEventListener('blur', function () {
          validateField(fieldId);
        });
        input.addEventListener('input', function () {
          if (input.classList.contains('error')) {
            validateField(fieldId);
          }
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields = ['fullName', 'phone', 'email', 'message'];
      let isValid = true;

      fields.forEach(function (fieldId) {
        if (!validateField(fieldId)) isValid = false;
      });

      if (isValid) {
        const successEl = document.getElementById('formSuccess');
        if (successEl) successEl.classList.add('show');
        contactForm.reset();
        fields.forEach(function (fieldId) {
          showError(fieldId, '');
        });

        setTimeout(function () {
          successEl.classList.remove('show');
        }, 5000);
      }
    });
  }

  /* --- Initialize on Load --- */
  setActiveNavLink();
  handleBackToTop();

})();
