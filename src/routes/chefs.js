const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/ChefsController')

    
routes.get('/', ChefsController.index)
routes.get('/create', ChefsController.create)
routes.get('/:id', ChefsController.show)
routes.get('/:id/edit', ChefsController.edit)

routes.post('/', multer.single('photo'), ChefsController.post)
routes.put('/', multer.array("photo", 1), ChefsController.put)
routes.delete('/', ChefsController.delete)

module.exports = routes