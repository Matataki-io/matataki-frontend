<template>
  <router-link
    v-if="tokenUser"
    :to="{name: 'token-id', params: { id: tokenData.id }}"
    class="fl token-card"
    tag="div"
  >
    <div>
      <c-token-popover :token-id="Number(tokenData.id)">
        <avatar :src="cover" size="60px" />
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
        <avatar
          :src="avatar"
          size="30px"
        />
        <span class="card-username">{{ currentUserInfo.nickname || currentUserInfo.name }}</span>
      </router-link>
    </div>
  </router-link>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  },
  data() {
    return {
      tokenData: {},
      tokenUser: false,
      avatar: ''
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
        this.getAvatar()
      }
    }
  },
  created() {
    if (this.isLogined) {
      this.tokenUserId()
      this.getAvatar()
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
    async getAvatar() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$ossProcess(avatar, { h: 90 })
    }
  }
}
</script>

<style scoped lang="less">
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
