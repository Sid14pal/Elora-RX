/**
 * VELLORE RX — Modern Telemedicine
 * Vanilla JavaScript Interactions & Dynamic Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initSitePreloader();
  initSmoothScroll();
  initHeroParallax();
  initResultsShowcaseParallax();
  initHeadingBlurAnimation();
  initNavbarScroll();
  initMobileSidebar();
  initPatientCounter();
  initFloatingCards();
  initModalInteractions();
  initTreatmentShowcase();
  initPopularTreatmentsSlider();
  initCustomerTestimonials();
  initFaqAccordion();
});

/**
 * =========================================================================
 * CINEMATIC 1ST-LOAD PRELOADER
 * =========================================================================
 * High-end clinical telemetry entrance:
 * 1. Blooming Vellore Rx tulip petals with luminous halos
 * 2. Precision progress counter (0% -> 100%) and dynamic clinical status
 * 3. Smooth curtain slide-up reveal of the website
 * 4. Staggered grand entrance of navbar, hero heading, model, and cards
 */
function initSitePreloader() {
  const preloader = document.getElementById('sitePreloader');
  if (!preloader) return;

  const counterEl = document.getElementById('preloaderCounter');
  const progressBar = document.getElementById('preloaderProgressBar');
  const statusEl = document.getElementById('preloaderStatus');
  const content = document.getElementById('preloaderContent');
  const emblem = document.getElementById('preloaderEmblem');
  const petalLeft = preloader.querySelector('.petal-left');
  const petalRight = preloader.querySelector('.petal-right');
  const petalCenter = preloader.querySelector('.petal-center');

  // Lock scroll during loading
  document.body.classList.add('is-loading');
  if (window.lenis) window.lenis.stop();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Immediate reveal for reduced motion users
  if (prefersReducedMotion) {
    preloader.style.display = 'none';
    document.body.classList.remove('is-loading');
    if (window.lenis) window.lenis.start();
    if (typeof window.playHeroHeadingReveal === 'function') {
      window.playHeroHeadingReveal(0.05);
    }
    return;
  }

  const statusMessages = [
    { at: 0, text: 'Connecting clinical network...' },
    { at: 28, text: 'Authenticating provider credentials...' },
    { at: 58, text: 'Calibrating personalized protocols...' },
    { at: 86, text: 'Finalizing clinical workspace...' },
    { at: 100, text: 'Welcome to Elora Rx' }
  ];

  const loadObj = { val: 0 };

  if (typeof gsap !== 'undefined') {
    // Initial setup of preloader elements
    gsap.set(content, { opacity: 0, scale: 0.94, y: 16 });
    if (petalLeft) gsap.set(petalLeft, { scale: 0, transformOrigin: '18px 33px' });
    if (petalRight) gsap.set(petalRight, { scale: 0, transformOrigin: '18px 33px' });
    if (petalCenter) gsap.set(petalCenter, { scale: 0, transformOrigin: '18px 21px' });

    const preloaderTl = gsap.timeline();

    // 1. Entrance of preloader content
    preloaderTl.to(content, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      ease: 'power3.out'
    });

    // 2. Petals bloom with spring bounce
    if (petalLeft && petalRight && petalCenter) {
      preloaderTl.to([petalLeft, petalRight], {
        scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: 'back.out(1.8)'
      }, '-=0.25');
      preloaderTl.to(petalCenter, {
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)'
      }, '-=0.35');
    }

    // 3. Counter Progression (0% -> 100%)
    preloaderTl.to(loadObj, {
      val: 100,
      duration: 1.35,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.floor(loadObj.val);
        if (counterEl) counterEl.textContent = rounded;
        if (progressBar) progressBar.style.width = `${rounded}%`;

        for (let i = statusMessages.length - 1; i >= 0; i--) {
          if (rounded >= statusMessages[i].at) {
            if (statusEl && statusEl.textContent !== statusMessages[i].text) {
              statusEl.textContent = statusMessages[i].text;
            }
            break;
          }
        }
      },
      onComplete: () => {
        revealWebsite();
      }
    }, '-=0.3');

  } else {
    // Fallback if GSAP is unavailable
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (counterEl) counterEl.textContent = progress;
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
        revealWebsite();
      }
    }, 20);
  }

  function revealWebsite() {
    if (typeof gsap !== 'undefined') {
      const exitTl = gsap.timeline({
        onStart: () => {
          document.body.classList.remove('is-loading');
          if (window.lenis) window.lenis.start();
        },
        onComplete: () => {
          preloader.style.display = 'none';
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }
      });

      // 1. Emblem radiant pulse bloom
      if (emblem) {
        exitTl.to(emblem, {
          scale: 1.15,
          filter: 'drop-shadow(0 0 30px rgba(244, 117, 77, 0.95))',
          duration: 0.28,
          ease: 'power2.out'
        });
      }

      // 2. Preloader content fades up
      exitTl.to(content, {
        opacity: 0,
        y: -36,
        duration: 0.35,
        ease: 'power3.in'
      }, '-=0.1');

      // 3. Preloader curtain slides up smoothly revealing the website below
      exitTl.to(preloader, {
        yPercent: -100,
        duration: 0.85,
        ease: 'power4.inOut'
      }, '-=0.15');

      // 4. Grand entrance: reveal hero elements as curtain lifts
      exitTl.fromTo('.site-header',
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
        '-=0.6'
      );

      // Play Hero Heading Blur Reveal in perfect sync
      exitTl.add(() => {
        if (typeof window.playHeroHeadingReveal === 'function') {
          window.playHeroHeadingReveal(0.05);
        }
      }, '-=0.55');

      exitTl.fromTo('#heroImageFrame',
        { y: 40, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.5'
      );

      exitTl.fromTo('.hero-parallax-card-wrap',
        { scale: 0.7, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'back.out(1.6)' },
        '-=0.5'
      );

    } else {
      preloader.style.transition = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
      preloader.style.transform = 'translateY(-100%)';
      document.body.classList.remove('is-loading');
      setTimeout(() => {
        preloader.style.display = 'none';
        if (typeof window.playHeroHeadingReveal === 'function') {
          window.playHeroHeadingReveal(0.1);
        }
      }, 800);
    }
  }
}

