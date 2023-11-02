import * as Yup from 'yup'
import User from '../models/User'

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })
    // Definindo os pontos inportantes de validação que são a senha e o email, e levando em consideração que não será mostrado
    // qual é o que ta errado foi adotado o asvalid para a validalçao do yup mostrando que existe um erro nos dados de entrada.
    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Make sure your password or email are correct' })
    }
    const { email, password } = request.body
    const user = await User.findOne({
      where: { email },
    })
    if (!user) {
      return response
        .status(400)
        .json({ error: 'Make sure your password or email are correct' })
    }
    // Enviando o Password para o User.js do model para lá ele fazer a verificação da senha.
    if (!(await user.checkPassword(password))) {
      return response
        .status(401)
        .json({ error: 'Make sure your password or email are correct' })
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
    })
  }
}

export default new SessionController()
