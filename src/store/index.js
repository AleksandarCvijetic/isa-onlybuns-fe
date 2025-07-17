import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null      // will hold logged-in user info
  },
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    login({ commit }, user) {
      // perform login, then:
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('setUser', null);
    }
  }
});