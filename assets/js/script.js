/**
 * HOW IT WORKS — ADVANCED GSAP & SCROLLTRIGGER STORYTELLING
 * Modern American Telemedicine Platform
 * Vanilla JavaScript (ES6+) with GSAP 3 & Lucide Icons
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Initialize Core Animations & Interactions
  initHowItWorksExperience();
});

function initHowItWorksExperience() {
  // Ensure GSAP and ScrollTrigger exist
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Falling back to default layout.');
    return;
  }

  // Register ScrollTrigger and ScrollToPlugin if available
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Metadata for step visual card updates
  const stepMetadata = [
    {
      num: '01',
      stepText: 'Step 01 of 04',
      badge: 'Virtual Intake',
      title: 'Digital Health Questionnaire',
      timing: '2–3 mins'
    },
    {
      num: '02',
      stepText: 'Step 02 of 04',
      badge: 'Provider Review',
      title: 'Licensed Clinician Consultation',
      timing: 'Same-day review'
    },
    {
      num: '03',
      stepText: 'Step 03 of 04',
      badge: 'Tailored Regimen',
      title: 'Customized Treatment Plan',
      timing: 'Discreet delivery'
    },
    {
      num: '04',
      stepText: 'Step 04 of 04',
      badge: 'Ongoing Care',
      title: 'Continuous Support & Monitoring',
      timing: 'Always connected'
    }
  ];

  // DOM Elements
  const section = document.querySelector('.how-it-works');
  const introZone = document.querySelector('.hiw-intro-zone');
  const stepItems = document.querySelectorAll('.hiw-step-item');
  const lifestyleImages = document.querySelectorAll('.hiw-lifestyle-img');
  const bottomStepLabel = document.getElementById('hiwBottomStepLabel');
  const bottomCardTitle = document.getElementById('hiwBottomCardTitle');
  const bottomCardBadge = document.getElementById('hiwBottomCardBadge');
  const ctaCard = document.querySelector('.hiw-cta-card');

  if (!section) return;

  // Reduced motion: Ensure all elements are immediately visible and exit early
  if (prefersReducedMotion) {
    stepItems.forEach((item, index) => {
      item.classList.remove('is-inactive');
      if (index === 0) item.classList.add('is-active');
    });
    if (lifestyleImages.length > 0) {
      lifestyleImages[0].classList.add('is-active');
    }
    return;
  }

  // =========================================================================
  // ZONE A: EDITORIAL INTRODUCTION REVEAL
  // =========================================================================
  if (introZone) {
    const introEyebrow = introZone.querySelector('.hiw-eyebrow');
    const headlineLines = introZone.querySelectorAll('.hiw-headline-line');
    const introDesc = introZone.querySelector('.hiw-intro-desc');
    const scrollIndicator = introZone.querySelector('.hiw-scroll-indicator');
    const introDivider = introZone.querySelector('.hiw-intro-divider');

    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: introZone,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // 1. Eyebrow badge is always visible and crisp
    if (introEyebrow) {
      gsap.set(introEyebrow, { opacity: 1, y: 0, clearProps: 'all' });
    }

    // 2. Headline reveals line by line with masked text & blur effect
    if (headlineLines.length > 0) {
      introTl.from(headlineLines, {
        yPercent: 110,
        opacity: 0,
        filter: 'blur(16px)',
        duration: 1.2,
        stagger: 0.16,
        ease: 'power3.out',
        clearProps: 'filter,transform'
      }, 0.15);
    }

    // 3. Supporting paragraph fades in with subtle delay
    if (introDesc) {
      introTl.from(introDesc, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, 0.4);
    }

    // 4. Directional scroll indicator
    if (scrollIndicator) {
      introTl.from(scrollIndicator, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.55);
    }

    // 5. Thin horizontal decorative line expands horizontally
    if (introDivider) {
      introTl.from(introDivider, {
        scaleX: 0,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut'
      }, 0.35);
    }
  }

  // =========================================================================
  // RESPONSIVE BEHAVIOR (gsap.matchMedia)
  // =========================================================================
  const mm = gsap.matchMedia();

  // -------------------------------------------------------------------------
  // DESKTOP EXPERIENCE (min-width: 992px)
  // Sticky Right Panel + ScrollTrigger Narrative
  // -------------------------------------------------------------------------
  mm.add('(min-width: 992px)', () => {
    let currentActiveIndex = 0;

    // Helper: Activate a given step index (0-3)
    function activateStep(index, immediate = false) {
      if (index === currentActiveIndex && !immediate) return;

      const prevIndex = currentActiveIndex;
      currentActiveIndex = index;

      // 1. Update Step Items classes & progress lines
      stepItems.forEach((item, i) => {
        const progressFill = item.querySelector('.hiw-step-progress-fill');

        if (i === index) {
          item.classList.remove('is-inactive');
          item.classList.add('is-active');

          if (progressFill) {
            gsap.to(progressFill, {
              width: '100%',
              duration: immediate ? 0 : 0.5,
              ease: 'power2.out'
            });
          }
        } else {
          item.classList.remove('is-active');
          item.classList.add('is-inactive');

          if (progressFill) {
            // Keep past steps completed (100%), upcoming steps at 0%
            const targetWidth = i < index ? '100%' : '0%';
            gsap.to(progressFill, {
              width: targetWidth,
              duration: 0.35,
              ease: 'power2.inOut'
            });
          }
        }
      });

      // 2. Smooth Image Crossfade + Subtle Scale Transition
      lifestyleImages.forEach((img, i) => {
        gsap.killTweensOf(img);

        if (i === index) {
          img.classList.add('is-active');
          if (immediate) {
            gsap.set(img, { opacity: 1, scale: 1 });
          } else {
            gsap.fromTo(img,
              { opacity: 0, scale: 1.04 },
              { opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out' }
            );
          }
        } else if (i === prevIndex && !immediate) {
          img.classList.remove('is-active');
          gsap.to(img, {
            opacity: 0,
            scale: 0.96,
            duration: 0.65,
            ease: 'power2.out'
          });
        } else {
          img.classList.remove('is-active');
          gsap.set(img, { opacity: 0, scale: 0.96 });
        }
      });

      // 3. Update Bottom Floating Card Meta with subtle fade
      const meta = stepMetadata[index];
      if (meta) {
        if (bottomStepLabel) bottomStepLabel.textContent = meta.stepText;
        if (bottomCardTitle) {
          gsap.fromTo(bottomCardTitle,
            { opacity: 0.4, y: 4 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
          );
          bottomCardTitle.textContent = meta.title;
        }
        if (bottomCardBadge) {
          bottomCardBadge.innerHTML = `
            <i data-lucide="clock" class="hiw-inline-icon"></i>
            <span>${meta.timing}</span>
          `;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    }

    // Set initial active step
    activateStep(0, true);

    // Create ScrollTrigger for each step item with onToggle for responsive bi-directional updates
    stepItems.forEach((stepItem, index) => {
      ScrollTrigger.create({
        trigger: stepItem,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) {
            activateStep(index);
          }
        }
      });
    });

    // Interactive Step Clicking: smooth scroll to center the selected step
    stepItems.forEach((stepItem, index) => {
      stepItem.addEventListener('click', () => {
        activateStep(index);

        const rect = stepItem.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - (window.innerHeight * 0.32);

        if (window.lenis) {
          window.lenis.scrollTo(targetY, { duration: 1.0 });
        } else {
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      });

      // Keyboard support: Enter / Space triggers click
      stepItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          stepItem.click();
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // MOBILE EXPERIENCE (max-width: 991px)
  // Natural Vertical Journey with Sequential Scroll Reveals
  // -------------------------------------------------------------------------
  mm.add('(max-width: 991px)', () => {
    stepItems.forEach((stepItem, index) => {
      // Keep all items readable on mobile
      stepItem.classList.remove('is-inactive');
      stepItem.classList.add('is-active');

      const progressFill = stepItem.querySelector('.hiw-step-progress-fill');
      if (progressFill) {
        gsap.set(progressFill, { width: '100%' });
      }

      // Smooth scroll reveal for each step card
      gsap.from(stepItem, {
        scrollTrigger: {
          trigger: stepItem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });
  });

  // =========================================================================
  // ZONE C: CLOSING CTA ANIMATION
  // =========================================================================
  if (ctaCard) {
    const ctaEyebrow = ctaCard.querySelector('.hiw-cta-eyebrow');
    const ctaHeadline = ctaCard.querySelector('.hiw-cta-headline');
    const ctaDesc = ctaCard.querySelector('.hiw-cta-desc');
    const ctaActions = ctaCard.querySelector('.hiw-cta-actions');

    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaCard,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    if (ctaEyebrow) {
      ctaTl.from(ctaEyebrow, {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, 0);
    }

    if (ctaHeadline) {
      ctaTl.from(ctaHeadline, {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, 0.12);
    }

    if (ctaDesc) {
      ctaTl.from(ctaDesc, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.25);
    }

    if (ctaActions) {
      ctaTl.from(ctaActions.children, {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      }, 0.4);
    }
  }

  // Refresh ScrollTrigger when layout is fully computed
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}
