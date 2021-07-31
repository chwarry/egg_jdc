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
        currentCookie: "",
        QL_URL: "", // 青龙访问地址 http://ip:port 或者直接域名
        QL_DIR: "/ql",
        ALLOW_NUM: 100, //节点最大提供cookie位置
        ALLOW_ADD: 1, //是否允许添加cookie
        NOTIFY: 0, //添加成功后,是否允许通知
        UA: "",
        USERNAME: "", // ql 登陆账号
        PASSWORD: "", // ql 登陆密码
        QL_PIRESIN: 60 * 60 * 24 * 3 //ql token过期时间
    };
    return {
        ...config,
        ...userConfig
    };
};
