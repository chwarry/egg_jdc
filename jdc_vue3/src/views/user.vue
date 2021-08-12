<template>
    <div class="m-10 shadow-lg card bordered">
        <div class="card-body">
            <h4 class="card-title">{{ userInfo.nickName }}</h4>
            <p>账号状态: {{ statusInfo }}</p>
            <div class="card-actions">
                <button class="btn btn-primary" @click="logout">退出登陆</button>
                <button class="btn btn-accent" @click="updateZh">更新过期账号</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { toRefs, reactive, onMounted, computed } from 'vue';
    import { getUserInfo, getActivityList, deleteUser } from '@/config/api';
    import { ElLoading } from 'element-plus';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';

    export default {
        setup() {
            let nodeUrl = '';
            let eid = '';

            const title = useTitle();
            title.value = '个人中心';
            const router = useRouter();

            const state = reactive({
                userInfo: {},
                loading: false,
                activityList: [],
            });

            const statusInfo = computed(() => {
                let text = '';
                switch (state.userInfo.status) {
                    case 0:
                        text = '正常';
                        break;
                    case 1:
                        text = '禁用';
                        break;

                    default:
                        text = '未知状态';
                        break;
                }
                return text;
            });

            const logout = async () => {
                // 全部清除
                localStorage.clear();
                router.push({ name: 'home' });
            };
            const updateZh = async () => {
                // 删除登陆结果
                await deleteUser(nodeUrl, eid);
                localStorage.removeItem('eid');
                router.push({ name: 'saoma' });
            };

            onMounted(async () => {
                state.loading = ElLoading.service({
                    lock: true,
                    text: '正在生成个人信息...',
                });
                nodeUrl = localStorage.getItem('nodeUrl');
                eid = localStorage.getItem('eid');
                // 获得个人信息
                state.userInfo = await getUserInfo(nodeUrl, eid);
                // 获得活动列表
                state.activityList = await getActivityList();

                state.loading.close();
            });

            return {
                ...toRefs(state),
                statusInfo,
                logout,
                updateZh,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
