<template>
  <v-app>
    <v-navigation-drawer  persistent light v-model="drawer" class="nav-1" style="z-index:0">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>历史数据</v-list-tile-title>
            </v-list-tile-content>
            <div class="topSelect">
              <v-select class="white--text" :items="conditionItems" v-model="condition"></v-select>
            </div>              
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list dense>
        <v-divider></v-divider>
        <v-list-tile :value="index==showIndex" class="pt-2" v-for="(item,index) in historicalData" :key="item.title" @click="hisClick(index, item.title)">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <div style="text-align:right">
            <v-btn v-tooltip:top="{ html:'编辑'}" slot="activator" @click.native.stop="editHis(index)" v-if="!item.is_submit" icon small class="purple--text"><v-icon>mode_edit</v-icon></v-btn>
            <v-btn v-tooltip:top="{ html:'删除'}" slot="activator" @click.native.stop="deleteHis(index)" small icon class="red--text"><v-icon>delete</v-icon></v-btn>
          </div>
        </v-list-tile>
      </v-list>
      <div class="text-xs-center page">
        <v-pagination :length="totalPage" v-model="page" :total-visible="5"></v-pagination>
      </div>
      <form class="text-xs-center" id="fileForm" style="margin-top:30px;position:relative">
        <input type="file" name="files" id="files" @change='uploadList()'>
        <v-btn @click="submitList()" large flat style="border:1px solid #ccc">更新名单列表</v-btn>
        <v-btn @click="listDialog = true" large flat style="border:1px solid #ccc">查看名单列表</v-btn>
      </form>
    </v-navigation-drawer>
    <main style="margin-top: 65px">
      <v-container fluid>
        <div v-for="(item,index) in historicalData" :key="item.title" v-if="index == showIndex">
          <v-layout>
            <v-flex md1>
              <v-btn v-tooltip:bottom="{ html:'展开列表'}" @click="drawer = !drawer" icon v-show="!drawer"><v-icon>keyboard_arrow_right</v-icon></v-btn>
              <v-btn v-tooltip:bottom="{ html:'收起列表'}" @click="drawer = !drawer" icon v-show="drawer"><v-icon>keyboard_arrow_left</v-icon></v-btn>
            </v-flex>
            <v-flex md2>
              <v-select :disabled="disabledVal || ymDisableVal" @change="yearMonthChange(index)" :items="yearItems" v-model="historicalData[index].cyear" label="年"></v-select>
            </v-flex>
            <v-flex md2 style="margin-left:20px;">
              <v-select :disabled="disabledVal || ymDisableVal" @change="yearMonthChange(index)" :items="monthItems" v-model="historicalData[index].cmonth" label="月份"></v-select>
            </v-flex>
            <v-flex md2 style="margin-left:20px;">
              <v-text-field :disabled="true" label="编辑人" v-model="historicalData[index].editor"></v-text-field>
            </v-flex>
            <v-flex offset-md1>
              <v-btn class="purple white--text" @click="createTable()">新建总结</v-btn>
              <v-btn class="purple white--text" @click="exportTable(index)">导出</v-btn>
              <a target="_blank" class="export" :href="[path + '/wsm/export?id='+historicalData[index].id]"></a>
            </v-flex>
          </v-layout>
          <v-layout class="tableHeader">
            <v-flex sm1 style="max-width:50px">序号</v-flex>
            <v-flex sm1>姓名</v-flex>
            <v-flex sm4>工作项目</v-flex>
            <v-flex sm4>完成情况</v-flex>
            <v-flex sm2>操作</v-flex>
          </v-layout>
          <v-layout class="tableItem" v-for="(item, index2) in historicalData[index].tableData" :key="item.num">
            <v-flex sm1 style="max-width:50px">{{ item.num }}</v-flex>
            <v-flex sm1>{{ item.name }}</v-flex>
            <v-flex sm4>
              <div v-for="(work, workIndex) in item.work" :key="workIndex">
                <v-text-field style="width: 90%;padding: 0" :disabled="disabledVal || username != item.name" v-model="work.content"></v-text-field>
              </div>
            </v-flex>
            <v-flex sm4>
              <div v-for="(work, workIndex) in item.work" :key="workIndex">
                <v-text-field style="width: 90%;padding: 0" :disabled="disabledVal || username != item.name" v-model="work.state"></v-text-field>
              </div>
            </v-flex>
            <v-flex sm2>
              <div v-for="(work, workIndex) in item.work" :key="workIndex" style="margin-bottom:15px">
                <v-btn v-tooltip:top="{ html:'添加'}" @click="addWork(index, index2, workIndex)" :disabled="disabledVal || username != item.name" slot="activator" small icon class="purple--text"><v-icon>add</v-icon></v-btn>
                <v-btn v-tooltip:top="{ html:'删除'}" @click="deleteWork(index, index2, workIndex)" :disabled="disabledVal || item.work.length === 1 || username != item.name" slot="activator" small icon class="red--text"><v-icon>remove</v-icon></v-btn>
              </div>       
            </v-flex>
          </v-layout>
          <div class="mainBtnGroup">
            <v-btn class="purple white--text" :disabled="disabledVal" @click="save(index)">保存</v-btn>
            <v-btn class="error" :disabled="disabledVal" @click="cancel(index)">取消</v-btn>
            <v-btn class="purple white--text" :disabled="disabledVal" v-if="historicalData[index].editor === username" @click="submit(index)">提交</v-btn>
          </div>  
        </div>                 
      </v-container>
    </main>
    <v-dialog v-model="dialog" width="50%">
      <v-card>
        <v-card-title><span class="headline">确认删除吗？</span></v-card-title>
        <div style="text-align:right">
          <v-btn @click.native.stop="dialog = false" @click="confirmDelete" class="purple white--text">确认</v-btn>
          <v-btn @click.native.stop="dialog = false" class="error"  @click="deleteIndex = -1">取消</v-btn>
        </div>
      </v-card>
    </v-dialog> 
    <v-dialog v-model="listDialog" width="50%">
      <v-card>
        <v-card-title><span class="headline">名单列表</span></v-card-title>
        <v-layout wrap style="padding: 20px;font-size: 18px;padding-top:0px;">
          <v-flex v-for="(item, index) in nameArr" :key="index" sm3>
            {{ index + 1 + '.' + item }}
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog> 
    <v-dialog v-model="submitDialog" width="50%">
      <v-card>
        <v-card-title><span class="headline">提交后将不能再修改，确认提交吗？</span></v-card-title>
        <div style="text-align:right">
          <v-btn @click.native.stop="submitDialog = false" @click="confirmSubmit" primary>确认</v-btn>
          <v-btn @click.native.stop="submitDialog = false" error @click="submitIndex = -1">取消</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import Vue from 'vue'
