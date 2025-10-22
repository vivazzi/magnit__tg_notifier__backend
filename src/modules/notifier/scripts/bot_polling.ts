import fetch from 'node-fetch'
import { config } from '../../../config.ts'
import { handle_telegram_update } from '#src/modules/notifier/services.ts'


const POLLING_INTERVAL = 2000
let offset: number | undefined = undefined


const start_polling = async () => {
    const url = `https://api.telegram.org/bot${config.tokens.tg_bot}/getUpdates?timeout=30${offset ? '&offset=' + offset : ''}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.ok) {
        for (const update of data.result) {
            await handle_telegram_update(update)
            offset = update.update_id + 1
        }
    }

    setTimeout(start_polling, POLLING_INTERVAL)
}

start_polling().then(() => console.log('✅ Telegram polling started'))
    .catch(error => {
        console.error('❌ Failed to start polling', error)
        process.exit(1)
    })
