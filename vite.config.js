import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-vue': ['vue', 'vue-router', 'pinia'],
                    'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
                    'vendor-ui': ['@headlessui/vue', 'floating-vue', 'sortablejs', 'vuedraggable'],
                    'vendor-utils': ['date-fns', 'uuid'],
                    'vendor-ai': ['@google/genai'],
                },
            },
        },
    },
    resolve: {
        alias: {
            // '@': path.resolve(__dirname, 'src'),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
