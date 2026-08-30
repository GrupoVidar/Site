const { test, expect } = require("@playwright/test");

const pages = [
  { path: "/index.html", title: /Vidar em In-Tens/i },
  { path: "/eventos.html", title: /Eventos|Vidar em In-Tens/i },
  { path: "/mural.html", title: /Mural|Vidar em In-Tens/i },
  { path: "/publicacoes.html", title: /Ensaios e artigos/i },
  { path: "/dissertacoes-teses.html", title: /Dissertações|teses/i },
  { path: "/projetos.html", title: /Vidar em In-Tens/i },
  { path: "/ceiva.html", title: /CEIVA/i },
  { path: "/pesquisadores.html", title: /Vidar em In-Tens/i },
  { path: "/sobre.html", title: /Sobre|Vidar em In-Tens/i },
];

const navLabels = {
  escritos: "Nossos escritos",
  ceiva: "CEIVA",
  artigos: "Artigos e ensaios",
  teses: "Disserta\u00e7\u00f5es e teses",
  toggle: "Abrir submenu de Nossos escritos",
};

const artigosAnosCronologicos = [
  2025, 2025, 2025, 2025, 2025, 2025, 2025, 2025, 2024, 2024, 2024, 2024,
  2024, 2024, 2024, 2024, 2024, 2024, 2023, 2023, 2022, 2021, 2019, 2017,
];

const tesesCronologicas = [
  { autoria: "Anny Roberta Gon\u00e7alves Furtado", ano: 2025 },
  { autoria: "Fabiane Andrade Batista", ano: 2025 },
  { autoria: "H\u00edvina Dorzane Machado", ano: 2025 },
  { autoria: "Stivisson Menezes Correia", ano: 2025 },
  { autoria: "Ana Patr\u00edcia de Souza Azev\u00eado", ano: 2024 },
  { autoria: "Gabriel da Silva Bentes", ano: 2024 },
  { autoria: "Thalita Maciel Melero Lima", ano: 2023 },
  { autoria: "Gilberlene Sousa Carvalho", ano: 2022 },
  { autoria: "Shirley Vitor da Silva", ano: 2022 },
  { autoria: "Rafaella Bruno Antunes de Souza", ano: 2021 },
];

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasOverflow).toBeFalsy();
}

test.describe("smoke do site", () => {
  for (const pageData of pages) {
    test(`carrega ${pageData.path}`, async ({ page }) => {
      await page.goto(pageData.path);
      await expect(page).toHaveTitle(pageData.title);
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });
  }
});

test.describe("navegacao principal", () => {
  test("usa os rotulos atualizados de escritos em todas as paginas", async ({
    page,
  }) => {
    for (const pageData of pages) {
      await page.goto(pageData.path);

      const menu = page.locator("#menu");

      await expect(
        menu.locator('a[href="./publicacoes.html"]').first()
      ).toHaveText(navLabels.escritos);
      await expect(menu.locator(".submenu-toggle").first()).toHaveAttribute(
        "aria-label",
        navLabels.toggle
      );
      await expect(menu.locator(".submenu a")).toHaveText([
        "Mural",
        navLabels.artigos,
        navLabels.teses,
      ]);
      await expect(menu.locator(".submenu a").nth(1)).toHaveAttribute(
        "href",
        "./publicacoes.html"
      );
      await expect(menu.locator(".submenu a").nth(2)).toHaveAttribute(
        "href",
        "./dissertacoes-teses.html"
      );
      await expect(menu.locator('a[href="./ceiva.html"]').first()).toHaveText(
        navLabels.ceiva
      );
    }
  });

  test("home mostra a barra superior no primeiro rolamento", async ({ page }) => {
    await page.goto("/index.html");

    const body = page.locator("body");
    const header = page.locator("header");

    await expect(body).toHaveClass(/tem-hero/);
    await expect(header).toHaveClass(/header--hidden/);

    await page.evaluate(() => window.scrollTo(0, 1));

    await expect(header).not.toHaveClass(/header--hidden/);
    await expect(body).toHaveClass(/header-visivel/);
  });

  test("submenu de nossos escritos permanece clicavel no desktop", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Teste aplicavel apenas ao hover desktop.");

    await page.goto("/index.html");
    await page.evaluate(() => window.scrollTo(0, 1));

    const header = page.locator("header");
    const escritos = page
      .locator("#menu .menu-com-submenu > a")
      .filter({ hasText: navLabels.escritos })
      .first();
    const artigos = page
      .locator('#menu .submenu a[href="./publicacoes.html"]')
      .filter({ hasText: navLabels.artigos })
      .first();

    await expect(header).not.toHaveClass(/header--hidden/);
    await escritos.hover();
    await expect(artigos).toBeVisible();

    const escritosBox = await escritos.boundingBox();
    const artigosBox = await artigos.boundingBox();

    expect(escritosBox).toBeTruthy();
    expect(artigosBox).toBeTruthy();

    await page.mouse.move(
      escritosBox.x + escritosBox.width / 2,
      escritosBox.y + escritosBox.height / 2
    );
    await page.mouse.move(
      artigosBox.x + artigosBox.width / 2,
      escritosBox.y + escritosBox.height + 4
    );
    await expect(artigos).toBeVisible();

    await page.mouse.click(
      artigosBox.x + artigosBox.width / 2,
      artigosBox.y + artigosBox.height / 2
    );

    await expect(page).toHaveURL(/publicacoes\.html$/);
  });
});

