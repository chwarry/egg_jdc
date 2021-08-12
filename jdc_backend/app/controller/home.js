"use strict";

const Controller = require("egg").Controller;

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { readFile } = require("fs").promises;
class HomeController extends Controller {
    async index() {
        this.ctx.response.success({
            data: JSON.parse(await readFile(path.join(process.cwd(), "package.json"))).version,
            message: "egg_jdc backend is ready"
        });
    }
    // 节点列表
    async getNodeList() {
        console.log(this.app.keys);
        let result = await this.app.getNodeList();
        result.forEach((i, index) => {
            result[index]["_id"] = uuidv4();
        });
        for (const iterator of result) {
            let nodeInfo = await this.ctx.curl(`${iterator.url}/api/getNodeInfo`, {
                dataType: "json"
            });
            let index = result.findIndex((v) => {
                return v._id == iterator._id;
            });
            if (nodeInfo.data.code === 0) {
                result[index] = Object.assign(nodeInfo.data.result, result[index]);
                // 设备在线
                result[index]["activite"] = true;
            } else {
                result[index]["activite"] = false;
            }
        }
        this.ctx.response.success({
            data: result
        });
    }

    async getActivity() {
        const activityFile = path.join(process.cwd(), "activity.json");
        const ativityConfig = JSON.parse(await readFile(activityFile));
        this.ctx.response.success({
            data: ativityConfig
        });
    }

    async getGonggao() {
        const activityFile = path.join(process.cwd(), "gongao.json");
        const ativityConfig = JSON.parse(await readFile(activityFile));
        this.ctx.response.success({
            data: ativityConfig
        });
    }

    async getBeanChange() {
        try {
            let result = await this.app.getTotalBean(this.ctx.query.type);
            this.ctx.response.success({
                data: result
            });
        } catch (error) {
            this.ctx.response.failure({
                code: -1,
                message: "接口限制, 访问失败!"
            });
        }
    }

    async getNodeInfo() {
        try {
            let result = await this.app.getPoolInfo();
            this.ctx.response.success({
                data: result
            });
        } catch (error) {
            this.ctx.response.failure({
                code: -1,
                message: "接口限制, 访问失败!"
            });
        }
    }

    async qrCode() {
        try {
            const config = await this.app.getQRConfig();
            this.ctx.response.success({
                data: {
                    token: config.token,
                    okl_token: config.okl_token,
                    cookies: config.cookies,
                    qRCode: config.qRCode,
                    qRCodeImg: config.qRCodeImg
                }
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }

    async check() {
        try {
            let { token, okl_token, cookies } = this.ctx.request.body;
            const result = await this.app.checkQRLogin(token, okl_token, cookies);
            this.ctx.response.success({
                data: result
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }

    async userInfo() {
        try {
            const { nickName, eid, timestamp, remark, status } = await this.app.getUserInfoByEid(this.ctx.query.eid);
            this.ctx.response.success({
                data: {
                    nickName,
                    eid,
                    timestamp,
                    remark,
                    status
                }
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }

    async delAccount() {
        try {
            let { eid } = ctx.request.body;
            let { message } = await this.app.delUserByEid(eid);
            this.ctx.response.success({
                message
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }

    async disableAccount() {
        try {
            let { eid } = ctx.request.body;
            let { message } = await this.app.disableEnv(eid);
            this.ctx.response.success({
                message
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }
    async enableAccount() {
        try {
            let { eid } = ctx.request.body;
            let { message } = await this.app.enabledEnv(eid);
            this.ctx.response.success({
                message
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }

    async updateMark() {
        try {
            let { eid, remark } = ctx.request.body;
            await this.app.updateRemark(eid, remark);
            this.ctx.response.success({
                message
            });
        } catch (error) {
            this.ctx.response.failure({
                code: error.code,
                message: error.message
            });
        }
    }

    async getAllUser() {
        let { keys } = this.ctx.query;
        if (keys == this.app.keys[0]) {
            let result = await this.app.getAllUser();
            this.ctx.response.success({
                data: result
            });
        } else {
            this.ctx.response.failure({
                code: -1,
                message: "访问失败, 无权访问该节点!"
            });
        }
    }
}

module.exports = HomeController;
