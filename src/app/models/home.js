const db = require('../../config/db')

module.exports = {
    all(callback) {

        db.query(`SELECT recipes.*, chefs.name AS author
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)`, 
        function (err, results) {
            if (err) throw `Database Error! ${err}`
            callback(results.rows)
        })
    },
    findRecipes(filter, callback){
        db.query(`
            SELECT recipes.*, chefs.name AS author
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY title ASC`, function (err, results) {
            if (err) throw `Database Error! ${err}`
            callback(results.rows)
        })
    }
}