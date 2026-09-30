// ==========================================================
// ARMAZENAMENTO LOCAL (localStorage)
// Guarda o histórico de cadastros enviados neste navegador.
// Por privacidade (LGPD), salva só nome, projeto e data:
// CPF, telefone e endereço NÃO são gravados.
// ==========================================================

const CHAVE_CADASTROS = 'redeFlorescer:cadastros';

// GET + PARSE: lê a string salva e converte de volta em array
function lerCadastros() {
  try {
    const texto = localStorage.getItem(CHAVE_CADASTROS); // string ou null
    return texto ? JSON.parse(texto) : [];               // string -> array
  } catch (erro) {
    return []; // navegador sem acesso ao armazenamento ou dado corrompido
  }
}

// STRINGIFY + SET: acrescenta um cadastro e grava o array como texto
function salvarCadastro(cadastro) {
  const lista = lerCadastros();
  lista.push(cadastro);
  try {
    localStorage.setItem(CHAVE_CADASTROS, JSON.stringify(lista)); // array -> string
  } catch (erro) {
    // armazenamento cheio ou bloqueado: o site continua funcionando
  }
}

// REMOVE: apaga todo o histórico
function limparCadastros() {
  try {
    localStorage.removeItem(CHAVE_CADASTROS);
  } catch (erro) {}
}