import { mapState, mapActions, mapMutations } from 'vuex'

let temp = ''
let path = window.document.location.href.match(/(http:\/\/).*?\/||(https:\/\/).*?\//)[0] + 'yqzc2'
// let path = 'http://172.22.0.34:8080/yqzc2'

export default {
  data () {
    return {
      drawer: true,
      showIndex: 0,
      conditionItems: ['全部', '未提交', '已提交'],
      condition: '全部',      
      disabledVal: true,
      ymDisableVal: true,
      yearItems: [2017, 2018, 2019, 2020],
      monthItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      historicalData: [],
      page: 1,
      totalPage: 0,
      dialog: false,
      deleteIndex: -1,
      submitIndex: -1,
      nameArr: [],
      listDialog: false,
      submitDialog: false,
      path
    }
  },
  methods: {
    ...mapMutations([
      'set_isLogin',
      'set_userId',
      'set_username',
      'set_loginDialog'
    ]),
    hisClick (index) {
      this.showIndex = index
      this.disabledVal = true
      this.ymDisableVal = true
    },
    deleteWork (index ,index2, workIndex) {
      this.historicalData[index].tableData[index2].work.splice(workIndex, 1)
    },
    addWork (index, index2, workIndex) {
      this.historicalData[index].tableData[index2].work.push({ content: '', state: '' })
    },
    deleteHis (index) {
      this.dialog = true
      this.deleteIndex = index
    },
    editHis (index) {
      this.showIndex = index
      if (!this.isLogin) {
        this.set_loginDialog({ loginDialog: true })
        return
      }
      this.disabledVal = false
    },
    submitList () {
      $("#files").click()
    },
    async uploadList () {
      let tempThis = this
      let filePath = document.getElementById('fileForm')[0].value
      if (!filePath.match(/\.txt/)) {
        alert('请上传正确格式的文件！(.txt)')
        return
      }
      var formData = new FormData(document.getElementById('fileForm'))
      $.ajax({
        url: path + '/wsm/updatalist',
        type: 'post',
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        success: async function (data) {
          let res = JSON.parse(data)
          if (res.result === 'success') {
            tempThis.page = 1
            tempThis.condition = '全部'
            tempThis.showIndex = 0
            tempThis.refresh()
            alert('上传成功!')
            let res = await axios.get(path + '/user/initLogin')
          } else {
            alert('上传失败!')
          }
        },
        error: function (data) {
          console.log(data)
        }
      })
    },
    exportTable (index) {
      $('.export')[0].click()
    },
    async save (index) {
      if (this.historicalData[index].cyear === '') {
        alert("请选择年份！")
        return
      } else if (this.historicalData[index].cmonth === '') {
        alert("请选择月份！")
        return
      } else if (this.historicalData[index].editor === '') {
        alert("请填写编辑人！")
        return
      }
      for (let i = 0;i < this.historicalData[index].tableData.length;i++) {
        let projectArr = []
        let stateArr = []
        for (let j = 0;j < this.historicalData[index].tableData[i].work.length;j++) {
          projectArr.push(this.historicalData[index].tableData[i].work[j].content)
          stateArr.push(this.historicalData[index].tableData[i].work[j].state)
        }
        this.historicalData[index].content = JSON.parse(JSON.stringify(this.historicalData[index].content))
        this.historicalData[index].content[i].project = projectArr.join('::')
        this.historicalData[index].content[i].state = stateArr.join('::')
      }
      this.historicalData[index].content = JSON.stringify(this.historicalData[index].content)
      this.historicalData[index].user = this.username
      $.ajax({
        type: 'post',
        url: path + '/wsm/add',
        data: this.historicalData[index],
        async: false,
        success: function (data) {
          temp = JSON.parse(data)
        }
      })
      if (temp.result === 'success') {
        this.historicalData[index].id = temp.data.id
        this.disabledVal = true
        temp = ''
        this.refresh()
      } else {
        temp = ''
        alert('操作失败，请再次尝试!')
      }
    },
    submit(index) {
      this.submitDialog = true
      this.submitIndex = index
    },
    confirmSubmit () {
      this.historicalData[this.submitIndex].is_submit = true
      this.save(this.submitIndex)
    },
    createTable () {
      if (!this.isLogin) {
        this.set_loginDialog({ loginDialog: true })
        return
      }
      this.ymDisableVal = false
      let tableData = []
      let content = []
      for (let i = 0;i < this.nameArr.length;i++) {
        tableData.push({
          num: i + 1,
          name: this.nameArr[i].replace(/\s+/, ''),
          work: [{ content: '', state: '' }]
        })
        content.push({ name: this.nameArr[i].replace(/\s+/, ''), project: '', state: ''})
      }
      this.historicalData.unshift({
        cyear: '',
        cmonth: '',
        content: content,
        editor: this.username,
        is_submit: false,
        tableData: tableData,
        title: '新建报表'
      })
      this.showIndex = 0
      this.disabledVal = false
    },
    async yearMonthChange (index) {
      let tempThis = this
      setTimeout(async function () {
        let year = tempThis.historicalData[index].cyear
        let month = tempThis.historicalData[index].cmonth
        if (year !== '' && month !== '') {
          let res = await axios.get(path + '/wsm/verify?year='+ year +'&month='+ month)
          if (res.data.data.yqzc_work_summary) {
            tempThis.historicalData[0] = res.data.data.yqzc_work_summary
            tempThis.disabledVal = res.data.data.yqzc_work_summary.is_submit
            tempThis.ymDisableVal = true
            let tableData = []
            let table = JSON.parse(res.data.data.yqzc_work_summary.content)
            while (typeof(table) == 'string') {
              table = JSON.parse(table)
            }
            tempThis.historicalData[0].content = table
            for (let k = 0;k < table.length;k++) {
              let work = []
              let workArr = table[k].project.split("::")
              let stateArr = table[k].state.split("::")
              for (let j = 0;j < workArr.length;j++) {
                work.push({
                  content: workArr[j],
                  state: stateArr[j]
                })
              }
              tableData.push({
                num: k + 1,
                name: table[k].name.replace(/\s+/, ''),
                work: work
              }) 
            }
            Vue.set(tempThis.historicalData[0], 'tableData', tableData)
            Vue.set(tempThis.historicalData[0], 'title', tempThis.historicalData[0].cyear + '年' + tempThis.historicalData[0].cmonth + '月')
          } else {
            Vue.set(tempThis.historicalData[0], 'title', tempThis.historicalData[0].cyear + '年' + tempThis.historicalData[0].cmonth + '月')
          }
        }
      }, 100)
    },
    async confirmDelete () {
      let id = this.historicalData[this.deleteIndex].id
      $.ajax({
        type: 'post',
        url: path + '/wsm/delete',
        data: { id },
        async: false,
        success: function (data) {
          temp = JSON.parse(data)
        }
      })      
      temp = ''
      this.refresh()
    },
    async refresh () {
      let res = await axios.get(path + '/wsm/query?page=' + this.page + '&state=' + this.state)  
      this.nameArr = res.data.data.name_list.split('::')
      let dataArr = res.data.data.yqzc_work_summary
      this.totalPage = Math.ceil(res.data.data.count / 8)
      this.historicalData = dataArr
      let tableData = []
      for (let i = 0; i < dataArr.length; i++) {
        let table = JSON.parse(dataArr[i].content)
        while (typeof(table) == 'string') {
          table = JSON.parse(table)
        }
        this.historicalData[i].content = table
        for (let k = 0;k < table.length;k++) {
          let work = []
          let workArr = table[k].project.split("::")
          let stateArr = table[k].state.split("::")
          for (let j = 0;j < workArr.length;j++) {
            work.push({
              content: workArr[j],
              state: stateArr[j]
            })
          }
          tableData.push({
            num: k + 1,
            name: table[k].name.replace(/\s+/, ''),
            work: work
          }) 
        }
        Vue.set(this.historicalData[i], 'tableData', tableData)
        Vue.set(this.historicalData[i], 'title', this.historicalData[i].cyear + '年' + this.historicalData[i].cmonth + '月')
        tableData = []      
      }
      if (res.data.data.yqzc_work_summary.length === 0) {
          this.createTable()
      }  
    },
    cancel () {
      this.disabledVal = true
      this.ymDisableVal = true
    }
  },
  created: function () {
    this.refresh()
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userId: state => state.userId,
      username: state => state.username
    }),
    state () {
      return this.conditionItems.indexOf(this.condition)
    }
  },  
  watch: {
    async page () {
      await this.refresh()
      this.showIndex = 0
    },
    condition () {
      this.refresh()
    }
  }
}
</script>

