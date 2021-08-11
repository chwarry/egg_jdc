export const routes = [
    {
        name: 'home',
        path: '/',
        component: () => import('@/views/home.vue'),
    },
    {
        name: 'saoma',
        path: '/saoma',
        component: () => import('@/views/saoma.vue'),
    },
    {
        name: 'user',
        path: '/user',
        component: () => import('@/views/user.vue'),
    },
    {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        redirect: {
            name: 'home',
        },
    },
];
