<template>
  <div @click.stop="offSlidebar = Date.now()" class="share">
    <g-header />
    <main class="container">
      <shareHeader />
      <shareMain />
    </main>
    <reference :offSlidebar="offSlidebar" :open="true">
      <template slot="left">
        <div class="reference-header">
          <span class="reference-header__title">
            已引用<span>34</span>
          </span>

          <span class="reference-header__sort">
            正序
            <svg-icon icon-class="sort" />
          </span>
        </div>
      </template>
      <template slot="left-prompt">
        已引用<span>12</span>
      </template>

      <template slot="right">
        <div class="reference-header">
          <span class="reference-header__title">
            被引用<span>34</span>
          </span>

          <span class="reference-header__sort">
            倒序
            <svg-icon icon-class="sort" />
          </span>
        </div>
      </template>
      <template slot="right-prompt">
        被引用<span>0</span>
      </template>
    </reference>
    <!-- <quote :show="showQuote" :nowTime="nowTime" @showQuote="status => showQuote = status" @getArticle="getArticle" /> -->
    <m-dialog v-model="shareDialogVisible" width="400px">
      <!-- 如果内容过多可以抽离 -->
      <div class="dialog-content">
        <div class="dialog-content__btn">
          <div @click="copy('http://localhost:8080/share/101167?c=0f2a3ed6')" class="btn-icon">
            <svg-icon icon-class="copy3" />
          </div>
          <p class="btn-text">
            复制邀请链接
          </p>
        </div>
      </div>
      <socialShare class="social-share" img="https://ssimg.frontenduse.top/banner/2019/12/16/4d79938b44c12f1ac12bb60faf04bed5.gif" title="title" />
      <wechat :link="link" style="margin: 60px 0 0 0;" />
    </m-dialog>
    <shareFooter @share="shareDialogVisible = true" class="footer" />
  </div>
</template>

<script>
import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'
import shareFooter from '@/components/share_page/share_footer'
// import quote from '@/components/share_page/quote'
import reference from '@/components/reference/index'
import socialShare from '@/components/modal/social_share'
import wechat from '@/components/scan/wechat.vue'

export default {
  components: {
    shareHeader,
    shareMain,
    shareFooter,
    reference,
    socialShare,
    wechat
  },
  data() {
    return {
      offSlidebar: 0, // time components watch off slidebar
      showQuote: false, // reference
      nowTime: 0, // reference
      shareDialogVisible: false
    }
  },
  computed: {
    link() {
      if (process.browser) return window.location.href
      else return process.env.VUE_APP_URL
    }
  },
  methods: {
    getArticle(id, popEvent) {
      console.log(id, popEvent)
    },
    copy(val) {
      this.$copyText(val).then(
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
      )
    }
  }
}
</script>

<style lang="less" scoped>
.share {
  .minHeight();
}
@width: 600px;
.container {
  width: @width;
  margin: 20px auto 0;
  background-color: #fff;
  border-radius:10px;
  padding: 0 0 20px 0;
}
.footer {
  width: @width;
  margin: 40px auto 100px;
}

.dialog-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .btn-icon {
    width: 60px;
    height: 60px;
    // background: #f9f9f9;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    cursor: pointer;
  }
  .btn-text {
    font-size: 12px;
    color: #333;
    text-align: center;
    margin: 4px 0 0 0;
  }
}

.social-share {
  margin-top: 10px;
}

.reference-header {
  margin-top: 20px;
  &__title {
    font-size:24px;
    font-weight:bold;
    color:rgba(0,0,0,1);
    line-height:33px;
    span {
      color: @purpleDark;
      margin-left: 6px;
    }
  }

  &__sort {
    margin-left: 20px;
    color: @purpleDark;
    font-size:16px;
    line-height:22px;
  }
}
</style>
