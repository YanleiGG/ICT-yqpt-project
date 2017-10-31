import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import instruction from '@/components/instruction'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: instruction    
    }
  ]
})
