import { Router } from 'express'
import { notification_controller } from './controllers.ts'


const router: Router = Router()

router.post('/notify/', notification_controller)

export { router }
