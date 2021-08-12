<template>
    <div class="m-5 shadow-lg card">
        <div class="card-body">
            <h4 class="card-title">{{ gonggao.title }}</h4>
            <p>{{ gonggao.content }}</p>
        </div>
    </div>
    <div class="divider"></div>
    <div class="flex flex-col justify-start align-middle lg:flex-row">
        <div
            class="m-5 shadow-lg card lg:card-side bordered"
            v-for="(item, index) in nodeList"
            :key="index"
        >
            <div class="card-body">
                <h4 class="card-title">{{ item.name }}</h4>
                <div v-if="item.activite">
                    <progress
                        class="progress progress-accent"
                        :value="item.marginCount"
                        :max="item.allCount"
                    ></progress>
                    <div class="flex justify-between mt-5">
                        <p>余量:{{ item.marginCount }}</p>
                        <p>最大:{{ item.allCount }}</p>
                    </div>
                </div>
                <div v-else>
                    <p>本节点已离线,请选择其他节点</p>
                </div>

                <div class="card-actions" v-if="item.activite">
                    <button class="btn btn-primary" @click="addJieDian(item)">加入节点</button>
                    <button class="btn btn-accent" @click="jiedianDetail">节点详情</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getNodeList, getGonggao } from '@/config/api';
    import { onMounted, reactive, toRefs } from 'vue';
    import { ElMessage, ElLoading } from 'element-plus';
    import { useRouter } from 'vue-router';

    export default {
        setup() {
            const router = useRouter();
            let state = reactive({
                nodeList: [],
                gonggao: {},
                loading: null,
            });

            onMounted(async () => {
                state.loading = ElLoading.service({
                    lock: true,
                    text: '正在加载中...',
                });
                let res = await getNodeList();
                console.log(res);
                state.nodeList = res;
                state.gonggao = await getGonggao();

                state.loading.close();
            });

            const addJieDian = (item) => {
                if (item.marginCount > 0) {
                    ElMessage.success('点击进入扫码界面');
                    localStorage.setItem('nodeUrl', item.url);
                    localStorage.setItem('nodeName', item.name);
                    router.push({ name: 'saoma' });
                } else {
                    ElMessage.warning('没有位置了, 选择其他节点');
                }
            };

            const jiedianDetail = () => {
                ElMessage.warning('正在开发中...');
                console.log('进入节点详情, 需要输入对应keys');
            };

            return {
                ...toRefs(state),
                addJieDian,
                jiedianDetail,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
