// const Home = require('../models/home')
const Search = require('../models/search')
const Recipes = require('../models/recipes')
const RecipeFiles = require("../models/recipesFile")


module.exports = {
  async index(req, res) {
    try {

      let { filter, page, limit } = req.query

      page = page || 1
      limit = limit || 1
      let offset = limit * (page - 1)

      let pagination

      const params = {
        filter,
        page,
        limit,
        offset,
        callback(recipes) {
          if (recipes[0]) {
              pagination = {
              total: Math.ceil(recipes[0].total / limit),
              page
            }
          }
        }
      }
      await Recipes.paginate(params)

      let recipes = await Recipes.all()

      let recipePromise = recipes.map(recipe => RecipeFiles.find(recipe.id))
      const Result = await Promise.all(recipePromise)

      const filePromise = Result.map(recipeFile => Recipes.recipAndFile(recipeFile.file_id, recipeFile.recipe_id))
      let fileResult = await Promise.all(filePromise)

      recipes = await fileResult.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
      }))

      // const { filter } = req.query

      if (filter) {
        const filterResult = await Search.findRecipes(filter)

        recipePromise = filterResult.map(recipe => RecipeFiles.find(recipe.id))
        let filtered = await Promise.all(recipePromise)

        const recipAndFilePromise = filtered.map(recipeFile => Recipes.recipAndFile(recipeFile.file_id, recipeFile.recipe_id))
        let recipAndFileResult = await Promise.all(recipAndFilePromise)

        recipes = await recipAndFileResult.map(file => ({
          ...file,
          src: `${file.path.replace("public", "")}`
        }))

        return res.render("home/Search/Index", { recipes, pagination, filter })

      } else {

        return res.render("home/Search/Index", { recipes, filter, pagination })

      }
    } catch (error) {
      console.error(error)
    }
  }

}