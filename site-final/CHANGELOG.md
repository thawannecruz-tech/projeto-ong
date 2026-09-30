# Histórico de versões

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.1.0] - 2026-09-30

### Adicionado
- Acessibilidade WCAG 2.1 AA: link para pular ao conteúdo, foco visível, anúncio das trocas de página e redução de movimento.
- Temas claro, escuro e alto contraste, com modo automático.
- Build de produção com esbuild (JS, CSS e HTML minificados, 39% menor).
- Carregamento sob demanda das ilustrações.
- Deploy automático no GitHub Pages com GitHub Actions.
- Modelos de issue e pull request.

### Corrigido
- Âncoras na mesma página recarregavam o conteúdo da SPA.
- O resumo de erros aparecia vazio ao abrir o cadastro.

## [1.0.1] - 2026-09-29

### Corrigido
- Leitura duplicada do nome da ONG no logo por leitores de tela.

## [1.0.0] - 2026-09-29

### Adicionado
- Páginas de início, projetos, cadastro e guia de componentes em HTML5 semântico.
- Design System com variáveis CSS, grid de 12 colunas e 5 breakpoints.
- Menu hambúrguer e submenu.
- SPA com roteador próprio, templates e histórico de cadastros no localStorage.
- Formulário com máscaras e validação em JavaScript.
- Componentes de feedback: badges, alertas, toast e modal.
- Gráfico de atendimentos com Chart.js.
- README, CHANGELOG e meta description nas páginas.
