const Search = require('../models/search')

const LoadRecipes = require("../services/loadRecipes")

module.exports = {
  async index(req, res) {
    try {

      let { filter, page, limit } = req.query
      
      page = page || 1
      limit = limit || 6
      let offset = limit *(page -1 )

      const params = {
        filter,
        page,
        limit,
        offset,
      }
            
      let recipes = await Search.paginate(params)
          
      const pagination = {
        total:  Math.ceil(recipes[0].total / limit),
        page
      } 
      
      recipes = await LoadRecipes.loadfiles(recipes)


      // let recipePromise = recipeResults.map(recipe => RecipeFiles.findOne({
      //   where: { recipe_id: recipe.id }
      // }))
      // const Result = await Promise.all(recipePromise)

      // const filePromise = Result.map(recipeFile => Recipes.recipAndFile(recipeFile.file_id, recipeFile.recipe_id))
      // let fileResult = await Promise.all(filePromise)

      // recipes = await fileResult.map(file => ({
      //   ...file,
      //   src: `${file.path.replace("public", "")}`
      // }))

        return res.render("home/Search/Index", { recipes, filter, pagination })

    } catch (error) {
      console.error(error)
    }
  }

}