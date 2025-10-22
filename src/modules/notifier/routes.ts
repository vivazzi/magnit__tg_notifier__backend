import { Router } from 'express'

import { ROUTES } from '#src/routes.const.ts'
import {
    get_groups_controller,
    notification_controller, refresh_groups_controller, set_telegram_webhook_controller,
    telegram_webhook_controller,
    webhook_groups_updated_controller,
} from './controllers.ts'


const router: Router = Router()


router.post(ROUTES.notify, notification_controller)

router.post(ROUTES.telegram_webhook, telegram_webhook_controller)
router.post(ROUTES.telegram_webhook_set, set_telegram_webhook_controller)

router.post(ROUTES.webhook_groups_updated, webhook_groups_updated_controller)
router.delete(ROUTES.webhook_groups_updated, webhook_groups_updated_controller)

// maybe, we need use headers: { 'Authorization': `Bearer <APP_API_TOKEN>` } and use GET method
router.post(ROUTES.groups, get_groups_controller)
//

router.post(ROUTES.refresh_groups, refresh_groups_controller)

router.post(ROUTES.test_webhook, (req, res) => {
    console.log('📩 Test webhook called with body:', req.body)

    res.json({ ok: true })
})


export { router }
