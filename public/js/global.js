const form = document.getElementById('image_form');
const result = document.getElementById('results');
const result_container = document.querySelector('.results.hidden');

form.addEventListener('submit', async () => {
    form.preventDefault();
    await fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then(response => response.json())
    .then(data => {
        result.innerHTML = data;
    })
    .catch(error => {
        result.innerHTML = error;
    })
    result_container.style.display = 'block';
});