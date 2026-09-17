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

  var navBrandLogo = document.getElementById('nav-brand-logo') || document.querySelector('.nav-logo');
  if (navBrandLogo) {
    navBrandLogo.setAttribute('aria-label', isAb ? 'Airbliss Living Solutions Home' : 'Praras Biosciences Home');
  }

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
      const isSubdir = window.location.pathname.includes('/products/') || /^\/(?:es|zh|ru|fr|de|vi|th|id)(?:\/|$)/.test(window.location.pathname);
      const url = (isSubdir ? '../' : '') + 'assets/data/products-search.json';
      fetch(url)
        .then(r => r.json())
        .then(data => { searchCatalog = data; })
        .catch(e => console.warn('Could not load search catalog', e));
    }
  }

  function setupSiteInteractions() {
    loadSearchCatalog();

    var navBrandLogo = document.getElementById('nav-brand-logo') || document.querySelector('.nav-logo');
    if (navBrandLogo && document.body.classList.contains('ab')) {
      navBrandLogo.setAttribute('aria-label', 'Airbliss Living Solutions Home');
    }

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
      
      const feedback = document.getElementById('quote-feedback');
      if (feedback) feedback.style.display = 'none';

      overlay.classList.add('is-active');
      drawer.classList.add('is-active');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
      
      const firstInput = drawer.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
    window.openQuoteDrawer = openQuoteDrawer;

    function closeQuoteDrawer() {
      if (!drawer || !overlay) return;
      overlay.classList.remove('is-active');
      drawer.classList.remove('is-active');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      document.body.style.overflow = '';
      const feedback = document.getElementById('quote-feedback');
      if (feedback) feedback.style.display = 'none';
    }
    window.closeQuoteDrawer = closeQuoteDrawer;

    function showQuoteFeedback(msg, isSuccess) {
      const feedback = document.getElementById('quote-feedback');
      if (!feedback) return;
      feedback.style.display = 'block';
      feedback.style.background = isSuccess ? '#e8f5e9' : '#ffebee';
      feedback.style.color = isSuccess ? '#1b5e20' : '#b71c1c';
      feedback.style.border = isSuccess ? '1px solid #c8e6c9' : '1px solid #ffcdd2';
      feedback.textContent = msg;
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
              showQuoteFeedback(data.message || 'Thank you! Your quote enquiry has been received.', true);
              submitBtn.style.background = '#28a745';
              submitBtn.textContent = 'Enquiry Sent Successfully ✓';
              setTimeout(() => {
                quoteForm.reset();
                const fb = document.getElementById('quote-feedback');
                if (fb) fb.style.display = 'none';
                if (window.turnstile) { turnstile.reset(); }
                submitBtn.style.background = '';
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
                closeQuoteDrawer();
              }, 2200);
            } else {
              showQuoteFeedback(data.message || 'There was an issue submitting your request.', false);
              if (window.turnstile) { turnstile.reset(); }
              submitBtn.textContent = origText;
              submitBtn.disabled = false;
            }
          })
          .catch(() => {
            showQuoteFeedback('Network error. Please try again or email info@prarasbiosciences.com directly.', false);
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

    // 6. Global Multi-Language Engine (Phase 1 — Enterprise Robust)
    const SUPPORTED_LANGUAGES = {
      'en': { name: 'English', native: 'English', flag: 'EN', short: 'EN' },
      'es': { name: 'Spanish', native: 'Español', flag: 'ES', short: 'ES' },
      'zh-CN': { name: 'Chinese', native: '简体中文', flag: 'ZH', short: 'ZH' },
      'ru': { name: 'Russian', native: 'Русский', flag: 'RU', short: 'RU' },
      'fr': { name: 'French', native: 'Français', flag: 'FR', short: 'FR' },
      'de': { name: 'German', native: 'Deutsch', flag: 'DE', short: 'DE' },
      'vi': { name: 'Vietnamese', native: 'Tiếng Việt', flag: 'VI', short: 'VI' },
      'th': { name: 'Thai', native: 'ภาษาไทย', flag: 'TH', short: 'TH' },
      'id': { name: 'Indonesian', native: 'Bahasa Indonesia', flag: 'ID', short: 'ID' }
    };

    // Instant 0ms Navigation Micro-Dictionary
    const NAV_DICTIONARY = {
      'en': { about: 'About', products: 'Products', industries: 'Industries', services: 'Services', blog: 'Blog', careers: 'Careers', contact: 'Contact Us', trial: 'Request Trial', selectLang: 'Select Language' },
      'es': { about: 'Nosotros', products: 'Productos', industries: 'Industrias', services: 'Servicios', blog: 'Blog', careers: 'Carreras', contact: 'Contáctenos', trial: 'Solicitar Prueba', selectLang: 'Seleccionar Idioma' },
      'zh-CN': { about: '关于我们', products: '产品方案', industries: '应用行业', services: '技术服务', blog: '技术博客', careers: '招贤纳士', contact: '联系我们', trial: '申请试样', selectLang: '选择语言' },
      'ru': { about: 'О нас', products: 'Продукция', industries: 'Отрасли', services: 'Услуги', blog: 'Блог', careers: 'Карьера', contact: 'Контакты', trial: 'Заказать образец', selectLang: 'Выберите язык' },
      'fr': { about: 'À Propos', products: 'Produits', industries: 'Industries', services: 'Services', blog: 'Blog', careers: 'Carrières', contact: 'Contactez-nous', trial: 'Demander un Essai', selectLang: 'Choisir la Langue' },
      'de': { about: 'Über uns', products: 'Produkte', industries: 'Branchen', services: 'Dienstleistungen', blog: 'Blog', careers: 'Karriere', contact: 'Kontakt', trial: 'Muster anfordern', selectLang: 'Sprache wählen' },
      'vi': { about: 'Giới thiệu', products: 'Sản phẩm', industries: 'Ngành nghề', services: 'Dịch vụ', blog: 'Tin tức', careers: 'Tuyển dụng', contact: 'Liên hệ', trial: 'Yêu cầu mẫu', selectLang: 'Chọn ngôn ngữ' },
      'th': { about: 'เกี่ยวกับเรา', products: 'ผลิตภัณฑ์', industries: 'อุตสาหกรรม', services: 'บริการ', blog: 'บทความ', careers: 'ร่วมงานกับเรา', contact: 'ติดต่อเรา', trial: 'ขอทดลองใช้', selectLang: 'เลือกภาษา' },
      'id': { about: 'Tentang Kami', products: 'Produk', industries: 'Industri', services: 'Layanan', blog: 'Blog', careers: 'Karir', contact: 'Hubungi Kami', trial: 'Ajukan Uji Coba', selectLang: 'Pilih Bahasa' }
    };

    // Protect Brand Names, Trademarks, Emails & Badges from Mistranslation
    function applyBrandTranslationGuards() {
      document.querySelectorAll('.nav-logo, .nav-brand, .foot-brand, .trademark, .fsc-badge, .ab-hero-badge, a[href^="mailto:"], a[href^="tel:"], .foot-email, .foot-phone').forEach(function(el) {
        el.classList.add('notranslate');
        el.setAttribute('translate', 'no');
      });
    }
    applyBrandTranslationGuards();

    // Phase 2 Multilingual Static Subdirectories Routing Configuration
    const CORE_STATIC_PAGES = {
      '': 'index.html',
      'index.html': 'index.html',
      'about.html': 'about.html',
      'airbliss.html': 'airbliss.html',
      'industry.html': 'industry.html',
      'services.html': 'services.html',
      'contract_manufacturing.html': 'contract_manufacturing.html',
      'troubleshooting.html': 'troubleshooting.html',
      'contact.html': 'contact.html',
      'breweries.html': 'breweries.html',
      'distilleries.html': 'distilleries.html',
      'microbrewery.html': 'microbrewery.html',
      'wine.html': 'wine.html',
      'biscuits-cookies.html': 'biscuits-cookies.html',
      'bread-buns-pizza-base.html': 'bread-buns-pizza-base.html',
      'pasta-and-noodles.html': 'pasta-and-noodles.html',
      'meat.html': 'meat.html',
      'mayonnaise.html': 'mayonnaise.html',
      'milk-based.html': 'milk-based.html',
      'chocolate-coffee.html': 'chocolate-coffee.html',
      'fruit-based.html': 'fruit-based.html',
      'extruded-fried-snacks.html': 'extruded-fried-snacks.html',
      'wafers.html': 'wafers.html',
      'preccel-93.html': 'preccel-93.html',
      'egg-free-nougat.html': 'egg-free-nougat.html',
      'microbial-solutions.html': 'microbial-solutions.html',
      'careers.html': 'careers.html',
      'privacy-policy.html': 'privacy-policy.html'
    };

    const LANG_CODE_TO_SUBDIR = {
      'en': '',
      'es': 'es',
      'zh-CN': 'zh',
      'zh': 'zh',
      'ru': 'ru',
      'fr': 'fr',
      'de': 'de',
      'vi': 'vi',
      'th': 'th',
      'id': 'id'
    };

    const SUBDIR_TO_LANG_CODE = {
      'es': 'es',
      'zh': 'zh-CN',
      'ru': 'ru',
      'fr': 'fr',
      'de': 'de',
      'vi': 'vi',
      'th': 'th',
      'id': 'id'
    };

    function getCurrentStaticInfo() {
      var rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
      var parts = rawPath ? rawPath.split('/') : [];
      var curLang = 'en';
      var curPage = null;

      if (parts.length > 0 && SUBDIR_TO_LANG_CODE[parts[0]]) {
        curLang = SUBDIR_TO_LANG_CODE[parts[0]];
        var subPage = parts[1] || '';
        if (CORE_STATIC_PAGES.hasOwnProperty(subPage)) {
          curPage = CORE_STATIC_PAGES[subPage];
        }
      } else {
        var rootPage = parts[0] || '';
        if (CORE_STATIC_PAGES.hasOwnProperty(rootPage)) {
          curPage = CORE_STATIC_PAGES[rootPage];
        }
      }
      return { lang: curLang, page: curPage };
    }

    function applyInstantNavTranslation(langCode) {
      const dict = NAV_DICTIONARY[langCode] || NAV_DICTIONARY['en'];
      
      const aboutLink = document.querySelector('.nav-links a[href*="about.html"]');
      if (aboutLink) aboutLink.textContent = dict.about;

      const prodBtn = document.getElementById('products-dropdown-btn');
      if (prodBtn) {
        const svg = prodBtn.querySelector('svg');
        prodBtn.childNodes[0].nodeValue = dict.products + ' ';
      }

      const indLink = document.querySelector('.nav-links a[href*="industry.html"]');
      if (indLink) indLink.textContent = dict.industries;

      const servBtn = document.getElementById('services-dropdown-btn');
      if (servBtn) {
        servBtn.childNodes[0].nodeValue = dict.services + ' ';
      }

      const blogLink = document.querySelector('.nav-links a[href*="blog.html"]');
      if (blogLink) blogLink.textContent = dict.blog;

      const careersLink = document.querySelector('.nav-links a[href*="careers.html"]');
      if (careersLink) careersLink.textContent = dict.careers;

      const contactBtn = document.querySelector('.nav-cta.pr-only');
      if (contactBtn) contactBtn.textContent = dict.contact;

      const trialBtn = document.querySelector('.nav-cta.ab-only');
      if (trialBtn) trialBtn.textContent = dict.trial;

      const langHdr = document.querySelector('.lang-dropdown-header > span:first-child');
      if (langHdr) langHdr.textContent = dict.selectLang;
    }

    function showLanguageToast(msg) {
      let toast = document.getElementById('lang-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'lang-toast';
        toast.className = 'lang-toast notranslate';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('is-visible');
      setTimeout(function() {
        toast.classList.remove('is-visible');
      }, 3500);
    }

    function getCookie(name) {
      const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return v ? v[2] : null;
    }

    function setLanguageCookie(langCode) {
      const domain = window.location.hostname;
      const domainParts = domain.split('.');
      const rootDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : domain;

      if (langCode === 'en') {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + domain + "; SameSite=Lax;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + rootDomain + "; SameSite=Lax;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.prarasbiosciences.com; SameSite=Lax;";
      } else {
        const val = '/en/' + langCode;
        document.cookie = "googtrans=" + val + "; path=/; SameSite=Lax;";
        document.cookie = "googtrans=" + val + "; path=/; domain=" + domain + "; SameSite=Lax;";
        document.cookie = "googtrans=" + val + "; path=/; domain=." + rootDomain + "; SameSite=Lax;";
        document.cookie = "googtrans=" + val + "; path=/; domain=.prarasbiosciences.com; SameSite=Lax;";
      }
    }

    window.googleTranslateElementInit = function() {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es,zh-CN,ru,fr,de,vi,th,id',
          autoDisplay: false
        }, 'google_translate_element');
      }
    };

    function ensureGoogleTranslateLoaded(callback, errCallback) {
      if (window.google && window.google.translate) {
        if (callback) callback();
        return;
      }
      if (document.getElementById('google-translate-script')) {
        let waitCount = 0;
        const checkInt = setInterval(function() {
          waitCount++;
          if (window.google && window.google.translate) {
            clearInterval(checkInt);
            if (callback) callback();
          } else if (waitCount > 45) { // 4.5s timeout
            clearInterval(checkInt);
            if (errCallback) errCallback();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;

      script.onerror = function() {
        if (errCallback) errCallback();
      };

      script.onload = function() {
        let waitCount = 0;
        const checkInt = setInterval(function() {
          waitCount++;
          if (window.google && window.google.translate) {
            clearInterval(checkInt);
            if (callback) callback();
          } else if (waitCount > 40) {
            clearInterval(checkInt);
            if (errCallback) errCallback();
          }
        }, 100);
      };

      document.head.appendChild(script);
    }

    function setTranslatingState(isTranslating) {
      const wrap = document.getElementById('lang-selector');
      if (wrap) {
        wrap.classList.toggle('is-translating', !!isTranslating);
      }
    }

    function updateLanguageUI(langCode) {
      const info = SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES['en'];
      const currentText = document.getElementById('lang-current-text');
      if (currentText) {
        currentText.textContent = info.short;
      }
      document.querySelectorAll('.lang-opt').forEach(function(opt) {
        const isCur = opt.getAttribute('data-lang') === langCode;
        opt.classList.toggle('is-active', isCur);
        opt.setAttribute('aria-selected', isCur ? 'true' : 'false');
      });
      applyInstantNavTranslation(langCode);
    }

    function changeLanguage(langCode) {
      const staticInfo = getCurrentStaticInfo();
      if (staticInfo && staticInfo.page) {
        // 1. Static Core Page: Direct navigation to dedicated SEO directory
        const targetSubdir = LANG_CODE_TO_SUBDIR[langCode];
        const targetPageSlug = staticInfo.page === 'index.html' ? '' : staticInfo.page;
        let targetUrl = targetSubdir ? ('/' + targetSubdir + '/' + targetPageSlug) : ('/' + targetPageSlug);

        // Normalize current pathname
        const curPath = window.location.pathname.replace(/\/+$/, '') || '/';
        const normTarget = targetUrl.replace(/\/+$/, '') || '/';

        closeLanguageDropdown();
        try { localStorage.setItem('praras_lang', langCode); } catch(e){}
        setLanguageCookie(langCode);

        if (curPath !== normTarget) {
          window.location.href = targetUrl;
        }
        return;
      }

      // 2. Dynamic / Non-Core Pages: Fallback to Phase 1 Client-Side Engine
      let current = 'en';
      try { current = localStorage.getItem('praras_lang') || 'en'; } catch(e){}
      if (langCode === current) {
        closeLanguageDropdown();
        return;
      }

      updateLanguageUI(langCode);
      closeLanguageDropdown();
      setLanguageCookie(langCode);
      try { localStorage.setItem('praras_lang', langCode); } catch(e){}

      if (langCode === 'en') {
        window.location.reload();
        return;
      }

      setTranslatingState(true);

      ensureGoogleTranslateLoaded(function() {
        let count = 0;
        const checkCombo = setInterval(function() {
          count++;
          const select = document.querySelector('.goog-te-combo');
          if (select) {
            clearInterval(checkCombo);
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
            setTimeout(function() { setTranslatingState(false); }, 700);
          } else if (count > 40) {
            clearInterval(checkCombo);
            setTranslatingState(false);
            window.location.reload();
          }
        }, 100);
      }, function() {
        setTranslatingState(false);
        showLanguageToast('Translation service unavailable. Please check your connection.');
        updateLanguageUI('en');
        setLanguageCookie('en');
        try { localStorage.setItem('praras_lang', 'en'); } catch(e){}
      });
    }
    window.changeLanguage = changeLanguage;

    function toggleLanguageDropdown() {
      const wrap = document.getElementById('lang-selector');
      const btn = document.getElementById('lang-trigger-btn');
      if (!wrap) return;
      const isOpen = wrap.classList.contains('is-active');
      wrap.classList.toggle('is-active', !isOpen);
      if (btn) btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      if (!isOpen) {
        ensureGoogleTranslateLoaded();
        // Focus first option on open for screen readers
        const firstOpt = wrap.querySelector('.lang-opt.is-active') || wrap.querySelector('.lang-opt');
        if (firstOpt) setTimeout(function() { firstOpt.focus(); }, 150);
      }
    }

    function closeLanguageDropdown() {
      const wrap = document.getElementById('lang-selector');
      const btn = document.getElementById('lang-trigger-btn');
      if (wrap) wrap.classList.remove('is-active');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    // Ensure spinner is present in trigger button
    const triggerBtn = document.getElementById('lang-trigger-btn');
    if (triggerBtn) {
      if (!triggerBtn.querySelector('.lang-spinner')) {
        const sp = document.createElement('span');
        sp.className = 'lang-spinner';
        sp.setAttribute('aria-hidden', 'true');
        triggerBtn.insertBefore(sp, triggerBtn.childNodes[1] || null);
      }
      if (!triggerBtn._hasLangListener) {
        triggerBtn._hasLangListener = true;
        triggerBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleLanguageDropdown();
        });
      }
    }

    // Bind Option Buttons with Full Keyboard Accessibility
    const langOpts = Array.from(document.querySelectorAll('.lang-opt'));
    langOpts.forEach(function(opt, idx) {
      if (!opt._hasLangListener) {
        opt._hasLangListener = true;
        opt.addEventListener('click', function(e) {
          e.stopPropagation();
          const lang = this.getAttribute('data-lang');
          if (lang) changeLanguage(lang);
        });

        // Arrow Key & Home/End/Escape Navigation (WCAG 2.1)
        opt.addEventListener('keydown', function(e) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = langOpts[(idx + 1) % langOpts.length];
            if (next) next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = langOpts[(idx - 1 + langOpts.length) % langOpts.length];
            if (prev) prev.focus();
          } else if (e.key === 'Home') {
            e.preventDefault();
            langOpts[0].focus();
          } else if (e.key === 'End') {
            e.preventDefault();
            langOpts[langOpts.length - 1].focus();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closeLanguageDropdown();
            if (triggerBtn) triggerBtn.focus();
          }
        });
      }
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#lang-selector')) {
        closeLanguageDropdown();
      }
    });

    // Close on Escape key anywhere
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeLanguageDropdown();
      }
    });

    // Auto-restore / detect language preference on load
    const staticInfo = getCurrentStaticInfo();
    if (staticInfo && staticInfo.lang && staticInfo.lang !== 'en') {
      // Current page is a dedicated static localized subdirectory (e.g. /es/, /de/)
      updateLanguageUI(staticInfo.lang);
      try { localStorage.setItem('praras_lang', staticInfo.lang); } catch(e){}
      setLanguageCookie(staticInfo.lang);
      // No Google Translate needed because this static page is already fully localized!
    } else {
      let savedLang = 'en';
      try { savedLang = localStorage.getItem('praras_lang') || 'en'; } catch(e){}
      const cTrans = getCookie('googtrans');
      if (cTrans) {
        const parts = cTrans.split('/');
        if (parts.length > 2 && SUPPORTED_LANGUAGES[parts[2]]) {
          savedLang = parts[2];
        }
      }

      if (savedLang && savedLang !== 'en' && SUPPORTED_LANGUAGES[savedLang]) {
        if (staticInfo && staticInfo.page) {
          // It's a static core page in English; maintain native UI
          updateLanguageUI('en');
        } else {
          // Dynamic product page, apply Google Translate
          updateLanguageUI(savedLang);
          setTranslatingState(true);
          ensureGoogleTranslateLoaded(function() {
            let count = 0;
            const checkCombo = setInterval(function() {
              count++;
              const select = document.querySelector('.goog-te-combo');
              if (select) {
                clearInterval(checkCombo);
                if (select.value !== savedLang) {
                  select.value = savedLang;
                  select.dispatchEvent(new Event('change'));
                }
                setTimeout(function() { setTranslatingState(false); }, 600);
              }
              if (count > 45) {
                clearInterval(checkCombo);
                setTranslatingState(false);
              }
            }, 100);
          }, function() {
            setTranslatingState(false);
          });
        }
      } else {
        updateLanguageUI('en');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSiteInteractions);
  } else {
    setupSiteInteractions();
  }
})();

