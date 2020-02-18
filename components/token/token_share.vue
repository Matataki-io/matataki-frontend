<template>
  <el-dialog
    :visible.sync="showModal"
    :width="width"
    :lock-scroll="false"
    :show-close="false"
    :center="widgetModalStatus === 0 ? true : false"
    :top="widgetModalStatus === 1 || widgetModalStatus === 4 ? '20px' : '15vh'"
    @close="change"
    custom-class="gray-bg br10 p-share"
  >
    <!-- 主窗口 -->
    <div v-if="widgetModalStatus === 0" class="padding1">
      <div class="widget-content-button">
        <div v-if="pageType !== 2" @click="widgetModalStatus = 3" class="widget-button">
          <div class="widget-button-img">
            <img class="token-share-card" src="@/assets/img/token_share_widget.png" alt="widget">
          </div>
          <p>{{ $t('p.createWidget') }}</p>
        </div>
        <div v-if="(minetokenToken !== null && pageType === 0) || pageType === 2" @click="reviewShareCard" class="widget-button">
          <div class="widget-button-img">
            <img class="token-share-card" src="@/assets/img/token_share_card.png" alt="widget">
          </div>
          <p>{{ $t('p.createLongImg') }}</p>
        </div>
        <div class="widget-button">
          <div @click="copyCode(shareLink)">
            <img class="token-share" src="@/assets/img/token_share.png" alt="link">
          </div>
          <p>{{ $t('p.copyInviteLink') }}</p>
        </div>
      </div>
      <SocialShare
        :img="img"
        :title="shareLink"
        :link="link"
        :summary="summary"
        :qq-title="qqTitle"
      />
      <wechat v-if="pageType !== 2" :link="link" style="margin: 60px 0 0 0;" />
      <div v-else class="invite-synopsis">
        邀请有奖：<br>
        每成功邀请一名好友注册可得666积分！<br>
        新用户阅读5篇文章（30秒以上）并作出评价视为成功邀请。<br>
        受邀好友每次发文你可以获得额外20积分！<br>
        受邀好友每次阅读获得积分，你可额外获得其总额1/4的积分！<br>
        持有积分未来可共享 瞬Matataki 全平台收益！<br>
      </div>
    </div>
    <!-- 截图分享 -->
    <div v-if="widgetModalStatus === 1 && minetokenToken !== null && pageType === 0" class="padding2">
      <tokenShareCardLayout :minetoken-token="minetokenToken" :minetoken-user="minetokenUser" />
    </div>
    <!-- widget使用说明 -->
    <div v-if="widgetModalStatus === 2" class="padding1 widget-help">
      <p class="widget-help-title">
        {{ $t('p.articleWidgetHelp') }}
      </p>
      <p class="widget-help-content">
        {{ $t('p.articleWidgetContent') }}
      </p>
      <br>
      <p class="widget-help-title">
        {{ $t('p.stepTitle') }}
      </p>
      <p class="widget-help-content">
        1.{{ $t('p.stepContent1') }}<br>
        2.{{ $t('p.stepContent2') }}<br>
        3.{{ $t('p.stepContent3') }}<br>
        4.{{ $t('p.stepContent4') }}<br>
      </p>

      <a @click="backWidget" class="widget-help-button" href="javascript:;">
        {{ $t('p.confirmPopover') }}
      </a>
    </div>
    <!-- widget -->
    <div v-if="widgetModalStatus === 3" class="padding1 widget-review">
      <p class="widget-title">
        {{ $t('p.widgetView') }}
      </p>
      <div v-html="tokenWidget" class="widget-review-content" />
      <p class="widget-review-des">
        {{ $t('p.widgetCopyDes') }}
      </p>
      <el-input
        v-model="tokenWidget"
        :rows="4"
        class="widget-textarea"
        type="textarea"
        placeholder="请输入内容"
      />
      <div class="widget-footer">
        <a @click="reviewHelp" class="help" href="javascript:;">
          {{ $t('p.widgetHelp') }}
        </a>
        <a @click="copyCode(tokenWidget)" class="create" href="javascript:;">
          {{ $t('p.copyCode') }}
        </a>
      </div>
    </div>
    <!-- 邀请新用户 -->
    <div v-if="widgetModalStatus === 4 && pageType === 2" class="padding2">
      <inviteNewUsersCardLayout />
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import SocialShare from '@/components/modal/social_share'
import wechat from '@/components/scan/wechat.vue'
import tokenShareCardLayout from './token_share_card_layout'
import inviteNewUsersCardLayout from './invite_new_users_card_layout'
export default {
  components: {
    SocialShare,
    wechat,
    tokenShareCardLayout,
    inviteNewUsersCardLayout
  },
  props: {
    minetokenToken: {
      type: Object,
      default: null
    },
    minetokenUser: {
      type: Object,
      required: true
    },
    shareModalShow: {
      type: Boolean,
      default: false
    },
    /** 0:Fan票， 1:个人主页 */
    pageType: {
      type: Number,
      default: 0
    },
    img: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showModal: false,
      // 0 默认 1 widget
      widgetModalStatus: 0

    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    width() {
      if (this.widgetModalStatus === 1) { return '800px' } else if (this.pageType === 2) return '480px'
      else return '400px'
    },
    shareLink() {
      const slogan = [
        `我在瞬MATATAKI发现了Fan票「${(this.minetokenToken && this.minetokenToken.symbol) || ''}」${this.link} 持有Fan票，让连接不止于关注！`,
        `${this.minetokenUser.nickname}的个人主页：\n${this.link}`,
        this.referralLink1()
      ]
      return slogan[this.pageType]
    },
    link() {
      if (process.browser) {
        const slogan = [
          `${process.env.VUE_APP_URL}/token/${this.$route.params.id}`,
          `${process.env.VUE_APP_URL}/user/${this.$route.params.id}`,
          `${process.env.VUE_APP_URL}?referral=${this.currentUserInfo.id}`
        ]
        return slogan[this.pageType]
      } else return process.env.VUE_APP_URL
    },
    id() {
      return this.article.id
    },
    tokenWidget() {
      return ([
        `<iframe width="100%" height="200px" src='${process.env.VUE_APP_URL}/widget/token/?id=${this.$route.params.id || 0}' frameborder=0></iframe>`,
        `<iframe width="100%" height="200px" src='${process.env.VUE_APP_URL}/widget/user/?id=${this.$route.params.id || 0}' frameborder=0></iframe>`,
        ''
      ])[this.pageType]
    },
    summary() {
      return ([
        '持有Fan票，让连接不止于关注！',
        '瞬Matataki',
        this.$t('referral')
      ])[this.pageType]
    },
    qqTitle() {
      return ([
        `「${(this.minetokenToken && this.minetokenToken.symbol) || ''}」的Fan票主页`,
        `${this.minetokenUser.nickname}的个人主页`,
        '瞬Matataki'
      ])[this.pageType]
    }
  },
  watch: {
    showModal(val) {
      if (val) document.querySelector('body').style.overflow = 'hidden'
      else document.querySelector('body').style.overflow = ''
      this.$emit('input', val)
    },
    shareModalShow(val) {
      console.log(val)
      this.showModal = val
    }
  },
  mounted() {},
  methods: {
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$message.success(this.$t('success.copy'))
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    },
    resetStatus() {
      this.widgetModalStatus = 0
    },
    async change(status) {
      this.showModal = false
      await this.$utils.sleep(300)
      !status && this.resetStatus()
    },
    reviewHelp() {
      this.widgetModalStatus = 2
    },
    backWidget() {
      this.widgetModalStatus = 3
    },
    reviewShareCard() {
      this.widgetModalStatus = this.pageType === 0 ? 1 : 4
    },
    referralLink1() {
      if (process.browser) {
        if (this.currentUserInfo && this.currentUserInfo.id) return `瞬Matataki，${this.$t('referral')}${this.link}`
        else return `瞬Matataki，${this.$t('referral')}${window.location.origin}`
      } else return ''
    }
  }
}
</script>

