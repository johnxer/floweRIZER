import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
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
});
