import axios from 'axios';

const http = axios.create({
    baseURL: process.env.VUE_APP_CURENV !== 'development' ? 'http://127.0.0.1:9998/' : '',
    timeout: 1000 * 180,
    withCredentials: true,
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
    (config) => {
        console.log(config);
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
        return response;
    },
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);

export default http;
