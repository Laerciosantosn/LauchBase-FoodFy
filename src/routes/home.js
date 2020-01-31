const express = require('express')
const routes = express.Router(express)

const HomeController = require('../app/controllers/HomeController')


routes.get("/search", HomeController.search)

routes.get("/", HomeController.index)
routes.get("/about", HomeController.about)
routes.get("/recipes", HomeController.recipes)
routes.get("/recipe/:id", HomeController.ShowRecipe)
routes.get("/chefs", HomeController.chefs)
routes.get("/chef/:id", HomeController.ShowChef)

module.exports = routes