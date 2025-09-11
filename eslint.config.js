import tseslint from 'typescript-eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'


export default tseslint.config(
    {
        ignores: [
            'node_modules/',
            'build/',
            'dist/',
            'coverage/',
            '.testCiJob.json',
            '**/*.ts.build-*.mjs', // Temporary compiled files
            '*.js',
            '*.cjs',
            '*.mjs',
        ],
    },

    ...tseslint.configs.recommended,

    {
        languageOptions: {
            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: false,
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
        },
    },

    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                1,
                {
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-namespace': 0,
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        },
    },

    {
        files: ['**/*.{js,ts}'],
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            indent: ['error', 4],
        },
    },

    eslintPluginUnicorn.configs.recommended,
    {
        rules: {
            'unicorn/better-regex': 'warn',
            'unicorn/filename-case': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/prefer-export-from': 'off',
            'unicorn/consistent-function-scoping': 'off',
            'unicorn/no-useless-undefined': 'off',
        },
    },
)
