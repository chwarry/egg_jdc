"use strict";
const { Subscription } = require("egg");

class BeanChange extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: "0 59 23 * * *", // 每天晚上11:28分 统计当天豆子
            type: "worker",
            env: ["prod"]
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        await this.app.getTotalBean();
    }
}

module.exports = BeanChange;
