const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')
const home = require('./home')



// === ROTA PARA A PAGINA HOME ===
routes.use("/", home)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

routes.get("/recipes/index", function(req, res){
    return res.redirect("/admin/recipes")
}) 

routes.get("/chefs/index", function(req, res){
    return res.redirect("/admin/chefs")
})  
module.exports = routes