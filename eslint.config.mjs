import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    {
        ignores: [
            'node_modules/',
            'dist/',
            '**/*.js',
            '**/*.mjs'
        ]
    },
    {
        files: ['**/*.ts'],   
    },
]
);