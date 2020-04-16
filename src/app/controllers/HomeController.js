const Recipes = require('../models/recipes')
const Chefs = require('../models/chefs')
const RecipeFiles = require("../models/recipesFile")
const File = require("../models/file")

module.exports = {
    async index(req, res) {
        try {
            let recipesResults = await Recipes.all()
            
            const recipePromise = recipesResults.map( recipe => RecipeFiles.findOne({
                where: { recipe_id: recipe.id }
            }))
            const result =  await Promise.all(recipePromise)
            
            const filePromise = result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
            let fileResult =  await Promise.all(filePromise)

            recipesResults = await fileResult.map(file => ({
                ...file,
                src: `${file.path.replace("public","")}`
            }))
        
            const recipes = recipesResults
            .filter((recipes, index) => index > 5 ? false : true)
        
            return res.render("home/Index", { recipes })

        } catch (error) {
            console.error(error)
        }
    },
    async recipes(req, res) {
        try {
            let recipes = await Recipes.all()
        
            const recipePromise = recipes.map( recipe => RecipeFiles.findOne({
                where: { recipe_id: recipe.id }
            }))
            const Result =  await Promise.all(recipePromise)
        
            const filePromise = Result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
            let fileResult =  await Promise.all(filePromise)

            recipes = await fileResult.map(file => ({
                ...file,
                src: `${file.path.replace("public","")}`
            }))

            return res.render("home/Recipes/Index", { recipes })
        } catch (error) {
            console.error(error)
        }
    },
    async ShowRecipe(req, res) {
        try {
            let recipe = await Recipes.find(req.params.id)
        
            if (!recipe) return res.send("Product not found!")

            const recipeFiles = await RecipeFiles.findAll({
                where: { recipe_id: recipe.id }
            })

            filePromise = await recipeFiles.map(file => (File.findOne({
                where: { id: file.file_id }
            })))
            let files = await Promise.all(filePromise)
           
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            
            return res.render("home/Recipes/Show", { recipe, files})

        } catch (error) {
            console.error(error)
        }
    },
    async chefs(req, res) {
        try {
            // const chefsAll = await Chefs.all()
        
           let chefs =  await Chefs.allchefs()
    
           chefs = await chefs.map(file => ({
                ... file,
                src: `${file.path.replace("public","")}`
            }))
           
            return res.render("home/Chefs/Index", { chefs })

        } catch (error) {
            console.error(error)
        }
    },
    async ShowChef(req, res) {
        try {
          const { id } = req.params

            const chef =  await Chefs.findAnTotalRecipe(id)
           
            let chefResult = await Chefs.findchef(chef.file_id, chef.id)
        
            chefResult = {
                ... chefResult,
                src: `${chefResult.path.replace("public","")}`,
                total_recipes: chef.total_recipes
            }
            
            let recipesResults = await Recipes.recipesChef(chefResult.id)
        
            const recipePromise = recipesResults.map( recipe => RecipeFiles.findOne({
                where: { recipe_id: recipe.id }
            }))
            const Result =  await Promise.all(recipePromise)
          
            const filePromise = Result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
            let fileResult =  await Promise.all(filePromise)
           
            recipesResults = await fileResult.map(file => ({
                ...file,
                src: `${file.path.replace("public","")}`
            }))
           
            return res.render("home/Chefs/Show", { chef: chefResult, recipes: recipesResults })

        } catch (error) {
            console.error(error)
        }
    },
}

  