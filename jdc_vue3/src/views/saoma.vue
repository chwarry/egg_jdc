<template>
    <div class="m-10 shadow-lg card bordered">
        <div class="card-body">
            <h4 class="card-title">扫码登陆</h4>
            <p>请点击下方按钮登录，点击按钮后回到本网站查看是否登录成功，京东的升级提示不用管。</p>
            <p>选择登陆的节点: ({{ nodeName }}})</p>
            <div class="card-actions">
                <button class="btn btn-primary" @click="saomiao">扫描二维码登录</button>
                <button class="btn btn-accent" @click="openJdUrl">跳转到京东 App 登录</button>
            </div>
        </div>
        <div v-if="saomiaoFlag" class="flex justify-start mb-10 ml-10 align-middle">
            <img :src="qRCode" class="w-40 lg:w-56" />
        </div>
    </div>
</template>

<script>
    import { reactive, toRefs, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { getQrcode, checkLoginCookie } from '@/config/api';
    import { ElMessage, ElLoading } from 'element-plus';
    import { useTitle, useIntervalFn } from '@vueuse/core';

    export default {
        setup() {
            const title = useTitle();
            title.value = '扫码';
            const router = useRouter();
            const route = useRoute();
            let nodeUrl = '';
            const state = reactive({
                qRCode: '',
                activityList: [],
                token: '',
                cookies: '',
                okl_token: '',
                saomiaoFlag: false,
                loading: false,
                nodeName: '',
            });

            const { pause, resume, isActive } = useIntervalFn(checkLogin, 2 * 1000, {
                immediate: false,
                immediateCallback: true,
            });

            const getQRConfig = async () => {
                if (!nodeUrl) {
                    ElMessage.error('没有选择节点, 跳转到首页');
                    router.push({ path: '/' });
                    return;
                }
                state.loading = ElLoading.service({
                    lock: true,
                    text: '正在生成二维码...',
                });
                let result = await getQrcode(nodeUrl);
                if (result) {
                    console.log(result);
                    // 生成二维吗
                    state.qRCode = result.qRCodeImg;
                    state.token = result.token;
                    state.cookies = result.cookies;
                    state.okl_token = result.okl_token;

                    localStorage.setItem('okl_token', result.okl_token);
                    localStorage.setItem('cookies', result.cookies);
                    localStorage.setItem('token', result.token);

                    state.loading.close();

                    resume();
                }
            };

            const checkLogin = async () => {
                // 检查登陆
                let checkData = {
                    token: state.token || localStorage.getItem('token'),
                    cookies: state.cookies || localStorage.getItem('cookies'),
                    okl_token: state.okl_token || localStorage.getItem('okl_token'),
                };
                let result = await checkLoginCookie(nodeUrl, checkData);
                console.log(result);
                if (result.code === 0) {
                    pause();
                    ElMessage.success(result.message || `欢迎回来  ${result.nickName}`);
                    localStorage.setItem('eid', result.eid);
                    router.push({ path: '/user' });
                } else if (result.code === 2) {
                    pause();
                    ElMessage.error(result.message);
                    //跳转回首页,重新加入
                    state.qRCode = '';
                    localStorage.removeItem('okl_token');
                    localStorage.removeItem('cookies');
                    localStorage.removeItem('token');
                    router.push({ path: '/' });
                }
            };

            const saomiao = async () => {
                await getQRConfig();
                state.saomiaoFlag = true;
            };

            const openJdUrl = async () => {
                let wx = navigator.userAgent.toLowerCase();
                if (wx.match(/MicroMessenger/i) == 'micromessenger') {
                    ElMessage(
                        '当前环境为微信环境, 请点击右上角,浏览器里打开,使用此功能,或者直接扫码登陆'
                    );
                    return;
                }
                if (!state.token) {
                    await getQRConfig();
                }
                const href = `openapp.jdmobile://virtual/ad?params={"category":"jump","des":"ThirdPartyLogin","action":"to","onekeylogin":"return","url":"https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=${state.token}","authlogin_returnurl":"weixin://","browserlogin_fromurl":"${window.location.host}"}`;
                window.location.href = href;
            };

            onMounted(() => {
                nodeUrl = localStorage.getItem('nodeUrl');
                state.nodeName = localStorage.getItem('nodeName');
            });

            return {
                ...toRefs(state),
                openJdUrl,
                saomiao,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
