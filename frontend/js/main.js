// ================= THEME TOGGLE =================
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  body.setAttribute("data-theme", savedTheme);
}

themeToggle.addEventListener("click", () => {
  const current = body.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
  initParticles(); // re-init with matching particle color
});

// ================= MOBILE NAV =================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// ================= PARTICLES.JS =================
function initParticles() {
  if (typeof particlesJS === "undefined") return;

  const isDark = body.getAttribute("data-theme") !== "light";
  const color = isDark ? "#5b8cff" : "#2b6cb0";

  particlesJS("particles-js", {
    particles: {
      number: { value: 55, density: { enable: true, value_area: 900 } },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 140,
        color: color,
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.4,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.5 } },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  });
}

initParticles();

// ================= TYPED.JS =================
if (typeof Typed !== "undefined") {
  new Typed("#typed-text", {
    strings: ["Full Stack Developer", "MERN Stack Developer", "Problem Solver"],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 1500,
    loop: true,
    showCursor: false,
  });
}

// ================= SCROLLREVEAL =================
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    distance: "40px",
    duration: 700,
    easing: "cubic-bezier(0.5, 0, 0, 1)",
    reset: false,
  });

  sr.reveal(".reveal", { interval: 80, origin: "bottom" });
}

// ================= NAVBAR SCROLL SHADOW =================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 20) {
    navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.15)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

// ================= PROJECTS: LOAD & RENDER (static JSON) =================

// Maps known tech names to Devicon classes for nice colored logos.
// Falls back to a generic code icon if not found.
const TECH_ICON_MAP = {
  "React": "devicon-react-original colored",
  "Node.js": "devicon-nodejs-plain colored",
  "Express": "devicon-express-original",
  "MongoDB": "devicon-mongodb-plain colored",
  "JavaScript": "devicon-javascript-plain colored",
  "TypeScript": "devicon-typescript-plain colored",
  "Tailwind CSS": "devicon-tailwindcss-original colored",
  "Vite": "devicon-vitejs-plain colored",
  "HTML5": "devicon-html5-plain colored",
  "CSS3": "devicon-css3-plain colored",
  "Git": "devicon-git-plain colored",
};

function techIconHtml(tech) {
  const iconClass = TECH_ICON_MAP[tech];
  if (iconClass) {
    return `<i class="${iconClass}"></i>`;
  }
  return `<i class="fa-solid fa-code"></i>`;
}

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  const loadingText = document.getElementById("loadingText");

  try {
    const response = await fetch("projects/projects.json");
    if (!response.ok) throw new Error("Could not load projects.json");
    const projects = await response.json();

    if (!projects.length) {
      grid.innerHTML = `<p class="loading-text">Projects coming soon — check back shortly!</p>`;
      return;
    }

    grid.innerHTML = "";

    projects.forEach((project, index) => {
      const card = document.createElement("div");
      // Alternate slide-in direction per card for a "slides" style entrance
      const slideClass = index % 2 === 0 ? "reveal-left" : "reveal-right";
      card.className = `project-card ${slideClass}`;

      const techTags = (project.techStack || [])
        .map((tech) => `<span class="tech-tag">${techIconHtml(tech)} ${escapeHtml(tech)}</span>`)
        .join("");

      card.innerHTML = `
        <div class="project-card-body">
          <div class="project-card-title">
            ${escapeHtml(project.title)}
            ${project.featured ? `<span class="featured-badge">Featured</span>` : ""}
          </div>
          <p class="project-card-desc">${escapeHtml(project.description)}</p>
          <div class="tech-tags">${techTags}</div>
          <div class="project-card-links">
            ${project.githubUrl ? `<a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>` : ""}
            ${project.liveUrl ? `<a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ""}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Enable 3D tilt effect on the newly rendered cards
    if (typeof VanillaTilt !== "undefined") {
      VanillaTilt.init(document.querySelectorAll(".project-card"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.03,
      });
    }

    // Apply alternating slide-in scroll reveal now that cards exist
    if (typeof ScrollReveal !== "undefined") {
      const sr = ScrollReveal({ duration: 700, easing: "cubic-bezier(0.5, 0, 0, 1)", reset: false });
      sr.reveal(".reveal-left", { origin: "left", distance: "50px", interval: 100 });
      sr.reveal(".reveal-right", { origin: "right", distance: "50px", interval: 100 });
    }
  } catch (error) {
    if (loadingText) {
      loadingText.textContent = "Could not load projects right now. Please try again later.";
    }
    console.error("Failed to load projects:", error.message);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ================= CONTACT FORM =================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.style.color = "";

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      await apiRequest("/messages", "POST", payload);
      formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
      formStatus.style.color = "#38a169";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = error.message;
      formStatus.style.color = "#e53e3e";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// ================= INITIAL LOAD =================
loadProjects();
