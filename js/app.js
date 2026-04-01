/* ============================================
   ONE PRODUCT SHOP — JavaScript
   Features: Sticky nav, FAQ accordion, Qty selector,
   Mobile menu, Scroll reveal, Smooth scroll, Urgency
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR: scroll shadow ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // --- MOBILE MENU ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // --- FAQ ACCORDION ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- QUANTITY SELECTOR ---
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const buyBtn = document.getElementById('buyBtn');
    const basePrice = 59.99;

    function updatePrice() {
        const qty = parseInt(qtyInput.value) || 1;
        const total = (basePrice * qty).toFixed(2);
        buyBtn.textContent = `Add to Cart — $${total}`;
    }

    qtyMinus.addEventListener('click', () => {
        const val = parseInt(qtyInput.value) || 1;
        if (val > 1) {
            qtyInput.value = val - 1;
            updatePrice();
        }
    });

    qtyPlus.addEventListener('click', () => {
        const val = parseInt(qtyInput.value) || 1;
        if (val < 3) {
            qtyInput.value = val + 1;
            updatePrice();
        }
    });

    qtyInput.addEventListener('change', () => {
        let val = parseInt(qtyInput.value) || 1;
        val = Math.max(1, Math.min(3, val));
        qtyInput.value = val;
        updatePrice();
    });

    // --- BUY BUTTON → open checkout ---
    buyBtn.addEventListener('click', () => {
        if (typeof openCheckout === 'function') {
            openCheckout();
        }
    });

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll(
        '.feature-card, .review-card, .ps-card, .trust-item, .section-header, .buy-grid, .faq-item, .spec-card, .step-card, .compat-card'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- STICKY MOBILE CTA: show after scrolling past hero ---
    const hero = document.getElementById('hero');
    const stickyMobileCta = document.getElementById('stickyMobileCta');

    if (hero && stickyMobileCta) {
        const stickyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.innerWidth <= 768) {
                    stickyMobileCta.style.display = entry.isIntersecting ? 'none' : 'block';
                }
            });
        }, { threshold: 0 });
        stickyObserver.observe(hero);
    }

    // --- SMOOTH SCROLL for all #anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- THUMBNAIL CLICK — switch main product image ---
    const buyMainImg = document.getElementById('buyMainImg');
    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (buyMainImg && thumb.dataset.img) {
                buyMainImg.src = thumb.dataset.img;
            }
        });
    });

    // --- SOCIAL PROOF POPUP ---
    (function () {
        const popup  = document.getElementById('spPopup');
        const nameEl = document.getElementById('spName');
        const timeEl = document.getElementById('spTime');
        const closeBtn = document.getElementById('spClose');
        if (!popup) return;

        const buyers = [
            'Michael from Austin', 'Sarah from Los Angeles', 'James from Chicago',
            'Emma from New York', 'David from Houston', 'Olivia from Phoenix',
            'Ryan from Seattle', 'Sophia from Miami', 'Daniel from Denver',
            'Ava from Nashville', 'Chris from Portland', 'Mia from San Diego',
            'Tyler from Dallas', 'Isabella from Atlanta', 'Jake from Boston'
        ];
        const times = [
            'just now', '1 minute ago', '2 minutes ago', '3 minutes ago',
            '4 minutes ago', '5 minutes ago', '7 minutes ago', '9 minutes ago'
        ];

        let hideTimer, nextTimer;
        let lastIdx = -1;

        function showPopup() {
            // Pick a random buyer (avoid repeating same)
            let idx;
            do { idx = Math.floor(Math.random() * buyers.length); } while (idx === lastIdx);
            lastIdx = idx;

            nameEl.textContent = buyers[idx];
            timeEl.textContent = times[Math.floor(Math.random() * times.length)];

            popup.classList.add('sp-visible');

            // Auto-hide after 5s
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hidePopup, 5000);
        }

        function hidePopup() {
            popup.classList.remove('sp-visible');
            clearTimeout(nextTimer);
            nextTimer = setTimeout(showPopup, 60000); // show again in 60s
        }

        closeBtn.addEventListener('click', hidePopup);

        // First show after 8s (let page load)
        nextTimer = setTimeout(showPopup, 8000);
    })();

    // --- EXPLODED VIEW — Auto-loop animation ---
    if (typeof gsap !== 'undefined') {
        const layerIds  = ['#exL1','#exL2','#exL3','#exL4','#exL5','#exL6'];
        // Shell goes furthest, internal components spread in the middle
        const yOffsets  = [-260, -148, -56, 56, 148, 260];
        const labelIds  = ['#lbl1','#lbl2','#lbl3','#lbl4','#lbl5','#lbl6'];

        const els    = layerIds.map(id => document.querySelector(id)).filter(Boolean);
        const labels = labelIds.map(id => document.querySelector(id)).filter(Boolean);

        if (els.length) {
            // Reset all to assembled
            gsap.set(els, { y: 0 });
            gsap.set(labels, { opacity: 0 });

            function explodeLoop() {
                const tl = gsap.timeline({
                    onComplete: () => {
                        // pause 2s fully exploded, then reassemble
                        setTimeout(reassemble, 2000);
                    }
                });
                // Explode layers with stagger
                tl.to(els, {
                    y: (i) => yOffsets[i],
                    duration: 1.4,
                    stagger: 0.08,
                    ease: 'power3.out'
                });
                // Labels fade in
                tl.to(labels, {
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.08
                }, 0.5);
            }

            function reassemble() {
                const tl = gsap.timeline({
                    onComplete: () => {
                        // pause 1.5s assembled, then explode again
                        setTimeout(explodeLoop, 1500);
                    }
                });
                // Labels fade out first
                tl.to(labels, { opacity: 0, duration: 0.3, stagger: 0.05 });
                // Reassemble
                tl.to(els, {
                    y: 0,
                    duration: 1.2,
                    stagger: { each: 0.07, from: 'end' },
                    ease: 'power3.inOut'
                }, 0.2);
            }

            // Start after 1s delay
            setTimeout(explodeLoop, 1000);
        }
    }

});
