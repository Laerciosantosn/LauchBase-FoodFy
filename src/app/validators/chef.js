const Chefs = require('../models/chefs')

async function chefDelete(req, res, next) {
  const { total_recipes }= req.body

 if(total_recipes > 0){
  const chef = await Chefs.find(req.body.id)

  if (!chef) return res.send("Chef not found!")
           
  const fileResults = await Chefs.file(chef.file_id)

  let file =  [fileResults]
  
  file = file.map(file => ({
     ...file,
     src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
  }))
   
  return res.render("admin/chefs/edit", { 
    chef, 
    file,
    error: "Chefs who have recipes cannot be deleted"
  })
 }

  next()
}

module.exports = {
  chefDelete
}