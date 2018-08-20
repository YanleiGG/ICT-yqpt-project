<template>
  <v-app>
    <v-layout class="mainPage">
      <v-flex sm2 offset-md2>
        <router-link to="/ydjb">
          <v-btn @click="emitIndex(1)" class="mainBtn primary white--text">月度简报</v-btn>
        </router-link>
      </v-flex>
      <v-flex sm2 offset-md1>
        <router-link to="ydzj">
          <v-btn @click="emitIndex(2)" class="mainBtn purple white--text">月度总结</v-btn>
        </router-link>
      </v-flex>
      <v-flex sm2 offset-md1>
        <router-link to="/hygl">
          <v-btn @click="emitIndex(3)" class="mainBtn success white--text">会议管理</v-btn>
        </router-link>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>

export default {
  data: function () {
    return {}
  },
  methods: {
    emitIndex (index) {
      this.$emit('changeIndex', index)
    }
  }
}  
</script>
<style scoped>
.mainPage{
  padding-top: 13%;
}
.mainBtn{
  width: 100%;
  height: 350px;
  font-size: 23px;
  color: white;
}
</style>
