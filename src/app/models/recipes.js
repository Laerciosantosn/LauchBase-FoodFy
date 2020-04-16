const { date } = require('../../lib/utils')
const db = require('../../config/db')

const Base = require('./base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async all() {
        try {
            const query = `
                SELECT recipes.*, chefs.name AS chef 
                FROM recipes 
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                ORDER BY created_at DESC
            `
            const results = await db.query(query)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async recipesChef(id) {
        try {

            const query = `
                SELECT recipes.*, chefs.name AS chef 
                FROM recipes 
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE chef_id = $1
            `
            const values = [id]

            const results = await db.query(query, values)

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async recipAndFile(file_id, recipe_id) {
        try {
            const query = `
                SELECT recipes.*, chefs.name AS chef,
                ( SELECT path FROM files WHERE id= $1) AS path
                FROM recipes 
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.id = $2
            `
            const values = [file_id, recipe_id]

            const results = await db.query(query, values)

            return results.rows[0]

        } catch (error) {
            console.error(error)
        }

    },
    // async findAll(filters) {
    //     try {
    //         let query = `SELECT * FROM recipes`

    //         Object.keys(filters).map(key => {
    //             // WHERE | OR | AND
    //             query = `${query}
    //         ${key}`

    //             Object.keys(filters[key]).map(field => {
    //                 query = `${query} ${field} = '${filters[key][field]}' ORDER BY created_at DESC`
    //             })
    //         })

    //         const results = await db.query(query)
    //         return results.rows
    //     } catch (error) {
    //         console.error(error)
    //     }

    // },
    // async find(id) {
    //     try {

    //         const query = `
    //             SELECT recipes.*, chefs.name AS chef 
    //             FROM recipes 
    //             LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    //             WHERE recipes.id = $1
    //         `
    //         const values = [id]
    //         const results = await db.query(query, values)
    //         return results.rows[0]
    //     } catch (error) {
    //         console.error(error)
    //     }

    // },
    createWithArray(data) {
        try {
           
            const query = `
                INSERT INTO recipes (
                    chef_id,
                    title,
                    ingredients,
                    preparation,
                    information,
                    user_id
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.user_id
            ]
            console.log(`${query}, ${values} `)
            return db.query(query, values)

        } catch (error) {
            console.error(error)
        }
    },
    updateWhitArray(data) {
        try {
           
            const query = `
                UPDATE recipes SET
                    chef_id=($1),
                    title=($2),
                    ingredients=($3),
                    preparation=($4),
                    information=($5)              
                WHERE id = $6
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.id
            ]
            return db.query(query, values)

        } catch (error) {
            console.error(error)
        }
    },
    // delete(id) {
    //     try {

    //         db.query(`DELETE FROM recipes WHERE id = $1`, [id])

    //     } catch (error) {
    //         console.error(error)
    //     }

    // },
    async chefSelectOptions() {
        try {

            const query = `SELECT name, id FROM chefs ORDER BY name ASC`
            const results = await db.query(query)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async paginate(params) {
        try {
            const { limit, offset, callback } = params

            query = `SELECT *, (SELECT count(*) FROM recipes) AS total FROM recipes
                LIMIT $1 OFFSET $2    
            `
            const values = [
                limit,
                offset
            ]

            const results = await db.query(query, values)

            callback(results.rows)
        } catch (error) {
            console.error(error)
        }
    },
}