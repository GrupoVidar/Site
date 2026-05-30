# Site VIDAR em In-Tensões

Documentação operacional do site institucional do Grupo de Estudos e Pesquisas VIDAR.

## Estado atual

- Tipo de projeto: site estático em `HTML`, `CSS` e `JavaScript` puro.
- Páginas principais: `index.html`, `eventos.html`, `mural.html`, `publicacoes.html`, `dissertacoes-teses.html`, `projetos.html`, `pesquisadores.html` e `sobre.html`.
- Estilos centralizados em `assets/css/styles.css`.
- Scripts centralizados em `assets/js/script.js`.
- Assets locais atuais:
  - `55` arquivos em `assets/images/`
  - `28` arquivos em `assets/Arquivos/`
- Dependências externas carregadas por CDN:
  - `Font Awesome`
  - `Google Fonts` (`Dancing Script` e `Playfair Display`)

## Estrutura do repositório

```text
.
|-- index.html
|-- eventos.html
|-- mural.html
|-- publicacoes.html
|-- dissertacoes-teses.html
|-- projetos.html
|-- pesquisadores.html
|-- sobre.html
|-- README.md
|-- agent.md
`-- assets/
    |-- css/
    |   `-- styles.css
    |-- js/
    |   `-- script.js
    |-- images/
    |   |-- Projetos/
    |   |-- home/
    |   |-- guia-page9/
    |   |-- parcerias/
    |   `-- arquivos de identidade visual e pesquisadores
    `-- Arquivos/
        |-- Projetos/
        |-- Publicacoes/
        `-- Sobre/
```

## Estrutura atual das páginas

### `index.html`

- Hero principal com animação de ondas em `canvas` e interação por mouse.
- Bloco de destaque principal com chamada para evento.
- Vitrine de publicações em destaque.
- Seção "Obras autorais do grupo".
- Seção "Nossos escritos".
- Bloco de frase destaque com imagem.
- Rodapé institucional.

### `eventos.html`

- Linha de acontecimentos do grupo.
- Acervo visual de eventos, defesas e encontros.
- Cards com imagem, metadados e descrição editorial.
- Rodapé institucional.

### `mural.html`

- Mural editorial de artes e dissertações.
- Cards com imagem em destaque, autoria ao lado e chamada para dissertação.
- Links de dissertação preparados para atualização quando os arquivos oficiais estiverem disponíveis.
- Rodapé institucional.

### `publicacoes.html`

- Seção principal "Produções Acadêmicas".
- `24` cards `.publicacao-item`.
- Busca em tempo real por título.
- Contador de resultados e botão de limpar busca.
- Rodapé institucional.

### `dissertacoes-teses.html`

- Biblioteca visual de dissertações e teses.
- Grade responsiva com `10` cards `.tese-card`.
- Capas verticais extraídas da primeira página dos PDFs.
- Títulos e autorias centralizados com truncamento por reticências.
- Rodapé institucional.

### `projetos.html`

- Cabeçalho de projetos com estatísticas visuais.
- Grid com `2` cards `.card-projeto-modal`.
- Modal detalhado de projeto com descrição, objetivos, metodologia, metadados e equipe.
- Rodapé institucional.

### `pesquisadores.html`

- Seção "Nossos Pesquisadores".
- Grid com `14` perfis `.pesquisador`.
- Perfis com foto, área, bio e links externos como Lattes e ORCID.
- Rodapé institucional.

### `sobre.html`

- Hero institucional.
- Timeline com `4` itens.
- Seção de linhas de pesquisa com `3` cards.
- Seções de compromisso/participação com `6` cards `.pilar-card`.
- Seção "Co-criadoras" com `3` cards.
- Seção de parcerias, fomento e materiais.
- Seção "Obras e Mídias".
- Rodapé institucional.

## Funcionalidades implementadas em `assets/js/script.js`

- Menu responsivo com hambúrguer.
- Destaque visual em cards da home.
- Atualização automática do ano no rodapé.
- Slideshow da home.
- Animações com `IntersectionObserver` na página Sobre.
- Garantia de visibilidade de elementos em mobile.
- Busca dinâmica em publicações.
- Modal de projetos.
- Ondas interativas no hero da home.
- Controle de visibilidade do header na home.

## Pontos de atenção atuais

- O arquivo `assets/js/script.js` ainda possui múltiplos `DOMContentLoaded` e lógica duplicada para o controle do header da home, o que aumenta o risco de regressão.
- O arquivo `assets/css/styles.css` concentra toda a responsividade do site e é extenso, com muitos blocos `@media`, o que exige cuidado em qualquer alteração visual.
- Há link referenciando `./assets/Arquivos/Projetos/relatorio-cartografias.pdf` em `projetos.html`, mas esse arquivo não está presente no repositório.
- O projeto ainda não possui pipeline de build, lint, testes automatizados ou deploy versionado no repositório.

## Execução local

### Opção 1: abrir direto no navegador

- Abra `index.html` no navegador.

### Opção 2: servidor local com Python

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Testes automatizados

O projeto agora possui uma suíte automatizada versionada com `Playwright`.

### O que a suíte cobre hoje

- carregamento das `8` páginas principais
- verificação básica de header e footer
- checagem de overflow horizontal em desktop e mobile
- validação da grade de dissertações e teses
- abertura e fechamento do menu mobile
- busca de publicações
- abertura e fechamento do modal de projetos

### Comandos

```bash
npm install
npx playwright install chromium
npm test
```

Comandos adicionais:

- `npm run test:headed`
- `npm run test:ui`
- `npm run test:debug`

## Manutenção

- Use `agent.md` como guia operacional para entender a arquitetura atual do site.
- Toda alteração futura deve vir acompanhada de testes, com prioridade para verificação de responsividade e regressão visual.
