const Chefs = require('../models/chefs')
const File = require('../models/file')

async function chefDelete(req, res, next) {
  const { total_recipes }= req.body

 if(total_recipes > 0){
  const chef = await Chefs.findAnTotalRecipe(req.body.id)

  if (!chef) return res.send("Chef not found!")
         
  
  const id =  chef.file_id
  
  let file =  await File.findOne({
    where: { id }
  })
 
  file =  [file]
  
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