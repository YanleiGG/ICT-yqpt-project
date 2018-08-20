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
    </v-toolbar>
    <router-view @changeIndex="changeIndex"></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      colorClass: ['indigo', 'primary', 'purple', 'success'],
      url: ['instruction', 'ydjb', 'ydzj', 'hygl'],
      classIndex: 0
    }
  },
  methods: {
    changeClass (index) {
      this.classIndex = index
    },
    changeIndex (index) {
      this.changeClass(index)
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
</style>
