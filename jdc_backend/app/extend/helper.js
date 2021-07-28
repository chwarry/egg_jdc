"use strict";

const crypto = require("crypto");
module.exports = {
    /**
     * @description
     * @param {*} { data, status }
     */
    returnRes({ code, message }) {
        return {
            code,
            message
        };
    },

    /**
     * @param {!number} milliseconds
     * @return {!Promise}
     */
    delay(milliseconds) {
        return new Promise((_resolve) => setTimeout(_resolve, milliseconds));
    },

    /**
     * @param {!string} src
     * @return {!string}
     */
    hash(src) {
        const md5hash = crypto.createHash("md5");
        md5hash.update(src, "utf8");
        return md5hash.digest("hex");
    }
};
