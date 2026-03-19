/* ============================================
   MERIJN FILM — Portfolio JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealAnimations();
  initCarousel();
  initLightbox();
  initContactForm();
  initVideoAutoplay();
});

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Reveal on Scroll ---------- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Carousel ---------- */
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const cards = track.querySelectorAll('.project-card');
  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsContainer = carousel.querySelector('.carousel__dots');

  // Determine how many cards visible at once
  function getVisibleCount() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const totalPages = Math.ceil(cards.length / getVisibleCount());
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      dot.setAttribute('aria-label', 'Pagina ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => scrollToPage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function scrollToPage(page) {
    const cardWidth = cards[0].offsetWidth + 16; // gap
    track.scrollTo({ left: page * getVisibleCount() * cardWidth, behavior: 'smooth' });
  }

  function updateDots() {
    const cardWidth = cards[0].offsetWidth + 16;
    const currentPage = Math.round(track.scrollLeft / (cardWidth * getVisibleCount()));
    dotsContainer.querySelectorAll('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
  }

  // Navigation
  prevBtn.addEventListener('click', () => {
    const cardWidth = cards[0].offsetWidth + 16;
    track.scrollBy({ left: -cardWidth * getVisibleCount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const cardWidth = cards[0].offsetWidth + 16;
    track.scrollBy({ left: cardWidth * getVisibleCount(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateDots, { passive: true });
  window.addEventListener('resize', buildDots);
  buildDots();

  // Peek animation: briefly scroll forward then back to hint there's more
  const peekObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        peekObserver.unobserve(carousel);
        setTimeout(() => {
          const peekDistance = cards[0].offsetWidth * 0.35;
          track.scrollTo({ left: peekDistance, behavior: 'smooth' });
          setTimeout(() => {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          }, 600);
        }, 400);
      }
    });
  }, { threshold: 0.3 });
  peekObserver.observe(carousel);
}

/* ---------- Lightbox (YouTube) ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const iframe = document.getElementById('lightbox-iframe');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  // Open
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const youtubeId = card.dataset.youtube;
      if (!youtubeId) return;

      iframe.src = 'https://www.youtube-nocookie.com/embed/' + youtubeId + '?autoplay=1&rel=0&modestbranding=1&color=white&iv_load_policy=3&playsinline=1';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close
  function closeLightbox() {
    lightbox.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ---------- Video Autoplay on Scroll ---------- */
function initVideoAutoplay() {
  // Hero video
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.play().catch(() => {});
  }
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation is handled by HTML5 required attributes
    // In production: send to API endpoint, email service, etc.

    submitBtn.innerHTML = '✓ Bericht Verstuurd!';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
    }, 3000);
  });
}
