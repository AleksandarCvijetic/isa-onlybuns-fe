// src/store/index.js
import { createStore } from 'vuex';
import axios from 'axios';


export default createStore({
  state: {
    isAuthenticated: false,
    username: null,
    users: [],
  },
  mutations: {
    setAuth(state, payload) {
      state.isAuthenticated = payload.auth;
      state.username = payload.username;
    },
    setUsers(state, users) {
      state.users = users;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      try {
        const res = await axios.get('/api/users');
        commit('setUsers', res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    },
    initializeAuth({ commit }) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          commit('setAuth', {
            auth: true,
            username: payload.sub,
          });
        } catch (e) {
          commit('setAuth', { auth: false, username: null });
        }
      }
    },
    logout({ commit }) {
      localStorage.removeItem('access_token');
      commit('setAuth', { auth: false, username: null });
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    username: state => state.username,
    allUsers: state => state.users,
  }
});
