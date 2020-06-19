<template>
  <div class="ra-list">
    <n-link
      :to="{name: 'user-id', params: {id: card.id}}"
      target="_blank"
    >
      <c-user-popover :user-id="Number(card.id)">
        <avatar :src="avatarSrc" size="45px" />
      </c-user-popover>
    </n-link>
    <n-link
      :to="{name: 'user-id', params: {id: card.id}}"
      target="_blank"
      class="info"
    >
      <p class="username"> {{ card && card.nickname || card.username }}</p>
      <p class="introduction"> {{ card.introduction }}</p>
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
          this.$message({ showClose: true, message: `${message}${this.$t('success.success')}`, type: 'success'})
          this.card.is_follow = type === 1
        } else {
          this.$message({ showClose: true, message: `${message}${this.$t('error.fail')}`, type: 'error' })
        }
      } catch (error) {
        this.$message({ showClose: true, message: `${message}${this.$t('error.fail')}`, type: 'error' })
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
  padding: 20px 0 0;
  &:nth-child(1) {
    padding-top: 0;
  }
  .username {
    font-size: 16px;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    padding: 0;
    margin: 0;
  }
  .introduction {
    color: #333;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    padding: 0;
    margin: 3px 0 0 0;
  }
  .info {
    margin-right: 10px;
    margin-left: 10px;
    flex: 1;
    overflow: hidden;
    display: block;
  }

  /deep/ .g-avatar {
    box-sizing: border-box;
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
