const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/ChefsController')
const { onlyUsers, onlyAdmin } = require('../app/middlewares/session')
const chefValidator = require('../app/validators/chef')

routes.get('/', onlyUsers, ChefsController.index)
routes.get('/create', onlyUsers, onlyAdmin, ChefsController.create)
routes.get('/:id', onlyUsers, ChefsController.show)
routes.get('/:id/edit', onlyUsers, onlyAdmin, ChefsController.edit)

routes.post('/', multer.single('photo'), onlyUsers, onlyAdmin, ChefsController.post)
routes.put('/', multer.array("photo", 1), onlyUsers, onlyAdmin, ChefsController.put)
routes.delete('/', onlyUsers, onlyAdmin, chefValidator.chefDelete, ChefsController.delete)

module.exports = routes