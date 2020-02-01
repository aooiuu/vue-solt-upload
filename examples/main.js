import Vue from 'vue';
import App from './App.vue';
import SoltUpload from '../packages/index.js';

Vue.use(SoltUpload);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
