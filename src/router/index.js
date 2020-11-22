import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

Vue.use(VueRouter)

const routes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/Home')
      },
      {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
  }
]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

NProgress.configure({ showSpinner: false }) // NProgress Configuration
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