/**
 * =========================================================================
 * GSAP SMOOTH SCROLL INTEGRATION (LENIS + GSAP TICKER)
 * =========================================================================
 * Drives buttery, natural momentum scrolling across the entire page,
 * synchronized directly with GSAP's central RAF ticker and ScrollTrigger.
 */
let lenisInstance = null;

function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  lenisInstance = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smooth decay
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false,
  });

  // Keep ScrollTrigger and Lenis perfectly aligned on every scroll event
  lenisInstance.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  });

  // Bind Lenis animation frame directly to GSAP's central RAF ticker
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    // Turn off lagSmoothing to eliminate frame-skip jumps during heavy scrolls
    gsap.ticker.lagSmoothing(0);
  }

  // Expose globally for programmatic controls & modal hooks
  window.lenis = lenisInstance;

  // Pause smooth scroll during Bootstrap modals to avoid backdrop scroll conflicts
  const modalEls = document.querySelectorAll('.modal');
  modalEls.forEach(modal => {
    modal.addEventListener('show.bs.modal', () => {
      if (lenisInstance) lenisInstance.stop();
    });
    modal.addEventListener('hidden.bs.modal', () => {
      if (lenisInstance) lenisInstance.start();
    });
  });

  // Back to top button integration
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(0, {
          duration: 1.35,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

/**
 * =========================================================================
 * GSAP HERO BANNER PARALLAX & 3D INTERACTIVITY
 * =========================================================================
 * Multi-plane depth parallax scrubbed with ScrollTrigger, combined with
 * interactive desktop mousemove camera tracking.
 */
function initHeroParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroSection = document.getElementById('heroSection');
  if (!heroSection) return;

  const heroContent = document.getElementById('heroContent');
  const heroImageFrame = document.getElementById('heroImageFrame');
  const heroModelImg = document.getElementById('heroModelImg');
  const cardWrap1 = document.getElementById('heroParallaxCard1');
  const cardWrap2 = document.getElementById('heroParallaxCard2');
  const cardMouse1 = document.getElementById('heroCardMouse1');
  const cardMouse2 = document.getElementById('heroCardMouse2');
  const heroModelGlow = document.getElementById('heroModelGlow');
  const bgOrbs = document.querySelectorAll('.hero-ambient-orb');

  const mm = gsap.matchMedia();

  // 1. Desktop Experience (min-width: 992px)
  mm.add('(min-width: 992px)', () => {
    // Multi-plane Scroll Parallax Scrub Timeline
    const scrollParallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1,
        invalidateOnRefresh: true
      }
    });

    // Deep Background Ambient Glow & Orbs: Slower sinking movement
    if (heroModelGlow) {
      scrollParallaxTl.to(heroModelGlow, {
        y: 85,
        scale: 1.1,
        ease: 'none'
      }, 0);
    }
    if (bgOrbs.length) {
      scrollParallaxTl.to(bgOrbs, {
        y: 95,
        ease: 'none'
      }, 0);
    }

    // Midground Model Image: Sinks gently down as page scrolls
    if (heroImageFrame) {
      scrollParallaxTl.to(heroImageFrame, {
        y: 48,
        scale: 0.985,
        ease: 'none'
      }, 0);
    }

    // Foreground Left Content: Floats gently up with subtle fade
    if (heroContent) {
      scrollParallaxTl.to(heroContent, {
        y: -36,
        opacity: 0.82,
        ease: 'none'
      }, 0);
    }

    // Floating Benefit Cards (Foreground): Drift upwards faster for 3D stereoscopic depth
    if (cardWrap1) {
      scrollParallaxTl.to(cardWrap1, {
        y: -65,
        rotation: -2,
        ease: 'none'
      }, 0);
    }
    if (cardWrap2) {
      scrollParallaxTl.to(cardWrap2, {
        y: -42,
        rotation: 2,
        ease: 'none'
      }, 0);
    }

    // 2. Interactive Desktop Mousemove Parallax: Disabled (both text and image kept stationary on mouse move)
    if (heroModelImg) gsap.set(heroModelImg, { x: 0, y: 0 });
    if (heroModelGlow) gsap.set(heroModelGlow, { x: 0, y: 0 });
    if (cardMouse1) gsap.set(cardMouse1, { x: 0, y: 0, rotation: 0 });
    if (cardMouse2) gsap.set(cardMouse2, { x: 0, y: 0, rotation: 0 });
    if (heroContent) gsap.set(heroContent, { x: 0 });
  });

  // 2. Mobile & Tablet Experience (< 992px)
  mm.add('(max-width: 991.98px)', () => {
    // Subtle, restrained scroll parallax for smaller viewports
    const mobileTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.0
      }
    });

    if (heroImageFrame) {
      mobileTl.to(heroImageFrame, { y: 25, ease: 'none' }, 0);
    }
    if (cardWrap1) {
      mobileTl.to(cardWrap1, { y: -25, ease: 'none' }, 0);
    }
    if (cardWrap2) {
      mobileTl.to(cardWrap2, { y: -18, ease: 'none' }, 0);
    }
  });
}

