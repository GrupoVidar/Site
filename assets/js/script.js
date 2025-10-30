// =======================
// Menu Responsivo
// =======================
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("show");

    // Animação do menu hambúrguer
    const spans = menuToggle.querySelectorAll("span");
    if (menu.classList.contains("show")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  // Fechar menu ao clicar em um item (mobile)
  document.querySelectorAll("#menu a").forEach((item) => {
    item.addEventListener("click", () => {
      menu.classList.remove("show");
      const spans = menuToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    });
  });
}

// =======================
// Newsletter
// =======================
const formNewsletter = document.getElementById("newsletterForm");
if (formNewsletter) {
  formNewsletter.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = formNewsletter.querySelector("input");
    const email = emailInput.value;

    if (validateEmail(email)) {
      alert(`Obrigado por se inscrever com o e-mail: ${email}`);
      formNewsletter.reset();
    } else {
      alert("Por favor, insira um e-mail válido.");
      emailInput.focus();
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// =======================
// Destaque nos Cards de Notícias
// =======================
document.querySelectorAll(".card-noticia").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
  });
});

// =======================
// Atualizar o ano do rodapé
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.querySelector("footer p:last-child");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = yearElement.textContent.replace(
      /\d{4}/,
      currentYear
    );
  }
});

// =========================================================
// SLIDESHOW AUTOMÁTICO (DESTAQUE PRINCIPAL)
// =========================================================
function iniciarSlideshow() {
  const slides = document.querySelectorAll(".slide-bg");
  if (slides.length === 0) return;

  let currentSlide = 0;

  function mudarSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  setInterval(mudarSlide, 4000);
}

// =========================================================
// ANIMAÇÕES DA PÁGINA SOBRE
// =========================================================
function observarElementos() {
  const elementos = document.querySelectorAll(
    '.timeline-item, .linha-card, .pilar-card, .parceiro-logo'
  );

  if (elementos.length === 0) return;

  const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Delay individual para os itens da timeline
        if (entry.target.classList.contains('timeline-item')) {
          const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.2}s`;
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elementos.forEach(elemento => {
    observador.observe(elemento);
  });
}

// =======================
// INICIALIZAÇÃO GERAL
// =======================
document.addEventListener('DOMContentLoaded', function() {
  // Slideshow do destaque principal
  iniciarSlideshow();
  
  // Animações da página sobre
  observarElementos();
  
  // Atualizar ano do rodapé (já está sendo chamado acima)
});