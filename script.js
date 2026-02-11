/* ============================================
   Vortex — Animation Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADER =====
    const loaderEl = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');

    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 30;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loaderEl.classList.add('done');
                // Trigger hero animations and scroll observer after loader
                setTimeout(() => {
                    revealHero();
                    initScrollAnimations();
                    initCounterAnimations();
                }, 300);
            }, 300);
        }
        loaderBar.style.width = loadProgress + '%';
    }, 200);


    // ===== HERO TEXT REVEAL =====
    function revealHero() {
        const words = document.querySelectorAll('.hero-word');
        words.forEach((word, i) => {
            setTimeout(() => {
                word.classList.add('revealed');
            }, i * 180);
        });

        // Force-reveal all hero section animated elements
        const hero = document.getElementById('hero');
        if (hero) {
            hero.querySelectorAll('[data-animate]').forEach((el, i) => {
                const delay = parseInt(el.getAttribute('data-delay') || 0);
                setTimeout(() => {
                    el.classList.add('in-view');
                }, delay);
            });
        }
    }


    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('nav-blur');
            navbar.style.padding = '14px 32px';
            navbar.style.background = 'rgba(18, 18, 16, 0.85)';
        } else {
            navbar.classList.remove('nav-blur');
            navbar.style.padding = '24px 32px';
            navbar.style.background = 'linear-gradient(to bottom, rgba(18,18,16,0.85) 0%, rgba(18,18,16,0.5) 60%, transparent 100%)';
        }
    }, { passive: true });


    // ===== MOBILE MENU =====
    const menuBtn = document.getElementById('menu-btn');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    menuClose.addEventListener('click', closeMobileMenu);

    window.closeMobileMenu = function () {
        mobileMenu.style.display = 'none';
        document.body.style.overflow = '';
    };


    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            e.preventDefault();
            const target = document.querySelector(id);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    // Initialized AFTER the loader finishes so the IntersectionObserver
    // properly detects which elements are in the viewport.
    function initScrollAnimations() {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, delay);
                    animateObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('[data-animate]').forEach((el, i) => {
            // Skip elements already revealed (e.g. hero items)
            if (el.classList.contains('in-view')) return;

            // Assign stagger index if parent has data-stagger
            if (el.parentElement && el.parentElement.hasAttribute('data-stagger')) {
                const siblings = Array.from(el.parentElement.querySelectorAll('[data-animate]'));
                const idx = siblings.indexOf(el);
                el.style.setProperty('--stagger-index', idx);
            }
            animateObserver.observe(el);
        });
    }


    // ===== COUNTER ANIMATION =====
    function initCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    if (isNaN(target)) return;

                    const duration = 1800;
                    const startTime = performance.now();

                    function update(now) {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = target;
                        }
                    }

                    requestAnimationFrame(update);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter[data-count]').forEach(el => {
            counterObserver.observe(el);
        });
    }


    // ===== PARALLAX ON HERO IMAGE =====
    const parallaxImg = document.querySelector('.parallax-img');

    if (parallaxImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.15;
            parallaxImg.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }


    // ===== CUSTOM CURSOR =====
    const cursorDot = document.getElementById('cursor-dot');

    if (cursorDot && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;
            cursorDot.style.left = dotX - 4 + 'px';
            cursorDot.style.top = dotY - 4 + 'px';
            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Scale up on interactive elements
        document.querySelectorAll('a, button, .magnetic-btn, [data-magnetic]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(3)';
                cursorDot.style.opacity = '0.6';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorDot.style.opacity = '1';
            });
        });
    }


    // ===== MAGNETIC BUTTON EFFECT =====
    document.querySelectorAll('.magnetic-btn, [data-magnetic]').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });



    // ===== NEWSLETTER FORM =====
    const newsletterBtn = document.getElementById('newsletter-btn');
    const newsletterEmail = document.getElementById('newsletter-email');

    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            if (newsletterEmail.value) {
                const original = newsletterBtn.textContent;
                newsletterBtn.textContent = '✓';
                newsletterBtn.style.background = '#22c55e';
                newsletterEmail.value = '';
                setTimeout(() => {
                    newsletterBtn.textContent = original;
                    newsletterBtn.style.background = '';
                }, 2500);
            }
        });
    }


    // ===== IMAGE HOVER PARALLAX =====
    document.querySelectorAll('.img-reveal').forEach(container => {
        const img = container.querySelector('img');
        if (!img || window.innerWidth <= 768) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `scale(1.05) translate(${x * -10}px, ${y * -10}px)`;
        });

        container.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1) translate(0, 0)';
        });
    });



    // ===== GSAP AWARD-WINNING ANIMATIONS =====
    gsap.registerPlugin(ScrollTrigger);

    // Scroll Trigger Animations (fade-up elements)
    gsap.utils.toArray('[data-animate="fade-up"]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('[data-animate="fade-left"]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('[data-animate="scale-in"]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
        });
    });
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    scrambleElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            const originalText = el.dataset.value || el.innerText;
            if (!el.dataset.value) el.dataset.value = originalText; // cache original

            clearInterval(el.interval);

            el.interval = setInterval(() => {
                el.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(el.interval);
                }

                iteration += 1 / 3;
            }, 30);
        });
    });

    // ===== WEBGL HERO DISTORTION (Three.js) =====
    // Initialize only if container exists and on desktop
    const heroContainer = document.getElementById('hero-webgl');
    if (heroContainer && window.innerWidth > 768) {
        // Basic Three.js Setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        heroContainer.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uResolution: { value: new THREE.Vector2(heroContainer.clientWidth, heroContainer.clientHeight) },
                uTime: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                uniform vec2 uResolution;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    // Liquid Distortion Logic
                    float dist = distance(uv, uMouse);
                    
                    // Simple "Energy Field" effect
                    float glow = 0.05 / dist;
                    glow = pow(glow, 1.5);
                    
                    // Ripples
                    float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.02;
                    
                    // Background Color (Dark Industrial with subtle Gold)
                    vec3 bgColor = vec3(0.07, 0.07, 0.06); // Dark Jet
                    vec3 activeColor = vec3(0.9, 0.8, 0.1); // Gold

                    vec3 finalColor = mix(bgColor, activeColor, glow + ripple);
                    
                    // Vignette
                    float vignette = 1.0 - distance(uv, vec2(0.5));
                    finalColor *= vignette;

                    gl_FragColor = vec4(finalColor, 0.2 + glow); // Transparency
                }
            `,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Mouse Move
        window.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL coords inverted Y
            material.uniforms.uMouse.value.set(x, y);
        });

        // Animation Loop
        const clock = new THREE.Clock();
        function animate() {
            material.uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        // Resize
        window.addEventListener('resize', () => {
            renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
            material.uniforms.uResolution.value.set(heroContainer.clientWidth, heroContainer.clientHeight);
        });
    }

    // Trending logic moved to inline script in index.html to ensure reliable execution
});
