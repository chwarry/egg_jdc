/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {});

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + "_1627433954076_3976";

    // add your middleware config here
    config.middleware = [];

    config.cluster = {
        listen: {
            port: 9998,
            hostname: "127.0.0.1" // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
            // path: '/var/run/egg.sock',
        }
    };

    // add your user config here
    const userConfig = {
        token: "",
        okl_token: "",
        cookies: "",
        currentCookie: "",
        QL_URL: "https://jd.lppfk.top", // 青龙地址
        QL_DIR: "/ql",
        ALLOW_NUM: 100,
        ALLOW_ADD: 1,
        NOTIFY: 0,
        UA: ""
    };

    return {
        ...config,
        ...userConfig
    };
};