<style scoped lang="less">
.widget-content-button {
  display: flex;
  padding: 40px 0;
  .widget-button {
    flex: 1;
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 8px;
    cursor: pointer;
    p {
      font-size: 14px;
      color: #333;
      margin-top: 20px;
    }
  }
}

.widget-writecontent {
  padding: 4px;
  &-title {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    margin: 0 0 10px 0;
  }
}

.widget-help {
  padding: 4px 24px;
  &-title {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    text-align: center;
  }
  &-content {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    color: rgba(45, 45, 45, 1);
    margin-top: 10px;
    text-align: justify;
  }
  &-button {
    margin-top: 20px;
    padding: 8px 14px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    background-color: #2b2b2b;
    text-align: center;
    cursor: pointer;
    float: right;
  }
  &::after {
    display: block;
    content: "";
    clear: both;
    width: 0;
    height: 0;
  }
}

.widget-review {
  padding: 4px;
  &-content {
    height: 203px;
    overflow: auto;
  }
  &-des {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    margin-bottom: 10px;
  }
}

// 公用输入框
.widget-textarea {
  background: #f1f1f1;
  min-width: 275px;
  border-radius: 8px;
}

// 公用标题
.widget-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  margin: 0 0 20px 0;
}
// 公用footer
.widget-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .help {
    font-size: 14px;
    font-weight: 500;
    color: @purpleDark;
    cursor: pointer;
  }
  .create {
    padding: 8px 14px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    background-color: #2b2b2b;
    text-align: center;
    cursor: pointer;
  }
}

p {
  margin: 10px 0 0 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}

.padding1 {
  padding: 40px 20px;
}
.padding2 {
  border-radius: @br10;
  overflow: hidden;
}

.token-share {
  width: 46px;
}

.token-share-card {
  width: 51px;
}

.invite-synopsis {
  font-size: 14px;
  margin: 90px auto 0;
  width: 386px;
  line-height: 20px;
  font-weight: 400;
}
</style>

<style lang="less">
.p-share .el-dialog__header,
.p-share .el-dialog__body {
  padding: 0;
}
</style>
