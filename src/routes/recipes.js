const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')
const { onlyUsers } = require('../app/middlewares/session')
const recipeValidator = require('../app/validators/recipes')

routes.get('/', onlyUsers, RecipesController.index)
routes.get('/create', onlyUsers, RecipesController.create)
routes.get('/:id', onlyUsers, RecipesController.show)
routes.get('/:id/edit', onlyUsers, recipeValidator.put, RecipesController.edit)

routes.post('/', multer.array("photos", 5), onlyUsers, recipeValidator.post, RecipesController.post)
routes.put('/', multer.array("photos", 5), onlyUsers, RecipesController.put)
routes.delete('/', onlyUsers, RecipesController.delete)

module.exports = routes    