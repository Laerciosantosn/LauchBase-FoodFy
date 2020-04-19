const db = require('../../config/db')

module.exports = {
    async paginate(params){
        let {  filter, limit, offset } = params

        try {
            let query = "",
                filterQuery = "",
                totalQuery = `( SELECT count(*) FROM recipes ) AS total` 

            if( filter ) {
                filterQuery = `
                    WHERE recipes.title ILIKE '%${filter}%'
                `
                totalQuery = `
                    ( SELECT count(*) FROM recipes ${filterQuery} ) AS total
                `
            }

            query = `
            SELECT recipes.*, (SELECT chefs.name FROM chefs WHERE chefs.id = recipes.chef_id) AS chef, 
            ${totalQuery}
            FROM recipes
            LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
            ${filterQuery}
            GROUP BY recipes.id LIMIT $1 OFFSET $2
            `
            const results = await db.query(query, [limit, offset])
            
            return results.rows
         
        } catch (error) {
            console.error(error)
        }
    }
}