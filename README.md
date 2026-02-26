# K.G.L Sandanimne | Software Engineering Portfolio 👤

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/NimnaOfficial)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://github.com/NimnaOfficial)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/NimnaOfficial)
[![Web3Forms](https://img.shields.io/badge/Web3Forms-Serverless_Contact-8b5cf6?style=for-the-badge)](https://web3forms.com)

An elite, high-performance personal portfolio website built to showcase full-stack software engineering projects, system architectures, and AI/ML data science experiments. 

This project features **zero external dependencies** or bloated libraries, relying entirely on advanced Vanilla CSS and JavaScript to achieve complex 3D DOM physics, custom cursors, and immersive rendering.

 🔗 [View Live Portfolio Here](https://nimnaofficial.github.io/My-Portfolio/) 

---

## 🚀 Key Features & UI/UX Highlights

This portfolio steps away from standard web templates to utilize modern, Awards-winning design patterns and high-end interactive physics:

* **Immersive Vertical Project Carousel:** A custom-engineered, full-screen project slider with crossfading background images, dynamic data injection, and continuous CSS scaling effects.
* **3D Mouse-Tracking Physics:** The "About Me" glassmorphism card calculates mouse positioning via JavaScript to apply a dynamic 10-degree `rotateX` and `rotateY` tilt effect in 3D space.
* **Advanced Typography Animations:** Features liquid-fill gradient text and scroll-scrubbing Intersection Observers.
* **Magnetic Interactive Elements:** Buttons and links use mathematical offsets to physically "pull" toward the user's cursor.
* **Flawless Infinite Marquee:** A mathematically calculated, zero-gap continuous scrolling tech-stack track using a dual-group overflow method.
* **Custom Cursor Engine:** A dual-element trailing cursor that dynamically expands when hovering over clickable DOM elements.
* **Dark / Light Mode Toggle:** Seamless CSS variable switching with `localStorage` persistence.
* **Serverless Contact Form:** Fully integrated with the Web3Forms API to handle form submissions directly to email without a backend database.

---

## 🛠️ Technology Stack

* **Structure:** Semantic HTML5
* **Styling:** CSS3 (Variables, CSS Grid, Flexbox, Keyframes, 3D Transforms, Backdrop-Filter, Liquid Gradients)
* **Logic:** Vanilla JavaScript (ES6+, DOM Manipulation, Intersection Observer API, `requestAnimationFrame`, CSS Variable Injection)
* **Fonts:** [Syne](https://fonts.google.com/specimen/Syne) (Brutalist Headers) & [Inter](https://fonts.google.com/specimen/Inter) (Clean Body Text)

---

## 📂 Project Structure

```text
├── index.html       # Main HTML document structure & Web3Forms integration
├── style.css        # Global variables, responsive layouts, and CSS animations
├── script.js        # DOM interaction, 3D math, observers, and carousel logic
└── README.md        # Project documentation
```
---

## ⚙️ Setup & Installation

Because this project uses vanilla web technologies without a build step or package manager, running it locally is instantaneous.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/NimnaOfficial/portfolio.git](https://github.com/NimnaOfficial/portfolio.git)
   ```
2. **Navigate to the directory:**
   ```bash
   cd portfolio
   ```
3. **Run the site:**
   Simply double-click <code>index.html</code> to open it in your browser, or use a tool like VS Code's Live Server extension for hot-reloading.

---

## 🔧 Configuration Guide

1. **Updating Projects (The Vertical Carousel)**
   The project section is driven by a JavaScript array. To add or update projects, locate the <code>projectDatabase</code> array in <code>script.js</code> and modify the objects:

   ```bash
   const projectDatabase = [
    {
        title: "Your Project Name",
        desc: "Detailed description of your software architecture.",
        tags: ["Java", "Python", "SQL"]
    }
   ];
   ```
2. **Updating the Contact Form**
   The contact form is configured to send submissions directly to <code>lochsand2022@gmail.com</code>. If you fork this repo, replace the hidden <code>access_key</code> input in <code>index.html</code> with your own key from Web3Forms:

---

## 📬 Contact & Links
   * Developer: K.G.L Sandanimne (Nimna)
   * Email: lochsand2022@gmail.com
   * GitHub: @NimnaOfficial
     
---
##
> Designed and Engineered by K.G.L Sandanimne. Western Province, Sri Lanka.
