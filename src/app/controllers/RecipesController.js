const { unlinkSync } = require('fs')

const Recipes = require('../models/recipes')
const File = require("../models/file")
const RecipeFiles = require("../models/recipesFile")

module.exports = {
    async index(req, res) {
        try {
            let recipes = ""
            
            if (req.session.userAdmin == false) {
                const user_id = req.session.userId
                recipes =  await Recipes.findAll({
                    where: { user_id },
                })
            }

            if (req.session.userAdmin == true) {
                recipes = await Recipes.all()
            }

            const recipePromise = recipes.map(recipe => RecipeFiles.findOne({
                where: { recipe_id: recipe.id }
            }))

            const result = await Promise.all(recipePromise)

            const filePromise = result.map(recipeFile => Recipes.recipAndFile(recipeFile.file_id, recipeFile.recipe_id))
            let fileResult = await Promise.all(filePromise)

            recipes = await fileResult.map(file => ({
                ...file,
                src: `${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/index", { recipes: recipes })

        } catch (error) {
            console.error(error)
        }    
    },
    async create(req, res) {
        try {
            const chefOptions = await Recipes.chefSelectOptions()

            return res.render("admin/recipes/create", { chefOptions } )

         } catch (error) {
            console.error(error)
        }   
    },
    async post(req, res) {
        try {
            req.body.user_id = req.session.userId
       
            let resultsRecipe = await Recipes.createWithArray(req.body)
            
            const recipetId = resultsRecipe.rows[0].id

            const resultsFiles = req.files.map(files => File.create({
                name: files.filename,
                path: files.path
            }))

            const fileId = await Promise.all(resultsFiles)

            const filesPromise = await fileId.map(file => RecipeFiles.create(
                { recipe_id: recipetId, file_id: file.id }))

            await Promise.all(filesPromise)

           const chefOptions = await Recipes.chefSelectOptions()

            return res.render("admin/recipes/create", { 
                chefOptions,
                success: "Recipes successfully created "
            })
        } catch (err) {
            console.error(err)
        }
    },
    async show(req, res) {
        let { id } = req.params
        try {
            let recipe = await Recipes.findOne({
                where: {id}
            })

            if (!recipe) return res.send("Product not found!")

            const recipe_id = recipe.id

            const recipeFiles = await RecipeFiles.findAll({
                where: {recipe_id}
            })
            
            filePromise = await recipeFiles.map(file => (File.findOne({
                where:  { id: file.file_id} 
            })))

            let files = await Promise.all(filePromise)

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
        
            return res.render("admin/recipes/show", { recipe, files })

        } catch (error) {
            console.error(error)
        }    
    },
    async edit(req, res) {
        try {
            let recipe = await Recipes.findOne({ 
                where : { id: req.params.id }
            })
        
            if (!recipe) return res.send("Product not found!")

            const chefOptions = await Recipes.chefSelectOptions()

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

            return res.render("admin/recipes/edit", { recipe, chefOptions, files })

        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "information" && key != "removed_files") {
                    return res.send("Preencha todos os campos")
                }
            }
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file =>
                    File.create(
                        { name: file.filename, path: file.path }
                    )
                )
                const file = await Promise.all(newFilesPromise)

                const filesPromise = file.map(file => RecipeFiles.create(
                    { recipe_id: req.body.id, file_id: file.id }))
                await Promise.all(filesPromise)
            }

            if (req.body.removed_files) {

                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedRecipeFilesPromise = removedFiles.map(id => RecipeFiles.delete(id))
                await Promise.all(removedRecipeFilesPromise)

                const filePromise = removedFiles.map(id => File.findOne({
                    where:  { id } 
                }))

                const file = await Promise.all(filePromise)

                fileRemove = file

                fileRemove.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (err) {
                        console.error(err)
                    }
                })

                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }

            await Recipes.updateWhitArray(req.body)

            return res.redirect(`recipes/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            const recipeFiles = await RecipeFiles.findAll({
                where: { recipe_id: req.body.id }
            })

            let filesPromise = recipeFiles.map(file => File.findOne({
                where: { id: file.file_id }
            }))
            let file = await Promise.all(filesPromise)

            const recipePromise = recipeFiles.map(file => RecipeFiles.delete(file.file_id))
            await Promise.all(recipePromise)

            await Recipes.delete(req.body.id)

            filesPromise = recipeFiles.map(file => File.delete(file.file_id))
            await Promise.all(filesPromise)

            fileRemove = file
            fileRemove.map(file => {
                try {
                    unlinkSync(file.path)
                } catch (err) {
                    console.error(err)
                }
            })

            return res.redirect(`recipes`)

        } catch (error) {
            console.error(error)
        }
    }
}