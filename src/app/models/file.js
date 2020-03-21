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

        
        } catch (err) {
            console.error(err)
        }
    },
    async all(id) {
      
        const query = `
            SELECT * FROM files WHERE id = $1
        `
        const values = [id]
        const results = await db.query(query, values)
        
        return results.rows[0]
    },
    async find(id){
        const query = `
            SELECT * FROM files WHERE id = $1
        `
        const values = [id]

        const results = await db.query(query, values)
        
        return results.rows[0]
    },
    delete(id) {
    
        return db.query(`DELETE FROM files WHERE id = $1`, [id])
    }
    
}