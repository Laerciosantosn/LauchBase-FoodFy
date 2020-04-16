const Chefs = require('../models/chefs')
const File = require('../models/file')

function checkAllFields(body){
  const keys = Object.keys(body)

  for(key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: 'Please fill all fields!'
      }
    }
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  
  if(fillAllFields) {
    
    return res.render('admin/chefs/create', { 
    error: "Please fill all fields!"})
  }

  if (!req.file) {
 
    return res.render('admin/chefs/create', { 
      error: "Please, send at last image!"})
  }
  
  next()

}

// async function put(req, res, next) {
//   const fillAllFields = checkAllFields(req.body)
// const keys = Object.keys(req.body)

// for(key of keys){
//     if(req.body[key] == '' && key != 'removed_files'){
//         return res.send('Fill all fields')
//     }
// }
//   if(fillAllFields) {
    
//     return res.render('admin/chefs/create', { 
//     error: "Please fill all fields!"})
//   }

//   if (!req.file) {
 
//     return res.render('admin/chefs/create', { 
//       error: "Please, send at last image!"})
//   }
  
//   next()

// }

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
  post,
  // put,
  chefDelete
}