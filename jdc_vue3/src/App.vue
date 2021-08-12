<template>
    <div>
        <Header />
        <RouterView />
    </div>
</template>

<script>
    import Header from '@/component/header.vue';
    export default {
        components: {
            Header,
        },
        setup() {
            return {};
        },
    };
</script>

<style lang="css" scoped></style>
