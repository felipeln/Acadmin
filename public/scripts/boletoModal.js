// obtenha todos os botões "Detalhes" na página
const detailButtons = document.querySelectorAll('.details-btn');
const close_btn = document.querySelectorAll('.close_modal')
// const modal_overlay = document.querySelectorAll('.modal-overlay');


detailButtons.forEach(button =>{
  button.addEventListener('click', function() {
    
   
    const id = button.getAttribute('data-cliente-id')

    const modal = document.getElementById(id)
    
    modal.classList.add('active')

    const close = document.getElementById(`close-${id}`)

    close.addEventListener('click', ( )=>{
      modal.classList.remove('active')
    })
    
  });
  
  
})











