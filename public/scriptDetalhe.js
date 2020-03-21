const images = document.querySelectorAll('.cardImage')
const cards = document.querySelectorAll('.cardTitle')
const chefs = document.querySelectorAll('.cardAuthor')

for (let image of images) {
    image.addEventListener('click', function () {
        window.location.href = image.querySelector('.link_image').getAttribute("href")
    })
}

for (let card of cards) {
    card.addEventListener('click', function () {
        window.location.href = card.querySelector(".link_title").getAttribute("href")
    })
}
for (let chef of chefs) {
    chef.addEventListener('click', function () {
        window.location.href = chef.querySelector('.link_chef').getAttribute("name")
    })
}

const Show = {
    showRecipe(e) {
        // for (let image of images) {
            alert(
            window.location.href = e
           )
        // }
    }
}