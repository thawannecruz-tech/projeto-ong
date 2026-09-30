// Formulário de cadastro: máscaras, botão de envio e mensagem de sucesso.
// Tudo fica dentro de uma função porque, na SPA, o formulário pode ser
// injetado depois; o roteador chama iniciarCadastro() a cada troca de página.

function iniciarCadastro() {
  const formulario = document.getElementById('formulario');
  if (!formulario) return; // a página atual não tem formulário

  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const cep = document.getElementById('cep');

  // CPF: 000.000.000-00
  cpf.addEventListener('input', function () {
    let valor = cpf.value.replace(/\D/g, '').slice(0, 11); // só números, no máximo 11
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');      // ponto após 3 dígitos
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');      // ponto após 6 dígitos
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // traço antes dos 2 últimos
    cpf.value = valor;
  });

  // Telefone: (00) 00000-0000 ou (00) 0000-0000
  telefone.addEventListener('input', function () {
    let valor = telefone.value.replace(/\D/g, '').slice(0, 11); // DDD + 9 dígitos
    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');   // parênteses no DDD
    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');     // traço antes dos 4 últimos
    telefone.value = valor;
  });

  // CEP: 00000-000
  cep.addEventListener('input', function () {
    let valor = cep.value.replace(/\D/g, '').slice(0, 8); // CEP tem 8 dígitos
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    cep.value = valor;
  });

  // Botão de envio fica desabilitado (disabled) até aceitar os termos
  const termos = document.getElementById('termos');
  const botaoEnviar = document.getElementById('botao-enviar');
  botaoEnviar.disabled = true;
  termos.addEventListener('change', function () {
    botaoEnviar.disabled = !termos.checked;
  });

  // Botão que apaga o histórico salvo
  document.getElementById('limpar-historico').addEventListener('click', function () {
    limparCadastros();
    renderizarHistorico();
    mostrarToast('Histórico apagado deste navegador.');
  });

  // A validação passa a ser feita pelo JavaScript (mensagens no próprio HTML)
  formulario.noValidate = true;
  const campos = formulario.querySelectorAll('input, select, textarea');

  campos.forEach(function (campo) {
    // Ao sair do campo: valida
    campo.addEventListener('blur', function () {
      validarCampo(campo);
    });
    // Enquanto digita: se o campo já tinha erro, revalida para sumir o aviso na hora
    campo.addEventListener('input', function () {
      if (campo.classList.contains('campo--erro')) validarCampo(campo);
    });
    // Selects e checkbox
    campo.addEventListener('change', function () {
      validarCampo(campo);
    });
  });

  // Envio
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // não recarrega a página (não há servidor)

    let totalErros = 0;
    campos.forEach(function (campo) {
      if (!validarCampo(campo)) totalErros++;
    });

    const resumo = document.getElementById('resumo-erros');
    if (totalErros > 0) {
      // Mostra um alerta no topo do formulário e leva o foco ao primeiro erro
      resumo.hidden = false;
      resumo.querySelector('p').textContent = totalErros === 1
        ? 'Encontramos 1 campo com problema. Corrija o campo destacado em vermelho.'
        : 'Encontramos ' + totalErros + ' campos com problema. Corrija os campos destacados em vermelho.';
      formulario.querySelector('.campo--erro').focus();
      return;
    }

    resumo.hidden = true;

    // Salva no localStorage só dados não sensíveis
    const projetoEscolhido = PROJETOS.find(function (p) {
      return p.id === formulario.projeto.value;
    });
    salvarCadastro({
      nome: formulario.nome.value.trim(),
      projeto: projetoEscolhido ? projetoEscolhido.titulo : '',
      data: new Date().toISOString()
    });
    renderizarHistorico(); // atualiza a lista na tela

    mostrarToast('Cadastro enviado com sucesso! Obrigado por se voluntariar.');
    formulario.reset();
    campos.forEach(limparEstado);
    botaoEnviar.disabled = true; // volta a bloquear após o envio
  });
}

// ==========================================================
// ROTINAS DE VERIFICAÇÃO
// ==========================================================

