/**
 * Web Presentations - Modern Engine (Vanilla JS)
 * Handles auto-scaling, keyboard/touch navigation, fragments, fullscreen, and slide sorter.
 */

class WebPresentationEngine {
  constructor() {
    this.deck = document.getElementById('deck');
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.progressBar = document.getElementById('progress-bar');
    this.counterBadge = document.getElementById('slide-counter-badge');
    this.slideSorter = document.getElementById('slide-sorter');
    this.notesDrawer = document.getElementById('speaker-notes-drawer');
    this.notesContent = document.getElementById('notes-content');
    this.helpModal = document.getElementById('help-modal');

    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isSorterOpen = false;
    this.isNotesOpen = false;
    this.isHelpOpen = false;

    // Theme state (dark / light)
    this.theme = localStorage.getItem('presentation_theme') || 'dark';

    if (!this.deck || this.slides.length === 0) {
      console.warn('WebPresentationEngine: No deck or slides found.');
      return;
    }

    this.init();
  }

  init() {
    // 1. Initial responsive scaling & theme
    this.updateScale();
    this.applyTheme(this.theme);
    window.addEventListener('resize', () => this.updateScale());

    // 2. Hash routing check
    const initialSlide = this.getSlideFromHash();
    this.goToSlide(initialSlide, false);

    // 3. Event listeners
    this.setupKeyboard();
    this.setupTouch();
    this.setupUIControls();
    this.buildSlideSorter();

    console.log(`WebPresentationEngine initialized with ${this.slides.length} slides.`);
  }

