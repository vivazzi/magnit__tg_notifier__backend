import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'

import { openapi_doc } from './doc.ts'


const router: Router = Router()

router.get('/docs/json', (_req, res) => res.json(openapi_doc))
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi_doc))

export { router }
