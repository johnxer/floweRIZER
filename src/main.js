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

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(FloatingVue)

const authStore = useAuthStore()

const init = async () => {
  await authStore.initAuth() 
  app.mount('#app')
}

init()
