const Search = require('../models/search')
const Recipes = require('../models/recipes')
const RecipeFiles = require("../models/recipesFile")

module.exports = {
  async index(req, res) {
    try {

      let { filter, page, limit } = req.query
      
      page = page || 1
      limit = limit || 2
      let offset = limit *(page -1 )

      const params = {
        filter,
        page,
        limit,
        offset,
      }

      const recipeResults = await Search.paginate(params)

      let recipePromise = recipeResults.map(recipe => RecipeFiles.findOne({
        where: { recipe_id: recipe.id }
      }))
      const Result = await Promise.all(recipePromise)

      const filePromise = Result.map(recipeFile => Recipes.recipAndFile(recipeFile.file_id, recipeFile.recipe_id))
      let fileResult = await Promise.all(filePromise)

      recipes = await fileResult.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
      }))

        return res.render("home/Search/Index", { recipes, filter })

    } catch (error) {
      console.error(error)
    }
  }

}