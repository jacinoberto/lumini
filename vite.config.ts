// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devtools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => ({
    plugins: [
        vue(),
        command === 'serve' && devtools(),
    ].filter(Boolean), // 👈 boa prática: remove falsy (ex: false)
}))