/**
 * =========================================================================
 * GSAP RESULTS SHOWCASE SECTION PARALLAX & 3D INTERACTIVITY
 * =========================================================================
 * Multi-plane depth parallax scrubbed via ScrollTrigger:
 * 1. Background landscape photo glides smoothly inside its window
 * 2. Left editorial typography floats upward
 * 3. Right patient results collage moves downward
 * 4. Ambient background glow orbs drift diagonally
 * 5. Interactive 3D mouse parallax tracking on desktop
 */
function initResultsShowcaseParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const section = document.getElementById('resultsShowcaseSection');
  if (!section) return;

  const bgImage = document.getElementById('resultsBgImage');
  const copyEl = document.getElementById('resultsCopy');
  const visualCard = document.getElementById('resultsVisualCard') || document.getElementById('resultsVisual');
  const orbs = section.querySelectorAll('.results-ambient-orb');

  const mm = gsap.matchMedia();

  // 1. Desktop Experience (min-width: 992px)
  mm.add('(min-width: 992px)', () => {
    // Parallax Timeline synced with ScrollTrigger scrub
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.1,
        invalidateOnRefresh: true
      }
    });

    // Background Image: Moves downward as you scroll down (creates a scenic window)
    if (bgImage) {
      tl.fromTo(bgImage,
        { yPercent: -14 },
        { yPercent: 14, ease: 'none' },
        0
      );
    }

    // Ambient Orbs: Drift diagonally in opposite directions
    if (orbs.length >= 2) {
      tl.fromTo(orbs[0], { y: -50, x: -20 }, { y: 60, x: 20, ease: 'none' }, 0);
      tl.fromTo(orbs[1], { y: 40, x: 20 }, { y: -50, x: -20, ease: 'none' }, 0);
    }

    // Left Copy: Floats upward relative to scroll for elevated editorial look
    if (copyEl) {
      tl.fromTo(copyEl,
        { y: 35 },
        { y: -35, ease: 'none' },
        0
      );
    }

    // Right Visual Card (Patient collage): Moves downward against the text
    if (visualCard) {
      tl.fromTo(visualCard,
        { y: -45, scale: 0.96 },
        { y: 45, scale: 1.02, ease: 'none' },
        0
      );
    }
  });

  // 2. Tablet & Mobile Experience (< 992px)
  mm.add('(max-width: 991px)', () => {
    const mobileTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.0
      }
    });

    if (bgImage) {
      mobileTl.fromTo(bgImage, { yPercent: -6 }, { yPercent: 6, ease: 'none' }, 0);
    }
    if (copyEl) {
      mobileTl.fromTo(copyEl, { y: 15 }, { y: -15, ease: 'none' }, 0);
    }
    if (visualCard) {
      mobileTl.fromTo(visualCard, { y: -15 }, { y: 15, ease: 'none' }, 0);
    }
  });
}

/**
 * Cinematic Heading Blur Animations for All Sections
 * Uses GSAP & ScrollTrigger to reveal headings with blur-to-clear effect
 * whenever the user scrolls or navigates to each specific section.
 */
