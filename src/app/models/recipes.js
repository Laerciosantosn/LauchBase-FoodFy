const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    async all() {
        const query = `
        SELECT recipes.*, chefs.name AS chef 
        FROM recipes 
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY updated_at DESC
    `
    const results = await db.query(query)
        
    return results.rows
    },
    async recipesChef(id) {
        const query = `
        SELECT recipes.*, chefs.name AS chef 
        FROM recipes 
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chef_id = $1
    `
    const values = [id]
    const results = await db.query(query, values)
   
    return results.rows
    },
    async recipAndFile(file_id, recipe_id){
       
        const query = `
        SELECT recipes.*, chefs.name AS chef,
        ( SELECT path FROM files WHERE id= $1) AS path
               FROM recipes 
               LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
               WHERE recipes.id = $2
        `
        const values = [file_id, recipe_id]

        const results = await db.query(query, values)
        // console.log(results.rows[0])
        return results.rows[0]
    },
     async find(id){
        const query = `
            SELECT recipes.*, chefs.name AS chef 
            FROM recipes 
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.id = $1
        `
        const values = [id]
        const results = await db.query(query, values)
        // console.log(results.rows[0])
        return results.rows[0]
    },  
    create(data) {
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
        // db.query(query, values, function (err, results) {
        //     if (err) throw `Database Error! ${err}`
        //     callback(results.rows[0])
        // })
    },  
    // find(id){
    //     const query = `
    //         SELECT recipes.*, chefs.name AS author 
    //         FROM recipes 
    //         LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    //         WHERE recipes.id = $1
    //     `
    //     const values = [id]
    //     const results = db.query(query, values)
    //     console.log(results.rows[0])
    //     return results.rows[0]
    // },
    
    update(data){
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
    
    },
    delete(id){
        db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    async chefSelectOptions (){
        const query = `SELECT name, id FROM chefs ORDER BY name ASC`
        const results = await db.query(query)
        
        return results.rows
    }
    // chefSelectOptions (callback) {
    //     db.query(`SELECT name, id FROM chefs ORDER BY name ASC`, function(err, results){
    //         if (err) throw `Database Error! ${err}`
    //         callback(results.rows)
    //     })
    // }
}