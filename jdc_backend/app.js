"use strict";

const { EventEmitter } = require("events");
const Datastore = require("nedb");
const path = require("path");

EventEmitter.defaultMaxListeners = 30;
class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async didLoad() {
        // 所有的配置已经加载完毕
        this.app.nowdb = new Datastore({ filename: path.join(process.cwd(), "user.db"), timestampData: true });
        this.app.nowdb.loadDatabase((err) => {
            if (err) throw err;
        });
    }

    async beforeClose() {}
}
module.exports = AppBootHook;
