const express = require('express')
const routes = express.Router()

const Home = require('./home')
const Recipes = require('./recipes')
const Chefs = require('./chefs')
// const Profiles = require('./profiles')
const Users = require('./users')



// === ROTA PARA A PAGINA HOME ===
routes.use("/", Home)

routes.use('/users', Users) 
// routes.use('/admin/profile', Profiles)
routes.use('/admin/recipes', Recipes)
routes.use('/admin/chefs', Chefs)

routes.get("/recipes/index", function(req, res){
    return res.redirect("/admin/recipes")
}) 

routes.get("/chefs/index", function(req, res){
    return res.redirect("/admin/chefs")
})  

routes.get('/accounts', function(req, res){
    return res.redirect("/users/login")
})
module.exports = routes