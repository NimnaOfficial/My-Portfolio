document.addEventListener("DOMContentLoaded", () => {

    // --- 0. CUSTOM CURSOR LOGIC ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const interactiveElements = document.querySelectorAll('a, button, .thumb-card, .accordion-header, input, textarea');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
    });

    // --- 1. THEME TOGGLE (Dark/Light Mode) ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    themeBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'light') {
            htmlEl.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- 2. STICKY NAVBAR ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // --- 3. MAGNETIC BUTTON FIX ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            btn.style.setProperty('--mx', `${x * 0.3}px`);
            btn.style.setProperty('--my', `${y * 0.5}px`);
        });

        btn.addEventListener('mouseout', () => {
            btn.style.setProperty('--mx', `0px`);
            btn.style.setProperty('--my', `0px`);
        });
    });

    // --- 4. 3D HOVER TILT FOR ABOUT CARD ---
    const tiltCard = document.querySelector('.tilt-card');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    // --- 5. ACCORDION LOGIC ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    if(accordionItems.length > 0) {
        const firstBody = accordionItems[0].querySelector('.accordion-body');
        firstBody.style.maxHeight = firstBody.scrollHeight + "px";

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                const body = item.querySelector('.accordion-body');

                accordionItems.forEach(acc => {
                    acc.classList.remove('active');
                    acc.querySelector('.accordion-body').style.maxHeight = '0';
                });

                if (!isActive) {
                    item.classList.add('active');
                    body.style.maxHeight = body.scrollHeight + "px";
                }
            });
        });
    }

    // --- 6. VERTICAL PROJECT CAROUSEL ---
    const projectDatabase = [
        {
            title: "Lanka Washing System",
            desc: "A hybrid application handling 500+ database queries efficiently. Designed and implemented 15+ UI screens to ensure a smooth, seamless user experience.",
            tags: ["Java", "PHP", "UI/UX"],
            repoLink: "https://github.com/NimnaOfficial/LankaWashingApp",
            liveLink: "https://lankawashing.infinityfree.me/"
        },
        {
            title: "Smart Crop Supply Mgmt",
            desc: "About Smart Crop Supply Management System is a Java desktop application for managing farmers, crops, inventory, buyer requests, and reports using a role-based system with MySQL integration.",
            tags: ["JasperReports", "Backend", "SQL"],
            repoLink: "https://github.com/NimnaOfficial/SmartCropSupplyManagementSystem",
            liveLink: "" 
        },
        {
            title: "AI & Data Science",
            desc: "Hands-on experimentation with Python-based AI/ML concepts. Built predictive models, data analysis pipelines, and basic neural networks. (COMING SOON)",
            tags: ["Python", "Machine Learning", "Data Science"],
            repoLink: "",
            liveLink: "" 
        },
        {
            title: "Auto Parts Online",
            desc: "AutoHub is a responsive e-commerce platform delivering premium auto parts in Sri Lanka. It combines an intuitive UI/UX with a secure PHP backend for a seamless shopping experience.",
            tags: ["HTML", "CSS", "JS", "PHP"],
            repoLink: "https://github.com/NimnaOfficial/AutoPartsOnline",
            liveLink: "https://autopartsonlinex.infinityfree.me/" 
        }
    ];

    const thumbCards = document.querySelectorAll('.thumb-card');
    const bgLayers = document.querySelectorAll('.proj-bg-layer');
    const projTitle = document.getElementById('proj-title');
    const projDesc = document.getElementById('proj-desc');
    const projTags = document.getElementById('proj-tags');
    const infoWrapper = document.querySelector('.proj-info-wrapper');
    const repoBtn = document.getElementById('proj-repo-btn');
    const liveBtn = document.getElementById('proj-live-btn');

    if(infoWrapper) infoWrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    thumbCards.forEach(card => {
        card.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            if (this.classList.contains('active')) return;

            thumbCards.forEach(t => t.classList.remove('active'));
            bgLayers.forEach(bg => bg.classList.remove('active'));

            this.classList.add('active');
            bgLayers[index].classList.add('active');

            infoWrapper.style.opacity = '0';
            infoWrapper.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                const currentProject = projectDatabase[index];
                
                projTitle.textContent = currentProject.title;
                projDesc.textContent = currentProject.desc;
                
                projTags.innerHTML = '';
                currentProject.tags.forEach(tagText => {
                    const span = document.createElement('span');
                    span.classList.add('tag');
                    span.textContent = tagText;
                    projTags.appendChild(span);
                });

                if (currentProject.repoLink) {
                    repoBtn.href = currentProject.repoLink;
                    repoBtn.style.display = 'inline-block';
                } else {
                    repoBtn.style.display = 'none';
                }

                if (currentProject.liveLink) {
                    liveBtn.href = currentProject.liveLink;
                    liveBtn.style.display = 'inline-block';
                } else {
                    liveBtn.style.display = 'none';
                }

                infoWrapper.style.opacity = '1';
                infoWrapper.style.transform = 'translateY(0)';
            }, 400); 
        });
    });

    // --- 7. SCROLL REVEAL ANIMATIONS ---
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => scrollObserver.observe(el));

    // --- 8. ANTIGRAVITY TEXT REVEAL (Typewriter Effect) ---
    const heroText = document.getElementById('hero-text');
    if (heroText) {
        const htmlContent = heroText.innerHTML;
        heroText.innerHTML = '';
        const parts = htmlContent.split(/(<[^>]*>)/g);
        
        let charIndex = 0;
        parts.forEach(part => {
            if (part.startsWith('<')) {
                heroText.innerHTML += part;
            } else {
                const chars = part.split('');
                chars.forEach(char => {
                    if (char === ' ') {
                        heroText.innerHTML += ' ';
                    } else {
                        heroText.innerHTML += `<span class="char-span" style="transition-delay: ${charIndex * 0.03}s">${char}</span>`;
                        charIndex++;
                    }
                });
            }
        });

        setTimeout(() => {
            document.querySelectorAll('.char-span').forEach(span => {
                span.classList.add('revealed');
            });
        }, 300);
    }

    // --- 9. RADIATING PARTICLE VORTEX (The "Liftoff" Background) ---
    const canvas = document.getElementById('antigravity-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;
        
        let mouse = { x: -1000, y: -1000, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        class VortexParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.angle = Math.random() * Math.PI * 2;
                this.radius = Math.random() * 100;
                this.speed = Math.random() * 1.5 + 0.5;
                this.size = Math.random() * 2 + 0.5;
                this.spin = (Math.random() - 0.5) * 0.01;
                this.x = 0; 
                this.y = 0;
            }

            update() {
                this.radius += this.speed;
                this.angle += this.spin;
                this.speed *= 1.015;

                const centerX = width / 2;
                const centerY = height / 2;

                let targetX = centerX + Math.cos(this.angle) * this.radius;
                let targetY = centerY + Math.sin(this.angle) * this.radius;

                let dx = mouse.x - targetX;
                let dy = mouse.y - targetY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    targetX -= (dx / distance) * force * 40;
                    targetY -= (dy / distance) * force * 40;
                }

                this.x = targetX;
                this.y = targetY;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                let opacity = Math.min(1, this.radius / 300);
                ctx.fillStyle = `rgba(147, 51, 234, ${opacity})`;
                ctx.fill();
            }
        }

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            
            for (let i = 0; i < 400; i++) {
                particles.push(new VortexParticle());
                particles[i].radius = Math.random() * (width / 2); 
            }
        }

        function animateCanvas() {
            requestAnimationFrame(animateCanvas);
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }

        initCanvas();
        animateCanvas();
        window.addEventListener('resize', initCanvas);
    }
});
