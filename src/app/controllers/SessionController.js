module.exports = {
  indexLogin(req,res) {
    return res.render("admin/session/login")
  },
  login(req, res) {

  },
  logout(req, res) {

  },
  indexForgotPassword(req, res) {
    return res.render("admin/session/forgot-password")
    
  },
  forgotPassword(req, res) {

  },
  indexResetPassword(req, res) {
    return res.render("admin/session/password-reset")

  }
  ,
  resetPassword(req, res) {
    
  }
}