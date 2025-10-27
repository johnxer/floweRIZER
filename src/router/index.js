import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/config';

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
            requiresAuth: true,
        },
    },
    {
        path: '/account',
        name: 'Account',
        component: () => import('../pages/Authed/AccountSettings.vue'),
        meta: {
            title: 'Account',
            requiresAuth: true,
        },
    },
    {
        path: '/room/:roomId',
        name: 'TheRoomDetail',
        component: () => import('../pages/Authed/TheRoomDetail.vue'),
        props: true,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/plant/:plantId',
        name: 'ThePlantDetail',
        component: () => import('../pages/Authed/ThePlantDetail.vue'),
        props: true,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/plant/add',
        name: 'AddPlant',
        component: () => import('../pages/Authed/AddEditPlant.vue'),
        meta: {
            title: 'Add new plant',
            requiresAuth: true,
        },
    },
    {
        path: '/plant/edit/:id',
        name: 'EditPlant',
        component: () => import('../pages/Authed/AddEditPlant.vue'),
        props: true,
        meta: {
            title: 'Edit plant',
            requiresAuth: true,
        },
    },
    {
        path: '/room/add',
        name: 'AddRoom',
        component: () => import('../pages/Authed/AddEditRoom.vue'),
        meta: {
            title: 'Add new room',
            requiresAuth: true,
        },
    },
    {
        path: '/room/edit/:id',
        name: 'EditRoom',
        component: () => import('../pages/Authed/AddEditRoom.vue'),
        props: true,
        meta: {
            title: 'Edit room',
            requiresAuth: true,
        },
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
        document.title = `${decodeURIComponent(roomName)} | ${projectName}`;
    } else if (to.meta.title) {
        document.title = `${to.meta.title} | ${projectName}`;
    } else {
        document.title = projectName;
    }
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!auth.currentUser;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'NotAuthed', query: { redirect: to.fullPath } });
    } else if ((to.name === 'NotAuthed' && isAuthenticated)) {
        if (from.name) {
            next(from.fullPath);
        } else {
            next({ name: 'TheDashboard' });
        }
    } else {
        next();
    }
});


export default router;
