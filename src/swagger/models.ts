import { z } from 'zod'


export const error_response = z.object({ error: z.string() })
