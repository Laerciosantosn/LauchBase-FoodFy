const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const sessionValidator = require('../app/validators/session')
const { isLoggedRedirectToUsers } = require('../app/middlewares/session')


routes.get('/login', isLoggedRedirectToUsers, SessionController.indexLogin) 
routes.post('/login', sessionValidator.login, SessionController.login) 
routes.post('/logout', SessionController.logout) 

routes.get('/forgot-password', SessionController.indexForgotPassword) 
routes.get('/reset-password', SessionController.indexResetPassword) 
routes.post('/forgot-password', sessionValidator.forgot, SessionController.forgotPassword) 
routes.post('/reset-password', sessionValidator.reset, SessionController.resetPassword) 

module.exports = routes