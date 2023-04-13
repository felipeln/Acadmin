const submenuBtn = document.querySelectorAll('.submenu_btn')
const telas = document.querySelectorAll('.form-wrapper')

const url = "localhost:4000"

submenuBtn.forEach((tab, index) =>{
    tab.addEventListener('click', (e) =>{
        submenuBtn.forEach(tab => {
            tab.classList.remove('ativo')
        })
        tab.classList.add('ativo')

        telas.forEach(tab => {
            tab.classList.remove('ativo')
        })
        telas[index].classList.add('ativo')
      
        
    })
})



// task

// usar local storage para ver ultimo menu de cadastro usado, cliente ou funcionario e deixar ele ativo assim que entrar novamente nessa pagina
