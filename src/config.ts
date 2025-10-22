const require_env = (name: string): string => {
    const value = process.env[name]

    if (!value) throw new Error(`Missing required env var: ${name}`)

    return value
}


export const config = {
    env: process.env.NODE_ENV ?? 'development',

    port: Number(process.env.APP_PORT ?? 3000),

    tokens: {
        api: require_env('APP_API_TOKEN'),
        tg_bot: require_env('APP_TG_BOT_TOKEN'),
    },

    cors: {
        allowed_origins: process.env.APP_ALLOWED_ORIGINS?.split(',') ?? '*',
    },

    data_dir: './data',
    public_url: require_env('APP_PUBLIC_URL'),
}
