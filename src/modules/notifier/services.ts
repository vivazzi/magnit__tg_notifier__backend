import fs from 'node:fs'
import path from 'node:path'
import fetch from 'node-fetch'

import { config } from '#src/config.ts'
import { API_PREFIX, ROUTES } from '#src/routes.const.ts'

import { get_bot_id, get_bot_status, get_chat, has_groups_changed, is_bot_admin } from './utils.ts'
import { type TGroup, webhook_groups_updated_event } from './models'


const DATA_DIR = path.resolve(config.data_dir)
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const GROUPS_FILE = path.join(DATA_DIR, 'groups.json')
const WEBHOOKS_FILE = path.join(DATA_DIR, 'webhooks.json')


export const send_telegram_message = async (group_id: string, text: string, bot_token: string) => {
    const url = `https://api.telegram.org/bot${bot_token}/sendMessage`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: group_id, text }),
    })

    const data = await res.json()
    if (!res.ok) {
        throw new Error(`Telegram API error: ${JSON.stringify(data)}`)
    }

    return data
}


export const get_groups = (): TGroup[] => {
    if (!fs.existsSync(GROUPS_FILE)) return []
    return JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'))
}


export const handle_telegram_update = async (update: any) => {
    if (!update.message && !update.my_chat_member) return

    const old_groups = get_groups()  // todo: need optimize
    let new_groups = [...old_groups]

    // --- Adding a group via command ---
    if (update.message && update.message.text === '/register_group_to_tg_notifier') {
        const chat_id = update.message.chat.id
        const title = update.message.chat.title || update.message.chat.username || 'unknown'

        const bot_is_admin = await is_bot_admin(chat_id)

        if (!bot_is_admin) {
            console.warn(`⚠️ Cannot register group "${title}" (${chat_id}) because the bot is not an admin`)
        } else if (!new_groups.some(g => g.id === String(chat_id))) {
            new_groups.push({ id: String(chat_id), title })
            console.log(`✅ Registered new group: ${title} (${chat_id})`)
        }
    }

    // --- Processing changes in the bot's status in a group ---
    if (update.my_chat_member && ['left', 'kicked', 'restricted'].includes(update.my_chat_member.new_chat_member.status)) {
        const chatId = update.my_chat_member.chat.id
        const title = update.my_chat_member.chat.title || 'unknown'

        console.log(`🗑️ Detected bot removal or restriction in group: ${title} (${chatId})`)

        new_groups = new_groups.filter(g => g.id !== String(chatId))
    }

    // --- Save and notify if groups changed ---
    if (has_groups_changed(old_groups, new_groups)) {
        fs.writeFileSync(GROUPS_FILE, JSON.stringify(new_groups, undefined, 2))
        await call_external_webhook(new_groups).catch(error => {
            console.error('Failed to call external webhook:', error)
        })
    }
}


export const refresh_groups = async () => {
    const groups = get_groups()
    const updated_groups: typeof groups = []

    const bot_id = await get_bot_id()  // todo: cache once

    for (const group of groups) {
        try {
            const status = await get_bot_status(group.id, bot_id)

            if (['left', 'kicked'].includes(status)) {
                console.log(`🗑️ Bot is no longer in group: ${group.title} (${group.id})`)
                continue
            }

            // Получаем актуальные данные о чате, чтобы знать новый title
            const chat = await get_chat(group.id)
            const newTitle = chat.title || group.title
            if (newTitle !== group.title) {
                console.log(`✏️ Group title changed: "${group.title}" -> "${newTitle}" (${group.id})`)
            }

            updated_groups.push({ ...group, title: newTitle })
        } catch (error) {
            console.error(`❌ Failed to fetch group ${group.title} (${group.id}):`, error)

            updated_groups.push(group)
        }
    }

    if (has_groups_changed(groups, updated_groups)) {
        fs.writeFileSync(GROUPS_FILE, JSON.stringify(updated_groups, undefined, 2))
        await call_external_webhook(updated_groups).catch(error => {
            console.error('❌ Failed to call external webhook after refresh:', error)
        })
    }

    return updated_groups
}


export const call_external_webhook = async (groups: TGroup[]) => {
    if (!fs.existsSync(WEBHOOKS_FILE)) return

    const webhookData = JSON.parse(fs.readFileSync(WEBHOOKS_FILE, 'utf8'))
    const { webhook_url, webhook_token } = webhookData

    if (!webhook_url || !webhook_token) return

    const body = webhook_groups_updated_event.parse({
        event: 'groups_updated',
        groups,
        token: webhook_token,
    })

    await fetch(webhook_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${webhook_token}`,
        },
        body: JSON.stringify(body),
    })
}


export const set_webhook_groups_updated = (webhook_url: string, webhook_token: string) => {
    fs.writeFileSync(
        WEBHOOKS_FILE,
        JSON.stringify({ webhook_url, webhook_token }, undefined, 2),
        'utf8',
    )
}


export const remove_webhook_groups_updated = () => {
    if (fs.existsSync(WEBHOOKS_FILE)) {
        fs.unlinkSync(WEBHOOKS_FILE)
    }
}

export const set_telegram_webhook = async () => {
    const response = await fetch(`https://api.telegram.org/bot${config.tokens.tg_bot}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `${config.public_url}${API_PREFIX}${ROUTES.telegram_webhook}` }),
    })
    const data = await response.json()

    if (!response.ok || !data.ok) {
        throw new Error(JSON.stringify(data))
    }

    return data
}
