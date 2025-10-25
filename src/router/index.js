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
        component: () => import('../pages/NotAuthed.vue'),
        meta: {
            title: 'Login or Sign up',
        },
    },
    {
        path: '/dashboard',
        name: 'TheDashboard',
        component: () => import('../pages/Authed/TheDashboard.vue'),
        meta: {
            title: 'Dashboard',
        },
    },
    {
        path: '/room/:roomId',
        name: 'TheRoom',
        component: () => import('../pages/Authed/TheRoomDetail.vue'),
        props: true,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFound.vue'),
        meta: {
            title: '404',
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-exact',
});

router.afterEach((to) => {
    const roomName = to.params.name;
    const projectName = import.meta.env.VITE_PROJECT_NAME;

    if (roomName) {
        document.title = `${decodeURIComponent(roomName)} | ${projectName}`
    } else if (to.meta.title) {
        document.title = `${to.meta.title} | ${projectName}`;
    } else {
        document.title = projectName;
    }
});

export default router;
