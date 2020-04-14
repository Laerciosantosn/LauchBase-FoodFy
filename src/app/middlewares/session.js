function onlyUsers(req, res, next) {
  if(!req.session.userId)
  return res.redirect('/users/login')
  next()
}

function isLoggedRedirectToUsers(req, res, next) {
  if(req.session.userId){
    return res.redirect('/admin/users')
  }
  next()
}

function onlyAdmin(req, res, next) {
  if(req.session.userAdmin != true)
  return res.redirect('/admin/profile')
  next()
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToUsers,
  onlyAdmin
}