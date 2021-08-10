/* eslint valid-jsdoc: "off" */

"use strict";

const path = require("path");
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

    //静态文件修改
    config.static = {
        prefix: "/jdc",
        dir: path.join(appInfo.baseDir, "app/jdc")
    };

    // 配置端口
    config.cluster = {
        listen: {
            port: 9998,
            hostname: "127.0.0.1"
        }
    };

    // 取消安全证书验证
    config.security = {
        csrf: {
            enable: false
        },
        domainWhiteList: ["127.0.0.1"] // 白名单
    };
    //cors 配置
    config.cors = {
        origin: "*", // 跨任何域
        allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS" // 被允许的请求方式
    };

    // add your user config here
    const userConfig = {
        QL_URL: "", // 当前节点对应青龙访问地址 http://ip:port 或者直接域名
        QL_DIR: "/ql", // 当前节点对应青龙配置文件地址 -- /ql/config/auth.json
        ALLOW_NUM: 100, //节点最大提供cookie数量
        ALLOW_ADD: 1, //是否允许添加cookie
        NOTIFY: 0, //添加成功后,是否允许通知
        UA: "" //自定义扫码cookie ua
    };
    return {
        ...config,
        ...userConfig
    };
};
