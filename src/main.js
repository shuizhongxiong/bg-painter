import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import '@/assets/styles/element-variables.scss';
import 'styles/common.css';

import {
  Button,
  Container,
  Header,
  Aside,
  Main,
  RadioButton,
  RadioGroup,
  InputNumber,
  Tooltip,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  Tabs,
  TabPane,
} from 'element-ui';
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(InputNumber);
Vue.use(Tooltip);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(ColorPicker);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
