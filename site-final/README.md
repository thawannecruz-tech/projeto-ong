# Rede Florescer

Site de uma ONG fictícia de apoio a mulheres, desenvolvido como projeto acadêmico de front-end.
A aplicação apresenta a organização, seus projetos e um formulário de cadastro de voluntárias e voluntários.

## Funcionalidades

- **Páginas em HTML5 semântico:** início, projetos, cadastro e guia de componentes.
- **Design System em CSS:** variáveis para cores, tipografia e espaçamentos.
- **Layout responsivo:** grid de 12 colunas com 5 breakpoints (576, 768, 992, 1200 e 1400px).
- **Menu hambúrguer** no celular, feito só com CSS, e submenu no desktop.
- **SPA (Single Page Application):** troca de páginas sem recarregar, com `fetch` e `history.pushState`.
- **Templates em JavaScript:** cartões de projetos e opções do formulário gerados a partir de dados.
- **Formulário com validação:** máscaras de CPF, telefone e CEP, dígitos verificadores do CPF, idade mínima e mensagens de erro no próprio HTML.
- **localStorage:** histórico de cadastros enviados, restaurado ao abrir a página. Apenas nome, projeto e data são salvos (LGPD).
- **Componentes de feedback:** badges, alertas, toast e modal (`<dialog>`).
- **Temas:** claro, escuro e alto contraste, com modo automático.
- **Gráfico** com a biblioteca Chart.js, com tabela como alternativa acessível.

## Tecnologias

