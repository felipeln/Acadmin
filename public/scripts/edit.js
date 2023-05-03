const dia =  document.getElementById('dia')
const horarioSelect = document.getElementById('horario');
const instrutorSelect = document.getElementById('instrutor');
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


document.getElementById('dia').setAttribute("min", formatDate(minDate))
document.getElementById('dia').setAttribute("max", formatDate(maxDate))


function atualizarHorarios(){
  const diaEscolhido = dia.value
  const instrutor = document.getElementById('instrutor').value

  axios.get(`/info/${instrutor}/horarios/${diaEscolhido}`)
  .then(response => {
      // Atualize as informações na página com a resposta do servidor
      const horariosDisponiveis = response.data;
      if(horariosDisponiveis.length == 0){
          erroMsg.innerHTML = 'Nenhum horario disponivel, para alterar o horario desse agendamento.'
      }else{
          erroMsg.innerHTML = ''
      }

      // Atualize o select de instrutores com base nas informações recebidas
   
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

atualizarHorarios()