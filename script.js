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

        // Smooth follow for the outline ring
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

    // --- 3. MAGNETIC BUTTON FIX (Prevents Transform Clashes) ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            // Setting CSS variables instead of hard transforms to preserve Z-index layouts
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
            liveLink: "https://lankawashing.infinityfree.me/" // Triggers the Visit Website button
        },
        {
            title: "Smart Crop Supply Mgmt",
            desc: "About Smart Crop Supply Management System is a Java desktop application for managing farmers, crops, inventory, buyer requests, and reports using a role-based system with MySQL integration.",
            tags: ["JasperReports", "Backend", "SQL"],
            repoLink: "https://github.com/NimnaOfficial/SmartCropSupplyManagementSystem",
            liveLink: "" // Empty string means the button will hide
        },
        {
            title: "AI & Data Science",
            desc: "Hands-on experimentation with Python-based AI/ML concepts. Built predictive models, data analysis pipelines, and basic neural networks. (COMING SOON)",
            tags: ["Python", "Machine Learning", "Data Science"],
            repoLink: "",
            liveLink: "" // Empty string means the button will hide
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
    
    // Grab the new buttons
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

            // Fade out current text
            infoWrapper.style.opacity = '0';
            infoWrapper.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                const currentProject = projectDatabase[index];
                
                // Update text
                projTitle.textContent = currentProject.title;
                projDesc.textContent = currentProject.desc;
                
                // Update tags
                projTags.innerHTML = '';
                currentProject.tags.forEach(tagText => {
                    const span = document.createElement('span');
                    span.classList.add('tag');
                    span.textContent = tagText;
                    projTags.appendChild(span);
                });

                // Update Repo Button Visibility
                if (currentProject.repoLink) {
                    repoBtn.href = currentProject.repoLink;
                    repoBtn.style.display = 'inline-block';
                } else {
                    repoBtn.style.display = 'none';
                }

                // Update Live Button Visibility
                if (currentProject.liveLink) {
                    liveBtn.href = currentProject.liveLink;
                    liveBtn.style.display = 'inline-block';
                } else {
                    liveBtn.style.display = 'none';
                }

                // Fade back in
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
});
