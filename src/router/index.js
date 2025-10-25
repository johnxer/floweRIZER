import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    // { 
    //     path: '/', 
    //     name: 'Home', 
    //     component: () => import('../pages/TheHome.vue')
    // },
    { 
        path: '/', 
        name: 'NotAuthed', 
        component: () => import('../pages/NotAuthed.vue')
    },
    { 
        path: '/dashboard', 
        name: 'TheDashboard', 
        component: () => import('../pages/Authed/TheDashboard.vue')
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: () => import('../pages/NotFound.vue')
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-exact',
});

export default router;
