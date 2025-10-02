// Utilidades básicas
const $ = (sel, ctx = document) => ctx.querySelector(sel);

// Año dinámico en footer
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil (overlay)
const toggleBtn = $(".menu-toggle");
const navLinks = $(".nav-links"); // fallback desktop
const mobileMenu = $(".mobile-menu");
const openMobileMenu = () => {
  if (!mobileMenu) return;
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  toggleBtn && toggleBtn.setAttribute("aria-expanded", "true");
  if (toggleBtn) {
    toggleBtn.textContent = "X"; // usar X simple para máxima compatibilidad
    toggleBtn.setAttribute("aria-label", "Cerrar menú");
  }
  if (toggleBtn) toggleBtn.classList.add("is-open");
};
const closeMobileMenu = () => {
  if (!mobileMenu) return;
  if (!mobileMenu.classList.contains("open")) return;
  // Animación de salida
  mobileMenu.classList.add("closing");
  mobileMenu.classList.remove("open");
  toggleBtn && toggleBtn.setAttribute("aria-expanded", "false");
  // Espera a que termine la animación de salida antes de ocultar por completo
  const EXIT_MS = 320; // sincronizado con el fade (300ms) + margen
  setTimeout(() => {
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    mobileMenu.classList.remove("closing");
    if (toggleBtn) {
      toggleBtn.textContent = "☰";
      toggleBtn.classList.remove("is-open");
      toggleBtn.setAttribute("aria-label", "Abrir menú");
    }
  }, EXIT_MS);
};
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (mobileMenu) {
      const isOpen = mobileMenu.classList.contains("open");
      isOpen ? closeMobileMenu() : openMobileMenu();
    } else if (navLinks) {
      const open = navLinks.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(open));
      toggleBtn.classList.toggle("is-open", open);
    }
  });
}

// Header: aplicar transparencia al hacer scroll
const headerEl = document.querySelector('.site-header');
const applyHeaderScrollState = () => {
  if (!headerEl) return;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  if (y > 10) headerEl.classList.add('scrolled');
  else headerEl.classList.remove('scrolled');
};
applyHeaderScrollState();
window.addEventListener('scroll', applyHeaderScrollState, { passive: true });

// Scroll suave para anclas internas
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href");
  const target = id && id.length > 1 ? document.querySelector(id) : null;
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Cerrar menú móvil después de navegar
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      closeMobileMenu();
    } else if (navLinks && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      toggleBtn && toggleBtn.setAttribute("aria-expanded", "false");
    }
  }
});

// Cerrar overlay con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("open")) {
    closeMobileMenu();
  }
});

// Testimonios: navegación prev/next
(function initTestimonials() {
  const root = document.querySelector('.testimonials-section');
  if (!root) return;
  const figureImg = root.querySelector('.testimonials-figure img');
  const textEl = root.querySelector('.testimonial-text');
  const nameEl = root.querySelector('.author-meta .name');
  const roleEl = root.querySelector('.author-meta .role');
  const avatarImg = root.querySelector('.author-avatar img');
  const prevBtn = root.querySelector('.btn-nav.prev');
  const nextBtn = root.querySelector('.btn-nav.next');
  if (!figureImg || !textEl || !nameEl || !roleEl || !avatarImg || !prevBtn || !nextBtn) return;

  const items = [
    {
      figure: 'img/Proyectos/PRALINE/RMBC7069-HDR.JPEG',
      text: '“El equipo comprendió nuestra visión y elevó cada detalle. El resultado es un espacio funcional, elegante y lleno de personalidad.”',
      name: 'María Pérez',
      role: 'Cliente Residencial',
      avatar: 'img/Sobre-Mi/IMG_3878.jpg'
    },
    {
      figure: 'img/Proyectos/SALON KLAAR/KLAAR 04.jpg',
      text: '“Excelente comunicación y gestión. El proyecto refleja nuestra marca y optimiza la experiencia del cliente.”',
      name: 'Carlos López',
      role: 'Director Comercial',
      avatar: 'img/Sobre-Mi/IMG_3878.jpg'
    },
    {
      figure: 'img/Proyectos/KAPITAL TOWER/IMG_3850.jpg',
      text: '“Materiales y proporciones impecables. La entrega superó expectativas y el proceso fue muy transparente.”',
      name: 'Ana García',
      role: 'Gerente de Proyecto',
      avatar: 'img/Sobre-Mi/IMG_3878.jpg'
    }
  ];

  let index = 0;
  let animating = false;
  const FADE_MS = 240;
  const apply = (i) => {
    const it = items[i];
    figureImg.src = it.figure;
    figureImg.alt = `Vista de proyecto — ${it.name}`;
    textEl.textContent = it.text;
    nameEl.textContent = it.name;
    roleEl.textContent = it.role;
    avatarImg.src = it.avatar;
    avatarImg.alt = `Foto de ${it.name}`;
  };

  apply(index);

  prevBtn.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    root.classList.add('is-fading');
    setTimeout(() => {
      index = (index - 1 + items.length) % items.length;
      apply(index);
      root.classList.remove('is-fading');
      setTimeout(() => { animating = false; }, 20);
    }, FADE_MS);
  });
  nextBtn.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    root.classList.add('is-fading');
    setTimeout(() => {
      index = (index + 1) % items.length;
      apply(index);
      root.classList.remove('is-fading');
      setTimeout(() => { animating = false; }, 20);
    }, FADE_MS);
  });
})();

// Manejo básico del formulario (demo)
const form = $("#contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    console.log("Formulario enviado:", data);
    alert("¡Gracias! Te contactaremos pronto.");
    form.reset();
  });
}
