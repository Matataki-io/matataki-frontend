<template>
  <div class="token-content">
    <p class="token-title">步骤 1：完善基础信息</p>
    <ul>
      <li>
        1.  完善个人信息：设置头像、昵称和简介
        <img v-if="isCompleteInfo" src="@/assets/img/token_banner_fan_done.svg" alt="done">
        <router-link v-else :to="{ name: 'setting' }" target="_blank">
          立即设置
        </router-link>
      </li>
      <li>
        2. 至少在Matataki发布过一篇文章
        <img v-if="articleNumber > 0" src="@/assets/img/token_banner_fan_done.svg" alt="done">
        <router-link v-else :to="{ name: 'publish-type-id', params: { type: 'draft', id: 'create' } }" target="_blank">
          立即发布
        </router-link>
      </li>
      <li>
        3. 绑定邮箱账号，用于接收通知
        <img v-if="bindEmail" src="@/assets/img/token_banner_fan_done.svg" alt="done">
        <router-link v-else :to="{ name: 'setting-account' }" target="_blank">
          立即绑定
        </router-link>
      </li>
    </ul>
    <p class="token-remarks">在收到您的申请后，我们将会使用电子邮件与您联系。</p>

    <div class="token-footer">  
      <a class="h-rule" href="http://andoromeda.mikecrm.com/a93Le8z" target="_blank">
        任何反馈<svg-icon icon-class="arrow" class="icon" />
      </a>
      <a href="javascript:;" class="f-btn" @click="next">下一步</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      userData: Object.create(null),
      articleNumber: 0,
      bindEmail: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    isCompleteInfo() {
      let { avatar, nickname, introduction } = this.userData
      return avatar && nickname && introduction
    },
    isTokenUser() {
      return this.userData.status & this.$userStatus.hasMineTokenPermission
    }
  },
  watch: {
    isLogined() {
      this.getCurrentUserData()
    },
  },
  created() {
    if (process.browser) {
      if (this.isLogined) {
        this.getCurrentUserData()
      }
    }
  },

  methods: {
    // 获取当前用户的信息
    async getCurrentUserData() {
      const userResult = await this.$utils.factoryRequest(this.$API.getUser(this.currentUserInfo.id))
      if (userResult) {
        this.userData = userResult.data
      }

      const userArticleNumberResult = await this.$utils.factoryRequest(this.$API.getNumArticles(this.currentUserInfo.id))
      if (userArticleNumberResult) {
        this.articleNumber = userArticleNumberResult.data.count
      }

      const accountListResult = await this.$utils.factoryRequest(this.$API.accountList())
      if (accountListResult) {
        this.bindEmail = (accountListResult.data.filter(i => i.platform === 'email')).length >= 1 ? true : false
      }
    },
    // 是否完成
    isDone() {
      if (this.isCompleteInfo && this.articleNumber > 0 && this.bindEmail) {
        this.$emit('done', true)
      } else {
        this.$emit('done', false)
      }
    },
    next() {
      if (this.isCompleteInfo && this.articleNumber > 0 && this.bindEmail) {
        this.$emit('done')
      } else {
        this.$message({ showClose: true, message: '请先所有任务哦~', type: 'warning'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.token-content {
  ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      padding: 0;
      margin: 20px 0;
      a {
        text-decoration: underline;
        color: #FA6400;
      }
      img {
        width: 20px;
        height: 20px;
        line-height: 22px;
        margin-left: 6px;
        vertical-align: bottom;
      }
    }
  }
  .token-remarks {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    padding: 0;
    margin: 20px 0 0 0;
  }
}
.token-title {
  font-size:16px;
  color:rgba(0,0,0,1);
  line-height:22px;
  padding: 0;
  margin: 0;
}

.h-rule {
  font-size: 16px;
  font-weight: 500;
  color: rgba(250, 100, 0, 1);
  line-height: 22px;
  margin-right: 20px;
  .icon {
    transition: all 0.2s;
    margin-left: 4px;
  }
  &:hover {
    text-decoration: underline;
    .icon {
      transform: translateX(4px);
    }
  }
}
.token-footer {
  margin-top: 200px;
  text-align: right;
  .f-btn {
    width:300px;
    height:40px;
    background:rgba(250,100,0,1);
    border-radius:8px;
    font-size:16px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:40px;
    display: inline-block;
    text-align: center;
  }
}
</style>