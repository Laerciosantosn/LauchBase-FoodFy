const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    async all() {
        let query = `
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id` 
        const results = await db.query(query)
        return results.rows
    },
    async allchefs(){
        
        const query = `
            SELECT chefs.*, (SELECT path  FROM files WHERE chefs.file_id = files.id) AS path, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
             GROUP BY chefs.id
        `
        let results = await db.query(query)
        return results.rows
    },
    async findchef(file_id, id){
        
         let results = await db.query(`SELECT *, (SELECT path FROM files WHERE id = $1) AS path FROM chefs WHERE id = $2`, [file_id, id])
       
         return results.rows[0]
     },
    create(data, callback) {
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
     
    },
    async find(id){
        
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
    },
    update(data, callback){
        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
        `
        const values = [
            data.name,
            data.file_id,
            data.id
        ]
        db.query(query, values, function(err, results){
            if (err) throw `Database Error! ${err}`
            callback()
        })
    },
    delete(id, callback){

        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
        // db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results){
        //     if (err) throw `Database Error! ${err}`
        //     return callback()
        // })
    },
    async recipesChef({id}){
        const query = `SELECT chefs.*, recipes.image, recipes.title, recipes.id
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        `
        const values = [id]

        const results = await db.query(query, values)
        return results.rows
    },
    async paginate(params) {
        const { limit, offset, callback } = params
        // let result = await db.query(`SELECT * FROM chefs`)
        // let file_id =  result.rows[0].file_id

        // console.log("CHEFS")
        // console.log(file_id)

         query = `SELECT *, (SELECT count(*) FROM chefs) AS total FROM chefs
            LIMIT $1 OFFSET $2    
        ` 
        const values = [
            limit,
            offset
        ]

        const results = await db.query(query, values)
        
        callback(results.rows)
    },
    async file(id) {
        // console.log("File id = ", id)
        let results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
       
        return results.rows[0]
    }
} 