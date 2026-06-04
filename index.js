document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. ANIMASI LOADING (RIPPLE EFFECT LOADER)
    // ==========================================================================
    const loader = document.getElementById("loader");
    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("fade-out");
            }, 300); // Penundaan halus untuk transisi premium
        });
        // Pengaman jika event 'load' sudah terpicu
        if (document.readyState === "complete") {
            setTimeout(() => { loader.classList.add("fade-out"); }, 300);
        }
    }

    // ==========================================================================
    // 2. STICKY NAVBAR ON SCROLL
    // ==========================================================================
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // ==========================================================================
    // 3. MOBILE TOGGLE MENU SYSTEM
    // ==========================================================================
    const mobileMenuBtn = document.getElementById("mobileMenu");
    const navLinksList = document.getElementById("navLinks");

    if (mobileMenuBtn && navLinksList) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinksList.classList.toggle("active");
            // Animasi transisi ikon menu hamburger ke close
            const icon = mobileMenuBtn.querySelector("i");
            if(navLinksList.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // Menutup menu seluler ketika tautan diklik
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinksList.classList.remove("active");
                mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";
            });
        });
    }

    // ==========================================================================
    // 4. SCROLL REVEAL INTERACTION (MODERN LOOK)
    // ==========================================================================
    const revealItems = document.querySelectorAll(".scroll-reveal");
    const revealOnScroll = () => {
        revealItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight - 100;
            if (itemTop < triggerPoint) {
                item.classList.add("revealed");
            }
        });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Pemicu pertama saat inisialisasi awal halaman

    // ==========================================================================
    // 5. BACK TO TOP FUNCTIONALITY
    // ==========================================================================
    const backToTopBtn = document.getElementById("backToTop");
    if(backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================================================
    // 6. DETEKSI & PROSES HALAMAN TANGKAPAN / DOKUMENTASI (SEARCH & FILTER)
    // ==========================================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryCards = document.querySelectorAll(".gallery-card");
    const searchInput = document.getElementById("searchCatch");

    const filterAndSearchHandler = () => {
        const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

        galleryCards.forEach(card => {
            const cardSpecies = card.getAttribute("data-species") || "";
            // Mengambil judul atau deskripsi lokasi di dalam kartu
            const cardTitle = card.querySelector("h3")?.innerText.toLowerCase() || "";
            const cardLocation = card.querySelector(".spot-info")?.innerText.toLowerCase() || "";
            
            const matchesFilter = (activeFilter === "all" || cardSpecies.includes(activeFilter));
            const matchesSearch = (cardTitle.includes(searchQuery) || cardLocation.includes(searchQuery));

            if (matchesFilter && matchesSearch) {
                card.style.display = "block";
                setTimeout(() => { card.style.opacity = "1"; card.style.transform = "scale(1)"; }, 50);
            } else {
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                setTimeout(() => { card.style.display = "none"; }, 300);
            }
        });
    };

    // Filter Button Click Event
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            filterAndSearchHandler();
        });
    });

    // Search Input Real-time Event
    if (searchInput) {
        searchInput.addEventListener("input", filterAndSearchHandler);
    }

    // ==========================================================================
    // 7. LIGHTBOX CONTROLLER MODULE
    // ==========================================================================
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeLightbox = document.querySelector(".lightbox-close");

    if (lightboxModal) {
        document.querySelectorAll(".lightbox-trigger").forEach(img => {
            img.addEventListener("click", () => {
                lightboxModal.style.display = "flex";
                lightboxImg.src = img.src;
                lightboxCaption.innerText = img.alt;
                document.body.style.overflow = "hidden"; // Kunci scroll layar utama
            });
        });

        const hideLightbox = () => {
            lightboxModal.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if(closeLightbox) closeLightbox.addEventListener("click", hideLightbox);
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) hideLightbox();
        });
    }

    // ==========================================================================
    // 8. INTERAKTIF MAP LEAFLET (HANYA BERJALAN DI map.html)
    // ==========================================================================
    const mapContainer = document.getElementById("map");
    if (mapContainer && typeof L !== 'undefined') {
        
        // Titik tengah koordinat default (Area Yogyakarta / Sungai-sungai sampel)
        const centerCoords = [-7.9000, 110.3300]; 
        
        // Inisialisasi peta Leaflet dengan peta bertema gelap agar senada dengan UI Premium
        const map = L.map('map').setView(centerCoords, 11);

        // Tile layer menggunakan konfigurasi CartoDB Positron Dark Matter
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Data array lokal untuk marker spot memancing
        const spotsData = [
            {
                name: "Spot Sungai Progo",
                coords: [-7.8542, 110.2581],
                image: "images/spots/spot-progo.jpg",
                catchesCount: "18 Ekor",
                fishSpecies: "Ikan Mas, Gabus, Hampala",
                note: "Arus deras dalam, potensial dipinggiran dekat vegetasi bambu tumbang.",
                earthLink: "https://earth.google.com/web/"
            },
            {
                name: "Spot Sungai Opak",
                coords: [-7.9312, 110.3625],
                image: "images/spots/spot-opak.jpg",
                catchesCount: "14 Ekor",
                fishSpecies: "Nila Babon, Bader, Sidat",
                note: "Banyak bebatuan besar, air cenderung tenang saat musim kemarau.",
                earthLink: "https://earth.google.com/web/"
            },
            {
                name: "Spot Code Hulu",
                coords: [-7.7215, 110.3742],
                image: "images/spots/spot-code.jpg",
                catchesCount: "10 Ekor",
                fishSpecies: "Patin Sungai, Melem, Tawes",
                note: "Dekat dengan struktur dam alami. Gunakan umpan racikan malam hari.",
                earthLink: "https://earth.google.com/web/"
            }
        ];

        // Looping untuk merender marker khusus ke dalam peta
        spotsData.forEach(spot => {
            const marker = L.marker(spot.coords).addTo(map);
            
            // Layout popup kustom premium
            const popupContent = `
                <div class="popup-card">
                    <img src="${spot.image}" alt="${spot.name}">
                    <h4>${spot.name}</h4>
                    <p><strong><i class="fa-solid fa-fish"></i> Tangkapan:</strong> ${spot.catchesCount}</p>
                    <p><strong><i class="fa-solid fa-dna"></i> Spesies:</strong> ${spot.fishSpecies}</p>
                    <p style="font-style: italic; color:#7e9391;">"${spot.note}"</p>
                    <a href="${spot.earthLink}" target="_blank" class="earth-btn">
                        <i class="fa-solid fa-earth-asia"></i> Lihat di Google Earth
                    </a>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });
    }
});
