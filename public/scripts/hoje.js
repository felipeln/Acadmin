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


