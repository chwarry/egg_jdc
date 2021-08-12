<template>
    <div
        class="sticky inset-x-0 top-0 z-50 hidden w-full py-1 transition duration-200 ease-in-out border-b  lg:block border-base-200 bg-base-100"
    >
        <div class="mx-auto space-x-1 navbar max-w-none">
            <div class="flex items-center flex-none">
                <a
                    href="/"
                    class="px-2 flex-0 btn btn-ghost md:px-4 nuxt-link-active"
                    aria-label="Homepage"
                >
                    <div class="inline-block text-3xl font-title text-primary">
                        <span class="lowercase">LPP</span>
                        <span class="uppercase text-base-content">JDC </span>
                    </div>
                </a>
            </div>
            <a
                href="https://github.com/xiaojia21190/egg_jdc"
                target="_blank"
                rel="nofollow"
                class="font-mono text-xs opacity-50"
            >
                <div data-tip="Changelog" class="tooltip tooltip-bottom">
                    <span class="hidden lg:inline xl:ml-2">version</span>&nbsp;{{ version }}
                </div>
            </a>
        </div>
    </div>
</template>

<script>
    import { reactive, toRefs, onMounted } from 'vue';
    import { getJdcInfo } from '@/config/api';

    export default {
        setup() {
            const state = reactive({
                version: 0,
            });

            onMounted(async () => {
                state.version = await getJdcInfo();
            });

            return {
                ...toRefs(state),
            };
        },
    };
</script>

<style lang="scss" scoped></style>
