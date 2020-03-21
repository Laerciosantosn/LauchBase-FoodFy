const { unlinkSync } = require('fs')
const Chefs = require('../models/chefs')
const Recipes = require('../models/recipes')
const RecipeFiles = require('../models/recipesFile')
const File = require('../models/file')

module.exports = {
    async index(req, res) { 
        // Inicio do paginate
        let { page, limit } = req.query
      
            page = page || 1
            limit = limit || 2
            let offset = limit * (page - 1)
        
        let pagination
        let chefsResult

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
        
        const chefsAll = await Chefs.all()
      
        chefsResult =  await Chefs.allchefs(chefsAll.file_id)
      
         chefsResult = await chefsResult.map(file => ({
                ... file,
                src: `${file.path.replace("public","")}`
        }))
        
        return res.render("admin/chefs/index", { chefs: chefsResult, pagination })
    
    },
    create(req, res) {

        return res.render("admin/chefs/create")

    },
    async post(req, res) {
           
        if (req.body.name == "") {
            return res.send("Please, fill all filds")
        }
    
        if(req.file.lenght == 0) {
            return res. send('Please, send at last image!')
        }

        const resultFile = await File.create(req.file)
        const fileId = resultFile
     
       
        const resultChef = await Chefs.create({...req.body, file_id: fileId})
        const chefId = resultChef.rows[0].id
              
        return res.redirect(`chefs`)
    },
    async show(req, res) {
       
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
        
    },
    async edit(req, res) {
  
        const chef = await Chefs.find(req.params.id)
                      
        const fileResults = await Chefs.file(chef.file_id)
        let file =  [fileResults]
        
        file = file.map(file => ({
           ...file,
           src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
        }))
       
        return res.render("admin/chefs/edit", { chef, file })

    },
    async put(req, res) {

        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == '' && key != 'removed_files'){
                return res.send('Preenca todos os campos')
            }
        }

        // if(req.files.lenght == 0){
        //     return res.send('Please, send at last image!')
        // }
    
        // if (req.body.image == "") {
        //     return res.send("Please, fill all filds")
        // }
        // if (req.body.title == "") {
        //     return res.send("Please, fill all filds")
        // }
        console.log(req.body)
        console.log(req.file)

        // if (req.file.length != 0) {
        //     const newFilesPromise = req.files.map(file =>
        //         File.create({ ...file, product_id: req.body.id }))
        //     await Promise.all(newFilesPromise)
        // }

        // if (req.body.removed_files) {

        //     const removedFiles = req.body.removed_files.split(",")
        //     const lastIndex = removedFiles.length - 1
        //     removedFiles.splice(lastIndex, 1)

        //     const removedFilesPromise = removedFiles.map(id => File.delete(id))
        //     await Promise.all(removedFilesPromise)
        // }


       



        // await Chefs.update(req.body)

        // Chefs.update(req.body, function(){
        //     return res.redirect(`chefs/${req.body.id}`)
        // })

    },
    async delete(req, res) {
     
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
    }
}