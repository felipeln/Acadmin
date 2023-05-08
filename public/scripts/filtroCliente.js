const statusSelect = document.getElementById('filtro');
const clienteList = document.getElementById('cliente-list');

// console.log(statusSelect);

  statusSelect.addEventListener('change', () => {
    const selectedStatus = statusSelect.value;

    if (selectedStatus) {
      // Mostrar apenas as divs que correspondem ao status selecionado
      for (const div of clienteList.children) {
        if (div.dataset.status === selectedStatus) {
          div.style.display = 'block';
        } else {
          div.style.display = 'none';
          // div.style.overFlow = 'Hidden'
        }
      }
    } else {
      // Mostrar todas as divs
      for (const div of clienteList.children) {
        div.style.display = 'block';
      }
    }
  });