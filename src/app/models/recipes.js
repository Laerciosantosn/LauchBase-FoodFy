const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
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
    async find(id) {
        try {

            const query = `
                SELECT recipes.*, chefs.name AS chef 
                FROM recipes 
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.id = $1
            `
            const values = [id]
            const results = await db.query(query, values)
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }

    },
    create(data) {
        try {

            const query = `
                INSERT INTO recipes (
                    chef_id,
                    title,
                    ingredients,
                    preparation,
                    information,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
            const values = [
                data.chef,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now()).isoBr
            ]
            return db.query(query, values)

        } catch (error) {
            console.error(error)
        }
    },
    update(data) {
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
                data.chef,
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
    delete(id) {
        try {

            db.query(`DELETE FROM recipes WHERE id = $1`, [id])

        } catch (error) {
            console.error(error)
        }

    },
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