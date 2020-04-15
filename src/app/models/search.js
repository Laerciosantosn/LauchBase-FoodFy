const db = require('../../config/db')

module.exports = {
    async findRecipes(filter){
        // console.log(filter)
        // console.log(file_id)
        try {
        
            // const query = `
            //     SELECT recipe_files.id AS recipe_files_id, chefs.name AS chef, recipes. *,  files.name, files.path 
            //     FROM recipe_files 
            //     LEFT JOIN files ON (files.id = recipe_files.file_id)
            //     LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            //     LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            //     WHERE recipes.title ILIKE '%${filter}%'
            //     ORDER BY title ASC
            // `
            const query = `
                SELECT recipes.*, chefs.name AS chef
                FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.title ILIKE '%${filter}%'
                ORDER BY title ASC 
            `
            const results = await db.query(query)
            return results.rows
            // db.query(`
            //     SELECT recipes.*, chefs.name AS chef
            //     FROM recipes
            //     LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            //     WHERE recipes.title ILIKE '%${filter}%'
            //     ORDER BY title ASC`, function (err, results) {
            //     if (err) throw `Database Error! ${err}`
            //     callback(results.rows)
            // })
        } catch (error) {
            console.error(error)
        }
    }
}