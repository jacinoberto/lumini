// vite.config.ts (CORRIGIDO)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devtools from 'vite-plugin-vue-devtools'

// Use a função de configuração para aceder ao 'command'
export default defineConfig(({ command }) => ({
    plugins: [
        vue(),
        // Adiciona o devtools apenas se o comando NÃO for 'build'
        command !== 'build' && devtools(),
    ],
}))