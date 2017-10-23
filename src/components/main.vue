<template>
    <v-app>
      <v-navigation-drawer persistent light v-model="drawer" class="nav">
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
        <v-list class="pt-2" dense>
          <v-divider></v-divider>
          <v-list-tile class="pt-2" v-for="(item,index) in historicalData" :key="item.title" @click="hisClick(index, item.title)">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <div style="text-align:right">
              <v-btn v-tooltip:top="{ html:'编辑'}" @click.native.stop="editHis(index)" v-if="!item.is_submit" icon small class="indigo--text"><v-icon>mode_edit</v-icon></v-btn>
              <v-btn v-tooltip:top="{ html:'删除'}" @click.native.stop="deleteHis(index)" small icon class="red--text"><v-icon>delete</v-icon></v-btn>  
            </div>
          </v-list-tile>
        </v-list>
        <div class="text-xs-center page">
          <v-pagination :length="totalPage" v-model="page" :total-visible="5"></v-pagination>
        </div>
        <div class="bottomGroup">
          <div style="font-size:120%">{{ templateName }}</div>
          <div class="headline red--text templateTitle">作图模板</div>
          <v-btn @click="emitInputFile" icon v-tooltip:top="{ html:'上传'}" class="indigo--text"><v-icon>file_upload</v-icon></v-btn>
          <a href="http://172.22.0.34:8080/yqzc/download"><v-btn icon v-tooltip:top="{ html:'下载'}" class="indigo--text"><v-icon>file_download</v-icon></v-btn></a>           
        </div>
        <form class="uploadTemplate" id="fileForm2">
          <input style="width:3px" type="file" id="files" name="files" @change='uploadTemplate'>
        </form>
        <img src="../assets/pic.png" style="width:100%">       
      </v-navigation-drawer>
      <main>
        <v-container fluid>
          <div v-for="(item,index) in historicalData" :key="item.title" v-if="index == showIndex">
            <form id="allForm">
              <v-layout>
                <v-flex md2>
                  <v-select :disabled="disabledVal || ymDisableVal" @change="yearMonthChange(index)" :items="yearItems" v-model="historicalData[index].current_year" label="年"></v-select>
                </v-flex>
                <v-flex md2 style="margin-left:20px;">
                  <v-select :disabled="disabledVal || ymDisableVal" @change="yearMonthChange(index)" :items="monthItems" v-model="historicalData[index].journel_month" label="月份"></v-select>
                </v-flex>
                <v-flex md2 style="margin-left:20px;">
                  <v-text-field :disabled="disabledVal" label="编辑" v-model="historicalData[index].editor"></v-text-field>
                </v-flex>
                <v-flex offset-md1>
                  <v-btn primary @click="createTable">新建报表</v-btn>
                  <a :href="['http://172.22.0.34:8080/yqzc/export?cid='+historicalData[index].id+'&type=jb']"><v-btn primary>导出简报</v-btn></a>
                  <a :href="['http://172.22.0.34:8080/yqzc/export?cid='+historicalData[index].id+'&type=tb']"><v-btn primary>导出通报</v-btn></a>
                </v-flex>
              </v-layout>
              <div class="afterTop"><span>通报第 {{ historicalData[index].journel_all_idt }} 期</span> <span style="margin-left:15px">简报第 {{ historicalData[index].journel_all_idj }} 期</span></div>
              <v-card style="margin-bottom:30px">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">信息上报工作概况</span></v-card-title></v-toolbar>
                <v-card-title style="margin-left:15px"><h6>完成专项情况</h6></v-card-title>
                <v-flex md10 offset-md1>
                  <v-text-field multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].finish_status"></v-text-field>
                </v-flex>
                <v-card-title style="margin-left:15px"><h6>向中办、国办、中央国安办上报信息情况</h6></v-card-title>
                <v-flex offset-md1>
                  <v-layout wrap>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="《互联网信息专报》（期）" v-model="historicalData[index].central_periodicals"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="上报信息（条）" v-model="historicalData[index].central_information"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国办约稿（件）" v-model="historicalData[index].general_assign"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="中办采用（条）" v-model="historicalData[index].central_adopt"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="中办批示（条）" v-model="historicalData[index].central_comment"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="中办约稿（件）" v-model="historicalData[index].central_assign"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国安办约稿（件）" v-model="historicalData[index].national_security_assign"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国安办推送信息（条）" v-model="historicalData[index].national_security_push"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国安办批示量（条）" v-model="historicalData[index].national_security_comment"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md10>
                      <v-text-field :disabled="disabledVal"  label="典型信息标题（中央国安办）" v-model="historicalData[index].national_security_abstract"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="紧急信息线索发现（条）" v-model="historicalData[index].emergency_clue"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="紧急信息出刊（期）" v-model="historicalData[index].emergency_periodicals"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md10>
                      <v-text-field :disabled="disabledVal" label="典型信息标题（国务院应急办）" v-model="historicalData[index].emergency_abstract"></v-text-field>
                    </v-flex>
                  </v-layout>              
                </v-flex>
                <v-card-title style="margin-left:15px"><h6>向工信部上报信息情况</h6></v-card-title>
                <v-flex offset-md1>
                  <v-layout wrap>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="《互联网信息专报》(部)专报出刊（期）" v-model="historicalData[index].ministry_periodicals"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="综合研究出刊（篇）" v-model="historicalData[index].ministry_research_material"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="《信息关防专刊》出刊（期）" v-model="historicalData[index].ministry_info_security"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="《境外原文信息》出刊（期）" v-model="historicalData[index].ministry_jw_info"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md10>
                      <v-text-field :disabled="disabledVal"  label="典型信息标题" v-model="historicalData[index].ministry_abstract"></v-text-field>
                    </v-flex>
                  </v-layout>              
                </v-flex>
                <v-card-title style="margin-left:15px"><h6>向其他重要部门报送信息情况</h6></v-card-title>
                <v-flex offset-md1>
                  <v-layout wrap>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="驻部纪检组（期）" v-model="historicalData[index].other_displine"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="中央政法委（期）" v-model="historicalData[index].other_politics"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="最高法（期）" v-model="historicalData[index].other_superme_law"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="公安部（期）" v-model="historicalData[index].other_police"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="能源局（期）" v-model="historicalData[index].other_energy"></v-text-field>
                    </v-flex>             
                  </v-layout>
                  <v-layout wrap>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="中国电信通（期）" v-model="historicalData[index].other_telecom"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="信息总量（条）" v-model="historicalData[index].other_telecom_count"></v-text-field>
                    </v-flex> 
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="中国移动（周报）（期）" v-model="historicalData[index].other_mobile"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="中国移动（月报）（期）" v-model="historicalData[index].other_mobile_month"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md2>
                      <v-text-field :disabled="disabledVal"  label="信息总量（条）" v-model="historicalData[index].other_mobile_count"></v-text-field>
                    </v-flex>
                  </v-layout>                
                </v-flex>
                <v-card-title style="margin-left:15px"><h6>向中心领导及其他处室报送信息情况</h6></v-card-title>
                <v-flex offset-md1>
                  <v-layout>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="《信息关防舆情专报》（期）" v-model="historicalData[index].zx_info_count"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="《境外原文信息》出刊（期）" v-model="historicalData[index].zx_jw_count"></v-text-field>
                    </v-flex>
                  </v-layout>              
                </v-flex>              
              </v-card>
              <v-card style="margin-bottom:30px">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">手段建设情况</span></v-card-title></v-toolbar>
                <v-flex style="padding:20px;" class="text" md10 offset-md1>
                  <v-text-field label="手段建设情况（通报）" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].system_test_status"></v-text-field>
                </v-flex>
                <v-flex style="padding:20px;" class="text" md10 offset-md1>
                  <v-text-field label="手段建设情况（总结）" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].system_test_status_sum"></v-text-field>
                </v-flex>
              </v-card>
              <v-card style="margin-bottom:30px;">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">业务管理情况</span></v-card-title></v-toolbar>
                <v-flex class="text" md10 offset-md1 style="margin-top:15px">
                  <v-text-field label="中办双周研判会情况" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].manage_research_status"></v-text-field>
                </v-flex>
                <v-flex class="text" md10 offset-md1>
                  <v-text-field label="分中心跟班学习情况" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].manage_learn_status"></v-text-field>
                </v-flex>
                <v-flex class="text" md10 offset-md1>
                  <v-text-field label="分中心视频培训情况" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].manage_train_status"></v-text-field>
                </v-flex>
              </v-card>
              <v-card style="margin-bottom:30px">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">下一步关注重点</span></v-card-title></v-toolbar>
                <template v-for="(item,index2) in historicalData[index].nextAttention">
                  <v-layout style="padding:20px;" :key="item.val">
                    <v-flex class="text" md8 offset-md1>
                      <v-text-field :disabled="disabledVal"  label="下一步关注重点" v-model="historicalData[index].nextAttention[index2]"></v-text-field>
                    </v-flex>
                    <v-flex class="text" v-if="index2 == historicalData[index].nextAttention.length-1">
                      <v-btn :disabled="disabledVal" @click="addNext(index, 1)" v-tooltip:top="{ html:'增加'}" icon class="indigo--text"><v-icon>add</v-icon></v-btn>
                      <v-btn :disabled="historicalData[index].nextAttention.length==1" @click="deleteNext(index, 1)" v-tooltip:top="{ html:'删除'}" icon class="red--text"><v-icon>remove</v-icon></v-btn>
                    </v-flex>
                  </v-layout>
                </template>
              </v-card>
              <v-card style="margin-bottom:30px">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">附件</span></v-card-title></v-toolbar>
                <v-layout style="padding:20px;">
                  <v-flex offset-md1>
                    <div style="font-size: 20px" v-if="item != undefined" v-for="(item, index2) in historicalData[index].webAttachment2" :key="item.name">
                      <span>{{ item.name }}</span>
                      <a style='margin-left:15px' :href="item.url"><v-btn primary>下载</v-btn></a>
                      <v-btn :disabled="disabledVal" error @click="deleteAttachment(index, index2)">删除</v-btn>
                    </div>
                    <form id="fileForm" style="margin-top:30px">
                      <input :disabled="disabledVal" type="file" name="files" id="files">
                      <v-btn @click="submitForm(index)" small :disabled="disabledVal">确认提交</v-btn>
                    </form>
                  </v-flex>
                </v-layout>
              </v-card>
              <div class="mainBtnGroup">
                <v-btn primary :disabled="disabledVal" @click="save(index)">保存</v-btn>
                <v-btn error :disabled="disabledVal" @click="cancel(index)">取消</v-btn>
                <v-btn primary :disabled="disabledVal" @click="submit(index)">提交</v-btn>
              </div>
            </form>
          </div>
        </v-container>
      </main>
      <!-- 弹出框 -->
      <v-dialog v-model="dialog" width="50%">
        <v-card>
          <v-card-title><span class="headline">确认删除吗？</span></v-card-title>
          <div style="text-align:right">
            <v-btn @click.native.stop="dialog = false" @click="confirmDelete" primary>确认</v-btn>
            <v-btn @click.native.stop="dialog = false" error @click="deleteIndex = -1">取消</v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-app>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import $ from 'jquery'

