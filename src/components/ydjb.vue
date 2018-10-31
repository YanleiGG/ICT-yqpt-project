<template>
    <v-app>
      <v-navigation-drawer app persistent light v-model="drawer" class="nav-1" style="z-index:0">
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
          <v-list-tile :value="index==showIndex" class="pt-2" v-for="(item,index) in historicalData" :key="item.title" @click="hisClick(index, item.title)">
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
        <div class="bottomBar">
          <img src="../assets/pic.png" style="width:100%;margin-top:20px;">       
          <div class="bottomGroup">
            <div style="font-size:120%">{{ templateName }}</div>
            <div class="headline red--text templateTitle">作图模板</div>
            <v-btn @click="emitInputFile" icon class="indigo--text"><v-icon>file_upload</v-icon></v-btn>
            <a :href="[path + '/download']"><v-btn icon v class="indigo--text"><v-icon>file_download</v-icon></v-btn></a>           
          </div>
          <form class="uploadTemplate" id="fileForm2">
            <input style="width:3px" type="file" id="files" name="files" @change='uploadTemplate'>
          </form>
        </div>
      </v-navigation-drawer>
      <main style="margin-top: 65px">
        <v-container fluid>
          <div v-for="(item,index) in historicalData" :key="item.title" v-if="index == showIndex">
            <form id="allForm">
              <v-layout>
                <v-flex md1>
                  <v-btn v-tooltip:bottom="{ html:'展开列表'}" @click="drawer = !drawer" icon v-show="!drawer"><v-icon>keyboard_arrow_right</v-icon></v-btn>
                  <v-btn v-tooltip:bottom="{ html:'收起列表'}" @click="drawer = !drawer" icon v-show="drawer"><v-icon>keyboard_arrow_left</v-icon></v-btn>
                </v-flex>
                <v-flex md2>
                  <v-select :disabled="disabledVal || ymDisableVal" @change="yearMonthChange(index)" :items="yearItems" v-model="historicalData[index].current_year" label="年"></v-select>
                </v-flex>
                <v-flex md2 style="margin-left:20px;">
                  <v-select :disabled="disabledVal || ymDisableVal" @change="yearMonthChange(index)" :items="monthItems" v-model="historicalData[index].journel_month" label="月份"></v-select>
                </v-flex>
                <v-flex md2 style="margin-left:20px;">
                  <v-text-field :disabled="disabledVal" label="编辑人" v-model="historicalData[index].editor"></v-text-field>
                </v-flex>
                <v-flex offset-md1>
                  <v-btn primary @click="createTable">新建报表</v-btn>
                  <v-btn primary @click="exportTable(index)">导出简报</v-btn>
                  <a target="_blank" class="export" :href="[path + '/export?cid='+historicalData[index].id+'&type=jb']"></a>
                </v-flex>
              </v-layout>
              <div class="afterTop"><span style="margin-left:15px">简报第 {{ historicalData[index].journel_all_idj }} 期</span></div>
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
                      <v-text-field :disabled="disabledVal" label="上报信息总量（条）" v-model="historicalData[index].central_information"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国办约稿（件）" v-model="historicalData[index].general_assign"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="中办约稿（件）" v-model="historicalData[index].central_assign"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="中办采用（条）" v-model="historicalData[index].central_adopt"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="中办批示（条）" v-model="historicalData[index].central_comment"></v-text-field>              
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国安办约稿（件）" v-model="historicalData[index].national_security_assign"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国安办推送（条）" v-model="historicalData[index].national_security_push"></v-text-field>
                    </v-flex>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal" label="国安办批示（条）" v-model="historicalData[index].national_security_comment"></v-text-field>
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
                <v-card-title style="margin-left:15px"><h6>向网信办上报信息情况</h6></v-card-title>
                <v-flex offset-md1>
                  <v-layout wrap>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="应急局《舆情快报》（期）" v-model="historicalData[index].wxb_yqkb"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex class="text" style="font-size:18px">
                      <span style="color: grey">专项监测</span>
                    </v-flex>
                  </v-layout>
                  <template v-for="(item,index2) in historicalData[index].wxb_zxjc_arr">
                    <v-layout style="padding:20px;" :key="item.val">
                      <v-flex class="text" md4>
                        <v-text-field :disabled="disabledVal"  label="专项名称" v-model="historicalData[index].wxb_zxjc_arr[index2].name"></v-text-field>
                      </v-flex>
                      <v-flex class="text" md4>
                        <v-text-field :disabled="disabledVal"  label="期数" v-model="historicalData[index].wxb_zxjc_arr[index2].count"></v-text-field>
                      </v-flex>
                      <v-flex class="text" v-if="index2 == historicalData[index].wxb_zxjc_arr.length-1">
                        <v-btn :disabled="disabledVal" @click="addZXJC(index, 1)" v-tooltip:top="{ html:'增加'}" icon class="indigo--text"><v-icon>add</v-icon></v-btn>
                        <v-btn :disabled="historicalData[index].wxb_zxjc_arr.length==1 || disabledVal" @click="deleteZXJC(index, 1)" v-tooltip:top="{ html:'删除'}" icon class="red--text"><v-icon>remove</v-icon></v-btn>
                      </v-flex>
                    </v-layout>
                  </template>
                </v-flex>
                <!-- <v-card-title style="margin-left:15px"><h6>向工信部上报信息情况</h6></v-card-title>
                <v-flex offset-md1>
                  <v-layout wrap>
                    <v-flex class="text" md3>
                      <v-text-field :disabled="disabledVal"  label="《互联网信息专报》(部)出刊（期）" v-model="historicalData[index].ministry_periodicals"></v-text-field>
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
                </v-flex> -->
                <!-- <v-card-title style="margin-left:15px"><h6>向其他重要部门报送信息情况</h6></v-card-title>
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
                </v-flex> -->
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
                  <v-text-field label="手段建设情况（总结）" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].system_test_status_sum"></v-text-field>
                </v-flex>
              </v-card>
              <v-card style="margin-bottom:30px;">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">业务管理情况</span></v-card-title></v-toolbar>
                <v-flex class="text" md10 offset-md1 style="margin-top:15px">
                  <v-text-field label="中办舆情研判会情况" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].manage_research_status"></v-text-field>
                </v-flex>
                <v-flex class="text" md10 offset-md1>
                  <v-text-field label="业务培训情况" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].manage_train_status"></v-text-field>
                </v-flex>
                <v-flex class="text" md10 offset-md1>
                  <v-text-field label="分中心跟班学习情况" multi-line :disabled="disabledVal"  multi-line v-model="historicalData[index].manage_learn_status"></v-text-field>
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
                      <v-btn :disabled="historicalData[index].nextAttention.length==1 || disabledVal" @click="deleteNext(index, 1)" v-tooltip:top="{ html:'删除'}" icon class="red--text"><v-icon>remove</v-icon></v-btn>
                    </v-flex>
                  </v-layout>
                </template>
              </v-card>
              <v-card style="margin-bottom:30px">
                <v-toolbar style="background-color:rgb(25,118,210)"><v-card-title><span class="headline white--text">附件</span></v-card-title></v-toolbar>
                <v-layout style="padding:20px;">
                  <v-flex offset-md1>
                    <div style="font-size: 20px" v-if="item != undefined" v-for="(item, index2) in historicalData[index].webAttachment2" :key="item.url">
                      <span>{{ item.name }}</span>
                      <v-btn primary @click="downloadAttachment(index2)">下载</v-btn>
                      <a target="_blank" v-show="false" :href="item.url" class="attachmentA"></a>
                      <v-btn :disabled="disabledVal" error @click="deleteAttachment(index, index2)">删除</v-btn>
                    </div>
                    <form id="fileForm" style="margin-top:30px">
                      <input :disabled="disabledVal" type="file" name="files" id="files">
                      <v-btn @click="submitForm(index)" small :disabled="disabledVal || submitBtnDisabled">确认提交</v-btn>
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
      <v-dialog v-model="deleteDialog" width="50%">
        <v-card>
          <v-card-title><span class="headline">确认删除吗？</span></v-card-title>
          <div style="text-align:right">
            <v-btn @click.native.stop="deleteDialog = false" @click="confirmDelete" primary>确认</v-btn>
            <v-btn @click.native.stop="deleteDialog = false" error @click="deleteIndex = -1">取消</v-btn>
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
import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import $ from 'jquery'
import { mapState, mapActions, mapMutations } from 'vuex'

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
      totalPage: 1,
      fileList: [],
      file: '',
      yearItems: [2017, 2018, 2019, 2020],
      deleteDialog: false,
      submitDialog: false,
      templateName: '',
      deleteIndex: -1,
      submitIndex: -1,
      submitBtnDisabled: false
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
          let res = await axios.get(`${tempThis.path}/verify?year=${tempThis.historicalData[index].current_year}&month=${tempThis.historicalData[index].journel_month}`)
          let data = res.data.data
          if (data.yqzc_work_report) {
            tempThis.historicalData[tempThis.showIndex] = data.yqzc_work_report
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'title', '')
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'nextAttention', '')
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'webAttachment', '')
            Vue.set(tempThis.historicalData[tempThis.showIndex], 'webAttachment2', '')
            tempThis.historicalData[tempThis.showIndex].webAttachment = data.yqzc_work_report.attachment.split('::')
            tempThis.historicalData[tempThis.showIndex].webAttachment2 = tempThis.historicalData[tempThis.showIndex].webAttachment.map(function (item) {
              let name = item.match(/\d(_.+\.doc|_.+\.docx|_.+\.ppt|_.+\.pptx)$/)
              if (name) {
                return { name: name[0].substr(2), url: tempThis.path + '/downattachment?filename=' + name[0].substr(2) }
              }
            })
            for (let i = 0;i < data.yqzc_work_report.length;i++) {
              if (!data.yqzc_work_report[i].wxb_zxjc) {
                this.historicalData[i].wxb_zxjc_arr = [{ name: '', count: '' }]
              } else {
                this.historicalData[i].wxb_zxjc_arr = []
                data.yqzc_work_report[i].wxb_zxjc.split(';').forEach(item => {
                  if (item != '') {
                    this.historicalData[i].wxb_zxjc_arr.push({ name: item.split("::")[0], count: item.split("::")[1] })
                  }
                })
              }              
            }
            tempThis.historicalData[tempThis.showIndex].nextAttention = data.yqzc_work_report.next_attention.split('::')
            tempThis.historicalData[tempThis.showIndex].title = data.yqzc_work_report.current_year + ' 年' + data.yqzc_work_report.journel_month + ' 月'
            let tempIndex = tempThis.showIndex
            tempThis.showIndex = -1
            Vue.nextTick()
            tempThis.showIndex = tempIndex
          } else {
            let tempCurrentYear = tempThis.historicalData[tempThis.showIndex].current_year
            let tempMonth = tempThis.historicalData[tempThis.showIndex].journel_month
            if (tempThis.historicalData[0].title === '新建报表') tempThis.historicalData.shift()
            tempThis.historicalData.unshift({
              id: '0',
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
              journel_year_idj: data.journel_info.journel_year_idj,
              journel_all_idj: data.journel_info.journel_all_idj,
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
              title: '新建报表',
              zx_info_count: '',
              zx_jw_count: '',
              webAttachment: [],
              webAttachment2: [],
              is_submit: false,
              wxb_yqkb: '',
              wxb_zxjc: '',
              wxb_zxjc_arr: [{ name: '', count: '' }]
            })
            tempThis.showIndex = 0
          }
        }
      }, 50)
    },
    submitForm (index) {
      let filePath = document.getElementById('fileForm')[0].value
      if (!filePath.match(/\.doc$|\.docx$/)) {
        alert('请上传正确格式的文件！(.doc 或 .docx)')
        return
      }
      this.submitBtnDisabled = true
      let tempThis = this
      let formData = new FormData(document.getElementById('fileForm'))
      $.ajax({
        url: tempThis.path + '/upload',
        type: 'post',
        data: formData,
        // async: false,
        contentType: false,
        processData: false,
        success: function (data) {
          if (JSON.parse(data).result === 'success') {
            temp = JSON.parse(data).data.files
            tempThis.historicalData[index].webAttachment.push(temp[Object.keys(temp)[0]])
            tempThis.historicalData[index].webAttachment2 = tempThis.historicalData[index].webAttachment.map(function (item) {
              let name = item.match(/\d(_.+\.doc|_.+\.docx|_.+\.ppt|_.+\.pptx)$/)
              if (name) {
                return { name: name[0].substr(2), url: tempThis.path + '/downattachment?filename=' + name[0].substr(2) }
              }
            })
          } else {
            alert('上传失败，请重新尝试！')
          }
          tempThis.submitBtnDisabled = false
          temp = ''
        },
        error: function (data) {
          alert('上传失败，请重新尝试！')
          tempThis.submitBtnDisabled = false
        }
      })
    },
    addNext (index) {
      this.historicalData[index].nextAttention.push('')
    },
    deleteNext (index) {
      this.historicalData[index].nextAttention.splice(this.historicalData[index].nextAttention.length - 1, 1)
    },
    addZXJC (index) {
      this.historicalData[index].wxb_zxjc_arr.push({ name: '', count: '' })
    },
    deleteZXJC (index) {
      this.historicalData[index].wxb_zxjc_arr.splice(this.historicalData[index].wxb_zxjc_arr.length - 1, 1)
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
      this.deleteDialog = true
      this.deleteIndex = index
    },
    confirmDelete () {
      if (this.historicalData[this.deleteIndex].id === null) {
        this.historicalData.splice(this.deleteIndex, 1)
        return
      }
      $.ajax({
        type: 'post',
        url: this.path + '/delete',
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
      if (this.historicalData[index].journel_month === '') {
        alert('请填写月份！')
        return
      }          
      for (let i = 0; i < this.historicalData[index].webAttachment.length; i++) {
        if (this.historicalData[index].webAttachment[i] === '') this.historicalData[index].webAttachment.splice(i, 1)
      }
      this.historicalData[index].next_attention = this.historicalData[index].nextAttention.join('::')
      this.historicalData[index].attachment = this.historicalData[index].webAttachment.join('::')
      this.historicalData[index].wxb_zxjc = ''
      if (this.historicalData[index].wxb_zxjc_arr) {
        this.historicalData[index].wxb_zxjc_arr.forEach(item => {
          this.historicalData[index].wxb_zxjc += item.name + "::" + item.count + ';'
        })
      }
      let formData = new FormData()
      for (var i in this.historicalData[index]) {
        if (this.historicalData[index][i] !== null && this.historicalData[index][i] !== 'null') formData.append(i.toString(), this.historicalData[index][i].toString())
      }
      $.ajax({
        async: false,
        url: this.path + '/add',
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
        this.ymDisableVal = true
        this.disabledVal = true
        temp = ''
        this.refresh()
      } else {
        alert('保存失败，请再次尝试！')
      }
    },
    submit(index) {
      this.submitDialog = true
      this.submitIndex = index
    },
    confirmSubmit () {
      let index = this.submitIndex
      this.historicalData[index].is_submit = true
      for (let i = 0; i < this.historicalData[index].webAttachment.length; i++) {
        if (this.historicalData[index].webAttachment[i] === '') this.historicalData[index].webAttachment.splice(i, 1)
      }
      this.historicalData[index].next_attention = this.historicalData[index].nextAttention.join('::')
      this.historicalData[index].attachment = this.historicalData[index].webAttachment.join('::')
      this.historicalData[index].wxb_zxjc = ''
      this.historicalData[index].wxb_zxjc_arr.forEach(item => {
        this.historicalData[index].wxb_zxjc += item.name + "::" + item.count + ';'
      })
      let formData = new FormData()
      for (var i in this.historicalData[index]) {
        if (this.historicalData[index][i] !== null) formData.append(i.toString(), this.historicalData[index][i].toString())
        // if (this.historicalData[index][i] === '' && i !== 'attachment') {
        //   this.historicalData[index].is_submit = false
        //   alert('提交失败，所有空格均为必填项！')
        //   return
        // }
      }
      $.ajax({
        async: false,
        url: this.path + '/add',
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
        this.ymdisabledVal = true
        temp = ''
        this.refresh()
      } else {
        this.historicalData[index].is_submit = false
        alert('提交失败，请再次尝试！')
      }
    },
    uploadTemplate () {
      let tempThis = this
      let filePath = document.getElementById('fileForm2')[0].value
      if (!filePath.match(/\.ppt$|\.pptx$/)) {
        alert('请上传正确格式的文件！(.ppt 或 .pptx)')
        return
      }
      var formData = new FormData(document.getElementById('fileForm2'))
      $.ajax({
        url: this.path + '/upload',
        type: 'post',
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        success: async function (data) {
          let res = JSON.parse(data)
          if (res.result === 'success') {
            let res2 = await axios.get( tempThis.path + '/query?page=1&state=0')
            tempThis.templateName = res2.data.data.template
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
        id: '0',
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
        title: '新建报表',
        zx_info_count: '',
        zx_jw_count: '',
        webAttachment: [],
        webAttachment2: [],
        wxb_yqkb: '',
        wxb_zxjc: '',
        wxb_zxjc_arr: [{ name: '', count: '' }]
      })
      this.showIndex = 0
      this.disabledVal = false
    },
    async refresh () {
      let res = await axios.get(`${this.path}/query?page=${this.page}&state=${this.state}`)
      let data = res.data.data
      this.historicalData = data.yqzc_work_report      
      this.templateName = data.template
      this.totalPage = Math.ceil(data.count / 8)
      if (data.yqzc_work_report.length === 0) {
        this.historicalData = []
        this.totalPage = 1
        this.createTable()
        return
      }
      for (let i = 0; i < data.yqzc_work_report.length; i++) {
        Vue.set(this.historicalData[i], 'title', '')
        Vue.set(this.historicalData[i], 'nextAttention', '')
        Vue.set(this.historicalData[i], 'webAttachment', '')
        Vue.set(this.historicalData[i], 'webAttachment2', '')
        Vue.set(this.historicalData[i], 'wxb_zxjc_arr', [])
        if ( data.yqzc_work_report[i].attachment === '' ) {
          this.historicalData[i].attachment = ''
          this.historicalData[i].webAttachment = []
          this.historicalData[i].webAttachment2 = []
        } else {
          this.historicalData[i].webAttachment = this.historicalData[i].attachment.split('::')
          this.historicalData[i].webAttachment2 = this.historicalData[i].webAttachment.map(function (item) {
            let name = item.match(/\d(_.+\.doc|_.+\.docx|_.+\.ppt|_.+\.pptx)$/)
            if (name) {
              return { name: name[0].substr(2), url: this.path + '/downattachment?filename=' + item }
            } else {
                return { name: item, url: this.path + '/downattachment?filename=' + item }
            }
          })        
        }
        if (!data.yqzc_work_report[i].wxb_zxjc) {
          this.historicalData[i].wxb_zxjc_arr = [{ name: '', count: '' }]
        } else {
          this.historicalData[i].wxb_zxjc_arr = []
          data.yqzc_work_report[i].wxb_zxjc.split(';').forEach(item => {
            if (item != '') {
              this.historicalData[i].wxb_zxjc_arr.push({ name: item.split("::")[0], count: item.split("::")[1] })
            }
          })
        }      
        if ( data.yqzc_work_report[i].next_attention === null ) this.historicalData[i].next_attention = ''
        this.historicalData[i].nextAttention = data.yqzc_work_report[i].next_attention.split('::')
        this.historicalData[i].title = data.yqzc_work_report[i].current_year + ' 年 ' + data.yqzc_work_report[i].journel_month + ' 月'
      }
    },
    deleteAttachment (index, index2) {
      this.historicalData[index].webAttachment.splice(index2, 1)
      this.historicalData[index].webAttachment2.splice(index2, 1)
    },
    exportTable (index) {
      // for (var i in this.historicalData[index]) {
      //   if (this.historicalData[index][i] === null || this.historicalData[index][i] === '' && i !== 'attachment') {
      //     alert('导出失败，所有空格均为必填项！')
      //     return
      //   }
      // }
      $('.export')[0].click()
    },
    downloadAttachment (index) {
      $('.attachmentA')[index].click()
    }
  },
  computed: {
    ...mapState({
      path: state => state.path,
      isLogin: state => state.isLogin,
      userId: state => state.userId,
      username: state => state.username
    }),
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
    }, 100),
    historicalData: function () {
      if (this.historicalData.length > 8) {
        this.historicalData.splice(8)
      }
    }
  },
  created: async function () {
    let res = await axios.get(this.path + '/query?page=1&state=0')
    let data = res.data.data
    console.log(data)
    if (data.yqzc_work_report.length === 0) {
      this.createTable()
      return
    }
    this.templateName = data.template
    this.historicalData = data.yqzc_work_report
    this.totalPage = Math.ceil(data.count / 8)
    for (let i = 0; i < data.yqzc_work_report.length; i++) {
      Vue.set(this.historicalData[i], 'title', '')
      Vue.set(this.historicalData[i], 'nextAttention', '')
      Vue.set(this.historicalData[i], 'webAttachment', '')
      Vue.set(this.historicalData[i], 'webAttachment2', '')
      Vue.set(this.historicalData[i], 'wxb_zxjc_arr', [])
      if ( data.yqzc_work_report[i].attachment === '' ) {
        this.historicalData[i].attachment = ''
        this.historicalData[i].webAttachment = []
        this.historicalData[i].webAttachment2 = []
      } else {
        this.historicalData[i].webAttachment = this.historicalData[i].attachment.split('::')
        this.historicalData[i].webAttachment2 = this.historicalData[i].webAttachment.map(function (item) {
          let name = item.match(/\d(_.+\.doc|_.+\.docx|_.+\.ppt|_.+\.pptx)$/)
          if (name) {
            return { name: name[0].substr(2), url: this.path + '/downattachment?filename=' + item }
          } else {
              return { name: item, url: this.path + '/downattachment?filename=' + item }
          }
        })        
      }
      if (!data.yqzc_work_report[i].wxb_zxjc) {
        this.historicalData[i].wxb_zxjc_arr = [{ name: '', count: '' }]
      } else {
        this.historicalData[i].wxb_zxjc_arr = []
        data.yqzc_work_report[i].wxb_zxjc.split(';').forEach(item => {
          if (item != '') {
            this.historicalData[i].wxb_zxjc_arr.push({ name: item.split("::")[0], count: item.split("::")[1] })
          }
        })
      }
      if ( data.yqzc_work_report[i].next_attention === null ) this.historicalData[i].next_attention = ''
      this.historicalData[i].nextAttention =this.historicalData[i].next_attention.split('::')
      this.historicalData[i].title = data.yqzc_work_report[i].current_year + ' 年 ' + data.yqzc_work_report[i].journel_month + ' 月'
    }
  }
}

</script>

<style scoped>
.bottomBar{
  position: absolute;
  top: 600px;
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
</style>
