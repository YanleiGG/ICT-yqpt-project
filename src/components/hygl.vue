<template>
  <v-app>
    <v-navigation-drawer persistent light v-model="drawer" class="nav-1" style="z-index:0">
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
        <v-list-tile :value="index==showIndex" class="pt-2" v-for="(item,index) in historicalData" :key="item.index" @click="hisClick(index, item.mname)">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <div style="text-align:right">
            <v-btn v-tooltip:top="{ html:'编辑'}" @click.native.stop="editHis(index)" v-if="!item.is_submit" icon small class="success--text"><v-icon>mode_edit</v-icon></v-btn>
            <v-btn v-tooltip:top="{ html:'删除'}" @click.native.stop="deleteHis(index)" small icon class="red--text"><v-icon>delete</v-icon></v-btn>
          </div>
        </v-list-tile>
      </v-list>
      <div class="text-xs-center page">
        <v-pagination :length="totalPage" v-model="page" :total-visible="5"></v-pagination>
      </div>
      <form class="text-xs-center" id="fileForm" style="margin-top:30px;position:relative">
        <input type="file" name="files" id="files" @change='uploadList()'>
        <v-btn :disabled="historicalData[showIndex] ? historicalData[showIndex].is_submit : true" @click="submitList()" large flat style="border:1px solid #ccc">上传最新会议议程</v-btn>
      </form>
    </v-navigation-drawer>
    <main style="margin-top: 65px">
      <v-container fluid>
        <div v-for="(item,index) in historicalData" :key="index" v-if="index == showIndex">
          <v-layout>
            <v-flex md1>
              <v-btn v-tooltip:bottom="{ html:'展开列表'}" @click="drawer = !drawer" icon v-show="!drawer"><v-icon>keyboard_arrow_right</v-icon></v-btn>
              <v-btn v-tooltip:bottom="{ html:'收起列表'}" @click="drawer = !drawer" icon v-show="drawer"><v-icon>keyboard_arrow_left</v-icon></v-btn>
            </v-flex>
            <v-flex md2 style="margin-right:5px">
                <v-text-field v-model="historicalData[index].mname" label='会议' :disabled="disabledVal"></v-text-field>
            </v-flex>
            <v-flex md1 style="margin-right:5px">
                <v-menu :disabled="disabledVal" lazy v-model="menu1" offset-y full-width  :nudge-left="40"  max-width="290px">
                    <v-text-field
                        :disabled="disabledVal"
                        slot="activator"
                        label="开始日期"
                        v-model="historicalData[index].date"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="historicalData[index].date"></v-date-picker>
                </v-menu>          
            </v-flex>
            <span style="margin-top:25px;margin-right:5px">-</span>
            <v-flex md1 style="margin-right:5px">
                <v-menu :disabled="disabledVal" lazy :close-on-content-click="false" v-model="menu3" offset-y full-width  :nudge-left="40"  max-width="290px" transition="scale-transition">
                    <v-text-field
                        :disabled="disabledVal"
                        slot="activator"
                        label="结束日期"
                        v-model="historicalData[index].date2"
                    ></v-text-field>
                    <v-date-picker v-model="historicalData[index].date2" autosave></v-date-picker>
                </v-menu>          
            </v-flex>
            <v-flex md2 style="margin-right:5px">
                <v-text-field v-model="historicalData[index].mroom" label='地点' :disabled="disabledVal"></v-text-field>
            </v-flex>
            <v-flex md1 style="margin-right:5px">
                <v-text-field v-model="historicalData[index].meeter" label='会务' :disabled="disabledVal"></v-text-field>
            </v-flex>
            <v-flex offset-md1>
              <v-btn class="green white--text" @click="createTable()">新建会议</v-btn>
              <v-btn class="green white--text" @click="exportTable(index)">导出</v-btn>
              <a target="_blank" class="export" :href="[path + '/msm/export?id='+historicalData[index].id]"></a>
            </v-flex>
          </v-layout>
          <v-layout class="tableHeader">
              <v-flex>分中心</v-flex>
              <v-flex>参会人员</v-flex>
              <v-flex>到达时间</v-flex>
              <v-flex>到达车次</v-flex>
              <v-flex>返程时间</v-flex>
              <v-flex>返程车次</v-flex>
              <v-flex>备注</v-flex>
              <v-flex>操作</v-flex>
          </v-layout>
          <v-layout class="tableItem" v-for="(item, index2) in historicalData[index].content2" :key="index2">
            <v-flex sm1>
                <v-select style="width: 100%;padding: 0" :items="centerArr" v-model="item.scenter" :disabled="disabledVal"></v-select>
            </v-flex>
            <v-flex sm2>
                <v-text-field style="width: 80%;padding: 0;margin-left:10%" :disabled="disabledVal" v-model="item.mnames"></v-text-field>
            </v-flex>
            <v-flex sm1> 
                <v-menu :disabled="disabledVal" lazy v-model="menu4[index2]" offset-y full-width  :nudge-left="40"  max-width="290px">
                    <v-text-field
                        style="width: 80%;padding: 0"
                        :disabled="disabledVal"
                        slot="activator"
                        v-model="item.sdate1"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="item.sdate1"></v-date-picker>
                </v-menu>                
            </v-flex>
            <v-flex sm1> 
                <v-menu :close-on-content-click="false"  class="timePicker" :disabled="disabledVal" lazy v-model="menu6[index2]" offset-y full-width  :nudge-left="40"  max-width="290px">
                    <v-text-field
                        style="width: 80%;padding: 0"
                        :disabled="disabledVal"
                        slot="activator"
                        v-model="item.sdate2"
                        readonly
                        @click="loseFocus(index2)"
                    ></v-text-field>
                    <v-time-picker  v-model="item.sdate2" format="24hr"></v-time-picker>
                </v-menu>                
            </v-flex>
            <v-flex sm1>
                <v-text-field style="width: 90%;padding: 0;margin-left:-10%" :disabled="disabledVal" v-model="item.strip"></v-text-field>
            </v-flex>
            <v-flex sm1>
                <v-menu  :disabled="disabledVal" lazy v-model="menu5[index2]" offset-y full-width  :nudge-left="40"  max-width="290px">
                    <v-text-field
                        style="width: 80%;padding: 0;margin-left:10%"
                        :disabled="disabledVal"
                        slot="activator"
                        v-model="item.edate1"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="item.edate1"></v-date-picker>
                </v-menu>                
            </v-flex>
            <v-flex sm1>
                <v-menu :close-on-content-click="false" class="timePicker2" :disabled="disabledVal" lazy v-model="menu7[index2]" offset-y full-width  :nudge-left="40"  max-width="290px">
                    <v-text-field
                        style="width: 80%;padding: 0;margin-left:10%"
                        :disabled="disabledVal"
                        slot="activator"
                        v-model="item.edate2"
                        readonly
                        @click="loseFocus2(index2)"
                    ></v-text-field>
                    <v-time-picker v-model="item.edate2" format="24hr"></v-time-picker>
                </v-menu>                
            </v-flex>
            <v-flex sm1>
                <v-text-field style="width: 100%;padding: 0" :disabled="disabledVal" v-model="item.etrip"></v-text-field>
            </v-flex>
            <v-flex sm2>
                <v-text-field style="width: 80%;padding: 0;margin-left:10%" :disabled="disabledVal" v-model="item.remark"></v-text-field>
            </v-flex>
            <v-flex sm1>
                <v-btn v-tooltip:top="{ html:'添加'}" @click="addItem(index)" :disabled="disabledVal" slot="activator" small icon class="success--text smBtn"><v-icon>add</v-icon></v-btn>
                <v-btn v-tooltip:top="{ html:'删除'}" @click="deleteItem(index, index2)" :disabled="disabledVal || historicalData[index].content2.length === 1" slot="activator" small icon class="red--text smBtn"><v-icon>remove</v-icon></v-btn>
            </v-flex>
          </v-layout>
          <v-toolbar class="success" style="margin-top: 50px;color:white;height: 60px;border: 1px solid #ccc;" flat>
            <v-toolbar-title>最新会议议程</v-toolbar-title>            
          </v-toolbar>
        <v-layout style="padding:20px;">
            <v-flex offset-md1>
                <div style="font-size: 20px" v-if="item != undefined" v-for="(item, index2) in historicalData[index].attachments" :key="index2">
                    <span>{{ item[0] === '_' ? item.replace(/^_[0-9]+_/, '') : item  }}</span>
                    <v-btn success @click="downloadAttachment(index2)" class="white--text">下载</v-btn>
                    <a target="_blank" v-show="false" :href="path + '/msm/downattachment?filename=' + item" class="attachmentA"></a>
                    <v-btn :disabled="disabledVal" error @click="deleteAttachment(index, index2)" class="white--text">删除</v-btn>
                </div>
            </v-flex>
        </v-layout>
          <div class="mainBtnGroup">
            <v-btn class="green white--text" :disabled="disabledVal" @click="save(index)">保存</v-btn>
            <v-btn class="error" :disabled="disabledVal" @click="cancel(index)">取消</v-btn>
            <v-btn class="green white--text" :disabled="disabledVal" @click="submit(index)">提交</v-btn>
          </div>  
        </div>                 
      </v-container>
    </main> 
    <v-dialog v-model="dialog" width="50%">
      <v-card>
        <v-card-title><span class="headline">确认删除吗？</span></v-card-title>
        <div style="text-align:right">
          <v-btn @click.native.stop="dialog = false" @click="confirmDelete" class="green white--text">确认</v-btn>
          <v-btn @click.native.stop="dialog = false" class="error"  @click="deleteIndex = -1">取消</v-btn>
        </div>
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
import moment from 'moment'
import { mapState, mapActions, mapMutations } from 'vuex'

