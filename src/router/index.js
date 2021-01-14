import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/index.vue'
import Home from '@/views/home/index.vue'
import AdminHome from '@/views/adminHome/index.vue'
import AdminBook from '@/views/adminBook/index.vue'
import AdminUser from '@/views/adminUser/index.vue'
import Book from '@/views/book/index.vue'
import Info from '@/views/info/index.vue'
import Layout from '@/views/layout'
Vue.use(Router)

const routes = [{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/',
  component: Layout,
  children: [{
    path: '', //首页user
    name: 'home',
    component: Home
  },
  {
    path: '/admin', //管理员首页
    name: 'admin',
    component: AdminHome
  },
  {
    path: '/adminBook', //管理员借阅管理
    name: 'adminBook',
    component: AdminBook
  },
  {
    path: '/adminUser', //管理员用户管理
    name: 'adminUser',
    component: AdminUser
  },
  {
    path: '/book', //借阅图书信息管理user
    name: 'book',
    component: Book
  },
  {
    path: '/info', //个人信息管理
    name: 'info',
    component: Info
  }
  ]
}
]
const router = new Router({
  routes
})
//导航守卫 所有页面都经过它
//to :要跳转的页面
//from： 从哪个页面跳转而来
//next： 放行的方法 next()
router.beforeEach((to, from, next) => {
  console.log('to:', to)
  console.log('from:', from)
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      //已登录，放行
      if (user.role == 'user' && (to.path == '/admin' || to.path == '/adminBook' || to.path == '/adminUser')) {
        next('/')//重定向到用户首页
      }
      if (user.role == 'admin' && (to.path != '/admin' && to.path != '/adminBook' && to.path != '/adminUser' && to.path != '/info')) {
        next('/admin')//重定向到用户首页
      }
      next()
    } else {
      next('/login') //未登录，重定向到登录
    }
  } else {
    next()//登录页面放行
  }
})
export default router
