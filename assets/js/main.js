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

    // C. Hacker Scramble Text Animation
    const cipherChars = '01#$<>[]!/*_\\+-=&%?@~';
    function scrambleElement(el) {
      if (!el || el.dataset.scrambling === 'true') return;
      el.dataset.scrambling = 'true';
      const originalText = el.getAttribute('data-scramble') || el.textContent.trim();
      let iteration = 0;
      const interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            if (char === ' ' || char === '\n') return char;
            return cipherChars[Math.floor(Math.random() * cipherChars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
          el.textContent = originalText;
          el.dataset.scrambling = 'false';
        }
        iteration += 1;
      }, 25);
    }

    // Trigger scramble on page load
    document.querySelectorAll('[data-scramble]').forEach((el, idx) => {
      setTimeout(() => scrambleElement(el), idx * 100);
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
    initSkillsSection();
    initDossierEnhancements();

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
