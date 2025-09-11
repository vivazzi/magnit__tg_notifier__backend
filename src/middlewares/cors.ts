import cors from 'cors'

import { config } from '../config.ts'


export const cors_middleware = cors({
    origin: config.cors.allowed_origins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})
