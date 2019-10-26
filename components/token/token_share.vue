<template>
  <el-dialog
    :visible.sync="showModal"
    width="400px"
    :lock-scroll="false"
    custom-class="gray-bg br10 p-share"
    :show-close="false"
    center
    @close="change"
  >
    <div v-if="widgetModalStatus === 0" class="padding1">
      <div class="widget-content-button">
        <!-- <div class="widget-button" @click="widgetModalStatus = 1">
          <div class="widget-button-img">
            <img src="@/assets/img/widget/share.svg" alt="widget">
          </div>
          <p>{{ $t('p.createLongImg') }}</p>
        </div> -->
        <div class="widget-button" @click="copyCode(shareLink)">
          <div class="widget-button-img">
            <img src="@/assets/img/widget/link.svg" alt="link">
          </div>
          <p>{{ $t('p.copyInviteLink') }}</p>
        </div>
      </div>
      <SocialShare :img="img" :title="shareLink" />
      <wechat style="margin: 60px 0 0 0;" :link="link" />
    </div>
    <div v-if="widgetModalStatus === 1" class="padding2">
      111
    </div>
  </el-dialog>
</template>

<script>
import SocialShare from '@/components/modal/social_share'
import wechat from '@/components/scan/wechat.vue'
export default {
  components: {
    SocialShare,
    wechat
  },
  props: {
    shareModalShow: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showModal: false,
      // 0 默认 1
      widgetModalStatus: 0
    }
  },
  computed: {
    shareLink() {
      return `我在瞬MATATAKI发现了粉丝币「DAO」www.matataki.io/token/${this.$route.params.id} 持有粉丝币，让连接不止于关注！`
    },
    link() {
      if (process.browser) return window.location.href
      else return process.env.VUE_APP_URL
    },
    id() {
      return this.article.id
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    shareModalShow(val) {
      console.log(val)
      this.showModal = val
    }
  },
  mounted() {
  },
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
  padding: 0 0 40px 0;
  .widget-button {
    flex: 1;
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 8px;
    cursor: pointer;
    &-img {
      width: 80px;
      height: 80px;
      background-color: #fff;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.widget-writecontent {
  padding: 4px;
  &-title {
    font-size:20px;
    font-weight:600;
    color:rgba(0,0,0,1);
    margin: 0 0 10px 0;
  }
}

.widget-help {
  padding: 4px 24px;
  &-title {
    font-size:20px;
    font-weight:600;
    color:rgba(0,0,0,1);
    text-align: center;
  }
  &-content {
    font-size:16px;
    line-height: 1.5;
    font-weight:400;
    color:rgba(45,45,45,1);
    margin-top: 10px;
    text-align: justify;
  }
  &-button {
    margin-top: 20px;
    padding: 8px 14px;
    border-radius: 4px;
    font-size:14px;
    font-weight:500;
    color:rgba(255,255,255,1);
    background-color: #2B2B2B;
    text-align: center;
    cursor: pointer;
    float: right;
  }
  &::after{
    display: block;
    content: '';
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
    font-size:14px;
    font-weight:400;
    color:rgba(178,178,178,1);
    margin-bottom: 10px;
  }
}

// 公用输入框
.widget-textarea {
  background: #F1F1F1;
  min-width: 275px;
  border-radius: 8px;
}

// 公用标题
.widget-title {
  font-size: 18px;
  font-weight:600;
  color:rgba(0,0,0,1);
  margin: 0 0 20px 0;
}
// 公用footer
.widget-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .help {
    font-size:14px;
    font-weight:500;
    color: @purpleDark;
    cursor: pointer;
  }
  .create {
    padding: 8px 14px;
    border-radius: 4px;
    font-size:14px;
    font-weight:500;
    color:rgba(255,255,255,1);
    background-color: #2B2B2B;
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
</style>

<style lang="less">
.p-share .el-dialog__header,
.p-share .el-dialog__body {
  padding: 0;
}
</style>
