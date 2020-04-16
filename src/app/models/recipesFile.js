const db = require('../../config/db')

const Base = require('./base')

Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    // async all(id) {
       
    //     try {
    //         const query = `
    //             SELECT * FROM recipe_files WHERE recipe_id = $1
    //         `
    //         const values = [id]
       
    //         const results = await db.query(query, values)
          
    //         return results.rows

    //     } catch (error) {
    //         console.error(error)
    //     }
    // }, 
    // async findAll() {
    //     try {
    //         let query = `SELECT * FROM recipe_files`

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
    //             SELECT * FROM recipe_files WHERE recipe_id = $1
    //         `
    //         const values = [id]
       
    //         const results = await db.query(query, values)
          
    //         return results.rows[0]

    //     } catch (error) {
    //         console.error(error)
    //     }
    // },
    // async recipeChef(id) {
    //     try {
    //         const query = `
    //             SELECT * FROM recipe_files WHERE recipe_id = $1
    //         `
    //         const values = [id]
       
    //         const results = await db.query(query, values)
          
    //         return results.rows[0]

    //     } catch (error) {
    //         console.error(error)
    //     }
    // }, 
    // created({recipe_id, file_id}) {
    //     console.log(recipe_id)
    //     console.log(file_id)
    //     try {
        
    //         const query = `
    //             INSERT INTO recipe_files (
    //             recipe_id,
    //             file_id
    //             ) VALUES ($1, $2)
    //             RETURNING id
    //         `
    //         const values = [
    //             recipe_id,
    //             file_id
    //         ]
        
    //         return db.query(query, values)

    //     } catch (error) {
    //         console.error(error)
    //     }
    // }, 
    // delete (id){
    //     try {
    //         return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
    //     } catch (error) {
    //         console.error(error)
    //     }
        
    // }

}