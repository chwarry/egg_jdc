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
        beforeEnter: (to, from) => {
            let nodeUrl = localStorage.getItem('nodeUrl');
            if (nodeUrl) {
                return true;
            }
            return false;
        },
    },
    {
        name: 'user',
        path: '/user',
        component: () => import('@/views/user.vue'),
        beforeEnter: (to, from) => {
            let nodeUrl = localStorage.getItem('nodeUrl');
            let eid = localStorage.getItem('eid');
            if (nodeUrl && eid) {
                return true;
            }
            return false;
        },
    },
    {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        redirect: {
            name: 'home',
        },
    },
];
