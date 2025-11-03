// vite.config.ts (CORRIGIDO)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devtools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => ({
    plugins: [
        vue(),
        // 'command' é 'serve' (dev) ou 'build' (prod).
        // Esta é a forma mais segura de o desativar no build.
        command === 'serve' && devtools(),
    ],
}))