const db = require('../../config/db')

module.exports = {
    async all(id) {
        
        try {
            const query = `
                SELECT * FROM recipe_files WHERE recipe_id = $1
            `
            const values = [id]
       
            const results = await db.query(query, values)
          
            return results.rows

        } catch (err) {
            console.error(err)
        }
    }, async find(id) {
        
        try {
            const query = `
                SELECT * FROM recipe_files WHERE recipe_id = $1
            `
            const values = [id]
       
            const results = await db.query(query, values)
          
            return results.rows[0]

        } catch (err) {
            console.error(err)
        }
    },
    async recipeChef(id) {
        
        try {
            const query = `
                SELECT * FROM recipe_files WHERE recipe_id = $1
            `
            const values = [id]
       
            const results = await db.query(query, values)
          
            return results.rows[0]

        } catch (err) {
            console.error(err)
        }
    }, 
    create({recipe_id, file_id}) {
        
        const query = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ($1, $2)
        RETURNING id
    `
        const values = [
            recipe_id,
            file_id
        ]
        
       return db.query(query, values)
    }, 
    delete (id){
        return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
    }

}