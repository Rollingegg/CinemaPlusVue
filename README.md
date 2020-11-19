# CinemaPlusVue

影院管理系统——人机交互课设重构版

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

调用本地后端接口(可以在`.env.local`文件中修改相关变量)

```
npm run dev:local
```

调用远程后端接口(可以在`.env.development`文件中修改相关变量)

```
npm run dev:remote
```

### Compiles and minifies for production

```
yarn build
```

### 配置保存文件时的自动修复

#### VScode

下载Eslint插件，在setting.json中配置如下

```json
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue",
    "html"
], // 配置 ESLint 检查的文件类型
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}, // 保存时按照eslint的规则格式化
"editor.formatOnSave": true, // 保存时自动格式化代码。可以实现保存时自动格式化style代码
```

#### WebStorm

在`File | Settings | Languages & Frameworks | JavaScript | Code Quality Tools | ESLint`中勾选`Run Eslint --fix on save`

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).