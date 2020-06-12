<template>
  <div class="fans-card">
    <n-link
      :to="{name: 'user-id', params: {id: type==='follow' ? card.fuid : card.uid}}"
      target="_blank"
    >
      <avatar
        :src="avatar"
        class="avatar"
      />
    </n-link>
    <div class="fans-info">
      <n-link
        :title="name"
        :to="{name: 'user-id', params: {id: type==='follow' ? card.fuid : card.uid}}"
        target="_blank"
        class="name"
      >
        {{ name }}
      </n-link>
      <p class="fans">
        {{ card.fans }} {{ $t('fans') }}
      </p>
    </div>
    <template v-if="!isMe(card.id)">
      <el-button
        :class="!cardCopy.is_follow && 'black'"
        size="small"
        class="follow"
        @click.stop="followOrUnFollow"
      >
        <i
          v-if="!cardCopy.is_follow"
          class="el-icon-plus"
        />
        {{ followBtnText }}
      </el-button>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'
export default {
  name: 'FansCard',
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cardCopy: this.card
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    name() {
      if (this.type === 'follow') return this.card.nickname || this.card.followed
      else return this.card.nickname || this.card.username
    },
    avatar() {
      if (this.card.avatar) return this.$ossProcess(this.card.avatar)
      return ''
    },
    followBtnText() {
      return this.cardCopy.is_follow ? this.$t('following') : this.$t('follow')
    }
  },
  methods: {
    followOrUnFollow() {
      if (this.cardCopy.is_follow) {
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

          this.cardCopy.is_follow = type === 1
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
p {
  margin: 0;
  padding: 0;
}

.fans-card {
  width: 100%;
  flex: 0 0 10%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #ececec;
  padding: 20px;
  .avatar {
    width: 60px !important;
    height: 60px !important;
    background: #eee;
    z-index: 1;
    position: relative;
  }
  .fans-info {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 20px;
    margin-left: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      font-size: 16px;
      color: #000;
      line-height: 22px;
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .fans {
      font-size: 14px;
      color: @gray;
      line-height: 17px;
      white-space: nowrap;
    }
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
