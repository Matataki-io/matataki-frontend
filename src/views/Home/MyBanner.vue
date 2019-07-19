<template>
  <div class="my-banner">
    <template v-if="isLogined">
      <div class="banner-text">
        <div class="round_icon">
          <img v-if="avatar" v-lazy="avatar" :src="avatar" />
        </div>
        <div>
          <p class="name">{{ displayName }}</p>
          <p class="my-balance">
            {{ displayBalance }}
            <span class="coin-symbol">{{ displayBalanceSymbol }}</span>
          </p>
        </div>
      </div>
      <router-link class="my-user-page" :to="{ name: 'User', params: { id: currentUserInfo.id } }">
        我的主页
      </router-link>
    </template>
    <template v-else>
      <div>
        <p class="login-notification">即刻登录</p>
        <p class="login-notification">开始智能签名之旅</p>
      </div>
      <a class="my-user-page" href="javascript:;" @click="showModal = true">立即登录</a>
    </template>
    <BaseModalForSignIn :show-modal="showModal" @changeInfo="changeInfo" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'MyBanner',
  computed: {
    ...mapGetters(['currentUserInfo', 'displayName', 'isLogined']),
    displayBalance() {
      const { balance } = this.currentUserInfo
      return balance ? balance.slice(0, -4) : ''
    },
    displayBalanceSymbol() {
      const { balance } = this.currentUserInfo
      return balance ? balance.slice(-4) : ''
    }
  },
  data() {
    return {
      showModal: false,
      avatar: ''
    }
  },
  created() {
    const { isLogined, refreshUser } = this
    if (isLogined) {
      refreshUser()
    }
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    async refreshUser() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$backendAPI.getAvatarImage(avatar)
    },
    // 改变modal
    changeInfo(status) {
      this.showModal = status
    }
  },
  watch: {
    isLogined(newState) {
      if (newState) this.refreshUser()
    }
  }
}
</script>

<style lang="less" scoped>
.my-banner {
  margin: 0 auto;
  max-width: 335px;
  padding: 22px 16px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}
.banner-text {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex: 1;
  margin-right: 10px;
  .round_icon {
    flex: 0 0 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    background: #dedede;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .name {
    font-size: 14px;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    letter-spacing: 1px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-left: 8px;
  }

  .my-balance {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    letter-spacing: 1px;
    margin-left: 8px;
  }
}

.my-user-page {
  background-color: #000;
  color: #fff;
  padding: 8px 20px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
  min-width: 100px;
}

.login-notification {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  text-align: left;
}
</style>
