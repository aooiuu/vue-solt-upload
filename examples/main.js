import Vue from 'vue';
import App from './App.vue';
import UploadSlot from '../packages/index.js';

Vue.use(UploadSlot);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
