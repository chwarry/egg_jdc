"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
    const { router, controller } = app;
    router.get("/", controller.home.index);
    router.get("/api/qrcode", controller.home.qrCode);
    router.post("/api/check", controller.home.check);
    router.get("/api/userinfo", controller.home.userInfo);
    router.delete("/api/delaccount", controller.home.delAccount);
    router.delete("/api/disaccount", controller.home.disableAccount);
    router.delete("/api/emaaccount", controller.home.enableAccount);
    router.put("/api/update/remark", controller.home.updateMark);
    router.get("/api/getAllUser", controller.home.getAllUser);
    router.get("/api/getBeanChange", controller.home.getBeanChange);
};
