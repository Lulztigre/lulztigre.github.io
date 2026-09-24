/**
 * lulztigre.pw — Clean, dependency-free interactive research tooling
 */

(function () {
  'use strict';

  // --- 1. THEME TOGGLE & PERSISTENCE ---
  const THEME_KEY = 'phantom_kernel_theme';
  const themes = ['void', 'amber', 'ghost', 'bloodmoon', 'arctic', 'synthwave', 'phosphor', 'solar', 'hazard', 'cobalt'];
  
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'void';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    if (theme === 'void') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtonLabel(theme);
  }

  function cycleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'void';
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    applyTheme(nextTheme);
    showToast(`THEME: [${nextTheme.toUpperCase()}]`);
  }

  function updateThemeButtonLabel(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icons = {
      void: '● PHANTOM',
      amber: '▲ AMBER',
      ghost: '○ GHOST',
      bloodmoon: '◆ BLOODMOON',
      arctic: '◇ ARCTIC',
      synthwave: '♦ SYNTHWAVE',
      phosphor: '█ PHOSPHOR',
      solar: '☀ SOLAR',
      hazard: '⚠ HAZARD',
      cobalt: '◈ COBALT'
    };
    btn.innerHTML = `<span>${icons[theme] || '◐ THEME'}</span>`;
  }

  function pickRandomTheme(excludeTheme, silent) {
    const currentTheme = excludeTheme || localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'void';
    let pool = themes.filter(t => t !== currentTheme);
    if (pool.length === 0) pool = themes;
    const nextTheme = pool[Math.floor(Math.random() * pool.length)] || 'void';
    applyTheme(nextTheme);
    if (!silent) {
      showToast(`THEME: [${nextTheme.toUpperCase()}]`);
    }
    return nextTheme;
  }
  window.pickRandomTheme = pickRandomTheme;

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      pickRandomTheme();
    }
  });

  // --- 2. READING PROGRESS BAR ---
  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrolled = (window.scrollY / docHeight) * 100;
      bar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }, { passive: true });
  }

  // --- 3. LIVE SEARCH & FILTERING (INDEX PAGE) ---
  function initSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const postCards = document.querySelectorAll('.post-card');
    const postCountEl = document.getElementById('filtered-count');
    const emptyState = document.getElementById('empty-state');

    if (!postCards.length) return;

    let activeTag = 'ALL';
    let searchQuery = '';

    function filterPosts() {
      let visibleCount = 0;

      postCards.forEach(card => {
        const title = (card.querySelector('.post-card-title')?.textContent || '').toLowerCase();
        const abstract = (card.querySelector('.post-abstract')?.textContent || '').toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag-chip')).map(el => el.textContent.trim().toUpperCase());
        
        const matchesQuery = !searchQuery || title.includes(searchQuery) || abstract.includes(searchQuery);
        const matchesTag = activeTag === 'ALL' || tags.includes(activeTag);

        if (matchesQuery && matchesTag) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (postCountEl) {
        postCountEl.textContent = `[${visibleCount} RECORD${visibleCount === 1 ? '' : 'S'} FOUND]`;
      }

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterPosts();
      });
    }

    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTag = (btn.dataset.tag || btn.textContent).trim().toUpperCase();
        filterPosts();
      });
    });

    filterPosts();
  }

  // --- 4. TABLE OF CONTENTS SCROLLSPY & MOBILE TOC ---
  function initTableOfContents() {
    const tocCard = document.querySelector('.article-sidebar .toc-card');
    const prose = document.querySelector('.prose');

    // Create collapsible mobile TOC if on article page with tocCard
    if (tocCard && prose && !document.querySelector('.mobile-toc-wrapper')) {
      const tocList = tocCard.querySelector('.toc-list');
      if (tocList) {
        const mobileToc = document.createElement('div');
        mobileToc.className = 'mobile-toc-wrapper';
        mobileToc.innerHTML = `
          <button class="mobile-toc-toggle" type="button" aria-expanded="false">
            <span>// NAVIGATION INDEX</span>
            <span class="mobile-toc-icon">▼</span>
          </button>
          <div class="mobile-toc-dropdown">
            <ul class="toc-list">
              ${tocList.innerHTML}
            </ul>
          </div>
        `;

        const toggleBtn = mobileToc.querySelector('.mobile-toc-toggle');
        toggleBtn.addEventListener('click', () => {
          const isOpen = mobileToc.classList.toggle('open');
          toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        mobileToc.querySelectorAll('.toc-link').forEach(link => {
          link.addEventListener('click', () => {
            mobileToc.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
          });
        });

        // Insert after abstract callout or before first h2
        const abstractEl = document.getElementById('abstract') || prose.querySelector('.callout');
        if (abstractEl && abstractEl.nextElementSibling) {
          prose.insertBefore(mobileToc, abstractEl.nextElementSibling);
        } else {
          const firstH2 = prose.querySelector('h2');
          if (firstH2) {
            prose.insertBefore(mobileToc, firstH2);
          } else {
            prose.prepend(mobileToc);
          }
        }
      }
    }

    const tocLinks = document.querySelectorAll('.toc-link');
    if (!tocLinks.length) return;

    const sections = [];
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl && !sections.some(s => s.id === targetId)) {
          sections.push({ id: targetId, el: targetEl });
        }
      }
    });

    if (!sections.length) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      let currentId = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        if (sections[i].el.offsetTop <= scrollPos) {
          currentId = sections[i].id;
        }
      }

      tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }, { passive: true });
  }

  // --- 5. CODE BLOCK COPY BUTTONS ---
  function initCodeCopy() {
    const preBlocks = document.querySelectorAll('.prose pre');
    preBlocks.forEach((pre) => {
      if (pre.previousElementSibling && pre.previousElementSibling.classList.contains('code-header')) {
        return;
      }
      
      const code = pre.querySelector('code');
      const lang = pre.getAttribute('data-lang') || 'CODE';

      const header = document.createElement('div');
      header.className = 'code-header';
      header.innerHTML = `
        <span>// ${lang.toUpperCase()}</span>
        <button class="copy-code-btn" type="button">COPY</button>
      `;

      pre.parentNode.insertBefore(header, pre);

      const copyBtn = header.querySelector('.copy-code-btn');
      copyBtn.addEventListener('click', async () => {
        const textToCopy = code ? code.innerText : pre.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          copyBtn.textContent = 'COPIED!';
          showToast('Code copied to clipboard');
          setTimeout(() => {
            copyBtn.textContent = 'COPY';
          }, 2000);
        } catch (err) {
          showToast('Failed to copy');
        }
      });
    });
  }

  // --- 6. BIBTEX MODAL & COPY ---
  window.openBibtexModal = function (btn) {
    const modal = document.getElementById('bibtex-modal');
    const modalCode = document.getElementById('modal-bibtex-content');
    if (!modal || !modalCode) return;

    const postCard = btn.closest('.post-card') || document.querySelector('article');
    const bibtexData = postCard ? postCard.getAttribute('data-bibtex') : '';

    if (bibtexData) {
      modalCode.textContent = bibtexData.trim();
    } else {
      modalCode.textContent = `@misc{phantom_dispatch,\n  author = {Lulztigre},\n  title = {Research Dispatch},\n  year = {2026},\n  url = {https://lulztigre.pw}\n}`;
    }

    modal.classList.add('open');
  };

  window.closeBibtexModal = function () {
    const modal = document.getElementById('bibtex-modal');
    if (modal) modal.classList.remove('open');
  };

  window.copyModalBibtex = async function () {
    const modalCode = document.getElementById('modal-bibtex-content');
    if (!modalCode) return;
    try {
      await navigator.clipboard.writeText(modalCode.textContent);
      showToast('BibTeX citation copied to clipboard');
      window.closeBibtexModal();
    } catch (err) {
      showToast('Failed to copy BibTeX');
    }
  };

  // --- 7. TOAST NOTIFICATIONS ---
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>▶</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 2400);
  }
  window.showToast = showToast;

  // --- 8. MOBILE NAVIGATION TOGGLE ---
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!toggleBtn || !navMenu) return;

    function closeNav() {
      navMenu.classList.remove('open');
      toggleBtn.textContent = '☰';
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      toggleBtn.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== toggleBtn) {
        closeNav();
      }
    });
  }

  // --- 9. BACK TO TOP BUTTON ---
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top-btn';
      btn.innerHTML = '<span>▲</span> <span>TOP</span>';
      btn.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // --- 10. KEYBOARD SHORTCUTS ---
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      if (e.key === 'Escape') {
        window.closeBibtexModal();
      }

      if ((e.key === 't' || e.key === 'T') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        cycleTheme();
      }
    });
  }

  // --- INITIALIZE ALL MODULES ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initReadingProgress();
    initSearchAndFilter();
    initTableOfContents();
    initCodeCopy();
    initMobileNav();
    initBackToTop();
    initKeyboardShortcuts();

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', cycleTheme);
    }

    const modal = document.getElementById('bibtex-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeBibtexModal();
      });
    }
  });
})();
