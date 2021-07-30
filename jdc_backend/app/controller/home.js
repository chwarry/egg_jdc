"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
    async index() {
        let { keys } = this.ctx.query;
        if (keys == this.app.keys[0]) {
            this.ctx.response.success({
                message: "jac backend is ready"
            });
        } else {
            this.ctx.response.failure({
                code: -1,
                message: "访问失败, 无权访问该节点!"
            });
        }
        // let result = await this.app.getTotalBean(0);
        // this.ctx.response.success({
        //     data: result
        // });
    }
    // 节点列表
    async getNodeList() {
        console.log(this.app.keys);
        let result = await this.app.getNodeList();
        return this.ctx.response.success({
            data: result
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
                    qRCode: config.qRCode
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
            const result = await this.app.checkQRLogin();
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
            const config = await this.app.getUserInfoByEid(this.ctx.query.eid);
            this.ctx.response.success({
                data: {
                    token: config.token,
                    okl_token: config.okl_token,
                    cookies: config.cookies,
                    qRCode: config.qRCode
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
