


// function atualizarInstrutor() {
//     const filtro = document.querySelector('.filtro').value
//     const modalidadeSelecionada = document.getElementById("modalidade").value;



//     axios.get(`/financeiro/pagamentos/status/${filtro}`)
//     .then(response =>{
//         const pagamentos = response.data

//         const boletosRow = document.querySelector('')

//     }).catch(error =>{

//     })


//     axios.get(`/info/${modalidadeSelecionada}`)
//         .then(response => {
//             // Atualize as informações na página com a resposta do servidor
//             const instrutores = response.data;

//             // Atualize o select de instrutores com base nas informações recebidas
//             const instrutorSelect = document.getElementById('instrutor');
//             instrutorSelect.innerHTML = '';
//             instrutores.forEach(instrutor => {
//                 const option = document.createElement('option');
//                 option.value = instrutor._id;
//                 option.text = `${instrutor.nome} ${instrutor.sobrenome}`;
//                 instrutorSelect.add(option);
//             });

//         })
//         .catch(error => {
//             console.error(error);
//         });
    
// }



const statusSelect = document.getElementById('filtro');
const boletosList = document.getElementById('boletos-list');

console.log(statusSelect);

  statusSelect.addEventListener('change', () => {
    const selectedStatus = statusSelect.value;

    if (selectedStatus) {
      // Mostrar apenas as divs que correspondem ao status selecionado
      for (const div of boletosList.children) {
        if (div.dataset.status === selectedStatus) {
          div.style.display = 'block';
        } else {
          div.style.display = 'none';
          // div.style.overFlow = 'Hidden'
        }
      }
    } else {
      // Mostrar todas as divs
      for (const div of boletosList.children) {
        div.style.display = 'block';
      }
    }
  });


