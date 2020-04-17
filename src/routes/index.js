const express = require('express')
const routes = express.Router()

const Home = require('./home')
const Recipes = require('./recipes')
const Chefs = require('./chefs')
const Profiles = require('./profiles')
const Users = require('./users')
const Session = require('./session')

routes.use("/", Home)

routes.use('/users', Session) 
routes.use('/admin/users', Users) 
routes.use('/admin/profile', Profiles)
routes.use('/admin/recipes', Recipes)
routes.use('/admin/chefs', Chefs)


routes.get('/accounts', function(req, res){
    return res.redirect("users/login")
})

routes.get('/about', function(req, res){
    return res.render("home/About/index")
})
module.exports = routes