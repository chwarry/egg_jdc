import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import styleImport from 'vite-plugin-style-import';

function pathResolve(dir) {
    return resolve(process.cwd(), '.', dir);
}

export default defineConfig({
    plugins: [
        vue(),
        styleImport({
            libs: [
                {
                    libraryName: 'element-plus',
                    esModule: true,
                    ensureStyleFile: true,
                    resolveStyle: (name) => {
                        name = name.slice(3);
                        return `element-plus/packages/theme-chalk/src/${name}.scss`;
                    },
                    resolveComponent: (name) => {
                        return `element-plus/lib/${name}`;
                    },
                },
            ],
        }),
    ],
    define: {
        'process.env': process.env,
    },
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
