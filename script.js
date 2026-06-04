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

  const spots = [
    {
      id: 'progo',
      name: 'Sungai Progo',
      lat: -7.7956, lng: 110.2041,
      region: 'Kulon Progo, DIY',
      fish: ['Ikan Mas', 'Nila', 'Gabus'],
      catches: 24,
      img: 'images/spots/spot-progo.jpg',
      emoji: '🏞️',
      note: 'Spot terbaik di pagi hari antara pukul 05.00–08.00. Arus sedang, air jernih.',
      color: 'linear-gradient(135deg, #1a4a6e, #2d7ab5)',
    },
    {
      id: 'opak',
      name: 'Sungai Opak',
      lat: -7.8774, lng: 110.3617,
      region: 'Bantul, DIY',
      fish: ['Patin', 'Lele', 'Nila'],
      catches: 18,
      img: 'images/spots/spot-opak.jpg',
      emoji: '🌿',
      note: 'Spot favorit sore hari. Banyak semak di tepi sungai, cocok untuk casting.',
      color: 'linear-gradient(135deg, #2d5016, #4a7c24)',
    },
    {
      id: 'code',
      name: 'Sungai Code',
      lat: -7.7971, lng: 110.3686,
      region: 'Kota Yogyakarta, DIY',
      fish: ['Nila', 'Ikan Mas', 'Betok'],
      catches: 31,
      img: 'images/spots/spot-code.jpg',
      emoji: '🏙️',
      note: 'Spot urban yang ramai. Ikan banyak di bawah jembatan lama.',
      color: 'linear-gradient(135deg, #0d2b42, #1a4a6e)',
    },
    {
      id: 'oya',
      name: 'Sungai Oya',
      lat: -7.9432, lng: 110.5012,
      region: 'Gunung Kidul, DIY',
      fish: ['Gabus', 'Patin', 'Baung'],
      catches: 12,
      img: 'images/spots/spot-oya.jpg',
      emoji: '🪨',
      note: 'Spot terpencil berbatu. Perlu jalan kaki 20 menit. Hasil memuaskan.',
      color: 'linear-gradient(135deg, #3d2800, #8c6020)',
    },
    {
      id: 'bogowonto',
      name: 'Sungai Bogowonto',
      lat: -7.7321, lng: 110.0145,
      region: 'Purworejo, Jawa Tengah',
      fish: ['Nila', 'Tawes', 'Ikan Mas'],
      catches: 20,
      img: 'images/spots/spot-bogowonto.jpg',
      emoji: '🌄',
      note: 'Pemandangan sawah yang indah. Arus deras saat musim hujan.',
      color: 'linear-gradient(135deg, #1a3d00, #4a7c24)',
    },
  ];

  // Init map
  const map = L.map('fishing-map', {
    center: [-7.85, 110.28],
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  // Tile layer (OSM)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  // Custom icon
  function createIcon(emoji) {
    return L.divIcon({
      className: '',
      html: `<div class="custom-marker"><div class="custom-marker-inner">${emoji}</div></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -40],
    });
  }

  // Add markers
  spots.forEach(spot => {
    const fishTags = spot.fish.map(f => `<span class="fish-tag">${f}</span>`).join('');
    const popupHtml = `
      <div class="map-popup">
        <div class="map-popup-img">
          <div class="map-popup-placeholder" style="background:${spot.color}">${spot.emoji}</div>
        </div>
        <div class="map-popup-body">
          <div class="map-popup-name">${spot.name}</div>
          <div class="map-popup-fish">${fishTags}</div>
          <div class="map-popup-stat">📍 ${spot.region}</div>
          <div class="map-popup-stat">🎣 ${spot.catches} tangkapan tercatat</div>
          <div class="map-popup-note">"${spot.note}"</div>
          <a href="https://earth.google.com/web/search/${encodeURIComponent(spot.name + ' ' + spot.region)}" target="_blank" class="map-popup-btn">
            🌍 Lihat di Google Earth
          </a>
        </div>
      </div>
    `;
    const marker = L.marker([spot.lat, spot.lng], { icon: createIcon(spot.emoji) })
      .addTo(map)
      .bindPopup(popupHtml, { maxWidth: 280, minWidth: 240 });

    // Sidebar item click
    const sidebarItem = document.querySelector(`[data-spot="${spot.id}"]`);
    if (sidebarItem) {
      sidebarItem.addEventListener('click', () => {
        document.querySelectorAll('.spot-item').forEach(s => s.classList.remove('active'));
        sidebarItem.classList.add('active');
        map.flyTo([spot.lat, spot.lng], 13, { duration: 1.2 });
        setTimeout(() => marker.openPopup(), 1300);
      });
    }
  });
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
