1. # 阿尔蓝松宠物社区app项目

   ---

   # 初始化项目

   ---

   ## 创建

   ```javascript
   npx degit dcloudio/uni-preset-vue#vite my-vue3-project '项目名称'
   
   // or
   
   // 前往 https://gitee.com/dcloud/uni-preset-vue 下载模板
   ```

   # 项目依赖

   ---

   ## sass

   <mark>uniapp需要sass</mark>

   ```javascript
   npm i sass sass-loader -D
   
   // npm版本达到@7.0.0及以上，当安装的依赖之间版本不完全兼容会终止安装
   // 需要加上命令 --legacy-peer-deps
   // 忽略同一个module包中依赖的版本不同的问题
   
   // node版本在@16以上，建议使用@8+的sass-loader
   
   // uview-ui plus 建议使用@10的sass-loader
   ```

   ## ~~uni-ui~~

   ~~uni-ui是DCloud提供的一个跨端ui库~~

   ~~它是基于vue组件的、flex布局的、无dom的跨全端ui框架。~~

   ~~uni-ui是uniapp的内置组件的补充，建议优先使用内置组件~~
   
   ```javascript
   npm i @dcloudio/uni-ui -s
   // uni-ui支持easycom规则，可以无需引入注册便能够使用uni-ui组件
   // 且uni-ui只推荐使用easycom，自己引入组件可能会产生bug
   ```

   ## uview-plus

   为uni-app而生
   
   ```javascript
   npm i uview-plus -s
   ```

   ## ~~vuex~~
   
   ```javascript
   npm i vuex -s
   ```

   ## pinia

   ```javascript
   npm i pinia -s
   
   // npm7+ 以上可能会遇到版本冲突的问题
   // 请使用 npm i pinia --legacy-peer-deps -s
   ```
   
   ## ~~router~~
   
   ~~uni-simple-router可以用类似于vue-router的方法进行路由跳转~~
   
   ~~一站式解决多平台开发中路由配置的问题~~
   
   ```javascript
   npm i uni-simple-router uni-read-pages -s
   ```

   ## ~~组件提示~~

   ~~支持uniapp原生组件代码联想~~

   ```javascript
   npm i @dcloudio/uni-helper-json -s
   // @dcloudio/uni-helper-json不支持vue3
   ```
   
   # vscode插件
   
   ---
   
   ## 语法提示
   
   uni-app-schemas
   
   ## 路径提示
   
   path intellisence
   
   ## 预览图片
   
   image preview
   
   ## uni工具包
   
   uni-create-view
   
   ## ~~注释高亮~~
   
   ~~better comments~~
   
   ## scss变量提醒
   
   scss intellisense
   
   # 参考文档
   
   ---
   
   ## [uni-app](https://uniapp.dcloud.net.cn/tutorial/)
   
   > `uni-app` 是一个使用`Vue.js` 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台
   
   ## [vue3](https://cn.vuejs.org/)
   
   > 基于组合式API和proxy代理的响应式数据，打造的全新的前端框架
   
   ## [pinia](https://pinia.web3doc.top/)
   
   > Pinia 是 Vue 的存储库，它允许您跨组件/页面共享状态
   
   ## [uview-plus](https://uiadmin.net/uview-plus/)
   
   > uview-plus是基于uView-ui修改的vue3版本
   
   ## [sass](https://www.sass.hk/guide/)
   
   > 成熟、稳定的css扩展语言
