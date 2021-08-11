import { ElMessage, ElLoading } from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const setElement = (app) => {
    app.use(ElMessage);
    app.use(ElLoading);
};

export { setElement };
