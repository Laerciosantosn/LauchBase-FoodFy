const Recipes = require('../models/recipes')
const File = require("../models/file")


module.exports = {
    index(req, res) {
        Recipes.all(function (receitas) {
           return res.render("admin/recipes/index", { receitas })
        })
    },
    create(req, res) {

        Recipes.chefSelectOptions(function(options){
            return res.render("admin/recipes/create",  { chefOptions: options })
        })

    },  
    async post(req, res) {
 
        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == ''){
                return res.send('Preenca todos os campos')
            }
        }

        if(req.files.lenght == 0){
            return res.send('Please, send at last image!')
        }
        
        let resultsRecipe = await Recipes.create(req.body)
        const recipetId = resultsRecipe.rows[0].id

        // let resultsFile = req.files.map(file => File.create({...file }))

        const filesPromise = req.files.map(file => File.create({...file }))

        await Promise.all(filesPromise)
        const filetId = resultsRecipe.rows[0].id
        // ===CONTINUAR A LOGICA CRIAR EM FILE O createRecipeFiles
        File.createRecipeFiles(recipetId, filetId)

        return res.redirect(`recipes`)
    },
    show(req, res) {
        Recipes.find(req.params.id, function(receita){
            if (!receita) {
                return res.send('Receita não encontrada')
            }
            return res.render("admin/recipes/show", { receita })
        })
    },
    edit(req, res) {
        Recipes.find(req.params.id, function(receita){
            if (!receita) {
                return res.send('Receita não encontrada')
            }
            Recipes.chefSelectOptions(function(options){
                return res.render("admin/recipes/edit",  { receita, chefOptions: options })
            })
            // return res.render("admin/recipes/edit", { receita })
        })
    },
    put(req, res) {
    
        if (req.body.image == "") {
            return res.send("Please, fill all filds")
        }
        if (req.body.title == "") {
            return res.send("Please, fill all filds")
        }

        Recipes.update(req.body, function(){
            return res.redirect(`recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Recipes.delete(req.body.id, function(){
            return res.redirect(`recipes`)
        })
    }
}