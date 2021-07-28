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

    // add your user config here
    const userConfig = {
        token: "",
        okl_token: "",
        cookies: "",
        currentCookie: "",
        QL_URL: "", // 青龙地址
        QL_DIR: "/ql",
        ALLOW_NUM: 100,
        ALLOW_ADD: 1
    };

    return {
        ...config,
        ...userConfig
    };
};
