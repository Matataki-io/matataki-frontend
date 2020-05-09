<template>
  <div class="notification">
    <g-header />
    <el-row class="notification-container">
      <el-col :span="6">
        <nav>
          <ul>
            <li
              v-for="(nav, index) in navItems"
              :key="nav.name"
              :class="{ active: active === index }"
              @click="setActive(index)"
            >
              <svg-icon
                :icon-class="nav.icon + (PROVIDERS.includes(nav.name) ? '' : '-gray')"
                class="icon"
              />
              <span class="name">{{ nav.text }}</span>
              <span
                v-if="PROVIDERS.includes(nav.name)"
                class="count"
              >+{{ notificationCounters[nav.name] || 0 }}</span>
            </li>
          </ul>
        </nav>
      </el-col>
      <el-col :span="18">
        <NotificationList :notifications="notifications" />
        <div class="load-more">
          <buttonLoadMore
            :type-index="1"
            :params="pull.params"
            :api-url="pull.apiUrl"
            return-type="Array"
            @buttonLoadMore="onFetch"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import NotificationList from '@/components/notification/NotificationList.vue'
const PROVIDERS = ['follow']
export default {
  name: 'NotificationPage',
  components: { NotificationList, buttonLoadMore },
  data() {
    const active = this.$route.params.provider && PROVIDERS.indexOf(this.$route.params.provider) >= 0 ? PROVIDERS.indexOf(this.$route.params.provider) : 0
    return {
      PROVIDERS,
      active,
      page: 1,
      navItems: [
        { name: 'follow', text: this.$t('sidebar.fans'), icon: 'follow' },
        { name: 'recommend', text: this.$t('p.read_like'), icon: 'recommend' },
        { name: 'comment', text: this.$t('p.commentPointBtn'), icon: 'comment' },
        { name: 'message', text: this.$t('user.message'), icon: 'message' },
        { name: 'notice', text: this.$t('notice'), icon: 'notice' }
      ],
      notifications: []
    }
  },
  computed: {
    ...mapState('notification', ['notificationCounters']),
    provider() {
      return PROVIDERS[this.active]
    },
    pull() {
      return {
        apiUrl: 'notifications',
        params: { page: this.page, type: 'check_time', provider: this.provider }
      }
    }
  },
  created() {
    this.getNotificationCounters()
  },
  methods: {
    ...mapActions('notification', ['getNotificationCounters']),
    setActive(index) {
      if (!this.navItems[index] || !this.PROVIDERS.includes(this.navItems[index].name)) return
      this.active = index
      this.page = 1
    },
    onFetch({ data }) {
      if (Array.isArray(data) && data.length) {
        this.notifications.push(...data)
        this.$API.readNotifications(this.provider)
      }
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
<style lang="less" scoped>
.load-more /deep/ button.btn {
  margin: 50px auto !important;
  width: 300px !important;
  height: 40px !important;
  font-size: 16px !important;
}
.notification-container /deep/ {
  .el-col-6 {
    padding: 0 10px;
  }
  .el-col-18 {
    padding: 0 10px;
  }
}
// 小于768
@media screen and (max-width: 768px){
  .notification-container /deep/ {
    .el-col-6 {
      width: 100%;
      margin-bottom: 10px;
    }
    .el-col-18 {
      width: 100%;
    }
  }
}
</style>
