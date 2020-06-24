<template>
  <el-popover
    v-model="model"
    placement="right-start"
    width="300"
    trigger="hover"
    :disabled="disabled"
    @show="show"
    @hide="hide"
  >
    <div v-loading="loading" class="popover">
      <router-link class="avatar-popover" :to="{name: 'user-id', params: { id: userId }}" target="_blank">
        <img
          v-if="userAvatar"
          :src="userAvatar"
          alt="avatar"
        >
        <img
          v-else
          :src="defaultAvatar"
          alt="avatar"
        >
      </router-link>
      <div class="username">
        <router-link :to="{name: 'user-id', params: { id: userId }}" target="_blank">
          {{ userInfo.nickname || userInfo.username }}
        </router-link>
      </div>
      <p class="introduction">{{ userInfo.introduction }}</p>
      <div class="user-data">
        <router-link :to="{name: 'user-id-follow', params: { id: userId }}" target="_blank" class="user-data-block">
          <p class="user-data-number">{{ userInfo.follows || 0 }}</p>
          <p class="user-data-title">关注</p>
        </router-link>
        <router-link :to="{name: 'user-id-fan', params: { id: userId }}" target="_blank" class="user-data-block">
          <p class="user-data-number">{{ userInfo.fans || 0 }}</p>
          <p class="user-data-title">粉丝</p>
        </router-link>
      </div>
      <div class="user-btn">
        <a href="javascript:;" @click="transfer">
          <svg-icon icon-class="user_avatar_popover_zhuanzhang" class="icon" />
          转账</a>
        <a
          v-if="userInfo.is_follow"
          v-loading="followLoading"
          href="javascript:;"
          @click="unFollow"
        >
          已关注</a>
        <a
          v-else
          v-loading="followLoading"
          href="javascript:;"
          @click="follow"
        >
          <svg-icon icon-class="user_avatar_popover_follow" class="icon" />
          关注</a>
      </div>
      <div v-if="tokenInfo.id" class="line" />
      <div v-if="tokenInfo.id" class="user-token">
        <div class="token">
          <router-link :to="{name: 'token-id', params: { id: tokenInfo.id }}" target="_blank" class="token-cover">
            <img v-if="tokenLogo" :src="tokenLogo" alt="logo">
          </router-link>
          <div class="token-info">
            <router-link :to="{name: 'token-id', params: { id: tokenInfo.id }}" target="_blank" class="token-name">
              {{ tokenInfo.name }}
            </router-link>
            <p class="token-introduction">{{ tokenInfo.brief }}</p>
          </div>
        </div>
        <router-link class="token-go" :to="{name: 'token-id', params: { id: tokenInfo.id }}" target="_blank">
          <svg-icon icon-class="user_avatar_popover_go" class="icon" />
        </router-link>
      </div>
    </div>
    <slot slot="reference" />
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultAvatar from '@/assets/img/default_avatar.png'

export default {
  props: {
    // user id
    userId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      currentId: -1,
      loading: false,
      followLoading: false,
      model: false,
      disabled: false,
      defaultAvatar,
      userInfo: Object.create(null),
      tokenInfo: Object.create(null),
      giftDialog: false, // 转账 dialog
      userData: {} // 转账用户信息
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    userAvatar() {
      if (!this.userInfo) return ''
      return this.userInfo.avatar ? this.$ossProcess(this.userInfo.avatar, { h: 90 }) : ''
    },
    tokenLogo() {
      if (!this.tokenInfo) return ''
      return this.tokenInfo.logo ? this.$ossProcess(this.tokenInfo.logo, { h: 60 }) : ''
    }
  },
  mounted() {
    if (process.browser) {
      this.$nextTick(() => {
        this.isHide()
      })
    }
  },
  methods: {
    // 小屏幕隐藏
    isHide() {
      try {
        let clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        if (clientWidth < 540) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async show() {

      // 如果传进来的和历史记录的id不一样则手动清空
      if (this.userId !== this.currentId) {
        this.userInfo = {}
        this.tokenInfo = {}
      }
      
      // 如果已经有数据了 不加载loading, 但是会请求接口来保证数据是最新的
      if (this.$utils.isNull(this.userInfo)) {
        this.loading = true
      }

      // 获取用户信息
      const res = await this.$utils.factoryRequest(this.$API.getUser(this.userId))
      if (res) {
        this.userInfo = res.data
        this.currentId = this.userId
      } else {
        this.userInfo = Object.create(null)
      }

      this.loading = false

      // 获取是否有 token
      const tokenRes = await this.$utils.factoryRequest(this.$API.tokenUserId(this.userId))
      // not token, data is null
      this.tokenInfo = tokenRes ? (tokenRes.data || {}) : {}
    },
    hide() {
      console.log('hide')
    },
    // 转账
    transfer() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      if (this.currentUserInfo.id === this.userId) {
        this.$message({
          showClose: true,
          message: '不能给自己转账',
          type: 'warning'
        })
        return
      }
      let data = Object.assign({}, this.userInfo)
      data.id = this.userId
      console.log('data', data)
      this.$store.commit('transferDialog/setTransferUserData', data)
      this.$store.commit('transferDialog/setTransferDialog', true)
    },
    // 关注
    async follow() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      if (this.currentUserInfo.id === this.userId) {
        this.$message({
          showClose: true,
          message: '不能关注自己',
          type: 'warning'
        })
        return
      }

      this.followLoading = true 

      const res = await this.$utils.factoryRequest(this.$API.follow(this.userId))
      if (res) {
        this.userInfo.is_follow = true
      } else {
        this.$message({
          showClose: true,
          message: this.$t('error.fail'),
          type: 'error'
        })
      }

      this.followLoading = false 

    },
    // 取消关注
    async unFollow() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      this.followLoading = true 

      const res = await this.$utils.factoryRequest(this.$API.unfollow(this.userId))
      if (res) {
        this.userInfo.is_follow = false
      } else {
        this.$message({
          showClose: true,
          message: this.$t('error.fail'),
          type: 'error'
        })
      }

      this.followLoading = false 
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-popover {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  border: 1px solid #ddd;
  box-sizing: border-box;
  margin: 0 auto;
  display: block;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f1f1f1;
  }
}

.popover {
  padding: 8px;
  .username {
    text-align: center;
    margin: 10px 0 5px 0;
    overflow: hidden;
    a {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      padding: 0;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .introduction {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 17px;
    padding: 0;
    margin: 0;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-data {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
  .user-data-block {
    text-align: center;
    margin: 0 20px;
  }
  .user-data-number {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    padding: 0;
    margin: 0;
  }
  .user-data-title {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
    padding: 0;
    margin: 0;
  }
}
.line {
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;
}

.user-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 20px;
  a {
    display: block;
    height: 30px;
    line-height: 30px;
    width: 90px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 1);
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    text-align: center;
    padding: 0;
    margin: 0 10px;
    transition: all 0.1s;
    .icon {
      font-size: 14px;
    }
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
}

.token {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}
.user-token {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.token-cover {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  border: 1px solid #ddd;
  box-sizing: border-box;
  margin: 0 auto;
  display: block;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f1f1f1;
  }
}
.token-info {
  margin-left: 5px;
  overflow: hidden;
  flex: 1;
}
.token-name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 17px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.token-introduction {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 17px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.token-go {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  background-color: #b2b2b2;
  border-radius: 50%;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.1s;
  &:hover {
    transform: translateX(2px);
  }
  .icon {
    font-size: 12px;
  }
}
</style>
