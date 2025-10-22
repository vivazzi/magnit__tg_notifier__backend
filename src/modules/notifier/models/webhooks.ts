import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { auth_token } from './auth_token.ts'

extendZodWithOpenApi(z)


export const webhook_groups_updated = z.object({
    webhook_url: z.string().openapi({
        description: 'URL внешнего вебхука, куда будут отправляться события',
    }),
    webhook_token: z.string().openapi({
        description: 'Токен, который сервис будет отправлять на внешний вебхук для авторизации',
    }),
}).merge(auth_token)


export const webhook_groups_updated_event = z.object({
    event: z.literal('groups_updated'),
    groups: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
        }),
    ),
    token: z.string(),
})

// export type TWebhookGroupsUpdatedEvent = z.infer<typeof webhook_groups_updated_event>
