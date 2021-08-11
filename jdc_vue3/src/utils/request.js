import axios from 'axios';

const http = axios.create({
    baseURL: process.env.VUE_APP_CURENV !== 'development' ? 'http://127.0.0.1:9998/' : '',
    timeout: 1000 * 180,
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
    (response) => {
        if (response.data.code === 0) {
            return response.data.result;
        }
    },
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);

export default http;
