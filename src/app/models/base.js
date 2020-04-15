const db = require('../../config/db')

function find(filters, table) {
  let query = `SELECT * FROM ${table}`

  Object.keys(filters).map(key => {
    // WHERE | OR | AND
    query += ` ${key}` // removendo a ${query} e dando um spaço antes da ${key} estara simplificando a query
    
    Object.keys(filters[key]).map(field => {
      query += ` ${field} = '${filters[key][field]}'`
    })
  })
  // console.log(query)
  return db.query(query)
}

const Base = {
  init({ table }) {
    if(!table) throw new Error('Invalid Params')

    this.table = table

    return this
  },
  async find(id) {
    const results = await find({ where: { id } }, this.table)
    return results.rows[0]
  },
  async findOne(filters) {
    try {
      //   let query = `SELECT * FROM ${this.table}`

      // Object.keys(filters).map(key => {
      //   // WHERE | OR | AND
      //   query = `${query}
      //   ${key}`

      //   Object.keys(filters[key]).map(field => {
      //     query = `${query} ${field} = '${filters[key][field]}'`
      //   })
      // })
// console.log(filters, this.table)
      const results = await find(filters, this.table)
      return results.rows[0]

    } catch (error) {
      console.error(error)
    }
    
  },
  async findAll(filters) {
    
    const results = await find(filters, this.table)
    
    return results.rows
  },
  async create(fields){ 
    let keys = [],
        values = []

    try {
      Object.keys(fields).map(key => {
     
        keys.push(key)
        values.push(`'${fields[key]}'`)
      })

      const query = `INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id`
// console.log(query)
      const results = await db.query(query)
      
      return results.rows[0]
      
    } catch (error) {
      console.error(error)
    }
  },
  async update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map(key => {
           
        const line = `${key} = '${fields[key]}'` 
        
        update.push(line)
   
      })
     
      let query = `UPDATE ${this.table} SET
      ${update.join(',')} WHERE id = ${id}
      `
    
      await db.query(query)
      return

    } catch (error) {
      console.error(error)
    }
  },
  delete(id) {
    // console.log(`${this.table} ${id}`)
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  }
}

module.exports = Base