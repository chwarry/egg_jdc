"use strict";

module.exports = {
    /**
     * @description
     * @param {*} { data, status }
     */
    success({ data, status, message }) {
        const { ctx } = this;
        ctx.body = {
            code: 0,
            message: message || "success",
            result: data || null
        };
        ctx.status = status || 200;
    },

    /**
     * @description
     * @param {*} { status, code, message, data }
     */
    failure({ status, code, message, data }) {
        const { ctx } = this;
        ctx.body = {
            code: code || "-1",
            message: message || "no message",
            result: data || null
        };
        ctx.status = status || 200;
    }
};
