document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector('#modalidade');
    const form = document.querySelector('form')
    select.addEventListener('change', function() {
        form.submit()
});
});
