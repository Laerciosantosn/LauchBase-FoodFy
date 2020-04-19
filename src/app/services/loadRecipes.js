const Recipes = require('../models/recipes')
const RecipeFiles = require("../models/recipesFile")

module.exports = {

  async loadfiles(recipes) {
   
    let recipePromise = recipes.map(recipe => RecipeFiles.findOne({
      where: { recipe_id: recipe.id }
    }))
    const result = await Promise.all(recipePromise)

    const filePromise = result.map(recipeFile => Recipes.recipAndFile(recipeFile.file_id, recipeFile.recipe_id))
    let fileResult = await Promise.all(filePromise)

    recipes = await fileResult.map(file => ({
      ...file,
      src: `${file.path.replace("public", "")}`
    }))
    return recipes
  }


  
}