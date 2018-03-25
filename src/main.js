// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/stylus/index.styl'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app', // vue父实例的挂载点
  router,
  components: { App }, // 主组件的模板
  template: '<App/>' // 使用导入的App,es6对象写法
})
