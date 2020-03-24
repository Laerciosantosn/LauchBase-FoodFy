const db = require('../../config/db')

module.exports = {
    
    async create({filename, path}) {
        
        try {
            const query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            `
            const values = [
                filename,
                path
            ]
       
            const results = await db.query(query, values)
          
            return results.rows[0]
        
        } catch (error) {
            console.error(error)
        }
    },
    async all(id) {
        try {
     
            const query = `
                SELECT * FROM files WHERE id = $1
            `
            const values = [id]
            const results = await db.query(query, values)
            
            return results.rows[0]

        } catch (error) {
            console.error(error)
        }    
    },
    async find(id){
        try {
        
            const query = `
                SELECT * FROM files WHERE id = $1
            `
            const values = [id]

            const results = await db.query(query, values)
            
            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
    },
    delete(id) {
        try {
            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        } catch (error) {
            console.error(error)
        }
    }
    
}