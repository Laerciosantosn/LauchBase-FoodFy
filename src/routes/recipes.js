const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')
const { onlyUsers } = require('../app/middlewares/session')

routes.get('/', onlyUsers, RecipesController.index)
routes.get('/create', onlyUsers, RecipesController.create)
routes.get('/:id', onlyUsers, RecipesController.show)
routes.get('/:id/edit', onlyUsers, RecipesController.edit)

routes.post('/', multer.array("photos", 5), onlyUsers, RecipesController.post)
routes.put('/', multer.array("photos", 5), onlyUsers, RecipesController.put)
routes.delete('/', onlyUsers, RecipesController.delete)

module.exports = routes    