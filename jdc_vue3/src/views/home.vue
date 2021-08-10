<template>
    <div class="flex flex-col justify-center align-middle lg:flex-row">
        <div class="card lg:card-side bordered" v-for="(i, index) in [1, 2, 3]" :key="index">
            <div class="card-body">
                <h2 class="card-title">{{ rest }}</h2>
                <p
                    >Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                    necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p
                >
                <div class="card-actions">
                    <button class="btn btn-primary">Get Started</button>
                    <button class="btn btn-ghost">More info</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    export default {
        setup() {
            let rest = ref('');
            rest = 'test1231231';
            return {
                rest,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
