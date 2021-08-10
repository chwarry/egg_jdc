export const routes = [
    {
        name: 'home',
        path: '/',
        component: () => import('@/views/home.vue'),
    },
    {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        redirect: {
            name: 'home',
        },
    },
];
