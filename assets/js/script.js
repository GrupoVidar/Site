// =======================
// Menu Responsivo
// =======================
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("show");

    // Animação do menu hambúrguer - CORREÇÃO
    const spans = menuToggle.querySelectorAll("span");
    if (menu.classList.contains("show")) {
      // Transforma em "X"
      spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
      spans[1].style.opacity = "0"; // Linha do meio some
      spans[1].style.transform = "scale(0)"; // Correção extra
      spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
    } else {
      // Volta para hambúrguer
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1"; // Linha do meio reaparece
      spans[1].style.transform = "none"; // Correção extra
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
      spans[1].style.transform = "none";
      spans[2].style.transform = "none";
    });
  });

  // Fechar menu ao clicar fora (mobile)
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
      menu.classList.remove("show");
      const spans = menuToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[1].style.transform = "none";
      spans[2].style.transform = "none";
    }
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
    ".timeline-item, .linha-card, .pilar-card, .parceiro-logo"
  );

  if (elementos.length === 0) return;

  const observador = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Delay individual para os itens da timeline
          if (entry.target.classList.contains("timeline-item")) {
            const index = Array.from(
              entry.target.parentElement.children
            ).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.2}s`;
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elementos.forEach((elemento) => {
    observador.observe(elemento);
  });
}

// =======================
// GARANTIR VISIBILIDADE NO MOBILE
// =======================
function garantirVisibilidadeMobile() {
  if (window.innerWidth <= 768) {
    // Forçar display block em elementos críticos
    const elementosCriticos = [
      "main",
      "section",
      ".container",
      ".grid-noticias",
    ];

    elementosCriticos.forEach((seletor) => {
      const elementos = document.querySelectorAll(seletor);
      elementos.forEach((el) => {
        el.style.display = "block";
        el.style.visibility = "visible";
        el.style.opacity = "1";
      });
    });
  }
}

// =======================
// INICIALIZAÇÃO GERAL
// =======================
document.addEventListener("DOMContentLoaded", function () {
  // Slideshow do destaque principal
  iniciarSlideshow();

  // Animações da página sobre
  observarElementos();

  // Garantir visibilidade no mobile
  garantirVisibilidadeMobile();

  // Atualizar ano do rodapé
  const yearElement = document.querySelector("footer p:last-child");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = yearElement.textContent.replace(
      /\d{4}/,
      currentYear
    );
  }
});

// Reforçar visibilidade ao redimensionar
window.addEventListener("resize", garantirVisibilidadeMobile);
// =========================================================
// SISTEMA DE BUSCA EM TEMPO REAL - VERSÃO CORRIGIDA
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  // Elementos da busca
  const campoBusca = document.getElementById("campoBusca");
  const btnLimpar = document.getElementById("limparBusca");
  const contador = document.getElementById("contador");
  const publicacoes = document.querySelectorAll(".publicacao-item");

  // Armazenar os títulos originais para restaurar depois
  const titulosOriginais = new Map();
  publicacoes.forEach((pub, index) => {
    const titulo = pub.querySelector(".publicacao-titulo");
    titulosOriginais.set(pub, titulo.innerHTML);
  });

  // Criar elemento para "sem resultados"
  const semResultados = document.createElement("div");
  semResultados.className = "sem-resultados";
  semResultados.innerHTML = `
    <i class="fas fa-search"></i>
    <h3>Nenhuma publicação encontrada</h3>
    <p>Tente usar outros termos ou verificar a ortografia.</p>
  `;

  // Inserir após a barra de busca
  const barraBuscaContainer = document.querySelector(".barra-busca-container");
  barraBuscaContainer.parentNode.insertBefore(
    semResultados,
    barraBuscaContainer.nextSibling
  );

  // Função para buscar publicações - CORRIGIDA
  function buscarPublicacoes(termo) {
    termo = termo.toLowerCase().trim();
    let resultados = 0;

    publicacoes.forEach((publicacao) => {
      const tituloElemento = publicacao.querySelector(".publicacao-titulo");
      const tituloTexto = tituloElemento.textContent.toLowerCase();
      const corresponde = tituloTexto.includes(termo);

      if (corresponde) {
        publicacao.classList.add("resultado-correspondente");
        publicacao.classList.remove("oculto");
        resultados++;

        // Destacar o texto correspondente apenas se houver termo
        if (termo) {
          destacarTexto(tituloElemento, termo);
        } else {
          // Se não há termo, restaurar o título original
          restaurarTituloOriginal(publicacao);
        }
      } else {
        publicacao.classList.remove("resultado-correspondente");
        publicacao.classList.add("oculto");

        // Sempre restaurar o título original quando não corresponde
        restaurarTituloOriginal(publicacao);
      }
    });

    // IMPORTANTE: Se não há termo de busca, restaurar TODOS os títulos
    if (!termo) {
      publicacoes.forEach((publicacao) => {
        restaurarTituloOriginal(publicacao);
        publicacao.classList.remove("oculto");
        publicacao.classList.remove("resultado-correspondente");
      });
      resultados = publicacoes.length;
    }

    // Atualizar contador
    atualizarContador(resultados, termo);

    // Mostrar/ocultar mensagem de sem resultados
    if (termo && resultados === 0) {
      semResultados.classList.add("mostrar");
    } else {
      semResultados.classList.remove("mostrar");
    }

    // Mostrar/ocultar botão limpar
    if (termo) {
      btnLimpar.classList.add("visivel");
    } else {
      btnLimpar.classList.remove("visivel");
    }
  }

  // Função para restaurar título original
  function restaurarTituloOriginal(publicacao) {
    const tituloOriginal = titulosOriginais.get(publicacao);
    const tituloElemento = publicacao.querySelector(".publicacao-titulo");
    if (tituloOriginal && tituloElemento.innerHTML !== tituloOriginal) {
      tituloElemento.innerHTML = tituloOriginal;
    }
  }

  // Função para destacar texto correspondente - MELHORADA
  function destacarTexto(elemento, termo) {
    const textoOriginal = elemento.textContent;
    const regex = new RegExp(
      `(${termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const novoTexto = textoOriginal.replace(
      regex,
      '<span class="destaque-busca">$1</span>'
    );

    // Só atualizar se realmente houver mudança
    if (elemento.innerHTML !== novoTexto) {
      elemento.innerHTML = novoTexto;
    }
  }

  // Função para atualizar contador
  function atualizarContador(resultados, termo) {
    if (!termo) {
      contador.textContent = `Mostrando todas as ${publicacoes.length} publicações`;
    } else if (resultados === 0) {
      contador.textContent = `Nenhum resultado para "${termo}"`;
    } else if (resultados === 1) {
      contador.textContent = `1 publicação encontrada para "${termo}"`;
    } else {
      contador.textContent = `${resultados} publicações encontradas para "${termo}"`;
    }
  }

  // Função para limpar busca - CORRIGIDA
  function limparBusca() {
    campoBusca.value = "";

    // Restaurar todos os títulos para o estado original
    publicacoes.forEach((publicacao) => {
      restaurarTituloOriginal(publicacao);
      publicacao.classList.remove("oculto");
      publicacao.classList.remove("resultado-correspondente");
    });

    // Atualizar contador
    atualizarContador(publicacoes.length, "");

    // Esconder botão limpar e mensagem
    btnLimpar.classList.remove("visivel");
    semResultados.classList.remove("mostrar");

    campoBusca.focus();
  }

  // Event Listeners
  campoBusca.addEventListener("input", function (e) {
    buscarPublicacoes(e.target.value);
  });

  btnLimpar.addEventListener("click", limparBusca);

  // Tecla ESC para limpar busca
  campoBusca.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      limparBusca();
    }
  });

  // Busca inicial para configurar estado
  buscarPublicacoes("");
});
