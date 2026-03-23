# AGENT.md

## Objetivo

Este arquivo descreve a estrutura atual do site e define regras de manutenção para qualquer agente, desenvolvedor ou automação que fizer alterações no projeto.

## Regra principal

Nenhuma modificação deve ser concluída sem teste.

- Toda alteração em `HTML`, `CSS`, `JS`, imagens, links, textos ou comportamento deve incluir teste correspondente.
- A validação deve priorizar prevenção de bugs visuais, funcionais e de responsividade.
- Alterações sem teste associado devem ser tratadas como incompletas.

## Suite automatizada atual

O projeto já possui uma suíte automatizada versionada com `Playwright`.

- Configuração: `playwright.config.js`
- Testes: `tests/site.spec.js`
- Servidor local de apoio aos testes: `scripts/static-server.js`
- Dependências e scripts: `package.json`

### Cobertura automatizada atual

- smoke test das páginas principais
- verificação de header e footer
- validação de overflow horizontal
- teste do menu mobile
- teste da busca em publicações
- teste do modal de projetos

## Estrutura atual do projeto

```text
.
|-- index.html
|-- publicacoes.html
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
    |   `-- imagens institucionais, capas e pesquisadores
    `-- Arquivos/
        |-- Projetos/
        |-- Publicacoes/
        `-- Sobre/
```

## Arquitetura por responsabilidade

### HTML

- `index.html`: página inicial com hero animado, destaques, vitrines de publicações, obras e escritos.
- `publicacoes.html`: catálogo de produções acadêmicas com busca em tempo real.
- `projetos.html`: vitrine de projetos com cards clicáveis e modal de detalhamento.
- `pesquisadores.html`: grade de integrantes com bios e links acadêmicos.
- `sobre.html`: apresentação institucional, trajetória, linhas de pesquisa, co-criadoras, parceiros, materiais e newsletter.

### CSS

- `assets/css/styles.css` centraliza todo o visual do site.
- O mesmo arquivo contém:
  - estilos globais
  - header e navegação
  - regras da home
  - regras das páginas internas
  - regras de modal
  - regras de busca
  - regras específicas de responsividade
- Qualquer ajuste visual pode impactar várias páginas, então mudanças devem ser testadas de forma cruzada.

### JavaScript

- `assets/js/script.js` concentra toda a lógica interativa.
- Principais inicializações atuais:
  - `initMenuResponsivo`
  - `initNewsletter`
  - `initHoverCardsNoticias`
  - `initAnoRodape`
  - `initSlideshowDestaque`
  - `initAnimacoesSobre`
  - `garantirVisibilidadeMobile`
  - `initBuscaPublicacoes`
  - `initModalProjetos`
  - `initOndasHeroMouse`
- Há lógica adicional para esconder ou exibir o header da home com mais de um `DOMContentLoaded`.

## Estrutura funcional por página

### `index.html`

- Hero com animação de ondas em `canvas`.
- Header com comportamento condicional ao hero.
- Bloco de destaque principal.
- Vitrine de publicações.
- Seção de obras autorais.
- Seção "Nossos escritos".
- Bloco visual de frase/imagem.
- Rodapé.

### `publicacoes.html`

- Campo de busca `#campoBusca`.
- Botão limpar `#limparBusca`.
- Contador `#contador`.
- Lista com `24` itens `.publicacao-item`.
- Estado de "sem resultados".
- Newsletter `#newsletterForm`.

### `projetos.html`

- Grid com `2` cards `.card-projeto-modal`.
- Modal principal `#modalProjeto`.
- Fechamento por botão, overlay e tecla `Esc`.
- Preenchimento dinâmico de título, subtítulo, descrição, objetivos, equipe e metadados.
- Link local para PDF em `assets/Arquivos/Projetos/`.

### `pesquisadores.html`

- Grid `.grid-pesquisadores`.
- `14` blocos `.pesquisador`.
- Fotos locais em `assets/images/`.
- Links externos de perfil acadêmico.

### `sobre.html`

- Hero institucional.
- Timeline com `4` `.timeline-item`.
- Linhas de pesquisa com `3` `.linha-card`.
- Seções de presença e compromissos com `6` `.pilar-card`.
- Co-criadoras com `3` `.card-fundadora`.
- Blocos de parceiros, fomento e materiais.
- Newsletter `#newsletterForm`.

## Assets e dependências

### Assets locais

- Imagens em `assets/images/`.
- PDFs e materiais em `assets/Arquivos/`.
- Ícone principal: `assets/images/LogoVidar1.ico`.

### Dependências externas

- `Font Awesome` via CDN.
- `Google Fonts` via CDN.

## Riscos atuais que exigem cuidado

- `assets/css/styles.css` concentra muitas regras de `@media`, o que torna a responsividade sensível a mudanças pequenas.
- `assets/js/script.js` possui lógica de header duplicada na home.
- Links para arquivos locais devem ser sempre verificados, porque já existe referência a arquivo ausente em `projetos.html`.
- Como o site é estático e sem build, erros simples podem chegar diretamente à interface final.

## Política obrigatória de testes

Toda alteração deve criar ou atualizar testes compatíveis com a mudança.

### Regra mínima obrigatória

- Se a mudança puder ser automatizada, criar teste automatizado.
- Se a automação não for viável no estado atual do projeto, registrar e executar teste manual estruturado antes de concluir a tarefa.
- Não encerrar uma modificação apenas com inspeção visual rápida.

### Cobertura mínima por tipo de alteração

#### Alterações visuais ou de layout

- Validar desktop, tablet e mobile.
- Confirmar que não houve quebra de spacing, sobreposição, corte de texto, overflow lateral ou perda de contraste.
- Verificar header, navegação, grids, cards, rodapé e seções alteradas.

#### Alterações de responsividade

- Testar pelo menos:
  - desktop acima de `1024px`
  - tablet em torno de `768px`
  - mobile entre `360px` e `480px`
- Confirmar menu hambúrguer, alinhamento, empilhamento de colunas, imagens, textos longos e botões.

#### Alterações em comportamento JavaScript

- Testar fluxo completo do recurso alterado.
- Validar comportamento com clique, teclado e redimensionamento da janela.
- Garantir ausência de erro no console.

#### Alterações em conteúdo e links

- Abrir todos os links alterados.
- Confirmar existência de PDFs, imagens e arquivos locais referenciados.
- Validar textos com quebras corretas em telas pequenas.

## Checklist de regressão obrigatória

Antes de concluir qualquer mudança, validar no mínimo:

1. Navegação principal em desktop e mobile.
2. Abertura de `index.html`, `publicacoes.html`, `projetos.html`, `pesquisadores.html` e `sobre.html`.
3. Menu responsivo abrindo e fechando corretamente.
4. Busca de publicações funcionando e limpando resultados.
5. Modal de projetos abrindo e fechando sem travar a página.
6. Newsletter sem quebra visual.
7. Ausência de rolagem horizontal indevida no mobile.
8. Rodapé íntegro em todas as páginas.

## Procedimento esperado para futuras mudanças

1. Identificar quais páginas, componentes e breakpoints serão impactados.
2. Implementar a alteração.
3. Criar ou atualizar os testes correspondentes.
4. Executar validação responsiva e funcional.
5. Só então concluir a tarefa.

## Observação final

Neste projeto, responsividade não é validação opcional. Toda mudança deve ser tratada como potencial regressão visual até que seja testada explicitamente.
