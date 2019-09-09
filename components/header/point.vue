<template>
  <el-dropdown @visible-change="getPointStatus">
    <svg-icon class="integral" icon-class="integral" @click="jumpAccount" />
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item></el-dropdown-item> -->
      <div class="integral-container">
        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">我的积分</span>
            <span class="integral-num">{{ pointStatus.amount }}</span>
          </div>
        </div>

        <div v-if="!pointStatus.profile" class="integral-list">
          <div class="flex">
            <span class="integral-title">完善个人资料</span>
            <el-button size="mini" class="integral-btn" @click="profile">
              <svg-icon class="box" icon-class="box" />
              领取
            </el-button>
          </div>
          <p class="integral-des">
            前往设置页上传头像+设置昵称即可领取{{ $point.profile }}积分
          </p>
        </div>

        <div v-if="!pointStatus.login" class="integral-list">
          <div class="flex">
            <span class="integral-title">用户回馈</span>
            <el-button size="mini" class="integral-btn" @click="feedback">
              <svg-icon class="box" icon-class="box" />
              领取
            </el-button>
          </div>
          <p class="integral-des">
            感谢8月30日前注册的老用户支持，点击领取{{ $point.loginOld }}积分
            <br>
            新用户点击领取{{ $point.loginNew }}积分
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
            <span class="integral-title">邀请好友有奖</span>
            <el-button size="mini" class="integral-btn" @click="copyLink(referralLink1)">
              复制链接
            </el-button>
          </div>
          <div class="integral-link">
            {{ referralLink }}
          </div>
          <p class="integral-des">
            每成功邀请一名好友注册可得{{ $point.regInviteFinished + $point.regInviter }}积分
            <br>
            好友发文你可以获得额外{{ $point.publishReferral }}积分
            <br>
            好友阅读获得积分你可得额外1/{{ 1 / $point.readReferralRate }}
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">每日发文奖励</span>
          </div>
          <div class="integral-progress">
            <el-progress class="progress" color="#542DE0" :percentage="pointStatusPostNum" :show-text="false" :stroke-width="10" />
            {{ pointStatusPost }}
          </div>
          <p class="integral-des">
            每日发文最高可得{{ $point.publishDailyMax }}积分奖励
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">每日阅读奖励</span>
          </div>
          <div class="integral-progress">
            <el-progress class="progress" color="#542DE0" :percentage="pointStatusReadNum" :show-text="false" :stroke-width="10" />
            {{ pointStatusRead }}
          </div>
          <p class="integral-des">
            每日阅读评价文章最高可得{{ $point.readDailyMax }}积分奖励
          </p>
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
        if (this.currentUserInfo && this.currentUserInfo.id) return `瞬MATATAKI，永久存储和版权记录的内容平台。行业领先的去中心化应用，创作者的安全港湾。注册登入即可领取额外500积分。${window.location.origin}?referral=${this.currentUserInfo.id}`
        else return `瞬MATATAKI，永久存储和版权记录的内容平台。行业领先的去中心化应用，创作者的安全港湾。注册登入即可领取额外500积分。${window.location.origin}`
      } else return ''
    },
    pointStatusPost() {
      if (this.pointStatus.publish) return this.pointStatus.publish.today + '/' + this.pointStatus.publish.max
      else return '0/300'
    },
    pointStatusRead() {
      if (this.pointStatus.publish) return this.pointStatus.read.today + '/' + this.pointStatus.read.max
      else return '0/100'
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
      await this.$API.userPointStatus()
        .then(res => {
          if (res.code === 0) this.pointStatus = res.data
          else console.log(res.message)
        })
        .catch(err => console.log(err))
    }, 1000),
    isLoginFunc() {
      if (!this.isLogined) {
        this.$message({ message: '请先登录', type: 'info', customClass: 'zindex-3000' })
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
    jumpAccount() {
      if (!this.isLoginFunc()) return
      if (this.isLogined) this.$router.push({ name: 'user-account-points' })
    },
    profile() {
      if (!this.isLoginFunc()) return
      // console.log('领取资料设置积分')
      this.$API.userClaimTaskPoint({
        type: 'profile'
      }).then(res => {
        if (res.code === 0) {
          this.$message.success({ message: '领取成功' })
          this.getUserPointStatus()
        } else this.$message.error({ message: `领取失败,${res.message}` })
      }).catch(err => {
        console.log('领取设置资料积分失败', err)
        this.$message.error({ message: '领取失败' })
      })
    },
    feedback() {
      if (!this.isLoginFunc()) return
      // console.log('领取老用户回馈积分')
      this.$API.userClaimTaskPoint({
        type: 'login'
      }).then(res => {
        if (res.code === 0) {
          this.$message.success({ message: '领取成功' })
          this.getUserPointStatus()
        } else this.$message.error({ message: `领取失败,${res.message}` })
      }).catch(err => {
        console.log('领取老用户回馈积分失败', err)
        this.$message.error({ message: '领取失败' })
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
          this.$message.success('复制成功')
        },
        () => {
          this.$message.error('复制失败')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.integral {
  width: 26px;
  height: 26px;
  margin: 0 40px;
  cursor: pointer;
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
