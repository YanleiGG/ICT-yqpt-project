import Vue from 'vue'
import Router from 'vue-router'
import ydjb from '@/components/ydjb'
import ydzj from '@/components/ydzj'
import main from '@/components/main'
import hygl from '@/components/hygl'
import instruction from '@/components/instruction'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/ydjb',
      name: 'ydjb',
      component: ydjb
    },
    {
      path: '/ydzj',
      name: 'ydzj',
      component: ydzj
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: instruction
    },
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/hygl',
      name: 'hygl',
      component: hygl
    }
  ]
})
