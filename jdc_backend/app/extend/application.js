"use strict";

const { readFile } = require("fs").promises;
const path = require("path");
const QRCode = require("qrcode");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

const { random_time_ua } = require("./helper");

module.exports = {
    async getToken() {
        const qlDir = this.config.QL_DIR || "/ql";
        const authFile = path.join(process.cwd() + qlDir, "config/auth.json");
        const authConfig = JSON.parse(await readFile(authFile));
        return authConfig.token;
    },

    async envHelper() {
        const token = await this.getToken();
        const body = await this.curl(`${this.config.QL_URL}/api/envs?searchValue=JD_COOKIE&t=${Date.now()}`, {
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`
            },
            dataType: "json"
        });
        if (body.status == 200) {
            return body.data.data;
        }
        return [];
    },

    async getPoolInfo() {
        const count = await this.getEnvsCount();
        const allowCount = (this.config.ALLOW_NUM || 40) - count;
        return {
            marginCount: allowCount >= 0 ? allowCount : 0,
            allowAdd: Boolean(this.config.ALLOW_ADD) || true
        };
    },

    async CKLogin() {
        let message, eid, timestamp;
        let nickname = await this.getNicknameOrBean();
        const envs = await this.envHelper();
        const poolInfo = await this.getPoolInfo();
        const env = await envs.find((item) => item.value.match(/pt_pin=(.*?);/)[1] === this.pt_pin);
        if (!env) {
            // 新用户
            if (!poolInfo.allowAdd) {
                throw new qlError("管理员已关闭注册，去其他地方看看吧", -1, 200);
            } else if (poolInfo.marginCount === 0) {
                throw new qlError("本站已到达注册上限，你来晚啦", -1, 200);
            } else {
                let result = await this.addEnv(this.config.currentCookie, nickname);
                if (body.code !== 200) {
                    throw new qlError(body.message || "添加账户错误，请重试", -1, 200);
                }
                eid = result._id;
                timestamp = result.timestamp;
                message = `添加成功，可以愉快的白嫖啦 ${nickname}`;
                await this.getUserInfoByEid(eid);
                const pt_pin = this.config.currentCookie.match(/pt_pin=(.*?);/)[1];
                // 发送通知
                this.sendNotify("egg_jdc 运行通知", `用户 ${nickName}(${decodeURIComponent(pt_pin)}) 已上线"`);
            }
        } else {
            eid = env._id;
            const body = await updateEnv(this.config.currentCookie, eid);
            if (body.code !== 200) {
                throw new qlError(body.message || "更新账户错误，请重试", -1, 200);
            }
            timestamp = body.data.timestamp;
            message = `欢迎回来，${nickname}`;
            await this.getUserInfoByEid(eid);
            const pt_pin = this.config.currentCookie.match(/pt_pin=(.*?);/)[1];
            this.sendNotify("egg_jdc 运行通知", `用户 ${nickname}(${decodeURIComponent(pt_pin)}) 已更新 CK"`);
        }
        return {
            code: 0,
            nickName: nickname,
            eid: eid,
            timestamp: timestamp,
            message
        };
    },

    async getNicknameOrBean(bean) {
        const {
            data: { data }
        } = await this.curl(
            `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
            {
                headers: {
                    Accept: "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn",
                    Connection: "keep-alive",
                    Cookie: this.config.currentCookie,
                    Referer: "https://home.m.jd.com/myJd/newhome.action",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
                    Host: "me-api.jd.com"
                },
                dataType: "json"
            }
        );
        if (bean) {
            return {
                nickName: data.userInfo.baseInfo.nickname || decodeURIComponent(this.pt_pin),
                beanNum: data.assetInfo.beanNum
            };
        } else if (data.userInfo) {
            return data.userInfo.baseInfo.nickname || decodeURIComponent(this.pt_pin);
        }
        this.logger.info(`获取用户信息失败，请检查您的 cookie ！`);
        return "";
    },

    async getEnvsCount() {
        const data = await this.envHelper();
        return data.length;
    },

    async addEnv(cookie, nickname) {
        const token = await this.getToken();
        const body = await this.curl(`${this.config.QL_URL}/api/envs?t=${Date.now()}`, {
            method: "POST",
            contentType: "json",
            dataType: "json",
            data: {
                name: "JD_COOKIE",
                value: cookie,
                remarks: nickname
            },
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
        return body.data.data;
    },
    async updateEnv(cookie, eid, remarks) {
        const token = await this.getToken();
        const body = await this.curl(`${this.config.QL_URL}/api/envs?t=${Date.now()}`, {
            method: "PUT",
            contentType: "json",
            dataType: "json",
            data: {
                name: "JD_COOKIE",
                value: cookie,
                _id: eid,
                remarks
            },
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
        return body.data;
    },
    async delEnv(eid) {
        const token = await this.getToken();
        const body = await this.curl(`${this.config.QL_URL}/api/envs?t=${Date.now()}`, {
            method: "DELETE",
            data: [eid],
            dataType: "json",
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
        return body.data;
    },
    async disableEnv(eid) {
        const token = await this.getToken();
        const body = await this.curl(`${this.config.QL_URL}/api/envs/disable?t=${Date.now()}`, {
            method: "PUT",
            data: [eid],
            dataType: "json",
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
        return body.data;
    },

    async enabledEnv(eid) {
        const token = await this.getToken();
        const body = await this.curl(`${this.config.QL_URL}/api/envs/enable?t=${Date.now()}`, {
            method: "PUT",
            data: [eid],
            dataType: "json",
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
        return body.data;
    },

    async formatSetCookies(headers, body) {
        return new Promise((resolve) => {
            let guid, lsid, ls_token;
            s_token = body.s_token;
            guid = headers["set-cookie"][0];
            guid = guid.substring(guid.indexOf("=") + 1, guid.indexOf(";"));
            lsid = headers["set-cookie"][2];
            lsid = lsid.substring(lsid.indexOf("=") + 1, lsid.indexOf(";"));
            ls_token = headers["set-cookie"][3];
            ls_token = ls_token.substring(ls_token.indexOf("=") + 1, ls_token.indexOf(";"));
            this.config.cookies = `guid=${guid};lang=chs;lsid=${lsid};ls_token=${ls_token};`;
            resolve(s_token);
        });
    },

    async getQRConfig() {
        const taskUrl = `https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`;
        const response = await this.curl(taskUrl, {
            headers: {
                Connection: "Keep-Alive",
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "zh-cn",
                Referer: taskUrl,
                "User-Agent": this.config.UA || random_time_ua(),
                Host: "plogin.m.jd.com"
            },
            dataType: "json"
        });
        const headers = response.headers;
        const data = response.body;
        let s_token = await this.formatSetCookies(headers, data);

        if (s_token) {
            throw new qlError("二维码创建失败！", -1, 200);
        }
        const nowTime = Date.now();
        const taskPostUrl = `https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl?s_token=${s_token}&v=${nowTime}&remember=true`;

        const configRes = await this.curl(taskPostUrl, {
            method: "POST",
            data: {
                lang: "chs",
                appid: 300,
                source: "wq_passport",
                returnurl: `https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action`
            },
            headers: {
                Connection: "Keep-Alive",
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "zh-cn",
                Referer: taskUrl,
                "User-Agent": this.config.UA || random_time_ua(),
                Host: "plogin.m.jd.com",
                Cookie: cookies
            },
            dataType: "json"
        });
        const configHeaders = configRes.headers;
        const configData = configRes.body;

        this.config.token = configData.token;
        if (this.config.token) {
            qRCode = await QRCode.toDataURL(`https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=${token}`);
        }
        const cookies = configHeaders["set-cookie"][0];
        this.config.okl_token = cookies.substring(cookies.indexOf("=") + 1, cookies.indexOf(";"));

        return {
            token: this.config.token,
            cookies: this.config.cookies,
            okl_token: this.config.okl_token,
            qRCode
        };
    },

    async checkQRLogin() {
        if (!this.config.token || !this.config.okl_token || !this.config.cookies) {
            throw new qlError("初始化登录请求失败！", -1, 200);
        }
        const nowTime = Date.now();
        const loginUrl = `https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`;
        const getUserCookieUrl = `https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=${this.config.token}&ou_state=0&okl_token=${this.config.okl_token}`;
        const response = await this.curl(getUserCookieUrl, {
            method: "POST",
            data: {
                lang: "chs",
                appid: 300,
                source: "wq_passport",
                returnurl: `https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action`
            },
            headers: {
                Connection: "Keep-Alive",
                "Content-Type": "application/x-www-form-urlencoded; Charset=UTF-8",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "zh-cn",
                Referer: loginUrl,
                "User-Agent": this.config.UA || random_time_ua(),
                Cookie: this.config.cookies
            },
            dataType: "json"
        });
        const data = response.body;
        const headers = response.headers;
        if (data.errcode === 0) {
            const pt_key = headers["set-cookie"][1];
            this.pt_key = pt_key.substring(pt_key.indexOf("=") + 1, pt_key.indexOf(";"));
            const pt_pin = headers["set-cookie"][2];
            this.pt_pin = pt_pin.substring(pt_pin.indexOf("=") + 1, pt_pin.indexOf(";"));
            this.config.currentCookie = "pt_key=" + this.pt_key + ";pt_pin=" + this.pt_pin + ";";
            try {
                const result = await this.CKLogin();
                return result;
            } catch (error) {
                return {
                    code: error.code,
                    message: error.message
                };
            }
        }

        return {
            code: data.errcode,
            message: data.message
        };
    },

    async getUserInfoByEid(eid) {
        const envs = await this.envHelper();
        const env = await envs.find((item) => item._id === eid);
        if (!env) {
            throw new qlError("没有找到这个账户，重新登录试试看哦", -1, 200);
        }
        this.config.currentCookie = env.value;
        timestamp = env.timestamp;
        const remarks = env.remarks;
        let remark = "";
        if (remarks) {
            remark = remarks.match(/remark=(.*?);/) && remarks.match(/remark=(.*?);/)[1];
        }
        let nickName = await this.getNicknameOrBean();
        return {
            nickName,
            eid,
            timestamp,
            remark
        };
    },

    async updateRemark(eid, remark) {
        if (!eid || !remark || remark.replace(/(^\s*)|(\s*$)/g, "") === "") {
            throw new qlError("参数错误", -1, 200);
        }

        const envs = await getEnvs();
        const env = await envs.find((item) => item._id === this.eid);
        if (!env) {
            throw new qlError("没有找到这个账户，重新登录试试看哦", -1, 200);
        }
        this.config.currentCookie = env.value;

        const remarks = `remark=${this.remark};`;

        const updateEnvBody = await updateEnv(this.config.currentCookie, this.eid, remarks);
        if (updateEnvBody.code !== 200) {
            throw new qlError("更新/上传备注出错，请重试", -1, 200);
        }

        return {
            code: 0,
            message: "更新/上传备注成功"
        };
    },

    async delUserByEid(eid) {
        const body = await this.delEnv(eid);
        if (body.code !== 200) {
            throw new qlError(body.message || "删除账户错误，请重试", -1, 200);
        }
        let { nickName } = await this.getUserInfoByEid(eid);
        const pt_pin = this.config.currentCookie.match(/pt_pin=(.*?);/)[1];
        this.sendNotify("egg_jdc 运行通知", `用户 ${nickName}(${decodeURIComponent(pt_pin)}) 删号跑路了"`);
        return {
            code: 0,
            message: "账户已移除"
        };
    },

    async getAllUser() {
        const envs = await this.envHelper();
        let data = [];
        for (const env of envs) {
            this.config.currentCookie = env.value;
            const pt_pin = env.value.match(/pt_pin=(.*?);/)[1];
            let nickName = await this.getNicknameOrBean();
            data.push({
                pt_pin: pt_pin,
                nickName: nickName,
                remark: env.remarks || nickName
            });
        }
        return data;
    },

    async getJingBeanBalanceDetail(page) {
        const body = await this.curl(`https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail`, {
            method: "POST",
            headers: {
                "User-Agent":
                    "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Host: "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: this.config.currentCookie
            },
            data: {
                body: JSON.stringify({ pageSize: "20", page: page.toString() }),
                appid: "ld"
            },
            dataType: "json"
        });
        return body.data.detailList;
    },

    async getTotalBean() {
        // 定时任务,每天统计获得豆子总数
        let result = [
            { date: "2021-07-28 12:18:52", amount: "1", eventMassage: "观看任务02" },
            { date: "2021-07-28 12:18:51", amount: "1", eventMassage: "分享任务02" },
            { date: "2021-07-28 12:10:58", amount: "1", eventMassage: "签到每日奖励" },
            { date: "2021-07-28 12:10:58", amount: "1", eventMassage: "观看任务01" },
            { date: "2021-07-28 12:10:58", amount: "1", eventMassage: "分享任务01" },
            { date: "2021-07-28 12:09:51", amount: "5", eventMassage: "东东农场转盘抽奖活动" },
            { date: "2021-07-28 12:08:59", amount: "2", eventMassage: "东东农场转盘抽奖活动" },
            { date: "2021-07-28 12:08:56", amount: "2", eventMassage: "东东农场转盘抽奖活动" },
            { date: "2021-07-28 11:19:20", amount: "1", eventMassage: "来客有礼京豆奖励" },
            { date: "2021-07-28 11:18:47", amount: "2", eventMassage: "来客有礼京豆奖励" },
            { date: "2021-07-27 09:00:21", amount: "3", eventMassage: "双签礼包" },
            { date: "2021-07-26 09:00:17", amount: "2", eventMassage: "闪购大牌日瓜分京豆游戏得京豆" }
        ];
        let aaa = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];

            let result1 = dayjs(element.date).isBetween(`${dayjs().format("YYYY-MM-DD")}`, dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"));
            if (result1) {
                aaa.push(element);
            }
        }

        console.log(aaa);

        // const envs = await this.envHelper();
        // let data = [];
        // for (const env of envs) {
        //     this.config.currentCookie = env.value;
        //     const pt_pin = env.value.match(/pt_pin=(.*?);/)[1];
        //     let { nickName, beanNum } = await this.getNicknameOrBean(true);

        //     // let page = 1;
        //     // let condition = 1;
        //     // while (condition === 1) {
        //     //     let result = await this.getJingBeanBalanceDetail(1);

        //     //     page++;
        //     // }
        //     console.log(result);
        //     data.push({
        //         pt_pin: pt_pin,
        //         nickName: nickName,
        //         beanNum
        //     });
        //     break;
        // }
        return aaa;
    },

    async sendNotify(title, content) {
        if (!this.config.NOTIFY) {
            console.log("Ninja 通知已关闭\n" + title + "\n" + content + "\n" + "已跳过发送");
            return;
        }
        exec(`${notifyFile} "${title}" "${content}"`, (error, stdout, stderr) => {
            if (error) {
                console.log(stderr);
            } else {
                console.log(stdout);
            }
        });
    }
};

class qlError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.name = "qlError";
        this.code = code;
        this.statusCode = statusCode || 200;
    }
}