function initHeadingBlurAnimation() {
  if (typeof gsap === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // 1. Hero Heading lines: Staggered cinematic blur reveal helper
  window.playHeroHeadingReveal = function (delay = 0.15) {
    const heroHeadingLines = document.querySelectorAll(
      '.hero-title .heading-line, .product-hero-title .heading-line'
    );
    const targetElements = heroHeadingLines.length
      ? heroHeadingLines
      : document.querySelectorAll('.hero-title, .product-hero-title');

    if (!targetElements.length || typeof gsap === 'undefined') return;

    gsap.fromTo(
      targetElements,
      {
        opacity: 0,
        y: 28,
        filter: 'blur(16px)',
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.3,
        stagger: 0.2,
        ease: 'power3.out',
        delay: delay,
        clearProps: 'filter,transform'
      }
    );
  };

  // If there's no preloader on the page, play hero heading reveal immediately
  const preloaderEl = document.getElementById('sitePreloader');
  if (!preloaderEl) {
    window.playHeroHeadingReveal(0.15);
  }

  // 2. All section headings across the landing page & product detail pages:
  // Triggered on scroll as the user reaches each specific section
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const sectionHeadings = [
      { id: '#categoriesTitle', selector: '.categories-title' },
      { id: '#productAboutTitle', selector: '.product-about-title' },
      { id: '#semaglutideStatsTitle', selector: '.semaglutide-stats-title' },
      { id: '#hiwMainHeadline', selector: '.hiw-headline' },
      { id: '#whySemaglutideHeading', selector: '.why-semaglutide-title' },
      { id: '#treatmentsHeadline', selector: '.treatments-main-headline' },
      { id: '#resultsTitle', selector: '.results-title' },
      { id: '#careResultsTitle', selector: '.care-results-title' },
      { id: '#reviewsHeadline', selector: '.testimonial-main-title' },
      { id: '#faqMainTitle', selector: '.faq-main-title' },
      { id: '#footerCtaHeadline', selector: '.footer-cta-headline' }
    ];

    const animatedHeadings = new Set();

    const applyBlurScrollTrigger = (heading) => {
      if (!heading || animatedHeadings.has(heading)) return;
      if (
        heading.classList.contains('hero-title') ||
        heading.classList.contains('product-hero-title') ||
        heading.closest('.hero-title, .product-hero-title')
      ) {
        return;
      }
      animatedHeadings.add(heading);

      const triggerSection =
        heading.closest(
          'section, footer, .footer-cta-card, .product-about-section, .semaglutide-stats-section, .why-semaglutide-section'
        ) || heading;

      gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 28,
          filter: 'blur(16px)',
          scale: 0.98
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          clearProps: 'filter,transform',
          scrollTrigger: {
            trigger: triggerSection,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    };

    sectionHeadings.forEach(({ id, selector }) => {
      const heading = document.querySelector(id) || document.querySelector(selector);
      if (heading) applyBlurScrollTrigger(heading);
    });

    document.querySelectorAll('.section-blur-heading').forEach((heading) => {
      applyBlurScrollTrigger(heading);
    });

    // 3. Anchor Navigation Re-trigger:
    // When clicking any navigation link (e.g. navbar links, buttons pointing to #sections),
    // ensure smooth scroll with header offset and re-trigger heading blur animation
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '#signin' || href === '#qualify') return;

        let targetEl = null;
        try {
          targetEl = document.querySelector(href);
        } catch (err) {
          return;
        }

        if (targetEl) {
          if (window.lenis) {
            e.preventDefault();
            window.lenis.scrollTo(targetEl, {
              offset: -50,
              duration: 1.25,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }

          const targetHeading = targetEl.querySelector(
            '.section-blur-heading, .categories-title, .treatments-main-headline, .results-title, .care-results-title, .testimonial-main-title, .faq-main-title, .footer-cta-headline, .product-about-title, .semaglutide-stats-title, .why-semaglutide-title'
          );
          if (targetHeading) {
            gsap.fromTo(
              targetHeading,
              {
                opacity: 0,
                y: 28,
                filter: 'blur(16px)',
                scale: 0.98
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.25,
                clearProps: 'filter,transform'
              }
            );
          }
        }
      });
    });
  }
}

/**
 * Sticky Navbar Dynamic Styling on Scroll
 */
function initNavbarScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Modern Mobile Sidebar Drawer Navigation
 */
function initMobileSidebar() {
  const mobileSidebar = document.getElementById('mobileNavSidebar');
  if (!mobileSidebar) return;

  const links = mobileSidebar.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Dismiss offcanvas drawer smoothly
      if (window.bootstrap && window.bootstrap.Offcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileSidebar) || bootstrap.Offcanvas.getOrCreateInstance(mobileSidebar);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }

      // If linking to a page anchor, smooth scroll via Lenis or native
      if (href && href.startsWith('#') && href !== '#' && href !== '#signin' && href !== '#qualify') {
        let targetEl = null;
        try {
          targetEl = document.querySelector(href);
        } catch (err) { }

        if (targetEl) {
          e.preventDefault();
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.scrollTo(targetEl, {
                offset: -60,
                duration: 1.2
              });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 320);
        }
      }
    });
  });
}

/**
 * Animated Counter for Social Proof (20,000+)
 */
function initPatientCounter() {
  const counterElement = document.getElementById('patientCounter');
  if (!counterElement) return;

  const target = parseInt(counterElement.getAttribute('data-target') || '20000', 10);
  const duration = 2000; // 2 seconds
  let hasAnimated = false;

  const startCounting = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeProgress * target);

      counterElement.textContent = currentCount.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counterElement.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  };

  // Trigger when visible in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(counterElement);
  } else {
    startCounting();
  }
}

/**
 * Floating Treatment Cards: Interactive Click
 */
