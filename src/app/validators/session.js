const User = require('../models/users')
const { compare } = require('bcryptjs')

async function login(req, res, next) {

  const { email, password } = req.body

  const user =  await User.findOne({ where: { email } })

  if(!user) return res.render("admin/session/login", {
    user: req.body,
    error: "User not found"
  } )

  const passed = await compare(password, user.password)

  if(!passed) return res.render("admin/session/login", {
    user: req.body,
    error: "Password is wrong"
  })
  req.user = user

  next()
}

async function forgot(req, res, next) {
  const { email } = req.body
  try {
    let user =  await User.findOne({ where: { email } })

    if(!user) return res.render("admin/session/forgot-password", {
      user: req.body,
      error: `User not registered !
        Contact one admin for register an account`
    } )

    req.user = user

   next()
  } catch (error) {
    console.error(error)
  }

  
}

async function reset(req, res, next) {
   // procurar usuário
   const { email, password, passwordRepeat, token } = req.body
  
   const user =  await User.findOne({ where: { email } })
 
   if(!user) return res.render("admin/session/password-reset", {
     user: req.body,
     token,
     error: "User not found"
   } )

    // vefificar senha
   if (password != passwordRepeat) {
     return res.render("admin/session/password-reset", {
       user: req.body,
       token,
       error: "The password is mismatch"
     })
   }
    //  verificar se token bate
   if(token != user.reset_token) {
     return res.render("admin/session/forgot-password", {
      user: req.body,
      error: "The token is invalid! Request an new password."
    })
   }
    //  verificar se token expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) {
      return res.render("admin/session/forgot-password", {
        user: req.body,
        error: "The token expired! Request an new password."
      })
    }
   
    req.user = user

  next()
}

module.exports = {
  login,
  forgot,
  reset
}
