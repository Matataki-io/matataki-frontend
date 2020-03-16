<template>
  <div class="ra-list">
    <n-link
      :to="{name: 'user-id', params: {id: card.id}}"
      target="_blank"
    >
      <avatar
        :src="avatarSrc"
        size="44px"
      />
    </n-link>
    <n-link
      :to="{name: 'user-id', params: {id: card.id}}"
      target="_blank"
      class="name"
    >
      {{ card && card.nickname || card.username }}
    </n-link>
    <template v-if="!isMe(card.id)">
      <el-button
        :class="!card.is_follow && 'black'"
        size="small"
        class="follow"
        @click.stop="followOrUnFollow"
      >
        <i
          v-if="!card.is_follow"
          class="el-icon-plus"
        />
        {{ followBtnText }}
      </el-button>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      if (this.card.avatar) return this.$ossProcess(this.card.avatar, { h: 60 })
      return ''
    },
    followBtnText() {
      return this.card.is_follow ? this.$t('following') : this.$t('follow')
    }
  },
  methods: {
    followOrUnFollow() {
      if (this.card.is_follow) {
        this.$confirm(this.$t('p.confirmUnFollowMessage'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
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
      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')

      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if (res.code === 0) {
          this.$message.success(`${message}${this.$t('success.success')}`)
          this.card.is_follow = type === 1
        } else {
          this.$message.error(`${message}${this.$t('error.fail')}`)
        }
      } catch (error) {
        this.$message.error(`${message}${this.$t('error.fail')}`)
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
