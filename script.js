(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile navigation toggle
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggleBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      }
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Animate circular skill rings
  const ringEls = Array.from(document.querySelectorAll(".ring"));
  const ringObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const ring = entry.target;
        ringObserver.unobserve(ring);

        const target = Number(ring.getAttribute("data-percent") || 0);
        const valueEl = ring.querySelector(".ring-value");
        let current = 0;
        const start = performance.now();
        const duration = 900;

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          current = Math.round(target * t);
          ring.style.setProperty("--p", String(current));
          if (valueEl) valueEl.textContent = `${current}%`;
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.35 }
  );
  ringEls.forEach((ring) => ringObserver.observe(ring));

  // Active section highlighting
  const sectionIds = ["home", "about", "whatido", "portfolio", "resume", "blog", "contact"];
  const sectionEls = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linkForId = (id) => navLinks.find((a) => a.getAttribute("href") === `#${id}`);

  const activeObserver = new IntersectionObserver(
    (entries) => {
      // Choose the entry with the highest intersection ratio
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!visible) return;

      const id = visible.target.id;
      const activeLink = linkForId(id);
      if (!activeLink) return;

      navLinks.forEach((l) => l.classList.remove("is-active"));
      activeLink.classList.add("is-active");
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );
  sectionEls.forEach((el) => activeObserver.observe(el));

  // Contact form
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !email || !message) {
        if (formNote) formNote.textContent = "Please fill in all fields.";
        return;
      }
      if (!emailOk) {
        if (formNote) formNote.textContent = "Please enter a valid email address.";
        return;
      }

      const to = "shivankchahal64513@gmail.com";
      const subject = `Portfolio Inquiry - ${name}`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}\n`;

      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formNote) {
        formNote.textContent = "Opening your email client...";
      }

      window.location.href = mailto;
    });
  }
})();

