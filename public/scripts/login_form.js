// const email = document.getElementById('email')
// const password = document.getElementById('password')
// const form = document.getElementById('form')
// const error = document.getElementById('error')


// // autenticação basica

// const users = [
//     {
//         email: 'admin',
//         password: 'admin',
//         cargo: 'adm'
//     },
//     {
//         email: 'admin1',
//         password: 'admin1',
//         cargo: 'adm'
//     },
//     {
//         email: 'user',
//         password: 'user',
//         cargo: 'cliente'
//     }

// ]


// form.addEventListener('submit', (e) => {

//     let messages = []
//     let res = false

 
//     for(let i in users){
//         if(email.value === users[i].email && password.value === users[i].password){
//             if(users[i].cargo == 'adm'){
//                 form.action = "/dashboard#adm"
//             }if(users[i].cargo == 'cliente'){
//                 form.action = "/portal#cliente"
//             }
//             res = true
//             alert('Login efetuado')
//             break
//         }
//     }if(res == false){
//         messages.push('Email/senha invalidos')
//     }
    

//     if(messages.length > 0 || res == false){
//         e.preventDefault()
//         error.innerText = messages.join(', ')
//     }

    
// })




// // script de validação de email, para cadastro

// // function ValidateEmail(inputText)
// // {
// // 	var mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
// // 	if(inputText.value.match(mailformat))
// // 	{
// // 		return false;
// // 		}
// // }



// // form.addEventListener('submit', (e) => {

// //     let messages = []


// //     if (ValidateEmail(email) || email.value == null || email.value === '') {
// //         messages.push('Digite um email valido')
// //     }

// //     if(messages.length > 0){
// //         e.preventDefault()
// //         error.innerText = messages.join(', ')
// //     }

    
// // })
