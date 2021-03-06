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
    async getNodeList() {
        let filePath = path.join(process.cwd(), "nodelist.json");
        let resdata = await readFile(filePath, { encoding: "utf-8" });
        return JSON.parse(resdata);
    },

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
            allowAdd: Boolean(this.config.ALLOW_ADD) || true,
            allCount: this.config.ALLOW_NUM
        };
    },

    async CKLogin(currentCookie) {
        let message, eid;
        let nickname = await this.getNicknameOrBean(currentCookie);
        const envs = await this.envHelper();
        const poolInfo = await this.getPoolInfo();
        const env = await envs.find((item) => item.value.match(/pt_pin=(.*?);/)[1] === this.pt_pin);
        if (!env) {
            // ?????????
            if (!poolInfo.allowAdd) {
                throw new qlError("???????????????????????????????????????????????????", -1, 200);
            } else if (poolInfo.marginCount === 0) {
                throw new qlError("??????????????????????????????????????????", -1, 200);
            } else {
                console.log(currentCookie);
                console.log(nickname);
                console.log("????????????");
                // let result = await this.addEnv(currentCookie, nickname);
                // if (body.code !== 200) {
                //     throw new qlError(body.message || "??????????????????????????????", -1, 200);
                // }
                // eid = result._id;
                // message = `??????????????????????????????????????? ${nickname}`;
                // const pt_pin = currentCookie.match(/pt_pin=(.*?);/)[1];
                // // ????????????
                // this.sendNotify("egg_jdc ????????????", `?????? ${nickName}(${decodeURIComponent(pt_pin)}) ?????????"`);
            }
        } else {
            eid = env._id;
            console.log(currentCookie);
            console.log(nickname);
            console.log("????????????");
            // const body = await updateEnv(currentCookie, eid);
            // if (body.code !== 200) {
            //     throw new qlError(body.message || "??????????????????????????????", -1, 200);
            // }
            message = `???????????????${nickname}`;
            // const pt_pin = currentCookie.match(/pt_pin=(.*?);/)[1];
            // this.sendNotify("egg_jdc ????????????", `?????? ${nickname}(${decodeURIComponent(pt_pin)}) ????????? CK"`);
            // this.enabledEnv(eid)
        }
        return {
            code: 0,
            eid: eid,
            timestamp: dayjs().format("YYYY-MM-DD HH:hh:mm"),
            message
        };
    },

    async getNicknameOrBean(currentCookie, bean) {
        const { data: result } = await this.curl(
            `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
            {
                headers: {
                    Accept: "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn",
                    Connection: "keep-alive",
                    Cookie: currentCookie,
                    Referer: "https://home.m.jd.com/myJd/newhome.action",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
                    Host: "me-api.jd.com"
                },
                dataType: "json"
            }
        );
        if (result.retcode === "0") {
            if (bean) {
                return {
                    nickName: result.data.userInfo.baseInfo.nickname,
                    beanNum: result.data.assetInfo.beanNum
                };
            } else {
                return result.data.userInfo.baseInfo.nickname;
            }
        }
        this.logger.info(`?????????????????????????????????????????? cookie ???`);
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

    formatSetCookies(headers, body) {
        let guid, lsid, ls_token, cookqr, s_token;
        s_token = body.s_token;
        guid = headers["set-cookie"][0];
        guid = guid.substring(guid.indexOf("=") + 1, guid.indexOf(";"));
        lsid = headers["set-cookie"][2];
        lsid = lsid.substring(lsid.indexOf("=") + 1, lsid.indexOf(";"));
        ls_token = headers["set-cookie"][3];
        ls_token = ls_token.substring(ls_token.indexOf("=") + 1, ls_token.indexOf(";"));
        cookqr = `guid=${guid};lang=chs;lsid=${lsid};ls_token=${ls_token};`;
        return {
            s_token,
            cookqr
        };
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
        const data = response.data;
        let { s_token, cookqr } = this.formatSetCookies(headers, data);

        if (!s_token) {
            throw new qlError("????????????????????????", -1, 200);
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
                Cookie: cookqr
            },
            dataType: "json"
        });
        const configHeaders = configRes.headers;
        const configData = configRes.data;

        const token = configData.token;
        let qrcode;
        let qRCodeImg;
        if (token) {
            qrcode = `https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=${token}`;
            qRCodeImg = await QRCode.toDataURL(qrcode);
        }

        const cookies = configHeaders["set-cookie"][0];
        const okl_token = cookies.substring(cookies.indexOf("=") + 1, cookies.indexOf(";"));
        // ?????????terminal
        QRCode.toString(qrcode, { type: "terminal", scale: 1, small: true }, function (err, string) {
            if (err) throw err;
            console.log(string);
        });
        return {
            token: token,
            cookies: cookqr,
            okl_token: okl_token,
            qRCode: qrcode,
            qRCodeImg
        };
    },

    async checkQRLogin(token, okl_token, cookies) {
        if (!token || !okl_token || !cookies) {
            throw new qlError("??????????????????????????????", -1, 200);
        }
        const nowTime = Date.now();
        const loginUrl = `https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`;
        const getUserCookieUrl = `https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=${token}&ou_state=0&okl_token=${okl_token}`;

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
                Cookie: cookies
            },
            dataType: "json"
        });
        const data = response.data;
        const headers = response.headers;
        if (data.errcode === 0) {
            const pt_key = headers["set-cookie"][1];
            this.pt_key = pt_key.substring(pt_key.indexOf("=") + 1, pt_key.indexOf(";"));
            const pt_pin = headers["set-cookie"][2];
            this.pt_pin = pt_pin.substring(pt_pin.indexOf("=") + 1, pt_pin.indexOf(";"));
            const currentCookie = "pt_key=" + this.pt_key + ";pt_pin=" + this.pt_pin + ";";
            try {
                const result = await this.CKLogin(currentCookie);
                return result;
            } catch (error) {
                return {
                    code: 2,
                    message: "???????????????????????????"
                };
            }
        }

        return {
            code: -1,
            message: "????????????????????????"
        };
    },

    async getUserInfoByEid(eid) {
        const envs = await this.envHelper();
        const env = await envs.find((item) => item._id === eid);
        if (!env) {
            throw new qlError("???????????????????????????????????????????????????", -1, 200);
        }
        const currentCookie = env.value;
        const remarks = env.remarks;
        let remark = "";
        if (remarks) {
            remark = remarks.match(/remark=(.*?);/) && remarks.match(/remark=(.*?);/)[1];
        }
        let nickName = await this.getNicknameOrBean(currentCookie);
        return {
            nickName,
            eid,
            timestamp: dayjs(env.timestamp).format("YYYY-MM-DD HH:hh:mm"),
            remark,
            status: env.status
        };
    },

    async updateRemark(eid, remark) {
        if (!eid || !remark || remark.replace(/(^\s*)|(\s*$)/g, "") === "") {
            throw new qlError("????????????", -1, 200);
        }

        const envs = await getEnvs();
        const env = await envs.find((item) => item._id === this.eid);
        if (!env) {
            throw new qlError("???????????????????????????????????????????????????", -1, 200);
        }

        const remarks = `remark=${this.remark};`;

        const updateEnvBody = await updateEnv(env.value, this.eid, remarks);
        if (updateEnvBody.code !== 200) {
            throw new qlError("??????/??????????????????????????????", -1, 200);
        }

        return {
            code: 0,
            message: "??????/??????????????????"
        };
    },

    async delUserByEid(eid) {
        const body = await this.delEnv(eid);
        if (body.code !== 200) {
            throw new qlError(body.message || "??????????????????????????????", -1, 200);
        }
        let { nickName, pt_pin } = await this.getUserInfoByEid(eid);
        this.sendNotify("egg_jdc ????????????", `?????? ${nickName}(${decodeURIComponent(pt_pin)}) ???????????????"`);
        return {
            code: 0,
            message: "???????????????"
        };
    },

    async getAllUser() {
        const envs = await this.envHelper();
        let data = [];
        for (const env of envs) {
            const pt_pin = env.value.match(/pt_pin=(.*?);/)[1];
            let nickName = await this.getNicknameOrBean(env.value);
            data.push({
                pt_pin: pt_pin,
                nickName: nickName,
                remark: env.remarks || nickName
            });
        }
        return data;
    },

    async getJingBeanBalanceDetail(page, cookie) {
        const body = await this.curl(`https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail`, {
            method: "POST",
            headers: {
                "User-Agent":
                    "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Host: "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: cookie
            },
            data: {
                body: JSON.stringify({ pageSize: "1000", page: page.toString() }),
                appid: "ld"
            },
            dataType: "json"
        });
        return body.data.detailList;
    },

    async getBeanByMouth(type, eid) {
        let befroeDate1 = "";
        let befroeDate2 = "";
        switch (type) {
            case 0:
                // 1??????????????????
                befroeDate1 = `${dayjs().subtract(7, "day").format("YYYY-MM-DD")}`;
                befroeDate2 = dayjs().add(1, "day").format("YYYY-MM-DD");
                break;
            case 1:
                // 1??????????????????
                befroeDate1 = `${dayjs().subtract(1, "mouth").format("YYYY-MM-DD")}`;
                befroeDate2 = dayjs().add(1, "day").format("YYYY-MM-DD");
                break;

            default:
                break;
        }
        // ????????????????????????
        let result = await this.findDoc({ _id: eid });
        let beanList = [];
        for (let i = 0; i < result.todayBeanNumber.length; i++) {
            const element = result.todayBeanNumber[i];
            let flag = dayjs(element.date).isBetween(befroeDate1, befroeDate2, type == 0 ? "day" : "mouth");
            if (flag) {
                beanList.push(element);
            } else {
                break;
            }
        }
        return beanList;
    },

    async getTotalBean() {
        // ????????????,??????????????????????????????
        const envs = await this.envHelper();
        let todayBeanChange = [];
        for (const env of envs) {
            const pt_pin = env.value.match(/pt_pin=(.*?);/)[1];
            let { nickName, beanNum } = await this.getNicknameOrBean(env.value, true);
            let condition = 0;
            let page = 1;
            let todaybeanList = [];
            do {
                let beanList = await this.getJingBeanBalanceDetail(page, env.value);
                let breakflag = false;
                for (let i = 0; i < beanList.length; i++) {
                    const element = beanList[i];
                    let flag = dayjs(element.date).isBetween(`${dayjs().format("YYYY-MM-DD")}`, dayjs().add(1, "day").format("YYYY-MM-DD"));
                    if (flag) {
                        todaybeanList.push(Number(element.amount));
                    } else {
                        breakflag = true;
                        break;
                    }
                }
                if (breakflag) {
                    break;
                }
                page++;
            } while (condition === 0);

            let tadayBeanNumber = todaybeanList.reduce((a, b) => {
                return a + b;
            }, 0);
            // ???????????????????????????
            let result = await this.findDoc({ id: env._id });

            let doc;
            if (result) {
                let index = result.todayBeanNumber.findIndex((v) => {
                    return v.date == dayjs().format("YYYY-MM-DD");
                });
                result.todayBeanNumber[index] = {
                    date: dayjs().format("YYYY-MM-DD"),
                    tadayBeanNumber
                };
                doc = await this.updateDoc({ _id: result._id }, result);
            } else {
                let itr = {
                    id: env._id,
                    pt_pin: pt_pin,
                    nickName: nickName,
                    totalBeanNumber: beanNum,
                    todayBeanNumber: [
                        {
                            date: dayjs().format("YYYY-MM-DD"),
                            tadayBeanNumber
                        }
                    ]
                };
                doc = await this.inertDoc(itr);
            }
            todayBeanChange.push(doc);
        }
        return todayBeanChange;
    },

    async findDoc(partern) {
        return new Promise((resolve) => {
            this.nowdb.findOne(partern, (err, docs) => {
                if (err) {
                    this.logger.error(err);
                } else {
                    resolve(docs);
                }
            });
        });
    },

    async inertDoc(doc) {
        return new Promise((resolve) => {
            this.nowdb.insert(doc, (err, docs) => {
                if (err) {
                    this.logger.error(err);
                } else {
                    resolve(docs);
                }
            });
        });
    },
    async updateDoc(partern, doc) {
        return new Promise((resolve) => {
            this.nowdb.update(partern, doc, { returnUpdatedDocs: true }, (err, num, docs) => {
                if (err) {
                    this.logger.error(err);
                } else {
                    resolve(docs);
                }
            });
        });
    },

    async sendNotify(title, content) {
        if (!this.config.NOTIFY) {
            this.logger.info("Ninja ???????????????\n" + title + "\n" + content + "\n" + "???????????????");
            return;
        }
        exec(`${notifyFile} "${title}" "${content}"`, (error, stdout, stderr) => {
            if (error) {
                this.logger.info(stderr);
            } else {
                this.logger.info(stdout);
            }
        });
    },

    async checkCookie() {
        for (const env of envs) {
            const pt_pin = env.value.match(/pt_pin=(.*?);/)[1];
            let nickName = await this.getNicknameOrBean(env.value);

            if (!nickName && env.status != 1) {
                this.disableEnv(env._id);
                this.sendNotify(`??????cookie--${nickname}(${decodeURIComponent(pt_pin)})`, env.value);
            }
        }
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
