"use strict";

const { EventEmitter } = require("events");

EventEmitter.defaultMaxListeners = 30;
class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async didLoad() {
        // 所有的配置已经加载完毕
    }

    async beforeClose() {}
}
module.exports = AppBootHook;
