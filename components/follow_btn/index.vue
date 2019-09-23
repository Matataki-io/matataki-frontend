<template>
  <el-button
    v-if="!isMe(id)"
    size="small"
    class="btn"
    :class="!userInfo.followed && 'black'"
    @click.stop="followOrUnFollow"
  >
    <i v-if="!userInfo.followed" class="el-icon-plus" />
    {{ userInfo.followed ? '取消关注' : '关注' }}
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
        this.$confirm('确定取消关注?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => this.followOrUnfollowUser({
          id: this.id,
          type: 0 }))
      } else {
        this.followOrUnfollowUser({
          id: this.id,
          type: 1 })
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
  }
</style>
