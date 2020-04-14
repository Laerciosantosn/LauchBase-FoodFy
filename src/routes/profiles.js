const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const { onlyUsers } = require('../app/middlewares/session')
const profileValidator = require('../app/validators/profile')


routes.get('/', onlyUsers, ProfileController.index)
routes.put('/', onlyUsers, profileValidator.put, ProfileController.put)

module.exports = routes
