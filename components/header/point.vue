<template>
  <el-dropdown
    @visible-change="getPointStatus"
  >
    <span>
      <svg-icon
        class="integral-icon"
        icon-class="point1"
        @click.stop="jumpAccount"
      />
    </span>
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item></el-dropdown-item> -->
      <div class="integral-container">
        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">{{ $t('point.title') }}</span>
            <span class="integral-num">{{ pointStatus.amount || 0 }}</span>
          </div>
        </div>

        <div
          v-if="!pointStatus.profile"
          class="integral-list"
        >
          <div class="flex">
            <span class="integral-title">{{ $t('point.completeProfile') }}</span>
            <el-button
              size="mini"
              class="integral-btn"
              @click="profile"
            >
              <svg-icon
                class="box"
                icon-class="box"
              />
              {{ $t('point.receive') }}
            </el-button>
          </div>
          <p class="integral-des">
            {{ $t('point.uploadAvatar', [$point.profile]) }}
          </p>
        </div>

        <div
          v-if="!pointStatus.login"
          class="integral-list"
        >
          <div class="flex">
            <span class="integral-title">{{ $t('point.feedback') }}</span>
            <el-button
              size="mini"
              class="integral-btn"
              @click="feedback"
            >
              <svg-icon
                class="box"
                icon-class="box"
              />
              {{ $t('point.receive') }}
            </el-button>
          </div>
          <p class="integral-des">
            {{ $t('point.oldUser', [$point.loginOld]) }}
            <br>
            {{ $t('point.newUser', [$point.loginNew]) }}
          </p>
        </div>

        <!-- <div class="integral-list">
          <div class="flex">
            <span class="integral-title">荣誉勋章</span>
            <el-button size="mini" class="integral-btn" @click="medal">
              <svg-icon class="box" icon-class="box" />
              领取
            </el-button>
          </div>
          <p class="integral-des">
            前1000名用户回馈，领取后会显示在个人主页中
          </p>
        </div> -->

        <div class="line" />

        <!-- <div class="integral-list">
          <div class="flex">
            <span class="integral-title">每日签到有奖</span>
            <el-button size="mini" class="integral-btn" @click="check">
              <svg-icon class="checkin" icon-class="checkin" />
              签到
            </el-button>
          </div>
          <p class="integral-des">
            每日签到随机获得5～10积分，连续签到
            可得更多积分
          </p>
        </div> -->

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">{{ $t('point.invite') }}</span>
            <el-button
              size="mini"
              class="integral-btn"
              @click="copyLink(referralLink1)"
            >
              {{ $t('point.copyLink') }}
            </el-button>
          </div>
          <div class="integral-link">
            {{ referralLink }}
          </div>
          <p class="integral-des">
            {{ $t('point.inviteDes1', [$point.regInviteFinished + $point.regInviter]) }}
            <br>
            {{ $t('point.inviteDes2', [$point.publishReferral]) }}
            <br>
            {{ $t('point.inviteDes3', [1 / $point.readReferralRate]) }}
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">
              {{ $t('point.dailyPublishPoint') }}
            </span>
          </div>
          <div class="integral-progress">
            <el-progress
              :percentage="pointStatusPostNum"
              :show-text="false"
              :stroke-width="10"
              class="progress"
              color="#542DE0"
            />
            {{ pointStatusPost }}
          </div>
          <p class="integral-des">
            {{ $t('point.dailyPublishPointDes', [$point.publishDailyMax]) }}
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">
              {{ $t('point.dailyReadPoint') }}
            </span>
          </div>
          <div class="integral-progress">
            <el-progress
              :percentage="pointStatusReadNum"
              :show-text="false"
              :stroke-width="10"
              class="progress"
              color="#542DE0"
            />
            {{ pointStatusRead }}
          </div>
          <p class="integral-des">
            {{ $t('point.dailyReadPointDes', [$point.readDailyMax]) }}
          </p>
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  data() {
    return {
      pointStatus: Object.create(null)
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    referralLink() {
      if (process.browser) {
        if (this.currentUserInfo && this.currentUserInfo.id) return `${window.location.origin}?referral=${this.currentUserInfo.id}`
        else return `${window.location.origin}`
      } else return ''
    },
    referralLink1() {
      if (process.browser) {
        if (this.currentUserInfo && this.currentUserInfo.id) return `${this.$t('referral')}${window.location.origin}?referral=${this.currentUserInfo.id}`
        else return `${this.$t('referral')}${window.location.origin}`
      } else return ''
    },
    pointStatusPost() {
      if (this.pointStatus.publish) return this.pointStatus.publish.today + '/' + this.pointStatus.publish.max
      else return `0/${this.$point.publishDailyMax}`
    },
    pointStatusRead() {
      if (this.pointStatus.publish) return this.pointStatus.read.today + '/' + this.pointStatus.read.max
      else return `0/${this.$point.readDailyMax}`
    },
    pointStatusPostNum() {
      if (this.pointStatus.publish) return this.pointStatus.publish.today / 3
      else return 0
    },
    pointStatusReadNum() {
      if (this.pointStatus.read) return this.pointStatus.read.today
      else return 0
    }
  },
  created() {},
  mounted() {
    // 默认查询一次
    this.getUserPointStatus()
  },
  methods: {
    getPointStatus(status) {
      // 显示的时候查询数据 保证数据更新
      if (status) this.getUserPointStatus()
    },
    // 防抖防止不必要的调用
    getUserPointStatus: debounce(async function () {
      if (!this.isLogined) return
      await this.$API.userPointStatus()
        .then(res => {
          if (res.code === 0) this.pointStatus = res.data
          else console.log(res.message)
        })
        .catch(err => console.log(err))
    }, 1000),
    isLoginFunc() {
      if (!this.isLogined) {
        this.$message({ message: this.$t('error.pleaseLogin'), type: 'info', customClass: 'zindex-3000' })
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
    jumpAccount() {
      if (!this.isLoginFunc()) return
      if (this.isLogined) this.$router.push({ name: 'account' })
    },
    profile() {
      if (!this.isLoginFunc()) return
      // console.log('领取资料设置积分')
      this.$API.userClaimTaskPoint({
        type: 'profile'
      }).then(res => {
        if (res.code === 0) {
          this.$message.success({ message: this.$t('point.receiveSuccess') })
          this.getUserPointStatus()
        } else this.$message.error({ message: `${this.$t('point.receiveFail')},${res.message}` })
      }).catch(err => {
        console.log(this.$t('point.receiveProfileFail'), err)
        this.$message.error({ message: this.$t('point.receiveFail') })
      })
    },
    feedback() {
      if (!this.isLoginFunc()) return
      // console.log('领取老用户回馈积分')
      this.$API.userClaimTaskPoint({
        type: 'login'
      }).then(res => {
        if (res.code === 0) {
          this.$message.success({ message: this.$t('point.receiveSuccess') })
          this.getUserPointStatus()
        } else this.$message.error({ message: `${this.$t('point.receiveFail')},${res.message}` })
      }).catch(err => {
        console.log(this.$t('point.receiveFeedbackFail'), err)
        this.$message.error({ message: this.$t('point.receiveFail') })
      })
    },
    // medal() {
    //   if (!this.isLoginFunc()) return
    //   console.log('领取资荣誉勋章')
    // },
    // check() {
    //   if (!this.isLoginFunc()) return
    //   console.log('领取每日签到有奖积分')
    // },
    copyLink(text) {
      this.$copyText(text).then(
        () => {
          this.$message.success(this.$t('success.copy'))
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.integral-icon {
  width: 26px;
  height: 26px;
  margin: 0 20px;
  cursor: pointer;
  color: #000;
}

.line {
  height: 1px;
  background-color: #DBDBDB;
}

.integral-container {
  width: 256px;
  padding: 0 20px;
  overflow: auto;
  max-height: 600px;
}
.integral-list {
  margin: 20px 0;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.integral-title {
  font-size:16px;
  font-weight: bold;
  color: #000;
}
.integral-des {
  font-size:12px;
  font-weight:400;
  color:rgba(178,178,178,1);
  padding: 0;
  margin: 10px 0 0;
  line-height: 1.5;
}

.integral-num {
  font-size:24px;
  color:@purpleDark;
  font-weight: bold;
}

.integral-link {
  display: flex;
  align-items: center;
  height:30px;
  background:rgba(241,241,241,1);
  border-radius:6px;
  font-size:14px;
  color:rgba(178,178,178,1);
  padding: 4px 6px;
  margin: 10px 0;
  line-height: 1.5;
}

.integral-progress {
  margin: 10px 0;
  display: flex;
  align-items: center;
  .progress {
    margin-right: 10px;
    flex: 1;
  }
}

.integral-btn {
  background: #000;
  border-color: #000;
  color: #fff;
  &:hover {
    background: #333;
    border-color: #333;
  }
}
</style>
