<template>
  <section v-loading.fullscreen.lock="loading" class="main">
    <span class="back" @click="backPage">
      <svg-icon icon-class="arrow" class="icon" />返回Fan票
    </span>

    <div class="token">
      <section v-if="active < 3" class="steps">
        <section class="step" :class="active >= 0 && 'active'">
          ① 基础信息
        </section>
        <section class="step" :class="active >= 1 && 'active'">
          ② Fan票设置
        </section>
        <section class="step" :class="active >= 2 && 'active'">
          ③ 提交申请
        </section>
      </section>

      <div class="token-head">
        <span class="h-title">免费发行Fan票</span>
        <a class="h-rule" href="https://www.yuque.com/matataki/matataki/whiigy" target="_blank">
          Fan票申请帮助文档<svg-icon icon-class="arrow" class="icon" />
        </a>
      </div>

      <stepOne v-show="active === 0" @done="() => active++" />
      <stepTwo
        v-show="active === 1"
        :info="userMinetokenApplication"
        @done="twoPostInfo"
        @prev="() => active--"
      />
      <stepThree v-show="active === 2" @done="threePostInfo" @prev="() => active--" />
      <stepFour v-show="active === 3" @done="backPage" />
      <stepFive v-show="active === 4" @done="backPage" />
      <stepSix v-show="active === 5" :reason="userMinetokenApplication.reason || ''" @done="resetApplication" />
    </div>
  </section>
</template>


<script>
import stepOne from '@/components/postminetoken_page/step_one'
import stepTwo from '@/components/postminetoken_page/step_two'
import stepThree from '@/components/postminetoken_page/step_three'
import stepFour from '@/components/postminetoken_page/step_four'
import stepFive from '@/components/postminetoken_page/step_five'
import stepSix from '@/components/postminetoken_page/step_six'
import { extractChar } from '@/utils/reg'
import { getCookie } from '@/utils/cookie'
import { mapGetters } from 'vuex'

export default {
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive,
    stepSix
  },
  data() {
    return {
      active: 0,
      stepOneStatus: false,
      stepTwoStatus: false,
      stepThreeStatus: false,
      stepTwoData: null, // 表单数据
      stepThreeData: null, // 表单数据
      loading: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
  },
  watch: {
    isLogined() {
      this.getTokenUserData()
    }
  },
  async asyncData({ $axios, req }) {
    try {

      // 获取cookie token
      let accessToken = ''
      // 请检查您是否在服务器端
      if (process.server) {
        const cookie = req && req.headers.cookie ? req.headers.cookie : ''
        const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
        accessToken = token ? token[0] : ''
      }
      if (process.browser) {
        accessToken = getCookie('ACCESS_TOKEN')
      }

      // 获取用户申请fan票信息
      const res = await $axios({
        url: '/api/minetoken_application',
        methods: 'get',
        headers: { 'x-access-token': accessToken }
      })
      if (res.code === 0) {
        console.log('res', res)
        return { userMinetokenApplication: res.data }
      }
      return { userMinetokenApplication: {} }

    } catch (error) {
      console.log('error', error)
      return { userMinetokenApplication: {} }
    }
  },
  created() {
    if (process.browser) {

      let { status } = this.$route.query
      if (status === 'modify') {
        this.active = 1
      }
      // 状态 0 申请成功 1 申请未提交 2 申请中 3申请失败
      else if (this.userMinetokenApplication.status === 0) {
        this.active = 4
      } else if (this.userMinetokenApplication.status === 1) {
        this.active = 1
      } else if (this.userMinetokenApplication.status === 2) {
        this.active = 3
      } else if (this.userMinetokenApplication.status === 3) {
        this.active = 5
      } else {
        this.active = 0
      }
    }
    if (process.browser && this.isLogined) {
      this.getTokenUserData()
    }
  },
  methods: {
    // 获取 token user 的信息
    async getTokenUserData() {
      const userResult = await this.$utils.factoryRequest(this.$API.tokenUserId(this.currentUserInfo.id))
      // 已经发币了 直接返回
      if (userResult && userResult.data) {
        this.$router.go(-1)
      }
    },
    prev() {
      this.active--
    },
    next() {

      if (!this.stepOneStatus) {
        this.$message({ showClose: true, message: '请先所有任务哦~', type: 'warning'})
        return
      }
      this.active++

    },
    async twoPostInfo(data) {
      this.stepTwoData = data
      this.active++
    },
    threePostInfo(data) {
      this.stepThreeData = data

      this.postInfo()
    },
    // 上传信息
    async postInfo() {

      this.loading = true

      let { status } = this.$route.query
      if (status === 'modify') {
        this.stepTwoData.type = 'modify'
      }

      let resultMinetokenApplication = await this.$utils.factoryRequest(this.$API.apiMinetokenApplication(this.stepTwoData))
      if (!resultMinetokenApplication) {
        this.$message.error('失败')
      }

      let resultMinetokenApplicationSurvey = await this.$utils.factoryRequest(this.$API.apiMinetokenApplicationSurvey(this.stepThreeData))
      if (!resultMinetokenApplicationSurvey) {
        this.$message.error('失败')
      }

      if (resultMinetokenApplication && resultMinetokenApplicationSurvey) {
        this.active++
      }

      this.loading = false

    },
    backPage() {
      this.$router.go(-1)
    },
    // 重新申请
    async resetApplication() {
      let resultMinetokenApplication = await this.$utils.factoryRequest(this.$API.apiMinetokenApplication({
        type: 'reset'
      }))
      if (resultMinetokenApplication) {
        this.active = 1
      }
    },
  }
}
</script>
<style lang="less" scoped>
.back {
  display: inline-block;
  margin: 20px 0;
  font-size:20px;
  font-weight:600;
  color:rgba(0,0,0,1);
  line-height:28px;
  cursor: pointer;

  .icon {
    transform: rotate(180deg);
    margin-right: 4px;
  }
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
.token {
  background: #fff;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  overflow: hidden;
  padding: 40px 80px;
  box-sizing: border-box;
}

.steps {
  &::after {
    display: block;
    content: "";
    width: 0;
    height: 0;
    clear: both;
  }
  .step {
    float: left;
    background-color: #dbdbdb;
    padding: 5px 30px;

    font-size: 14px;
    color: rgba(178, 178, 178, 1);
    position: relative;

    &::before {
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 20px;
      border-color: transparent transparent transparent #fff;
      border-style: solid;
      position: absolute;
      top: -5px;
      right: -36px;
      bottom: 0;
      z-index: 2;
    }
    &::after {
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 15px;
      border-color: transparent transparent transparent #dbdbdb;
      border-style: solid;
      position: absolute;
      top: 0;
      right: -26px;
      bottom: 0;
      z-index: 2;
    }

    &:nth-of-type(1) {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    &:nth-last-of-type(1) {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;

      &::before,
      &::after {
        display: none;
      }
    }

    &.active {
      background-color: #fa6400;
      color: #fff;
      &::after {
        border-color: transparent transparent transparent #fa6400;
      }
    }
  }
}
.token-head {
  margin: 40px 0;
  .h-title {
    font-size: 30px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 42px;
  }
  .h-rule {
    font-size: 16px;
    font-weight: 500;
    color: rgba(250, 100, 0, 1);
    line-height: 22px;
    margin-left: 10px;
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
}
</style>