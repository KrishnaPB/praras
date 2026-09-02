/**
 * Praras Biosciences & Airbliss — Universal Site Controller
 * Handles Brand Switching, Live Search Matrix, Quote Drawer, Turnstile & Navigation
 * Version: 2.5.0 (Industry Standard Modular Asset)
 */

// ════ 1. GLOBAL BRAND CONTROLLER ════
function brand(b, scroll) {
  if (scroll === undefined) scroll = false;
  var isAb = b === 'ab';
  try { localStorage.setItem('praras_brand', b); } catch(e){}
  document.body.classList.toggle('ab', isAb);

  var prBtn = document.getElementById('sw-btn-pr');
  var abBtn = document.getElementById('sw-btn-ab');
  if (prBtn && abBtn) {
    prBtn.classList.toggle('on', !isAb);
    abBtn.classList.toggle('on', isAb);
  }

  // Dual Page Switching on index.html
  var pgPr = document.getElementById('pg-pr');
  var pgAb = document.getElementById('pg-ab');
  if (pgPr && pgAb) {
    pgPr.classList.toggle('on', !isAb);
    pgAb.classList.toggle('on', isAb);
    pgPr.style.display = isAb ? 'none' : 'block';
    pgAb.style.display = isAb ? 'block' : 'none';
  }

  // Toggle brand-specific elements
  document.querySelectorAll('.pr-only').forEach(function(el) {
    el.style.display = isAb ? 'none' : '';
  });
  document.querySelectorAll('.ab-only').forEach(function(el) {
    el.style.display = isAb ? '' : 'none';
  });
  document.querySelectorAll('.pr-f').forEach(function(el) {
    el.style.display = isAb ? 'none' : '';
  });
  document.querySelectorAll('.ab-f').forEach(function(el) {
    el.style.display = isAb ? '' : 'none';
  });

  var footPrLogo = document.getElementById('foot-logo-pr');
  var footAbLogo = document.getElementById('foot-logo-ab');
  if (footPrLogo && footAbLogo) {
    footPrLogo.style.display = isAb ? 'none' : 'block';
    footAbLogo.style.display = isAb ? 'block' : 'none';
  }

  var footBrandName = document.getElementById('foot-brand-name');
  if (footBrandName) {
    footBrandName.textContent = isAb ? 'Airbliss' : 'Praras Biosciences';
  }

  var footBrandP = document.getElementById('foot-brand-p');
  if (footBrandP) {
    footBrandP.textContent = isAb
      ? 'Probiotic cleaning solutions for B2B facility management — developed by Praras Biosciences.'
      : 'Precision food additives, beverage solutions and microbial products for Indian manufacturers since 1999.';
  }

  var footSwitchLbl = document.getElementById('foot-switch-label');
  if (footSwitchLbl) {
    footSwitchLbl.textContent = isAb ? 'Back to Praras Biosciences' : 'Visit Airbliss';
  }

  var footAbBtn = document.getElementById('foot-ab-btn');
  if (footAbBtn) {
    footAbBtn.textContent = isAb ? 'Praras Biosciences ↗' : 'Airbliss ↗';
  }

  var footCopy = document.getElementById('foot-copy');
  if (footCopy) {
    footCopy.textContent = isAb
      ? '© 2026 Airbliss — A Praras Biosciences Pvt Ltd brand. All rights reserved.'
      : '© 2026 Praras Biosciences Pvt Ltd. All rights reserved.';
  }

  var footTag = document.getElementById('foot-tag');
  if (footTag) {
    footTag.textContent = isAb ? 'Clean spaces. Living solutions.' : 'Biosciences for Better Value';
  }

  if (scroll) {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
window.brand = brand;

// ════ 1b. GLOBAL PRODUCT CARD NAVIGATOR ════
function navigateProduct(element, event) {
  if (event) {
    if (event.target.closest('button, a, input, select, textarea, .btn-quote, .btn-card-quote, .btn-prod-quote')) {
      return;
    }
  }
  var url = element ? element.getAttribute('data-url') : null;
  if (!url && element) {
    var link = element.querySelector('a.btn-prod-learn, a.btn-card-view, a.ab-btn-page, h3 a, .prod-title-h3 a, .ab-card-name a, a[href^="products/"], a');
    if (link) url = link.getAttribute('href');
  }
  if (url) {
    window.location.href = url;
  }
}
window.navigateProduct = navigateProduct;

// ════ 1c. GLOBAL PIPELINE STAGE SCROLLER ════
function jumpToStage(stageId) {
  if (!stageId) return;
  var cleanId = stageId.replace(/^#/, '');
  var el = document.getElementById(cleanId);
  if (el) {
    var navHeight = 90;
    var rect = el.getBoundingClientRect();
    var targetPos = window.pageYOffset + rect.top - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  }
}
window.jumpToStage = jumpToStage;

// ════ 1d. GLOBAL WORKBENCH TAB SWITCHER ════
function switchWcTab(panelId, btn) {
  var container = btn ? btn.closest('.wc-workbench, .product-workbench, main, body') : document;
  if (!container) container = document;

  var tabs = container.querySelectorAll('.wc-tab-btn');
  tabs.forEach(function(t) { t.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var panels = container.querySelectorAll('.wc-tab-panel');
  panels.forEach(function(p) { p.classList.remove('active'); });

  var target = document.getElementById(panelId);
  if (target) target.classList.add('active');
}
window.switchWcTab = switchWcTab;

// ════ 2. INTERACTIVE COMPONENT INITIALIZER ════
(function initSiteController() {
  let searchCatalog = null;
  let activeFilter = 'all';
  let selectedIndex = -1;

  // Restore saved brand on root/home load
  try {
    const savedBrand = localStorage.getItem('praras_brand');
    if (savedBrand === 'ab' && !window.location.pathname.includes('airbliss') && !document.body.classList.contains('stay-praras')) {
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        brand('ab', false);
      }
    }
  } catch(e){}

  function loadSearchCatalog() {
    if (!searchCatalog) {
      const pfx = window.location.pathname.includes('/products/') ? '../' : '';
      fetch(pfx + 'assets/data/products-search.json')
        .then(r => r.json())
        .then(data => { searchCatalog = data; })
        .catch(e => console.warn('Could not load search catalog', e));
    }
  }

  function setupSiteInteractions() {
    loadSearchCatalog();

    // 1. Dropdown & Mega Menu Accordion Triggers
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger, :scope > button, :scope > a');
      if (!trigger) return;

      if (trigger._hasMegaMenuListener) return;
      trigger._hasMegaMenuListener = true;

      trigger.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 960;
        if (isMobile || trigger.tagName === 'BUTTON' || trigger.getAttribute('href') === '#' || trigger.classList.contains('dropdown-trigger')) {
          e.preventDefault();
          e.stopPropagation();
          
          const wasActive = dropdown.classList.contains('is-active');
          document.querySelectorAll('.nav-dropdown').forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('is-active');
              const otherTrig = d.querySelector('.dropdown-trigger, :scope > button, :scope > a');
              if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
            }
          });

          if (!wasActive) {
            dropdown.classList.add('is-active');
            trigger.setAttribute('aria-expanded', 'true');
          } else {
            dropdown.classList.remove('is-active');
            trigger.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => {
          d.classList.remove('is-active');
          const trig = d.querySelector('.dropdown-trigger, :scope > button, :scope > a');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // 2. Mobile Hamburger Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('main-nav-links');
    if (mobileBtn && navLinks && !mobileBtn._hasMobileMenuListener) {
      mobileBtn._hasMobileMenuListener = true;
      mobileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = mobileBtn.classList.contains('is-active');
        mobileBtn.classList.toggle('is-active', !isActive);
        navLinks.classList.toggle('is-active', !isActive);
        mobileBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    }

    // 3. Global Quote Drawer System
    const overlay = document.getElementById('quote-overlay');
    const drawer = document.getElementById('quote-drawer');
    const closeBtn = document.getElementById('quote-close');
    const subtitle = document.getElementById('quote-drawer-subtitle');
    const productInput = document.getElementById('q-product');
    const quoteForm = document.getElementById('quote-form');

    if (drawer && !drawer.classList.contains('is-active')) {
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
    }

    function openQuoteDrawer(productName) {
      if (!drawer || !overlay) return;
      if (productName && subtitle) subtitle.textContent = productName;
      if (productName && productInput) productInput.value = productName;
      
      overlay.classList.add('is-active');
      drawer.classList.add('is-active');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
      
      const firstInput = drawer.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeQuoteDrawer() {
      if (!drawer || !overlay) return;
      overlay.classList.remove('is-active');
      drawer.classList.remove('is-active');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-quote').forEach(btn => {
      if (!btn._hasQuoteListener) {
        btn._hasQuoteListener = true;
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const prod = btn.getAttribute('data-product') || 'Technical Formulation Inquiry';
          openQuoteDrawer(prod);
        });
      }
    });

    if (closeBtn && !closeBtn._hasCloseListener) {
      closeBtn._hasCloseListener = true;
      closeBtn.addEventListener('click', closeQuoteDrawer);
    }
    if (overlay && !overlay._hasOverlayListener) {
      overlay._hasOverlayListener = true;
      overlay.addEventListener('click', closeQuoteDrawer);
    }

    if (quoteForm && !quoteForm._hasSubmitListener) {
      quoteForm._hasSubmitListener = true;
      quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = quoteForm.querySelector('.quote-btn-submit');
        if (!submitBtn) return;
        
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Sending Enquiry...';
        submitBtn.disabled = true;

        const formData = new FormData(quoteForm);
        formData.append('source_page', window.location.href);

        fetch('/mailer.php', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success') {
              submitBtn.style.background = '#28a745';
              submitBtn.textContent = 'Enquiry Sent Successfully ✓';
              setTimeout(() => {
                quoteForm.reset();
                if (window.turnstile) { turnstile.reset(); }
                submitBtn.style.background = '';
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
                closeQuoteDrawer();
              }, 2200);
            } else {
              alert(data.message || 'There was an issue submitting your request.');
              if (window.turnstile) { turnstile.reset(); }
              submitBtn.textContent = origText;
              submitBtn.disabled = false;
            }
          })
          .catch(() => {
            alert('Network error. Please try again or email info@prarasbiosciences.com directly.');
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
          });
      });
    }

    // 3b. Service Consultation Forms (contract_manufacturing.html & troubleshooting.html)
    const serviceForm = document.getElementById('service-form') || document.getElementById('troubleshoot-form');
    if (serviceForm && !serviceForm._hasServiceSubmitListener) {
      serviceForm._hasServiceSubmitListener = true;
      serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = serviceForm.querySelector('button[type="submit"]');
        const feedback = document.getElementById('service-feedback') || document.getElementById('troubleshoot-feedback');
        const origText = submitBtn ? submitBtn.textContent : 'Submit';

        if (submitBtn) {
          submitBtn.textContent = 'Submitting...';
          submitBtn.disabled = true;
        }

        const formData = new FormData(serviceForm);
        formData.append('source_page', window.location.href);

        fetch('/mailer.php', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => {
            if (feedback) {
              feedback.style.display = 'block';
              feedback.textContent = data.message;
              feedback.style.color = data.status === 'success' ? '#2E7D32' : '#C62828';
              feedback.style.background = data.status === 'success' ? '#E8F5E9' : '#FFEBEE';
            }
            if (data.status === 'success') {
              serviceForm.reset();
              if (window.turnstile) { turnstile.reset(); }
              if (submitBtn) {
                submitBtn.textContent = 'Request Received ✓';
                submitBtn.style.background = '#28a745';
              }
            } else {
              if (window.turnstile) { turnstile.reset(); }
              if (submitBtn) {
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
              }
            }
          })
          .catch(() => {
            if (feedback) {
              feedback.style.display = 'block';
              feedback.textContent = 'Network error. Please try again or email info@prarasbiosciences.com directly.';
              feedback.style.color = '#C62828';
              feedback.style.background = '#FFEBEE';
            }
            if (submitBtn) {
              submitBtn.textContent = origText;
              submitBtn.disabled = false;
            }
          });
      });
    }

    // 4. Interactive Product Search Modal
    const searchModal = document.getElementById('site-search-modal');
    const searchInput = document.getElementById('site-search-input');
    const searchClear = document.getElementById('site-search-clear');
    const resultsList = document.getElementById('search-results-list');
    const filterBar = document.getElementById('search-filter-bar');
    const searchBtns = document.querySelectorAll('.nav-search-btn');

    function openSearch() {
      if (!searchModal) return;
      loadSearchCatalog();
      searchModal.classList.add('is-active');
      searchModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }, 50);
      renderSearchResults(searchInput ? searchInput.value.trim() : '');
    }

    function closeSearch() {
      if (!searchModal) return;
      searchModal.classList.remove('is-active');
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    searchBtns.forEach(btn => {
      btn.addEventListener('click', openSearch);
    });

    if (searchModal) {
      searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) closeSearch();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchInput.focus();
        renderSearchResults('');
      });
    }

    if (filterBar) {
      filterBar.addEventListener('click', function(e) {
        const chip = e.target.closest('.search-chip');
        if (!chip) return;
        filterBar.querySelectorAll('.search-chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeFilter = chip.getAttribute('data-filter') || 'all';
        renderSearchResults(searchInput ? searchInput.value.trim() : '');
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const q = searchInput.value.trim();
        if (searchClear) searchClear.style.display = q.length > 0 ? 'flex' : 'none';
        renderSearchResults(q);
      });
    }

    function renderSearchResults(query) {
      if (!resultsList || !searchCatalog) return;
      selectedIndex = -1;
      const q = query.toLowerCase();

      let filtered = searchCatalog.filter(item => {
        if (activeFilter !== 'all') {
          if (activeFilter === 'airbliss' && item.brand !== 'ab') return false;
          if (activeFilter !== 'airbliss' && !item.category.toLowerCase().includes(activeFilter)) return false;
        }
        if (!q) return true;
        return item.name.toLowerCase().includes(q) ||
               item.tagline.toLowerCase().includes(q) ||
               item.category.toLowerCase().includes(q) ||
               (item.keywords && item.keywords.includes(q)) ||
               (item.description && item.description.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        resultsList.innerHTML = `<div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <h3>No formulations found</h3>
          <p>We couldn't find matching solutions for "${escapeHtml(query)}". Try searching for <em>baking, enzyme, brewery, wastewater, or floor cleaner</em>.</p>
        </div>`;
        return;
      }

      resultsList.innerHTML = filtered.slice(0, 20).map((item, idx) => {
        let url = item.url;
        if (window.location.pathname.includes('/products/') && !url.startsWith('../')) {
          url = '../' + url;
        }
        return `<a href="${url}" class="search-item${idx === 0 ? ' is-selected' : ''}" role="option">
          <div class="search-item-info">
            <div class="search-item-header">
              <span class="search-item-title">${highlightQuery(item.name, q)}</span>
              <span class="search-item-badge">${item.category.split('>').pop().trim()}</span>
            </div>
            <div class="search-item-sub">${highlightQuery(item.tagline || item.description, q)}</div>
          </div>
          <div class="search-item-action">
            <span>View Specs</span>
            <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </a>`;
      }).join('');
    }

    function highlightQuery(text, query) {
      if (!query || !text) return escapeHtml(text || '');
      const clean = escapeHtml(text);
      const idx = clean.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return clean;
      const matched = clean.substr(idx, query.length);
      return clean.substring(0, idx) + '<strong style="color:var(--c-primary,#9A1D1E);background:rgba(154,29,30,0.1);padding:0 2px;border-radius:3px;">' + matched + '</strong>' + clean.substring(idx + query.length);
    }

    function escapeHtml(str) {
      return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const isOpen = searchModal && searchModal.classList.contains('is-active');
        if (isOpen) closeSearch();
        else openSearch();
      } else if (e.key === 'Escape') {
        if (searchModal && searchModal.classList.contains('is-active')) {
          closeSearch();
        }
      }
    });

    // 5. Universal Product Card Click Delegation
    document.addEventListener('click', function(e) {
      if (e.target.closest('button, a, input, select, textarea, .btn-quote, .btn-card-quote, .btn-prod-quote, .quote-drawer')) {
        return;
      }
      const card = e.target.closest('.prod-card, .prod-card-v2, .ab-prod-card, [data-url]');
      if (!card) return;

      navigateProduct(card, e);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSiteInteractions);
  } else {
    setupSiteInteractions();
  }
})();
