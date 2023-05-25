const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const telefoneRegex = /^\(\d{2}\)\s9\d{4}-\d{4}$/;

const formulario = document.querySelector('#form');
const emailInput = document.querySelector('#email');
const cpfInput = document.querySelector('#cpf');
const telefoneInput = document.querySelector('#telefone');
const emailError = document.querySelector('#email-error');
const cpfError = document.querySelector('#cpf-error');
const telefoneError = document.querySelector('#telefone-error');

const dateInput = document.querySelector('#dataNascimento');

// Set the maximum date to the current date
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("max", today);


function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false; // Verifica se o CPF possui 11 dígitos e não é uma sequência repetida
  }

  // Verifica os dígitos verificadores
  var soma = 0;
  var resto;
  
  for (var i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  
  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false; // Primeiro dígito verificador inválido
  }
  
  soma = 0;
  
  for (i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  
  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false; // Segundo dígito verificador inválido
  }
  
  return true; // CPF válido
}


telefoneInput.addEventListener("input", function() {
    // Remove all non-numeric characters from the input
    let phoneNumber = telefoneInput.value.replace(/\D/g, "");
  
    // Add the parentheses and hyphen to the phone number
    phoneNumber = phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  
    // Update the value of the phone number input field
    telefoneInput.value = phoneNumber;
  });

cpfInput.setAttribute("maxlength", 14);
telefoneInput.setAttribute("maxlength", 14);

cpfInput.addEventListener("keyup", function() {
    // Remove todos os caracteres que não são números
    let cpf = cpfInput.value.replace(/\D/g, "");

    // maximo de caracteres
    
  
    // Adiciona os pontos e traços
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  
    // Atualiza o valor do campo com o CPF formatado
    cpfInput.value = cpf;
  });

formulario.addEventListener('submit', function(event) {
  event.preventDefault(); // previne o envio do formulário

  let isValid = true;

  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = 'Por favor, insira um email válido.';
    isValid = false;
  } else {
    emailError.textContent = '';
  }

  // ! Validando cpf

  
  if (!cpfRegex.test(cpfInput.value)) {
    cpfError.textContent = 'Por favor, insira um CPF válido.';
    isValid = false;
  }else if(validarCPF(cpfInput.value) === false){
    cpfError.textContent = 'Por favor, insira um CPF válido.';
    isValid = false;
  }else{
    cpfError.textContent = '';
  }


  if (!telefoneRegex.test(telefoneInput.value)) {
    telefoneError.textContent = 'Por favor, insira um telefone válido no formato (DD) 90000-0000.';
    isValid = false;
  } else {
    telefoneError.textContent = '';
  }

  if (isValid) {
    // envia o formulário
    formulario.submit();
  }
});

// adiciona listeners de evento para o evento "focus" nos campos de entrada
emailInput.addEventListener('focus', function() {
  emailError.textContent = '';
});

cpfInput.addEventListener('focus', function() {
  cpfError.textContent = '';
});

telefoneInput.addEventListener('focus', function() {
  telefoneError.textContent = '';
});


