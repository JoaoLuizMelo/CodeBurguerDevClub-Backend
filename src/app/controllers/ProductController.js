import * as Yup from 'yup'
import Product from '../models/Products'

class ProductController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category: Yup.string().required(),
    })
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { filename: path } = request.file
    const { name, price, category } = request.body
    const product = await Product.create({
      name,
      price,
      category,
      path,
    })
    return response.json(product) // apenas para fazer a validação se esta tudo ok
  }

  async index(request, response) {
    const products = await Product.findAll()
    console.log(request)
    return response.json(products)
  }
}

export default new ProductController()
