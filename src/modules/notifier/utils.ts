import { config } from '#src/config.ts'

import type { TGroup } from './models'


export const has_groups_changed = (old_groups: TGroup[], new_groups: TGroup[]) => {
    if (old_groups.length !== new_groups.length) return true

    const map_old = new Map(old_groups.map(g => [g.id, g.title]))

    for (const g of new_groups) {
        if (!map_old.has(g.id)) return true

        if (map_old.get(g.id) !== g.title) return true
    }

    return false
}


export const get_bot_id = async (): Promise<string> => {
    const res = await fetch(`https://api.telegram.org/bot${config.tokens.tg_bot}/getMe`)
    const data = await res.json()

    if (!data.ok)
        throw new Error(`Failed to get bot info: ${JSON.stringify(data)}`)

    return data.result.id
}


export const get_bot_status = async (chat_id: string, bot_id?: string): Promise<string> => {
    if (!bot_id) bot_id = await get_bot_id()  // todo: cache once

    const res = await fetch(
        `https://api.telegram.org/bot${config.tokens.tg_bot}/getChatMember?chat_id=${chat_id}&user_id=${bot_id}`,
    )
    const data = await res.json()
    if (!data.ok) {
        console.error('Failed to fetch bot status:', data)
        return '<undefined>'
    }

    return data.result.status
}


export const is_bot_admin = async (chat_id: string) => {
    const status = await get_bot_status(chat_id)
    return ['administrator', 'creator'].includes(status)
}


export type TChat = {
    id: string
    title?: string
    username?: string
    type: string
}


export const get_chat = async (chat_id: string): Promise<TChat> => {
    const res = await fetch(`https://api.telegram.org/bot${config.tokens.tg_bot}/getChat?chat_id=${chat_id}`)
    const data = await res.json()

    if (!data.ok) {
        throw new Error(`Failed to fetch chat info for ${chat_id}: ${JSON.stringify(data)}`)
    }

    return data.result as TChat
}
