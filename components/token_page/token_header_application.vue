<template>
  <section class="token-card">
    <h3 class="token-title">
      我申请的Fan票
    </h3>
    <section class="fl token-container">
      <section>
        <c-token-popover :token-id="Number(info.uid)">
          <avatar :src="cover" size="60px" />
        </c-token-popover>
      </section>
      <section class="card-info">
        <h2>{{ info.symbol }}</h2>
        <p>{{ info.name }}</p>
        <p>{{ info.brief }}</p>
      </section>
      <section class="other-info">
        <template v-if="info.status === 0">
          <p class="token-text">您的Fan票申请申请成功!</p>
        </template>
        <template v-else-if="info.status === 2">
          <p class="token-text">您的Fan票申请已经成功提交！</p>
          <p class="token-text">审核结果将会在5个工作日内通过邮件发送</p>
        </template>
        <template v-else-if="info.status === 3">
          <p class="token-text">您的Fan票申请申请失败!</p>
          <p v-if="info.reason" class="token-reason">{{ info.reason }}</p>
        </template>
        <div class="token-footer">  
          <a class="h-rule" href="http://andoromeda.mikecrm.com/a93Le8z" target="_blank">
            任何反馈<svg-icon icon-class="arrow" class="icon" />
          </a>
          <template v-if="info.status === 2">
            <a href="javascript:;" class="f-btn close" @click="minetokenApplication('reset', 'close')">取消申请</a>
            <a href="javascript:;" class="f-btn modify" @click="minetokenApplication('reset', 'modify')">修改申请信息</a>
          </template>
          <template v-else-if="info.status === 3">
            <a href="javascript:;" class="f-btn modify" @click="minetokenApplication('reset', 'reset')">我知道了</a>
          </template>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  },
  props: {
    info: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      tokenUser: false,
      avatar: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    cover() {
      return this.info.logo ? this.$ossProcess(this.info.logo, { h: 90 }) : ''
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
          }
        })
        .catch(err => console.log('get token user error', err))
    },
    async getAvatar() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$ossProcess(avatar, { h: 90 })
    },
    async minetokenApplication(type, status) {
      if (status === 'modify') {
        this.$router.push({ name: 'postminetoken', query: { status: 'modify' } })
        return
      }

      let resultMinetokenApplication = await this.$utils.factoryRequest(this.$API.apiMinetokenApplication({
        type
      }))
      if (resultMinetokenApplication) {
        if (status === 'close' || status === 'reset') {
          window.location.reload()
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.token-title {
  font-size: 20px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 28px;
  padding: 0;
  margin: 0 0 20px;
}
.token-text {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 30px;
  padding: 0;
  margin: 0;
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
      color: #b2b2b2;
      line-height: 20px;
      padding: 0;
      margin: 0;
      max-width: 400px;
      word-break: break-all;
      white-space: pre-wrap;
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
.h-rule {
  font-size: 14px;
  font-weight: 500;
  color: #542de0;
  line-height: 20px;
  margin-right: 20px;
  .icon {
    transition: all 0.2s;
    margin-left: 2px;
  }
  &:hover {
    text-decoration: underline;
    .icon {
      transform: translateX(4px);
    }
  }
}
.token-footer {
  margin-top: 14px;
  .f-btn {
    width: 120px;
    height: 30px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
    display: inline-block;
    text-align: center;
    &.close {
      background-color: #fff;
      border: 1px solid #542de0;
      color: #542de0;
      margin-right: 20px;
    }
    &.modify {
      background: #542de0;
      color: rgba(255, 255, 255, 1);
      border: 1px solid #542de0;
    }
  }
}

.token-reason {
  white-space: pre-wrap;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 10px 0;
  padding: 0;
  max-width: 400px;
  overflow: hidden;
  word-break: break-all;
}

.token-container {
  flex-wrap: wrap;
}
@media screen and (max-width: 540px) {
  .token-footer {
    display: flex;
    flex-direction: column;
  }

  .token-footer {
    .f-btn {
      margin: 10px 0 0;
      &.close {
        margin-right: 0;
      }
    }
  }
}
</style>
