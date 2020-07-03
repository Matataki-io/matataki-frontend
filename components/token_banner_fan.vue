<template>
  <div class="token-banner">
    <div class="token-up">
      <img class="up" src="@/assets/img/token_banner_fan_up.svg">
    </div>
    <div class="token-down">
      <img class="down " src="@/assets/img/token_banner_fan_down.svg">
    </div>
    <img class="token-todo" src="@/assets/img/token_banner_fan_todo.svg">

    <div class="token-content">
      <p class="token-title">人人皆可免费发行</p>
      <template v-if="!isTokenUser">
        <p class="token-description mode-one">按顺序完成以下任务，即可免费发行你的Fan票</p>
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
          <li>3. 提交&nbsp;<a href="https://wj.qq.com/s2/5208015/8e5d" target="_blank" @click="applicationForm">申请表单</a>&nbsp;进入waitlist（若已填写请勿重复提交）</li>
        </ul>
        <p class="token-remarks">在收到您的申请后，我们将会使用电子邮件与您联系，请务必确保申请表单中填写的邮箱地址正确</p>
      </template>
      <template v-else>
        <p class="token-description mode-two">您好！您的申请已经通过，请查收邮箱中的邮件。</p>
        <router-link :to="{name: 'postminetoken'}" target="_blank" class="token-more hvr-float">
          发行Fan票
        </router-link>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      userData: Object.create(null),
      articleNumber: 0
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
    }
  },
  created() {
    if (process.browser) {
      if (this.isLogined) {
        this.getCurrentUserData()
      }
    }
  },

  methods: {
    async getCurrentUserData() {
      const userResult = await this.$utils.factoryRequest(this.$API.getUser(this.currentUserInfo.id))
      if (userResult) {
        this.userData = userResult.data
      }

      const userArticleNumberResult = await this.$utils.factoryRequest(this.$API.getNumArticles(this.currentUserInfo.id))
      if (userResult) {
        this.articleNumber = userArticleNumberResult.data.count
      }
    },
    // 表单申请
    applicationForm(e) {
      if (!(this.isCompleteInfo && this.articleNumber > 0)) {
        this.$message({ showClose: true, message: '请先完成前面的两个任务哦~', type: 'warning'})
        this.$utils.stopEvent(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.token-banner {
  width: 100%;
  border-radius: 10px;
  min-height: 240px;
  background-color: #ffefe6;
  border-radius: 10px;
  position: relative;
  background-image: url("../assets/img/token_banner_fan_bc.png");
  background-size: cover;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  padding: 20px 0;
}

.token-up {
  position: absolute;
  overflow: hidden;
  border-radius: 10px 0 0 0;
  top: 0;
  left: 0;
  height: 90px;
  width: 134px;
  .up {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}

.token-down {
  position: absolute;
  overflow: hidden;
  border-radius: 0 0 0 10px;
  left: 0;
  bottom: 0;
  height: 80px;
  width: 82px;
  .down {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
.token-todo {
  position: absolute;
  right: 40px;
  top: -20px;
  max-width: 280px;
  animation: Updown 3s linear infinite;
}

.token-content {
  margin-left: 200px;
  margin-right: 20px;
  .token-title {
    font-size: 30px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 42px;
    padding: 0;
    margin: 0;
  }

  .token-description {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    padding: 0;
    margin: 0;
  }
  .mode-one {
    margin-top: 10px;
  }
  .mode-two {
    margin-top: 20px;
  }
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
      margin: 10px 0;
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
    margin: 0;
  }
  .token-more {
    display: block;
    width: 160px;
    border-radius: 4px;
    background-color: #fa6400;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    margin-top: 48px;
    text-align: center;
    padding: 5px 0;
  }
}

@media screen and (max-width: 1100px) {
  .token-up,
  .token-down {
    display: none;
  }
  .token-content {
    margin-left: 20px;
  }
}

@media screen and (max-width: 900px) {
  .token-todo {
    right: 20px;
    max-width: 220px;
  }
}
@media screen and (max-width: 700px) {
  .token-todo {
    display: none;
  }
}
</style>