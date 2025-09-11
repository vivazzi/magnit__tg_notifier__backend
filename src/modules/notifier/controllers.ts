import type { Request, Response } from 'express'

import { notification } from './models'
import { send_telegram_message } from './services.ts'
import { config } from '../../config.ts'


export const notification_controller = async (req: Request, res: Response) => {
    const parsed = notification.safeParse(req.body)
    if (!parsed.success) return res.status(400).json(parsed.error)

    const { group, text, token } = parsed.data

    if (token !== config.tokens.api)
        return res.status(401).json({ error: 'Unauthorized' })


    try {
        const result = await send_telegram_message(group, text, config.tokens.tg_bot)
        return res.json({ ok: true, result })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return res.status(500).json({ error: 'Telegram error', details: message })
    }
}
