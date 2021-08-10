import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function pathResolve(dir) {
    return resolve(process.cwd(), '.', dir);
}

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: pathResolve('src') + '/',
            },
        ],
        dedupe: ['vue'],
    },
});