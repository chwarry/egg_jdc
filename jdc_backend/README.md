# jdc_backend



## 开始

<!-- add docs here for user -->

* 下载本项目 确保nodejs为最新版本

* 命令行执行
```bash
$ cd jdc_backend
$ yarn
$ yarn add global uuid
$ node
$ const { v4: uuidv4 } = require("uuid");
$ uuidv4()
$ 2b6992b7-6c14-44cf-ae1a-ef3e7799de26
```
* 得到的uuid 名称 填入 app/config/config.default.js 中
```bash
config.keys = `${appInfo.name}-${uuid}`;
```
*  记住这个 keys 这个是你访问后台的凭证
*  activity.json 活动内容显示json
*  nodelist.json 节点配置json
*  如果是多个容器的话,第一个配置的节点为主容器,其他为分容器
*  同台服务器部署,修改port 参数,并在nodelist.json中配置
```
config.cluster = {
        listen: {
            port: 9998,
            hostname: "127.0.0.1"
        }
    };
```
*  配置文件
```
// add your user config here
const userConfig = {
    QL_URL: "", // 青龙访问地址 http://ip:port 或者直接域名
    QL_DIR: "/ql",
    ALLOW_NUM: 100, //节点最大提供cookie位置
    ALLOW_ADD: 1, //是否允许添加cookie
    NOTIFY: 0, //添加成功后,是否允许通知
    UA: "",
};
```
### 开发

```bash
$ npm i
$ npm run dev
```

### 部署

```bash
$ npm start
$ npm stop
```
