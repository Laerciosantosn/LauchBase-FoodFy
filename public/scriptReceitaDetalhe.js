const ingredientsSpan = document.querySelectorAll('.title')

for (let ingredientSpan of ingredientsSpan) {
    ingredientSpan.addEventListener('click', function () {

        const spanValue = ingredientSpan.querySelector('.span').innerHTML

        if (spanValue === 'SHOW') {
            ingredientSpan.querySelector('ul').classList.add('visible')
            ingredientSpan.querySelector('.span').innerHTML = 'TO HIDE'
        }
        else {
            ingredientSpan.querySelector('.span').innerHTML = 'SHOW'
            ingredientSpan.querySelector('ul').classList.remove('visible')
        }
    })
}
