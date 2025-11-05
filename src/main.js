import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import router from './router';

import './firebase/config';

import FloatingVue from 'floating-vue';

import 'floating-vue/dist/style.css';

import './assets/main.css';
import { useAuth } from './composables/useAuth';

const app = createApp(App);

app.use(FloatingVue)


// GLOBAL FIX FOR ARIAL HIDDEN BUG IN FLOATING-VUE
document.addEventListener('click', (e) => {
    const el = e.target
    if (el && el.closest('.v-popper__popper')) {
      requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      })
    }
  }, true
)

const init = async () => {
    const pinia = createPinia();
    app.use(pinia);

    // const authStore = useAuthStore();
    // await authStore.initAuth();

    const { initAuth } = useAuth()
    await initAuth()

    app.use(router);
    app.mount('#app');
};

init();
