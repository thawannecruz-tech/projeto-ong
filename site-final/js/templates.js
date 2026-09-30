// ==========================================================
// SISTEMA DE TEMPLATES (Template Literals + innerHTML)
// Cada função de template recebe um objeto de dados e devolve
// uma string de HTML. As funções de renderização juntam as
// strings e injetam o resultado no DOM.
// ==========================================================

// Caminho da pasta de imagens calculado a partir deste arquivo.
// Assim funciona tanto no index.html (raiz) quanto nas páginas da pasta html.
const PASTA_IMAGENS = new URL('../imagens/', document.currentScript.src).href;

// Segurança: transforma < > & " ' em texto comum antes de ir para o innerHTML
function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Template de um badge
function templateBadge(badge) {
  return `<span class="badge badge--${badge.tipo}">${escaparHTML(badge.texto)}</span>`;
}

// Template do cartão de projeto (reaproveita o template de badge)
function templateCartaoProjeto(projeto) {
  return `
    <article class="cartao">
      <img src="${PASTA_IMAGENS}${projeto.imagem}" alt="${escaparHTML(projeto.alt)}" width="400" height="220" loading="lazy" decoding="async">
      <div class="badges">
        ${templateBadge(projeto.categoria)}
        ${templateBadge(projeto.status)}
      </div>
      <h2>${escaparHTML(projeto.titulo)}</h2>
      <p>${escaparHTML(projeto.descricao)}</p>
    </article>
  `;
}

// Template de uma opção do <select> do formulário
function templateOpcaoProjeto(projeto) {
  return `<option value="${projeto.id}">${escaparHTML(projeto.titulo)}</option>`;
}

// Renderiza os cartões na página de projetos
function renderizarProjetos() {
  const lista = document.getElementById('lista-projetos');
  if (!lista) return; // a página atual não tem a lista
  lista.innerHTML = PROJETOS.map(templateCartaoProjeto).join('');
}

// Renderiza as opções de projeto no formulário de cadastro
function renderizarOpcoesProjeto() {
  const select = document.getElementById('projeto');
  if (!select) return;
  select.insertAdjacentHTML('beforeend', PROJETOS.map(templateOpcaoProjeto).join(''));
}

// Template de um item do histórico de cadastros (dados vindos do localStorage)
function templateItemHistorico(cadastro) {
  const data = new Date(cadastro.data);
  const dataFormatada = data.toLocaleDateString('pt-BR') + ' às ' +
    data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `
    <li class="historico__item">
      <strong>${escaparHTML(cadastro.nome)}</strong>
      <span class="badge badge--primaria">${escaparHTML(cadastro.projeto)}</span>
      <time datetime="${escaparHTML(cadastro.data)}">${dataFormatada}</time>
    </li>
  `;
}

// Restaura o histórico na tela a partir do localStorage
function renderizarHistorico() {
  const lista = document.getElementById('lista-historico');
  if (!lista) return;

  const cadastros = lerCadastros(); // get + parse
  const botaoLimpar = document.getElementById('limpar-historico');

  if (cadastros.length === 0) {
    lista.innerHTML = '<li class="historico__vazio">Nenhum cadastro enviado ainda neste navegador.</li>';
    botaoLimpar.hidden = true;
    return;
  }

  // Mais recentes primeiro
  lista.innerHTML = cadastros.slice().reverse().map(templateItemHistorico).join('');
  botaoLimpar.hidden = false;
}

// Linhas da tabela de atendimentos (alternativa em texto ao gráfico)
function renderizarTabelaAtendimentos() {
  const corpo = document.getElementById('linhas-atendimentos');
  if (!corpo) return;
  corpo.innerHTML = ATENDIMENTOS_POR_ANO.map(function (item) {
    return `<tr><td>${item.ano}</td><td>${item.total.toLocaleString('pt-BR')}</td></tr>`;
  }).join('');
}

// Chamada ao abrir a página e a cada troca de página da SPA
function iniciarTemplates() {
  renderizarProjetos();
  renderizarOpcoesProjeto();
  renderizarHistorico();
  renderizarTabelaAtendimentos();
}

iniciarTemplates();
