<template>
  <router-link
    v-if="tokenUser"
    :to="{name: 'token-id', params: { id: tokenData.id }}"
    class="fl token-card"
    tag="div"
  >
    <div>
      <c-token-popover :token-id="Number(tokenData.id)">
        <c-avatar :src="cover" class="avatar" />
      </c-token-popover>
    </div>
    <div class="card-info">
      <h2>
        {{ tokenData.symbol }}
      </h2>
      <p>
        {{ tokenData.name }}
      </p>
      <p>
        {{ tokenData.brief }}
      </p>
    </div>
    <div>
      <!-- <router-link :to="{name: 'token-id', params: { id: tokenData.id }}">
        <el-button size="small">
          管理后台
        </el-button>
      </router-link> -->

      <router-link
        :to="{name: 'user-id', params: { id: currentUserInfo.id }}"
        class="fl ac"
      >
        <c-avatar
          :src="avatar"
          :recommend-author="user.is_recommend === 1"
          :token-user="!!tokenInfo.id"
          :level-token="1"
        />
        <span class="card-username">{{ currentUserInfo.nickname || currentUserInfo.name }}</span>
      </router-link>
    </div>
  </router-link>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      tokenData: {},
      tokenUser: false,
      avatar: '',
      user: Object.create(null), // 用户信息 
      tokenInfo: Object.create(null), // token info
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    cover() {
      return this.tokenData.logo ? this.$ossProcess(this.tokenData.logo, { h: 90 }) : ''
    }
  },
  watch: {
    isLogined(newState) {
      if (newState) {
        this.tokenUserId()
        this.getUserInfo()
        this.getTokenUser(this.currentUserInfo.id)
      }
    }
  },
  created() {
    if (this.isLogined) {
      this.tokenUserId()
      this.getUserInfo()
      this.getTokenUser(this.currentUserInfo.id)
    }
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    async tokenUserId() {
      await this.$API
        .tokenUserId(this.currentUserInfo.id)
        .then(res => {
          if (res.code === 0 && res.data.id > 0) {
            this.tokenUser = true
            this.tokenData = res.data
          }
        })
        .catch(err => console.log('get token user error', err))
    },
    async getUserInfo() {
      try {
        const result = await this.getCurrentUser()
        const { avatar } = result

        this.user = result

        if (avatar) this.avatar = this.$ossProcess(avatar, { h: 90 })
      } catch (e) {
        console.log('getCurrentUser error: ', e)
      }
    },
    async getTokenUser(id) {
      // 获取是否有 token
      const tokenRes = await this.$utils.factoryRequest(this.$API.tokenUserId(id))
      // not token, data is null
      this.tokenInfo = tokenRes ? (tokenRes.data || {}) : {}
    },
  }
}
</script>

<style scoped lang="less">
.avatar {
  width: 60px;
  height: 60px;
  flex: 0 0 60px;
}
.token-card {
  width: 100%;
  margin: 20px auto 20px;
  padding: 20px;
  background: @white;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  cursor: pointer;
  .card-info {
    -webkit-box-flex: 1;
    flex: 1;
    margin-left: 10px;
    h2 {
      font-size: 20px;
      font-weight: 400;
      color: #000;
      line-height: 28px;
      padding: 0;
      margin: 0;
    }
    P {
      font-size: 14px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 20px;
      padding: 0;
      margin: 4px 0 0 0;
      max-width: 400px;
    }
  }
  .card-username {
    margin-left: 6px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
  }
}
</style>
