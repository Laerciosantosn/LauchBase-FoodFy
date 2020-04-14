const User = require('../models/users')


module.exports = {
  async index(req, res) {
    const id = req.session.userId
 
    let { name, email } = await User.findOne({
      where: { id }
    })
    user = {
      id,
      name,
      email
    }

    return res.render("admin/profiles/index", { user })
  },
  async put(req, res) {

    try {

      const id = req.session.userId

      let { name, email } = req.body

      await User.update(id, {
        name,
        email
      })

      let user = await User.findOne({
        where: { id }
      })

      user = {
        id,
        name: user.name,
        email: user.email
      }

      return res.render("admin/profiles/index", {
        user,
        success: "Account updated successfully"
      })

    } catch (error) {
      console.error(error)
      return res.render("admin/profiles/index", {
        error: "Something went wrong!"
      })
    }

  }

}