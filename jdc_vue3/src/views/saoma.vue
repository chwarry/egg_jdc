<template>
    <div>
        <div class="card bordered">
            <div class="card-body">
                <h4 class="card-title">扫码登陆</h4>
                <p
                    >请点击下方按钮登录，点击按钮后回到本网站查看是否登录成功，京东的升级提示不用管。</p
                >
                <div class="card-actions">
                    <button class="btn btn-primary" @click="saomiao">扫描二维码登录</button>
                    <button class="btn btn-accent" @click="openJdUrl">跳转到京东 App 登录</button>
                </div>
            </div>
            <figure v-if="saomiaoFlag">
                <img :src="qRCode" />
            </figure>
        </div>
    </div>
</template>

<script>
    import { reactive, toRefs, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { getActivityList, getQrcode, checkLoginCookie } from '@/config/api';
    import { ElMessage, ElLoading } from 'element-plus';

    export default {
        setup() {
            const router = useRouter();
            const route = useRoute();
            const state = reactive({
                qRCode: '',
                activityList: [],
                token: '',
                cookies: '',
                okl_token: '',
                saomiaoFlag: false,
                loading: false,
                interval: null,
            });

            const getQRConfig = async () => {
                state.loading = ElLoading.service({
                    lock: true,
                    text: '正在生成二维码...',
                });
                let result = (await getQrcode(route.params.url)).result;
                if (result) {
                    console.log(result);
                    state.qRCode = result.qRCode;
                    state.token = result.token;
                    state.cookies = result.cookies;
                    state.okl_token = result.okl_token;

                    localStorage.setItem('okl_token', result.okl_token);
                    localStorage.setItem('cookies', result.cookies);
                    localStorage.setItem('token', result.token);

                    state.loading.close();
                    state.interval = setInterval(checkLogin, 2 * 1000);
                }
            };

            const checkLogin = async () => {
                // 检查登陆
                let checkData = {
                    token: state.token || localStorage.getItem('token'),
                    cookies: state.cookies || localStorage.getItem('cookies'),
                    okl_token: state.okl_token || localStorage.getItem('okl_token'),
                };
                let result = await checkLoginCookie(route.params.url, checkData);
                console.log(result);
                // if (result.code === 0) {
                // clearInterval(state.interval);
                // ElMessage.success(result.message);
                // localStorage.setItem('eid', result.result.eid);
                // this.$router.push({ path: '/user' });
                // } else {
                //跳转页面
                // this.$router.push({ path: '/home' });
                // }
                //清空二维码
                // this.imageBase = '';
                // localStorage.removeItem('okl_token');
                // localStorage.removeItem('cookies');
                // localStorage.removeItem('token');
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

            onMounted(() => {});

            return {
                ...toRefs(state),
                openJdUrl,
                saomiao,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