  // --------------------------------------------------------------------------
  // Theme Toggle (Dark / Light Mode)
  // --------------------------------------------------------------------------
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('presentation_theme', theme);
    const btnTheme = document.getElementById('btn-theme');
    if (btnTheme) {
      btnTheme.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btnTheme.title = theme === 'dark' ? 'Cambiar a Modo Claro (T)' : 'Cambiar a Modo Oscuro (T)';
    }
  }

  // --------------------------------------------------------------------------
  // Responsive Auto-Scaling (16:9 Canvas fit to window)
  // --------------------------------------------------------------------------
  updateScale() {
    const baseWidth = 1920;
    const baseHeight = 1080;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // Use full fit or subtle padding
    const isFullscreen = !!document.fullscreenElement;
    const paddingFactor = isFullscreen ? 1.0 : 0.98;

    const scaleX = (winWidth * paddingFactor) / baseWidth;
    const scaleY = (winHeight * paddingFactor) / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    document.documentElement.style.setProperty('--slide-scale', scale.toFixed(4));
  }

  // --------------------------------------------------------------------------
  // Slide & Fragment Navigation
  // --------------------------------------------------------------------------
  goToSlide(index, updateHash = true) {
    if (index < 0) index = 0;
    if (index >= this.slides.length) index = this.slides.length - 1;

    this.currentIndex = index;

    this.slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'past', 'future');
      if (idx < index) {
        slide.classList.add('past');
        // All fragments in past slides should be visible
        slide.querySelectorAll('.fragment').forEach(f => f.classList.add('visible'));
      } else if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.add('future');
        // Fragments in future slides should be hidden
        slide.querySelectorAll('.fragment').forEach(f => f.classList.remove('visible'));
      }
    });

    this.updateChrome();

    if (updateHash) {
      history.replaceState(null, '', `#${index + 1}`);
    }
  }

  next() {
    if (this.isSorterOpen || this.isHelpOpen) return;

    const currentSlide = this.slides[this.currentIndex];
    const unrevealedFragments = Array.from(currentSlide.querySelectorAll('.fragment:not(.visible)'));

    // If there are unrevealed fragments, reveal the next one first
    if (unrevealedFragments.length > 0) {
      // Find lowest step index among unrevealed
      unrevealedFragments[0].classList.add('visible');
      return;
    }

    // Otherwise, advance to next slide
    if (this.currentIndex < this.slides.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.isSorterOpen || this.isHelpOpen) return;

    const currentSlide = this.slides[this.currentIndex];
    const revealedFragments = Array.from(currentSlide.querySelectorAll('.fragment.visible'));

    // If fragments were revealed on this slide, hide the last one first
    if (revealedFragments.length > 0) {
      revealedFragments[revealedFragments.length - 1].classList.remove('visible');
      return;
    }

    // Otherwise, move to previous slide
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  first() {
    this.goToSlide(0);
  }

  last() {
    this.goToSlide(this.slides.length - 1);
  }

  // --------------------------------------------------------------------------
  // UI & Chrome Updates
  // --------------------------------------------------------------------------
  updateChrome() {
    // 1. Progress Bar
    if (this.progressBar) {
      const percentage = this.slides.length > 1
        ? (this.currentIndex / (this.slides.length - 1)) * 100
        : 100;
      this.progressBar.style.width = `${percentage}%`;
    }

    // 2. Counter Badge
    if (this.counterBadge) {
      const cur = String(this.currentIndex + 1).padStart(2, '0');
      const total = String(this.slides.length).padStart(2, '0');
      this.counterBadge.textContent = `${cur} / ${total}`;
    }

    // 3. Update Speaker Notes
    if (this.notesContent) {
      const currentSlide = this.slides[this.currentIndex];
      const noteEl = currentSlide.querySelector('.speaker-notes');
      this.notesContent.innerHTML = noteEl
        ? noteEl.innerHTML
        : '<p style="color: #64748b; font-style: italic;">No hay notas del presentador para esta diapositiva.</p>';
    }

    // 4. Update Slide Sorter active indicator
    if (this.slideSorter) {
      const sorterItems = this.slideSorter.querySelectorAll('.sorter-item');
      sorterItems.forEach((item, idx) => {
        if (idx === this.currentIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Modals & Panels (Fullscreen, Sorter, Notes, Help)
  // --------------------------------------------------------------------------
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleSorter() {
    this.isSorterOpen = !this.isSorterOpen;
    if (this.slideSorter) {
      this.slideSorter.classList.toggle('open', this.isSorterOpen);
      if (this.isSorterOpen) {
        const activeSorterItem = this.slideSorter.querySelector(`.sorter-item:nth-child(${this.currentIndex + 1})`);
        if (activeSorterItem) {
          activeSorterItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }

  toggleNotes() {
    this.isNotesOpen = !this.isNotesOpen;
    if (this.notesDrawer) {
      this.notesDrawer.classList.toggle('open', this.isNotesOpen);
    }
  }

  toggleHelp() {
    this.isHelpOpen = !this.isHelpOpen;
    if (this.helpModal) {
      this.helpModal.classList.toggle('open', this.isHelpOpen);
    }
  }

  closeAllModals() {
    if (this.isSorterOpen) this.toggleSorter();
    if (this.isHelpOpen) this.toggleHelp();
  }

  // --------------------------------------------------------------------------
  // Sorter Builder
  // --------------------------------------------------------------------------
  buildSlideSorter() {
    if (!this.slideSorter) return;
    const grid = this.slideSorter.querySelector('.sorter-grid');
    if (!grid) return;

    grid.innerHTML = '';
    this.slides.forEach((slide, idx) => {
      const item = document.createElement('div');
      item.className = 'sorter-item';
      if (idx === this.currentIndex) item.classList.add('active');

      const titleEl = slide.querySelector('h1, h2, h3');
      const title = titleEl ? titleEl.textContent.trim() : `Diapositiva ${idx + 1}`;

      item.innerHTML = `
        <div class="sorter-badge">SLIDE ${String(idx + 1).padStart(2, '0')}</div>
        <div class="sorter-title">${title}</div>
      `;

      item.addEventListener('click', () => {
        this.goToSlide(idx);
        this.toggleSorter();
      });

      grid.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // Event Listeners (Keyboard, Touch, Buttons)
  // --------------------------------------------------------------------------
  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Escape closes open overlays
      if (e.key === 'Escape') {
        if (this.isSorterOpen || this.isHelpOpen || this.isNotesOpen) {
          if (this.isSorterOpen) this.toggleSorter();
          if (this.isHelpOpen) this.toggleHelp();
          if (this.isNotesOpen) this.toggleNotes();
          return;
        }
      }

      // Next actions
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        this.next();
      }
      // Prev actions
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        this.prev();
      }
      // First / Last
      else if (e.key === 'Home') {
        e.preventDefault();
        this.first();
      } else if (e.key === 'End') {
        e.preventDefault();
        this.last();
      }
      // Toggle Fullscreen ('F')
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.toggleFullscreen();
      }
      // Toggle Theme ('T')
      else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
      // Toggle Sorter ('O')
      else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        this.toggleSorter();
      }
      // Toggle Speaker Notes ('N')
      else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        this.toggleNotes();
      }
      // Toggle Help ('?' or '/')
      else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        this.toggleHelp();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      this.updateScale();
    });
  }

  setupTouch() {
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - this.touchStartX;
        const diffY = e.changedTouches[0].clientY - this.touchStartY;

        // Ensure horizontal swipe is dominant and exceeds threshold
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            this.next();
          } else {
            this.prev();
          }
        }
      }
    }, { passive: true });
  }

  setupUIControls() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnTheme = document.getElementById('btn-theme');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnSorter = document.getElementById('btn-sorter');
    const btnNotes = document.getElementById('btn-notes');
    const btnHelp = document.getElementById('btn-help');

    if (btnPrev) btnPrev.addEventListener('click', () => this.prev());
    if (btnNext) btnNext.addEventListener('click', () => this.next());
    if (btnTheme) btnTheme.addEventListener('click', () => this.toggleTheme());
    if (btnFullscreen) btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    if (btnSorter) btnSorter.addEventListener('click', () => this.toggleSorter());
    if (btnNotes) btnNotes.addEventListener('click', () => this.toggleNotes());
    if (btnHelp) btnHelp.addEventListener('click', () => this.toggleHelp());

    const closeSorterBtn = document.getElementById('btn-close-sorter');
    if (closeSorterBtn) closeSorterBtn.addEventListener('click', () => this.toggleSorter());

    const closeNotesBtn = document.getElementById('btn-close-notes');
    if (closeNotesBtn) closeNotesBtn.addEventListener('click', () => this.toggleNotes());

    const closeHelpBtn = document.getElementById('btn-close-help');
    if (closeHelpBtn) closeHelpBtn.addEventListener('click', () => this.toggleHelp());

    // Click outside help card to close
    if (this.helpModal) {
      this.helpModal.addEventListener('click', (e) => {
        if (e.target === this.helpModal) this.toggleHelp();
      });
    }
  }

  getSlideFromHash() {
    const hash = window.location.hash.replace('#', '');
    const num = parseInt(hash, 10);
    if (!isNaN(num) && num >= 1 && num <= this.slides.length) {
      return num - 1;
    }
    return 0;
  }
}

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.presentation = new WebPresentationEngine();
});
