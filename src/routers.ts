import { Router } from 'express'

import { swagger_router } from './swagger'
import { notifier_router } from './modules'


const router: Router = Router()

router.use('', swagger_router)
router.use('', notifier_router)

router.get('/health', (_req, res) => res.end())


export { router }
