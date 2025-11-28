import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import router from './router';

import './firebase/config';

import FloatingVue from 'floating-vue';

import 'floating-vue/dist/style.css';

import './assets/main.css';
import { useAuth } from './composables';
import './plugins/vee-validate';

const app = createApp(App);

app.use(FloatingVue);

// GLOBAL FIX FOR ARIAL HIDDEN BUG IN FLOATING-VUE
document.addEventListener(
    'click',
    (e) => {
        const el = e.target;
        if (el && el.closest('.v-popper__popper')) {
            requestAnimationFrame(() => {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            });
        }
    },
    true
);

// Debug
app.config.errorHandler = (err, instance, info) => {
    console.error('🔥 Vue errorHandler:', err, info);
};
window.addEventListener('error', (event) => {
    console.error('🔥 Global error:', event.error);
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('🔥 Unhandled promise rejection:', event.reason);
});

// / Debug

const init = async () => {
    const pinia = createPinia();
    app.use(pinia);

    const { initAuth } = useAuth();
    await initAuth();

    app.use(router);
    app.mount('#app');
};

init();
