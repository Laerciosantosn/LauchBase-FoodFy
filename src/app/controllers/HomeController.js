const Recipes = require('../models/recipes')
const Chefs = require('../models/chefs')
const Home = require('../models/home')
const RecipeFiles = require("../models/recipesFile")

module.exports = {
    async index(req, res) {
        
        let recipesResults = await Recipes.all()
       
        const recipePromise = recipesResults.map( recipe => RecipeFiles.find(recipe.id))
        const result =  await Promise.all(recipePromise)

        const filePromise = result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
        let fileResult =  await Promise.all(filePromise)

        recipesResults = await fileResult.map(file => ({
            ...file,
            src: `${file.path.replace("public","")}`
        }))
       
        const recipes = []
        const numberMaxofCardsInHome = 3;
        for (let index = 0; index < recipesResults.length; index++) {
            if (index < numberMaxofCardsInHome) {
                recipes.push(recipesResults[index])
            }
        }
      
        return res.render("home/Index", { recipes })

    },
    about(req, res) {

        return res.render("home/About/index")

    },
    async recipes(req, res) {

        let recipesResults = await Recipes.all()
       
        const recipePromise = recipesResults.map( recipe => RecipeFiles.find(recipe.id))
        const Result =  await Promise.all(recipePromise)
      
        const filePromise = Result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
        let fileResult =  await Promise.all(filePromise)

        recipesResults = await fileResult.map(file => ({
            ...file,
            src: `${file.path.replace("public","")}`
        }))

        return res.render("home/Recipes/Index", { recipes: recipesResults })
        
    },
    async ShowRecipe(req, res) {
        let recipesResults = [await Recipes.find(req.params.id)]
        const recipePromise = recipesResults.map( recipe => RecipeFiles.find(recipe.id))
        const Result =  await Promise.all(recipePromise)
      
        const filePromise = Result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
        let fileResult =  await Promise.all(filePromise)

        
        recipesResults = await fileResult.map(file => ({
            ...file,
            src: `${file.path.replace("public","")}`
        }))
      
        return res.render("home/Recipes/Show", { recipe: recipesResults[0] })
    },
    async chefs(req, res) {

        const chefsAll = await Chefs.all()
      
        chefsResult =  await Chefs.allchefs(chefsAll.file_id)
   
         chefsResult = await chefsResult.map(file => ({
                ... file,
                src: `${file.path.replace("public","")}`
        }))

        return res.render("home/Chefs/Index", { chefs: chefsResult })
       
    },
    async ShowChef(req, res) {

        const chef =  await Chefs.find(req.params.id)

        let chefResult = await Chefs.findchef(chef.file_id, chef.id)
      
         chefResult = {
                ... chefResult,
                src: `${chefResult.path.replace("public","")}`,
                total_recipes: chef.total_recipes
        }
          
        let recipesResults = await Recipes.recipesChef(chefResult.id)
       
        const recipePromise = recipesResults.map( recipe => RecipeFiles.recipeChef(recipe.id))
        const Result =  await Promise.all(recipePromise)
      
        const filePromise = Result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
        let fileResult =  await Promise.all(filePromise)

        recipesResults = await fileResult.map(file => ({
            ...file,
            src: `${file.path.replace("public","")}`
        }))
       
            return res.render("home/Chefs/Show", { chef: chefResult, recipes: recipesResults })

        // Chefs.find(req.params.id, function (chef) {
        //     if (!chef) {
        //         return res.send('Chef não encontrado')
        //     }
        //     Chefs.recipesChef(req.params.id,function(recipes){
                
        //         return res.render("home/Chefs/Show", { chef, recipes })
        //     })
        // })

    },
    search(req, res) {

        const { filter } = req.query
       
        if (filter) {
            Home.findRecipes(filter, function (receitas) {
                return res.render("home/Search/Index", { receitas, filter })
            })
        } else {
            Home.all(function (receitas) {
                return res.render("home/Search/Index", { receitas, filter })
            })
        }   
    }
}

  