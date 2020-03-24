const { unlinkSync } = require('fs')
const Chefs = require('../models/chefs')
const Recipes = require('../models/recipes')
const RecipeFiles = require('../models/recipesFile')
const File = require('../models/file')

module.exports = {
    async index(req, res) { 
       try {
            // Inicio do paginate
            let { page, limit } = req.query
        
                page = page || 1
                limit = limit || 2
                let offset = limit * (page - 1)
            
            let pagination
           
            const params = {  
                page,
                limit,
                offset,
                callback(chefs){
                    if(chefs[0]){
                        pagination = {
                            total: Math.ceil(chefs[0].total / limit),
                            page
                        }
                    }
                }
            }
            await Chefs.paginate(params)
            
            const chefsPromise =  await Chefs.allchefs()
            const Result = await Promise.all(chefsPromise)
            

            const chefs = await Result.map(file => ({
                ... file,
                src: `${file.path.replace("public","")}`
            }))
            return res.render("admin/chefs/index", { chefs, pagination })

        } catch (error) {
           console.error(error)
        }
    },
    create(req, res) {
        try {
            return res.render("admin/chefs/create")
        } catch (error) {
           console.error(error) 
        }
    },
    async post(req, res) {
        try {
            if (req.body.name == "") {
                return res.send("Please, fill all filds")
            }
        
            if(req.file.lenght == 0) {
                return res. send('Please, send at last image!')
            }

            const resultFile = await File.create(req.file)
            const fileId = resultFile
        
            await Chefs.create({...req.body, file_id: fileId})
            
            return res.redirect(`chefs`)

        } catch (error) {
            console.error(error)
        } 
    },
    async show(req, res) {
        try {
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

            return res.render("admin/chefs/show", { chef : chefResult, recipes: recipesResults})

        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
        const chef = await Chefs.find(req.params.id)

        if (!chef) return res.send("Chef not found!")
                 
        const fileResults = await Chefs.file(chef.file_id)

        let file =  [fileResults]
        
        file = file.map(file => ({
           ...file,
           src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
        }))
         
        return res.render("admin/chefs/edit", { chef, file })

        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
   
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == '' && key != 'removed_files'){
                return res.send('Preenca todos os campos')
            }
        }

        let file_id = req.body.file_id

        if (req.files.length != 0) {
            const file = await File.create(req.files[0])
            file_id = file.id
        }

        await Chefs.update(req.body.name, file_id, req.body.id)

        if (req.body.removed_files) {

            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
          

            const filePromise = removedFiles.map(id => File.all(id))
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
        return res.redirect(`chefs/${req.body.id}`)
    },
    async delete(req, res) {
        try {
            const chef = await Chefs.find(req.body.id)

            const file = await File.find(chef.file_id)

            if(chef.total_recipes == 0){

                await Chefs.delete(req.body.id)

                fileRemove = [file]
            
                fileRemove.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch(err) {
                        console.error(err)
                    }
                }) 
                await File.delete(file.id)

                return res.redirect(`chefs`)
            } else {
                return res.send("Chefs que possuem receitas não podem ser deletados")
            }

        } catch (error) {
            console.error(error)
        }
    }
}