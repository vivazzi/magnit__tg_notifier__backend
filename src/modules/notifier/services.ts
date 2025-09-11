import fetch from 'node-fetch'
import { GROUP_IDS, type TGroup } from './models'


export const send_telegram_message = async (group: TGroup, text: string, bot_token: string) => {
    const url = `https://api.telegram.org/bot${bot_token}/sendMessage`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: GROUP_IDS[group], text }),
    })

    const data = await res.json()
    if (!res.ok) {
        throw new Error(`Telegram API error: ${JSON.stringify(data)}`)
    }

    return data
}
