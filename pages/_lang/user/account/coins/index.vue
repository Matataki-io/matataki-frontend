<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="account" />
      <fanCoinsPublish v-if="!isPublishCoins" />
      <fanCoinsManage v-else />
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import moment from 'moment'

import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import fanCoinsPublish from '@/components/user/fan_coins_publish.vue'
import fanCoinsManage from '@/components/user/fan_coins_manage.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    fanCoinsPublish,
    fanCoinsManage
  },
  data() {
    return {
      isPublishCoins: true,
      pointLog: {
        params: {
          pagesize: 10
        },
        apiUrl: 'userInvitees',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      assets: {
      },
      viewStatus: 0, // 0 1
      amount: 0
    }
  },
  methods: {
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
    },
    cover(cover) {
      return cover ? this.$API.getImg(cover) : ''
    },
    paginationData(res) {
      console.log(res)
      this.pointLog.list = res.data.list
      this.assets = res.data
      this.total = res.data.count || 0
      this.amount = res.data.amount || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pointLog.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    },
    formatterDate(row, column) {
      console.log(row, column)
      return row.date + 1
    },
    formatterPoint(row, column) {
      console.log(row, column)
      return row.point + 11
    }
  }
}
</script>
