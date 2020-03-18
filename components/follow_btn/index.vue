<template>
  <el-button
    v-if="!isMe(id)"
    :class="!userInfo.followed ? 'black' : 'unsubscribe'"
    size="small"
    class="btn"
    @click.stop="followOrUnFollow"
  >
    <i
      v-if="!userInfo.followed"
      class="el-icon-plus"
    />
    {{ userInfo.followed ? $t('following') : $t('follow') }}
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
      padding-left: 17px;
      padding-right: 17px;
    }
  }
</style>
