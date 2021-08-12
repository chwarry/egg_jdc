import http from '@/utils/request';

const getJdcInfo = async () => {
    let result = await http.get('/');
    return result;
};

const getNodeList = async () => {
    let result = await http.get('/api/getNodeList');
    return result;
};

const getActivityList = async () => {
    let result = await http.get('/api/getActivity');
    return result;
};

const getGonggao = async () => {
    let result = await http.get('/api/getGonggao');
    return result;
};

const getQrcode = async (url) => {
    let result = await http.get(`${url}/api/qrcode`);
    return result;
};

const checkLoginCookie = async (url, data) => {
    let result = await http.post(`${url}/api/check`, data);
    return result;
};

export { getNodeList, getActivityList, getGonggao, getQrcode, checkLoginCookie, getJdcInfo };
