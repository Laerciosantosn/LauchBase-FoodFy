const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    async all() {
        try {
            const query = `
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id
            ` 
            const results = await db.query(query)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
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
        
            let results = await db.query(`SELECT *, (SELECT path FROM files WHERE id = $1) AS path FROM chefs WHERE id = $2`, [file_id, id])
        
            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
     },
    create(data) {
        try {
            const query = `
                INSERT INTO chefs (
                    name,
                    file_id,
                    created_at
                ) VALUES ($1, $2, $3)
                RETURNING id
            `
            const values = [
                data.name,
                data.file_id,
                date(Date.now()).isoBr        
            ] 
            
            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },
    async find(id){
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
    update(name, file_id, id){
        try {
        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
        `
        const values = [
            name,
            file_id,
            id
        ]
        return db.query(query, values)

        } catch (error) {
            console.error(error)
        }
    },
    delete(id, callback){
        try {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])

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
    async paginate(params) {
        try {
            const { limit, offset, callback } = params
        
            query = `SELECT *, (SELECT count(*) FROM chefs) AS total FROM chefs
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
    async file(id) {
        try {
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
        
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    }
} 