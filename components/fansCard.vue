<template>
  <div class="fans-card">
    <n-link target="_blank" :to="{name: 'user-id', params: {id: type==='follow' ? card.fuid : card.uid}}">
      <avatar class="avatar" :src="avatar" />
    </n-link>
    <div class="fans-info">
      <n-link target="_blank" class="name" :title="name" :to="{name: 'user-id', params: {id: type==='follow' ? card.fuid : card.uid}}">
        {{ name }}
      </n-link>
      <p class="fans">
        {{ card.fans }}粉丝
      </p>
    </div>
    <template v-if="!isMe(type==='follow' ? card.fuid : card.uid)">
      <button
        v-if=" !card.is_follow"
        class="fllow-btn btn-base"
        @click.stop="followOrUnfollowUser({ id: card.id, type: 1 })"
      >
        <i class="el-icon-plus" /> <span class="btn-text">关注</span>
      </button>
      <button
        v-else
        class="fllowed-btn btn-base"
        @click.stop="followOrUnfollowUser({ id: card.id, type: 0 })"
      >
        <span />
      </button>
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'
export default {
  name: 'FansCard',
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      default: () => ({
      })
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    name() {
      if (this.type === 'follow') return this.card.nickname || this.card.followed
      else return this.card.nickname || this.card.username
    },
    avatar() {
      if (this.card.avatar) return this.$API.getImg(this.card.avatar)
      return ''
    }
  },
  methods: {
    async followOrUnfollowUser({ id, type, index, indexList }) {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }
      const message = type === 1 ? '关注' : '取消关注'
      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if (res.code === 0) {
          this.$message.success(`${message}成功`)
          this.$emit('updateList')
          this.card.is_follow = type === 1
        } else {
          throw new Error(`${message}失败`)
        }
      } catch (error) {
        this.$message.error(`${message}失败`)
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
.btn-base {
  border-radius: 6px;
  border: 1px solid #000;
  background: transparent;
  color: #ffffff;
  width: 106px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fans-card {
  width: 50%;
  flex: 0 0 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  // align-items: center;
  justify-content: flex-start;
  .avatar {
    width: 60px !important;
    height: 60px !important;
    background: #eee;
    z-index: 1;
    position: relative;
  }
  .fans-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 200px;
    margin: 0 10px;
    .name {
      font-size: 16px;
      color: #000;
      line-height: 22px;
      font-weight: 700;
      margin-bottom: 5px;
      width: 200px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .fans {
      font-size: 12px;
      color: @gray;
      line-height: 17px;
      white-space: nowrap;
    }
  }
  .fllowed-btn {
    background: #fff;
    color: #000;
    span::after {
      content: '已关注'
    }
    &:hover {
      border-color: @gray;
      background: @gray;
      color: #fff;
      span::after {
        content: '取消关注'
      }
    }
  }
  .fllow-btn {
    background: #000;
    color: #fff;
    .btn-text {
      margin-left: 10px;
      font-size: 16px;
      line-height: 22px;
    }
  }
}
</style>
