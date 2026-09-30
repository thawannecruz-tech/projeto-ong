// ==========================================================
// TEMAS: automático, claro, escuro e alto contraste
// Carregado no <head> para aplicar o tema antes de a página
// aparecer, evitando que ela "pisque" no tema errado.
// O tema escolhido fica salvo no localStorage.
// ==========================================================

(function () {
  const CHAVE = 'redeFlorescer:tema';
  const TEMAS = ['automatico', 'claro', 'escuro', 'alto-contraste'];
  const NOMES = {
    automatico: 'Automático',
    claro: 'Claro',
    escuro: 'Escuro',
    'alto-contraste': 'Alto contraste'
  };

  let temaAtual = 'automatico';
  try {
    temaAtual = localStorage.getItem(CHAVE) || 'automatico';
  } catch (erro) {} // sem acesso ao armazenamento: segue o sistema

  // "Automático" remove o atributo, e o CSS segue o sistema
  // (prefers-color-scheme e prefers-contrast)
  function aplicar(tema) {
    if (tema === 'automatico') {
      document.documentElement.removeAttribute('data-tema');
    } else {
      document.documentElement.setAttribute('data-tema', tema);
    }
  }

  aplicar(temaAtual);

  document.addEventListener('DOMContentLoaded', function () {
    const botao = document.getElementById('botao-tema');
    if (!botao) return;
    botao.textContent = 'Tema: ' + NOMES[temaAtual];

    // Cada clique passa para o próximo tema da lista
    botao.addEventListener('click', function () {
      temaAtual = TEMAS[(TEMAS.indexOf(temaAtual) + 1) % TEMAS.length];
      try {
        localStorage.setItem(CHAVE, temaAtual);
      } catch (erro) {}

      aplicar(temaAtual);
      botao.textContent = 'Tema: ' + NOMES[temaAtual];

      // O gráfico lê as cores das variáveis CSS: redesenha com as novas
      if (typeof iniciarGrafico === 'function') iniciarGrafico();
      if (typeof mostrarToast === 'function') mostrarToast('Tema alterado para ' + NOMES[temaAtual] + '.');
    });
  });
})();