test.describe("responsividade base", () => {
  for (const pageData of pages) {
    test(`sem overflow horizontal em ${pageData.path}`, async ({ page }) => {
      await page.goto(pageData.path);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("menu mobile abre e fecha", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Teste aplicavel apenas ao projeto mobile.");

    await page.goto("/publicacoes.html");

    const menuToggle = page.locator("#menuToggle");
    const menu = page.locator("#menu");
    const submenuToggle = menu.locator(".submenu-toggle").first();
    const submenu = menu.locator(".submenu").first();

    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    await expect(menu).toHaveClass(/show/);
    await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("body")).toHaveClass(/menu-aberto/);

    const viewport = page.viewportSize();
    const menuBox = await menu.boundingBox();

    expect(viewport).toBeTruthy();
    expect(menuBox).toBeTruthy();
    expect(menuBox.x).toBeGreaterThanOrEqual(0);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(menuBox.width).toBeLessThanOrEqual(viewport.width * 0.92 + 1);

    await submenuToggle.click();
    await expect(submenu).toBeVisible();

    const submenuBox = await submenu.boundingBox();

    expect(submenuBox).toBeTruthy();
    expect(submenuBox.x).toBeGreaterThanOrEqual(menuBox.x);
    expect(submenuBox.x + submenuBox.width).toBeLessThanOrEqual(
      menuBox.x + menuBox.width + 1
    );
    await expect(submenu.locator("a")).toHaveText([
      "Mural",
      navLabels.artigos,
      navLabels.teses,
    ]);

    await menuToggle.click();
    await expect(menu).not.toHaveClass(/show/);
    await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveClass(/menu-aberto/);
  });
});

test.describe("eventos", () => {
  test("home exibe comunicacoes do X ENEBIO como destaques mais recentes", async ({
    page,
  }) => {
    await page.goto("/index.html");

    const cards = page.locator(".evento-card-home");
    const primeiroCard = cards.first();
    const segundoCard = cards.nth(1);
    const terceiroCard = cards.nth(2);

    await expect(cards).toHaveCount(3);
    await expect(primeiroCard.locator("h3")).toHaveText(
      /X ENEBIO: Experiências formativas em educação em ciências/
    );
    await expect(primeiroCard.locator("img")).toHaveAttribute(
      "src",
      /assets\/images\/home\/Eventos\/enebio vitor\.png/
    );
    await expect(primeiroCard).toContainText("24 a 27 de agosto de 2026");
    await expect(primeiroCard).toContainText("X ENEBIO, Comunicação oral");
    await expect(primeiroCard).toContainText(
      "Universidade Federal da Paraíba"
    );
    await expect(primeiroCard).not.toContainText("Superior");
    await expect(primeiroCard).toContainText("Vitor Gonçalves");
    await expect(segundoCard).not.toContainText("Superior");
    await expect(terceiroCard).not.toContainText("Superior");
    await expect(segundoCard.locator("h3")).toHaveText(
      /X ENEBIO: Currículo-Banzeiro de Ciências/
    );
    await expect(terceiroCard.locator("h3")).toHaveText(
      /X ENEBIO: Entre leiras e solo vivo/
    );
  });

  test("historico completo inclui o lote do X ENEBIO no topo", async ({
    page,
  }) => {
    await page.goto("/eventos.html");

    const primeiroItemLinha = page.locator(".linha-agenda-item").first();
    const primeiroCardAcervo = page.locator(".evento-historico-card").first();
    const segundoCardAcervo = page.locator(".evento-historico-card").nth(1);
    const terceiroCardAcervo = page.locator(".evento-historico-card").nth(2);
    const quartoCardAcervo = page.locator(".evento-historico-card").nth(3);
    const quintoCardAcervo = page.locator(".evento-historico-card").nth(4);
    const sextoCardAcervo = page.locator(".evento-historico-card").nth(5);

    await expect(primeiroItemLinha).toContainText("24 a 27/08/2026");
    await expect(primeiroItemLinha.locator("h3")).toHaveText(
      /X ENEBIO: Experiências formativas em educação em ciências/
    );
    await expect(primeiroCardAcervo.locator("h3")).toHaveText(
      /X ENEBIO: Experiências formativas em educação em ciências/
    );
    await expect(primeiroCardAcervo.locator("img")).toHaveAttribute(
      "src",
      /assets\/images\/home\/Eventos\/enebio vitor\.png/
    );
    await expect(primeiroCardAcervo).toContainText(
      "24 a 27 de agosto de 2026"
    );
    await expect(primeiroCardAcervo).toContainText(
      "X ENEBIO, Comunicação oral"
    );
    await expect(primeiroCardAcervo).toContainText(
      "Universidade Federal da Paraíba"
    );
    await expect(primeiroCardAcervo).not.toContainText("Superior");
    await expect(primeiroCardAcervo).toContainText("Vitor Gonçalves");
    await expect(segundoCardAcervo.locator("h3")).toHaveText(
      /X ENEBIO: Currículo-Banzeiro de Ciências/
    );
    await expect(terceiroCardAcervo.locator("h3")).toHaveText(
      /X ENEBIO: Entre leiras e solo vivo/
    );
    await expect(quartoCardAcervo.locator("h3")).toHaveText(
      /X ENEBIO: Entre a mata, ouriços e crianças/
    );
    await expect(quintoCardAcervo.locator("h3")).toHaveText(
      /X ENEBIO: Desdobramentos em composições/
    );
    await expect(sextoCardAcervo.locator("h3")).toHaveText(
      /X ENEBIO: Currículos Vivos nas amazônias/
    );
    for (const card of [
      primeiroCardAcervo,
      segundoCardAcervo,
      terceiroCardAcervo,
      quartoCardAcervo,
      quintoCardAcervo,
      sextoCardAcervo,
    ]) {
      await expect(card).not.toContainText("Superior");
    }
  });
});

test.describe("publicacoes", () => {
  test("home renomeia a vitrine de publicacoes para ensaios e artigos", async ({
    page,
  }) => {
    await page.goto("/index.html");

    await expect(page.locator("#vitrine-pub-title")).toHaveText(
      "Ensaios e artigos"
    );
    await expect(
      page.locator('.vitrine-publicacoes-footer a[href="./publicacoes.html"]')
    ).toHaveText("Explorar ensaios e artigos");
  });

  test("busca filtra e limpar restaura a lista", async ({ page }) => {
    await page.goto("/publicacoes.html");

    const campoBusca = page.locator("#campoBusca");
    const botaoLimpar = page.locator("#limparBusca");
    const contador = page.locator("#contador");
    const resultadosVisiveis = page.locator(".publicacao-item:not(.oculto)");

    await campoBusca.fill("corpo");

    await expect(contador).toContainText(/corpo/i);
    await expect(resultadosVisiveis).toHaveCount(2);

    await botaoLimpar.click();

    await expect(contador).toContainText(/24 manuscrito/i);
    await expect(resultadosVisiveis).toHaveCount(24);
    await expect(campoBusca).toHaveValue("");
  });

  test("exibe ensaios e artigos em ordem cronologica pelo ano do card", async ({
    page,
  }) => {
    await page.goto("/publicacoes.html");

    await expect(page.locator(".titulo-secao")).toHaveText("Ensaios e artigos");

    const cards = page.locator(".publicacao-item");
    const anos = await cards.evaluateAll((items) =>
      items.map((item) => Number(item.getAttribute("data-ano-publicacao")))
    );
    const anosReferencias = await cards
      .locator(".publicacao-referencia")
      .evaluateAll((items) =>
        items.map((item) => {
          const referencia = item.textContent.split(/\b(?:ISSN|DOI)\b/i)[0];
          const anos = [
            ...referencia.matchAll(
              /(?<![\p{L}\p{N}])(?:19|20)\d{2}(?![\p{L}\p{N}])/gu
            ),
          ].map((match) => Number(match[0]));

          return anos.at(-1);
        })
      );

    await expect(cards).toHaveCount(artigosAnosCronologicos.length);
    await expect(cards.first().locator(".publicacao-titulo")).toContainText(
      /Ecofeminismo em Questionamentos do Antropoceno/
    );
    await expect(cards.last().locator(".publicacao-titulo")).toContainText(
      /Fabrica\u00e7\u00e3o midi\u00e1tica e liter\u00e1ria/
    );
    expect(anos).toEqual(artigosAnosCronologicos);
    expect(anosReferencias).toEqual(artigosAnosCronologicos);
  });

  test("usa autorias no formato ABNT sem particulas antes do sobrenome", async ({
    page,
  }) => {
    await page.goto("/publicacoes.html");

    const autorias = await page.locator(".publicacao-autores").evaluateAll(
      (items) => items.map((item) => item.textContent.replace(/\s+/g, " ").trim())
    );

    expect(autorias[0]).toBe(
      "CARVALHO, Daniela Franco; OLIVEIRA, Caroline Barroncas de; COSTA, M\u00f4nica de Oliveira."
    );
    expect(autorias.join(" ")).not.toContain("JACOBUCCI");

    for (const autoria of autorias) {
      for (const autor of autoria.split(";")) {
        expect(autor.trim()).not.toMatch(/^(DE|DA|DO)\s+\p{Lu}/u);
      }
    }
  });
});

test.describe("dissertacoes e teses", () => {
  test("exibe cards de biblioteca com capa e PDF", async ({ page }) => {
    await page.goto("/dissertacoes-teses.html");

    const cards = page.locator(".tese-card");
    const primeiroCard = cards.first();

    await expect(cards).toHaveCount(tesesCronologicas.length);
    await expect(primeiroCard.locator(".tese-badge")).toHaveCount(0);
    await expect(primeiroCard.locator(".tese-preview-shell")).toHaveAttribute(
      "href",
      /ANNY-ROBERTA-DISSERTACAO\.pdf/
    );
    await expect(primeiroCard.locator("img")).toHaveAttribute(
      "src",
      /assets\/images\/dissertacoes-teses\/anny-roberta-dissertacao\.png/
    );
    await expect(primeiroCard.locator(".tese-titulo")).toHaveCSS(
      "text-overflow",
      "ellipsis"
    );
  });

  test("lista trabalhos em ordem cronologica pelo ano de publicacao", async ({
    page,
  }) => {
    await page.goto("/dissertacoes-teses.html");

    const cards = page.locator(".tese-card");
    const anos = await cards.evaluateAll((items) =>
      items.map((item) => Number(item.getAttribute("data-ano-publicacao")))
    );
    const autorias = await cards.locator(".tese-autoria").evaluateAll((items) =>
      items.map((item) => item.textContent.trim())
    );

    expect(anos).toEqual(tesesCronologicas.map((tese) => tese.ano));
    expect(autorias).toEqual(tesesCronologicas.map((tese) => tese.autoria));
  });

  test("usa quatro colunas no desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Teste aplicável apenas ao layout desktop.");

    await page.goto("/dissertacoes-teses.html");

    const boxes = [];
    for (let index = 0; index < 5; index += 1) {
      const box = await page.locator(".tese-card").nth(index).boundingBox();
      expect(box).toBeTruthy();
      boxes.push(box);
    }

    const primeiraLinha = boxes.slice(0, 4).map((box) => Math.round(box.y));
    const mesmaLinha = Math.max(...primeiraLinha) - Math.min(...primeiraLinha);

    expect(mesmaLinha).toBeLessThanOrEqual(2);
    expect(Math.round(boxes[4].y)).toBeGreaterThan(Math.round(boxes[0].y));
  });
});

