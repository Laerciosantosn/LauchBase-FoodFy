const Profile = require('../models/profile')
const User = require('../models/users')
const { compare } = require('bcryptjs')


function checkAllFields(body){
  const keys = Object.keys(body)

  for(key of keys) {
    if (body[key] == "" && key != "password") {
      return {
        user: body,
        error: 'Please fill all fields!'
      }
    }
  }
}
// async function show(req, res, next) {
//   const { userId: id } = req.session

//   const user = await User.findOne({
//     where: { id } 
//   })

//   if(!user) {
//     return res.render('admin/users/index', {
//       error: "User not found"
//     })
//   }
//   req.user = user
//   next()
// }
async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body)

  if(fillAllFields) {
    return res.render('admin/profiles/index', fillAllFields)
  }

  const { id, password, email } = req.body
  const { userEmail } = req.session

  if(email != userEmail) {
    const user =  await User.findOne({
      where: { email }
   })
   if(user){
     return res.render('admin/profiles/index', {
        user: req.body,
        error: "You cannot update for this email, user aready exist"
      })
   }
  }

  if(!password) return res.render('admin/profiles/index', {
    user: req.body,
    error: "Please enter with your password"
  })

  const user =  await User.findOne({
     where: { id }
  })
  const passed = await compare(password, user.password)

  if(!passed) return res.render("admin/profiles/index", {
    user: req.body,
    error: "Password is wrong"
  })
  req.user = user

  next()
}



// async function post(req, res, next) {
//   const fillAllFields = checkAllFields(req.body)
//   if(fillAllFields) {
//     return res.render('admin/users/create', fillAllFields)
//   }
//   const { email } = req.body

//   const user = await User.findOne({
//     where: { email }
//   })

//   if (user) {
//     return res.render("admin/users/create", { 
//       user: req.body,
//       error: 'user aready exist'
//     })
//   }

//   next()
// }

module.exports = {
  put
}
