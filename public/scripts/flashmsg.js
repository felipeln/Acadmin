const alertBox = document.querySelector('.alert-box')


const closeBtn = document.querySelector('.close-alert')


console.log(alertBox , close);


closeBtn.addEventListener('click', () => {
    alertBox.classList.add('desativado') 
})