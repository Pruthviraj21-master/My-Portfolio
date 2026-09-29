/* ---------------- mobile menu ---------------- */
const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");
if (menuToggle && mobilePanel) {
  let open = false;
  menuToggle.addEventListener("click", () => {
    open = !open;
    mobilePanel.style.display = open ? "flex" : "none";
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------------- active nav link (based on current filename) ---------------- */
(function markActive() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === path) a.classList.add("active");
  });
})();

/* ---------------- scroll reveal ---------------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in"), i * 60);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------------- typing effect for hero role line ---------------- */
const roleEl = document.getElementById("roleLine");
if (roleEl) {
  const roles = JSON.parse(roleEl.dataset.roles || "[]");
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }
    roleEl.querySelector(".role-text").textContent = current.slice(0, charIndex);
    setTimeout(tick, deleting ? 35 : 65);
  }
  if (roles.length) tick();
}

/* ---------------- subtle mouse-follow spotlight in hero ---------------- */
const heroSection = document.querySelector(".hero");
if (heroSection && window.matchMedia("(pointer: fine)").matches) {
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSection.style.setProperty("--mx", x + "%");
    heroSection.style.setProperty("--my", y + "%");
  });
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
