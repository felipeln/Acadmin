const openModal = document.querySelector('#deleteModal')

const modal_overlay = document.querySelector('.modal-overlay');

const close_btn = document.querySelector('.close_modal')

openModal.addEventListener('click', () =>{
    modal_overlay.classList.add('active')
})


close_btn.addEventListener('click', () => {
        modal_overlay.classList.remove('active')
    
        modal_overlay.querySelector("iframe").src = ''; 
    })

