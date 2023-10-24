import { Router } from 'express'

import UserControler from './app/controllers/UserControler'
const routes = new Router()

routes.post('/users', UserControler.store)

export default routes
