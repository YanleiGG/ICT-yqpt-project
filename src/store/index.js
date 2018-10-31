import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userId: null,
    username: '',
    // path: window.document.location.href.match(/(http:\/\/).*?\/||(https:\/\/).*?\//)[0] + 'yqzc2',
    path: 'http://172.22.0.34:8080/yqzc2',
    loginDialog: false
  },
  mutations: {
    set_isLogin (state, { isLogin }) {
      state.isLogin = isLogin
    },
    set_userId (state, { userId }) {
      state.userId = userId
    },
    set_username (state, { username }) {
      state.username = username
    },
    set_loginDialog(state, {loginDialog}) {
      state.loginDialog = loginDialog
    }
  }
})