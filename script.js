/**
 * Nishad Portfolio - Interactive Engine
 * Supporting Canva-style Editorial Deck Presentation & Web View
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Vector Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State Management
  let isDeckMode = false;
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll('.editorial-slide');
  const totalSlides = slides.length;

  const deckController = document.getElementById('deck-controller');
  const deckIndicator = document.getElementById('deck-indicator');
  const deckPrevBtn = document.getElementById('deck-prev-btn');
  const deckNextBtn = document.getElementById('deck-next-btn');
  const deckExitBtn = document.getElementById('deck-exit-btn');
  const toggleDeckBtn = document.getElementById('toggle-deck-mode');
  const mobileToggleDeck = document.getElementById('mobile-toggle-deck');
  const deckBtnText = document.getElementById('deck-btn-text');

  // =========================================================================
  // PRESENTATION DECK MODE
  // =========================================================================
  function setDeckMode(enable) {
    isDeckMode = enable;
    if (enable) {
      document.body.classList.add('presentation-mode');
      deckController.style.display = 'flex';
      if (deckBtnText) deckBtnText.textContent = 'Web View';
      showSlide(currentSlideIndex);
      showToast('Entered Slide Presentation Mode. Use â† and â†’ to navigate.');
    } else {
      document.body.classList.remove('presentation-mode');
      deckController.style.display = 'none';
      if (deckBtnText) deckBtnText.textContent = 'Deck Mode';
      slides.forEach(slide => {
        slide.classList.remove('active-slide');
      });
      // Scroll to the active slide in web view
      slides[currentSlideIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentSlideIndex = index;

    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active-slide');
        slide.scrollTop = 0;

        // Trigger heading kinetic animation in the newly active slide
        const h = slide.querySelector('.slide-heading, .outro-heading, .hero-font-heading');
        if (h) {
          h.classList.remove('heading-revealed');
          void h.offsetWidth; // Force DOM reflow
          h.classList.add('heading-revealed');
        }
      } else {
        slide.classList.remove('active-slide');
      }
    });

    if (deckIndicator) {
      deckIndicator.textContent = `Slide ${currentSlideIndex + 1} / ${totalSlides}`;
    }

    if (deckPrevBtn) deckPrevBtn.disabled = currentSlideIndex === 0;
    if (deckNextBtn) deckNextBtn.disabled = currentSlideIndex === totalSlides - 1;
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      showSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      showSlide(currentSlideIndex - 1);
    }
  }

  if (toggleDeckBtn) {
    toggleDeckBtn.addEventListener('click', () => setDeckMode(!isDeckMode));
  }
  if (mobileToggleDeck) {
    mobileToggleDeck.addEventListener('click', () => {
      setDeckMode(!isDeckMode);
      document.getElementById('mobile-menu').classList.add('hidden');
    });
  }
  if (deckNextBtn) deckNextBtn.addEventListener('click', nextSlide);
  if (deckPrevBtn) deckPrevBtn.addEventListener('click', prevSlide);
  if (deckExitBtn) deckExitBtn.addEventListener('click', () => setDeckMode(false));

  const heroQuickDeckBtn = document.getElementById('hero-quick-deck-btn');
  if (heroQuickDeckBtn) {
    heroQuickDeckBtn.addEventListener('click', () => {
      setDeckMode(!isDeckMode);
    });
  }

  // Hero Directory Links - Smooth Navigation & Deck Mode Support
  document.querySelectorAll('.hero-dir-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (isDeckMode) {
        e.preventDefault();
        const targetIndex = parseInt(link.getAttribute('data-target-slide'), 10);
        if (!isNaN(targetIndex)) {
          showSlide(targetIndex);
        }
      }
    });
  });

  // Keyboard Navigation for Deck Mode
  document.addEventListener('keydown', (e) => {
    if (isDeckMode) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setDeckMode(false);
      }
    } else {
      if (e.key === 'Escape') {
        closeProjectModal();
        closeFullscreenPhoto();
        closeNavDrawer();
      }
    }
  });

  // =========================================================================
  // DARK / LIGHT THEME TOGGLE
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('nishad-portfolio-theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('nishad-portfolio-theme', isDark ? 'dark' : 'light');
      showToast(isDark ? 'Obsidian Night Mode activated' : 'Editorial Light Mode activated');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // =========================================================================
  // EDITORIAL FULL NAVIGATION DRAWER & STICKY HEADER
  // =========================================================================
  const editorialNavDrawer = document.getElementById('editorial-nav-drawer');
  const heroMenuBtn = document.getElementById('hero-menu-btn');
  const navbarMenuBtn = document.getElementById('navbar-menu-btn');
  const closeNavDrawerBtn = document.getElementById('close-nav-drawer-btn');
  const drawerToggleDeck = document.getElementById('drawer-toggle-deck');
  const stickyHeader = document.querySelector('header.sticky-header');

  function openNavDrawer() {
    if (editorialNavDrawer) {
      editorialNavDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function closeNavDrawer() {
    if (editorialNavDrawer) {
      editorialNavDrawer.classList.remove('active');
      document.body.style.overflow = isDeckMode ? 'hidden' : 'auto';
    }
  }

  if (heroMenuBtn) {
    heroMenuBtn.addEventListener('click', openNavDrawer);
  }
  if (navbarMenuBtn) {
    navbarMenuBtn.addEventListener('click', openNavDrawer);
  }
  if (closeNavDrawerBtn) {
    closeNavDrawerBtn.addEventListener('click', closeNavDrawer);
  }

  document.querySelectorAll('.drawer-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      closeNavDrawer();
    });
  });

  if (drawerToggleDeck) {
    drawerToggleDeck.addEventListener('click', () => {
      closeNavDrawer();
      setDeckMode(!isDeckMode);
    });
  }

  // Sticky Header Scroll Detection
  function handleHeaderScroll() {
    if (!stickyHeader || isDeckMode) return;
    if (window.scrollY > 120) {
      stickyHeader.classList.add('scrolled');
    } else {
      stickyHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================================
  // INSTAGRAM MOCKUP INTERACTIVITY
  // =========================================================================
  const likeBtn = document.getElementById('hero-like-btn');
  const likesCountSpan = document.getElementById('hero-likes-count');
  const saveBtn = document.getElementById('hero-save-btn');
  let isLiked = false;
  let likeCount = 1842;

  if (likeBtn && likesCountSpan) {
    likeBtn.addEventListener('click', () => {
      isLiked = !isLiked;
      likeBtn.classList.toggle('liked', isLiked);
      likeCount = isLiked ? likeCount + 1 : likeCount - 1;
      likesCountSpan.textContent = likeCount.toLocaleString();
      showToast(isLiked ? 'Liked @vavachan_ai portrait!' : 'Unliked');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveBtn.classList.toggle('text-[#445133]');
      saveBtn.classList.toggle('text-amber-500');
      showToast('Saved reel mockup to collection!');
    });
  }

  // =========================================================================
  // SERVICES CATEGORY FILTER
  // =========================================================================
  const serviceFilters = document.querySelectorAll('#services [data-filter]');
  const serviceCards = document.querySelectorAll('.service-item');

  serviceFilters.forEach(button => {
    button.addEventListener('click', () => {
      serviceFilters.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open inquiry button on each service card
  document.querySelectorAll('.open-inquiry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('client-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Selected "${serviceName}" in contact form`);
    });
  });

  // =========================================================================
  // PROJECTS FILTER
  // =========================================================================
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach(button => {
    button.addEventListener('click', () => {
      projectFilters.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // CASE STUDY MODAL DATA & HANDLERS
  // =========================================================================
  const projectData = {
    'tom-jerry': {
      title: 'TOM â€” AI Cinematic Chase',
      category: 'AI ANIMATION REEL',
      image: 'assets/projects/tom-jerry.svg',
      video: 'assets/projects/tom.mp4',
      externalUrl: 'https://www.instagram.com/reel/De_Di-mJ6C7/?vrfl=MWlrdjFzcnlmMDlqcw==',
      tools: 'Kling, Nano Banana, CapCut, Audition',
      role: 'Prompt Engineer, AI Director, Video Editor',
      impact: '2M+ Views â€¢ 240K Likes',
      desc: 'A complete generative AI reimagining of the iconic Tom & Jerry cartoon rivalry. Generated dynamic cinematic angles, high-speed chase physics, slapstick comedic timing, and photorealistic texture integration using Kling AI and Nano Banana.',
      pipeline: '1. Scripting comedic beat points with ChatGPT. 2. Text-to-image concept generation for character consistency. 3. Image-to-video motion prompting in Kling with camera orbit and speed parameters. 4. Multi-track Foley audio and soundtrack synchronization in CapCut.'
    },
    'shareef-work': {
      title: 'DALLA & LUQMA â€” Commercial Brand Campaign',
      category: 'BRAND CAMPAIGN & ADS',
      image: 'assets/projects/shareef-work.svg',
      tools: 'CapCut, Lightroom, Meta Ads Manager, Canva',
      role: 'Commercial Editor, Meta Ads Strategist',
      impact: '5.8x ROAS â€¢ +340% Reach',
      desc: 'Comprehensive visual elevation for Dalla & Luqma. Crafted dynamic, high-engagement video creatives designed specifically for Instagram Reels and Facebook Ads with punchy 3-second visual hooks that stop user scrolling.',
      pipeline: '1. Brand identity analysis and audience demographic study. 2. Storyboarding commercial cuts and scripting call-to-actions. 3. Precise color grading in Adobe Lightroom. 4. Creative A/B testing on Meta Ads leading to a 5.8x Return on Ad Spend.'
    },
    'cartoons': {
      title: 'CARTOON â€” Original AI Character IP',
      category: 'ORIGINAL IP & STORYTELLING',
      image: 'assets/projects/cartoons.svg',
      video: 'assets/projects/cartoon.mp4',
      externalUrl: 'https://www.instagram.com/reel/De57nBcJzfc/?cplk=MXZ6OTVqMzc3M2g3bw==',
      tools: 'Flow, Seedance, ChatGPT, CapCut',
      role: 'Creative Storyteller, Character Designer',
      impact: 'Original Episodic Series',
      desc: 'Developing a proprietary cartoon universe with bespoke characters, whimsical dialogues, and rich atmospheric scene rendering. Each episode explores comedic modern tech dilemmas through animated fantasy protagonists.',
      pipeline: '1. Character concept design and model sheets. 2. Narrative arcs, witty dialogues, and pacing crafted with Claude & ChatGPT. 3. Motion synthesis using Flow and Seedance. 4. Voice cloning, kinetic subtitle styling, and episodic delivery.'
    },
    'perfume': {
      title: 'PERFUME â€” Luxury Product Visualization',
      category: 'LUXURY PRODUCT AD',
      image: 'assets/projects/perfume.svg',
      tools: 'OminiFlash, Kling, Lightroom, Canva',
      role: 'AI Product Specialist, Cinematic Editor',
      impact: 'High-Conversion Creative',
      desc: 'A high-end fragrance commercial spot designed for luxury aesthetics. Simulates photorealistic mist, liquid refraction, ambient golden lighting, and elegant slow-motion flacon rotation that communicates luxury without expensive physical film shoots.',
      pipeline: '1. High-fidelity glass and liquid lighting prompts. 2. Slow-motion cinematic pan in Kling AI. 3. Color enhancement, golden tone curves, and grain polish in Lightroom. 4. Elegant typography overlay and sound design.'
    }
  };

  window.openProjectModal = function(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-image').src = data.image;
    document.getElementById('modal-image').alt = data.title;
    document.getElementById('modal-tools').textContent = data.tools;
    document.getElementById('modal-role').textContent = data.role;
    document.getElementById('modal-impact').textContent = data.impact;
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-pipeline').textContent = data.pipeline;

    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const modalLinkRow = document.getElementById('modal-link-row');
    const modalReelLink = document.getElementById('modal-reel-link');

    if (modalVideo && modalImage) {
      if (data.video) {
        modalVideo.src = data.video;
        modalVideo.classList.remove('hidden');
        modalImage.classList.add('hidden');
        modalVideo.play().catch(() => {});
      } else {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.classList.add('hidden');
        modalImage.classList.remove('hidden');
      }
    }

    if (modalLinkRow && modalReelLink) {
      if (data.externalUrl) {
        modalReelLink.href = data.externalUrl;
        modalLinkRow.classList.remove('hidden');
      } else {
        modalLinkRow.classList.add('hidden');
      }
    }

    const modal = document.getElementById('case-study-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  };

  window.closeProjectModal = function() {
    const modal = document.getElementById('case-study-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = isDeckMode ? 'hidden' : 'auto';

      const modalVideo = document.getElementById('modal-video');
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
      }
    }
  };

  // Fullscreen Photo Modal Functions
  window.openFullscreenPhoto = function() {
    const modal = document.getElementById('fullscreen-photo-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  window.closeFullscreenPhoto = function() {
    const modal = document.getElementById('fullscreen-photo-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = isDeckMode ? 'hidden' : 'auto';
    }
  };

  // Close modal when clicking outside dialog
  const modalBackdrop = document.getElementById('case-study-modal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // =========================================================================
  // INTERACTIVE INQUIRY FORM (DIRECT WHATSAPP BUILDER)
  // =========================================================================
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const brand = document.getElementById('client-brand').value.trim();
      const service = document.getElementById('client-service').value;
      const message = document.getElementById('client-message').value.trim();

      const textMessage = `Hello Nishad! ðŸ‘‹%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        (brand ? `*Brand/Company:* ${encodeURIComponent(brand)}%0A` : '') +
        `*Service Needed:* ${encodeURIComponent(service)}%0A` +
        `*Project Overview:* ${encodeURIComponent(message)}%0A%0A` +
        `Excited to explore working together!`;

      const whatsappUrl = `https://wa.me/919744507617?text=${textMessage}`;
      window.open(whatsappUrl, '_blank');
      showToast('Opening WhatsApp with your project inquiry...');
    });
  }

  // =========================================================================
  // 1-CLICK COPY BUTTONS
  // =========================================================================
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast(`Value: ${textToCopy}`);
        });
      }
    });
  });

  // =========================================================================
  // TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // =========================================================================
  // MAIN HEADINGS SCROLL REVEAL ANIMATIONS
  // =========================================================================
  function initHeadingAnimations() {
    const slideHeadings = document.querySelectorAll('.slide-heading');
    const outroHeading = document.querySelector('.outro-heading');
    const outroFrame = document.querySelector('.outro-photo-frame');

    // Prepare slide headings for dynamic reveal
    slideHeadings.forEach(h => {
      h.classList.add('heading-ready');
    });

    if (outroHeading) {
      outroHeading.classList.add('heading-ready');
    }
    if (outroFrame) {
      outroFrame.classList.add('frame-ready');
    }

    // IntersectionObserver to reveal headings when scrolling into view
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.15
    };

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-revealed');
          entry.target.classList.add('frame-revealed');
        }
      });
    }, observerOptions);

    slideHeadings.forEach(h => headingObserver.observe(h));
    if (outroHeading) headingObserver.observe(outroHeading);
    if (outroFrame) headingObserver.observe(outroFrame);
  }

  initHeadingAnimations();
});
