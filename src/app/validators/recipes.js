const Recipes = require('../models/recipes')
const { compare } = require('bcryptjs')

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
async function put( req, res, next) {
  const { id } = req.params
  const { userId, userAdmin } = req.session

  if(userAdmin == false) {
    const recipe =  await Recipes.findOne({ where: { id } })

      if(userId !== recipe.user_id) {
        return res.redirect('/admin/profile')
      }
  }
  next()
}

module.exports = {
  post,
  put
}