// Confere os dois dígitos verificadores do CPF
function cpfValido(cpf) {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) return false; // ex.: 111.111.111-11

  function calcularDigito(quantidade) {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) {
      soma += Number(numeros[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return calcularDigito(9) === Number(numeros[9]) && calcularDigito(10) === Number(numeros[10]);
}

// Calcula a idade a partir da data de nascimento
function calcularIdade(dataTexto) {
  const nascimento = new Date(dataTexto + 'T00:00:00');
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

// Regras extras, além das nativas (required, pattern, type, minlength)
function aplicarRegrasExtras(campo) {
  campo.setCustomValidity(''); // limpa o erro anterior antes de conferir de novo
  let mensagem = '';

  // Nome: não aceita só espaços e exige nome e sobrenome
  if (campo.id === 'nome' && campo.value && !/\S+\s+\S+/.test(campo.value.trim())) {
    mensagem = 'Digite seu nome e sobrenome.';
  }

  // CPF: só confere os dígitos se o formato 000.000.000-00 já estiver certo
  if (campo.id === 'cpf' && campo.checkValidity() && !cpfValido(campo.value)) {
    mensagem = 'CPF inválido. Confira os números digitados.';
  }

  // Data de nascimento: idade mínima e data possível
  if (campo.id === 'nascimento' && campo.value) {
    const idade = calcularIdade(campo.value);
    if (idade < 0) mensagem = 'A data não pode estar no futuro.';
    else if (idade < 16) mensagem = 'É preciso ter pelo menos 16 anos para ser voluntária(o).';
    else if (idade > 110) mensagem = 'Confira o ano de nascimento.';
  }

  campo.setCustomValidity(mensagem);
}

// Escolhe a mensagem de erro de acordo com o problema encontrado
function mensagemDeErro(campo) {
  const v = campo.validity;
  if (v.valueMissing) {
    if (campo.type === 'checkbox') return 'É preciso aceitar os termos para continuar.';
    if (campo.tagName === 'SELECT') return 'Escolha uma opção.';
    return 'Este campo é obrigatório.';
  }
  if (v.typeMismatch) return 'Digite um e-mail válido, como nome@exemplo.com.';
  if (v.tooShort) return 'Digite pelo menos ' + campo.minLength + ' caracteres.';
  if (v.patternMismatch) return campo.title;
  if (v.customError) return campo.validationMessage;
  return '';
}

// Valida um campo e atualiza o visual; devolve true se estiver certo
function validarCampo(campo) {
  aplicarRegrasExtras(campo);

  if (campo.checkValidity()) {
    limparEstado(campo);
    // Só marca de verde campos preenchidos (o opcional vazio fica neutro)
    if (campo.value && campo.type !== 'checkbox') campo.classList.add('campo--ok');
    return true;
  }

  mostrarErro(campo, mensagemDeErro(campo));
  return false;
}

// Injeta a mensagem de erro logo abaixo do campo
function mostrarErro(campo, mensagem) {
  const idMensagem = 'erro-' + campo.id;
  let aviso = document.getElementById(idMensagem);

  if (!aviso) {
    aviso = document.createElement('span');
    aviso.id = idMensagem;
    aviso.className = 'mensagem-erro';
    // No checkbox, a mensagem vai depois do label inteiro
    const referencia = campo.type === 'checkbox' ? campo.closest('label') : campo;
    referencia.insertAdjacentElement('afterend', aviso);
  }

  aviso.textContent = mensagem;
  campo.classList.remove('campo--ok');
  campo.classList.add('campo--erro');
  campo.setAttribute('aria-invalid', 'true');
  campo.setAttribute('aria-describedby', idMensagem); // leitor de tela lê a mensagem
}

// Remove mensagem e estilos de erro/sucesso
function limparEstado(campo) {
  const aviso = document.getElementById('erro-' + campo.id);
  if (aviso) aviso.remove();
  campo.classList.remove('campo--erro', 'campo--ok');
  campo.removeAttribute('aria-invalid');
  campo.removeAttribute('aria-describedby');
}

iniciarCadastro();
