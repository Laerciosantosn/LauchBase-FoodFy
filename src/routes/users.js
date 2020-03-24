const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

routes.get('/login', SessionController.indexLogin) 
routes.get('/forgot-password', SessionController.indexForgotPassword) 
routes.get('/password-reset', SessionController.indexResetPassword) 


// routes.get('/', UserController.list) 
// routes.post('/', UserController.post) 
// routes.put('/', UserController.put) 
// routes.delete('/', UserController.delete) 

module.exports = routes
