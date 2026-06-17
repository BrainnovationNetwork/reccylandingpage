// BN × Reccy recruiting landing page
//
// Centralizes UTM construction so no raw outbound URL ships in the HTML.
// On DOMContentLoaded, every <a data-cta-dest data-cta-content> gets its
// href rewritten to the fully-tagged Reccy URL. Edit the constants below
// if Reccy paths or UTM scheme change.

(function () {
  const RECCY_BASE = {
    signup: 'https://app.reccy.dev/sign-up',
    explore: 'https://neuro.reccy.dev/',
  };

  const UTM_BASE = {
    utm_source: 'brainnovation',
    utm_medium: 'partner_referral',
    utm_campaign: 'reccy_pilot_2026',
  };

  function buildCtaUrl(dest, content) {
    const base = RECCY_BASE[dest];
    if (!base) {
      console.warn('Unknown CTA destination:', dest);
      return '#';
    }
    const params = new URLSearchParams({ ...UTM_BASE, utm_content: content });
    return `${base}?${params.toString()}`;
  }

  function injectCtas() {
    document.querySelectorAll('[data-cta-dest]').forEach((el) => {
      const dest = el.dataset.ctaDest;
      const content = el.dataset.ctaContent;
      if (!dest || !content) return;
      el.setAttribute('href', buildCtaUrl(dest, content));
      el.setAttribute('rel', 'noopener');
      el.setAttribute('target', '_blank');
    });
  }

  function wireMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('primary-nav');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      const next = !open;
      toggle.setAttribute('aria-expanded', String(next));
      toggle.setAttribute('aria-label', next ? 'Close navigation' : 'Open navigation');
      links.setAttribute('data-open', String(next));
    });
  }

  function wireSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      a.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function setFooterYear() {
    const year = document.getElementById('footer-year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  // Reveal-on-scroll. Progressive enhancement: the hidden initial state only
  // applies once we add .reveal-on, so content stays visible if JS never runs.
  function wireReveal() {
    const root = document.querySelector('.bn-reccy');
    const items = document.querySelectorAll('.reveal');
    if (!root || !items.length) return;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return; // leave everything visible

    root.classList.add('reveal-on');

    let ioFired = false;
    const io = new IntersectionObserver((entries, obs) => {
      ioFired = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => io.observe(el));

    // Failsafe: IntersectionObserver is supported but never fires in some
    // environments (headless render contexts). If no callback has run, reveal
    // everything so content is never left stuck hidden.
    window.setTimeout(() => {
      if (!ioFired) items.forEach((el) => el.classList.add('is-visible'));
    }, 1200);
  }

  // Build the applicant unit-charts in the proof section. Each .dotgrid renders
  // `total` dots, the first `hit` of them marked relevant. Purely visual: the
  // numbers and copy still carry the meaning if this never runs.
  function buildProofGrids() {
    document.querySelectorAll('.dotgrid').forEach((grid) => {
      const total = parseInt(grid.dataset.total, 10) || 0;
      const hit = parseInt(grid.dataset.hit, 10) || 0;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        if (i < hit) dot.className = 'on';
        frag.appendChild(dot);
      }
      grid.appendChild(frag);
    });
  }

  // "How it works" carousel: one large tile at a time, the next peeking. Arrows
  // and dots drive a snap-scrolling track. Without JS the track still scrolls.
  function wireHowCarousel() {
    const scroller = document.querySelector('.how-scroll');
    if (!scroller) return;
    const steps = Array.prototype.slice.call(scroller.querySelectorAll('.step'));
    if (!steps.length) return;
    const prev = document.querySelector('.how-prev');
    const next = document.querySelector('.how-next');
    const dotsWrap = document.querySelector('.how-dots');

    const dots = steps.map((step, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'how-dot';
      b.setAttribute('aria-label', 'Go to step ' + (i + 1));
      b.addEventListener('click', () => go(i));
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function stride() {
      return steps.length > 1 ? steps[1].offsetLeft - steps[0].offsetLeft
                              : steps[0].getBoundingClientRect().width;
    }
    function index() { return Math.round(scroller.scrollLeft / stride()); }
    function setActive(i) {
      dots.forEach((d, j) => d.classList.toggle('on', j === i));
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= steps.length - 1;
    }
    function go(i) {
      const clamped = Math.max(0, Math.min(steps.length - 1, i));
      // Direct assignment animates via the scroller's CSS scroll-behavior where
      // supported, and degrades to an instant jump where it isn't.
      scroller.scrollLeft = clamped * stride();
      setActive(clamped); // immediate feedback, independent of the scroll event
    }
    if (prev) prev.addEventListener('click', () => go(index() - 1));
    if (next) next.addEventListener('click', () => go(index() + 1));
    let raf;
    scroller.addEventListener('scroll', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setActive(index()));
    });
    window.addEventListener('resize', () => setActive(index()));
    setActive(0);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectCtas();
    wireMobileNav();
    wireSmoothScroll();
    setFooterYear();
    buildProofGrids();
    wireHowCarousel();
    wireReveal();
  });
})();
