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


/* =============================================================
   錦鯉 — Japanese Koi Pond  |  script.js
   All rendering via HTML5 Canvas API — no libraries
   ============================================================= */

(function () {
  'use strict';

  /* ── Canvas setup ── */
  const canvas = document.getElementById('pond');
  const ctx    = canvas.getContext('2d');

  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildCaustics();
    buildLotus();
  }
  window.addEventListener('resize', resize);

  let t = 0;

  /* ══════════════════════════════════════════
     CAUSTICS
  ══════════════════════════════════════════ */
  const CAUSTIC_COUNT = 18;
  let caustics = [];

  function buildCaustics() {
    caustics = [];
    for (let i = 0; i < CAUSTIC_COUNT; i++) {
      caustics.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     40 + Math.random() * 110,
        spd:   0.0003 + Math.random() * 0.0005,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.03 + Math.random() * 0.06,
        drift: { x: (Math.random()-0.5)*0.15, y: (Math.random()-0.5)*0.12 },
      });
    }
  }

  function drawCaustics(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const c of caustics) {
      const pulse = 0.7 + 0.3 * Math.sin(time * c.spd * 1000 + c.phase);
      const r = c.r * pulse;
      c.x += c.drift.x; c.y += c.drift.y;
      if (c.x < -r) c.x = W + r;
      if (c.x > W+r) c.x = -r;
      if (c.y < -r) c.y = H + r;
      if (c.y > H+r) c.y = -r;

      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
      g.addColorStop(0,   `rgba(160,240,255,${c.alpha * pulse})`);
      g.addColorStop(0.4, `rgba(80,200,240,${c.alpha * 0.4 * pulse})`);
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, r, r * 0.6, time * c.spd * 0.5, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ══════════════════════════════════════════
     BUBBLES
  ══════════════════════════════════════════ */
  const bubbles = [];
  const MAX_BUBBLES = 28;

  function spawnBubble() {
    if (bubbles.length >= MAX_BUBBLES) return;
    bubbles.push({
      x:         Math.random() * W,
      y:         H + 10,
      r:         1.5 + Math.random() * 3.5,
      spd:       0.3 + Math.random() * 0.6,
      wobble:    Math.random() * Math.PI * 2,
      wobbleSpd: 0.02 + Math.random() * 0.03,
      alpha:     0.3 + Math.random() * 0.4,
    });
  }

  function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.y -= b.spd;
      b.wobble += b.wobbleSpd;
      b.x += Math.sin(b.wobble) * 0.4;
      if (b.y < -10) bubbles.splice(i, 1);
    }
    if (Math.random() < 0.04) spawnBubble();
  }

  function drawBubbles() {
    ctx.save();
    for (const b of bubbles) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(200,240,255,${b.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x - b.r*0.3, b.y - b.r*0.3, b.r*0.25, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${b.alpha * 0.8})`;
      ctx.fill();
    }
    ctx.restore();
  }

  /* ══════════════════════════════════════════
     RIPPLES
  ══════════════════════════════════════════ */
  const ripples = [];

  function addRipple(x, y) {
    for (let i = 0; i < 3; i++) {
      ripples.push({
        x, y,
        r:         i * 8,
        maxR:      80 + i * 50,
        alpha:     0.6 - i * 0.1,
        spd:       2.5 + i * 0.8,
        lineWidth: 1.5 - i * 0.3,
      });
    }
  }

  function updateRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.spd;
      rp.alpha -= 0.007 * rp.spd;
      if (rp.alpha <= 0 || rp.r > rp.maxR) ripples.splice(i, 1);
    }
  }

  function drawRipples() {
    ctx.save();
    for (const rp of ripples) {
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(200,245,255,${rp.alpha})`;
      ctx.lineWidth = rp.lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ══════════════════════════════════════════
     LOTUS / PLANTS
  ══════════════════════════════════════════ */
  let lotusData = [];

  function buildLotus() {
    lotusData = [];
    const corners = [
      { x: W * 0.04, y: H * 0.05 },
      { x: W * 0.92, y: H * 0.06 },
      { x: W * 0.05, y: H * 0.88 },
      { x: W * 0.88, y: H * 0.90 },
    ];
    for (const c of corners) {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        lotusData.push({
          x:        c.x + (Math.random()-0.5)*W*0.07,
          y:        c.y + (Math.random()-0.5)*H*0.07,
          r:        22 + Math.random() * 30,
          rotation: Math.random() * Math.PI * 2,
          color:    Math.random() < 0.15 ? '#e8b4c0' : (Math.random() < 0.5 ? '#3a8c50' : '#2d7040'),
          phase:    Math.random() * Math.PI * 2,
          isFlower: Math.random() < 0.2,
        });
      }
      const grassN = 6 + Math.floor(Math.random() * 8);
      for (let i = 0; i < grassN; i++) {
        lotusData.push({
          grass: true,
          x:     c.x + (Math.random()-0.5)*W*0.09,
          y:     c.y + (Math.random()-0.5)*H*0.09,
          len:   12 + Math.random() * 24,
          angle: -Math.PI/2 + (Math.random()-0.5)*1.2,
          color: `rgba(${30+Math.floor(Math.random()*40)},${100+Math.floor(Math.random()*60)},${40+Math.floor(Math.random()*30)},0.85)`,
          phase: Math.random() * Math.PI * 2,
          width: 1 + Math.random() * 2,
        });
      }
    }
  }

  function drawLotus(time) {
    ctx.save();
    for (const l of lotusData) {
      if (l.grass) {
        const sway  = Math.sin(time * 0.8 + l.phase) * 0.08;
        const angle = l.angle + sway;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + Math.cos(angle)*l.len, l.y + Math.sin(angle)*l.len);
        ctx.strokeStyle = l.color;
        ctx.lineWidth   = l.width;
        ctx.lineCap     = 'round';
        ctx.stroke();
        continue;
      }

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation + Math.sin(time * 0.4 + l.phase) * 0.03);

      if (l.isFlower) {
        const petals = 8;
        for (let p = 0; p < petals; p++) {
          const a = (p / petals) * Math.PI * 2;
          ctx.save();
          ctx.rotate(a);
          ctx.beginPath();
          ctx.ellipse(0, -l.r * 0.55, l.r * 0.2, l.r * 0.45, 0, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(240,180,200,0.75)';
          ctx.fill();
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, l.r * 0.2, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(240,210,100,0.85)';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, l.r, 0.3, Math.PI * 2 - 0.3);
        ctx.closePath();
        ctx.fillStyle = l.color.startsWith('#') ? hexToRgba(l.color, 0.72) : l.color;
        ctx.fill();
        ctx.strokeStyle = hexToRgba('#1a5c30', 0.5);
        ctx.lineWidth   = 1;
        ctx.stroke();
        for (let v = 0; v < 6; v++) {
          const va = (v / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(va)*l.r*0.9, Math.sin(va)*l.r*0.9);
          ctx.strokeStyle = 'rgba(0,80,30,0.2)';
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ══════════════════════════════════════════
     KOI FISH
  ══════════════════════════════════════════ */
  const KOI_COUNT = 17;
  const kois = [];

  const KOI_VARIETIES = [
    { base: '#f5f0e8', patches: ['#d44020','#c03010'], fin: 'rgba(245,230,220,0.85)' },
    { base: '#f5f0e8', patches: ['#e03818','#b82808'], fin: 'rgba(245,230,220,0.85)' },
    { base: '#f0c030', patches: ['#e8a820','#c8880a'], fin: 'rgba(255,210,80,0.8)'  },
    { base: '#f5d060', patches: ['#e0b030','#c09010'], fin: 'rgba(255,220,100,0.8)' },
    { base: '#1a1a1a', patches: ['#cc2810','#ffffff'], fin: 'rgba(80,60,60,0.8)'    },
    { base: '#222222', patches: ['#dd3010','#f0f0f0'], fin: 'rgba(80,60,60,0.8)'    },
    { base: '#f0ede0', patches: ['#1a1a1a','#2a2a2a'], fin: 'rgba(240,235,220,0.85)'},
    { base: '#f5f2ea', patches: ['#d03010','#f5f2ea'], fin: 'rgba(245,235,225,0.85)'},
  ];

  function createKoi(i) {
    const variety = KOI_VARIETIES[i % KOI_VARIETIES.length];
    const bodyLen = 38 + Math.random() * 32;
    const angle   = Math.random() * Math.PI * 2;
    return {
      x:            W * 0.2 + Math.random() * W * 0.6,
      y:            H * 0.2 + Math.random() * H * 0.6,
      angle:        angle,
      len:          bodyLen,
      width:        bodyLen * 0.38,
      spd:          0.5 + Math.random() * 1.0,
      baseSpd:      0.5 + Math.random() * 1.0,
      variety,
      tailPhase:    Math.random() * Math.PI * 2,
      tailSpd:      0.06 + Math.random() * 0.04,
      finPhase:     Math.random() * Math.PI * 2,
      bodyWobble:   0,
      wobblePhase:  Math.random() * Math.PI * 2,
      // nudge: short-lived gentle deflection from tap
      nudgeTimer:   0,
      nudgeAngle:   angle,
      wanderTimer:  Math.random() * 120,
      wanderAngle:  angle,
      patches:      buildPatches(variety, bodyLen),
      bubbleTimer:  Math.random() * 60,
      trailBubbles: Math.random() < 0.4,
    };
  }

  function buildPatches(variety, len) {
    const count = 1 + Math.floor(Math.random() * 3);
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push({
        tx:       -0.3 + Math.random() * 0.6,
        ty:       (Math.random() - 0.5) * 0.5,
        rx:       (0.1 + Math.random() * 0.2) * len,
        ry:       (0.08 + Math.random() * 0.14) * len,
        color:    variety.patches[Math.floor(Math.random() * variety.patches.length)],
        rotation: Math.random() * Math.PI,
      });
    }
    return out;
  }

  function initKois() {
    for (let i = 0; i < KOI_COUNT; i++) kois.push(createKoi(i));
  }

  function updateKois() {
    for (const k of kois) {

      /* ── Speed: always calm ── */
      k.spd += (k.baseSpd - k.spd) * 0.04;

      /* ── Nudge timer decay ── */
      if (k.nudgeTimer > 0) k.nudgeTimer--;

      /* ── Wander: mix small drift with occasional full random reset ── */
      k.wanderTimer--;
      if (k.wanderTimer <= 0) {
        if (Math.random() < 0.45) {
          // Full random direction — breaks corner-hugging tendency
          k.wanderAngle = Math.random() * Math.PI * 2;
        } else {
          // Small drift from current heading
          k.wanderAngle = k.angle + (Math.random() - 0.5) * 1.4;
        }
        k.wanderTimer = 60 + Math.random() * 120;
      }

      /* ── Edge avoidance — graduated force, resets wanderAngle directly ── */
      const safeMargin = 120; // px from edge where steering kicks in
      const hardMargin = 40;  // px — strong push
      let edgePush = false;

      const toRight  = k.x / safeMargin;           // 0 at left edge → 1 at safeMargin
      const toLeft   = (W - k.x) / safeMargin;
      const toBottom = k.y / safeMargin;
      const toTop    = (H - k.y) / safeMargin;

      // Compute repulsion vector from all nearby edges
      let repX = 0, repY = 0;
      if (k.x < safeMargin)     { repX += (1 - toRight);  edgePush = true; }
      if (k.x > W - safeMargin) { repX -= (1 - toLeft);   edgePush = true; }
      if (k.y < safeMargin)     { repY += (1 - toBottom);  edgePush = true; }
      if (k.y > H - safeMargin) { repY -= (1 - toTop);    edgePush = true; }

      if (edgePush && (repX !== 0 || repY !== 0)) {
        const repAngle = Math.atan2(repY, repX);
        // Closer to hard margin → stronger override
        const nearEdge = (
          k.x < hardMargin || k.x > W - hardMargin ||
          k.y < hardMargin || k.y > H - hardMargin
        );
        const strength = nearEdge ? 0.85 : 0.35;
        k.wanderAngle = lerpAngle(k.wanderAngle, repAngle, strength);
      }

      /* ── Effective desired angle: apply nudge on top ── */
      let desiredAngle = k.wanderAngle;
      if (k.nudgeTimer > 0) {
        const w = (k.nudgeTimer / 44) * 0.5;
        desiredAngle = lerpAngle(k.wanderAngle, k.nudgeAngle, w);
      }

      /* ── Separation from other kois ── */
      for (const other of kois) {
        if (other === k) continue;
        const dx   = k.x - other.x;
        const dy   = k.y - other.y;
        const d    = Math.sqrt(dx*dx + dy*dy);
        const minD = (k.len + other.len) * 0.55;
        if (d < minD && d > 0.1) {
          desiredAngle = lerpAngle(desiredAngle, Math.atan2(dy, dx), 0.06);
        }
      }

      /* ── Smooth steer ── */
      const da = angleDiff(desiredAngle, k.angle);
      k.angle += clamp(da, -0.05, 0.05);

      /* ── Move ── */
      k.x += Math.cos(k.angle) * k.spd;
      k.y += Math.sin(k.angle) * k.spd;

      /* ── Hard clamp (safety net) ── */
      k.x = clamp(k.x, 20, W - 20);
      k.y = clamp(k.y, 20, H - 20);

      /* ── Animation phases ── */
      k.tailPhase  += k.tailSpd;
      k.finPhase   += 0.04;
      k.wobblePhase+= 0.06;
      k.bodyWobble  = Math.sin(k.wobblePhase) * 0.08;

      /* ── Bubble trail ── */
      if (k.trailBubbles) {
        k.bubbleTimer--;
        if (k.bubbleTimer <= 0) {
          k.bubbleTimer = 25 + Math.random() * 45;
          bubbles.push({
            x:         k.x - Math.cos(k.angle) * k.len * 0.5,
            y:         k.y - Math.sin(k.angle) * k.len * 0.5,
            r:         1 + Math.random() * 2,
            spd:       0.25 + Math.random() * 0.35,
            wobble:    Math.random() * Math.PI * 2,
            wobbleSpd: 0.025 + Math.random() * 0.025,
            alpha:     0.25 + Math.random() * 0.3,
          });
        }
      }
    }
  }

  function drawKoi(k) {
    ctx.save();
    ctx.translate(k.x, k.y);
    ctx.rotate(k.angle + k.bodyWobble);

    const L  = k.len;
    const W2 = k.width;

    // Shadow
    ctx.save();
    ctx.translate(4, 6);
    ctx.beginPath();
    ctx.ellipse(0, 0, L * 0.55, W2 * 0.45, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,20,40,0.18)';
    ctx.fill();
    ctx.restore();

    // Body
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(L * 0.5, 0);
    ctx.bezierCurveTo( L*0.35, -W2*0.55, -L*0.15, -W2*0.5,  -L*0.5, 0);
    ctx.bezierCurveTo(-L*0.15,  W2*0.5,   L*0.35,  W2*0.55,  L*0.5, 0);
    ctx.closePath();
    ctx.fillStyle = k.variety.base;
    ctx.fill();

    // Patches (clipped to body)
    ctx.clip();
    for (const p of k.patches) {
      ctx.save();
      ctx.translate(p.tx * L, p.ty * L);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }

    // Sheen
    const sg = ctx.createLinearGradient(0, -W2*0.5, 0, W2*0.5);
    sg.addColorStop(0,   'rgba(255,255,255,0.20)');
    sg.addColorStop(0.3, 'rgba(255,255,255,0.05)');
    sg.addColorStop(1,   'rgba(0,0,0,0.08)');
    ctx.fillStyle = sg;
    ctx.fillRect(-L*0.55, -W2*0.55, L*1.1, W2*1.1);
    ctx.restore(); // body clip

    // Tail
    const tailSway = Math.sin(k.tailPhase) * 0.45;
    ctx.save();
    ctx.translate(-L * 0.48, 0);
    ctx.rotate(tailSway);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-L*0.18, -W2*0.55, -L*0.38, -W2*0.45, -L*0.32, -W2*0.05);
    ctx.lineTo(-L*0.02, 0);
    ctx.bezierCurveTo(-L*0.38,  W2*0.45, -L*0.18,  W2*0.55, 0, 0);
    ctx.closePath();
    ctx.fillStyle = k.variety.fin;
    ctx.fill();
    ctx.restore();

    // Dorsal fin
    const finSway = Math.sin(k.finPhase) * 0.12;
    ctx.save();
    ctx.translate(L * 0.05, 0);
    ctx.rotate(finSway);
    ctx.beginPath();
    ctx.moveTo(-L*0.15, 0);
    ctx.bezierCurveTo(-L*0.05, -W2*0.7, L*0.15, -W2*0.65, L*0.18, -W2*0.05);
    ctx.bezierCurveTo( L*0.10, -W2*0.1, -L*0.05, -W2*0.15, -L*0.15, 0);
    ctx.closePath();
    ctx.fillStyle = k.variety.fin;
    ctx.fill();
    ctx.restore();

    // Pectoral fins
    for (const side of [-1, 1]) {
      const fw = Math.sin(k.finPhase * 0.7 + side) * 0.15;
      ctx.save();
      ctx.translate(L * 0.15, 0);
      ctx.rotate(fw * side);
      ctx.beginPath();
      ctx.moveTo(0, side * W2 * 0.15);
      ctx.bezierCurveTo( L*0.05, side*W2*0.70, -L*0.12, side*W2*0.75, -L*0.18, side*W2*0.35);
      ctx.bezierCurveTo(-L*0.10, side*W2*0.20, -L*0.02, side*W2*0.15,  0,       side*W2*0.15);
      ctx.closePath();
      ctx.fillStyle = k.variety.fin;
      ctx.fill();
      ctx.restore();
    }

    // Eye
    ctx.beginPath();
    ctx.arc(L*0.36, -W2*0.18, L*0.045, 0, Math.PI*2);
    ctx.fillStyle = '#1a1208';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(L*0.365, -W2*0.195, L*0.018, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    ctx.restore();
  }

  /* ══════════════════════════════════════════
     WATER SURFACE
  ══════════════════════════════════════════ */
  function drawWaterSurface(time) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 6; i++) {
      const y = ((time * 18 + i * H/6) % H);
      const g = ctx.createLinearGradient(0, y-40, 0, y+40);
      g.addColorStop(0,   'rgba(255,255,255,0)');
      g.addColorStop(0.5, 'rgba(200,240,255,1)');
      g.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, y-40, W, 80);
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.025;
    for (let i = 0; i < 4; i++) {
      const x = ((time * 22 + i * W/4) % W);
      const g = ctx.createLinearGradient(x-60, 0, x+60, 0);
      g.addColorStop(0,   'rgba(255,255,255,0)');
      g.addColorStop(0.5, 'rgba(180,240,255,1)');
      g.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x-60, 0, 120, H);
    }
    ctx.restore();
  }

  /* ══════════════════════════════════════════
     BACKGROUND
  ══════════════════════════════════════════ */
  function drawBackground() {
    const bg = ctx.createRadialGradient(W*0.5, H*0.45, 0, W*0.5, H*0.5, Math.max(W,H)*0.7);
    bg.addColorStop(0,    '#1a7a90');
    bg.addColorStop(0.35, '#0f6278');
    bg.addColorStop(0.65, '#0a4a60');
    bg.addColorStop(1,    '#062535');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const vig = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, Math.max(W,H)*0.65);
    vig.addColorStop(0, 'rgba(30,120,150,0)');
    vig.addColorStop(1, 'rgba(3,15,30,0.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    const edge = ctx.createRadialGradient(W*0.5, H*0.5, Math.min(W,H)*0.35, W*0.5, H*0.5, Math.min(W,H)*0.52);
    edge.addColorStop(0, 'rgba(0,0,0,0)');
    edge.addColorStop(1, 'rgba(0,20,35,0.3)');
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, W, H);
  }

  /* ══════════════════════════════════════════
     INPUT
  ══════════════════════════════════════════ */
  const hintEl  = document.getElementById('hint');
  let firstTap  = true;

  function handleInteraction(cx, cy) {
    if (firstTap) {
      firstTap = false;
      hintEl.classList.add('hidden');
    }

    addRipple(cx, cy);

    /* Gentle nudge: only kois within 160px, small angle offset, no speed boost */
    for (const k of kois) {
      const dx = k.x - cx;
      const dy = k.y - cy;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 160 && d > 1) {
        // Deflect slightly away — 20–40° offset from direct away angle
        const awayAngle = Math.atan2(dy, dx);
        const offset    = (Math.random() - 0.5) * 0.7; // ±20°
        k.nudgeAngle    = awayAngle + offset;
        k.nudgeTimer    = 28 + Math.floor((160 - d) / 10); // max ~44 frames
        // Wander also loosely follows so the fish doesn't snap back instantly
        k.wanderAngle   = k.nudgeAngle + (Math.random()-0.5)*0.5;
        k.wanderTimer   = 60 + Math.random() * 60;
      }
    }
  }

  canvas.addEventListener('pointerdown', e => {
    handleInteraction(e.clientX, e.clientY);
  });

  /* Custom cursor ring */
  const cursorRing = document.createElement('div');
  cursorRing.id    = 'cursor-ring';
  document.body.appendChild(cursorRing);
  window.addEventListener('pointermove', e => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top  = e.clientY + 'px';
  });

  /* ══════════════════════════════════════════
     UTILS
  ══════════════════════════════════════════ */
  function lerp(a, b, t2)   { return a + (b - a) * t2; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function angleDiff(target, current) {
    let d = target - current;
    while (d >  Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  function lerpAngle(a, b, t2) {
    let d = angleDiff(b, a);
    return a + d * t2;
  }

  /* ══════════════════════════════════════════
     MAIN LOOP
  ══════════════════════════════════════════ */
  let lastTime = 0;

  function loop(ts) {
    const time = ts * 0.001;
    lastTime   = time;
    t++;

    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawCaustics(time);
    drawWaterSurface(time);
    drawLotus(time);

    updateKois();
    for (const k of kois) drawKoi(k);

    updateBubbles();
    drawBubbles();
    updateRipples();
    drawRipples();

    requestAnimationFrame(loop);
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  resize();
  initKois();
  requestAnimationFrame(loop);

})();
