<template>
  <div class="notification">
    <g-header />
    <el-row class="notification-container">
      <el-col v-show="!showDetails" :span="16">
        <div class="fl notification-topbar">
          <h3 class="notification-topbar-title">
            消息
          </h3>
          <div class="notification-topbar-button">
            <el-button
              size="mini"
              :disabled="showDetails"
              plain
              @click="notifyMarkReadAll"
            >
              <svg-icon icon-class="read-all" />
              全部标记为已读
            </el-button>
          </div>
        </div>
        <notifyCard
          v-for="(item, index) in notifications"
          :key="index"
          :card="item"
          :user="getUser(item.user_id)"
          :post="getPost(item)"
          :annouce="getAnnouce(item)"
          :comment="getComment(item)"
          @openDetails="openDetails"
        />
        <div v-if="notifications.length === 0 && !loading" class="noData">
          {{ actions.length > 0 ? $t('notContent') : '筛选项不能为空' }}
        </div>
        <div class="load-more">
          <buttonLoadMore
            :type-index="0"
            :params="pull.params"
            :api-url="pull.apiUrl"
            :auto-request-time="autoRequestTime"
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
        <el-divider v-if="detailsIndex.objectType === 'article'" />
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
      <el-col :span="8" class="filter-notify" :class="showDetails && 'details-hide'">
        <div class="filter-notify-card">
          <!-- 消息筛选 -->
          <div class="option">
            <h3 class="option-title">
              消息筛选
            </h3>
            <div class="option-card">
              <!-- <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                :disabled="showDetails"
                class="checkbox-all"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox> -->
              <el-checkbox-group
                v-model="checkedCities"
                class="fl checkbox-group"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="action in actionTypes"
                  :key="action.key"
                  :disabled="showDetails"
                  class="checkbox"
                  :label="action.key"
                >
                  {{ action.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!-- 查看模式 -->
          <div class="option no-bottom">
            <h3 class="option-title">
              查看模式
            </h3>
            <div class="option-card">
              <el-radio v-model="viewMode" :disabled="showDetails" label="all">
                查看全部
              </el-radio>
              <el-radio v-model="viewMode" :disabled="showDetails" label="unread">
                只看未读
              </el-radio>
              <div class="button-hide">
                <el-divider />
                <div class="option-card-button">
                  <el-button
                    size="medium"
                    :disabled="showDetails"
                    plain
                    @click="notifyMarkReadAll"
                  >
                    <svg-icon icon-class="read-all" />
                    全部标记为已读
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import buttonLoadMore from '@/components/button_load_more/index.vue'
import notifyCard from '@/components/notification/card.vue'
import objectCard from '@/components/notification/objectCard.vue'
import commentCard from '@/components/notification/commentCard.vue'

export default {
  name: 'NotificationPage',
  components: { buttonLoadMore, notifyCard, objectCard, commentCard },
  data() {
    return {
      showDetails: false,
      notifications: [],
      users: [],
      posts: [],
      announcements: [],
      comments: [],
      detailsIndex: null,
      notificationDetails: [],
      pagePosition: 0,
      actionDetailLabels: {
        like: '推荐详情',
        comment: '评论详情',
        follow: '关注详情'
      },
      checkAll: true,
      checkedCities: [],
      // cities: ['评论信息', '推荐信息', '关注信息', '打赏信息', '发文信息', '系统通知'],
      actionTypes: [
        {
          key: 'follow',
          label: '关注信息'
        },
        {
          key: 'comment',
          label: '评论信息'
        },
        {
          key: 'like',
          label: '推荐信息'
        },
        {
          key: 'annouce',
          label: '公告信息'
        }
      ],
      actions: null,
      isIndeterminate: true,
      viewMode: this.$route.query.viewMode || 'all',
      filterUnread: this.$route.query.viewMode === 'unread' ? 1 : 0,
      autoRequestTime: 0,
      startId: 0,
      loading: true
    }
  },
  computed: {
    pull() {
      let pull = {
        apiUrl: 'notifyCenter',
        params: { pagesize: 20, startId: this.startId, filterUnread: this.filterUnread }
      }
      if(this.actions) pull.params.actions = JSON.stringify(this.actions)
      return pull
    },
    detailPull() {
      return {
        apiUrl: 'notifyDetails',
        params: { pagesize: 20, ...this.detailsIndex }
      }
    }
  },
  watch: {
    viewMode(newVal) {
      this.filterUnread = newVal === 'unread' ? 1 : 0
      this.updateList()
      this.updateQuery('viewMode', newVal)
    }
  },
  created() {
    this.initActions()
  },
  methods: {
    buttonLoadMore(res) {
      this.loading = false
      if(res.data && res.data.list.length > 0 ) {
        this.users.push(...res.data.users)
        this.posts.push(...res.data.posts)
        this.announcements.push(...res.data.announcements)
        this.comments.push(...res.data.comments)
        this.notifications.push(...res.data.list)
        // 标记已读
        this.markRead(res.data.list)
        // 设定起始查询位置
        if(!this.startId) this.startId = res.data.list[0].id
      }
    },
    detailLoadMore(res) {
      if(res.data && res.data.list.length > 0 ) {
        this.notificationDetails.push(...res.data.list)
      }
    },
    getUser(userId) {
      if(this.users && this.users.length > 0)
        return this.users.find(user => user.id === userId)
      return null
    },
    getPost(notify) {
      if(this.posts && this.posts.length > 0) {
        let postId
        if(notify.object_type === 'article')
          postId = notify.object_id
        else if(notify.object_type === 'announcement' && notify.remark)
          postId = notify.remark
        else return null

        return this.posts.find(post => post.id === postId)
      }
      return null
    },
    getAnnouce(notify) {
      if(this.announcements && this.announcements.length > 0 && notify.action === 'annouce') {
        return this.announcements.find(announcement => announcement.id === notify.object_id)
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
      window.scroll(0, 0)
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
      let notifyIds = []
      notifications.forEach(item => {
        if(item.state === 0) notifyIds.push(item.id)
      })
      if(notifyIds.length > 0) this.$API.notifyMarkRead(notifyIds)
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.actionTypes.map(action => action.key) : []
      this.isIndeterminate = false
      this.actions = this.checkedCities
      this.updateList()
      this.updateQuery('actions', JSON.stringify(this.checkedCities))
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.actionTypes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.actionTypes.length
      this.actions = value
      this.updateList()
      this.updateQuery('actions', JSON.stringify(value))
    },
    async notifyMarkReadAll() {
      const res = await this.$API.notifyMarkReadAll()
      if(res.code === 0) {
        this.$message.success(this.$t('success.success'))
        this.$router.go(0)
      }
      else this.$message.error(this.$t('error.fail'))
    },
    updateList() {
      this.loading = true
      this.notifications = []
      this.autoRequestTime = Date.now()
    },
    updateQuery(key, val) {      
      const query = { ...this.$route.query }
      query[key] = val
      this.$router.replace({ query })
    },
    initActions() {
      let actions = this.$route.query.actions
      if(actions) { 
        this.actions = JSON.parse(this.$route.query.actions)
        this.checkedCities = this.actions
      }
      else {
        this.checkedCities = this.actionTypes.map(action => action.key)
        this.actions = this.checkedCities
      }
      this.isIndeterminate = this.checkedCities.length > 0 && this.checkedCities.length < this.actionTypes.length
      this.checkAll = this.checkedCities.length === this.actionTypes.length
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
<style lang="less" scoped>
.filter-notify {
  position: sticky;
  top: 80px;
}
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
@media screen and (max-width: 768px) {
  .filter-notify {
    position: static;
    &-card {
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    }
  }
  .notification-container /deep/ {
    display: flex;
    flex-direction: column-reverse;
    .el-col-8 {
      width: 100%;
      margin-bottom: 20px;

      display:block;
      &.details-hide {
        overflow: hidden;
        width: 0;
        height: 0;
      }
    }
    .el-col-16 {
      width: 100%;
    }
  }
}
</style>