function initFloatingCards() {
  const cards = document.querySelectorAll('.floating-treatment-card, .floating-benefit-card, [data-treatment]');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const treatmentName = card.getAttribute('data-treatment');
      if (treatmentName) {
        if (treatmentName.toLowerCase().includes('weight') || treatmentName.toLowerCase().includes('semaglutide')) {
          window.location.href = 'semaglutide.html';
        } else if (typeof showToast === 'function') {
          showToast(`Selected program: ${treatmentName}`);
        }
      }
    });

    // Keyboard accessibility (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/**
 * Helper: Select specific treatment option (Safe fallback)
 */
function selectTreatmentOption(treatmentName) {
  // Safe helper kept for external callers
}

/**
 * Modal Option Toggle & Form Submission (Cleaned - modals removed)
 */
function initModalInteractions() {
  // Modals eliminated across template
}

/**
 * Assessment Form Submission (Global handler called by HTML form)
 */
window.submitAssessment = function () {
  const step1 = document.getElementById('assessmentStep1');
  const result = document.getElementById('assessmentResult');
  const firstName = document.getElementById('patientFirstName')?.value || 'Friend';

  if (step1 && result) {
    step1.classList.add('d-none');
    result.classList.remove('d-none');

    // Update greeting
    const resultHeading = result.querySelector('h4');
    if (resultHeading) {
      resultHeading.textContent = `Great news ${firstName}, you qualify!`;
    }
  }
};

/**
 * Helper: Show Toast Notification
 */
function showToast(message) {
  const toastEl = document.getElementById('actionToast');
  const msgEl = document.getElementById('toastMessage');
  if (toastEl && msgEl) {
    msgEl.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
    toast.show();
  }
}

/**
 * Treatment Showcase: Interactive Hover to Change Left Featured Image
 */
