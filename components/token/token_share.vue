<template>
  <el-dialog
    :visible.sync="showModal"
    :width="width"
    :lock-scroll="false"
    custom-class="gray-bg br10 p-share"
    :show-close="false"
    :center="widgetModalStatus === 0 ? true : false"
    :top="widgetModalStatus === 0 ? '15vh' : '20px'"
    @close="change"
  >
    <div v-if="widgetModalStatus === 0" class="padding1">
      <div class="widget-content-button">
        <div v-if="pageType === 1" class="widget-button" @click="copyCode(userWidget)">
          <div class="widget-button-img">
            <img class="token-share-card" src="@/assets/img/token_share_widget.png" alt="widget">
          </div>
          <p>{{ $t('p.createWidget') }}</p>
        </div>
        <div v-if="minetokenToken !== null && pageType === 0" class="widget-button" @click="widgetModalStatus = 1">
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
      <SocialShare :img="img" :title="shareLink" />
      <wechat style="margin: 60px 0 0 0;" :link="link" />
    </div>
    <div v-if="widgetModalStatus === 1 && minetokenToken !== null && pageType === 0" class="padding2">
      <tokenShareCardLayout :minetoken-token="minetokenToken" :minetoken-user="minetokenUser" />
    </div>
  </el-dialog>
</template>

<script>
import tokenShareCardLayout from './token_share_card_layout'
import SocialShare from '@/components/modal/social_share'
import wechat from '@/components/scan/wechat.vue'
export default {
  components: {
    SocialShare,
    wechat,
    tokenShareCardLayout
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
    /** 0:粉丝币， 1:个人主页 */
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
    width() {
      return this.widgetModalStatus === 0 ? '400px' : '800px'
    },
    shareLink() {
      const slogan = [
        `我在瞬MATATAKI发现了粉丝币「DAO」${process.env.VUE_APP_URL}/token/${this.$route.params.id} 持有粉丝币，让连接不止于关注！`,
        `${this.minetokenUser.nickname}的个人主页：\n${process.env.VUE_APP_URL}/user/${this.$route.params.id}`
      ]
      return slogan[this.pageType]
    },
    link() {
      if (process.browser) return window.location.href
      else return process.env.VUE_APP_URL
    },
    id() {
      return this.article.id
    },
    userWidget() {
      return `<iframe width="100%" height="200px" src="${process.env.VUE_APP_URL}/widget/user/?id=${this.$route.params.id}" frameborder=0></iframe>`
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
    height: 188px;
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
</style>

<style lang="less">
.p-share .el-dialog__header,
.p-share .el-dialog__body {
  padding: 0;
}
</style>
