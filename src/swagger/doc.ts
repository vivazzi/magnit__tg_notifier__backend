import fs from 'node:fs'
import path from 'node:path'

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import type { OpenAPIObject } from 'openapi3-ts/oas30'

import { notification } from '../modules'
import { error_response } from './models.ts'


const description = fs.readFileSync(path.resolve(import.meta.dirname, 'description.md'), 'utf8')

const registry = new OpenAPIRegistry()

registry.registerPath({
    method: 'post',
    path: '/api/notify/',
    operationId: 'notify',
    tags: ['notify'],
    request: {
        body: { content: { 'application/json': { schema: notification } } },
    },
    responses: {
        200: { description: 'Message sent (empty response)' },
        400: { description: 'Validation error', content: { 'application/json': { schema: error_response } } },
        401: { description: 'Unauthorized', content: { 'application/json': { schema: error_response } } },
    },
})

const generator = new OpenApiGeneratorV3(registry.definitions)

export const openapi_doc: OpenAPIObject = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        title: 'Telegram Notifier API',
        version: '1.0.0',
        description,
    },
})
