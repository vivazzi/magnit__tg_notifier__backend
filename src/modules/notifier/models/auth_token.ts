import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)


export const auth_token = z.object({
    token: z.string().openapi({ description: 'Токен для авторизации в нашем сервисе (API токен)' }),
})
