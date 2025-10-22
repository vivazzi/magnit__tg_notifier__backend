import express, { type Express } from 'express'

import { cors_middleware } from './middlewares'
import { router } from './routers.ts'
import { config } from './config.ts'
import { API_PREFIX } from './routes.const.ts'


const app: Express = express()
app.use(express.json())


// - middlewares -
app.use(cors_middleware)

// - entrypoint for all routes -
app.use(API_PREFIX, router)


app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`)
})
