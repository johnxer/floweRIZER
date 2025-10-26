import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import router from './router';

import './firebase/config';
import { useAuthStore } from './stores/useAuthStore';

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import './assets/main.css';

const app = createApp(App);


app.use(FloatingVue);


const init = async () => {
    const pinia = createPinia();
    app.use(pinia);
    const authStore = useAuthStore();
    await authStore.initAuth();
    app.use(router);
    app.mount('#app');
};

init();
