/* ============================================
   ALIP FISHING JOURNEY — script.js
   ============================================ */

'use strict';

/* ── Page Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  }
});

/* ── Navbar ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const isDarkPage = navbar.classList.contains('dark-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      if (!isDarkPage) navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  navbar.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Back to Top ── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
})();

/* ── Hero Particles ── */
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${30 + Math.random() * 50}%;
      --dur: ${4 + Math.random() * 6}s;
      --delay: ${Math.random() * 6}s;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
    `;
    container.appendChild(p);
  }
})();

/* ── Counter Animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ── Catches Page ── */
(function initCatches() {
  const grid = document.getElementById('catches-grid');
  if (!grid) return;

  const searchInput = document.getElementById('catches-search');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let activeFilter = 'all';
  let searchQuery = '';

  function filterCards() {
    const cards = grid.querySelectorAll('.fish-card');
    let visible = 0;
    cards.forEach(card => {
      const species = card.dataset.species || '';
      const name = card.querySelector('.fish-card-name')?.textContent.toLowerCase() || '';
      const location = card.querySelector('.fish-card-location')?.textContent.toLowerCase() || '';
      const matchesFilter = activeFilter === 'all' || species === activeFilter;
      const matchesSearch = !searchQuery || name.includes(searchQuery) || location.includes(searchQuery) || species.includes(searchQuery);
      const show = matchesFilter && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const noRes = document.getElementById('no-results');
    if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      filterCards();
    });
  });
})();

/* ── Lightbox ── */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg = document.getElementById('lb-img');
  const lbPlaceholder = document.getElementById('lb-placeholder');
  const lbTitle = document.getElementById('lb-title');
  const lbSub = document.getElementById('lb-sub');

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      const title = card.dataset.title || '';
      const sub = card.dataset.sub || '';
      const emoji = card.dataset.emoji || '🐟';
      const color = card.dataset.color || 'linear-gradient(135deg, #1a4a6e, #2d7ab5)';

      if (lbImg) {
        lbImg.src = imgSrc || '';
        lbImg.style.display = imgSrc ? 'block' : 'none';
      }
      if (lbPlaceholder) {
        lbPlaceholder.style.display = imgSrc ? 'none' : 'flex';
        lbPlaceholder.style.background = color;
        lbPlaceholder.textContent = emoji;
      }
      if (lbTitle) lbTitle.textContent = title;
      if (lbSub) lbSub.textContent = sub;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('lb-close')?.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ── Documentation Tabs ── */
(function initDocTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.doc-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
})();

/* ── Map Page ── */


 (function initMap() {

  const mapEl = document.getElementById('fishing-map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('fishing-map');

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: '&copy; Esri'
    }
  ).addTo(map);

  function toDMS(coord, isLat) {
  const abs = Math.abs(coord);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(2);

  const dir = isLat
    ? (coord >= 0 ? 'N' : 'S')
    : (coord >= 0 ? 'E' : 'W');

  return `${deg}°${min}'${sec}"${dir}`;
}

omnivore.kml('peta.kml')
  .on('ready', function () {

    map.fitBounds(this.getBounds());

    this.eachLayer(function(layer) {

      if (!layer.getLatLng) return;

      const latlng = layer.getLatLng();

      const latDMS = toDMS(latlng.lat, true);
      const lngDMS = toDMS(latlng.lng, false);

      const googleEarthUrl =
        `https://earth.google.com/web/search/${latlng.lat},${latlng.lng}`;

      layer.bindPopup(`
        <div style="min-width:220px">

          <h3 style="margin:0 0 12px 0">
            📍 spot 🐟
          </h3>

          <div style="font-size:14px;color:#666;">
            Lokasi
          </div>

          <div style="margin-top:6px;font-weight:600;">
            ${latDMS} ${lngDMS}
          </div>

          <hr style="margin:12px 0">

          <a href="${googleEarthUrl}"
             target="_blank"
             style="
                display:block;
                text-align:center;
                padding:10px;
                background:#1976d2;
                color:white;
                text-decoration:none;
                border-radius:8px;
             ">
             🌍 Buka di Google Earth
          </a>

        </div>
      `);

    });

  })
  .addTo(map);

})();

  
  

/* ── Smooth internal anchor scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
