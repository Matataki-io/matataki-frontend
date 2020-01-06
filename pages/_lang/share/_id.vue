<template>
  <div @click.stop="offSlidebar = Date.now()" class="share">
    <g-header />
    <main class="container">
      <shareHeader />
      <shareMain />
    </main>
    <reference :offSlidebar="offSlidebar">
      <div slot="left">
        1231
      </div>
      <template slot="left-prompt">
        已引用<span>12</span>
      </template>

      <div slot="right">
        1231
      </div>
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
export default {
  components: {
    shareHeader,
    shareMain,
    shareFooter,
    reference
  },
  data() {
    return {
      offSlidebar: 0, // time components watch off slidebar
      showQuote: false, // reference
      nowTime: 0, // reference
      shareDialogVisible: false
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
  justify-content: space-between;
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
</style>
