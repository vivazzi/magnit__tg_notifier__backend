import type { Request, Response } from 'express'

import { auth_token, notification, webhook_groups_updated } from './models'
import {
    get_groups,
    handle_telegram_update,
    remove_webhook_groups_updated,
    send_telegram_message,
    set_webhook_groups_updated,
    set_telegram_webhook, refresh_groups,
} from './services.ts'
import { config } from '../../config.ts'


export const notification_controller = async (req: Request, res: Response) => {
    const parsed = notification.safeParse(req.body)
    if (!parsed.success) return res.status(400).json(parsed.error)

    const { group_id, text, token } = parsed.data

    if (token !== config.tokens.api)
        return res.status(401).json({ error: 'Unauthorized' })

    try {
        const result = await send_telegram_message(group_id, text, config.tokens.tg_bot)
        return res.json({ result })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return res.status(500).json({ error: 'Telegram error', details: message })
    }
}


export const get_groups_controller = (req: Request, res: Response) => {
    const parsed = auth_token.safeParse(req.body)
    if (!parsed.success) return res.status(400).json(parsed.error)

    const { token } = parsed.data

    if (token !== config.tokens.api)
        return res.status(401).json({ error: 'Unauthorized' })

    const groups = get_groups()
    return res.json(groups)
}


export const refresh_groups_controller = async (req: Request, res: Response) => {
    const parsed = auth_token.safeParse(req.body)
    if (!parsed.success) return res.status(400).json(parsed.error)

    const { token } = parsed.data

    if (token !== config.tokens.api)
        return res.status(401).json({ error: 'Unauthorized' })

    const groups = await refresh_groups()
    return res.json(groups)
}


export const webhook_groups_updated_controller = (req: Request, res: Response) => {
    if (req.method === 'POST') {  // set or update
        const parsed = webhook_groups_updated.safeParse(req.body)
        if (!parsed.success) return res.status(400).json(parsed.error)

        const { webhook_url, webhook_token, token } = parsed.data

        if (token !== config.tokens.api)
            return res.status(401).json({ error: 'Unauthorized' })

        try {
            set_webhook_groups_updated(webhook_url, webhook_token)
            return res.end()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error)
            return res.status(500).json({ error: 'Failed to save webhook', details: message })
        }
    }

    if (req.method === 'DELETE') {
        const parsed = auth_token.safeParse(req.body)
        if (!parsed.success) return res.status(400).json(parsed.error)

        const { token } = parsed.data

        if (token !== config.tokens.api)
            return res.status(401).json({ error: 'Unauthorized' })

        try {
            remove_webhook_groups_updated()
            return res.end()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error)
            return res.status(500).json({ error: 'Failed to remove webhook', details: message })
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
}


export const telegram_webhook_controller = async (req: Request, res: Response) => {
    try {
        await handle_telegram_update(req.body)
        return res.end()
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}


export const set_telegram_webhook_controller = async (req: Request, res: Response) => {
    const parsed = auth_token.safeParse(req.body)
    if (!parsed.success) return res.status(400).json(parsed.error)

    const { token } = parsed.data

    if (token !== config.tokens.api)
        return res.status(401).json({ error: 'Unauthorized' })

    try {
        const data = await set_telegram_webhook()

        return res.json({ ok: true, result: data })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return res.status(500).json({ error: 'Failed to set Telegram webhook', details: message })
    }
}
