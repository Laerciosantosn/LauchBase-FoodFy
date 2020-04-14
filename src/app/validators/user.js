const User = require('../models/users')

function checkAllFields(body){
  const keys = Object.keys(body)

  for(key of keys) {
    if (body[key] == "" && key != "is_admin") {
      return {
        user: body,
        error: 'Please fill all fields!'
      }
    }
  }
}

async function edit(req, res, next) {
  const { userId: id } = req.session

  const user = await User.findOne({
    where: { id } 
  })

  if(!user) {
    return res.render('admin/users/index', {
      error: "User not found"
    })
  }
  req.user = user
  next()
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields) {
    return res.render('admin/users/create', fillAllFields)
  }
  const { email } = req.body

  const user = await User.findOne({
    where: { email }
  })

  if (user) {
    return res.render("admin/users/create", { 
      user: req.body,
      error: 'user aready exist'
    })
  }

  next()
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields) {
    return res.render('admin/users/edit', fillAllFields)
  }

  const { id, email } = req.body
 
   const user =  await User.findOne({
    where: { id }
  })
  const user2 =  await User.findOne({
    where: { email }
  })

  if(user.id != user2.id) {
    return res.render(`admin/users/edit`, { 
      user: req.body,
      error: 'You cannot update to this email because, User aready exist'
    })
  }

  req.user = user

  next()
}

async function userDelete(req, res, next) {
  const { userId } = req.session
  const { id } = req.body

  const users = await User.all()
 
  if( userId == id) {
    return res.render('admin/users/index', {
      users,
      error: "Unfortunately you cannot delete your account by yourself"
    })
  }

  next()
}
module.exports = {
  post,
  put,
  edit,
  userDelete
}