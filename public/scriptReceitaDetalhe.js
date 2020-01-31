const ingredientesSpan = document.querySelectorAll('.titles')

for (let ingredienteSpan of ingredientesSpan) {
    ingredienteSpan.addEventListener('click', function () {

        const spanValue = ingredienteSpan.querySelector('.span').innerHTML

        if (spanValue === 'MOSTRAR') {
            ingredienteSpan.querySelector('ul').classList.add('visible')
            ingredienteSpan.querySelector('.span').innerHTML = 'ESCONDER'
        }
        else {
            ingredienteSpan.querySelector('.span').innerHTML = 'MOSTRAR'
            ingredienteSpan.querySelector('ul').classList.remove('visible')
        }
    })
}
