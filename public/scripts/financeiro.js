
const financeRows = document.querySelector(".finance-rows");
console.log(financeRows);
const descItem = document.querySelector("#desc");
const valor = document.querySelector("#valor");
const tipo = document.querySelector("#tipo");
const data = document.querySelector('#data')
const btnNew = document.querySelector("#btnNew");

const entradas = document.querySelector(".entradas");
const saidas = document.querySelector(".saidas");
const total = document.querySelector(".total");


let items;


btnNew.onClick = () =>{
    
    if (descItem.value === "" || valor.value === "" || tipo.value === "" || data.value === "") {
        return alert("Preencha todos os campos!");
      }
    
      items.push({
        desc: descItem.value,
        valor: Math.abs(valor.value).toFixed(2),
        tipo: tipo.value,
      });
    
      setItensBD();
    
      loadItens();
    
      descItem.value = "";
      valor.value = "";

}


function deleteItem(index){
    items.splice(index,1)
    setItensBD()
    loadItens()
}


function insertItem(item,index){
    let rowLine = document.createElement('div')
    rowLine.classList.add('row')

    rowLine.innerHTML = `
    <ul>
        <li>${item.desc}</li>
        <li><span class="cifrao">R$</span>${item.valor}</li>
        <li>
            ${item.tipo === 'Entrada' ? `<ion-icon class="icon entrada" name="arrow-up-circle-outline"></ion-icon>` : `<ion-icon class="icon saida" name="arrow-down-circle-outline"></ion-icon>`} 
        </li>
        <li class="actions">
        <span class="deletar" onclick="deleteItem(${index})" ><ion-icon class="icon" name="trash-outline"></ion-icon> </span >
        </li>
    </ul>
    
    
    `
    financeRows.appendChild(rowLine)
}

function loadItens (){
    items = getItensBD()
    financeRows.innerHTML = ''
    items.forEach((item, index) =>{
        insertItem(item,index)
    })
    getTotals()
}



function getTotals(){

    const valorEntradas = items.filter((item) =>{
        item.tipo === "Entrada"
    }).map((transaction) =>{
        Number(transaction.valor)
    })

    
    const valorSaidas = items.filter((item) =>{
        item.tipo === "Saida"
    }).map((transaction) =>{
        Number(transaction.valor)
    })

    const totalEntradas = valorEntradas.reduce((acc,cur) => acc + cur, 0).toFixed(2)
    
    const totalSaidas= Math.abs(valorSaidas.reduce((acc,cur) => acc + cur, 0).toFixed(2))


    const totalValores = (totalEntradas - totalEntradas).toFixed(2)

    entradas.innerHTML = totalEntradas
    saidas.innerHTML = totalSaidas
    total.innerHTML = totalValores

}


const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

loadItens();