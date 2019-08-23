<template>
  <div class="ra-list">
    <n-link :to="{name: 'user-id', params: {id: card.id}}">
      <avatar :src="avatarSrc" size="44px" />
    </n-link>
    <n-link class="name" :to="{name: 'user-id', params: {id: card.id}}">
      {{ card && card.nickname || card.username }}
    </n-link>
    <template v-if="!isMe(card.id)">
      <el-button size="small" :class="!card.is_follow && 'black'" class="follow" @click.stop="followOrUnFollow">
        <i v-if="!card.is_follow" class="el-icon-plus" />
        {{ followBtnText }}
      </el-button>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import avatar from '@/components/avatar'

export default {
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    avatarSrc() {
      if (this.card.avatar) return this.$API.getImg(this.card.avatar)
      return ''
    },
    followBtnText() {
      return this.card.is_follow ? '已关注' : '关注'
    }
  },
  methods: {
    followOrUnFollow() {
      if (this.card.is_follow) {
        this.$confirm('确定取消关注?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.followOrUnfollowUser(this.card.id, 0)
        })
      } else {
        this.followOrUnfollowUser(this.card.id, 1)
      }
    },
    async followOrUnfollowUser(id, type) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      const message = type === 1 ? '关注' : '取消关注'
      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if (res.code === 0) {
          this.$message.success(`${message}成功`)
          // this.$emit('updateList')
          // 如果再获取一次的话 数据会被随机
          this.card.is_follow = type === 1
        } else {
          this.$message.error(`${message}失败`)
        }
      } catch (error) {
        this.$message.error(`${message}失败`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ra-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  .name {
    font-size:16px;
    letter-spacing: 1px;
    color:#333;
    flex: 1;
    text-overflow:ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 10px;
    margin-left: 10px;
  }
}

.follow {
  &.black {
    background: #333;
    color: #fff;
    border: 1px solid #333;
  }
}
</style>
