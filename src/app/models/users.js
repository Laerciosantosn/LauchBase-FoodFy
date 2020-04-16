const db = require('../../config/db')

const Base = require('./base')

Base.init({ table: 'users' })

module.exports = {
  ...Base,
  // async all(){
  //   try {
  //    const results = await db.query(`SELECT * FROM ${this.table}`)
  //    return  results.rows 
  //   } catch (error) {
  //     console.error(error)
  //   }
  // },
  // async findOne(filters) {
  //   try {
  //       let query = `SELECT * FROM users`

  //     Object.keys(filters).map(key => {
  //       // WHERE | OR | AND
  //       query = `${query}
  //       ${key}`

  //       Object.keys(filters[key]).map(field => {
  //         query = `${query} ${field} = '${filters[key][field]}'`
  //       })
  //     })

  //     const results = await db.query(query)
  //     return results.rows[0]
  //   } catch (error) {
  //     console.error(error)
  //   }
    
  // },
  // async create (data) {
  //   try {
  //       const query = `
  //     INSERT INTO users (
  //       name,
  //       email,
  //       password,
  //       is_admin
  //     ) VALUES ($1, $2, $3, $4)
  //     RETURNING id
  //     `
  //     const values = [
  //       data.name,
  //       data.email,
  //       data.password,
  //       data.is_admin
  //     ]
  //     console.log(query)
  //     console.log(values)
  //     const results =  await db.query( query, values)
  //     return results.rows[0]
  //   } catch (error) {
  //     console.error(error)
  //   }
    
  // },
  // async update(id, fields) {
  //   let query = 'UPDATE users SET'
   
  //   Object.keys(fields).map((key, index, array) => {
  //     if((index + 1) < array.length) {
  //       query = `${query}
  //         ${key} = '${fields[key]}',
  //       `
  //     } else {
  //       query = `${query}
  //         ${key} = '${fields[key]}'
  //         WHERE id = ${id}
  //       `
  //     }
  //   })
  
  //   await db.query(query)
  //   return
  // },
  // async delete (filters) {
  //   try {
  //       let query = `DELETE FROM users`

  //     Object.keys(filters).map(key => {
  //       // WHERE | OR | AND
  //       query = `${query}
  //       ${key}`

  //       Object.keys(filters[key]).map(field => {
  //         query = `${query} ${field} = '${filters[key][field]}'`
  //       })
  //     })
      
  //     await db.query(query)
  //     return
  //   } catch (error) {
  //     console.error(error)
  //   }
    
  // },
}