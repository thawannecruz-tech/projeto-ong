// ==========================================================
// ROTEADOR DA SPA (Single Page Application)
// Intercepta os cliques nos links internos, busca a página
// com fetch e troca só o conteúdo do <main id="app">.
// Cabeçalho, menu e rodapé continuam na tela, sem recarregar.
// ==========================================================

const app = document.getElementById('app');

// 1) Deixa todos os links com endereço completo (absoluto).
//    Assim eles continuam certos quando a URL muda com pushState.
function corrigirCaminhos(raiz, urlBase) {
  raiz.querySelectorAll('[href], [src]').forEach(function (el) {
    const atributo = el.hasAttribute('src') ? 'src' : 'href';
    if (el.getAttribute(atributo).startsWith('#')) return; // âncora da própria página
    el.setAttribute(atributo, new URL(el.getAttribute(atributo), urlBase).href);
  });
}

// 2) Marca no menu o link da página atual
function marcarLinkAtivo() {
  document.querySelectorAll('.menu > li > a').forEach(function (link) {
    if (link.href.split('#')[0] === location.href.split('#')[0]) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Número da navegação mais recente. Evita que uma página lenta
// "atropele" outra que o usuário pediu depois (cliques rápidos).
let navegacaoAtual = 0;

// Caminho da página que está na tela. Serve para ignorar mudanças
// só no "#" da URL (âncoras), que também disparam o popstate.
let caminhoAtual = location.pathname;

// 3) Busca a página e injeta o conteúdo no <main id="app">
async function carregarPagina(url, adicionarAoHistorico) {
  const minhaNavegacao = ++navegacaoAtual;
  document.body.classList.add('carregando');

  // Aberto direto do computador (file://): o fetch não funciona,
  // então usa a navegação tradicional.
  if (location.protocol === 'file:') {
    window.location.href = url;
    return;
  }

  try {
    const resposta = await fetch(url);

    if (minhaNavegacao !== navegacaoAtual) return; // outro clique já pediu outra página

    if (!resposta.ok) {
      mostrarToast('Página não encontrada. Você continua na página atual.', 'erro');
      return;
    }

    const html = await resposta.text();
    if (minhaNavegacao !== navegacaoAtual) return;
    const novaPagina = new DOMParser().parseFromString(html, 'text/html');
    const novoConteudo = novaPagina.querySelector('main');

    corrigirCaminhos(novoConteudo, url);        // imagens e links da página nova
    app.innerHTML = novoConteudo.innerHTML;     // troca só o conteúdo principal
    document.title = novaPagina.title;          // atualiza o título da aba

    if (adicionarAoHistorico) {
      history.pushState({}, '', url);           // muda a URL sem recarregar
    }

    caminhoAtual = location.pathname;
    document.getElementById('menu-toggle').checked = false; // fecha o menu no celular
    marcarLinkAtivo();
    iniciarTemplates();                         // gera cartões e opções a partir dos dados
    iniciarCadastro();                          // ativa o formulário, se houver
    iniciarGrafico();                           // desenha o gráfico, se houver

    // Rola até a seção (ex.: #doacao) ou para o topo
    const alvo = new URL(url).hash ? document.querySelector(new URL(url).hash) : null;
    if (alvo) {
      alvo.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    app.focus({ preventScroll: true });         // leitor de tela começa pelo conteúdo novo
    document.getElementById('anuncio-rota').textContent = 'Página carregada: ' + document.title;
  } catch (erro) {
    // Falha de rede (sem internet): avisa e mantém a página atual
    if (minhaNavegacao === navegacaoAtual) {
      mostrarToast('Sem conexão. Verifique sua internet e tente de novo.', 'erro');
    }
    console.error('Erro ao carregar a página:', url, erro);
  } finally {
    if (minhaNavegacao === navegacaoAtual) {
      document.body.classList.remove('carregando');
    }
  }
}

// 4) Intercepta os cliques em links internos
document.addEventListener('click', function (evento) {
  const link = evento.target.closest('a');
  if (!link) return;

  const destino = new URL(link.href);
  const linkInterno = destino.origin === location.origin && destino.pathname.endsWith('.html');
  const abrirEmNovaAba = link.target === '_blank' || evento.ctrlKey || evento.metaKey || evento.shiftKey;

  if (!linkInterno || abrirEmNovaAba) return; // deixa o navegador agir normalmente

  // Âncora na mesma página (ex.: "Pular para o conteúdo"): comportamento normal
  const mesmaPagina = destino.pathname === location.pathname;
  if (mesmaPagina && destino.hash) return;

  evento.preventDefault();                       // impede o recarregamento da página
  carregarPagina(destino.href, true);
});

// 5) Botões voltar e avançar do navegador
window.addEventListener('popstate', function () {
  if (location.pathname === caminhoAtual) return; // só mudou a âncora (#): o navegador rola sozinho
  carregarPagina(location.href, false);
});

// Preparação inicial
app.setAttribute('tabindex', '-1');
corrigirCaminhos(document.body, location.href);
marcarLinkAtivo();
