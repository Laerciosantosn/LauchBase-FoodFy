const express = require('express')
const routes = express.Router()

const ChefsController = require('../app/controllers/ChefsController')

    
routes.get('/', ChefsController.index)
routes.get('/create', ChefsController.create)
routes.get('/:id', ChefsController.show)
routes.get('/:id/edit', ChefsController.edit)

routes.post('/', ChefsController.post)
routes.put('/', ChefsController.put)
routes.delete('/', ChefsController.delete)

module.exports = routes