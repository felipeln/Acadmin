const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.getElementById('form')
const error = document.getElementById('error')





// // // script de validação de email, para cadastro

 function ValidateEmail(inputText)
 {
 	let mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
 	if(inputText.value.match(mailformat))
 	{
 		return false;
 		}
 }



 form.addEventListener('submit', (e) => {


     if (ValidateEmail(email) || email.value == null || email.value === '') {
         messages.push('Digite um email valido')
     }

     if(messages.length > 0){
         e.preventDefault()
         error.innerText = messages.join(', ')
     }

    
 })
