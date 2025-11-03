import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devtools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig(({ command }) => ({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        vue(),
        command === 'serve' && devtools(),
    ].filter(Boolean),
}))
