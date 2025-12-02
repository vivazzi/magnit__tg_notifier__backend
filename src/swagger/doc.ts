import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import type { OpenAPIObject } from 'openapi3-ts/oas30'

import { auth_token, notification, groups, webhook_groups_updated, webhook_groups_updated_event } from '../modules'
import { error_response } from './models.ts'
import { ROUTES } from '#src/routes.const.ts'
import { config } from '#src/config.ts'


let doc_description = fs.readFileSync(path.resolve(import.meta.dirname, 'descriptions/doc.md'), 'utf8')
doc_description = doc_description.replaceAll('<APP_PUBLIC_PATH>', String(config.public_path))

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let test_webhook_description = fs.readFileSync(path.resolve(__dirname, 'descriptions/test_webhook.md'), 'utf8')
test_webhook_description = test_webhook_description.replaceAll('<APP_BACKEND_APP_PORT>', String(config.port))

const registry = new OpenAPIRegistry()


const common_errors = {
    400: { description: 'Validation error', content: { 'application/json': { schema: error_response } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: error_response } } },
    500: { description: 'Ошибка сервера', content: { 'application/json': { schema: error_response } } },
}

export const TAGS = {
    TELEGRAM_MESSAGES: 'Telegram Messages',
    GROUPS: 'Groups',
    WEBHOOKS: 'Webhook Management',
    TELEGRAM_SETTINGS: 'Telegram Settings',
    TESTS: '__tests__',
}


// --- TELEGRAM_MESSAGES ---
registry.registerPath({
    method: 'post',
    path: ROUTES.notify,
    tags: [TAGS.TELEGRAM_MESSAGES],
    description: 'Отправляет сообщение в указанную телеграм группу',
    request: {
        body: { content: { 'application/json': { schema: notification } } },
    },
    responses: {
        200: { description: 'Message sent' },
        ...common_errors,
    },
})


// --- GROUPS ---
registry.registerPath({
    method: 'post',
    path: ROUTES.groups,
    tags: [TAGS.GROUPS],
    description: 'Возвращает список групп',
    request: {
        body: { content: { 'application/json': { schema: auth_token } } },
    },
    responses: {
        200: { description: 'Get groups', content: { 'application/json': { schema: groups } } },
        ...common_errors,
    },
})

registry.registerPath({
    method: 'post',
    path: ROUTES.refresh_groups,
    tags: [TAGS.GROUPS],
    description: '' +
        'Проверяет все группы и удаляет те, где бот больше не состоит. ' +
        'Возвращает актуальный список групп. Это вспомогательная функция, которую можно вызывать вручную или через cron',
    request: {
        body: { content: { 'application/json': { schema: auth_token } } },
    },
    responses: {
        200: {
            description: 'Актуальный список групп',
            content: { 'application/json': { schema: groups } },
        },
        ...common_errors,
    },
})


// --- WEBHOOKS ---
registry.registerPath({
    method: 'post',
    path: ROUTES.webhook_groups_updated,
    tags: [TAGS.WEBHOOKS],
    description: 'Устанавливает вебхук, который будет выполняться при изменении списка групп',
    request: {
        body: { content: { 'application/json': { schema: webhook_groups_updated } } },
    },
    responses: {
        200: { description: 'Вебхук успешно установлен' },
        ...common_errors,
    },
})

registry.registerPath({
    method: 'delete',
    path: ROUTES.webhook_groups_updated,
    tags: [TAGS.WEBHOOKS],
    description: 'Удаляет текущий вебхук, который выполняется при изменении списка групп',
    request: {
        body: { content: { 'application/json': { schema: auth_token } } },
    },
    responses: {
        200: { description: 'Вебхук успешно удалён' },
        ...common_errors,
    },
})


// --- TELEGRAM_SETTINGS ---
registry.registerPath({
    method: 'post',
    path: ROUTES.telegram_webhook_set,
    tags: [TAGS.TELEGRAM_SETTINGS],
    description: 'Устанавливает вебхук у Telegram для приёма апдейтов вместо polling. Для продакшена.',
    request: {
        body: {
            content: { 'application/json': { schema: auth_token } },
        },
    },
    responses: {
        200: { description: 'Webhook в телеграм установлен' },
    },
})


// --- TESTS ---
registry.registerPath({
    method: 'post',
    path: ROUTES.test_webhook,
    tags: [TAGS.TESTS],
    description: test_webhook_description,
    request: {
        body: {
            content: {
                'application/json': {
                    schema: webhook_groups_updated_event,
                    example: {
                        event: 'groups_updated',
                        groups: [
                            { id: '123456', title: 'My Telegram Group' },
                            { id: '789012', title: 'Another Group' },
                        ],
                        token: 'sample_webhook_token',
                    },
                },
            },
        },
    },
    responses: {
        200: { description: 'Webhook event успешно принят (данные выведены в лог)' },
        ...common_errors,
    },
})


const generator = new OpenApiGeneratorV3(registry.definitions)

export const openapi_doc: OpenAPIObject = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        title: 'Telegram Notifier API',
        version: '1.0.0',
        description: doc_description,
    },
    servers: [
        {
            url: config.public_url,
        },
    ],
})
