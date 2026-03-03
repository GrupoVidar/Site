# Site VIDAR em In-Tensões

Snapshot de status técnico e de conteúdo do site do Grupo de Estudos e Pesquisas VIDAR.

## Status atual (02/03/2026)

- Estado geral: site estático funcional em HTML/CSS/JS.
- Páginas principais publicadas: 5 (`index.html`, `publicacoes.html`, `projetos.html`, `pesquisadores.html`, `sobre.html`).
- Base de código atual: `main` no commit `5bd290e`.
- Build/deploy: sem pipeline automatizado no repositório (execução direta no navegador ou com servidor local simples).

## Estrutura e conteúdo por página

### 1) Início (`index.html`)

- Hero animado com linhas SVG e efeito de ondas em `canvas` reagindo ao mouse.
- Bloco de evento em destaque com chamadas para ação.
- Vitrine de publicações (2 destaques com botão para PDF).
- Vitrine de obras autorais do grupo (3 cards).
- Seção “Nossos escritos” com 4 cards e links externos.
- Seção de frase destaque com imagem.
- Atalho fixo “Conheça o Grupo”.

### 2) Publicações (`publicacoes.html`)

- Listagem de **24 publicações** (`.publicacao-item`).
- Busca em tempo real por título com contador e botão de limpar.
- Cards com referência, resumo e links para PDF/periódico.
- Seção de newsletter no final da página.

### 3) Projetos (`projetos.html`)

- Área de projetos com **2 cards principais**.
- Modal dinâmico com detalhes completos do projeto (objetivos, equipe, metadados).
- Ações para abrir arquivos relacionados em PDF.

### 4) Pesquisadores (`pesquisadores.html`)

- Grade com **14 perfis** de pesquisadoras(es).
- Cada perfil inclui foto, área, mini-bio e links de currículo (Lattes/ORCID quando disponível).
- Inclui perfil da pesquisadora Alcidéia Margareth Trancoso.

### 5) Sobre (`sobre.html`)

- Hero institucional com apresentação do grupo.
- Timeline histórica (2018–2026).
- Linhas de pesquisa, compromissos e participação.
- Cards de co-criadoras.
- Blocos de fomento/parcerias com logos.
- Seção de obras e mídias + newsletter.

## Recursos e arquivos

- CSS principal único: `assets/css/styles.css`.
- JavaScript principal único: `assets/js/script.js`.
- Imagens locais: **51** arquivos em `assets/images/`.
- PDFs locais: **28** arquivos em `assets/Arquivos/`.

## Funcionalidades JavaScript implementadas

- Menu responsivo (hambúrguer).
- Busca dinâmica em publicações.
- Modal de projetos.
- Animações por `IntersectionObserver` na página Sobre.
- Ondas interativas no hero da Home.
- Newsletter com validação básica de e-mail.
- Controle de visibilidade do header na Home conforme posição de scroll/hero.

## Pendências técnicas identificadas

- Existe lógica duplicada de controle do header na Home (mais de um `DOMContentLoaded` e mais de um `IntersectionObserver` para o mesmo comportamento), o que aumenta risco de bugs de responsividade no mobile.
- CSS centralizado em arquivo único extenso, com muitos blocos responsivos e sobrescritas, o que dificulta manutenção.
- Há links de placeholder (`href="#"`) em partes de conteúdo que ainda precisam URL final.
- Link quebrado detectado: `assets/Arquivos/Projetos/relatorio-cartografias.pdf` (referenciado em `projetos.html`, arquivo não existe no repositório).

## Como executar localmente

### Opção 1: VS Code Live Server

- Abra a pasta do projeto no VS Code.
- Execute “Open with Live Server” no `index.html`.

### Opção 2: Python

```bash
python -m http.server 8000
```

- Acesse `http://localhost:8000`.
