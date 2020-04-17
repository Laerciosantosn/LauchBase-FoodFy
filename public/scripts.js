
const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for (item of menuItems) {

    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event, num) {

        this.uploadLimit = num

        console.log(this.uploadLimit)
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {

        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} photos`)
            event.preventDefault()
            return true
        }

        const photoDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photoDiv.push(item)
        })

        const totalPhotos = fileList.length + photoDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Voce atingiu o limite maximo de fotos")
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()

    }
}

const addNewImput = {

    addIngredient() {
        const ingredients = document.querySelector("#ingredients");
        const fieldContainer = document.querySelectorAll(".ingredient");

        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(
            true
        );
        newField.c
        if (newField.children[0].value == "") return false;

        newField.children[0].value = "";
        ingredients.appendChild(newField);
    },
    addPasso() {
        const passos = document.querySelector("#passos");
        const passoContainer = document.querySelectorAll(".passo");

        const newPasso = passoContainer[passoContainer.length - 1].cloneNode(
            true
        );

        if (newPasso.children[0].value == "") return false;

        newPasso.children[0].value = "";
        passos.appendChild(newPasso);
    }
}

function paginate(selectedPage, totalPage) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPage; currentPage++) {

        const firsAndLastPage = currentPage == 1 || currentPage == totalPage
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firsAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }
            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)

            }
            pages.push(currentPage)

            oldPage = currentPage
        }
    }
    return pages
}

function createPagination(pagination) {

    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")


if (pagination) {
    createPagination(pagination)
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    preview: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.preview.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')
        ImageGallery.highlight.src = target.src
    }
}
const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error) {
            Validate.displayError(input, results.error)
        }
    },
    displayError(input, error) {
        const inputEmail = document.getElementById('email')
        inputEmail.classList.add('erroremail')

        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)

        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")

        const inputEmail = document.getElementById('email')
        inputEmail.classList.remove('erroremail')

        if (errorDiv) {
            errorDiv.remove()
        }
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) {
            error = "Invalid email"
        }

        return {
            error,
            value
        }
    }
}


function confirmDelete(event) {
    const confirmation = confirm("Want to delete?")
    if (!confirmation) {
        event.preventDefault()
    }
}


