/* ========================================================
   ALL PRODUCTS PAGE — ELORA RX
   Handles: Category filtering, sorting, pagination (8/page),
            sticky header scroll, back-to-top, mobile nav.
   ======================================================== */
(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────────── */
  const CARDS_PER_PAGE = 8;

  /* ── State ──────────────────────────────────────────── */
  let allCards       = [];   // NodeList → Array of card elements
  let visibleCards   = [];   // filtered + sorted subset
  let currentPage    = 1;
  let currentCat     = 'all';
  let currentSort    = 'featured';

  /* ── DOM Refs ───────────────────────────────────────── */
  const grid          = document.getElementById('apProductsContainer');
  const pagination    = document.getElementById('apPagination');
  const prevBtn       = document.getElementById('apPrevBtn');
  const nextBtn       = document.getElementById('apNextBtn');
  const pageNumbers   = document.getElementById('apPageNumbers');
  const pageInfo      = document.getElementById('apPageInfo');
  const showingCount  = document.getElementById('apShowingCount');
  const totalCount    = document.getElementById('apTotalCount');
  const emptyState    = document.getElementById('apEmptyState');
  const emptyReset    = document.getElementById('apEmptyReset');
  const sortSelect    = document.getElementById('apSortSelect');
  const catTabs       = document.querySelectorAll('.ap-category-tab');
  const siteHeader    = document.getElementById('siteHeader');
  const backToTopBtn  = document.getElementById('backToTopBtn');

  /* ═══════════════════════════════════════════════════════
     CATEGORY PROGRAMMATIC SELECTION & URL ROUTING
  ═══════════════════════════════════════════════════════ */
  function selectCategory(categoryKey, shouldScroll) {
    if (!categoryKey) return;
    let target = categoryKey.toLowerCase().trim();

    // Map common aliases / alternative slugs
    const aliasMap = {
      'weightloss': 'weight-loss',
      'weight-loss': 'weight-loss',
      'weight': 'weight-loss',
      'glp-1': 'weight-loss',
      'glp1': 'weight-loss',
      'glp-1-weight-loss': 'weight-loss',
      'hairskin': 'hair-skin',
      'hair-skin': 'hair-skin',
      'hair': 'hair-skin',
      'skin': 'hair-skin',
      'hair-&-skin': 'hair-skin',
      'sexualhealth': 'sexual-health',
      'sexual-health': 'sexual-health',
      'sexual': 'sexual-health',
      'ed': 'sexual-health',
      'menopause': 'menopause',
      'hormone': 'menopause',
      'hormone-health': 'menopause',
      'sleep': 'sleep-issue',
      'sleep-issue': 'sleep-issue',
      'sleepissue': 'sleep-issue',
      'sleep-wellness': 'sleep-issue',
      'wellness': 'sleep-issue',
      'longevity': 'longevity',
      'all': 'all'
    };
    if (aliasMap[target]) {
      target = aliasMap[target];
    }

    const matchingTab = document.querySelector(`.ap-category-tab[data-category="${target}"]`);
    if (matchingTab) {
      catTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      matchingTab.classList.add('active');
      matchingTab.setAttribute('aria-selected', 'true');
      currentCat = target;
      currentPage = 1;
      applyFilterAndSort();

      // Update URL query parameter cleanly without page reload
      try {
        const url = new URL(window.location.href);
        if (currentCat === 'all') {
          url.searchParams.delete('category');
          url.searchParams.delete('cat');
        } else {
          url.searchParams.set('category', currentCat);
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}

      if (shouldScroll) {
        setTimeout(() => {
          const targetSection = document.getElementById('apProductsGrid') || document.getElementById('apProductsContainer');
          if (targetSection) {
            const rect = targetSection.getBoundingClientRect();
            const offset = window.pageYOffset + rect.top - 80;
            window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
          }
        }, 120);
      }
    }
  }

  function checkUrlCategory(shouldScroll) {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCat = params.get('category') || params.get('cat');
      if (urlCat) {
        selectCategory(urlCat, shouldScroll);
        return true;
      }
      if (window.location.hash) {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash && hash !== 'approductsgrid' && hash !== 'approductscontainer') {
          selectCategory(hash, shouldScroll);
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  /* ═══════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════ */
  function init() {
    // Collect all product cards once
    allCards = Array.from(document.querySelectorAll('.ap-grid-card'));

    // Store original DOM order index for "featured" sort
    allCards.forEach((card, i) => {
      card.dataset.origIndex = i;
    });

    // Check for category in URL (?category=... or #...)
    const hasUrlCategory = checkUrlCategory(true);
    if (!hasUrlCategory) {
      // Initial render with all products
      applyFilterAndSort();
    }

    // Category tab listeners
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        selectCategory(tab.dataset.category, false);
      });
    });

    // In-page category links (e.g. from navbar / footer if on this page)
    document.querySelectorAll('a[href*="category="], a[href*="cat="]').forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          const href = link.getAttribute('href');
          const url = new URL(href, window.location.origin);
          const cat = url.searchParams.get('category') || url.searchParams.get('cat');
          if (cat) {
            e.preventDefault();
            selectCategory(cat, true);
          }
        } catch (err) {}
      });
    });

    // Popstate: handle browser back/forward history buttons
    window.addEventListener('popstate', () => {
      checkUrlCategory(false);
    });

    // Sort listener
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        currentPage = 1;
        applyFilterAndSort();
      });
    }

    // Pagination buttons
    if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // Empty state reset
    if (emptyReset) {
      emptyReset.addEventListener('click', () => {
        catTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        const allTab = document.querySelector('[data-category="all"]');
        if (allTab) {
          allTab.classList.add('active');
          allTab.setAttribute('aria-selected', 'true');
        }
        currentCat  = 'all';
        currentPage = 1;
        applyFilterAndSort();
      });
    }

    // Sticky header + back-to-top
    window.addEventListener('scroll', onScroll, { passive: true });
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Smooth scroll for in-page anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Lenis smooth scroll (if available)
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      });
      if (typeof gsap !== 'undefined') {
        gsap.ticker.add(time => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function lenisRaf(time) {
          lenis.raf(time);
          requestAnimationFrame(lenisRaf);
        }
        requestAnimationFrame(lenisRaf);
      }
      window.lenis = lenis;
    }

    // Initialize Testimonials, FAQ Accordion, and Section Heading Animations
    initCustomerTestimonials();
    initFaqAccordion();
    initHeadingAnimations();
  }

  /* ═══════════════════════════════════════════════════════
     FILTER + SORT
  ═══════════════════════════════════════════════════════ */
  function applyFilterAndSort() {
    // 1. Filter
    let filtered = allCards.filter(card => {
      return currentCat === 'all' || card.dataset.category === currentCat;
    });

    // 2. Sort
    switch (currentSort) {
      case 'name-asc':
        filtered = filtered.slice().sort((a, b) =>
          a.dataset.name.localeCompare(b.dataset.name));
        break;
      case 'name-desc':
        filtered = filtered.slice().sort((a, b) =>
          b.dataset.name.localeCompare(a.dataset.name));
        break;
      case 'price-asc':
        filtered = filtered.slice().sort((a, b) =>
          parseInt(a.dataset.price, 10) - parseInt(b.dataset.price, 10));
        break;
      case 'featured':
      default:
        filtered = filtered.slice().sort((a, b) =>
          parseInt(a.dataset.origIndex, 10) - parseInt(b.dataset.origIndex, 10));
        break;
    }

    visibleCards = filtered;
    currentPage  = Math.min(currentPage, Math.max(1, Math.ceil(visibleCards.length / CARDS_PER_PAGE)));

    renderPage();
    renderPagination();
    updateCounts();
  }

  /* ═══════════════════════════════════════════════════════
     RENDER CURRENT PAGE
  ═══════════════════════════════════════════════════════ */
  function renderPage() {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end   = start + CARDS_PER_PAGE;
    const pageCards = visibleCards.slice(start, end);

    // Hide all cards first
    allCards.forEach(card => {
      card.style.display = 'none';
      card.style.animationName = 'none'; // reset animation
    });

    // Show only current page cards with staggered animation
    pageCards.forEach((card, i) => {
      card.style.display = '';
      // Force reflow to restart CSS animation
      void card.offsetWidth;
      card.style.animationName = '';
      card.style.animationDelay = `${i * 0.06}s`;
    });

    // Show / hide empty state
    const hasCards = pageCards.length > 0;
    if (emptyState) emptyState.style.display = hasCards ? 'none' : 'flex';
    if (pagination) pagination.style.display = (hasCards && visibleCards.length > CARDS_PER_PAGE) ? 'flex' : (hasCards ? 'flex' : 'none');

    // Refresh ScrollTrigger positions if height changed
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  /* ═══════════════════════════════════════════════════════
     PAGINATION RENDER
  ═══════════════════════════════════════════════════════ */
  function renderPagination() {
    if (!pageNumbers) return;

    const totalPages = Math.max(1, Math.ceil(visibleCards.length / CARDS_PER_PAGE));

    // Update prev / next
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    // Build page number buttons
    pageNumbers.innerHTML = '';
    const pagesToShow = buildPageRange(currentPage, totalPages);

    pagesToShow.forEach(item => {
      if (item === '…') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ap-page-ellipsis';
        ellipsis.textContent = '…';
        ellipsis.setAttribute('aria-hidden', 'true');
        pageNumbers.appendChild(ellipsis);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ap-page-btn' + (item === currentPage ? ' active' : '');
        btn.textContent = item;
        btn.setAttribute('aria-label', `Page ${item}`);
        if (item === currentPage) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', () => goToPage(item));
        pageNumbers.appendChild(btn);
      }
    });

    // Page info
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  /* Build smart page range with ellipsis */
  function buildPageRange(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('…');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('…');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('…');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('…');
      pages.push(total);
    }
    return pages;
  }

  /* ═══════════════════════════════════════════════════════
     GO TO PAGE
  ═══════════════════════════════════════════════════════ */
  function goToPage(page) {
    const totalPages = Math.ceil(visibleCards.length / CARDS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPage();
    renderPagination();
    updateCounts();

    // Smooth scroll to grid top
    const gridEl = document.getElementById('apProductsGrid');
    if (gridEl) {
      const offset = gridEl.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  /* ═══════════════════════════════════════════════════════
     UPDATE COUNTS
  ═══════════════════════════════════════════════════════ */
  function updateCounts() {
    if (!showingCount || !totalCount) return;
    const start   = Math.min((currentPage - 1) * CARDS_PER_PAGE + 1, visibleCards.length);
    const end     = Math.min(currentPage * CARDS_PER_PAGE, visibleCards.length);
    const showing = visibleCards.length === 0 ? 0 : `${start}–${end}`;
    showingCount.textContent = showing;
    totalCount.textContent   = visibleCards.length;
  }

  /* ═══════════════════════════════════════════════════════
     SCROLL HANDLER (sticky header + back-to-top)
  ═══════════════════════════════════════════════════════ */
  function onScroll() {
    const scrollY = window.scrollY;

    // Sticky header
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 50);
    }

    // Back to top button visibility
    if (backToTopBtn) {
      backToTopBtn.style.opacity = scrollY > 300 ? '1' : '0';
      backToTopBtn.style.pointerEvents = scrollY > 300 ? 'auto' : 'none';
    }
  }

  /* ═══════════════════════════════════════════════════════
     CUSTOMER TESTIMONIALS SLIDER
  ═══════════════════════════════════════════════════════ */
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
    const clonesBefore = originalCards.map((c) => {
      const clone = c.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    const clonesAfter = originalCards.map((c) => {
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
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 40);

    // IntersectionObserver: Only auto-rotate when section is visible in viewport!
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

  /* ═══════════════════════════════════════════════════════
     FAQ ACCORDION INTERACTIVITY
  ═══════════════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════════════
     SECTION HEADING BLUR ANIMATION
  ═══════════════════════════════════════════════════════ */
  function initHeadingAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const headings = document.querySelectorAll(
      '.customer-testimonial-section .section-blur-heading, .faq-section .section-blur-heading'
    );
    headings.forEach(heading => {
      const section = heading.closest('section') || heading;
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
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  /* ═══════════════════════════════════════════════════════
     KICKOFF
  ═══════════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