var temp = ''

export default {
  name: 'main',
  data () {
    return {
      historicalData: [],
      conditionItems: ['全部', '未提交', '已提交'],
      condition: '全部',
      monthItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      showIndex: 0,
      drawer: true,
      disabledVal: true,
      ymDisableVal: true,
      page: 1,
      totalPage: 0,
      fileList: [],
      file: '',
      yearItems: [],
      dialog: false,
      templateName: '',
      deleteIndex: -1
    }
  },
  methods: {
    emitInputFile () {
      $('#fileForm2 input').click()
    },
    yearMonthChange (index) {
      let tempThis = this
      setTimeout(async function () {
        if (tempThis.historicalData[tempThis.showIndex].journel_month) {
          let res = await axios.get(`http://172.22.0.34:8080/yqzc/verify?year=${tempThis.historicalData[index].current_year}&month=${tempThis.historicalData[index].journel_month}`)
          if (res.data.data.yqzc_work_report) {
            tempThis.historicalData[tempThis.showIndex] = res.data.data.yqzc_work_report
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'title', '')
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'nextAttention', '')
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'webAttachment', '')
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'webAttachment2', '')
            tempThis.historicalData[tempThis.showIndex].webAttachment = res.data.data.yqzc_work_report.attachment.split('::')
            tempThis.historicalData[tempThis.showIndex].webAttachment2 = tempThis.historicalData[tempThis.showIndex].webAttachment.map(function (item) {
              let name = item.match(/\d_.+\.doc$|_.+\.docx$|_.+\.ppt$|_.+\.pptx$/)
              if (name) {
                return { name: name[0].substr(2), url: 'http://172.22.0.34:8080/yqzc/downattachment?filename=' + name[0].substr(2) }
              }
            })
            tempThis.historicalData[tempThis.showIndex].nextAttention = res.data.data.yqzc_work_report.next_attention.split('::')
            tempThis.historicalData[tempThis.showIndex].title = res.data.data.yqzc_work_report.current_year + ' 年' + res.data.data.yqzc_work_report.journel_month + ' 月'
            let tempIndex = tempThis.showIndex
            tempThis.showIndex = -1
            Vue.nextTick()
            tempThis.showIndex = tempIndex
          } else {
            let tempCurrentYear = tempThis.historicalData[tempThis.showIndex].current_year
            let tempMonth = tempThis.historicalData[tempThis.showIndex].journel_month
            if (tempThis.historicalData[0].title === '新建报表') tempThis.historicalData.shift()
            tempThis.historicalData.unshift({
              id: 'null',
              nextAttention: [''],
              system_test_status_sum: '',
              attachment: '',
              central_adopt: '',
              central_assign: '',
              central_comment: '',
              central_information: '',
              central_periodicals: '',
              current_year: tempCurrentYear,
              editor: '',
              emergency_abstract: '',
              emergency_clue: '',
              emergency_periodicals: '',
              finish_status: '',
              general_assign: '',
              journel_year_idt: res.data.data.journel_info.journel_year_idt,
              journel_all_idt: res.data.data.journel_info.journel_all_idt,
              journel_year_idj: res.data.data.journel_info.journel_year_idj,
              journel_all_idj: res.data.data.journel_info.journel_all_idj,
              journel_month: tempMonth,
              manage_learn_status: '',
              manage_research_status: '',
              manage_train_status: '',
              ministry_abstract: '',
              ministry_info_security: '',
              ministry_jw_info: '',
              ministry_periodicals: '',
              ministry_research_material: '',
              national_security_abstract: '',
              national_security_assign: '',
              national_security_comment: '',
              national_security_push: '',
              next_attention: '',
              other_displine: '',
              other_energy: '',
              other_mobile: '',
              other_mobile_count: '',
              other_mobile_month: '',
              other_police: '',
              other_politics: '',
              other_superme_law: '',
              other_telecom: '',
              other_telecom_count: '',
              system_test_status: '',
              title: '新建报表',
              zx_info_count: '',
              zx_jw_count: '',
              webAttachment: [],
              webAttachment2: [],
              is_submit: false
            })
            tempThis.showIndex = 0
          }
        }
      }, 50)
    },
    submitForm (index) {
      let path = document.getElementById('fileForm')[0].value
      if (!path.match(/\.doc$|\.docx$/)) {
        alert('请上传正确格式的文件！(.doc 或 .docx)')
        return
      }
      let formData = new FormData(document.getElementById('fileForm'))
      $.ajax({
        url: 'http://172.22.0.34:8080/yqzc/upload',
        type: 'post',
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        success: function (data) {
          temp = JSON.parse(data).data.files
        },
        error: function (data) {
          console.log(data)
        }
      })
      this.historicalData[index].webAttachment.push(temp[Object.keys(temp)[0]])
      this.historicalData[index].webAttachment2 = this.historicalData[index].webAttachment.map(function (item) {
        let name = item.match(/\d_.+\.doc$|_.+\.docx$|_.+\.ppt$|_.+\.pptx$/)
        if (name) {
          return { name: name[0].substr(2), url: 'http://172.22.0.34:8080/yqzc/downattachment?filename=' + name[0].substr(2) }
        }
      })
      temp = ''
    },
    addNext (index) {
      this.historicalData[index].nextAttention.push('')
    },
    deleteNext (index) {
      this.historicalData[index].nextAttention.splice(this.historicalData[index].nextAttention - 1, 1)
    },
    editHis (index) {
      this.showIndex = index
      this.disabledVal = false
    },
    hisClick (index) {
      this.showIndex = index
      this.disabledVal = true
      this.ymDisableVal = true
    },
    deleteHis (index) {
      this.dialog = true
      this.deleteIndex = index
    },
    confirmDelete () {
      if (this.historicalData[this.deleteIndex].id === null) {
        this.historicalData.splice(this.deleteIndex, 1)
        return
      }
      $.ajax({
        type: 'post',
        url: 'http://172.22.0.34:8080/yqzc/delete',
        data: this.historicalData[this.deleteIndex],
        async: false,
        success: function (data) {
          temp = JSON.parse(data)
        }
      })
      if (temp.result === 'success') this.historicalData.splice(this.deleteIndex, 1)
      temp = ''
      this.refresh()
    },
    save (index) {
      for (let i = 0; i < this.historicalData[index].webAttachment.length; i++) {
        if (this.historicalData[index].webAttachment[i] === '') this.historicalData[index].webAttachment.splice(i, 1)
      }
      this.historicalData[index].next_attention = this.historicalData[index].nextAttention.join('::')
      this.historicalData[index].attachment = this.historicalData[index].webAttachment.join('::')
      let formData = new FormData()
      for (var i in this.historicalData[index]) {
        if (this.historicalData[index][i] !== 'null') formData.append(i.toString(), this.historicalData[index][i].toString())
        if (this.historicalData[index][i] === '' && i !== 'attachment') {
          alert('保存失败，所有空格均为必填项！')
          return
        }
      }
      $.ajax({
        async: false,
        url: 'http://172.22.0.34:8080/yqzc/add',
        method: 'POST',
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        data: formData,
        success: function (data) {
          temp = JSON.parse(data)
          console.log(data)
        }
      })
      if (temp.result === 'success') {
        this.disabledVal = true
        temp = ''
        this.refresh()
      } else {
        alert('保存失败，请再次尝试！')
      }
    },
    submit (index) {
      this.historicalData[index].is_submit = true
      for (let i = 0; i < this.historicalData[index].webAttachment.length; i++) {
        if (this.historicalData[index].webAttachment[i] === '') this.historicalData[index].webAttachment.splice(i, 1)
      }
      this.historicalData[index].next_attention = this.historicalData[index].nextAttention.join('::')
      this.historicalData[index].attachment = this.historicalData[index].webAttachment.join('::')
      let formData = new FormData()
      for (var i in this.historicalData[index]) {
        if (this.historicalData[index][i] !== 'null') formData.append(i.toString(), this.historicalData[index][i].toString())
        if (this.historicalData[index][i] === '' && i !== 'attachment') {
          alert('保存失败，所有空格均为必填项！')
          return
        }
      }
      $.ajax({
        async: false,
        url: 'http://172.22.0.34:8080/yqzc/add',
        method: 'POST',
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        data: formData,
        success: function (data) {
          temp = JSON.parse(data)
          console.log(data)
        }
      })
      console.log(temp)
      if (temp.result === 'success') {
        this.disabledVal = true
        temp = ''
        this.refresh()
      } else {
        this.historicalData[index].is_submit = false
        alert('提交失败，请再次尝试！')
      }
    },
    uploadTemplate () {
      let tempThis = this
      let path = document.getElementById('fileForm2')[0].value
      if (!path.match(/\.ppt$|\.pptx$/)) {
        alert('请上传正确格式的文件！(.ppt 或 .pptx)')
        return
      }
      var formData = new FormData(document.getElementById('fileForm2'))
      $.ajax({
        url: 'http://172.22.0.34:8080/yqzc/upload',
        type: 'post',
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        success: function (data) {
          let res = JSON.parse(data)
          if (res.result === 'success') {
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
    cancel (index) {
      this.disabledVal = true
    },
    createTable () {
      this.ymDisableVal = false
      let a = new Date()
      this.historicalData.unshift({
        id: '',
        nextAttention: [''],
        system_test_status_sum: '',
        attachment: '',
        central_adopt: '',
        central_assign: '',
        central_comment: '',
        central_information: '',
        central_periodicals: '',
        current_year: a.getFullYear(),
        editor: '',
        emergency_abstract: '',
        emergency_clue: '',
        emergency_periodicals: '',
        finish_status: '',
        general_assign: '',
        is_submit: false,
        journel_year_idt: 0,
        journel_all_idt: 0,
        journel_year_idj: 0,
        journel_all_idj: 0,
        journel_month: '',
        manage_learn_status: '',
        manage_research_status: '',
        manage_train_status: '',
        ministry_abstract: '',
        ministry_info_security: '',
        ministry_jw_info: '',
        ministry_periodicals: '',
        ministry_research_material: '',
        national_security_abstract: '',
        national_security_assign: '',
        national_security_comment: '',
        national_security_push: '',
        next_attention: '',
        other_displine: '',
        other_energy: '',
        other_mobile: '',
        other_mobile_count: '',
        other_mobile_month: '',
        other_police: '',
        other_politics: '',
        other_superme_law: '',
        other_telecom: '',
        other_telecom_count: '',
        system_test_status: '',
        title: '新建报表',
        zx_info_count: '',
        zx_jw_count: '',
        webAttachment: [],
        webAttachment2: []
      })
      this.showIndex = 0
      this.disabledVal = false
    },
    async refresh () {
      let res = await axios.get(`http://172.22.0.34:8080/yqzc/query?page=${this.page}&state=${this.state}`)
      this.historicalData = res.data.data.yqzc_work_report
      this.templateName = res.data.data.template
      this.totalPage = Math.ceil(res.data.data.count / 10)
      for (let i = 0; i < res.data.data.yqzc_work_report.length; i++) {
        Vue.set(this.historicalData[i], 'title', '')
        Vue.set(this.historicalData[i], 'nextAttention', '')
        Vue.set(this.historicalData[i], 'webAttachment', '')
        Vue.set(this.historicalData[i], 'webAttachment2', '')
        this.historicalData[i].webAttachment = res.data.data.yqzc_work_report[i].attachment.split('::')
        this.historicalData[i].webAttachment2 = this.historicalData[i].webAttachment.map(function (item) {
          let name = item.match(/\d_.+\.doc$|_.+\.docx$|_.+\.ppt$|_.+\.pptx$/)
          if (name) {
            return { name: name[0].substr(2), url: 'http://172.22.0.34:8080/yqzc/downattachment?filename=' + name[0].substr(2) }
          }
        })
        this.historicalData[i].nextAttention = res.data.data.yqzc_work_report[i].next_attention.split('::')
        this.historicalData[i].title = res.data.data.yqzc_work_report[i].current_year + ' 年' + res.data.data.yqzc_work_report[i].journel_month + ' 月'
      }
    },
    deleteAttachment (index, index2) {
      this.historicalData[index].webAttachment.splice(index2, 1)
      this.historicalData[index].webAttachment2.splice(index2, 1)
    }
  },
  computed: {
    state () {
      return this.conditionItems.indexOf(this.condition)
    }
  },
  watch: {
    page: _.debounce(async function () {
      this.refresh()
      this.showIndex = 0
    }, 200),
    condition: _.debounce(async function () {
      this.page = 1
      this.refresh()
    }, 100)
  },
  created: async function () {
    for (let i = 0; i < 30; i++) {
      this.yearItems.push(2000 + i)
    }
    let res = await axios.get('http://172.22.0.34:8080/yqzc/query?page=1&state=0')
    this.templateName = res.data.data.template
    this.historicalData = res.data.data.yqzc_work_report
    this.totalPage = Math.ceil(res.data.data.count / 10)
    for (let i = 0; i < res.data.data.yqzc_work_report.length; i++) {
      Vue.set(this.historicalData[i], 'title', '')
      Vue.set(this.historicalData[i], 'nextAttention', '')
      Vue.set(this.historicalData[i], 'webAttachment', '')
      Vue.set(this.historicalData[i], 'webAttachment2', '')
      this.historicalData[i].webAttachment = res.data.data.yqzc_work_report[i].attachment.split('::')
      this.historicalData[i].webAttachment2 = this.historicalData[i].webAttachment.map(function (item) {
        let name = item.match(/\d_.+\.doc$|_.+\.docx$|_.+\.ppt$|_.+\.pptx$/)
        if (name) {
          return { name: name[0].substr(2), url: 'http://172.22.0.34:8080/yqzc/downattachment?filename=' + name[0].substr(2) }
        }
      })
      this.historicalData[i].nextAttention = res.data.data.yqzc_work_report[i].next_attention.split('::')
      this.historicalData[i].title = res.data.data.yqzc_work_report[i].current_year + ' 年' + res.data.data.yqzc_work_report[i].journel_month + ' 月'
    }
  }
}

</script>

<style scoped>
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
  margin-top: 40px;
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
.nav{
  padding: 0;
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
</style>