test.describe("ceiva", () => {
  test("exibe capa, apresentacao, origem do nome e creditos", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/ceiva.html");

    await expect(page.locator("body")).toHaveClass(/ceiva-page/);
    await expect(page.locator(".ceiva-logo")).toHaveCount(0);
    await expect(page.locator("#ceiva-title")).toHaveCount(0);
    await expect(page.locator(".ceiva-hero-cover img")).toHaveAttribute(
      "src",
      /assets\/images\/home\/CEIVA\/CAPA ceiva\.jpeg/
    );
    await expect(page.locator(".ceiva-hero-cover figcaption")).toHaveText(
      "Currículos vivos da Amazônia"
    );
    await expect(page.locator(".ceiva-pintura img")).toHaveAttribute(
      "src",
      /assets\/images\/home\/CEIVA\/Pintura\.jpeg/
    );
    await expect(page.locator(".ceiva-texto")).toContainText(
      "berçário de projetos sobre currículos vivos da Amazônia"
    );
    await expect(page.locator(".ceiva-texto .ceiva-kicker")).toHaveCount(0);
    await expect(page.locator("#ceiva-apresentacao")).toHaveCSS(
      "text-align",
      "center"
    );
    await expect(page.locator(".ceiva-texto > p").last()).toHaveCSS(
      "text-align",
      "justify"
    );
    await expect(
      page.locator(".ceiva-origem-inner > p:not(.ceiva-kicker)")
    ).toHaveCSS("text-align", "justify");
    await expect(page.locator(".ceiva-creditos p")).toHaveCSS(
      "text-align",
      "justify"
    );
    await expect(page.locator("#ceiva-origem-title")).toHaveText(
      "Origem do nome"
    );
    await expect(page.locator("#ceiva-origem-title")).toHaveCSS(
      "text-align",
      "center"
    );
    await expect(page.locator(".ceiva-origem")).toContainText(
      "será a seiva do CEIVA"
    );
    await expect(page.locator(".ceiva-creditos")).toContainText(
      "Mônica de Oliveira Costa, Caroline Barroncas de Oliveira"
    );
    await expect(
      page.locator('a[href="./ceiva.html"].ativo').first()
    ).toHaveText("CEIVA");

    if (!isMobile) {
      const pinturaBox = await page.locator(".ceiva-pintura").boundingBox();
      const textoBox = await page.locator(".ceiva-texto").boundingBox();

      expect(pinturaBox).toBeTruthy();
      expect(textoBox).toBeTruthy();
      expect(textoBox.x).toBeGreaterThan(pinturaBox.x + pinturaBox.width);
      expect(Math.abs(pinturaBox.y - textoBox.y)).toBeLessThanOrEqual(40);
    }
  });
});

test.describe("projetos", () => {
  test("modal abre e fecha pelo botao", async ({ page }) => {
    await page.goto("/projetos.html");

    const primeiroCard = page.locator(".card-projeto-modal").first();
    const modal = page.locator("#modalProjeto");
    const botaoFechar = page.locator(".modal-close");

    await primeiroCard.click();
    await expect(modal).toHaveClass(/ativo/);
    await expect(page.locator("#modalTitulo")).toContainText(/Cartografias|Floresta/i);

    await botaoFechar.click();
    await expect(modal).not.toHaveClass(/ativo/);
  });

  test("modal fecha com Escape", async ({ page }) => {
    await page.goto("/projetos.html");

    await page.locator(".card-projeto-modal").nth(1).click();
    await expect(page.locator("#modalProjeto")).toHaveClass(/ativo/);

    await page.keyboard.press("Escape");
    await expect(page.locator("#modalProjeto")).not.toHaveClass(/ativo/);
  });
});
