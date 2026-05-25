document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 🔥 0. EVOLVED TACTICAL HUD (CONTINUOUS ROUND ROTATION)
  // =========================================================
  const hudCursor = document.getElementById("hud-cursor");
  const hudData = document.getElementById("hud-data");

  const interactiveElements = document.querySelectorAll(
    "a, button, .thumb-card, .accordion-header, input, textarea, .hamburger",
  );

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  // 🔥 NEW: Variables for infinite, continuous rolling physics
  let currentRotation = 0;
  let rotationVelocity = 0;

  const speed = 0.52;
  let idleTimeout;

  // 1. TRACK THE MOUSE & HANDLE IDLE STATE
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    hudCursor.classList.remove("is-idle");

    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      if (!hudCursor.classList.contains("active-target")) {
        hudCursor.classList.add("is-idle");
      }
    }, 150);

    if (!hudCursor.classList.contains("active-target")) {
      hudData.textContent = `SYS.IDLE // X:${mouseX} Y:${mouseY}`;
    }
  });

  // 2. THE PHYSICS LOOP
  function animateHUD() {
    // Calculate raw velocity
    const velX = mouseX - cursorX;
    const velY = mouseY - cursorY;

    // Smooth position dragging
    cursorX += velX * speed;
    cursorY += velY * speed;

    hudCursor.style.transform = `translate3d(calc(${cursorX}px - 12px), calc(${cursorY}px - 12px), 0)`;

    // Calculate Parallax Drag
    const dragX = velX * -0.15;
    const dragY = velY * -0.15;

    // 🔥 THE MAGIC: Continuous "Roundly" Rolling Physics
    // 1. Target spin speed based on horizontal velocity (moves right -> spins left)
    const targetSpinSpeed = velX * -0.4;

    // 2. Smooth out the acceleration and deceleration of the spin
    rotationVelocity += (targetSpinSpeed - rotationVelocity) * 0.15;

    // 3. Add the velocity continuously so it rolls infinitely (360+ degrees)
    currentRotation += rotationVelocity;

    // Inject smoothed coordinates into CSS
    hudCursor.style.setProperty("--vx", `${dragX}px`);
    hudCursor.style.setProperty("--vy", `${dragY}px`);
    hudCursor.style.setProperty("--rot", `${currentRotation}deg`);

    requestAnimationFrame(animateHUD);
  }

  animateHUD();

  // 3. TARGET LOCK LOGIC
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      hudCursor.classList.add("active-target");
      hudCursor.classList.remove("is-idle");

      let actionText = "[ TARGET_LOCKED ]";
      if (el.tagName === "A") actionText = "[ NAV_LINK_DETECTED ]";
      if (el.classList.contains("thumb-card"))
        actionText = "[ ACCESS_PROJECT_DB ]";
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA")
        actionText = "[ AWAITING_KEYSTROKES ]";
      if (el.classList.contains("accordion-header"))
        actionText = "[ EXPAND_MODULE ]";

      hudData.textContent = actionText;
    });

    // =========================================================
    // 🔥 INFINITE TWO-WAY SCROLL ANIMATION ENGINE
    // =========================================================

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element has entered the screen
            entry.target.classList.add("is-visible");
          } else {
            // 🔥 THE FIX: Check if the element contains the Google Map
            // If it DOES NOT have the map, it is safe to remove the class and animate infinitely
            if (
              !entry.target.querySelector("iframe") &&
              !entry.target.classList.contains("map-wrapper")
            ) {
              entry.target.classList.remove("is-visible");
            }
          }
        });
      },
      {
        // Lowered threshold slightly to ensure tall sections trigger easily
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    // Select every single element that has the reveal-up class
    const hiddenElements = document.querySelectorAll(".reveal-up");

    // Command the observer to watch all of them endlessly
    hiddenElements.forEach((el) => scrollObserver.observe(el));

    el.addEventListener("mouseleave", () => {
      hudCursor.classList.remove("active-target");
      hudData.textContent = `SYS.IDLE // X:${mouseX} Y:${mouseY}`;
    });
  });
  // --- 🔥 UPGRADED: Physics-based Smooth Scrolling Engine ---
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    // Disable smooth scroll on mobile to allow native browser swiping
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- 10. DRAG-TO-SCROLL ENGINE FOR DESKTOP ---
  const slider = document.querySelector(".proj-thumbnails");
  let isDown = false;
  let startY;
  let scrollTop;

  if (slider) {
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active-drag");
      startY = e.pageY - slider.offsetTop;
      scrollTop = slider.scrollTop;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active-drag");
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active-drag");
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return; // Only trigger if mouse is held down
      e.preventDefault();
      const y = e.pageY - slider.offsetTop;
      const walk = (y - startY) * 2; // Multiplier adjusts scroll speed
      slider.scrollTop = scrollTop - walk;
    });
  }

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" },
    );
  });

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursorOutline.classList.add("hover-active"),
    );
    el.addEventListener("mouseleave", () =>
      cursorOutline.classList.remove("hover-active"),
    );
  });

  // --- 1. THEME TOGGLE (Dark/Light Mode) ---
  const themeBtn = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  if (localStorage.getItem("theme") === "dark") {
    htmlEl.setAttribute("data-theme", "dark");
  }

  themeBtn.addEventListener("click", () => {
    if (htmlEl.getAttribute("data-theme") === "light") {
      htmlEl.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      htmlEl.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });

  // --- 2. STICKY NAVBAR & MOBILE MENU TOGGLE ---
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });

  // Toggle Floating Glass Menu
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });

    // Close menu cleanly when a link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      });
    });
  }

  // --- 3. MAGNETIC BUTTON FIX ---
  const magneticBtns = document.querySelectorAll(".magnetic-btn");

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;

      btn.style.setProperty("--mx", `${x * 0.3}px`);
      btn.style.setProperty("--my", `${y * 0.5}px`);
    });

    btn.addEventListener("mouseout", () => {
      btn.style.setProperty("--mx", `0px`);
      btn.style.setProperty("--my", `0px`);
    });
  });

  // --- 4. 3D HOVER TILT FOR ABOUT CARD ---
  const tiltCard = document.querySelector(".tilt-card");
  if (tiltCard) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // --- 5. ACCORDION LOGIC ---
  const accordionItems = document.querySelectorAll(".accordion-item");
  if (accordionItems.length > 0) {
    const firstBody = accordionItems[0].querySelector(".accordion-body");
    firstBody.style.maxHeight = firstBody.scrollHeight + "px";

    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        const body = item.querySelector(".accordion-body");

        accordionItems.forEach((acc) => {
          acc.classList.remove("active");
          acc.querySelector(".accordion-body").style.maxHeight = "0";
        });

        if (!isActive) {
          item.classList.add("active");
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
      liveLink: "https://lankawashing.infinityfree.me/",
    },
    {
      title: "Smart Crop Supply Mgmt",
      desc: "About Smart Crop Supply Management System is a Java desktop application for managing farmers, crops, inventory, buyer requests, and reports using a role-based system with MySQL integration.",
      tags: ["JasperReports", "Backend", "SQL"],
      repoLink:
        "https://github.com/NimnaOfficial/SmartCropSupplyManagementSystem",
      liveLink: "",
    },
    {
      title: "AI & Data Science",
      desc: "Hands-on experimentation with Python-based AI/ML concepts. Built predictive models, data analysis pipelines, and basic neural networks. (COMING SOON)",
      tags: ["Python", "Machine Learning", "Data Science"],
      repoLink: "",
      liveLink: "",
    },
    {
      title: "Auto Parts Online",
      desc: "AutoHub is a responsive e-commerce platform delivering premium auto parts in Sri Lanka. It combines an intuitive UI/UX with a secure PHP backend for a seamless shopping experience.",
      tags: ["HTML", "CSS", "JS", "PHP"],
      repoLink: "https://github.com/NimnaOfficial/AutoPartsOnline",
      liveLink: "https://autopartsonlinex.infinityfree.me/",
    },
    {
      title: "Any GPA",
      desc: "ANY GPA is an edge-native academic SaaS engineered for global scale. It empowers students to architect, calculate, and share custom grading frameworks seamlessly. ",
      tags: ["HTML", "CSS", "JS", "PHP", "SQL", "AI", "Wasmer", "API"],
      repoLink: "https://github.com/NimnaOfficial/AnyGPA",
      liveLink: "https://anygpa.wasmer.app/",
    },
    {
      title: "Ghost Port OS",
      desc: "Ghost Port OS is a high-performance terminal utility for managing system ports. It provides a sleek interface for monitoring and controlling network connections.",
      tags: ["C++", "System Programming", "Networking", "CMaker", "Pwsh"],
      repoLink: "https://github.com/NimnaOfficial/GhostPort",
    },
    {
      title: "Beverage Potential",
      desc: "Traditional historical sales data answers the question: What did this outlet sell? Our mission was to answer a fundamentally different question",
      tags: ["Python", "Data Analysis", "Machine Learning", "Visualization"],
      repoLink: "https://github.com/NimnaOfficial/BaveragePotential",
    },
  ];

  const thumbCards = document.querySelectorAll(".thumb-card");
  const bgLayers = document.querySelectorAll(".proj-bg-layer");
  const projTitle = document.getElementById("proj-title");
  const projDesc = document.getElementById("proj-desc");
  const projTags = document.getElementById("proj-tags");
  const infoWrapper = document.querySelector(".proj-info-wrapper");
  const repoBtn = document.getElementById("proj-repo-btn");
  const liveBtn = document.getElementById("proj-live-btn");

  if (infoWrapper)
    infoWrapper.style.transition = "opacity 0.4s ease, transform 0.4s ease";

  thumbCards.forEach((card) => {
    card.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      if (this.classList.contains("active")) return;

      // Smoothly auto-center the clicked thumbnail
      this.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      thumbCards.forEach((t) => t.classList.remove("active"));
      bgLayers.forEach((bg) => bg.classList.remove("active"));

      this.classList.add("active");
      bgLayers[index].classList.add("active");

      // Grab the individual elements for a staggered animation
      const animatedElements = [
        document.getElementById("proj-tags"),
        document.getElementById("proj-title"),
        document.getElementById("proj-desc"),
        document.querySelector(".proj-action-btns"),
      ];

      // 1. STAGGERED ANIMATE OUT (Fade and slide up slightly)
      animatedElements.forEach((el, i) => {
        if (!el) return;
        el.animate(
          [
            { opacity: 1, transform: "translateY(0px)" },
            { opacity: 0, transform: "translateY(-15px)" },
          ],
          {
            duration: 250,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth ease out
            fill: "forwards",
            delay: i * 40, // 40ms stagger between each element
          },
        );
      });

      // Wait for the out-animation to finish before swapping data
      setTimeout(() => {
        const currentProject = projectDatabase[index];

        projTitle.textContent = currentProject.title;
        projDesc.textContent = currentProject.desc;

        projTags.innerHTML = "";
        currentProject.tags.forEach((tagText) => {
          const span = document.createElement("span");
          span.classList.add("tag");
          span.textContent = tagText;
          projTags.appendChild(span);
        });

        if (currentProject.repoLink) {
          repoBtn.href = currentProject.repoLink;
          repoBtn.style.display = "inline-block";
        } else {
          repoBtn.style.display = "none";
        }

        if (currentProject.liveLink) {
          liveBtn.href = currentProject.liveLink;
          liveBtn.style.display = "inline-block";
        } else {
          liveBtn.style.display = "none";
        }

        // 2. STAGGERED ANIMATE IN (Fade and snap up from the bottom)
        animatedElements.forEach((el, i) => {
          if (!el) return;
          el.animate(
            [
              { opacity: 0, transform: "translateY(30px)" },
              { opacity: 1, transform: "translateY(0px)" },
            ],
            {
              duration: 500,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)", // Premium snappy spring effect
              fill: "forwards",
              delay: i * 60, // 60ms stagger for the entrance
            },
          );
        });
      }, 350); // Trigger swap right after the last element fades out
    });
  });

  // --- 7. SCROLL REVEAL ANIMATIONS ---
  const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(" .reveal-fade")
    .forEach((el) => scrollObserver.observe(el));

  // --- 8. ANTIGRAVITY TEXT REVEAL (DYNAMIC CURSOR TYPEWRITER) ---
  const heroText = document.getElementById("hero-text");
  if (heroText) {
    const rawHTML = heroText.innerHTML;
    heroText.innerHTML = ""; // Clear the initial text

    // Create containers for the text and the cursor
    const textContainer = document.createElement("span");
    const cursorSpan = document.createElement("span");

    cursorSpan.classList.add("type-cursor");
    cursorSpan.textContent = "_"; // Your colored underscore

    heroText.appendChild(textContainer);
    heroText.appendChild(cursorSpan);

    // Break the HTML string into tags and individual characters
    const parts = rawHTML.split(/(<[^>]*>)/g);
    let allChars = [];

    parts.forEach((part) => {
      if (part.startsWith("<")) {
        allChars.push({ type: "tag", content: part });
      } else {
        const chars = part.split("");
        chars.forEach((char) => {
          allChars.push({ type: "char", content: char });
        });
      }
    });

    let currentIndex = 0;

    function typeNext() {
      if (currentIndex < allChars.length) {
        const current = allChars[currentIndex];

        // If it's a <br> tag, insert it instantly
        if (current.type === "tag") {
          const temp = document.createElement("div");
          temp.innerHTML = current.content;
          while (temp.firstChild) {
            textContainer.appendChild(temp.firstChild);
          }
          setTimeout(typeNext, 0);
        }
        // If it's a space, insert it instantly
        else if (current.content === " ") {
          textContainer.appendChild(document.createTextNode(" "));
          setTimeout(typeNext, 0);
        }
        // If it's a letter, type it out with the animation
        else {
          const charSpan = document.createElement("span");
          charSpan.classList.add("char-span");
          charSpan.textContent = current.content;
          textContainer.appendChild(charSpan);

          // Trigger the CSS fade-in
          setTimeout(() => {
            charSpan.classList.add("revealed");
          }, 10);

          setTimeout(typeNext, 160); // Typing speed (90ms per letter)
        }
        currentIndex++;
      } else {
        // When finished typing, make the cursor blink infinitely
        cursorSpan.classList.add("blinking");
      }
    }

    // Start the typing animation half a second after the page loads
    setTimeout(typeNext, 500);
  }

  // --- 9. RADIATING PARTICLE VORTEX (SLOWED DOWN AMBIENT) ---
  const canvas = document.getElementById("antigravity-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, particles;

    let mouse = { x: -1000, y: -1000, radius: 150 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
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

        // 🔥 1. DRASTICALLY SLOWED Base Speed
        // Was: Math.random() * 0.6 + 0.2
        this.speed = Math.random() * 0.4 + 0.02;

        this.size = Math.random() * 2 + 0.5;

        // 🔥 2. SLOWED Rotation (Spin)
        // Was: (Math.random() - 0.5) * 0.005
        this.spin = (Math.random() - 0.5) * 0.0004;

        this.x = 0;
        this.y = 0;
      }

      update() {
        this.radius += this.speed;
        this.angle += this.spin;

        // 🔥 3. REMOVED Aggressive Acceleration
        // Was: this.speed *= 1.005 (which makes them speed up exponentially)
        this.speed *= 1.002;

        const centerX = width / 2;
        const centerY = height / 2;

        let targetX = centerX + Math.cos(this.angle) * this.radius;
        let targetY = centerY + Math.sin(this.angle) * this.radius;

        let dx = mouse.x - targetX;
        let dy = mouse.y - targetY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          // 🔥 4. SOFTER Mouse Repulsion
          // Was: force * 40
          targetX -= (dx / distance) * force * 15;
          targetY -= (dy / distance) * force * 15;
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

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
    }

    initCanvas();
    animateCanvas();
    window.addEventListener("resize", initCanvas);
  }
});
