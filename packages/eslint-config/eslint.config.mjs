import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
    { ignores: ['dist', 'node_modules'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
);
