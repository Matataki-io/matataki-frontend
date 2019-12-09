<template>
  <el-button
    v-if="!isMe(id)"
    :class="!userInfo.followed ? 'black' : 'unsubscribe'"
    @click.stop="followOrUnFollow"
    size="small"
    class="btn"
  >
    <i v-if="!userInfo.followed" class="el-icon-plus" />
    {{ userInfo.followed ? $t('unFollow') : $t('follow') }}
  </el-button>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['isMe', 'currentUserInfo', 'isLogined'])
  },
  watch: {
    currentUserInfo() {
      this.refreshUser({ id: this.id })
    }
  },
  mounted() {
    if (this.currentUserInfo.id) this.refreshUser({ id: this.id })
  },
  methods: {
    ...mapActions('user', [
      'refreshUser',
      'followOrUnfollowUser'
    ]),
    followOrUnFollow() {
      if (this.userInfo.followed) {
        this.$confirm(this.$t('p.confirmUnFollowMessage'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => this.followOrUnfollowUser({
          id: this.id,
          type: 0
        }))
      } else {
        this.followOrUnfollowUser({
          id: this.id,
          type: 1
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  .btn {
    &.black {
      background: #333;
      color: #fff;
      border: 1px solid #333;
    }

    &.unsubscribe {
      max-width: 72px;
      padding-left: 11px;
      padding-right: 11px;
    }
  }
</style>