let temp = ''
let path = window.document.location.href.match(/(http:\/\/).*?\/||(https:\/\/).*?\//)[0] + 'yqzc2'
// let path = 'http://172.22.0.34:8080/yqzc2'

export default{
    data () {
        return {
            historicalData: [],
            conditionItems: ['全部', '未提交', '已提交'],
            condition: '全部',
            showIndex: 0,
            drawer: true,
            disabledVal: true,
            page: 1,
            totalPage: 1,
            fileList: [],
            file: '',
            dialog: false,
            deleteIndex: -1,
            submitIndex: -1,
            listDialog: false,
            submitDialog: false,
            menu1: false,
            menu2: false,
            menu3: false,
            menu4: [],
            menu5: [],
            menu6: [],
            menu7: [],
            maxMenuLength: 0,
            centerArr: ['安徽','北京','福建','甘肃','广东','广西','贵州','海南','河北','河南','黑龙江','湖北','湖南','吉林','江苏','江西','辽宁','内蒙古','宁夏','山东','山西','陕西','上海','四川','天津','新疆','浙江','重庆','青海','西藏','云南'],
            path

        }
    },
    methods: {
        refresh: async function () {
            let res = await axios.get(path + '/msm/query?page=' + this.page + '&state=' + this.state)
            if (res.data.data.yqzc_meeting_schedule.length === 0) {
                this.historicalData = []
                this.totalPage = 1
                this.createTable()
                return
            }
            this.totalPage = Math.ceil(res.data.data.count / 8)
            this.historicalData = res.data.data.yqzc_meeting_schedule
            for (let i = 0; i < this.historicalData.length; i++) {
                this.historicalData[i].content = JSON.parse(this.historicalData[i].content)
                let medate = moment(this.historicalData[i].medate).format("YYYY-MM-DD")
                let msdate = moment(this.historicalData[i].msdate).format("YYYY-MM-DD")
                if (this.historicalData[i].attachment.length !== 0) {
                    Vue.set(this.historicalData[i], 'attachments', this.historicalData[i].attachment.split("::"))
                } else {
                    Vue.set(this.historicalData[i], 'attachments', [])
                }
                if( this.historicalData[i].content > this.maxMenuLength) {
                    this.maxMenuLength = this.historicalData[i].content
                }
                for (let j = 0;j < this.historicalData[i].content.length;j++) {
                    let edateArr = this.historicalData[i].content[j].edate.split(' ')
                    let sdateArr = this.historicalData[i].content[j].sdate.split(' ')
                    if (edateArr.length === 1) {
                        Vue.set(this.historicalData[i].content[j], 'edate1', edateArr[0])
                        Vue.set(this.historicalData[i].content[j], 'edate2', '00:00')
                    } else {
                        Vue.set(this.historicalData[i].content[j], 'edate1', edateArr[0].replace(/\//, '-'))
                        Vue.set(this.historicalData[i].content[j], 'edate2', edateArr[1].substr(0, 5))
                    }
                    if (sdateArr.length === 1) {
                        Vue.set(this.historicalData[i].content[j], 'sdate1', sdateArr[0])
                        Vue.set(this.historicalData[i].content[j], 'sdate2', '00:00')
                    } else {
                        Vue.set(this.historicalData[i].content[j], 'sdate1', sdateArr[0].replace(/\//, '-'))
                        Vue.set(this.historicalData[i].content[j], 'sdate2', sdateArr[1].substr(0, 5))
                    }
                }
                Vue.set(this.historicalData[i], 'content2', this.historicalData[i].content)
                Vue.set(this.historicalData[i], 'date', medate)
                Vue.set(this.historicalData[i], 'date2', msdate)
                Vue.set(this.historicalData[i], 'title', this.historicalData[i].mname)
            }
            for (let i = 0;i < this.maxMenuLength;i++) {
                this.menu4.push(false)
                this.menu5.push(false)
                this.menu6.push(false)
                this.menu7.push(false)
            }
            console.log(res)
        },
        downloadAttachment (index) {
            $('.attachmentA')[index].click()
        },
        deleteAttachment (index, index2) {
            this.historicalData[index].attachments.splice(index2, 1)
        },        
        hisClick (index) {
            this.showIndex = index
            this.disabledVal = true
        },        
        createTable () {
            this.showIndex = 0
            this.disabledVal = false
            this.historicalData.unshift({
                id: null,
                mname:'',
                title: '新建会议',
                mroom:'',
                meeter:'',
                cdate:'',
                stime:'09:00:00',
                etime:'09:00:00',
                is_submit:false,
                attachment:'',
                attachments:[],
                content:[{scenter:"",mnames:"",sdate:"",strip:"",edate:"",edate2: '', sdate2: '',etrip:"",attachment:"",remark:""}],
                content2:[{scenter:"",mnames:"",sdate:"",strip:"",edate:"",edate2: '', sdate2: '',etrip:"",attachment:"",remark:""}]
            })
        },
        async submit (index) {
            this.submitDialog = true
            this.submitIndex = index
        },
        confirmSubmit () {
            let index = this.submitIndex
            this.historicalData[index].is_submit = true
            this.save(index)
            if (this.disabledVal == false) {
                this.historicalData[index].is_submit = false
            }
        },
        addItem (index) {
            this.historicalData[index].content2.push({scenter:"",mnames:"",sdate:"",strip:"",edate:"",etrip:"",attachment:"",remark:""})
            this.menu4.push(false)
            this.menu5.push(false)
            this.menu6.push(false)
            this.menu7.push(false)
        },
        deleteItem (index, index2) {
            this.historicalData[index].content2.splice(index2, 1)
            this.menu4.splice(index2, 1)
            this.menu5.splice(index2, 1)
            this.menu6.splice(index2, 1)
            this.menu7.splice(index2, 1)
            this.showIndex = 0
        },
        editHis (index) {
            this.showIndex = index
            this.disabledVal = false
        },   
        async save (index) {
            if (this.historicalData[index].date === '' || this.historicalData[index].mname === '') {
                alert('开始日期、结束日期、会议为必填项！')
                return
            }
            for (let i = 0;i < this.historicalData[index].content2.length;i++) {
                if (this.historicalData[index].content2[i].sdate1 === '' || this.historicalData[index].content2[i].sdate1 == undefined || this.historicalData[index].content2[i].sdate1 == 'undefined') {
                    this.historicalData[index].content2[i].sdate1 = moment().format("YYYY-MM-DD")
                }
                if (this.historicalData[index].content2[i].sdate2 === '') {
                    this.historicalData[index].content2[i].sdate2 = '09:00'
                }
                if (this.historicalData[index].content2[i].edate1 === '' || this.historicalData[index].content2[i].edate1 == undefined || this.historicalData[index].content2[i].edate1 == 'undefined') {
                    this.historicalData[index].content2[i].edate1 = moment().format("YYYY-MM-DD")
                }
                if (this.historicalData[index].content2[i].edate2 === '') {
                    this.historicalData[index].content2[i].edate2 = '21:00'
                }
                this.historicalData[index].content2[i].sdate = this.historicalData[index].content2[i].sdate1 + ' ' + this.historicalData[index].content2[i].sdate2 + ':00'
                this.historicalData[index].content2[i].edate = this.historicalData[index].content2[i].edate1 + ' ' + this.historicalData[index].content2[i].edate2 + ':00'
            }
            this.historicalData[index].content = JSON.stringify(this.historicalData[index].content2)
            // 处理时间格式
            this.historicalData[index].medate = this.historicalData[index].date.replace(/-/g, "/")
            this.historicalData[index].msdate = this.historicalData[index].date2.replace(/-/g, "/")
            this.historicalData[index].attachment =  this.historicalData[index].attachments.join("::")
            console.log(this.historicalData[index])
            $.ajax({
                type: 'post',
                url: path + '/msm/add',
                data: this.historicalData[index],
                async: false,
                success: function (data) {
                    temp = JSON.parse(data)
                }
            })
            console.log(temp)
            if (temp.result === 'success') {
                this.disabledVal = true
                temp = ''
                this.refresh()
            } else {
                temp = ''
                alert('操作失败，请再次尝试！')
            }       
        },
        deleteHis (index) {
            this.dialog = true
            this.deleteIndex = index
        },
        cancel () {
            this.disabledVal = true
        },
        async confirmDelete () {
            let id = this.historicalData[this.deleteIndex].id
            $.ajax({
                type: 'post',
                url: path + '/msm/delete',
                data: { id },
                async: false,
                success: function (data) {
                    temp = JSON.parse(data)
                }
            })      
            console.log(temp)
            temp = ''
            this.refresh()      
        },
        exportTable (index) {
            $( '.export')[0].click()
        },  
        uploadList () {
            let tempThis = this
            let filePath = document.getElementById('fileForm')[0].value
            var formData = new FormData(document.getElementById('fileForm'))
            $.ajax({
                url: path + '/msm/upload',
                type: 'post',
                data: formData,
                async: false,
                contentType: false,
                processData: false,
                success: async function (data) {
                let res = JSON.parse(data)
                if (res.result === 'success') {
                    for (var i in res.data.files) {
                        tempThis.historicalData[tempThis.showIndex].attachments.push(res.data.files[i])
                        console.log(tempThis.historicalData[tempThis.showIndex].attachments)
                    }
                    tempThis.save(tempThis.showIndex)
                    tempThis.refresh()
                    alert('上传成功!')
                } else {
                    alert('上传失败!')
                }
                },
                error: function (data) {
                    console.log(data)
                }
            })            
        },
        submitList () {
            $("#files").click()          
        },
        loseFocus (index) {
            $('.timePicker .menu__activator .input-group__input input')[index].blur()
        },
        loseFocus2 (index) {
            $('.timePicker2 .menu__activator .input-group__input input')[index].blur()
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
  height: 40px;
  font-size: 18px;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10px;
  color: white;
  background: #4caf50;
}
#files{
  visibility: hidden;
  position: absolute;
  z-index: -99;
}
.tableItem{
  font-size: 18px;
  border: 1px solid #ccc; 
  padding-left: 10px;
  padding-top: 10px;
}
.smBtn{
    margin: 0;
}
</style>
