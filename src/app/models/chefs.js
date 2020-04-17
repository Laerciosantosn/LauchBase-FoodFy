const db = require('../../config/db')

const Base = require('./base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async allchefs(){
        try {
            const query = `
                SELECT chefs.*, (SELECT path  FROM files WHERE chefs.file_id = files.id) AS path, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id
            `
            let results = await db.query(query)
            
            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async findchef(file_id, id){
        try {
            let results = await db.query(`SELECT *, 
                (SELECT path FROM files WHERE id = $1) AS path FROM chefs WHERE id = $2`, 
                [file_id, id])
        
            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
     },
    async findAnTotalRecipe(id){
        try {
            const query = `
                SELECT chefs.*, count(recipes) AS total_recipes 
                FROM chefs 
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
                `
            const values = [ id ] 
            const results = await db.query(query, values)
            
            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
    },
    async recipesChef({id}){
        try {
            const query = `SELECT chefs.*, recipes.image, recipes.title, recipes.id
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            `
            const values = [id]

            const results = await db.query(query, values)
            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
} 