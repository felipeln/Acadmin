const list = document.querySelectorAll('.list')
const nav = document.querySelector('nav')
const aside = document.querySelector('aside')
const openBtn = document.querySelector('.open')

function activeLink(){
    list.forEach((item) => {
        item.classList.remove('active')
    })
        
    this.classList.add('active')
    nav.classList.add('ativo')
    openBtn.classList.add('click')

}

list.forEach((item) => {
    item.addEventListener('click', activeLink)
    
})

if(nav.classList.contains('ativo')){
    openBtn.classList.add('click')
}

openBtn.addEventListener('click', () => {
    nav.classList.toggle('ativo')
    openBtn.classList.toggle('click')
} )

