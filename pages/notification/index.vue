<template>
  <div class="notification">
    <g-header />
    <el-row class="notification-container">
      <el-col :span="16">
        <notifyCard
          v-for="(item, index) in notifications"
          :key="index"
          :card="item"
          :user="getUser(item.user_id)"
          :post="getPost(item)"
          :comment="getComment(item)"
        />
        <div class="load-more">
          <buttonLoadMore
            :type-index="0"
            :params="pull.params"
            :api-url="pull.apiUrl"
            return-type="Object"
            @buttonLoadMore="buttonLoadMore"
          />
        </div>
      </el-col>
      <el-col :span="8">
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
    </el-row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import notifyCard from '@/components/notification/card.vue'
const PROVIDERS = ['follow']
export default {
  name: 'NotificationPage',
  components: { buttonLoadMore, notifyCard },
  data() {
    const active = this.$route.params.provider && PROVIDERS.indexOf(this.$route.params.provider) >= 0 ? PROVIDERS.indexOf(this.$route.params.provider) : 0
    return {
      PROVIDERS,
      active,
      navItems: [
        { name: 'follow', text: this.$t('sidebar.fans'), icon: 'follow' },
        { name: 'recommend', text: this.$t('p.read_like'), icon: 'recommend' },
        { name: 'comment', text: this.$t('p.commentPointBtn'), icon: 'comment' },
        { name: 'message', text: this.$t('user.message'), icon: 'message' },
        { name: 'notice', text: this.$t('notice'), icon: 'notice' }
      ],
      notifications: [],
      users: [],
      posts: [],
      comments: []
    }
  },
  computed: {
    ...mapState('notification', ['notificationCounters']),
    provider() {
      return PROVIDERS[this.active]
    },
    pull() {
      return {
        apiUrl: 'notifyCenter',
        params: { pagesize: 20, startId: 0 }
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
    buttonLoadMore(res) {
      if(res.data) {
        this.notifications.push(...res.data.list)
        this.users.push(...res.data.users)
        this.posts.push(...res.data.posts)
        this.comments.push(...res.data.comments)
      }
    },
    deduplication(array1) {
      return [...new Set(array1)]
    },
    getUser(userId) {
      if(this.users && this.users.length > 0)
        return this.users.find(user => user.id === userId)
      return null
    },
    getPost(notify) {
      if(this.posts && this.posts.length > 0 && notify.object_type === 'article') {
        const postId = notify.object_id
        return this.posts.find(post => post.id === postId)
      }
      return null
    },
    getComment(notify) {
      if(this.comments && this.comments.length > 0 && notify.action === 'comment') {
        const commentId = notify.remark
        return this.comments.find(comment => comment.id === commentId)
      }
      return null
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
  .el-col-8 {
    padding: 0 10px;
  }
  .el-col-16 {
    padding: 0 10px;
  }
}
// 小于768
@media screen and (max-width: 768px){
  .notification-container /deep/ {
    .el-col-8 {
      width: 100%;
      margin-bottom: 10px;
    }
    .el-col-16 {
      width: 100%;
    }
  }
}
</style>
