import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home/index.vue'
import { accessTokenAPI } from '@/api'

if (!window.VueRouter) Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/likeButton',
      name: 'likeButton',
      component: () => import('./views/likeButton.vue')
    },
    {
      path: '/about',
      name: 'About',
      // 路由级 code-splitting
      // 这会给当前的路由页生成单独的块文件 (webpackChunkName 是 about 则得到 about.[版本哈希].js)
      // 只有使用该 route 的场合才会下载这个页面的代码 (惰性加载).
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/article/:hash', // 支持 hash id 访问
      name: 'Article',
      props: true,
      component: () =>
        import(/* webpackChunkName: "article", webpackPrefetch: true */ './views/Article/index.vue')
    },
    {
      path: '/tag',
      name: 'Tag',
      props: true,
      component: () => import(/* webpackChunkName: "Tag" */ './views/Tag/index.vue')
    },
    {
      path: '/login/github',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
      beforeEnter: (to, from, next) => {
        if (!to.query.from) {
          next({ name: 'Login', query: { ...to.query, from: from.path } })
        } else next()
      }
    },
    {
      path: '/user/:id',
      name: 'User',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User/index.vue')
    },
    {
      path: '/user/edit/:id',
      name: 'UserEdit',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User/edit.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      }
    },
    {
      path: '/user/asset/:id',
      name: 'Asset',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User/Asset/index.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      } // 你怎么能随便给别人看到自己的资产明细呢？不怕被人打吗？
    },
    {
      path: '/user/asset/:id/:type',
      name: 'AssetType',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User/Asset/Asset.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      } // 你怎么能随便给别人看到自己的资产明细呢？不怕被人打吗？
    },
    {
      path: '/user/withdraw/:id/:type',
      name: 'Withdraw',
      props: true,
      component: () => import(/* webpackChunkName: "Withdraw" */ './views/User/Withdraw'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      }
    },
    {
      path: '/user/:id/original',
      name: 'Original',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User/Original.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      } // 你怎么能随便给别人看到自己的资产明细呢？不怕被人打吗？
    },
    {
      path: '/user/:id/reward',
      name: 'Reward',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User/Reward.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      } // 你怎么能随便给别人看到自己的资产明细呢？不怕被人打吗？
    },
    {
      path: '/buyHistory',
      name: 'BuyHistory',
      props: true,
      component: () => import(/* webpackChunkName: "BuyHistory" */ './views/User/buyHistory')
    },
    {
      // id 用于编辑文章或者草稿的时候动态传值使用
      // 发布文章后面可以为  publish/create
      // 编辑文章后面接id publish/id？from=”edit“ 通过query来区分
      // 草稿箱编辑 publish/id？from=”draft“ 通过query来区分
      // 统一发布、编辑、草稿箱，解决出现多套样式和重复代码的问题，并且减少工作量和不必要的错误
      path: '/publish/:id',
      name: 'Publish',
      props: true,
      component: () => import(/* webpackChunkName: "article-edit" */ './views/Publish/Publish.vue'),
      beforeEnter: (to, from, next) => {
        if (to.query.from === 'edit' && from.name !== 'Article') next('/')
        else next()
      }
    },
    {
      path: '/followlist/:id',
      name: 'FollowList',
      props: true,
      component: () =>
        import(/* webpackChunkName: "followlist" */ './views/User/FollowList/FollowList.vue')
    },
    {
      path: '/draftbox/:id',
      name: 'DraftBox',
      props: true,
      component: () => import(/* webpackChunkName: "draftbox" */ './views/User/DraftBox.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      } // 你怎么能随便给别人看到自己的资产明细呢？不怕被人打吗？
    },
    {
      path: '/help',
      name: 'Help',
      props: true,
      component: () => import(/* webpackChunkName: "Help" */ './views/User/Help/index.vue')
    },
    {
      path: '/_easter-egg',
      name: 'EasterEgg',
      props: true,
      component: () => import(/* webpackChunkName: "easter-egg" */ './views/EasterEgg.vue')
    },
    {
      // 幽林页面重定向进入首页 可以考虑设计 404 页面
      path: '*',
      redirect: '/'
    }
  ]
})
