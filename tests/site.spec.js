const { test, expect } = require("@playwright/test");

const pages = [
  { path: "/index.html", title: /Vidar em In-Tens/i },
  { path: "/publicacoes.html", title: /Publica/i },
  { path: "/projetos.html", title: /Vidar em In-Tens/i },
  { path: "/pesquisadores.html", title: /Vidar em In-Tens/i },
  { path: "/sobre.html", title: /Sobre|Vidar em In-Tens/i },
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

    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    await expect(menu).toHaveClass(/show/);

    await menuToggle.click();
    await expect(menu).not.toHaveClass(/show/);
  });
});

test.describe("publicacoes", () => {
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

    await expect(contador).toContainText(/24 publica/i);
    await expect(resultadosVisiveis).toHaveCount(24);
    await expect(campoBusca).toHaveValue("");
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
