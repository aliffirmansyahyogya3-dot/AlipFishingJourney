/* ================================================================
   ALIP FISHING JOURNEY — script.js
   Berisi: Navbar, Parallax, Particles, Fade-in, Gallery Filter,
           Lightbox, Counter Animation, Back to Top
   ================================================================ */

/* ----------------------------------------------------------------
   TUNGGU DOM SELESAI DIMUAT
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  // Inisialisasi ikon Lucide (icon library)
  lucide.createIcons();

  // ----------------------------------------------------------------
  // 1. NAVBAR — sticky dengan kelas saat scroll
  // ----------------------------------------------------------------
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    // Tambah kelas 'scrolled' jika halaman sudah di-scroll > 60px
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ----------------------------------------------------------------
  // 2. HAMBURGER MENU — untuk mobile
  // ----------------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Tutup menu saat link diklik
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ----------------------------------------------------------------
  // 3. ACTIVE NAV LINK — berubah sesuai section yang sedang ditampilkan
  // ----------------------------------------------------------------
  const sections   = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120; // offset untuk navbar fixed

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ----------------------------------------------------------------
  // 4. PARALLAX — hero background bergerak lambat saat scroll
  // ----------------------------------------------------------------
  const heroBg = document.getElementById('heroBg');

  function handleParallax() {
    if (!heroBg) return;
    // Gerakkan background 30% dari jarak scroll (efek parallax ringan)
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ----------------------------------------------------------------
  // 5. FLOATING PARTICLES — titik-titik kecil emas di hero
  // ----------------------------------------------------------------
  const particlesContainer = document.getElementById('particles');

  function createParticles() {
    if (!particlesContainer) return;

    const count = 30; // jumlah partikel

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');

      // Posisi acak
      const x    = Math.random() * 100;
      const y    = Math.random() * 100;
      // Ukuran acak antara 3–8px
      const size = Math.random() * 5 + 3;
      // Durasi dan delay animasi acak
      const dur   = (Math.random() * 4 + 4).toFixed(1); // 4–8s
      const delay = (Math.random() * 5).toFixed(1);      // 0–5s

      p.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        --dur: ${dur}s;
        --delay: ${delay}s;
      `;

      particlesContainer.appendChild(p);
    }
  }

  createParticles();

  // ----------------------------------------------------------------
  // 6. FADE-UP ANIMATION — elemen muncul saat masuk viewport
  // ----------------------------------------------------------------
  const fadeUpElements = document.querySelectorAll('.fade-up');

  // Gunakan IntersectionObserver untuk performa lebih baik
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Setelah terlihat, tidak perlu observe lagi
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,       // trigger saat 12% elemen terlihat
    rootMargin: '0px 0px -40px 0px' // trigger sedikit sebelum bawah viewport
  });

  fadeUpElements.forEach(el => fadeObserver.observe(el));

  // ----------------------------------------------------------------
  // 7. GALLERY FILTER — tampilkan/sembunyikan berdasarkan kategori
  // ----------------------------------------------------------------
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update tombol aktif
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; // nilai data-filter pada tombol

      galleryItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          // Tampilkan: hapus class hidden
          item.classList.remove('hidden');
          // Re-trigger animasi fade
          item.classList.remove('visible');
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          // Sembunyikan
          item.classList.add('hidden');
        }
      });
    });
  });

  // ----------------------------------------------------------------
  // 8. LIGHTBOX — zoom foto galeri
  // ----------------------------------------------------------------
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  // Kumpulkan semua item yang terlihat (bukan hidden)
  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return [...galleryItems].filter(item => !item.classList.contains('hidden'));
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;

    const item     = visibleItems[currentIndex];
    const img      = item.querySelector('.gallery-img-wrap img');
    const fishName = item.querySelector('h4')?.textContent || '';
    const meta     = [...item.querySelectorAll('.fish-meta span')]
                       .map(s => s.textContent.trim()).join('  ·  ');

    lightboxImg.src     = img.src;
    lightboxImg.alt     = img.alt;
    lightboxCap.textContent = `${fishName}  ·  ${meta}`;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // cegah scroll background
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = ''; // reset src
  }

  function prevImage() {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function nextImage() {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  // Klik pada gallery item untuk buka lightbox
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) openLightbox(visibleIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  // Tutup lightbox saat klik area gelap di luar gambar
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation: Esc = tutup, ← = prev, → = next
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Re-init ikon Lucide setelah lightbox dibuka (karena ada ikon di dalamnya)
  lightboxClose.addEventListener('click', () => lucide.createIcons());

  // ----------------------------------------------------------------
  // 9. COUNTER ANIMATION — angka naik saat statistik terlihat
  // ----------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');

  // Flag agar counter hanya berjalan sekali
  let countersStarted = false;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10); // nilai akhir
    const suffix   = el.dataset.suffix || '';         // misal " kg"
    const duration = 2000;   // durasi total dalam ms
    const steps    = 60;     // jumlah update
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      el.textContent = Math.floor(current).toLocaleString('id-ID') + suffix;
    }, interval);
  }

  // Observer khusus untuk section statistik
  const statsSection = document.getElementById('stats');

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;

        statNumbers.forEach(el => animateCounter(el));

        statsObserver.disconnect(); // cukup satu kali
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);

  // ----------------------------------------------------------------
  // 10. BACK TO TOP BUTTON
  // ----------------------------------------------------------------
  const backTop = document.getElementById('backTop');

  function handleBackTop() {
    // Tampilkan tombol setelah scroll 300px
    if (window.scrollY > 300) {
      backTop.classList.add('show');
    } else {
      backTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', handleBackTop, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----------------------------------------------------------------
  // 11. SMOOTH SCROLL — untuk semua anchor link internal
  //     (sebagai fallback, meskipun CSS scroll-behavior sudah diset)
  // ----------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));

      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80; // kompensasi navbar

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----------------------------------------------------------------
  // 12. INISIALISASI ULANG IKON LUCIDE
  //     Perlu dipanggil lagi karena ikon di-render dinamis
  // ----------------------------------------------------------------
  lucide.createIcons();

  // ----------------------------------------------------------------
  // 13. LAZY IMAGE FALLBACK
  //     Jika gambar gagal dimuat, tampilkan gradien warna
  // ----------------------------------------------------------------
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';

      // Buat placeholder warna
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a6b8a 0%, #2d6a4f 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
      `;
      placeholder.textContent = '🐟';
      img.parentNode.insertBefore(placeholder, img.nextSibling);
    });
  });

  // ----------------------------------------------------------------
  // 14. TIMELINE STAGGER ANIMATION
  //     Timeline items muncul bergantian dengan delay berbeda
  // ----------------------------------------------------------------
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay berdasarkan posisi item
        const delay = 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.1}s`;
    timelineObserver.observe(item);
  });

  // ----------------------------------------------------------------
  // 15. LOG SELESAI
  // ----------------------------------------------------------------
  console.log('🎣 Alip Fishing Journey — siap bertualang!');

}); // End DOMContentLoaded
