# jdc_backend



## 开始

<!-- add docs here for user -->

* 下载本项目 确保nodejs为最新版本

* 命令行执行
```bash
$ cd jdc_backend
$ yarn
$ node
$ const { v4: uuidv4 } = require("uuid");
$ uuidv4()
$ 2b6992b7-6c14-44cf-ae1a-ef3e7799de26
```
* 得到的uuid 名称 填入 app/config/config.default.js
```bash
config.keys = `${appInfo.name}-${uuid}`;
```
* 记住这个 keys 这个是你访问后台的凭证

### 开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:9998/
```

### 部署

```bash
$ npm start
$ npm stop
```
