import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // Vamos criar um campo virtual apenas para faz trabalharmos com a senha criptografando-a.
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      { sequelize },
    )
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })
    return this
  }
  // Checar se o password está correto, existe essa função.

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
