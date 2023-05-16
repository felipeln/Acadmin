const diaInicial =  document.getElementById('dia').value
const dia =  document.getElementById('dia')
const horarioInicial = document.getElementById('horario').value;
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

  // if(diaEscolhido == diaInicial){
  //   let opcaoEscolhida = document.createElement('option')
  //   opcaoEscolhida.value = horarioInicial
  //   opcaoEscolhida.text = horarioInicial
  //   opcaoEscolhida.classList.add('escolhida')
  //   horarioSelect.add(opcaoEscolhida)
  // }




  axios.get(`/dashboard/info/${instrutor}/horarios/${diaEscolhido}`)
  .then(response => {
    horarioSelect.innerHTML = ''
    // limpar opçoes do select antes de mostrar as novas.
      // Atualize as informações na página com a resposta do servidor
      const horariosDisponiveis = response.data;
      if(horariosDisponiveis.length == 0){
          erroMsg.innerHTML = 'Nenhum horario disponivel, para alterar o horario desse agendamento.'
      }else{
          erroMsg.innerHTML = ''
      }

      // Atualize o select de instrutores com base nas informações recebidas
      // console.log(horarioInicial);
      if(diaEscolhido == diaInicial){
        let opcaoEscolhida = document.createElement('option')
        opcaoEscolhida.value = horarioInicial
        opcaoEscolhida.text = horarioInicial
        opcaoEscolhida.classList.add('escolhida')
        horarioSelect.add(opcaoEscolhida)

        horariosDisponiveis.forEach(hora =>{

          const option = document.createElement('option')
          option.value = hora.hora
          option.text = hora.hora
          horarioSelect.add(option)
        })
        
        
        }else{
          horariosDisponiveis.forEach(hora =>{
            const option = document.createElement('option')
            option.value = hora.hora
            option.text = hora.hora
            horarioSelect.add(option)
        })
      }
    //   horariosDisponiveis.forEach(hora =>{
    //     const option = document.createElement('option')
    //     option.value = hora.hora
    //     option.text = hora.hora
    //     horarioSelect.add(option)
    //     console.log(hora.hora);
    // })
      
      
     
  })
  .catch(error => {
      console.error(error);
  });
}

instrutorSelect.addEventListener('change', atualizarHorarios)

dia.addEventListener('change', function() {
  const selectedDate = new Date(dia.value);
  // console.log(selectedDate.getDay());
  if (selectedDate.getDay() === 6) {
  dia.setCustomValidity('Por favor, selecione um dia de segunda a sábado.');
  //   dia.value = '';
  }else{
      dia.setCustomValidity('');
    atualizarHorarios()

  }
});

atualizarHorarios()