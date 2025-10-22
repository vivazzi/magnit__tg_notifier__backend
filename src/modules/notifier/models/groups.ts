import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)


export type TGroup = { id: string, title: string }


const group = z.object({
    group_id: z.string().openapi({ description: 'ID группы' }),
    title: z.string().min(1).openapi({ description: 'Название группы' }),
})


export const groups = z.array(group).openapi({
    description: 'Список всех групп',
    example: [
        { group_id: '12345', title: 'Top Managers' },
        { group_id: '67890', title: 'Tech Managers' },
    ],
})

