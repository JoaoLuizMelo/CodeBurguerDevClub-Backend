import { Router } from 'express'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import ProductController from './app/controllers/ProductController'
import multer from 'multer'
import multerConfig from './config/multer'
import authMiddleware from './app/middlewares/auth'

const upload = multer(multerConfig)
const routes = new Router()

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)

routes.use(authMiddleware) // Será chamado o middleware antes das rotas de produtos.

routes.post('/products', upload.single('file'), ProductController.store)
routes.get('/products', ProductController.index)

export default routes
