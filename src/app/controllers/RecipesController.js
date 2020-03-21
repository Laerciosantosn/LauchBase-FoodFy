const { unlinkSync } = require('fs')
const Recipes = require('../models/recipes')
const File = require("../models/file")
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
        
        return res.render("admin/recipes/index", { recipes: recipesResults })
    },
    async create(req, res) {
        const chefOptions = await Recipes.chefSelectOptions()
            
        return res.render("admin/recipes/create",  { chefOptions})
    },  
    async post(req, res) {
        try{

        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == '' && key != "information" ){
                return res.send('Preenca todos os campos')
            }
        }

        if(req.files.lenght == 0){
            return res.send('Please, send at last image!')
        }
        
        let resultsRecipe = await Recipes.create(req.body)
        const recipetId = resultsRecipe.rows[0].id 
       
        const resultsFiles = req.files.map(files => File.create(files))
        const fileId = await Promise.all(resultsFiles)
        
        const filesPromise = await fileId.map(file => RecipeFiles.create(
            { recipe_id: recipetId, file_id: file.id}))    
        
        await Promise.all(filesPromise)
        
        return res.redirect(`recipes`)
    }catch(err){
        console.error(err)
    }
    },
    async show(req, res) {
        let recipesResults = [await Recipes.find(req.params.id)]
        const recipePromise = recipesResults.map( recipe => RecipeFiles.find(recipe.id))
        const Result =  await Promise.all(recipePromise)
      
        const filePromise = Result.map( recipeFile => Recipes.recipAndFile( recipeFile.file_id, recipeFile.recipe_id))
        let fileResult =  await Promise.all(filePromise)
             
        recipesResults = await fileResult.map(file => ({
            ...file,
            src: `${file.path.replace("public","")}`
        }))
               
        return res.render("admin/recipes/show", { recipe: recipesResults[0] })

    },
    async edit(req, res) {
        // get recipe
        let recipe = await Recipes.find(req.params.id)
        // console.log(recipe)
        if (!recipe) return res.send("Product not found!")
        
        // get chefsOptions
        const chefOptions = await Recipes.chefSelectOptions()
        
    
        //  get images TROCAR find pra ALL
        const recipeFiles = await RecipeFiles.all(recipe.id)
       

        filePromise = await recipeFiles.map(file => (File.all(file.file_id)))
        let files = await Promise.all(filePromise)
        // results = await File.all(recipeFiles.file_id)
        
        // let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("admin/recipes/edit", { recipe, chefOptions, files })
    },
    async put(req, res) {
   
        const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == "" && key != "information" && key != "removed_files" ) {
                return res.send("Preencha todos os campos")
            }
        }
      
        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file =>
                File.create(
                    { ...file, product_id: req.body.id }
                )
            )
            const file = await Promise.all(newFilesPromise)
            
            const filesPromise = file.map(file => RecipeFiles.create(
                { recipe_id: req.body.id, file_id: file.id})) 
            await Promise.all(filesPromise)
        }

        if (req.body.removed_files) {

            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
              
            const removedRecipeFilesPromise = removedFiles.map(id => RecipeFiles.delete(id))
            await Promise.all(removedRecipeFilesPromise)

            const filePromise = removedFiles.map( id => File.all(id))
            const file = await Promise.all(filePromise)

            fileRemove = file
        
            fileRemove.map(file => {
                try {
                    unlinkSync(file.path)
                } catch(err) {
                    console.error(err)
                }
            })

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        await Recipes.update(req.body)

        return res.redirect(`recipes/${req.body.id}`)

    },
    async delete(req, res) {
        
        const recipeFiles = await RecipeFiles.all(req.body.id)
       
        let filesPromise = recipeFiles.map(file => File.all(file.file_id))
        let file = await Promise.all(filesPromise)

        const recipePromise = recipeFiles.map(file => RecipeFiles.delete(file.file_id))
        await Promise.all(recipePromise)
        await Recipes.delete(req.body.id)
            
       
// fazer o delete dos recipeFiles
// fazer o delete dos files

filesPromise = recipeFiles.map(file => File.delete(file.file_id))
await Promise.all(filesPromise) 

// fazer o unlinksys
fileRemove = file
fileRemove.map(file => {
        try {
                unlinkSync(file.path)
            } catch(err) {
                    console.error(err)
                }
            })
            
            
            
            
            // delete os recipes
            
        return res.redirect(`recipes`)

        // Recipes.delete(req.body.id, function(){
        //     return res.redirect(`recipes`)
        // })
    }
}