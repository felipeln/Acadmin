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

  if (!cpfRegex.test(cpfInput.value)) {
    cpfError.textContent = 'Por favor, insira um CPF válido.';
    isValid = false;
  } else {
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
