const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const userValidator = require('../app/validators/user')
const { onlyUsers, onlyAdmin } = require('../app/middlewares/session')

routes.get('/', onlyUsers, onlyAdmin, UserController.list) 
routes.get('/create', onlyUsers, onlyAdmin, UserController.create) 
routes.get('/:id', onlyUsers, onlyAdmin, UserController.show) 
routes.get('/:id/edit', onlyUsers, onlyAdmin, UserController.edit) 

routes.post('/', onlyUsers, onlyAdmin, userValidator.post, UserController.post)
routes.put('/', onlyUsers, onlyAdmin, userValidator.put, UserController.put) 
routes.delete('/', onlyUsers, onlyAdmin, userValidator.userDelete, UserController.delete) 

module.exports = routes