<style scoped>
.bottomBar{
  position: absolute;
  top: 550px;
}
a{
  text-decoration: none;
  color: white;
}
.download{
  width: 20px;
  position: absolute;
  opacity: 0;
}
.head{
  display: flex;
}
.topSelect{
  width: 100px;
  position: absolute;
  right: 5px;
}
.text{
  margin-right: 15px;
}
.bottomGroup{
  position: relative;
  margin-top: 20px;
  margin-bottom: 0;
  width: 100%;
  text-align: center;
}
.mainBtnGroup{
  width: 100%;
  text-align: center;
  border-top: 1px solid #ccc;
  margin-top: 10px;
}
.page{
  margin-top: 30px;
}
.templateTitle{
  display: inline-block;
  vertical-align: middle;
}
.nav-1{
  padding: 0;
  padding-top: 65px;
}
.uploadTemplate{
  position: absolute;
  width: 0px;
  opacity: 0;
}
.afterTop{
  text-align: right;
  margin-right: 15px;
  margin-top: -10px;
  color: rgba(0, 0, 0, .87)
}
.tableHeader{
  font-size: 20px;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10px;
  color: white;
  background: #9c27b0!important;
}
#files{
  visibility: hidden;
  position: absolute;
  z-index: -99;
}
.tableItem{
  font-size: 18px;
  border-top: 1px solid #ccc;  
  border-left: 1px solid #ccc;  
  border-right: 1px solid #ccc;  
  padding-left: 10px;
  padding-top: 10px;
}
</style>
