import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/chat')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: {
      gorouter: false, // 是否需要权限
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat'),
    meta: {
      gorouter: true, // 是否需要权限
    }
  },
  {
    path: '/empty',
    name: 'Empty',
    component: () => import('@/views/empty'),
    meta: {
      gorouter: false, // 是否需要权限
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 看看用户是否已经登录，否则跳转到登录页面
  if (to.meta.gorouter) {
    if (store.getters.user && store.getters.user.email && store.getters.user.token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
  // switch (to.name) {
  //   case 'Login': {
  //     next()
  //     break
  //   }
  //   default: {
  //     if (store.getters.user && store.getters.user.email && store.getters.user.token) {
  //       next()
  //     } else {
  //       next('/login')
  //     }
  //     break
  //   }
  // }
})

export default router
