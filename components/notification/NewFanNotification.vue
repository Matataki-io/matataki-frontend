<template>
  <div>
    <NotificationSource :avatar="avatar" :id="source" :name="message" route="user-id" />
    <div class="message">
      <p><b>{{ message }}</b> {{ $t('notification.followed_you') }}</p>
      <NotificationTime :timestamp="timestamp" />
    </div>
    <div class="action">
      <el-button :disabled="followed || !followAction" @click.stop="follow" class="follow" size="small">
        <svg-icon v-if="followAction" class="icon" icon-class="add" />
        {{ actionText }}
      </el-button>
    </div>
  </div>
</template>
<script>
import NotificationSource from './NotificationSource'
import NotificationTime from './NotificationTime'
export default {
  name: 'NewFanNotification',
  components: { NotificationSource, NotificationTime },
  props: {
    avatar: { type: String },
    source: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    message: { type: String, required: true },
    actions: { type: Array, default: () => [] }
  },
  data() {
    return {
      followed: false
    }
  },
  computed: {
    followAction() {
      return !this.followed && this.actions[0] && this.actions[0].emit
    },
    actionText() {
      return this.followAction ? this.$t('follow') : this.$t('following')
    }
  },
  methods: {
    async follow() {
      try {
        const res = await this.$API.follow(this.source)
        if (res.code === 0) {
          this.followed = true
          this.$message.success(`${this.actionText}${this.$t('success.success')}`)
        } else {
          this.$message.error(`${this.actionText}${this.$t('error.fail')}`)
        }
      } catch (error) {
        this.$message.error(`${this.actionText}${this.$t('error.fail')}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
