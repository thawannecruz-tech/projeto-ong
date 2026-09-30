// Componentes de feedback reutilizáveis: toast e modal

// TOAST: mostra uma notificação por 4 segundos.
// O elemento é criado pelo JavaScript uma única vez e reaproveitado.
// tipo: 'sucesso' (padrão) ou 'erro'
let temporizadorToast = null;

function mostrarToast(mensagem, tipo) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '<span id="toast-icone" aria-hidden="true"></span><p id="toast-texto"></p>';
    document.body.appendChild(toast);
  }
  const erro = tipo === 'erro';
  toast.classList.toggle('toast--erro', erro);
  document.getElementById('toast-icone').textContent = erro ? '\u2717' : '\u2713'; // ✗ ou ✓
  toast.classList.add('toast--visivel');
  document.getElementById('toast-texto').textContent = mensagem;

  // Reinicia o tempo se outro toast aparecer antes do anterior sumir
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    toast.classList.remove('toast--visivel');
  }, 4000);
}

// Delegação de eventos: um único ouvinte no document funciona também
// para botões que chegam depois, injetados pelo roteador da SPA.
document.addEventListener('click', function (evento) {
  const botaoModal = evento.target.closest('[data-abrir-modal]');
  if (botaoModal) {
    document.getElementById(botaoModal.dataset.abrirModal).showModal();
  }

  const botaoToast = evento.target.closest('[data-toast]');
  if (botaoToast) {
    mostrarToast(botaoToast.dataset.toast);
  }
});
