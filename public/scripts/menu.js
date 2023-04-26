const list = document.querySelectorAll('.list')
const nav = document.querySelector('nav#left-menu')
const aside = document.querySelector('aside')
const openBtn = document.querySelector('.open')

const container = document.querySelector('.container')


function activeLink(){
    list.forEach((item) => {
        item.classList.remove('active')
    })
        
    this.classList.add('active')
    nav.classList.add('ativo')
    openBtn.classList.add('aberto')

}

// link ativo
list.forEach((item) => {
    item.addEventListener('click', activeLink)
    
})
// botao ativo se tiver link ativo
if(nav.classList.contains('ativo')){
    openBtn.classList.add('aberto')
}

// menu aberto
openBtn.addEventListener('click', () => {
    nav.classList.toggle('ativo')
    openBtn.classList.toggle('aberto')
    container.classList.toggle('expand')
} )



