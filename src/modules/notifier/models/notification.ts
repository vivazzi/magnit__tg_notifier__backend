import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

import { GROUPS } from './groups.ts'

extendZodWithOpenApi(z)


export const notification = z.object({
    group: z.nativeEnum(GROUPS).openapi({
        description: 'Группа для уведомления',
        examples: Object.values(GROUPS),
    }),
    text: z.string().min(1).openapi({ description: 'Текст сообщения' }),
    token: z.string().openapi({ description: 'Токен для авторизации' }),
})

// export type TNotification = z.infer<typeof notification>
