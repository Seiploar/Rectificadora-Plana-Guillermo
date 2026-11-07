tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: {
                            800: '#112239',
                            900: '#0f2a4a',
                            950: '#08172b',
                        },
                        fire: {
                            500: '#ff6b00',
                            600: '#e65100',
                            700: '#c74400',
                        },
                        steel: {
                            400: '#94a3b8',
                            600: '#4a5568',
                            700: '#334155',
                            800: '#1e293b',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }

// Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu on click link
        document.querySelectorAll('#mobile-menu a').forEach(l => {
            l.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });

        // Interactive Before / After Image Slider Logic
        const sliderContainer = document.getElementById('slider-container');
        const beforeImage = document.getElementById('before-image');
        const beforeImgElement = document.getElementById('before-img-element');
        const sliderHandle = document.getElementById('slider-handle');
        let isSliding = false;

        function updateSlider(x) {
            const rect = sliderContainer.getBoundingClientRect();
            let position = x - rect.left;
            if (position < 0) position = 0;
            if (position > rect.width) position = rect.width;

            const percentage = (position / rect.width) * 100;
            beforeImage.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
            beforeImgElement.style.width = `${rect.width}px`;
        }

        // Adjust initial width of nested image on load/resize
        function syncImageWidth() {
            if (sliderContainer && beforeImgElement) {
                beforeImgElement.style.width = `${sliderContainer.getBoundingClientRect().width}px`;
            }
        }
        window.addEventListener('resize', syncImageWidth);
        syncImageWidth();

        sliderContainer.addEventListener('mousedown', (e) => {
            isSliding = true;
            updateSlider(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            updateSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isSliding = false;
        });

        // Touch support for slider
        sliderContainer.addEventListener('touchstart', (e) => {
            isSliding = true;
            updateSlider(e.touches[0].clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            updateSlider(e.touches[0].clientX);
        });

        window.addEventListener('touchend', () => {
            isSliding = false;
        });

        // Surface Grinding Calculator Calculation Logic
        function calculateFlatGrinding() {
            const length = parseFloat(document.getElementById('dim-length').value) || 100;
            const width = parseFloat(document.getElementById('dim-width').value) || 100;
            const mat = document.getElementById('mat-type').value;
            const depth = document.getElementById('removal-depth').value;
            const quality = document.getElementById('finish-quality').value;
            const faces = parseInt(document.getElementById('faces-qty').value) || 1;
            const qty = parseInt(document.getElementById('piece-qty').value) || 1;

            // Area calculation in cm2
            const areaCm2 = (length * width) / 100;

            // Base rate per cm2
            let ratePerCm2 = 0.15;
            if (depth === 'estandar') ratePerCm2 = 0.22;
            if (depth === 'profundo') ratePerCm2 = 0.35;

            // Material Multiplier & Abrasive Wheel Selection
            let matMult = 1.0;
            let wheelText = "Óxido de Aluminio Blanco (WA46-JV)";

            if (mat === 'd2') {
                matMult = 1.45;
                wheelText = "CBN (Nitruro de Boro Cúbico) B126";
            } else if (mat === 'p20') {
                matMult = 1.25;
                wheelText = "Óxido de Aluminio Rosado (WA60-KV)";
            } else if (mat === 'inox') {
                matMult = 1.30;
                wheelText = "Carburo de Silicio Verde (GC60-JV)";
            } else if (mat === 'titanio') {
                matMult = 1.70;
                wheelText = "Diamante Resinode / CBN Fino";
            } else if (mat === 'carbono') {
                wheelText = "Óxido de Aluminio Corindón Estándar";
            }

            // Quality Multiplier
            let qualMult = 1.0;
            if (quality === 'alta') qualMult = 1.3;
            if (quality === 'espejo') qualMult = 1.75;

            // Price Calculation
            let totalCost = (areaCm2 * ratePerCm2 * matMult * qualMult * faces * qty) + 35; // base setup fee
            if (totalCost < 55) totalCost = 55;

            // Time Calculation in Minutes
            let minutes = Math.round((areaCm2 * 0.12 * faces * qty * (depth === 'profundo' ? 1.5 : 1)) + 25);
            let hoursText = "";
            if (minutes < 60) {
                hoursText = `${minutes} min`;
            } else {
                const h = Math.floor(minutes / 60);
                const m = minutes % 60;
                hoursText = `${h}h ${m}min`;
            }

            // Update UI
            document.getElementById('res-wheel').textContent = wheelText;
            document.getElementById('res-time').textContent = hoursText;
            document.getElementById('res-price').textContent = `$${totalCost.toFixed(2)} USD`;
        }

        // Attach listeners to recalculate dynamically on change
        ['dim-length', 'dim-width', 'dim-thickness', 'mat-type', 'removal-depth', 'finish-quality', 'faces-qty', 'piece-qty'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', calculateFlatGrinding);
                el.addEventListener('change', calculateFlatGrinding);
            }
        });

        // Initialize calculation on page load
        window.onload = function() {
            calculateFlatGrinding();
        };

        // Handle Contact Form Submit
        function handleContactSubmit(event) {
            event.preventDefault();
            document.getElementById('contact-form').classList.add('hidden');
            document.getElementById('contact-success').classList.remove('hidden');
        }
        