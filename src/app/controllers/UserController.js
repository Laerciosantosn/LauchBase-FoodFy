const { hash } =  require('bcryptjs')
const { unlinkSync } = require('fs')
const crypto = require('crypto')
const mailer = require('../../config/mailer')

const User = require('../models/users')
const Recipes = require('../models/recipes')
const RecipeFiles = require('../models/recipesFile')
const Files = require('../models/file')

module.exports = {
  async list(req, res) {
    const users = await User.findAll()
    return res.render("admin/users/index", { users } )
  },
  async show(req, res) {
    return res.render("admin/users/show")
  },
  create(req, res) {
    return res.render("admin/users/create")
  },
  async post(req, res) {
    try {
      let data = { ...req.body }
     
      let password = crypto.randomBytes(4).toString("hex")
      
      const passwordHash = await hash(password, 8)
      
      if(!data.is_admin) {
        data = { ...req.body, is_admin: 'false'  }
      }

      data = { ...data, password: passwordHash}

      const user = await User.create(data)

      await mailer.sendMail({
        to: req.body.email,
        from: 'noreplay@foodfy.com',
        subject: 'Foodfy account created',
        html: `
        <div style="padding: 20px; background-color: rgba(0, 0, 0, 0.9);min-width: 100%;width: 100%!important; display: flex; justify-content: center;">
        <!-- #feab03 -->
        <table style="border: 1px solid #ee352c; width: 600px;" >
          <tr style="border: 2px solid #1999;">
            <th>
              <img style="padding: 20px;" src="https://github.com/Laerciosantosn/LauchBase-FoodFy/blob/master/public/images/logo2.png?raw=true" alt="">
            </th>
          </tr>
          <tr>
            <td style="background-color:#ee352c;">
              <p style="margin: 10px 30px;text-align: center;font-size: 20px;font-weight: 600;">
                Congratulations!<br> <br>
                Your account has been successfully criated!
              </p> 
              <br>
            </td>
            
          </tr>
          <tr>
            <td style="padding: 8px; color: #fff; font-weight: bolder; font-size: 16px;">
              
              <p> Welcome to the foodfy! 
                <span style="color: #6558C3;"> ${user.name}</span></p>
              <P> Thank you for creating a Foodfy account. 
                We are excited to welcome you! 
              </P>
    
              <p> <strong>Your login to enter Foodfy: </strong><span style="color: #6558C3;">${req.body.email} </span> <br>
                <strong>Password: </strong> <span style="color: #6558C3;">${ password}</span> 
            </p>
            <br>
            <br>
            <p>To go to Foodfy website, click
              <a href="http://localhost:3000/" target="_blank" style="color: #6558C3; text-decoration: none;">FoodFy.</a>
            </p>
            </td>
        
          </tr>
        </table>
      </div>
        `,
    }) 

    return res.render("admin/users/create", {
      success: "Account successfully created "
    })
      
    } catch (error) {
      console.error(error)
      return res.render("admin/users/index", {
        users,
        error: "Something went wrong!"
      })
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params
    
      const user =  await User.findOne({
        where: { id }
      })
    
      return res.render("admin/users/edit", { user } )
    } catch (error) {
      console.error(error)
    }
  },
  async put (req, res) {
    let user = req.body
    const { id, name, email, is_admin } = req.body
    try {
              
      let data = { 
        name,
        email,
        is_admin
       }
    
      if(!data.is_admin) {
        data = { 
          name,
          email,
          is_admin: 'false'  }
      }
      
      await User.update( id, data)

       user =  await User.findOne({
        where: { id }
      })

      return res.render("admin/users/edit", {
        user,
        success: "Account successfully updated"
      })
      
    } catch (error) {
      console.error(error)
      return res.render("admin/users/edit", {
        user,
        error: "Something went wrong!"
      })
    }

  },
  async delete(req, res) {
    const user_id =req.body.id
    const id =user_id
        
    try {
      const recipes =  await Recipes.findAll({
        where: { user_id }
      })

      const recipeFilesPromise = recipes.map(recipe => RecipeFiles.all(recipe.id))
      const recipeFileResults = await Promise.all(recipeFilesPromise)
     
      await User.delete(id)
      
      let files = []
      await recipeFileResults.map(file => {
        files.push(...file)
      })
      
      let filesPromise = files.map( file => Files.all(file.file_id))
      const fileResults = await Promise.all(filesPromise)

      fileResults.map(file => {
        try {
            unlinkSync(file.path)
        } catch (err) {
            console.error(err)
        }
      })

      filesPromise = fileResults.map(file => Files.delete(file.id))
      await Promise.all(filesPromise)

      const users = await User.findAll()

      return res.render("admin/users/index", { 
        users, 
        success: "Account successfully deleted" } )
    
    } catch (error) {
      console.error(error)
      return res.render("admin/users/index", {
        users,
        error: "Something went wrong!"
      })
    }


  },
}