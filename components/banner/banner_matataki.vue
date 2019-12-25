<template>
  <div class="banner-container mw">
    <div class="banner">
      <n-link :to="{name: 'index'}" class="banner-logo">
        <img class="logo" src="@/assets/img/m_logo_square.png" alt="logo">
        <img class="slogan" src="@/assets/img/des_logo2.png" alt="slogan">
      </n-link>
      <div class="banner-data">
        <!-- <div class="data">
          <p class="data-title">
            {{ $t('home.bannerUser') }}
          </p>
          <p class="data-num">
            {{ postsStats.users || 0 }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerArticles') }}
          </p>
          <p class="data-num">
            {{ postsStats.articles || 0 }}
          </p>
        </div> -->
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerPoint') }}
          </p>
          <p class="data-num">
            {{ postsStats.points || 0 }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            {{ $t('point.title') }}
          </p>
          <p class="data-num">
            {{ pointStatus.amount || 0 }}
          </p>
        </div>

        <div class="banner-img">
          <img src="@/assets/img/pc_banner_img.png" alt="banner">
        </div>

        <div class="reward">
          <div class="integral-list">
            <div class="flex">
              <span class="integral-title">
                {{ $t('point.dailyReadPoint') }}
                <el-tooltip class="item" effect="dark" content="每日阅读并评价最高可得100积分奖励！" placement="top-start">
                  <svg-icon icon-class="anser" class="prompt-svg" />
                </el-tooltip>
              </span>
            </div>
            <div class="fl integral-progress">
              <el-progress :percentage="pointStatusReadNum" :show-text="false" :stroke-width="5" class="progress" color="#542DE0" />
              {{ pointStatusRead }}
            </div>
          </div>

          <div class="integral-list">
            <div class="flex">
              <span class="integral-title">
                {{ $t('point.dailyPublishPoint') }}
                <el-tooltip class="item" effect="dark" content="每日发文最高可得300积分奖励！" placement="top-start">
                  <svg-icon icon-class="anser" class="prompt-svg" />
                </el-tooltip>
              </span>
            </div>
            <div class="fl integral-progress">
              <el-progress :percentage="pointStatusPostNum" :show-text="false" :stroke-width="5" class="progress" color="#542DE0" />
              {{ pointStatusPost }}
            </div>
          </div>
        </div>
      </div>

      <div class="invite">
        <p class="title">
          邀请好友有奖
          <el-tooltip class="item" effect="dark" content="每成功邀请一名好友注册可得666积分！" placement="top-end">
            <div class="prompt">
              <svg-icon icon-class="anser" class="prompt-svg" />
            </div>
          </el-tooltip>
        </p>
        <el-button @click="share" type="primary" size="small" class="invite-button">
          立即邀请
        </el-button>
      </div>
    </div>
    <Share
      :share-modal-show="shareModalShow"
      :minetoken-user="{nickname: '123'}"
      :page-type="2"
      @input="val => shareModalShow = val"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import Share from '@/components/token/token_share.vue'

export default {
  components: {
    Share
  },
  data() {
    return {
      postsStats: Object.create(null),
      pointStatus: Object.create(null),
      shareModalShow: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    pointStatusPostNum() {
      if (this.pointStatus.publish) return this.pointStatus.publish.today / 3
      else return 0
    },
    pointStatusPost() {
      if (this.pointStatus.publish) return this.pointStatus.publish.today + '/' + this.pointStatus.publish.max
      else return `0/${this.$point.publishDailyMax}`
    },
    pointStatusReadNum() {
      if (this.pointStatus.read) return this.pointStatus.read.today
      else return 0
    },
    pointStatusRead() {
      if (this.pointStatus.publish) return this.pointStatus.read.today + '/' + this.pointStatus.read.max
      else return `0/${this.$point.readDailyMax}`
    }
  },
  mounted() {
    this.getPostsStats()
    this.getUserPointStatus()
  },
  methods: {
    getPostsStats() {
      this.$API.postsStats().then(res => {
        if (res.code === 0) this.postsStats = res.data
      }).catch(err => console.log(`${err}`))
    },
    // 防抖防止不必要的调用
    getUserPointStatus: debounce(async function () {
      // 没登录的情况
      if (!this.isLogined) {
        this.pointStatus.amount = 6666
        return
      }
      // 获取数据
      await this.$API.userPointStatus()
        .then(res => {
          console.log('个人统计数据：', res)
          if (res.code === 0) this.pointStatus = res.data
          else console.log(res.message)
        })
        .catch(err => console.log('获取个人统计数据失败', err))
    }, 1000),
    share() {
      this.shareModalShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.banner-container {
  padding: 0 10px;
  box-sizing: border-box;
}
.banner {
  height: 136px;
  background: #ffffff;
  border-radius: @br10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px 0 40px;
  box-sizing: border-box;
}

.banner-logo {
  display: flex;
  flex-direction: column;
  align-items: self-end;
  .logo {
    width: 64px;
  }
  .slogan {
    width: 139px;
    margin: 10px 0 0 7px;
  }
}

.banner-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-right: 20px;
}

.data {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 10px;
  box-sizing: border-box;
  &-title {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    padding: 0;
    margin: 0;
  }
  &-num {
    font-size: 36px;
    font-weight:bold;
    color: @purpleDark;
    padding: 0;
    margin: 10px 0 0;
    word-break: break-all;
  }
}

.reward {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 10px;
  box-sizing: border-box;
  .integral-list {
    margin: 8px 0;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .integral-title {
    font-size:12px;
    font-weight: bold;
    color: #000;
  }
  .integral-progress {
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    .progress {
      margin-right: 10px;
      flex: 1;
      width: 128px
    }
  }
  .prompt-svg{
    width: 28px;
  }
}

.invite {
  display: flex;
  align-items: center;
  flex-direction: column;
  .title {
    font-size:16px;
    font-weight:500;
    margin-bottom: 18px;
    margin-top: 0;
  }
  .invite-button {
    margin-right: auto;
    border-radius:6px;
  }
  .prompt {
    display: inline-flex;
    width: 19px;
    .prompt-svg{
      // width: 28px;
      font-size: 12px;
    }
  }
}

.banner-img {
  height: 100%;
  display: flex;
  align-items: center;
  img {
    height: 108px;
  }
}

// .banner-more {
//   font-size: 14px;
//   margin: 8px 0 0;
//   text-decoration: underline;
//   color: #542de0;
// }
</style>
