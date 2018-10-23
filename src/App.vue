<template>
  <v-app id="app">
    <v-toolbar fixed class="topbar" :class="colorClass[classIndex]">
      <v-toolbar-title class="white--text">业务辅助管理平台</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/"><v-btn @click="changeClass(0)" class="white--text" :class="colorClass[classIndex]" flat>首页</v-btn></router-link>
      <router-link to="/ydjb"><v-btn @click="changeClass(1)" class="white--text"  :class="colorClass[classIndex]" flat>月度简报</v-btn></router-link>
      <router-link to="/ydzj"><v-btn @click="changeClass(2)" class="white--text" :class="colorClass[classIndex]" flat>月度总结</v-btn></router-link>
      <router-link to="/hygl"><v-btn @click="changeClass(3)" class="white--text" :class="colorClass[classIndex]" flat>会议管理</v-btn></router-link>
      <router-link to="/instruction"><v-btn @click="changeClass(0)" class="white--text" :class="colorClass[classIndex]" flat>帮助</v-btn></router-link>
      <v-btn
        @click="loginDialog = true" 
        class="white--text" 
        :class="colorClass[classIndex]" 
        flat 
        style="margin-left: 0"
        v-if="!isLogin">
        登录
      </v-btn>
      <v-menu v-else class="text-xs-center">
        <v-btn
          slot="activator"
          :class="colorClass[classIndex]"
          class="white--text" 
          flat
        >
          {{username}}
        </v-btn>
        <v-list>
          <v-list-tile @click="logout">
            <v-list-tile-title>注销</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="changePasswordDialog=true">
            <v-list-tile-title>修改密码</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-dialog v-model="loginDialog" width="50%">
      <v-card>
        <v-card-title style="width:70%;margin-left:12%"><span class="headline">登录</span></v-card-title>
        <v-text-field v-model="name" label="账号" style="width:70%;margin-left:15%"></v-text-field>
        <v-text-field v-model="password" label="密码" style="width:70%;margin-left:15%" type="password"></v-text-field>
        <div style="text-align:right">
          <v-btn @click="login" primary>确认</v-btn>
          <v-btn error @click="cancel">取消</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="changePasswordDialog" width="50%">
      <v-card>
        <v-card-title style="width:70%;margin-left:12%"><span class="headline">修改密码</span></v-card-title>
        <v-text-field v-model="oldPassword" label="原密码" style="width:70%;margin-left:15%" type="password"/>
        <v-text-field v-model="newPassword" label="新密码" style="width:70%;margin-left:15%" type="password"/>
        <v-text-field v-model="repeatPassword" label="重复新密码" style="width:70%;margin-left:15%" type="password"/>
        <div style="text-align:right">
          <v-btn @click="changePassword" primary>确认</v-btn>
          <v-btn error @click="changePasswordCancel">取消</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <router-view @changeIndex="changeIndex"></router-view>
  </v-app>
</template>

<script>
import store from './store'
import axios from "axios"
import { mapState, mapActions, mapMutations } from 'vuex'
import $ from 'jquery'

let temp

export default {
  name: 'app',
  store,
  data () {
    return {
      colorClass: ['indigo', 'primary', 'purple', 'success'],
      url: ['instruction', 'ydjb', 'ydzj', 'hygl'],
      classIndex: 0,
      loginDialog: false,
      name: '朱晓航',
      password: '',
      changePasswordDialog: false,
      oldPassword: '',
      newPassword: '',
      repeatPassword: ''
    }
  },
  methods: {
    ...mapMutations([
      'set_isLogin',
      'set_userId',
      'set_username'
    ]),
    changeClass (index) {
      this.classIndex = index
    },
    changeIndex (index) {
      this.changeClass(index)
    },
    async login() {
      let formData = new FormData()
      formData.append('name', this.name)
      formData.append('passwd', this.password)
      $.ajax({
        type: 'post',
        url: this.path + '/user/verify',
        data: formData,
        async: false,
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        success: function (data) {
          temp = JSON.parse(data)
          console.log(temp)
        }
      })
      if (temp.result==='success') {
        this.set_isLogin({ isLogin: true })
        this.set_userId({ userId: temp.data.id })
        this.set_username({ username: temp.data.name })
        console.log(this.username)
        this.loginDialog = false
      } else {
        alert('账号或密码错误!')
      }
    },
    cancel() {
      this.loginDialog = false
      this.password = ''
      this.name = ''
    },
    logout() {
      this.set_isLogin({ isLogin: false })
      this.set_userId({ userId: null })
      this.set_username({ username: '' })
    },
    changePassword() {
      if (this.newPassword != this.repeatPassword) {
        alert('两次输入密码不一致！')
        return
      }
      let formData = new FormData()
      formData.append('name', this.name)
      formData.append('passwd', this.oldPassword)
      $.ajax({
        type: 'post',
        url: this.path + '/user/verify',
        data: formData,
        async: false,
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        success: function (data) {
          temp = JSON.parse(data)
          console.log(temp)
        }
      })
      if (temp.result==='success') {
        formData = new FormData()
        formData.append('name', this.username)
        formData.append('passwd', this.newPassword)
        formData.append('id', this.userId)
        $.ajax({
          type: 'post',
          url: this.path + '/user/add',
          data: formData,
          async: false,
          processData: false,
          contentType: false,
          mimeType: 'multipart/form-data',
          success: function (data) {
            temp = JSON.parse(data)
            console.log(temp)
          }
        })
        if (temp.result === 'success') {
          alert('修改成功!')
          this.logout()
          this.changePasswordDialog = false
        }
      } else {
        alert('原密码错误!')
        return
      }
    },
    changePasswordCancel() {
      this.newPassword = ''
      this.repeatPassword = ''
      this.oldPassword = ''
      this.changePasswordDialog = false
    }
  },
  created: function () {
    let path = window.document.location.href
    for (let i = 0; i < this.url.length;i++) {
      if (path.indexOf(this.url[i]) !== -1) {
        this.classIndex = i
        return
      }
    }
    this.classIndex = 0
  },
  computed: {
    ...mapState({
      path: state => state.path,
      isLogin: state => state.isLogin,
      userId: state => state.userId,
      username: state => state.username
    }),
  }
}
</script>

<style>
a{
  text-decoration: none;
  color: white;
}
.topbar{
  z-index: 99;
}
.menu__content{
  top:0 !important;
}
</style>
