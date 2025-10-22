import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { auth_token } from './auth_token.ts'

extendZodWithOpenApi(z)


export const notification = z.object({
    group_id: z.string().openapi({ description: 'ID группы для уведомления' }),
    text: z.string().min(1).openapi({ description: 'Текст сообщения' }),
}).merge(auth_token)

// export type TNotification = z.infer<typeof notification>
