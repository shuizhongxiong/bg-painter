import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    compData: {
      comp: 'painter-1',
      bgColor: 'rgba(0, 0, 0, 1)',
    },
  },
  mutations: {
    changeCompData(state, value) {
      state.compData = value;
    },
  },
  actions: {},
});