- HTML5
- CSS3 (variáveis, Grid e Flexbox)
- JavaScript puro (ES6+)
- [Chart.js 4.4.1](https://www.chartjs.org/) via CDN
- Git e GitHub (GitFlow)

## Pré-requisitos

- Um navegador atualizado (Chrome, Edge, Firefox ou Safari).
- [Git](https://git-scm.com/) para clonar o repositório.
- [VS Code](https://code.visualstudio.com/) com a extensão **Live Server** (recomendado, para a SPA funcionar).
- Conexão com a internet para carregar o Chart.js pelo CDN. Sem internet, o site funciona e mostra os dados do gráfico em tabela.

- [Node.js](https://nodejs.org/) 18 ou superior, apenas para gerar a build de produção.

O site funciona direto dos arquivos de código, sem instalar nada. O Node.js só é necessário para gerar a versão otimizada.

## Estrutura de pastas

```
projeto-ong/
├── index.html          # página inicial
├── html/               # demais páginas
│   ├── projetos.html
│   ├── cadastro.html
│   └── componentes.html
├── css/
│   └── style.css       # Design System e estilos
├── js/
│   ├── dados.js        # dados dos projetos e atendimentos
│   ├── armazenamento.js# localStorage
│   ├── templates.js    # geração de HTML a partir dos dados
│   ├── feedback.js     # toast e modal
│   ├── script.js       # formulário: máscaras e validação
│   ├── grafico.js      # integração com o Chart.js
│   └── router.js       # navegação da SPA
└── imagens/            # logo e ilustrações (.svg, .png e .webp)
```

Os scripts são carregados no fim do `<body>`, nesta ordem, porque cada um usa funções dos anteriores.

## Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/projeto-ong.git
   ```
2. Abra a pasta no VS Code e inicie a extensão **Live Server** no `index.html`.

Também é possível abrir o `index.html` com dois cliques. Nesse caso, o site funciona normalmente, mas as páginas recarregam ao trocar, porque o navegador bloqueia o `fetch` em arquivos locais (`file://`).

## Build de produção

A build usa o [esbuild](https://esbuild.github.io/) e gera a pasta `dist/`, pronta para publicar:

```bash
npm install
npm run build
```

O script `build.mjs`:

- junta os 7 arquivos de JavaScript, na ordem certa, em um único `js/app.min.js` e minifica;
- minifica o `tema.js`, que fica separado porque precisa rodar no `<head>`;
- minifica o `style.css` em `style.min.css`;
- remove comentários e espaços extras do HTML e troca as referências para os arquivos `.min`;
- copia as imagens e mostra um relatório com a redução de tamanho.

| Arquivos | Antes | Depois | Redução |
|---|---|---|---|
| JavaScript (7 arquivos em 1) | 25,5 KB | 12,6 KB | 50% |
| CSS | 26,5 KB | 15,6 KB | 41% |
| HTML (4 páginas) | 22,3 KB | 17,5 KB | 21% |
| **Total** | **76,3 KB** | **46,5 KB** | **39%** |

As requisições de JavaScript local caem de 8 para 2. A pasta `dist/` não vai para o repositório (está no `.gitignore`), porque é gerada a partir do código.

## Testes e validação

O projeto não tem testes automatizados. A validação é feita assim:

- **HTML:** cada página enviada ao [W3C Validator](https://validator.w3.org/), sem erros nem avisos.
- **Formulário:** CPF, telefone e CEP colados com números a mais, CPF com dígitos repetidos (111.111.111-11), nome só com espaços e idade abaixo de 16 anos. Todos devem mostrar mensagem de erro.
- **SPA:** no DevTools, aba Network, testar os modos *Offline* e *Slow 3G*, cliques rápidos entre páginas e os botões voltar e avançar.
- **Acessibilidade:** navegação só com o teclado (Tab, Enter e Esc) e auditoria do Lighthouse.

## Acessibilidade

O site segue a WCAG 2.1, nível AA:

- HTML semântico e hierarquia de títulos sem saltos.
- Link "Pular para o conteúdo" no início de cada página (2.4.1).
- Contorno de foco visível em todos os elementos interativos (2.4.7).
- Contraste mínimo de 4,5:1 nos textos, conferido com a fórmula da WCAG (1.4.3).
- Página atual do menu indicada com sublinhado, e não só com cor (1.4.1).
- Campos com `label`, mensagens de erro ligadas por `aria-describedby` e `aria-invalid` (3.3.1).
- Trocas de página da SPA anunciadas com `aria-live` (4.1.3).
- Gráfico com tabela alternativa e `prefers-reduced-motion` respeitado (1.1.1 e 2.3.3).
- Três temas: claro, escuro e alto contraste. O modo automático segue o sistema (`prefers-color-scheme` e `prefers-contrast`), e o botão "Tema" no cabeçalho salva a escolha. Todos os textos têm contraste mínimo de 4,5:1 nos três temas.

## Deploy (CI/CD)

O site é publicado no **GitHub Pages** por um workflow do **GitHub Actions** (`.github/workflows/deploy.yml`). A cada push na `main`, o GitHub:

1. baixa o código e instala o Node.js 20;
2. roda `npm install` e `npm run build`;
3. publica a pasta `dist/` no GitHub Pages.

Para ativar, uma única vez: no repositório, abra **Settings → Pages** e, em **Source**, escolha **GitHub Actions**. O andamento de cada publicação aparece na aba **Actions**.

Endereço do site: `https://SEU-USUARIO.github.io/projeto-ong/`

## Fluxo de trabalho (GitFlow)

| Branch | Uso |
|---|---|
| `main` | Versões estáveis, prontas para produção. Cada versão recebe uma tag (`v1.0.0`). |
| `develop` | Integração do desenvolvimento. Recebe as features concluídas. |
| `feature/*` | Uma branch por funcionalidade, criada a partir da `develop`. |
| `release/*` | Preparação de uma versão: ajustes finais antes de ir para a `main`. |
| `hotfix/*` | Correção urgente de um problema na `main`. |

Os merges usam `--no-ff`, para que cada funcionalidade apareça como um bloco no histórico.

### Padrão de commits

As mensagens seguem o [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

- `feat:` nova funcionalidade
- `fix:` correção de problema
- `docs:` documentação
- `style:` formatação ou CSS, sem mudar a lógica
- `refactor:` reorganização de código
- `chore:` tarefas de configuração

## Histórico de versões

As mudanças de cada versão estão no [CHANGELOG.md](CHANGELOG.md).

## Autora

Thawanne — projeto acadêmico, 2026.
