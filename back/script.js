document.addEventListener("DOMContentLoaded", () => {

    // --- 1. THEME TOGGLE (Dark/Light Mode) ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        if (currentTheme === 'light') {
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

    // --- 3. ACCORDION LOGIC ---
    const accordionItems = document.querySelectorAll('.accordion-item');

    // Initialize the first one to be open accurately
    const firstBody = accordionItems[0].querySelector('.accordion-body');
    firstBody.style.maxHeight = firstBody.scrollHeight + "px";

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            const body = item.querySelector('.accordion-body');

            // Close all items
            accordionItems.forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.accordion-body').style.maxHeight = '0';
            });

            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // --- 4. SCROLL ANIMATIONS (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Special trigger for the About section hollow text
                if (entry.target.id === 'about') {
                    entry.target.classList.add('active');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe reveal elements
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => scrollObserver.observe(el));
    // Observe about section for specific text effect
    scrollObserver.observe(document.getElementById('about'));

    // --- 5. MAGNETIC BUTTON EFFECT (Modern Creative UI) ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            // Move the button slightly toward the mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseout', () => {
            // Reset to original position smoothly
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- IMMERSIVE VERTICAL CAROUSEL LOGIC ---
    
    // 1. Your Project Data
    const projectDatabase = [
        {
            title: "Lanka Washing System",
            desc: "A hybrid application handling 500+ database queries efficiently. Designed and implemented 15+ UI screens to ensure a smooth, seamless user experience.",
            tags: ["Java", "PHP", "UI/UX"]
        },
        {
            title: "Resource Mgmt System",
            desc: "Designed 20+ functional modules for production workflow optimization. Successfully integrated JasperReports for real-time reporting and data analytics.",
            tags: ["JasperReports", "Backend", "SQL"]
        },
        {
            title: "AI & Data Science",
            desc: "Hands-on experimentation with Python-based AI/ML concepts. Built predictive models, data analysis pipelines, and basic neural networks.",
            tags: ["Python", "Machine Learning", "Data Science"]
        }
    ];

    // 2. DOM Elements
    const thumbCards = document.querySelectorAll('.thumb-card');
    const bgLayers = document.querySelectorAll('.proj-bg-layer');
    const projTitle = document.getElementById('proj-title');
    const projDesc = document.getElementById('proj-desc');
    const projTags = document.getElementById('proj-tags');
    const infoWrapper = document.querySelector('.proj-info-wrapper');

    // 3. Click Event Logic
    thumbCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get index of clicked card
            const index = this.getAttribute('data-index');

            // Prevent animating if already active
            if (this.classList.contains('active')) return;

            // Remove active class from all thumbs and backgrounds
            thumbCards.forEach(t => t.classList.remove('active'));
            bgLayers.forEach(bg => bg.classList.remove('active'));

            // Add active class to clicked thumb and corresponding background
            this.classList.add('active');
            bgLayers[index].classList.add('active');

            // Animate Text Change (Fade out, update, Fade in)
            infoWrapper.style.opacity = '0';
            infoWrapper.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                // Update Text
                projTitle.textContent = projectDatabase[index].title;
                projDesc.textContent = projectDatabase[index].desc;
                
                // Update Tags
                projTags.innerHTML = ''; // Clear old tags
                projectDatabase[index].tags.forEach(tagText => {
                    const span = document.createElement('span');
                    span.classList.add('tag');
                    span.textContent = tagText;
                    projTags.appendChild(span);
                });

                // Fade back in
                infoWrapper.style.opacity = '1';
                infoWrapper.style.transform = 'translateY(0)';
            }, 400); // Wait 400ms for CSS fade out to complete
        });
    });

    // Setup initial smooth transition for text wrapper
    infoWrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    // 3. 3D Interactive Mouse Tilt for the About Card
    const aboutCard = document.querySelector('.about-content');
    
    if (aboutCard) {
        aboutCard.addEventListener('mousemove', (e) => {
            // Get the card's dimensions and mouse position
            const rect = aboutCard.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            // Find the center of the card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate how much to rotate (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            // Apply the physics
            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Smoothly snap back to flat when the mouse leaves
        aboutCard.addEventListener('mouseleave', () => {
            aboutCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

});