const crypto =  require('crypto')
const { hash } =  require('bcryptjs')

const mailer = require('../../config/mailer')

const User = require('../models/users')

module.exports = {
  indexLogin(req,res) {
    return res.render("admin/session/login")
  },
  login(req, res) {
    req.session.userId = req.user.id
    req.session.userName = req.user.name
    req.session.userEmail = req.user.email
    req.session.userAdmin = req.user.is_admin

    return res.redirect("/admin/users")

  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  indexForgotPassword(req, res) {
    return res.render("admin/session/forgot-password")
  },
  async forgotPassword(req, res) {
    try {
      const user = req.user
      const token =  crypto.randomBytes(20).toString("hex")

      let now = new Date()  
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: req.body.email,
        from: 'noreplay@accounts-foodfy.com',
        subject: 'Foodfy - reset password instructions',
        html: `
        <div
        style="padding: 20px; background-color: rgba(0, 0, 0, 0.9);min-width: 100%;width: 100%!important; display: flex; justify-content: center;">
        <!-- #feab03 -->
        <table style="border: 1px solid #ee352c; width: 600px;">
          <tr style="border: 2px solid #1999;">
            <th>
              <img style="padding: 20px;"
                src="https://github.com/Laerciosantosn/LauchBase-FoodFy/blob/master/public/images/logo2.png?raw=true"
                alt="">
            </th>
          </tr>
          <tr>
            <td style="background-color:#ee352c;">
              <p style="margin: 10px 30px;text-align: center;font-size: 20px;font-weight: 600;">
                 Hey <span style="color: #6558C3"> ${user.name} </span><br> <br>
                We have received a password recovery request for your account Foodfy .
              </p>
              <br>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #fff; font-weight: bolder; font-size: 16px;">
    
              <P> We have received a password recovery request for your account Foodfy . <br>
                Please click the link below to recovery the password:
                <br>
                <a href="http://localhost:3000/users/reset-password?token=${token}" target="_blank"
                  style="color: #6558C3; text-decoration: none;">
                  <br>
                  Recovery the password
                </a>
              </P>
              <br>
              <p>If you cannot click the link, please copy and paste it in your browser.</p><br>
              <p>The verification code is only valid for 1 hours.</p>
              <p>Thanks,The Foodfy Team</p>
              <p>Please do not reply to this email; this address is not monitored.</p>
            </td>
          </tr>
        </table>
      </div>
        `,
      }) 
      return res.render("admin/session/forgot-password", {
        success: "Verify your email address for recovery the password!"
      })

    } catch (error) {
      console.error(error)
      res.render("admin/session/forgot-password", {
        error: "Something went wrong"
      })
    }
  },
  indexResetPassword(req, res) {
    return res.render("admin/session/password-reset", { token: req.query.token})
  },
  async resetPassword(req, res) {
    try { 
      const user  = req.user
     
      const { password } = req.body

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      })

      return res.render("admin/session/login", {
        user: req.body,
        success: "The password updated! Log in in your account"
      })

    } catch (error) {
      console.error(error)
        res.render("admin/session/password-reset", {
        user: req.body,
        token,
        error: "Something went wrong"
      })
    }
  }
}