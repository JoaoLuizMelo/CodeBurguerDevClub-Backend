import { v4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'

class UserControler {
  async store(request, response) {
    /* Padrão do objeto que o Yup espera receber para verificar as informações. */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    })

    /*
    1º metodo de avaliação do yup ,  contudo ele retorna apenas true/false mais não da pra saber onde é o erro ( tudo certo - true /
    algum erro nas validações - false).

    if(!(await schema.isValid(request.body)))
    return response
    .status(400)
    .json({error : 'Make sure your data is corect?'})
    
    const { name, email, password_hash, admin } = request.body
    
    */

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name, email, password, admin } = request.body

    const userExists = await User.findOne({
      where: { email },
    })
    if (userExists) {
      return response.status(400).json({ error: 'User already exists' })
    }
    console.log(userExists)

    /*
    Nesse arquivo vai ser criado os dados logo tem que ser instalado o UUID v4 e importado para gerar o ID. 
    
    Foi utilizado o metodo Create para criar o objeto do  usuario. depois é chamado o model para gravar no banco de dados
    para isso é necessario importar o User.js que está dentro da pasta módel.
    
    */
    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    })

    /*
    Se lembrar de sempre utilizar o codigo HTTP correto então: Alguns codigos. Consultar :
    (https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)

    200 OK , 201 Created , 202 Accepted , 203 Non-Authoritative Information , 204 No Content ,205 Reset Content
    400 Bad Request , 401 Unauthorized, 402 Payment Required, 403 Forbidden, 404 Not Found
    500 Internal Server Error , 501 Not Implemented, 502 Bad Gateway

    */
    return response.status(201).json({ id: user.id, name, email, admin })
  }
}
export default new UserControler()
