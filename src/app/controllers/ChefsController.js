const chefs = require('../models/chefs')

module.exports = {
    index(req, res) { 

        chefs.all(function (chefs) {
            return res.render("admin/chefs/index", { chefs })
        })

    },
    create(req, res) {

        return res.render("admin/chefs/create")

    },
    post(req, res) {
 
        if (req.body.image == "") {
            return res.send("Please, fill all filds")
        }
        if (req.body.title == "") {
            return res.send("Please, fill all filds")
        }
        if (req.body.author == "") {
            return res.send("Please, fill all filds")
        }

        chefs.create(req.body, function(chef){
            return res.redirect(`chefs`)
        })

    },
    show(req, res) {

            chefs.find(req.params.id, function(chef){
            if (!chef) {
                return res.send('Chef não encontrado')
            }
            chefs.recipesChef(req.params.id,function(recipes){
                
                return res.render("admin/chefs/show", { chef, recipes })
            })
        })
        
    },
    edit(req, res) {

        chefs.find(req.params.id, function(chef){
            if (!chef) {
                return res.send('Chef não encontrado')
            }
            return res.render("admin/chefs/edit", { chef })
        })

    },
    put(req, res) {
    
        if (req.body.image == "") {
            return res.send("Please, fill all filds")
        }
        if (req.body.title == "") {
            return res.send("Please, fill all filds")
        }

        chefs.update(req.body, function(){
            return res.redirect(`chefs/${req.body.id}`)
        })

    },
    delete(req, res) {

        chefs.find(req.body.id, function(recipes){
            if(recipes.total_recipes == 0){
                chefs.delete(req.body.id, function(){
                    return res.redirect(`chefs`)
                })
            } else {
                // const notDelete = "Chefs que possuem receitas não podem ser deletados"
                // return res.redirect(`chefs/${req.body.id}/edit`,{notDelete})
                return res.send("Chefs que possuem receitas não podem ser deletados")
            }
        })
        

    }

}