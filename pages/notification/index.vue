<template>
  <div class="notification">
    <g-header />
    <el-row class="notification-container">
      <el-col v-show="!showDetails" :span="16">
        <div class="notification-topbar">
          <h3>
            通知
          </h3>
        </div>
        <notifyCard
          v-for="(item, index) in notifications"
          :key="index"
          :card="item"
          :user="getUser(item.user_id)"
          :post="getPost(item)"
          :comment="getComment(item)"
          @openDetails="openDetails"
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
      <el-col v-if="showDetails" :span="16" class="detail">
        <div class="fl detail-topbar">
          <div class="detail-topbar-back" @click="closeDetails">
            <i class="el-icon-arrow-left" />
          </div>
          <h3>
            {{ actionDetailLabels[detailsIndex.action] }}
          </h3>
        </div>
        <div style="margin-bottom: 20px;">
          <objectCard
            v-if="detailsIndex.objectType === 'article'"
            mode="post"
            :post="posts.find(post => post.id === detailsIndex.objectId)"
            bg-color="white"
          />
        </div>
        <el-divider />
        <div v-for="(item, index) in notificationDetails" :key="index" style="margin: 20px 0;">
          <objectCard
            v-if="detailsIndex.action === 'like' || detailsIndex.action === 'follow'"
            mode="user"
            :user="item.user"
            :create-time="item.create_time"
            :action="item.action"
            bg-color="white"
          />
          <commentCard
            v-if="detailsIndex.action === 'comment'"
            :card="item"
          />
        </div>

        <div class="load-more">
          <buttonLoadMore
            :type-index="0"
            :params="detailPull.params"
            :api-url="detailPull.apiUrl"
            return-type="Object"
            @buttonLoadMore="detailLoadMore"
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
import objectCard from '@/components/notification/objectCard.vue'
import commentCard from '@/components/notification/commentCard.vue'

const PROVIDERS = ['follow']
export default {
  name: 'NotificationPage',
  components: { buttonLoadMore, notifyCard, objectCard, commentCard },
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
      showDetails: false,
      notifications: [],
      users: [],
      posts: [],
      comments: [],
      detailsIndex: null,
      notificationDetails: [],
      pagePosition: 0,
      actionDetailLabels: {
        like: '推荐详情',
        comment: '评论详情',
        follow: '关注详情'
      },
      noRead: Number(this.$route.params.noRead) || 0
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
    },
    detailPull() {
      return {
        apiUrl: 'notifyDetails',
        params: {
          pagesize: 20,
          ...this.detailsIndex
        }
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
        // 标记已读
        this.markRead(res.data.list)
      }
    },
    detailLoadMore(res) {
      if(res.data) {
        this.notificationDetails.push(...res.data.list)
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
    },
    openDetails(data) {
      this.pagePosition = document.documentElement.scrollTop
      this.detailsIndex = data
      this.showDetails = true
    },
    closeDetails() {
      this.showDetails = false
      this.notificationDetails = []
      setTimeout(() => window.scroll(0, this.pagePosition), 100)
    },
    /** 标记已读 */
    markRead(notifications) {
      if(this.noRead) return
      let notifyIds = []
      notifications.forEach(item => {
        if(item.state === 0) notifyIds.push(item.id)
      })
      if(notifyIds.length > 0) this.$API.notifyMarkRead(notifyIds)
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
