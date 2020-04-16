const Recipes = require('../models/recipes')

function checkAllFields(body){
  const keys = Object.keys(body)

  for(key of keys) {
    if (body[key] == "" && key != "information") {
      return {
        user: body,
        error: 'Please fill all fields!'
      }
    }
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  
  const chefOptions = await Recipes.chefSelectOptions()
  if(fillAllFields) {
    
    return res.render('admin/recipes/create', { 
    chefOptions,
    error: "Please fill all fields!"})
  }

  if (!req.files[0]) {
 
    return res.render('admin/recipes/create', { 
      chefOptions,
      error: "Please, send at last image!"})
  }
  
  next()

}

async function edit(req, res, next) {

}

async function put(req, res, next) {

}

module.exports = {
  post
}