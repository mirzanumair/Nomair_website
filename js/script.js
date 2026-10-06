/* =========================================================
   Portfolio script
   ---------------------------------------------------------
   HOW TO ADD A PROJECT / SOLUTION (automatic):
   1. Put the image in images/projects/ or images/solutions/
   2. Double-click update-site.bat
   3. Edit the new <imagename>.txt (title, description, ...)
      and run update-site.bat again. Refresh the browser.
   Data lives in js/projects-data.js and js/solutions-data.js
   (both auto-generated).
   ========================================================= */

const PLACEHOLDER = "images/placeholder.jpg";

// Filled by js/projects-data.js and js/solutions-data.js (loaded before this file)
const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
const solutions = Array.isArray(window.SOLUTIONS) ? window.SOLUTIONS : [];

/* ---------------------------------------------------------
   Everything below runs once the DOM is ready.
   (script is loaded with `defer`, so the DOM is parsed)
   --------------------------------------------------------- */

// Flag used by CSS so reveal animations only hide content when JS works
document.documentElement.classList.add("js");

/** Swap a broken image for the placeholder (once, to avoid loops). */
function attachImageFallback(img) {
  if (img.dataset.fallbackBound) return;
  img.dataset.fallbackBound = "true";

  const useFallback = () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";
    img.src = PLACEHOLDER;
  };
  img.addEventListener("error", useFallback);
  // Handle images that already failed before the listener was attached
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) useFallback();
}

/** Build a project card element from a data object (no innerHTML, safe). */
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card reveal";

  // Image
  const media = document.createElement("div");
  media.className = "project-media";
  const img = document.createElement("img");
  attachImageFallback(img);          // attach BEFORE setting src
  img.loading = "lazy";
  img.alt = project.title + " project screenshot";
  img.width = 1200;
  img.height = 750;
  img.src = project.image;
  media.appendChild(img);

  // Body
  const body = document.createElement("div");
  body.className = "project-body";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const desc = document.createElement("p");
  desc.textContent = project.description;

  const tech = document.createElement("ul");
  tech.className = "project-tech";
  project.tech.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    tech.appendChild(li);
  });

  const links = document.createElement("div");
  links.className = "project-links";
  [["Live Demo", project.live], ["GitHub", project.github]].forEach(([label, href]) => {
    if (!href) return;
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    links.appendChild(a);
  });

  body.append(title, desc, tech, links);
  card.append(media, body);
  return card;
}

/** Render all projects into the grid. */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  const fragment = document.createDocumentFragment();
  projects.forEach((p) => fragment.appendChild(createProjectCard(p)));
  grid.appendChild(fragment);
}

/** Build a "Solutions We Provide" card (image, title, description, optional link). */
function createSolutionCard(item) {
  const card = document.createElement("article");
  card.className = "project-card reveal";

  const media = document.createElement("div");
  media.className = "project-media";
  const img = document.createElement("img");
  attachImageFallback(img);          // attach BEFORE setting src
  img.loading = "lazy";
  img.alt = item.title + " solution";
  img.width = 1200;
  img.height = 750;
  img.src = item.image;
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "project-body";
  const title = document.createElement("h3");
  title.textContent = item.title;
  const desc = document.createElement("p");
  desc.textContent = item.description;
  body.append(title, desc);

  if (item.link) {
    const links = document.createElement("div");
    links.className = "project-links";
    const a = document.createElement("a");
    a.href = item.link;
    a.textContent = "Learn more";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    links.appendChild(a);
    body.appendChild(links);
  }

  card.append(media, body);
  return card;
}

/** Render all solutions into the grid. */
function renderSolutions() {
  const grid = document.getElementById("solutionsGrid");
  if (!grid) return;
  const fragment = document.createDocumentFragment();
  solutions.forEach((s) => fragment.appendChild(createSolutionCard(s)));
  grid.appendChild(fragment);
}

/** Mobile hamburger menu. */
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  // Close after choosing a link (smooth scroll itself is handled by CSS)
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  // Close with Escape key
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

/** Scroll-reveal using IntersectionObserver. */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));
}

/** Highlight the nav link of the section currently in view. */
function setupActiveLink() {
  if (!("IntersectionObserver" in window)) return;
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
}

// ---- Init ----
renderSolutions();
renderProjects();
document.querySelectorAll("img").forEach(attachImageFallback); // covers profile image too
setupNav();
setupReveal();
setupActiveLink();
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
