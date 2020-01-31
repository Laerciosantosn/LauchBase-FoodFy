const recipes = require('../models/recipes')
const chefs = require('../models/chefs')
const home = require('../models/home')

module.exports = {
    index(req, res) {

        home.all(function (recipes) {
            const receitas = []
            const numberMaxofCardsInHome = 3;
            for (let index = 0; index < recipes.length; index++) {
                if (index < numberMaxofCardsInHome) {
                    receitas.push(recipes[index])
                }
            }
            return res.render("home/Index", { receitas })
        })

    },
    about(req, res) {

        return res.render("home/About/index")

    },
    recipes(req, res) {

        home.all(function (receitas) {
            return res.render("home/Recipes/Index", { receitas })
        })
    },
    ShowRecipe(req, res) {
      
        recipes.find(req.params.id, function (receita) {
            if (!receita) {
                return res.send('Recipes not found!')
            }
            return res.render("home/Recipes/Show", { receita })
        })

    },
    chefs(req, res) {
        chefs.all(function (chefs) {
            return res.render("home/Chefs/Index", { chefs })
        })

    },
    ShowChef(req, res) {

        chefs.find(req.params.id, function (chef) {
            if (!chef) {
                return res.send('Chef não encontrado')
            }
            chefs.recipesChef(req.params.id,function(recipes){
                
                return res.render("home/Chefs/Show", { chef, recipes })
            })
        })

    },
    search(req, res) {

        const { filter } = req.query
       
        if (filter) {
            home.findRecipes(filter, function (receitas) {
                return res.render("home/Search/Index", { receitas, filter })
            })
        } else {
            home.all(function (receitas) {
                return res.render("home/Search/Index", { receitas, filter })
            })
        }   
    }
}

  