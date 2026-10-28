document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // // 0. EVOLVED TACTICAL HUD (CONTINUOUS ROUND ROTATION)
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

  // // NEW: Variables for infinite, continuous rolling physics
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
      hudData.textContent = `SYS.ONLINE // X:${mouseX} Y:${mouseY}`;
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

    // // THE MAGIC: Continuous "Roundly" Rolling Physics
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

    el.addEventListener("mouseleave", () => {
      hudCursor.classList.remove("active-target");
      hudData.textContent = `SYS.ONLINE // X:${mouseX} Y:${mouseY}`;
    });
  });

  // =========================================================
  // // TWO-WAY SCROLL ANIMATION ENGINE
  // =========================================================
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          // If element does not contain map iframe, toggle back to enable re-entrance
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
      threshold: 0.1,
      rootMargin: "0px 0px -20px 0px",
    },
  );

  const hiddenElements = document.querySelectorAll(".reveal-up");
  hiddenElements.forEach((el) => scrollObserver.observe(el));
  // --- // UPGRADED: Physics-based Smooth Scrolling Engine ---
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

  // --- // MANDATORY FEATURES: SCROLL PROGRESS & BACK TO TOP ---
  const progressBar = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  function updateScrollState() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      lenis.scrollTo(0, { duration: 1.2 });
    });
  }

  // --- // TACTICAL HUD TOAST NOTIFICATION ---
  const hudToast = document.getElementById("hud-toast");
  const toastText = document.getElementById("toast-text");
  let toastTimer;

  function showToast(message) {
    if (!hudToast || !toastText) return;
    toastText.textContent = message;
    hudToast.classList.add("active");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hudToast.classList.remove("active");
    }, 2800);
  }

  // --- // RESUME / CV MODAL ENGINE ---
  const resumeModal = document.getElementById("resume-modal");
  const resumeBtn = document.getElementById("resume-btn");
  const heroResumeBtn = document.getElementById("hero-resume-btn");
  const mobileResumeBtn = document.getElementById("mobile-resume-btn");
  const modalClose = document.getElementById("modal-close");
  const modalCopyEmail = document.getElementById("modal-copy-email");

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add("active");
      resumeModal.setAttribute("aria-hidden", "false");
      showToast("SYS.ACCESS // RESUME MATRIX LOADED");
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove("active");
      resumeModal.setAttribute("aria-hidden", "true");
    }
  }

  if (resumeBtn) resumeBtn.addEventListener("click", openResume);
  if (heroResumeBtn) heroResumeBtn.addEventListener("click", openResume);
  if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener("click", () => {
      if (hamburger && mobileMenu) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      }
      openResume();
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeResume);

  if (resumeModal) {
    resumeModal.addEventListener("click", (e) => {
      if (e.target === resumeModal) closeResume();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && resumeModal.classList.contains("active")) {
        closeResume();
      }
    });
  }

  // --- // CLIPBOARD COPY ENGINES ---
  const copyEmailBtn = document.getElementById("copy-email-btn");
  function copyEmailAction() {
    navigator.clipboard.writeText("lochsand2022@gmail.com").then(() => {
      showToast("SYS.CLIPBOARD // EMAIL COPIED");
    }).catch(() => {
      showToast("EMAIL: lochsand2022@gmail.com");
    });
  }

  if (copyEmailBtn) copyEmailBtn.addEventListener("click", copyEmailAction);
  if (modalCopyEmail) modalCopyEmail.addEventListener("click", copyEmailAction);

  // --- 1. THEME TOGGLE (Dark/Light Mode) ---
  const themeBtn = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  if (localStorage.getItem("theme") === "light") {
    htmlEl.setAttribute("data-theme", "light");
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
      title: "PixMath Studio",
      desc: "An industrial-grade cyber-physical workstation bridging continuous mathematics and discrete pixel architecture. Compiles algebraic formulas into GPU fragment shaders for 120 FPS WebGL2 rendering, with symbolic reverse-extraction via PyTorch SIREN/KAN implicit neural representations.",
      tags: ["React 19", "WebGL2", "PyTorch", "Python 3.11", "SIREN / KAN", "Vite"],
      repoLink: "https://github.com/NimnaOfficial/PixMath",
      liveLink: "",
    },
    {
      title: "SmartMove Transit Platform",
      desc: "Enterprise distributed transit intelligence platform engineered for Sri Lanka's national bus network. Powered by Spring Cloud Gateway routing, Netflix Eureka service discovery, and polyglot persistence: ACID-compliant Oracle 21c XE core with MongoDB Atlas for unstructured fleet telemetry.",
      tags: ["Spring Boot 3.x", "Spring Cloud", "Oracle 21c", "MongoDB", "React 19", "Microservices"],
      repoLink: "https://github.com/NimnaOfficial/SmartMove",
      liveLink: "",
    },
    {
      title: "GhostPort OS",
      desc: "High-performance C++20 multi-threaded systems utility engineered for zero-copy port reaping, thread-level process stasis, and Docker container control. Bypasses standard task managers by hooking directly into Windows Toolhelp32/PDH, Linux /proc, and macOS Mach kernel APIs.",
      tags: ["C++20", "Kernel APIs", "Systems Programming", "Docker", "CMake", "TUI"],
      repoLink: "https://github.com/NimnaOfficial/GhostPort",
      liveLink: "",
    },
    {
      title: "TechFix Mobile Edge",
      desc: "Enterprise repair lifecycle Android platform built with Java and Kotlin, backed by Cloudflare Workers and Cloudflare D1 (SQLite at the edge). Features sub-millisecond edge latency, geospatial auto-routing of customer requests, and multi-tier RBAC.",
      tags: ["Android", "Kotlin / Java", "Cloudflare Workers", "Cloudflare D1", "SQLite Edge"],
      repoLink: "https://github.com/NimnaOfficial/TECHFIX",
      liveLink: "https://streamable.com/x1kgdd",
    },
    {
      title: "AnyGPA Global SaaS",
      desc: "Edge-native academic SaaS running on Wasmer Edge WebAssembly (WASI) containers. Features an AI Vision Extractor powered by Google Gemini 1.5 Flash with 5-key automated failover rotation to OCR official transcripts, coupled with GPU-accelerated GSAP 3D physics.",
      tags: ["Wasmer WASI", "PHP 8.2", "Gemini 1.5 Flash", "GSAP 3.12", "PWA", "MySQL"],
      repoLink: "https://github.com/NimnaOfficial/AnyGPA",
      liveLink: "https://anygpa.wasmer.app/",
    },
    {
      title: "Data Storm: Beverage Potential",
      desc: "Machine Learning Medallion Lakehouse pipeline predicting latent purchase demand across 20,000 Sri Lankan retail outlets for OCTAVE (John Keells Group). Solved supply-chain constraints as a left-censored demand problem with Parquet columnar storage and geospatial foot-traffic modeling.",
      tags: ["Python", "Medallion Lakehouse", "Parquet", "Geospatial ML", "Pandas"],
      repoLink: "https://github.com/NimnaOfficial/BaveragePotential",
      liveLink: "",
    },
    {
      title: "EDU. 0 Engine",
      desc: "Asynchronous Python compiler containerized with Docker and deployed via Telegram Bot API. Dynamically unpacks .h5p interactive educational packages and compiles them in RAM into 16:9 widescreen PowerPoint presentations and ReportLab Platypus PDFs without touching physical disk.",
      tags: ["Python 3.11", "AsyncIO", "Docker", "Telegram Bot API", "In-RAM Compiler", "ReportLab"],
      repoLink: "https://github.com/NimnaOfficial/EDU.-0-project",
      liveLink: "https://t.me/edu_0_bot",
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

  // --- // PROJECT DISCIPLINE FILTER MATRIX ---
  const filterChips = document.querySelectorAll(".filter-chip");
  if (filterChips.length > 0) {
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter");
        filterChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");

        let firstMatch = null;
        thumbCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            card.classList.remove("dimmed");
            if (!firstMatch) firstMatch = card;
          } else {
            card.classList.add("dimmed");
          }
        });

        if (firstMatch) {
          firstMatch.click();
        }

        showToast(`FILTER.APPLIED // ${chip.textContent.trim()}`);
      });
    });
  }

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

        // // 1. DRASTICALLY SLOWED Base Speed
        // Was: Math.random() * 0.6 + 0.2
        this.speed = Math.random() * 0.4 + 0.02;

        this.size = Math.random() * 2 + 0.5;

        // // 2. SLOWED Rotation (Spin)
        // Was: (Math.random() - 0.5) * 0.005
        this.spin = (Math.random() - 0.5) * 0.0004;

        this.x = 0;
        this.y = 0;
      }

      update() {
        this.radius += this.speed;
        this.angle += this.spin;

        // // 3. REMOVED Aggressive Acceleration
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
          // // 4. SOFTER Mouse Repulsion
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
