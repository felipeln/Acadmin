// ! decalrando variaveis

const dia =  document.getElementById('dia')
const modalidadeSelect = document.getElementById('modalidade')
const instrutorSelect = document.getElementById('instrutor');
const horarioSelect = document.getElementById('horario');
let erroMsg = document.querySelector('.erro-horario')


let minDate = new Date();
let maxDate = new Date();

maxDate.setDate(minDate.getDate() + 60);

function formatDate(date) {
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0');
  let yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}



dia.setAttribute("min", formatDate(minDate))
dia.setAttribute("max", formatDate(maxDate))

function atualizarHorarios(){
    const diaEscolhido = dia.value
    const instrutor = document.getElementById('instrutor').value
   

    axios.get(`/acadmin/info/${instrutor}/horarios/${diaEscolhido}`)
    .then(response => {
        // Atualize as informações na página com a resposta do servidor
        const horariosDisponiveis = response.data;
        if(horariosDisponiveis.length == 0){
            erroMsg.innerHTML = 'Nenhum horario disponivel, mude a data e tente novamente'
        }else{
            erroMsg.innerHTML = ''
        }

        // Atualize o select de instrutores com base nas informações recebidas
       
        horarioSelect.innerHTML = '';
        horariosDisponiveis.forEach(hora =>{
            const option = document.createElement('option')
            option.value = hora.hora
            option.text = hora.hora
            horarioSelect.add(option)
        })
    })
    .catch(error => {
        console.error(error);
    });
}


function atualizarInstrutor() {
    const modalidadeSelecionada = document.getElementById("modalidade").value;
    axios.get(`/acadmin/info/${modalidadeSelecionada}`)
        .then(response => {
            // Atualize as informações na página com a resposta do servidor
            const instrutores = response.data;

            // Atualize o select de instrutores com base nas informações recebidas
            const instrutorSelect = document.getElementById('instrutor');
            instrutorSelect.innerHTML = '';
            instrutores.forEach(instrutor => {
                const option = document.createElement('option');
                option.value = instrutor._id;
                option.text = `${instrutor.nome} ${instrutor.sobrenome}`;
                instrutorSelect.add(option);
            });

        })
        .catch(error => {
            console.error(error);
        });
    
}


modalidadeSelect.addEventListener('change', () =>{
    atualizarInstrutor()
    dia.value = ''
    horarioSelect.innerHTML = '';
})
instrutorSelect.addEventListener('change', atualizarHorarios)

dia.addEventListener('change', function() {
    const selectedDate = new Date(dia.value);
    atualizarHorarios()
    // console.log(selectedDate.getDay());
    if (selectedDate.getDay() === 6) {
    dia.setCustomValidity('Por favor, selecione um dia de segunda a sábado.');
    //   dia.value = '';
    }else{
        dia.setCustomValidity('');
    }
  });



atualizarInstrutor() 
  
atualizarHorarios()
  





