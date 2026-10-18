/**
 * lulztigre.pw — Clean, dependency-free interactive research tooling
 */

(function () {
  'use strict';

  // --- 1. THEME TOGGLE & PERSISTENCE ---
  const THEME_KEY = 'phantom_kernel_theme';
  const themes = ['phantom', 'floral', 'uchiha', 'arctic', 'phosphor', 'solar', 'cobalt', 'sakura', 'yua'];
  
  function initTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    let savedTheme = (urlTheme && themes.includes(urlTheme)) ? urlTheme : (localStorage.getItem(THEME_KEY) || 'floral');
    if (savedTheme === 'void') {
      savedTheme = 'phantom';
      localStorage.setItem(THEME_KEY, 'phantom');
    }
    if (savedTheme === 'blush') {
      savedTheme = 'yua';
      localStorage.setItem(THEME_KEY, 'yua');
    }
    if (savedTheme === 'ghost' || savedTheme === 'flora') {
      savedTheme = 'floral';
      localStorage.setItem(THEME_KEY, 'floral');
    }
    if (savedTheme === 'hazard' || savedTheme === 'synthwave' || savedTheme === 'amber') {
      savedTheme = 'phantom';
      localStorage.setItem(THEME_KEY, 'phantom');
    }
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'floral' || theme === 'flora' || theme === 'ghost') {
      document.documentElement.setAttribute('data-palette', 'sage');
    } else {
      document.documentElement.removeAttribute('data-palette');
    }
    if (theme === 'solar') {
      const savedMode = localStorage.getItem('solar_spectral_mode') || 'photosphere';
      if (typeof window.setSolarMode === 'function') {
        window.setSolarMode(savedMode);
      } else if (savedMode === 'euv' || savedMode === 'totality') {
        document.documentElement.setAttribute('data-solar-mode', savedMode);
      } else {
        document.documentElement.removeAttribute('data-solar-mode');
      }
    } else {
      document.documentElement.removeAttribute('data-solar-mode');
    }
    if (theme === 'arctic') {
      document.body.style.setProperty('--aur-badge', '"id=(kp7)"');
    }
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtonLabel(theme);
  }

  function cycleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'phantom';
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    applyTheme(nextTheme);
    showToast(`THEME: [${nextTheme.toUpperCase()}]`);
  }

  function updateThemeButtonLabel(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const FLORA_ICON = '<span class="flora-btn-leaf" style="margin-right:0.35rem;vertical-align:-1px;font-size:1.05rem;">🌿</span>';
    const PHANTOM_SPECTER = '<span class="phantom-theme-specter" style="margin-right:0.35rem;vertical-align:-1px;font-size:1.05rem;filter:drop-shadow(0 0 6px rgba(0,255,136,0.6));">👻</span>';
    const THEME_EYE = '<svg class="uchiha-theme-eye" width="14" height="14" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#8B0000"/><circle cx="20" cy="20" r="17" fill="none" stroke="#FF0000" stroke-width="2.4"/><circle cx="20" cy="20" r="5.2" fill="#000"/><g fill="#000"><circle cx="20" cy="8.6" r="3.9"/><circle cx="29.9" cy="25.7" r="3.9"/><circle cx="10.1" cy="25.7" r="3.9"/></g><g fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round"><path d="M20 8.6 C 25.2 8.6 28.9 12.3 28.9 17.4"/><path d="M29.9 25.7 C 27.3 30.2 22 31.6 17.6 29.1"/><path d="M10.1 25.7 C 7.5 21.2 9.4 15.8 13.9 13.4"/></g></svg>';
    const COBALT_TREFOIL = '<svg class="cob-mark-btn" width="14" height="14" viewBox="0 0 24 24" style="vertical-align:-2px;margin-right:0.35rem;display:inline-block;animation:cobRotateTrefoil 12s linear infinite;" fill="currentColor"><circle cx="12" cy="12" r="2.4"/><path d="M12 10.2 L12 2.6 A9.4 9.4 0 0 0 4.2 6.9 L10.6 10.9 A2.2 2.2 0 0 1 12 10.2 Z"/><g transform="rotate(120 12 12)"><path d="M12 10.2 L12 2.6 A9.4 9.4 0 0 0 4.2 6.9 L10.6 10.9 A2.2 2.2 0 0 1 12 10.2 Z"/></g><g transform="rotate(240 12 12)"><path d="M12 10.2 L12 2.6 A9.4 9.4 0 0 0 4.2 6.9 L10.6 10.9 A2.2 2.2 0 0 1 12 10.2 Z"/></g><circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    const SOLAR_MARK = '<svg class="sol-mark-btn" width="14" height="14" viewBox="0 0 48 48" style="vertical-align:-2px;margin-right:0.35rem;display:inline-block;color:#ffb02e;animation:cobRotateTrefoil 35s linear infinite;" fill="currentColor"><circle cx="24" cy="24" r="10" fill="currentColor"/><g stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="24" y1="4" x2="24" y2="10"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="4" y1="24" x2="10" y2="24"/><line x1="38" y1="24" x2="44" y2="24"/><line x1="9.9" y1="9.9" x2="14.1" y2="14.1"/><line x1="33.9" y1="33.9" x2="38.1" y2="38.1"/><line x1="9.9" y1="38.1" x2="14.1" y2="33.9"/><line x1="33.9" y1="14.1" x2="38.1" y2="9.9"/></g></svg>';
    const ARCTIC_CRYSTAL = '<svg class="arc-mark-btn" width="14" height="14" viewBox="0 0 48 48" style="vertical-align:-2px;margin-right:0.35rem;display:inline-block;color:#5ef2c0;animation:cobRotateTrefoil 14s linear infinite;" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M24 4 V44 M6 14 L42 34 M42 14 L6 34"/><path d="M24 12 l-5-5 M24 12 l5-5 M24 36 l-5 5 M24 36 l5 5"/><path d="M10 17 l1-7 M10 17 l7-1 M38 31 l-1 7 M38 31 l-7 1"/><path d="M38 17 l-7-1 M38 17 l-1-7 M10 31 l7 1 M10 31 l1 7"/></g></svg>';
    const icons = {
      phantom: PHANTOM_SPECTER + 'PHANTOM',
      void: PHANTOM_SPECTER + 'PHANTOM',
      amber: '▲ AMBER',
      floral: FLORA_ICON + 'FLORA',
      flora: FLORA_ICON + 'FLORA',
      ghost: FLORA_ICON + 'FLORA',
      uchiha: THEME_EYE + 'UCHIHA',
      arctic: ARCTIC_CRYSTAL + 'ARCTIC',
      synthwave: '♦ SYNTHWAVE',
      phosphor: '█ PHOSPHOR',
      solar: SOLAR_MARK + 'SOLAR',
      hazard: '⚠ HAZARD',
      cobalt: COBALT_TREFOIL + 'COBALT',
      sakura: '✿ SAKURA',
      yua: '♡ YUA',
      blush: '♡ YUA'
    };
    let label = icons[theme] || '◐ THEME';
    if (theme === 'uchiha') {
      label = THEME_EYE + 'UCHIHA';
    } else if (theme === 'floral' || theme === 'flora' || theme === 'ghost') {
      label = FLORA_ICON + 'FLORA';
    } else if (theme === 'phantom' || theme === 'void') {
      label = PHANTOM_SPECTER + 'PHANTOM';
    } else if (theme === 'phosphor') {
      label = '<span class="phos-cursor" style="display:inline-block;width:0.55em;height:0.95em;background:#33ff66;margin-right:0.35rem;vertical-align:-1px;box-shadow:0 0 8px rgba(51,255,102,0.8);"></span>PHOSPHOR';
    } else if (theme === 'cobalt') {
      label = COBALT_TREFOIL + 'COBALT';
    } else if (theme === 'solar') {
      label = SOLAR_MARK + 'SOLAR';
    } else if (theme === 'arctic') {
      label = ARCTIC_CRYSTAL + 'ARCTIC';
    }
    btn.innerHTML = `<span>${label}</span>`;
  }

  function pickRandomTheme(excludeTheme, silent) {
    const currentTheme = excludeTheme || localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'floral';
    let pool = themes.filter(t => t !== currentTheme);
    if (pool.length === 0) pool = themes;
    const nextTheme = pool[Math.floor(Math.random() * pool.length)] || 'floral';
    applyTheme(nextTheme);
    if (!silent) {
      showToast(`THEME: [${nextTheme.toUpperCase()}]`);
    }
    return nextTheme;
  }
  window.pickRandomTheme = pickRandomTheme;

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      pickRandomTheme(null, true);
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

      if ((e.key === 'd' || e.key === 'D') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        if (window.triggerDegauss) window.triggerDegauss();
      }
    });
  }

  // --- 11. CYBER ARSENAL HUD INTERACTIVITY ---
  function initSkillsSection() {
    const container = document.getElementById('skills-section');
    if (!container) return;

    const tabButtons = Array.from(container.querySelectorAll('.hud-tab-btn, .skills-tab-btn'));
    const panels = Array.from(container.querySelectorAll('.hud-domain-panel, .skills-panel'));
    const telemetryName = document.getElementById('telemetry-domain-name');
    const telemetryDesc = document.getElementById('telemetry-domain-desc');
    const telemetryCount = document.getElementById('telemetry-count-badge');

    function switchDomain(domainSlug) {
      tabButtons.forEach(btn => {
        const isMatch = (btn.getAttribute('data-domain') || btn.getAttribute('data-category')) === domainSlug;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        btn.setAttribute('tabindex', isMatch ? '0' : '-1');
      });

      panels.forEach(panel => {
        const isMatch = (panel.getAttribute('data-domain') || panel.getAttribute('data-category')) === domainSlug;
        if (isMatch) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');

          if (telemetryName && panel.dataset.tagline) {
            telemetryName.textContent = panel.dataset.tagline;
          }
          if (telemetryDesc && panel.dataset.desc) {
            telemetryDesc.textContent = panel.dataset.desc;
          }
          if (telemetryCount && panel.dataset.count) {
            telemetryCount.textContent = `[${panel.dataset.count} CAPABILITIES]`;
          }
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    }

    tabButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-domain') || btn.getAttribute('data-category');
        if (slug) switchDomain(slug);
      });

      // Keyboard navigation between tabs
      btn.addEventListener('keydown', (e) => {
        let targetIndex = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = tabButtons.length - 1;
        }

        if (targetIndex !== -1) {
          const targetBtn = tabButtons[targetIndex];
          targetBtn.focus();
          const slug = targetBtn.getAttribute('data-domain') || targetBtn.getAttribute('data-category');
          if (slug) switchDomain(slug);
        }
      });
    });
  }

  // --- 12. ADVANCED DOSSIER & ARSENAL INTERACTIVITY ---
  function initDossierEnhancements() {
    // A. UTC Clock
    const utcEl = document.getElementById('top-ticker-utc');
    function updateUtc() {
      if (utcEl) {
        const now = new Date();
        const hrs = String(now.getUTCHours()).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        utcEl.textContent = `UTC: ${hrs}:${mins}:${secs}`;
      }
    }
    updateUtc();
    setInterval(updateUtc, 1000);

    // B. Web Audio API Tactical SFX
    let audioCtx = null;
    let sfxEnabled = localStorage.getItem('phantom_sfx') === 'on';
    const sfxBtn = document.getElementById('audio-toggle-btn');

    function updateSfxButton() {
      if (!sfxBtn) return;
      const textSpan = sfxBtn.querySelector('.audio-text');
      const iconSpan = sfxBtn.querySelector('.audio-icon');
      if (sfxEnabled) {
        sfxBtn.classList.add('active');
        if (textSpan) textSpan.textContent = 'SFX: ON';
        if (iconSpan) iconSpan.textContent = '🔊';
      } else {
        sfxBtn.classList.remove('active');
        if (textSpan) textSpan.textContent = 'SFX: OFF';
        if (iconSpan) iconSpan.textContent = '🔇';
      }
    }
    updateSfxButton();

    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
        localStorage.setItem('phantom_sfx', sfxEnabled ? 'on' : 'off');
        updateSfxButton();
        if (sfxEnabled) playTacticalSfx('confirm');
      });
    }

    function playTacticalSfx(type = 'click') {
      if (!sfxEnabled) return;
      try {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) audioCtx = new AudioContext();
        }
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        const isPhosphor = document.documentElement.getAttribute('data-theme') === 'phosphor';

        if (isPhosphor) {
          if (type === 'hover') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
          } else {
            // Authentic Agy CRT mechanical relay click
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(950, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
          }
          return;
        }

        if (type === 'confirm') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'hover') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(1900, now + 0.02);
          gain.gain.setValueAtTime(0.006, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
          osc.start(now);
          osc.stop(now + 0.02);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
        }
      } catch (_) {}
    }

    // Bind SFX to buttons and cards
    document.querySelectorAll('.hud-tab-btn, .dossier-btn, .cve-copy-btn, .comm-copy-btn, .btn, .tag-btn, .theme-toggle-btn, .archive-entry-card, .post-card, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => playTacticalSfx('hover'));
      el.addEventListener('click', () => playTacticalSfx('click'));
    });

    // C. Hacker Scramble Text Animation (markup-preserving, snappy)
    const cipherChars = '01#$<>[]!/*_\\+-=&%?@~';
    function scrambleElement(el) {
      if (!el || el.dataset.scrambling === 'true') return;
      el.dataset.scrambling = 'true';

      // Walk text nodes so nested markup (spans, <code>, strong) is preserved.
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      const texts = nodes.map(n => n.nodeValue);
      const total = texts.reduce((sum, t) => sum + t.length, 0);
      if (total === 0) { el.dataset.scrambling = 'false'; return; }

      let revealed = 0;
      const interval = setInterval(() => {
        revealed += Math.max(3, Math.ceil(total / 18)); // ~18 frames, quick flicker
        let budget = revealed;
        for (let i = 0; i < nodes.length; i++) {
          const original = texts[i];
          const len = original.length;
          if (budget <= 0) {
            nodes[i].nodeValue = '';
            continue;
          }
          const solid = Math.min(len, budget);
          let out = original.slice(0, solid);
          for (let j = solid; j < len; j++) {
            const ch = original[j];
            out += (ch === ' ' || ch === '\n') ? ch : cipherChars[Math.floor(Math.random() * cipherChars.length)];
          }
          nodes[i].nodeValue = out;
          budget -= len;
        }

        if (revealed >= total) {
          clearInterval(interval);
          for (let i = 0; i < nodes.length; i++) nodes[i].nodeValue = texts[i];
          el.dataset.scrambling = 'false';
        }
      }, 22);
    }

    // Trigger scramble on page load (no stagger — everything flickers together)
    document.querySelectorAll('[data-scramble]').forEach((el) => {
      setTimeout(() => scrambleElement(el), 60);
      el.addEventListener('mouseenter', () => scrambleElement(el));
    });

    // D. Real-time Arsenal Instant Filter
    const searchInput = document.getElementById('arsenal-search-input');
    const clearBtn = document.getElementById('arsenal-search-clear');
    const telemetryCount = document.getElementById('telemetry-count-badge');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        const activePanel = document.querySelector('.hud-domain-panel.active');
        if (!activePanel) return;

        const cards = activePanel.querySelectorAll('.hud-card');
        let matchCount = 0;

        cards.forEach(card => {
          const text = (card.textContent || '').toLowerCase();
          if (!query) {
            card.classList.remove('hud-card-hidden');
            card.classList.remove('hud-card-highlight');
            matchCount++;
          } else if (text.includes(query)) {
            card.classList.remove('hud-card-hidden');
            card.classList.add('hud-card-highlight');
            matchCount++;
          } else {
            card.classList.add('hud-card-hidden');
            card.classList.remove('hud-card-highlight');
          }
        });

        if (telemetryCount) {
          if (query) {
            telemetryCount.textContent = `[${matchCount} MATCHES]`;
          } else {
            const origCount = activePanel.dataset.count || '0';
            telemetryCount.textContent = `[${origCount} CAPABILITIES]`;
          }
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
          searchInput.focus();
        });
      }
    }

    // E. 1-Click Copy Triggers with Fallback
    async function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (_) {}
      }
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch (_) {}
      return false;
    }

    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;
        await copyText(textToCopy);
        playTacticalSfx('confirm');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>COPIED!</span>';
        btn.style.borderColor = 'var(--accent-primary)';
        btn.style.color = 'var(--accent-primary)';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 1500);
      });
    });

    // F. PGP Drawer Toggles
    const pgpQuickTrigger = document.getElementById('pgp-quick-trigger');
    const pgpMount = document.getElementById('pgp-key-mount');
    const pgpToggle = document.getElementById('pgp-toggle-expand');
    const pgpCopyBtn = document.getElementById('pgp-copy-btn');
    const pgpCodeBlock = document.getElementById('pgp-public-key-block');

    if (pgpQuickTrigger) {
      pgpQuickTrigger.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          if (pgpMount && pgpMount.classList.contains('collapsed')) {
            pgpMount.classList.remove('collapsed');
            if (pgpToggle) pgpToggle.textContent = 'COLLAPSE';
          }
          const drawerBox = document.getElementById('pgp-drawer-box');
          if (drawerBox) {
            drawerBox.style.boxShadow = '0 0 20px var(--accent-glow)';
            setTimeout(() => { drawerBox.style.boxShadow = ''; }, 2000);
          }
        }
      });
    }

    if (pgpToggle && pgpMount) {
      pgpToggle.addEventListener('click', () => {
        const isCollapsed = pgpMount.classList.toggle('collapsed');
        pgpToggle.textContent = isCollapsed ? 'EXPAND' : 'COLLAPSE';
      });
    }

    if (pgpCopyBtn && pgpCodeBlock) {
      pgpCopyBtn.addEventListener('click', async () => {
        const keyText = pgpCodeBlock.textContent.trim();
        await copyText(keyText);
        playTacticalSfx('confirm');
        const orig = pgpCopyBtn.textContent;
        pgpCopyBtn.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => { pgpCopyBtn.textContent = orig; }, 1800);
      });
    }

    // G. Dossier Sidebar Scrollspy
    const indexLinks = document.querySelectorAll('.index-nav-link');
    if (indexLinks.length) {
      const sectionTargets = [];
      indexLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const el = document.getElementById(href.substring(1));
          if (el) sectionTargets.push({ id: href.substring(1), el, link });
        }
      });

      if (sectionTargets.length) {
        window.addEventListener('scroll', () => {
          const scrollPos = window.scrollY + 200;
          let currentTarget = sectionTargets[0];
          for (let i = 0; i < sectionTargets.length; i++) {
            if (sectionTargets[i].el.offsetTop <= scrollPos) {
              currentTarget = sectionTargets[i];
            }
          }
          sectionTargets.forEach(item => {
            item.link.classList.toggle('active', item === currentTarget);
          });
        }, { passive: true });
      }
    }
  }

  // --- 13. SAKURA CHERRY BLOSSOM ENGINE (MUSE WIND-FIELD PETAL DIRECTION) ---
  function initSakuraEffect() {
    let canvas = document.getElementById('sakura-canvas');
    let ctx = null;
    let animId = null;
    let particles = [];
    let isRunning = false;
    let width = 0;
    let height = 0;

    // Muse dynamic wind-field: natural drifting breeze
    let dirDeg = 315; // Natural North-West to South-East Hanami breeze
    let windNow = 3.2; // Gentle breeze speed in m/s
    let windVX = 0.8;
    let windVY = 0.1;
    let tick = 0;

    function stepWind() {
      // Wind meanders smoothly
      windNow = Math.max(1.2, Math.min(6.5, windNow + (Math.random() - 0.48) * 0.8));
      dirDeg = (dirDeg + (Math.random() - 0.5) * 14 + 360) % 360;
      const rad = dirDeg * Math.PI / 180;
      windVX = Math.sin(rad) * windNow * 0.38;
      windVY = -Math.cos(rad) * windNow * 0.06;
    }

    setInterval(stepWind, 3000);
    stepWind();

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    // Muse's quadratic curved notched petal outline
    function drawPetalShape(c, s) {
      c.beginPath();
      c.moveTo(0, -s);
      c.quadraticCurveTo(s * 0.9, -s * 0.3, s * 0.55, s * 0.7);
      c.quadraticCurveTo(s * 0.2, s * 1.1, 0, s * 0.8);
      c.quadraticCurveTo(-s * 0.2, s * 1.1, -s * 0.55, s * 0.7);
      c.quadraticCurveTo(-s * 0.9, -s * 0.3, 0, -s);
      c.fill();
    }

    // Muse's 5-petal blossom with golden pistil center
    function drawBlossomShape(c, s) {
      for (let k = 0; k < 5; k++) {
        c.save();
        c.rotate((k / 5) * Math.PI * 2);
        drawPetalShape(c, s * 0.62);
        c.restore();
      }
      c.beginPath();
      c.arc(0, 0, s * 0.22, 0, Math.PI * 2);
      c.fillStyle = '#ffb347';
      c.fill();
    }

    // GLM mouse pointer tracking for interactive petal repulsion
    const mouse = { x: -9999, y: -9999 };
    function onPointerMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onPointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function createParticle(isInitial) {
      const isMobile = window.innerWidth <= 768;
      const isFlower = Math.random() < 0.22;
      const size = isFlower
        ? (isMobile ? 12 + Math.random() * 6 : 15 + Math.random() * 8)
        : (isMobile ? 7 + Math.random() * 5 : 9 + Math.random() * 8);

      const pal = ['#ffc7dd', '#ff9ec4', '#ff75b5', '#ffd3e3', '#f48fb1'];
      const color = pal[Math.floor(Math.random() * pal.length)];

      return {
        isFlower: isFlower,
        size: size,
        x: Math.random() * (width || window.innerWidth),
        y: isInitial ? Math.random() * (height || window.innerHeight) : -25 - Math.random() * 35,
        fall: 0.6 + Math.random() * 0.9,
        depth: 0.35 + Math.random() * 0.65,
        sw: 0.4 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.04,
        flip: Math.random() * Math.PI * 2,
        vFlip: 0.015 + Math.random() * 0.025,
        color: color,
        vx: 0,
        vy: 0
      };
    }

    function initParticles() {
      const isMobile = window.innerWidth <= 768;
      // Scantily and serene: 26 on desktop, 13 on mobile
      const targetCount = isMobile ? 13 : 26;
      particles = [];
      for (let i = 0; i < targetCount; i++) {
        particles.push(createParticle(true));
      }
    }

    function render() {
      if (!ctx || !isRunning) return;
      tick += 0.016;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // GLM cursor repulsion: mouse cursor pushes falling petals and blossoms away
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const md = Math.sqrt(dx * dx + dy * dy);
        const repulseRadius = 115;
        if (md < repulseRadius && md > 0.1) {
          const force = (repulseRadius - md) / repulseRadius;
          p.vx += (dx / md) * force * 3.4;
          p.vy += (dy / md) * force * 2.2;
          p.vFlip += force * 0.04;
          p.vr += (dx > 0 ? 0.03 : -0.03) * force;
        }

        p.vx *= 0.93;
        p.vy *= 0.93;

        const sway = Math.sin(tick * p.sw + p.ph) * p.sw * 0.55;

        // Combined Muse directional wind-field + GLM cursor repulsion impulse:
        p.x += (windVX * p.depth + sway + p.vx);
        p.y += (p.fall * p.depth + windVY * p.depth + p.vy);
        p.rot += p.vr;
        p.flip += p.vFlip;

        // Screen boundary wrap
        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) {
          p.x = -30;
        } else if (p.x < -30) {
          p.x = width + 30;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip));
        ctx.globalAlpha = 0.3 + 0.6 * p.depth;
        ctx.fillStyle = p.color;

        if (p.isFlower) {
          drawBlossomShape(ctx, p.size);
        } else {
          drawPetalShape(ctx, p.size);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    }

    function start() {
      if (isRunning) return;
      if (!canvas) {
        canvas = document.getElementById('sakura-canvas');
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.id = 'sakura-canvas';
          canvas.setAttribute('aria-hidden', 'true');
          document.body.appendChild(canvas);
        }
        ctx = canvas.getContext('2d');
        window.addEventListener('resize', () => {
          resize();
          initParticles();
        }, { passive: true });
      }
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });
      resize();
      initParticles();
      isRunning = true;
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(render);
    }

    function stop() {
      if (!isRunning) return;
      isRunning = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      mouse.x = -9999;
      mouse.y = -9999;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
      if (ctx && canvas) {
        ctx.clearRect(0, 0, width, height);
      }
    }

    function checkTheme() {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'sakura') {
        start();
      } else {
        stop();
      }
    }

    window.__updateSakuraTheme = checkTheme;

    // Check theme initially
    checkTheme();

    // Listen for theme attribute changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          checkTheme();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Pause when tab is not visible to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isRunning && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else {
        if (isRunning && !animId) {
          animId = requestAnimationFrame(render);
        }
      }
    });
  }

  // --- PHANTOM R3 DECORATIONS ---
  function initPhantomDecorations() {
    const heroTargets = document.querySelectorAll('.hero-section, .dossier-hero, .archive-ledger-banner, .article-header, .game-hero');
    heroTargets.forEach(hero => {
      // 1. Wraith on left
      if (!hero.querySelector('.phantom-wraith')) {
        const wraith = document.createElement('div');
        wraith.className = 'phantom-wraith';
        wraith.setAttribute('aria-hidden', 'true');
        hero.prepend(wraith);
      }
      // 2. Right Rotating Sigil
      if (!hero.querySelector('.phantom-sigil')) {
        const sigil = document.createElement('div');
        sigil.className = 'phantom-sigil';
        sigil.setAttribute('aria-hidden', 'true');
        hero.prepend(sigil);
      }
    });

    // 3. Floating Motes container
    if (!document.querySelector('.phantom-motes')) {
      const motes = document.createElement('div');
      motes.className = 'phantom-motes';
      motes.setAttribute('aria-hidden', 'true');
      motes.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span>';
      document.body.appendChild(motes);
    }

    // 4. Icons in phonetic flasher
    const phoneticIcons = document.querySelectorAll('.dossier-pronounce .phonetic-icon');
    phoneticIcons.forEach(icon => {
      if (!icon.querySelector('.floral-leaf-icon') && !icon.querySelector('.flasher-symbol')) {
        const leaf = document.createElement('span');
        leaf.className = 'floral-leaf-icon';
        leaf.setAttribute('aria-hidden', 'true');
        leaf.textContent = '🌿';
        icon.appendChild(leaf);
      }
      if (!icon.querySelector('.phantom-wisp-icon')) {
        const wisp = document.createElement('span');
        wisp.className = 'phantom-wisp-icon';
        wisp.setAttribute('aria-hidden', 'true');
        wisp.innerHTML = '<span class="phantom-specter-sigil" style="font-size:1.15rem;vertical-align:-1px;filter:drop-shadow(0 0 8px #00ff88);display:inline-block;">👻</span>';
        icon.appendChild(wisp);
      }
      if (!icon.querySelector('.phos-cursor')) {
        const cur = document.createElement('span');
        cur.className = 'phos-cursor';
        cur.setAttribute('aria-hidden', 'true');
        icon.appendChild(cur);
      }
    });
  }

  // --- PHOSPHOR CRT AUDIO & DEGAUSS (AGY SFX) ---
  function playCrtClick(freq = 950, duration = 0.04) {
    if (localStorage.getItem('phantom_sfx') === 'off') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, actx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, actx.currentTime + duration);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch (_) {}
  }
  window.playCrtClick = playCrtClick;

  function playDegaussSound() {
    if (localStorage.getItem('phantom_sfx') === 'off') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, actx.currentTime + 0.65);

      gain.gain.setValueAtTime(0.25, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, actx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.65);
    } catch (_) {}
  }
  window.playDegaussSound = playDegaussSound;

  window.triggerDegauss = function () {
    document.body.classList.remove('degauss-active');
    void document.body.offsetWidth;
    document.body.classList.add('degauss-active');
    playDegaussSound();
    setTimeout(() => document.body.classList.remove('degauss-active'), 800);
  };

  // --- PHOSPHOR VECTOR OSCILLOSCOPE & RADAR (AGY CROWN JEWEL) ---
  function initPhosphorOscilloscope() {
    const canvases = [
      document.getElementById('oscilloscopeCanvas'),
      document.getElementById('oscilloscopeCanvasAbout')
    ].filter(Boolean);

    if (canvases.length === 0) return;

    // Randomize between sine, lissajous, and radar per page refresh
    const modes = ['sine', 'lissajous', 'radar'];
    let scopeMode = modes[Math.floor(Math.random() * modes.length)];
    let scopeGain = 1.0;
    let phase = 0;
    let radarAngle = 0;

    const blips = [
      { r: 45, angle: 1.2, color: '#33ff66' },
      { r: 70, angle: 3.8, color: '#a9ffbb' },
      { r: 25, angle: 5.4, color: '#ffb000' }
    ];

    function updateScopeButtons() {
      document.querySelectorAll('.phos-scope-controls .scope-btn[data-mode]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-mode') === scopeMode);
      });
      document.documentElement.setAttribute('data-scope-mode', scopeMode);
    }
    function clearScopeCanvases() {
      canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
          if (scopeMode === 'radar') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.fillStyle = '#010602';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
    }

    function updateScopeButtons() {
      document.querySelectorAll('.phos-scope-controls .scope-btn[data-mode]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-mode') === scopeMode);
      });
      document.documentElement.setAttribute('data-scope-mode', scopeMode);
      clearScopeCanvases();
    }
    updateScopeButtons();

    // Mode button listeners
    document.querySelectorAll('.phos-scope-controls .scope-btn[data-mode]').forEach(b => {
      b.addEventListener('click', () => {
        const m = b.getAttribute('data-mode');
        if (m) {
          scopeMode = m;
          updateScopeButtons();
          playCrtClick(800, 0.04);
        }
      });
    });

    // Gain buttons
    const gainUps = [document.getElementById('scopeGainUp'), document.getElementById('scopeGainUpAbout')].filter(Boolean);
    const gainDowns = [document.getElementById('scopeGainDown'), document.getElementById('scopeGainDownAbout')].filter(Boolean);

    gainUps.forEach(btn => btn.addEventListener('click', () => {
      scopeGain = Math.min(2.0, scopeGain * 1.2);
      playCrtClick(1200, 0.03);
    }));

    gainDowns.forEach(btn => btn.addEventListener('click', () => {
      scopeGain = Math.max(0.3, scopeGain * 0.8);
      playCrtClick(600, 0.03);
    }));

    function resizeCanvases() {
      canvases.forEach(canvas => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = Math.round(rect.width * (window.devicePixelRatio || 1));
          canvas.height = Math.round(rect.height * (window.devicePixelRatio || 1));
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#010602';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
    }
    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    function renderScope() {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme !== 'phosphor') {
        document.documentElement.removeAttribute('data-scope-active');
        requestAnimationFrame(renderScope);
        return;
      }
      document.documentElement.setAttribute('data-scope-active', 'true');

      const phosphorColor = '#33ff66';
      const hotColor = '#d9ffdf';
      const dpr = window.devicePixelRatio || 1;

      canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) return;

        const midX = w / 2;
        const midY = h / 2;

        // Faint persistence phosphor decay wash with explicit shadow reset
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(2, 8, 3, 0.22)';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = phosphorColor;
        ctx.shadowColor = phosphorColor;
        ctx.shadowBlur = 10 * dpr;
        ctx.lineWidth = 2.2 * dpr;

        if (scopeMode === 'sine') {
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const t = (x / w) * Math.PI * 6 + phase;
            const yOffset = (Math.sin(t) * 0.7 + Math.sin(t * 2.3 + phase * 0.5) * 0.25) * (h * 0.35) * scopeGain;
            const y = midY + yOffset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // White-hot center beam pass
          ctx.shadowBlur = 0;
          ctx.strokeStyle = hotColor;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();

          phase += 0.055;
        } else if (scopeMode === 'lissajous') {
          // Dual-axis Lissajous curve
          ctx.beginPath();
          const steps = 360;
          const rx = (w * 0.38) * scopeGain;
          const ry = (h * 0.38) * scopeGain;
          for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const x = midX + Math.sin(3 * t + phase) * rx;
            const y = midY + Math.sin(4 * t) * ry;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // White-hot center beam pass
          ctx.shadowBlur = 0;
          ctx.strokeStyle = hotColor;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();

          phase += 0.02;
        } else if (scopeMode === 'radar') {
          // Radar mode displays the full hardware CSS radar system; keep canvas clear
          ctx.clearRect(0, 0, w, h);
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }
      });

      requestAnimationFrame(renderScope);
    }
    requestAnimationFrame(renderScope);
  }

  // --- ROUND 5 COBALT: GLM CORE MAP & AGY VECTOR SONAR CHASSIS ---
  function initCobaltChassis() {
    let audioCtx = null;
    function getAudioCtx() {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function isAudioActive() {
      return localStorage.getItem('phantom_sfx') !== 'off';
    }

    // 1. Audio Synthesizers
    function playRelayClick(freq = 1400) {
      if (!isAudioActive()) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    // Continuous target blip audio gating (muted by default to avoid repetitive background sound)
    let sonarContinuousAudio = localStorage.getItem('cobalt_sonar_blips') === 'on';

    let lastBlipTime = 0;
    function playTargetBlipBeep(freq = 1760) {
      if (!isAudioActive() || !sonarContinuousAudio) return;
      const nowMs = Date.now();
      if (nowMs - lastBlipTime < 220) return;
      lastBlipTime = nowMs;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.05);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    // Full-Screen Hydro-Acoustic Sonar Wave Pulse
    function triggerScreenWavePing() {
      let screenPing = document.getElementById('cobaltScreenPing');
      if (!screenPing) {
        screenPing = document.createElement('div');
        screenPing.id = 'cobaltScreenPing';
        screenPing.className = 'cobalt-screen-ping';
        screenPing.setAttribute('aria-hidden', 'true');
        document.body.appendChild(screenPing);
      }
      screenPing.classList.remove('active');
      void screenPing.offsetWidth; // Force reflow to re-trigger animations
      screenPing.classList.add('active');
      setTimeout(() => {
        if (screenPing) screenPing.classList.remove('active');
      }, 2400);
    }
    window.triggerScreenWavePing = triggerScreenWavePing;

    function fireSonarPing() {
      // Auto-switch chassis to Sonar HUD so the vector radar canvas is visible on screen
      const hasAbout = !!document.getElementById('sonarCanvasDisplayAbout');
      setInstrument('sonar', hasAbout);

      // Trigger full-screen expanding hydro-acoustic sonar wave pulse (single soft wave)
      triggerScreenWavePing();

      if (isAudioActive()) {
        try {
          const ctx = getAudioCtx();
          if (ctx) {
            const now = ctx.currentTime;

            // Single soft hydro-acoustic sonar ping (gentle pure sine wave with smooth attack/decay)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(960, now);
            osc.frequency.exponentialRampToValueAtTime(1180, now + 0.18);
            osc.frequency.exponentialRampToValueAtTime(960, now + 0.45);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.035);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.9);
          }
        } catch (e) {}
      }

      if (window.triggerSonarRipple) {
        window.triggerSonarRipple();
      }

      // Highlight live telemetry readouts softly
      ['telBearing', 'telRange', 'telDoppler', 'telBearingAbout', 'telRangeAbout', 'telDopplerAbout'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.transition = 'color 0.2s ease, text-shadow 0.2s ease';
          el.style.color = '#7dc5ff';
          el.style.textShadow = '0 0 8px rgba(100, 185, 255, 0.4)';
          setTimeout(() => {
            el.style.color = '';
            el.style.textShadow = '';
          }, 700);
        }
      });

      if (window.showToast) {
        window.showToast('⚡ HYDRO-ACOUSTIC PING // BRG 042.8° TRUE · RNG 1,420 YDS');
      }
    }
    window.fireSonarPing = fireSonarPing;

    // 2. GLM 7x5 Core Map Lattice
    const coreRows = 5;
    const coreCols = 7;
    let activeCoreRow = 2; // R3
    let activeCoreCol = 3; // C4

    function buildCoreLattice(container) {
      if (!container) return;
      container.innerHTML = '';
      for (let r = 0; r < coreRows; r++) {
        for (let c = 0; c < coreCols; c++) {
          const cell = document.createElement('div');
          cell.className = 'core-cell';
          cell.dataset.r = r;
          cell.dataset.c = c;
          container.appendChild(cell);
        }
      }
    }

    const latticeMain = document.getElementById('coreCellLattice');
    const latticeAbout = document.getElementById('coreCellLatticeAbout');
    buildCoreLattice(latticeMain);
    buildCoreLattice(latticeAbout);

    function updateCoreCellState() {
      document.querySelectorAll('.core-cell').forEach(cell => {
        const r = parseInt(cell.dataset.r, 10);
        const c = parseInt(cell.dataset.c, 10);
        const dist = Math.hypot(r - activeCoreRow, c - activeCoreCol);
        cell.classList.remove('hot', 'warm');
        if (dist === 0) {
          cell.classList.add('hot');
        } else if (dist <= 1.45) {
          cell.classList.add('warm');
        }
      });

      const srcText = `R${activeCoreRow + 1}-C${activeCoreCol + 1}`;
      const srcDisplay = document.getElementById('coreCellSrc');
      if (srcDisplay) srcDisplay.textContent = srcText;
      const srcDisplayAbout = document.getElementById('coreCellSrcAbout');
      if (srcDisplayAbout) srcDisplayAbout.textContent = srcText;
    }
    updateCoreCellState();

    setInterval(() => {
      if (document.documentElement.getAttribute('data-theme') !== 'cobalt') return;
      const dr = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.4 ? 1 : 0);
      const dc = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.4 ? 1 : 0);

      activeCoreRow = Math.max(1, Math.min(coreRows - 2, activeCoreRow + dr));
      activeCoreCol = Math.max(1, Math.min(coreCols - 2, activeCoreCol + dc));
      updateCoreCellState();

      const dose = (0.13 + Math.random() * 0.03).toFixed(2) + ' µSv/h';
      const doseEl = document.getElementById('coreDoseReadout');
      if (doseEl) doseEl.textContent = dose;
      const doseElAbout = document.getElementById('coreDoseReadoutAbout');
      if (doseElAbout) doseElAbout.textContent = dose;
    }, 3500);

    // 3. Agy Vector Sonar Canvas Engine
    const sonarCanvases = [
      document.getElementById('sonarCanvas'),
      document.getElementById('sonarCanvasAbout')
    ].filter(Boolean);

    let sweepAngle = 0; // Clockwise azimuth in radians from North
    let pingRipples = [];
    let targetEchoRings = [];

    const sonarTargets = [
      {
        id: 'cve-41042',
        bearingDeg: 42.8,
        angle: (42.8 - 90) * Math.PI / 180, // Nautical 042.8° TRUE
        rangeYds: 1420,
        dist: 1420 / 1600, // 0.8875
        label: 'CVE-2026-41042 [JDBC]',
        tag: '042.8° T · 1,420 YDS · +4.2 Hz',
        doppler: '+4.2 Hz UP',
        freq: 1760,
        isPrimary: true,
        lastHit: false
      },
      {
        id: 'cve-67363',
        bearingDeg: 140.4,
        angle: (140.4 - 90) * Math.PI / 180, // Nautical 140.4° TRUE
        rangeYds: 980,
        dist: 980 / 1600, // 0.6125
        label: 'CVE-2026-67363 [PHP]',
        tag: '140.4° T · 980 YDS · -1.8 Hz',
        doppler: '-1.8 Hz DN',
        freq: 1440,
        isPrimary: false,
        lastHit: false
      },
      {
        id: 'beacon-443',
        bearingDeg: 277.9,
        angle: (277.9 - 90) * Math.PI / 180, // Nautical 277.9° TRUE
        rangeYds: 1280,
        dist: 1280 / 1600, // 0.80
        label: 'BEACON: HTTPS:443',
        tag: '277.9° T · 1,280 YDS · SYNC',
        doppler: '0.0 Hz SYNC',
        freq: 1280,
        isPrimary: false,
        lastHit: false
      }
    ];

    window.triggerSonarRipple = function () {
      sonarCanvases.forEach(canvas => {
        pingRipples.push({
          r: 8,
          alpha: 1.0,
          maxR: Math.min(canvas.width, canvas.height) * 0.48
        });
      });
    };

    function resizeSonar() {
      sonarCanvases.forEach(canvas => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width * (window.devicePixelRatio || 1);
          canvas.height = rect.height * (window.devicePixelRatio || 1);
        }
      });
    }
    resizeSonar();
    window.addEventListener('resize', resizeSonar);

    function renderSonarLoop() {
      if (document.documentElement.getAttribute('data-theme') === 'cobalt') {
        sonarCanvases.forEach(canvas => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const w = canvas.width;
          const h = canvas.height;
          if (w === 0 || h === 0) return;
          const cx = w / 2;
          const cy = h / 2;
          const maxRadius = Math.min(cx, cy) * 0.82;

          ctx.clearRect(0, 0, w, h);

          // Deep sonar background radial glow
          const bgGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, maxRadius * 1.1);
          bgGrad.addColorStop(0, 'rgba(6, 42, 85, 0.4)');
          bgGrad.addColorStop(0.8, 'rgba(2, 11, 24, 0.95)');
          bgGrad.addColorStop(1, '#020b18');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, w, h);

          // Concentric Range Rings with distance markings
          const ringDistances = ['400 YDS', '800 YDS', '1,200 YDS', '1,600 YDS'];
          for (let i = 1; i <= 4; i++) {
            const r = (maxRadius / 4) * i;
            ctx.strokeStyle = i === 4 ? 'rgba(77, 141, 255, 0.45)' : 'rgba(77, 141, 255, 0.22)';
            ctx.lineWidth = i === 4 ? 1.5 : 1;
            ctx.setLineDash(i === 4 ? [] : [3, 4]);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Yard label along North-South axis
            ctx.font = '8px "Roboto Mono", monospace';
            ctx.fillStyle = 'rgba(125, 175, 255, 0.65)';
            ctx.textAlign = 'center';
            ctx.fillText(ringDistances[i - 1], cx, cy - r + 9);
          }

          // Azimuth Compass Ring & Cardinal Ticks
          for (let deg = 0; deg < 360; deg += 30) {
            const rad = (deg - 90) * Math.PI / 180;
            const isCardinal = deg % 90 === 0;
            const tickLen = isCardinal ? 8 : 4;
            const x1 = cx + Math.cos(rad) * maxRadius;
            const y1 = cy + Math.sin(rad) * maxRadius;
            const x2 = cx + Math.cos(rad) * (maxRadius + tickLen);
            const y2 = cy + Math.sin(rad) * (maxRadius + tickLen);

            ctx.strokeStyle = isCardinal ? 'rgba(77, 141, 255, 0.7)' : 'rgba(77, 141, 255, 0.35)';
            ctx.lineWidth = isCardinal ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Cardinal letters
            ctx.font = isCardinal ? 'bold 8.5px "Roboto Mono", monospace' : '7.5px "Roboto Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (deg === 0) {
              ctx.fillStyle = '#ff8c1a';
              ctx.fillText('N 000°', cx, cy - maxRadius - 10);
            } else if (deg === 90) {
              ctx.fillStyle = 'rgba(180, 215, 255, 0.85)';
              ctx.fillText('E 090°', cx + maxRadius + 18, cy);
            } else if (deg === 180) {
              ctx.fillStyle = 'rgba(180, 215, 255, 0.85)';
              ctx.fillText('S 180°', cx, cy + maxRadius + 11);
            } else if (deg === 270) {
              ctx.fillStyle = 'rgba(180, 215, 255, 0.85)';
              ctx.fillText('W 270°', cx - maxRadius - 18, cy);
            }
          }
          ctx.textBaseline = 'alphabetic';

          // Crosshairs
          ctx.strokeStyle = 'rgba(77, 141, 255, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - maxRadius, cy);
          ctx.lineTo(cx + maxRadius, cy);
          ctx.moveTo(cx, cy - maxRadius);
          ctx.lineTo(cx, cy + maxRadius);
          ctx.stroke();

          // Expanding Sonar Ping Wavefronts
          for (let i = pingRipples.length - 1; i >= 0; i--) {
            const p = pingRipples[i];
            ctx.save();
            ctx.strokeStyle = `rgba(0, 229, 255, ${p.alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Check collision with targets to spawn echo ring
            sonarTargets.forEach(t => {
              const targetR = maxRadius * t.dist;
              if (Math.abs(p.r - targetR) < 3.5 && !p['hit_' + t.id]) {
                p['hit_' + t.id] = true;
                const bx = cx + Math.cos(t.angle) * targetR;
                const by = cy + Math.sin(t.angle) * targetR;
                targetEchoRings.push({ x: bx, y: by, r: 4, maxR: 26, alpha: 1.0 });
              }
            });

            p.r += 2.8;
            p.alpha -= 0.012;
            if (p.alpha <= 0 || p.r >= p.maxR) {
              pingRipples.splice(i, 1);
            }
          }

          // Target Echo Flash Rings
          for (let i = targetEchoRings.length - 1; i >= 0; i--) {
            const er = targetEchoRings[i];
            ctx.save();
            ctx.strokeStyle = `rgba(255, 140, 26, ${er.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(er.x, er.y, er.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            er.r += 1.6;
            er.alpha -= 0.035;
            if (er.alpha <= 0 || er.r >= er.maxR) {
              targetEchoRings.splice(i, 1);
            }
          }

          // Sweeping Vector Beam (360° sweeping fan)
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(sweepAngle - Math.PI / 2);

          const sweepGrad = ctx.createLinearGradient(0, 0, maxRadius, 0);
          sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
          sweepGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.15)');
          sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');

          ctx.fillStyle = sweepGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, maxRadius, -0.32, 0);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(maxRadius, 0);
          ctx.stroke();
          ctx.restore();

          // Active CVE Target Blips
          sonarTargets.forEach(t => {
            const bx = cx + Math.cos(t.angle) * (maxRadius * t.dist);
            const by = cy + Math.sin(t.angle) * (maxRadius * t.dist);
            const targetAzimuth = (t.bearingDeg * Math.PI) / 180;
            const diff = (sweepAngle - targetAzimuth + Math.PI * 2) % (Math.PI * 2);

            // Audio beep trigger on beam intercept
            if (diff < 0.04 && !t.lastHit) {
              t.lastHit = true;
              playTargetBlipBeep(t.freq);
            } else if (diff >= 0.04) {
              t.lastHit = false;
            }

            let intensity = 0.25;
            const inWake = diff < 0.55;
            if (inWake) {
              intensity = 1.0 - (diff / 0.55) * 0.7;
            }

            // Target core dot
            ctx.fillStyle = t.isPrimary ? `rgba(255, 140, 26, ${intensity})` : `rgba(0, 229, 255, ${intensity})`;
            ctx.beginPath();
            ctx.arc(bx, by, t.isPrimary ? 4.5 : 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Reticle brackets [ + ] and tags when illuminated
            if (inWake) {
              ctx.strokeStyle = t.isPrimary ? '#ff8c1a' : '#00e5ff';
              ctx.lineWidth = 1;
              const bsz = 7;
              // bracket corners
              ctx.beginPath();
              ctx.moveTo(bx - bsz, by - bsz + 3); ctx.lineTo(bx - bsz, by - bsz); ctx.lineTo(bx - bsz + 3, by - bsz);
              ctx.moveTo(bx + bsz - 3, by - bsz); ctx.lineTo(bx + bsz, by - bsz); ctx.lineTo(bx + bsz, by - bsz + 3);
              ctx.moveTo(bx - bsz, by + bsz - 3); ctx.lineTo(bx - bsz, by + bsz); ctx.lineTo(bx - bsz + 3, by + bsz);
              ctx.moveTo(bx + bsz - 3, by + bsz); ctx.lineTo(bx + bsz, by + bsz); ctx.lineTo(bx + bsz, by + bsz - 3);
              ctx.stroke();

              // Vector range ray back to center
              ctx.strokeStyle = t.isPrimary ? 'rgba(255, 140, 26, 0.35)' : 'rgba(0, 229, 255, 0.25)';
              ctx.setLineDash([2, 3]);
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(bx, by);
              ctx.stroke();
              ctx.setLineDash([]);

              // Labels
              ctx.font = 'bold 8.5px "Roboto Mono", monospace';
              ctx.fillStyle = t.isPrimary ? '#ff8c1a' : '#00e5ff';
              ctx.textAlign = 'left';
              ctx.fillText(t.label, bx + 10, by - 2);

              ctx.font = '7.5px "Roboto Mono", monospace';
              ctx.fillStyle = 'rgba(180, 215, 255, 0.85)';
              ctx.fillText(t.tag, bx + 10, by + 9);
            }
          });

          // Corner Vector Sonar HUD Telemetry Overlays
          ctx.textAlign = 'left';
          ctx.font = '8px "Roboto Mono", monospace';
          ctx.fillStyle = 'rgba(180, 215, 255, 0.7)';
          ctx.fillText('BRG: 042.8° TRUE', 8, 14);
          ctx.fillText('RNG: 1,420 YDS', 8, 25);

          ctx.textAlign = 'right';
          ctx.fillStyle = '#ff8c1a';
          ctx.fillText('DOPPLER: +4.2 Hz UP', w - 8, 14);
          ctx.fillStyle = 'rgba(180, 215, 255, 0.7)';
          ctx.fillText('CHIRP: 880→1760 Hz', w - 8, 25);

          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(125, 175, 255, 0.55)';
          ctx.fillText('MODE: ACTIVE HYDRO-ACOUSTIC', 8, h - 8);

          ctx.textAlign = 'right';
          ctx.fillStyle = '#ff8c1a';
          ctx.fillText('TGT: CVE-2026-41042 [JDBC]', w - 8, h - 8);
        });

        sweepAngle += 0.022;
        if (sweepAngle >= Math.PI * 2) sweepAngle -= Math.PI * 2;
      }
      requestAnimationFrame(renderSonarLoop);
    }
    requestAnimationFrame(renderSonarLoop);

    // 4. Instrument Tab Switching
    function setInstrument(mode, isAbout) {
      playRelayClick(1200);
      const suffix = isAbout ? 'About' : '';
      const coreMap = document.getElementById('coreMapDisplay' + suffix);
      const sonarHud = document.getElementById('sonarCanvasDisplay' + suffix);
      const btnCore = document.getElementById('tabCoreMap' + suffix);
      const btnSonar = document.getElementById('tabSonarHud' + suffix);

      if (mode === 'core') {
        if (coreMap) coreMap.classList.add('active');
        if (sonarHud) sonarHud.classList.remove('active');
        if (btnCore) btnCore.classList.add('active');
        if (btnSonar) btnSonar.classList.remove('active');
      } else {
        if (coreMap) coreMap.classList.remove('active');
        if (sonarHud) sonarHud.classList.add('active');
        if (btnCore) btnCore.classList.remove('active');
        if (btnSonar) btnSonar.classList.add('active');
        resizeSonar();
      }
    }

    function updateBlipToggleButtons() {
      ['tabSonarBlipsToggle', 'tabSonarBlipsToggleAbout'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.textContent = sonarContinuousAudio ? 'BLIPS: ON' : 'BLIPS: OFF';
          btn.classList.toggle('blips-live', sonarContinuousAudio);
        }
      });
    }

    function toggleSonarContinuousAudio() {
      playRelayClick(1300);
      sonarContinuousAudio = !sonarContinuousAudio;
      localStorage.setItem('cobalt_sonar_blips', sonarContinuousAudio ? 'on' : 'off');
      updateBlipToggleButtons();
      if (window.showToast) {
        window.showToast(sonarContinuousAudio 
          ? '🔊 SONAR HUD: CONTINUOUS TARGET BLIPS UNMUTED' 
          : '🔇 SONAR HUD: CONTINUOUS TARGET BLIPS MUTED');
      }
    }
    window.toggleSonarContinuousAudio = toggleSonarContinuousAudio;

    const tabCore = document.getElementById('tabCoreMap');
    const tabSonar = document.getElementById('tabSonarHud');
    if (tabCore) tabCore.addEventListener('click', () => setInstrument('core', false));
    if (tabSonar) tabSonar.addEventListener('click', () => setInstrument('sonar', false));

    const tabCoreAbout = document.getElementById('tabCoreMapAbout');
    const tabSonarAbout = document.getElementById('tabSonarHudAbout');
    if (tabCoreAbout) tabCoreAbout.addEventListener('click', () => setInstrument('core', true));
    if (tabSonarAbout) tabSonarAbout.addEventListener('click', () => setInstrument('sonar', true));

    ['tabSonarBlipsToggle', 'tabSonarBlipsToggleAbout'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', toggleSonarContinuousAudio);
    });
    updateBlipToggleButtons();

    // Button event listeners
    ['cobalt-ping-btn', 'cobalt-ping-btn-about', 'cobalt-hero-ping-btn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', fireSonarPing);
    });
  }

  // --- ROUND 6 SOLAR: MIMO LIVE ANIMATED HELIOGRAPH CANVAS & GOES STRIP ---
  function initSolarHeliograph() {
    const sunCanvases = [document.getElementById('solarHeliographCanvas'), document.getElementById('solarHeliographCanvasAbout')].filter(Boolean);
    const goesCanvases = [document.getElementById('solarGoesCanvas'), document.getElementById('solarGoesCanvasAbout')].filter(Boolean);
    if (!sunCanvases.length && !goesCanvases.length) return;

    function mulberry32(a) {
      return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function fitCanvas(cv) {
      if (!cv) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (w < 10 || h < 10) return null;
      if (cv.width !== w || cv.height !== h) {
        cv.width = w; cv.height = h;
      }
      return { ctx: cv.getContext('2d'), w: w, h: h, dpr: dpr };
    }

    // 1. GOES X-ray Flux strip
    let fluxRng = mulberry32(42042);
    let fluxBuf = [];
    const BUF_LEN = 90;
    for (let i = 0; i < BUF_LEN; i++) {
      fluxBuf.push(1e-8 * (1.2 + fluxRng() * 0.8));
    }
    let activeFlare = null;

    function tickFlux() {
      if (document.documentElement.getAttribute('data-theme') !== 'solar') return;
      if (!activeFlare && fluxRng() < 0.035) {
        const roll = fluxRng();
        const cls = roll < 0.65 ? 'C' : roll < 0.92 ? 'M' : 'X';
        const mag = 1 + fluxRng() * 8.9;
        const peak = (cls === 'C' ? 1e-6 : cls === 'M' ? 1e-5 : 1e-4) * mag;
        activeFlare = { peak: peak, t: 0, dur: 45 + fluxRng() * 55, cls: cls, mag: mag.toFixed(1) };
        ['solarGoesEvents', 'solarGoesEventsAbout'].forEach(id => {
          const evEl = document.getElementById(id);
          if (evEl) {
            evEl.innerHTML = `<span style="color:${cls === 'X' ? '#ff4d1c' : '#ffb02e'}">FLARE ${cls}${mag.toFixed(1)} ACTIVE // AR13664</span>`;
          }
        });
      }
      let nxt = 1e-8 * (1.2 + Math.sin(Date.now() / 6000) * 0.4 + (fluxRng() - 0.5) * 0.3);
      if (activeFlare) {
        activeFlare.t++;
        const p = activeFlare.t / activeFlare.dur;
        const fVal = (p < 0.18) ? (p / 0.18) : Math.exp(-(p - 0.18) * 3.8);
        nxt += activeFlare.peak * Math.max(fVal, 0);
        if (activeFlare.t >= activeFlare.dur) activeFlare = null;
      }
      fluxBuf.shift();
      fluxBuf.push(Math.max(nxt, 5e-9));
    }

    function drawGoes() {
      if (document.documentElement.getAttribute('data-theme') !== 'solar') return;
      goesCanvases.forEach(goesCv => {
        const f = fitCanvas(goesCv);
        if (!f) return;
        const ctx = f.ctx, W = f.w, H = f.h;
        const padL = 22, padR = 6, padT = 6, padB = 14;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#050403';
        ctx.fillRect(0, 0, W, H);

        const logMin = -8.5, logMax = -3.5;
        function yOf(l) {
          return padT + (H - padT - padB) * (1 - (l - logMin) / (logMax - logMin));
        }
        const bands = [{ l: -8, k: 'A' }, { l: -7, k: 'B' }, { l: -6, k: 'C' }, { l: -5, k: 'M' }, { l: -4, k: 'X' }];
        ctx.font = '6.5px "IBM Plex Mono", monospace';
        bands.forEach(b => {
          const y = yOf(b.l);
          ctx.strokeStyle = (b.k === 'X') ? 'rgba(255,77,28,.35)' : 'rgba(58,42,16,.55)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
          ctx.fillStyle = (b.k === 'X') ? '#ff4d1c' : '#8f7a5c';
          ctx.fillText(b.k, 6, y + 2);
        });

        const sMode = document.documentElement.getAttribute('data-solar-mode');
        const st = (W - padL - padR) / (fluxBuf.length - 1);
        ctx.strokeStyle = (sMode === 'totality') ? '#e8ecf2' : (sMode === 'euv') ? '#2fe3c0' : '#ffb02e';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (let i = 0; i < fluxBuf.length; i++) {
          const x = padL + i * st;
          const y = yOf(Math.log10(fluxBuf[i]));
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();

        const lastX = padL + (fluxBuf.length - 1) * st;
        const lastY = yOf(Math.log10(fluxBuf[fluxBuf.length - 1]));
        ctx.fillStyle = (sMode === 'totality') ? '#ffffff' : (sMode === 'euv') ? '#2fe3c0' : '#ff4d1c';
        ctx.beginPath(); ctx.arc(lastX, lastY, 2.5, 0, 7); ctx.fill();
      });
    }

    setInterval(() => {
      tickFlux();
      drawGoes();
    }, 180);

    // 2. Channel Switching & Persistence (Photosphere HMI vs EUV AIA 131 vs Totality Eclipse)
    const validSolarModes = ['photosphere', 'euv', 'totality'];
    let solarMode = localStorage.getItem('solar_spectral_mode') || 'photosphere';
    if (!validSolarModes.includes(solarMode)) solarMode = 'photosphere';

    function applySolarMode(mode) {
      solarMode = validSolarModes.includes(mode) ? mode : 'photosphere';
      localStorage.setItem('solar_spectral_mode', solarMode);
      if (solarMode === 'photosphere') {
        document.documentElement.removeAttribute('data-solar-mode');
      } else {
        document.documentElement.setAttribute('data-solar-mode', solarMode);
      }

      // Update Channel Buttons & Header Labels
      document.querySelectorAll('.solar-chan-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.chan === solarMode);
      });
      ['solarFeedChannel', 'solarFeedChannelAbout'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (solarMode === 'totality') {
            el.textContent = 'ECLIPSE · CORONA STREAMERS';
          } else if (solarMode === 'euv') {
            el.textContent = 'SDO / AIA · 131 Å (HOT CORONA)';
          } else {
            el.textContent = 'HMI / EIT · WHITE-LIGHT';
          }
        }
      });
    }

    window.setSolarMode = applySolarMode;

    // Initialize mode if in solar theme
    if (document.documentElement.getAttribute('data-theme') === 'solar') {
      applySolarMode(solarMode);
    }

    // Attach click listeners to channel selector buttons & header
    document.querySelectorAll('.solar-chan-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applySolarMode(btn.dataset.chan);
        showToast(`SOLAR CHANNEL: [${btn.dataset.chan.toUpperCase()}]`);
      });
    });

    ['solarFeedChannel', 'solarFeedChannelAbout'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          const cycleOrder = ['photosphere', 'euv', 'totality'];
          const nextIdx = (cycleOrder.indexOf(solarMode) + 1) % cycleOrder.length;
          const next = cycleOrder[nextIdx];
          applySolarMode(next);
          showToast(`SOLAR CHANNEL: [${next.toUpperCase()}]`);
        });
      }
    });

    // Keyboard Shortcuts: [U] to toggle EUV 131, [E] to toggle Totality Eclipse
    window.addEventListener('keydown', (e) => {
      if (document.documentElement.getAttribute('data-theme') !== 'solar') return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        const next = (solarMode === 'euv') ? 'photosphere' : 'euv';
        applySolarMode(next);
        showToast(`SOLAR CHANNEL: [${next.toUpperCase()}]`);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        const next = (solarMode === 'totality') ? 'photosphere' : 'totality';
        applySolarMode(next);
        showToast(`SOLAR CHANNEL: [${next.toUpperCase()}]`);
      }
    });

    // 3. 60FPS Live Heliograph Sun Canvas (Photosphere vs EUV 131 vs Totality)
    const sunRng = mulberry32(60606);
    const granules = [];
    const spots = [];
    for (let gi = 0; gi < 100; gi++) {
      granules.push({
        a: sunRng() * Math.PI * 2,
        r: sunRng(),
        s: 3.5 + sunRng() * 8,
        ph: sunRng() * Math.PI * 2,
        dark: sunRng() < 0.5
      });
    }
    const defs = [[0.4, 0.12, 8, 'AR13664'], [1.9, -0.22, 6, 'AR13666'], [3.5, 0.05, 4.5, 'AR13670']];
    defs.forEach(d => { spots.push({ lam: d[0], lat: d[1], s: d[2], ar: d[3] }); });

    const OMEGA = Math.PI * 2 / 70;
    const coronaRays = [];
    const cr = mulberry32(30430);
    for (let i = 0; i < 30; i++) {
      coronaRays.push({
        j: cr() * Math.PI * 2,
        base: 0.98 + cr() * 1.05,
        al: 0.05 + cr() * 0.15,
        bow: (cr() - 0.5) * 0.55,
        w: 0.9 + cr() * 1.5
      });
    }

    let simT = 0, lastTs = 0;
    function renderSun(ts) {
      if (document.documentElement.getAttribute('data-theme') === 'solar') {
        if (!lastTs) lastTs = ts;
        const dt = Math.min((ts - lastTs) / 1000, 0.1);
        lastTs = ts;
        simT += dt;

        const sMode = document.documentElement.getAttribute('data-solar-mode') || 'photosphere';
        const isTotality = (sMode === 'totality');
        const isEuv = (sMode === 'euv');

        sunCanvases.forEach(sunCv => {
          const f = fitCanvas(sunCv);
          if (f) {
            const ctx = f.ctx, W = f.w, H = f.h;
            const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.38;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = isTotality ? '#050506' : (isEuv ? '#010507' : '#020202');
            ctx.fillRect(0, 0, W, H);

            if (isTotality) {
              // Totality: Mimo seeded irregular bowed corona streamers
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              for (let r = 0; r < coronaRays.length; r++) {
                const ray = coronaRays[r];
                const ang = (r / coronaRays.length) * Math.PI * 2 + ray.j * 0.14 + simT * 0.012;
                const len = R * (ray.base + 0.22 * Math.sin(simT * 0.3 + ray.j));
                const x0 = cx + Math.cos(ang) * R * 0.98, y0 = cy + Math.sin(ang) * R * 0.98;
                const x1 = cx + Math.cos(ang) * len, y1 = cy + Math.sin(ang) * len;
                const mx = (x0 + x1) / 2 - Math.sin(ang) * ray.bow * R * 0.3;
                const my = (y0 + y1) / 2 + Math.cos(ang) * ray.bow * R * 0.3;
                const g = ctx.createLinearGradient(x0, y0, x1, y1);
                g.addColorStop(0, `rgba(255, 255, 255, ${ray.al.toFixed(3)})`);
                g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.strokeStyle = g;
                ctx.lineWidth = ray.w;
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.quadraticCurveTo(mx, my, x1, y1);
                ctx.stroke();
              }
              ctx.restore();

              // Inner ring (Baily's beads hint)
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.lineWidth = 1.6;
              ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
              ctx.strokeStyle = 'rgba(232, 236, 242, 0.22)';
              ctx.lineWidth = 6;
              ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, Math.PI * 2); ctx.stroke();

              // Occulting dark moon disk
              ctx.fillStyle = '#050506';
              ctx.beginPath(); ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2); ctx.fill();

              // Totality watermark
              ctx.fillStyle = 'rgba(232, 236, 242, 0.45)';
              ctx.font = '6px "IBM Plex Mono", monospace';
              ctx.fillText('TOTALITY FEED · CORONA STREAMERS · CR 2298', 8, 12);
            } else {
              // Photosphere and EUV 131
              // Corona outer glow
              const cg = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.85);
              if (isEuv) {
                cg.addColorStop(0, 'rgba(47, 227, 192, 0.32)');
                cg.addColorStop(1, 'rgba(47, 227, 192, 0)');
              } else {
                cg.addColorStop(0, 'rgba(255, 140, 30, 0.3)');
                cg.addColorStop(1, 'rgba(255, 90, 10, 0)');
              }
              ctx.fillStyle = cg;
              ctx.beginPath(); ctx.arc(cx, cy, R * 1.85, 0, Math.PI * 2); ctx.fill();

              // Disk Gradient: Photosphere Gold vs EUV Deep Cyan
              const dg = ctx.createRadialGradient(cx - R * 0.12, cy - R * 0.12, R * 0.05, cx, cy, R);
              if (isEuv) {
                dg.addColorStop(0, '#0c3f38');
                dg.addColorStop(0.75, '#062622');
                dg.addColorStop(1, '#031412');
              } else {
                dg.addColorStop(0, '#fff6e0');
                dg.addColorStop(0.5, '#ffcf6e');
                dg.addColorStop(0.85, '#ff9d2e');
                dg.addColorStop(0.97, '#e86e12');
                dg.addColorStop(1, '#b34d06');
              }
              ctx.fillStyle = dg;
              ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

              // Granulation Convection Cells
              ctx.save();
              ctx.beginPath(); ctx.arc(cx, cy, R - 1, 0, Math.PI * 2); ctx.clip();
              for (let i = 0; i < granules.length; i++) {
                const gr = granules[i];
                const a = gr.a + simT * OMEGA;
                const gx = cx + Math.cos(a) * gr.r * R * 0.94;
                const gy = cy + Math.sin(a) * gr.r * R * 0.55 + Math.sin(simT * 0.7 + gr.ph) * 1.2;
                const al = 0.03 + 0.025 * Math.sin(simT * 1.3 + gr.ph);
                if (isEuv) {
                  ctx.fillStyle = gr.dark ? `rgba(4,25,22,${Math.max(al,0).toFixed(3)})` : `rgba(159,245,230,${Math.max(al*0.8,0).toFixed(3)})`;
                } else {
                  ctx.fillStyle = gr.dark ? `rgba(120,50,0,${Math.max(al,0).toFixed(3)})` : `rgba(255,255,255,${Math.max(al,0).toFixed(3)})`;
                }
                ctx.beginPath(); ctx.ellipse(gx, gy, gr.s, gr.s * 0.7, a, 0, Math.PI * 2); ctx.fill();
              }
              ctx.restore();

              // Sunspots / Active Regions: In EUV, Active Regions GLOW Hot Plasma!
              for (let i = 0; i < spots.length; i++) {
                const sp = spots[i];
                sp.lam += OMEGA * dt;
                if (sp.lam > Math.PI * 2) sp.lam -= Math.PI * 2;
                const depth = Math.cos(sp.lam);
                if (depth <= 0.05) continue;
                const sx = cx + Math.sin(sp.lam) * R * 0.92;
                const sy = cy + sp.lat * R * 1.6;
                const foresh = Math.max(depth, 0.18);

                if (isEuv) {
                  const eg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sp.s * 2.6);
                  eg.addColorStop(0, 'rgba(217, 255, 246, 0.95)');
                  eg.addColorStop(0.35, 'rgba(47, 227, 192, 0.65)');
                  eg.addColorStop(1, 'rgba(47, 227, 192, 0)');
                  ctx.fillStyle = eg;
                  ctx.beginPath();
                  ctx.ellipse(sx, sy, sp.s * 2.6 * foresh, sp.s * 2.4, 0, 0, Math.PI * 2);
                  ctx.fill();
                } else {
                  ctx.fillStyle = 'rgba(140, 70, 10, 0.85)';
                  ctx.beginPath(); ctx.ellipse(sx, sy, sp.s * 1.9 * foresh, sp.s * 1.5, 0, 0, Math.PI * 2); ctx.fill();
                  ctx.fillStyle = '#2a1403';
                  ctx.beginPath(); ctx.ellipse(sx, sy, sp.s * foresh, sp.s * 0.78, 0, 0, Math.PI * 2); ctx.fill();
                }

                if (sp.ar && depth > 0.5) {
                  ctx.strokeStyle = isEuv ? '#9ff5e6' : 'rgba(255, 243, 217, 0.75)';
                  ctx.lineWidth = 1;
                  ctx.beginPath(); ctx.moveTo(sx + sp.s * 2, sy - sp.s); ctx.lineTo(sx + sp.s * 2 + 10, sy - sp.s - 10); ctx.stroke();
                  ctx.fillStyle = isEuv ? '#9ff5e6' : 'rgba(255, 243, 217, 0.9)';
                  ctx.font = '6.5px "IBM Plex Mono", monospace';
                  ctx.fillText(sp.ar, sx + sp.s * 2 + 12, sy - sp.s - 10);
                }
              }

              // Limb Ring
              ctx.strokeStyle = isEuv ? 'rgba(47, 227, 192, 0.45)' : 'rgba(255, 157, 46, 0.5)';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

              // Header mark
              ctx.fillStyle = isEuv ? 'rgba(156, 205, 195, 0.55)' : 'rgba(207, 181, 148, 0.4)';
              ctx.font = '6px "IBM Plex Mono", monospace';
              ctx.fillText(isEuv ? 'AIA 131 FEED · SDO · 10 MK' : 'HMI FEED · LZ-994 · CR 2298', 8, 12);
            }
          }
        });
      }
      requestAnimationFrame(renderSun);
    }
    requestAnimationFrame(renderSun);
  }

  // --- ARCTIC AURORA OBSERVATORY (MIMO WINNING DESIGN) ---
  function initArcticAurora() {
    const auroraCanvases = [
      document.getElementById('aurora-canvas'),
      document.getElementById('aurora-canvas-about'),
      document.getElementById('aurora-canvas-archive')
    ].filter(Boolean);

    const skyCanvases = [
      document.getElementById('allSkyCanvas'),
      document.getElementById('allSkyCanvasAbout')
    ].filter(Boolean);

    const kpEls = [
      document.getElementById('arctic-kp-val'),
      document.getElementById('arctic-kp-val-about')
    ].filter(Boolean);

    if (!auroraCanvases.length && !skyCanvases.length) return;

    let aRaf = null;
    let sRaf = null;
    let t0 = 0;
    let sT0 = 0;
    let isRunning = false;

    // Aurora curtain config (Mimo palette: violet, mint, cyan)
    const COLS = [[180, 140, 242], [94, 242, 192], [53, 214, 236], [120, 230, 180], [160, 150, 250]];
    const auroraData = auroraCanvases.map(canvas => ({
      canvas,
      ctx: canvas.getContext('2d'),
      strands: [],
      stars: [],
      snow: []
    }));

    function fitAurora() {
      auroraData.forEach(item => {
        const parent = item.canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          item.canvas.width = rect.width;
          item.canvas.height = rect.height;
        }
      });
    }

    function seedAurora() {
      auroraData.forEach(item => {
        const w = item.canvas.width || 800;
        const h = item.canvas.height || 400;
        item.strands = [];
        for (let i = 0; i < 6; i++) {
          item.strands.push({
            x: w * (0.08 + Math.random() * 0.86),
            w: 28 + Math.random() * 42,
            len: h * (0.42 + Math.random() * 0.45),
            ph: Math.random() * 6.28,
            sp: 0.0004 + Math.random() * 0.0007,
            col: COLS[i % COLS.length],
            a: 0.15 + Math.random() * 0.14
          });
        }
        item.stars = [];
        for (let j = 0; j < 70; j++) {
          item.stars.push({
            x: Math.random() * w,
            y: Math.random() * h * 0.65,
            r: Math.random() * 1.1 + 0.2,
            tw: Math.random() * 6.28
          });
        }
        item.snow = [];
        for (let k = 0; k < 45; k++) {
          item.snow.push({
            x: Math.random() * w,
            y: Math.random() * h,
            v: 0.3 + Math.random() * 0.8,
            r: 0.6 + Math.random() * 1.4,
            ph: Math.random() * 6.28
          });
        }
      });
    }

    function drawAurora(ts) {
      if (!t0) t0 = ts;
      const t = ts - t0;

      auroraData.forEach(item => {
        const { canvas, ctx, strands, stars, snow } = item;
        if (!ctx || canvas.width === 0 || canvas.height === 0) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Stars
        stars.forEach(s => {
          ctx.globalAlpha = 0.22 + 0.55 * Math.abs(Math.sin(t * 0.001 + s.tw));
          ctx.fillStyle = '#dff4ff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // 2. Aurora Curtains (vertical gradient ribbons along sinuous baselines)
        strands.forEach(s => {
          const baseX = s.x + Math.sin(t * s.sp + s.ph) * 90 + Math.sin(t * s.sp * 2.3 + s.ph) * 26;
          const grad = ctx.createLinearGradient(0, 0, 0, s.len);
          const c = s.col;
          grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0)`);
          grad.addColorStop(0.28, `rgba(${c[0]},${c[1]},${c[2]},${(s.a * 0.7).toFixed(3)})`);
          grad.addColorStop(0.62, `rgba(${c[0]},${c[1]},${c[2]},${s.a.toFixed(3)})`);
          grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
          ctx.fillStyle = grad;
          const wob = Math.sin(t * s.sp * 1.7 + s.ph) * 14;
          ctx.beginPath();
          ctx.moveTo(baseX - s.w / 2, 0);
          ctx.quadraticCurveTo(baseX - s.w / 2 + wob, s.len * 0.5, baseX - s.w / 3 + wob, s.len);
          ctx.lineTo(baseX + s.w / 3 + wob, s.len);
          ctx.quadraticCurveTo(baseX + s.w / 2 + wob, s.len * 0.5, baseX + s.w / 2, 0);
          ctx.closePath();
          ctx.fill();
        });

        // 3. Diamond Dust Snow
        snow.forEach(f => {
          f.y += f.v;
          f.x += Math.sin(f.y * 0.02) * 0.3;
          if (f.y > canvas.height) {
            f.y = -4;
            f.x = Math.random() * canvas.width;
          }
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = '#e9fff7';
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      });

      if (isRunning) {
        aRaf = requestAnimationFrame(drawAurora);
      }
    }

    // All-Sky Camera setup
    const skyData = skyCanvases.map(canvas => ({
      canvas,
      ctx: canvas.getContext('2d'),
      stars: []
    }));

    function seedSky() {
      skyData.forEach(item => {
        item.stars = [];
        for (let i = 0; i < 60; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * 185;
          item.stars.push({
            x: 200 + Math.cos(a) * r,
            y: 200 + Math.sin(a) * r,
            tw: Math.random() * Math.PI * 2
          });
        }
      });
    }

    function drawSky(ts) {
      if (!sT0) sT0 = ts;
      const t = ts - sT0;

      skyData.forEach(item => {
        const { ctx, stars } = item;
        if (!ctx) return;
        ctx.clearRect(0, 0, 400, 400);

        // Fisheye sky disc
        const g = ctx.createRadialGradient(200, 200, 20, 200, 200, 200);
        g.addColorStop(0, '#031018');
        g.addColorStop(1, '#010609');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, Math.PI * 2);
        ctx.fill();

        // Stars
        stars.forEach(s => {
          ctx.globalAlpha = 0.2 + 0.6 * Math.abs(Math.sin(t * 0.0012 + s.tw));
          ctx.fillStyle = '#dff4ff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Aurora oval: rotating mint conic arc band
        const rot = t * 0.00022;
        let og = null;
        if (typeof ctx.createConicGradient === 'function') {
          og = ctx.createConicGradient(rot, 200, 200);
          og.addColorStop(0, 'rgba(94, 242, 192, 0)');
          og.addColorStop(0.1, 'rgba(94, 242, 192, 0.32)');
          og.addColorStop(0.18, 'rgba(53, 214, 236, 0.18)');
          og.addColorStop(0.3, 'rgba(94, 242, 192, 0)');
          og.addColorStop(1, 'rgba(94, 242, 192, 0)');
          ctx.strokeStyle = og;
        } else {
          ctx.strokeStyle = 'rgba(94, 242, 192, 0.25)';
        }
        ctx.lineWidth = 34;
        ctx.beginPath();
        ctx.arc(200, 200, 132, 0, Math.PI * 2);
        ctx.stroke();

        // Horizon ring & crosshairs
        ctx.strokeStyle = 'rgba(53, 214, 236, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(200, 200, 196, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(53, 214, 236, 0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(200, 10); ctx.lineTo(200, 390);
        ctx.moveTo(10, 200); ctx.lineTo(390, 200);
        ctx.stroke();

        // Moon
        ctx.fillStyle = 'rgba(228, 244, 248, 0.85)';
        ctx.beginPath();
        ctx.arc(306, 118, 9, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isRunning) {
        sRaf = requestAnimationFrame(drawSky);
      }
    }

    function startAll() {
      if (isRunning) return;
      isRunning = true;
      fitAurora();
      seedAurora();
      seedSky();
      t0 = 0;
      sT0 = 0;
      aRaf = requestAnimationFrame(drawAurora);
      sRaf = requestAnimationFrame(drawSky);
    }

    function stopAll() {
      isRunning = false;
      if (aRaf) { cancelAnimationFrame(aRaf); aRaf = null; }
      if (sRaf) { cancelAnimationFrame(sRaf); sRaf = null; }
      auroraData.forEach(item => {
        if (item.ctx && item.canvas.width > 0) {
          item.ctx.clearRect(0, 0, item.canvas.width, item.canvas.height);
        }
      });
      skyData.forEach(item => {
        if (item.ctx) item.ctx.clearRect(0, 0, 400, 400);
      });
    }

    // KP drift ticker
    let kpV = 7;
    setInterval(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme !== 'arctic' || !kpEls.length) return;
      kpV = Math.max(5, Math.min(9, kpV + (Math.random() < 0.5 ? -1 : 1)));
      kpEls.forEach(el => { el.textContent = kpV; });
    }, 4200);

    // Initial check
    if (document.documentElement.getAttribute('data-theme') === 'arctic') {
      startAll();
    }

    // Theme switch observer
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          const t = document.documentElement.getAttribute('data-theme');
          if (t === 'arctic') {
            startAll();
          } else {
            stopAll();
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('resize', () => {
      if (document.documentElement.getAttribute('data-theme') === 'arctic') {
        fitAurora();
        seedAurora();
      }
    }, { passive: true });
  }

  // --- INITIALIZE ALL MODULES ---
  function initAll() {
    initTheme();
    initReadingProgress();
    initSearchAndFilter();
    initTableOfContents();
    initCodeCopy();
    initMobileNav();
    initBackToTop();
    initKeyboardShortcuts();
    initSkillsSection();
    initDossierEnhancements();
    initSakuraEffect();
    initPhantomDecorations();
    initPhosphorOscilloscope();
    initCobaltChassis();
    initSolarHeliograph();
    initArcticAurora();

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