function initTreatmentShowcase() {
  const cards = document.querySelectorAll('.treatment-small-card');
  const images = document.querySelectorAll('.featured-product-img');
  const labelEl = document.getElementById('featuredProductLabel');
  const cardsGrid = document.querySelector('.treatment-cards-grid');

  if (!cards.length || !images.length) return;

  const productLabels = {
    'default': 'All Treatments',
    'weight-loss': 'GLP-1 Weight Loss',
    'hair-skin': 'Hair & Skin Care',
    'menopause': 'Menopause Support',
    'sexual-health': 'Sexual Health',
    'sleep-issue': 'Sleep Issue Support',
    'longevity': 'Longevity & Vitality',
    'naltrexone': 'GLP-1 Weight Loss',
    'metformin': 'Hair & Skin Care',
    'nasal-spray': 'Menopause Support',
    'nad-patches': 'Sexual Health',
    'tadalafil': 'Sleep Issue Support',
    'silendafil': 'Longevity & Vitality'
  };

  let activeProductKey = 'default';
  let activeImg = document.querySelector('.featured-product-img[data-product="default"]') || images[0];
  let hoverDebounceTimer = null;

  function switchImage(productKey) {
    if (productKey === activeProductKey) return;
    const targetImg = document.querySelector(`.featured-product-img[data-product="${productKey}"]`);
    if (!targetImg) return;

    const prevImg = activeImg;
    activeImg = targetImg;
    activeProductKey = productKey;

    if (typeof gsap !== 'undefined') {
      // 1. Anchor previous image underneath at full opacity to eliminate any opacity dip/flash
      if (prevImg && prevImg !== targetImg) {
        gsap.killTweensOf(prevImg);
        gsap.set(prevImg, { zIndex: 1, opacity: 1 });
        // Fade out prevImg gently after target starts covering it
        gsap.to(prevImg, {
          opacity: 0,
          duration: 0.55,
          delay: 0.1,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(prevImg, { zIndex: 0 });
            prevImg.classList.remove('active');
          }
        });
      }

      // 2. Bring target image to top layer and execute cinematic crossfade + gentle camera settle
      gsap.killTweensOf(targetImg);
      gsap.set(targetImg, { zIndex: 2 });

      const currentOpacity = targetImg.style.opacity ? parseFloat(targetImg.style.opacity) : 0;
      gsap.fromTo(targetImg,
        {
          opacity: currentOpacity,
          scale: 1.035
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            targetImg.classList.add('active');
            // Clean up any other lingering images
            images.forEach(img => {
              if (img !== targetImg) {
                gsap.set(img, { opacity: 0, zIndex: 0, scale: 1.035 });
                img.classList.remove('active');
              }
            });
          }
        }
      );

      // 3. Silky smooth badge label transition
      if (labelEl && productLabels[productKey]) {
        gsap.killTweensOf(labelEl);
        gsap.to(labelEl, {
          opacity: 0,
          y: -4,
          duration: 0.14,
          ease: 'power2.in',
          onComplete: () => {
            labelEl.textContent = productLabels[productKey];
            gsap.fromTo(labelEl,
              { opacity: 0, y: 4 },
              { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
            );
          }
        });
      }
    } else {
      // CSS Fallback with .is-previous retention
      if (prevImg && prevImg !== targetImg) {
        images.forEach(img => img.classList.remove('is-previous'));
        prevImg.classList.add('is-previous');
      }
      images.forEach(img => {
        if (img !== prevImg) img.classList.remove('active');
      });
      targetImg.classList.add('active');
      setTimeout(() => {
        images.forEach(img => {
          if (img !== targetImg) {
            img.classList.remove('active');
            img.classList.remove('is-previous');
          }
        });
      }, 650);

      if (labelEl && productLabels[productKey]) {
        labelEl.classList.add('is-updating');
        setTimeout(() => {
          labelEl.textContent = productLabels[productKey];
          labelEl.classList.remove('is-updating');
        }, 160);
      }
    }
  }

  cards.forEach(card => {
    const productKey = card.getAttribute('data-product');

    // Hover effect: dynamically change left featured image with micro-debounce
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      if (hoverDebounceTimer) clearTimeout(hoverDebounceTimer);
      hoverDebounceTimer = setTimeout(() => {
        switchImage(productKey);
      }, 35);
    });

    // Click: inactive hyperlink - prevent popup, modal, and navigation action
    card.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  // Revert back to default hero group image when mouse leaves cards grid
  if (cardsGrid) {
    cardsGrid.addEventListener('mouseleave', () => {
      cards.forEach(c => c.classList.remove('active'));
      if (hoverDebounceTimer) clearTimeout(hoverDebounceTimer);
      hoverDebounceTimer = setTimeout(() => {
        switchImage('default');
      }, 50);
    });
  }

  // GSAP scroll entrance animation
  if (typeof gsap !== 'undefined' && 'IntersectionObserver' in window) {
    const section = document.querySelector('.treatment-showcase-section');
    if (!section) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          gsap.fromTo(
            '.treatment-featured-frame',
            { opacity: 0, x: -30, scale: 0.98 },
            { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
          );
          gsap.fromTo(
            '.treatment-small-card',
            { opacity: 0, y: 25, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
          );
          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  }
}

/**
 * =========================================================================
 * POPULAR TREATMENTS AUTO-SLIDER WITH CONTROLLER & TOUCH/DRAG GESTURES
 * =========================================================================
 */
function initPopularTreatmentsSlider() {
  const wrapper = document.getElementById('treatmentsSliderWrapper');
  const track = document.getElementById('treatmentsSliderTrack');
  const prevBtn = document.getElementById('treatmentsSliderPrev');
  const nextBtn = document.getElementById('treatmentsSliderNext');
  const progressBar = document.getElementById('treatmentsProgressBar');
  const dotsContainer = document.getElementById('treatmentsSliderDots');

  if (!wrapper || !track) return;

  const cards = track.querySelectorAll('.treatment-product-card');
  if (!cards.length) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const autoSlideDelay = 3600; // 3.6s per slide

  // Drag & Swipe state
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = null;
  let hasMoved = false;


  /**
   * Calculate dimensions
   */
  function getSlideStep() {
    const card = cards[0];
    const cardWidth = card.getBoundingClientRect().width;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '24') || 24;
    return cardWidth + gap;
  }

  function getMaxScrollOffset() {
    return Math.max(0, track.scrollWidth - wrapper.clientWidth);
  }

  function getMaxIndex() {
    const step = getSlideStep();
    const maxOffset = getMaxScrollOffset();
    if (step <= 0 || maxOffset <= 0) return 0;
    return Math.ceil(maxOffset / step);
  }

  /**
   * Align slider track with hero-container content left edge
   */
  function updateSliderContainerOffset() {
    const container = document.querySelector('.popular-treatments-section .hero-container');
    if (!container || !track) return;
    const containerRect = container.getBoundingClientRect();
    const style = window.getComputedStyle(container);
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const offset = Math.max(0, containerRect.left + padLeft);
    track.style.paddingLeft = `${offset}px`;
    track.style.paddingRight = `${Math.max(offset, 24)}px`;
  }

  /**
   * Setup Pagination Dots
   */
  function setupDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const totalDots = maxIdx + 1;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('tabindex', '0');
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Update Dots and Progress Bar
   */
  function updateIndicators() {
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    if (progressBar) {
      const maxIdx = getMaxIndex();
      const progressPercent = maxIdx > 0 ? ((currentIndex + 1) / (maxIdx + 1)) * 100 : 100;
      progressBar.style.width = `${Math.min(100, Math.max(15, progressPercent))}%`;
    }
  }

  /**
   * Move to specific slide index
   */
  function goToSlide(index, smooth = true) {
    const maxIdx = getMaxIndex();
    const step = getSlideStep();
    const maxOffset = getMaxScrollOffset();

    // Wrap around smoothly
    if (index > maxIdx) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = maxIdx;
    } else {
      currentIndex = index;
    }

    let targetOffset = currentIndex * step;
    if (targetOffset > maxOffset) {
      targetOffset = maxOffset;
    }

    currentTranslate = -targetOffset;
    prevTranslate = currentTranslate;

    if (!smooth) {
      track.classList.add('no-transition');
    } else {
      track.classList.remove('no-transition');
    }

    track.style.transform = `translateX(${currentTranslate}px)`;
    updateIndicators();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /**
   * Auto-Slider Timer
   */
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      nextSlide();
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoSlide();
    });
  }

  // Pause on hover or focus
  wrapper.addEventListener('mouseenter', stopAutoSlide);
  wrapper.addEventListener('mouseleave', () => {
    if (!isDragging) startAutoSlide();
  });

  wrapper.addEventListener('focusin', stopAutoSlide);
  wrapper.addEventListener('focusout', startAutoSlide);

  // Keyboard navigation
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      restartAutoSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      restartAutoSlide();
    }
  });

  /**
   * Drag & Touch Gestures
   */
  function touchStart(event) {
    isDragging = true;
    hasMoved = false;
    startX = getPositionX(event);
    stopAutoSlide();
    track.classList.add('no-transition');
    wrapper.classList.add('is-dragging');
    animationID = requestAnimationFrame(animation);
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const diff = currentX - startX;

    if (Math.abs(diff) > 6) {
      hasMoved = true;
    }

    currentTranslate = prevTranslate + diff;

    // Resistance on overscroll
    const maxOffset = -getMaxScrollOffset();
    if (currentTranslate > 0) {
      currentTranslate = diff * 0.3;
    } else if (currentTranslate < maxOffset) {
      currentTranslate = maxOffset + (diff * 0.3);
    }
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    wrapper.classList.remove('is-dragging');
    track.classList.remove('no-transition');

    const movedBy = currentTranslate - prevTranslate;
    const step = getSlideStep();
    const threshold = step * 0.22; // 22% of card width

    if (movedBy < -threshold) {
      nextSlide();
    } else if (movedBy > threshold) {
      prevSlide();
    } else {
      goToSlide(currentIndex);
    }

    restartAutoSlide();
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    track.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging) requestAnimationFrame(animation);
  }

  // Pointer & Touch Events
  wrapper.addEventListener('mousedown', touchStart);
  window.addEventListener('mousemove', touchMove);
  window.addEventListener('mouseup', touchEnd);

  wrapper.addEventListener('touchstart', touchStart, { passive: true });
  window.addEventListener('touchmove', touchMove, { passive: true });
  window.addEventListener('touchend', touchEnd);

  // Prevent default image drag
  track.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  /**
   * Card Click Handler: Navigate to Semaglutide PDP or trigger notification
   */
  cards.forEach(card => {
    const inner = card.querySelector('.treatment-card-inner');
    const categoryKey = card.getAttribute('data-category') || 'weight-loss';
    const productTitle = card.querySelector('.treatment-product-title')?.textContent.trim() || 'Treatment';

    if (inner) {
      inner.addEventListener('click', (e) => {
        // Inactive hyperlink - prevent popup, modal, or navigation action
        e.preventDefault();
      });

      // Keyboard accessibility for card
      inner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inner.click();
        }
      });
    }
  });

  // Handle Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSliderContainerOffset();
      setupDots();
      goToSlide(currentIndex, false);
    }, 150);
  });

  // Initial setup & start auto-play
  updateSliderContainerOffset();
  setupDots();
  goToSlide(0, false);
  startAutoSlide();
}

