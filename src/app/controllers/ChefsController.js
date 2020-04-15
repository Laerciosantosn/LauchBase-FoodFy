const { unlinkSync } = require('fs')
const Chefs = require('../models/chefs')
const Recipes = require('../models/recipes')
const RecipeFiles = require('../models/recipesFile')
const File = require('../models/file')

module.exports = {
    async index(req, res) { 
       try {
            
            const chefsPromise =  await Chefs.allchefs()
            const Result = await Promise.all(chefsPromise)
            
            const chefs = await Result.map(file => ({
                ... file,
                src: `${file.path.replace("public","")}`
            }))

            return res.render("admin/chefs/index", { chefs })

        } catch (error) {
           console.error(error)
        }
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    async post(req, res) {
        try {
            const { name, id } =req.body
            if (req.body.name == "") {
                return res.send("Please, fill all filds")
            }
        
            if(req.file.lenght == 0) {
                return res. send('Please, send at last image!')
            }
           
            const { filename, path } = req.file
            const dataFile = {
                name: filename,
                path
            } 
          
            const resultFile = await File.create(dataFile)
            const file_id = resultFile.id
            
            const data = { name, file_id}

            await Chefs.create(data)
            
            return res.render("admin/chefs/create", {
                success: "Account successfully created "
            })

        } catch (error) {
            console.error(error)
            return res.render("admin/chefs/create", {
                users,
                error: "Something went wrong!"
            })
        } 
    },
    async show(req, res) {
        try {
            const chef =  await Chefs.findAnTotalRecipe(req.params.id)
       
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
        const chef = await Chefs.findAnTotalRecipe(req.params.id)

        if (!chef) return res.send("Chef not found!")
                 
        const fileResults = await File.find(chef.file_id)

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
        const { name, id } =req.body
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == '' && key != 'removed_files'){
                return res.send('Fill all fields')
            }
        }

        let file_id = req.body.file_id
        
       
        if (req.files.length != 0) {
            const { filename, path } = req.files[0]
            const dataFile = {
                name: filename,
                path
            } 
            const file = await File.create(dataFile)
            file_id = file.id
        }
        const data = { name, file_id}
        await Chefs.update(id, data)

        if (req.body.removed_files) {

            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
          

            const filePromise = removedFiles.map(id => File.findOne(
                {
                    where: { id }
                }
            ))
            const file = await Promise.all(filePromise)

            let fileRemove = file

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
            const chef = await Chefs.findAnTotalRecipe(req.body.id)
            
            const id =  chef.file_id
            
            let file =  await File.findOne({
                where: { id }
            })
            
            // const file = await File.find(chef.file_id)
            // console.log(chef)
            // if(chef.total_recipes == 0){

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
            // } else {
            //     return res.send("Chefs que possuem receitas não podem ser deletados")
            // }

        } catch (error) {
            console.error(error)
        }
    }
}