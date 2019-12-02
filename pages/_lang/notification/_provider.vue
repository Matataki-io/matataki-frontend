<template>
  <div class="notification">
    <g-header />
    <el-row class="mw notification-container">
      <el-col :span="5">
        <nav>
          <ul>
            <li v-for="(nav, index) in navItems" :key="nav.name" :class="{ active: active === index }" @click="setActive(index)">
              <svg-icon :icon-class="nav.icon + (PROVIDERS.includes(nav.name) ? '' : '-gray')" class="icon" />
              <span class="name">{{ nav.text }}</span>
              <span v-if="PROVIDERS.includes(nav.name)" class="count">+{{ notificationCounters[nav.name] || 0 }}</span>
            </li>
          </ul>
        </nav>
      </el-col>
      <el-col :span="19">
        <NotificationList :notifications="notifications" />
        <div class="load-more">
          <buttonLoadMore
            :typeIndex="1"
            :params="pull.params"
            :api-url="pull.apiUrl"
            @buttonLoadMore="onFetch"
            return-type="Array"
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
      if (!this.navItems[index] || !this.PROVIDERS.inculudes(this.navItems[index].name)) return
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
