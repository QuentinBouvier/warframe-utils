import Vue from 'vue';
import App from './App.vue';

import './main.scss';
import './styles/_vars.scss'

Vue.config.productionTip = false

new Vue({
    render: x => x(App)
}).$mount('#app');