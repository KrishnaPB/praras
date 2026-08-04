/* ===== PRARAS Bio-Sciences — Exact Copy JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll ---
    const header = document.querySelector('.site-header');
    function onScroll() {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile toggle ---
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
            toggle.classList.toggle('active');
        });
    }

    // --- Counter animation ---
    const nums = document.querySelectorAll('.stat-num');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = +el.dataset.target;
                const dur = 2000;
                const start = performance.now();
                (function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(eased * target);
                    if (p < 1) requestAnimationFrame(tick);
                })(start);
                io.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    nums.forEach(n => io.observe(n));

    // --- Scroll reveal ---
    const cards = document.querySelectorAll('.why-item, .svc-card, .test-card, .prod-card, .who-card, .how-step, .ind-card');
    const revealIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                revealIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(30px)';
        c.style.transition = 'all 0.6s cubic-bezier(0.4,0,0.2,1)';
        revealIO.observe(c);
    });

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
});