function initCustomerTestimonials() {
  const section = document.querySelector('.customer-testimonial-section');
  if (!section) return;

  const thumbs = [...section.querySelectorAll('.testimonial-thumb')];
  const track = section.querySelector('.testimonial-cards-track');
  const viewport = section.querySelector('.testimonial-slider-viewport');
  const originalCards = [...section.querySelectorAll('.testimonial-card')];

  if (!thumbs.length || !originalCards.length || !track || !viewport) return;

  const N = originalCards.length; // 12 unique cards
  const ROTATE_INTERVAL = 2400; // Faster auto-slide timing (2.4s)
  const TRANSITION_DURATION = 450; // Crisp 450ms slide transition

  // 1. Create clones before and after to ensure 100% edge-to-edge coverage with ZERO blank space
  const firstOriginal = track.firstChild;
  const clonesBefore = originalCards.map((c, i) => {
    const clone = c.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });

  const clonesAfter = originalCards.map((c, i) => {
    const clone = c.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });

  // Prepend before-clones preserving original order 0..N-1
  clonesBefore.forEach((clone) => {
    track.insertBefore(clone, firstOriginal);
  });
  // Append after-clones
  clonesAfter.forEach((clone) => {
    track.appendChild(clone);
  });

  // All cards now in track: [0..N-1 (clones)] + [N..2N-1 (originals)] + [2N..3N-1 (clones)]
  const allCards = [...track.querySelectorAll('.testimonial-card')];

  // Start with Maya Patel (index 5) in the middle set
  let activeIndex = 5;
  let currentSlot = N + activeIndex; // Slot 17
  let autoRotateTimer = null;
  let isTransitioning = false;

  function updateTrackPosition(smooth = true) {
    const targetCard = allCards[currentSlot];
    if (!targetCard) return;

    const viewportWidth = viewport.offsetWidth;
    const cardCenter = targetCard.offsetLeft + (targetCard.offsetWidth / 2);
    const targetOffset = (viewportWidth / 2) - cardCenter;

    if (!smooth) {
      track.style.transition = 'none';
    } else {
      track.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    }

    track.style.transform = `translate3d(${targetOffset}px, 0, 0)`;

    if (!smooth) {
      void track.offsetHeight; // Force reflow
      track.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    }
  }

  function setActiveUI(index) {
    // Update thumbnail highlights
    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === index;
      thumb.classList.toggle('is-active', isActive);
      thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update active highlight on all cards
    allCards.forEach((card, idx) => {
      const isCurrentSlot = idx === currentSlot;
      card.classList.toggle('is-active', isCurrentSlot);
    });

    // Scroll active thumbnail smoothly within its container ONLY (never scrolls the page)
    const thumbsContainer = section.querySelector('.testimonial-thumbs-container');
    const activeThumb = thumbs[index];
    if (thumbsContainer && activeThumb && thumbsContainer.scrollWidth > thumbsContainer.clientWidth) {
      const containerWidth = thumbsContainer.clientWidth;
      const thumbCenter = activeThumb.offsetLeft + (activeThumb.offsetWidth / 2);
      const targetScrollLeft = thumbCenter - (containerWidth / 2);
      thumbsContainer.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }

  function goToSlot(slot, smooth = true) {
    currentSlot = slot;
    activeIndex = ((currentSlot % N) + N) % N;
    setActiveUI(activeIndex);
    updateTrackPosition(smooth);
  }

  // Handle seamless infinite loop reset
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    // If reached after-clones
    if (currentSlot >= 2 * N) {
      currentSlot = currentSlot - N;
      goToSlot(currentSlot, false);
    }
    // If reached before-clones
    else if (currentSlot < N) {
      currentSlot = currentSlot + N;
      goToSlot(currentSlot, false);
    }
  });

  function nextReview() {
    if (isTransitioning) return;
    isTransitioning = true;
    goToSlot(currentSlot + 1, true);
  }

  function prevReview() {
    if (isTransitioning) return;
    isTransitioning = true;
    goToSlot(currentSlot - 1, true);
  }

  let isSectionInView = false;

  function startAutoRotate() {
    stopAutoRotate();
    if (!isSectionInView) return;
    autoRotateTimer = window.setInterval(nextReview, ROTATE_INTERVAL);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  // Thumbnail click interaction: find shortest direction and slide
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const targetIndex = Number(thumb.dataset.reviewIndex || 0);
      const currentMod = ((currentSlot % N) + N) % N;
      let diff = targetIndex - currentMod;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      isTransitioning = true;
      goToSlot(currentSlot + diff, true);
      startAutoRotate();
    });
  });

  // Clicking on any visible card centers it
  allCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      isTransitioning = true;
      goToSlot(idx, true);
      startAutoRotate();
    });
  });

  // Pause on hover or focus, resume on leave
  section.addEventListener('mouseenter', stopAutoRotate);
  section.addEventListener('mouseleave', () => {
    if (isSectionInView) startAutoRotate();
  });
  section.addEventListener('focusin', stopAutoRotate);
  section.addEventListener('focusout', () => {
    if (isSectionInView) startAutoRotate();
  });

  // Touch swipe gesture support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    stopAutoRotate();
    if (e.changedTouches && e.changedTouches.length) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          nextReview();
        } else {
          prevReview();
        }
      }
    }
    if (isSectionInView) startAutoRotate();
  }, { passive: true });

  // Recenter on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateTrackPosition(false);
    }, 80);
  });

  // Initialize position without moving the window scroll
  setTimeout(() => {
    goToSlot(currentSlot, false);
  }, 40);

  // IntersectionObserver: Only auto-rotate when section is visible in viewport!
  // This completely prevents the page from jumping or scrolling when the user is in other sections.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isSectionInView = entry.isIntersecting;
        if (isSectionInView) {
          startAutoRotate();
        } else {
          stopAutoRotate();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(section);
  } else {
    isSectionInView = true;
    startAutoRotate();
  }
}

/**
 * =========================================================================
 * FAQ ACCORDION INTERACTIVITY
 * =========================================================================
 */
function initFaqAccordion() {
  const faqSection = document.getElementById('faqs');
  if (!faqSection) return;

  const items = faqSection.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all items
      items.forEach(otherItem => {
        otherItem.classList.remove('is-open');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // If this item was not already open, open it
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Footer Newsletter Submission
 */
window.submitNewsletter = function (event) {
  if (event) event.preventDefault();
  const input = document.querySelector('.newsletter-input');
  if (input && input.value) {
    showToast('Thank you for subscribing to Vellore Rx wellness updates!');
    input.value = '';
  }
};

/**
 * Global Product PDP CTA Handler (Intake confirmation without modal)
 */
document.addEventListener('DOMContentLoaded', () => {
  const heroCta = document.getElementById('productHeroCtaBtn');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Prescription protocol initiated! Ready for physician intake.', 'success');
      }
    });
  }

  // Prevent default action for inactive Treatments dropdown links (href="#")
  document.addEventListener('click', (e) => {
    const inactiveMegaLink = e.target.closest('.dropdown-menu-mega a[href="#"]');
    if (inactiveMegaLink) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});



