<template>
  <div class="app">
    <el-alert
      v-if="$nuxt.isOffline"
      title="您可能未连接到互联网, 请连接网络后重试~"
      type="error"
      effect="dark"
      style="z-index: 999;max-width: 340px;position: fixed;top: 20px;right: 20px;"
    />
    <g-header v-if="!hideHeader" />
    <nuxt class="app-container" />
    <!-- <lazy-component> -->
    <g-footer v-if="hideFooter" />
    <!-- </lazy-component> -->
    <back-to-top
      v-if="!hideBackTop"
      :visibility-height="300"
      :back-position="100"
      class="backtop"
      transition-name="fade"
    >
      <svg-icon
        class="backtop-icon"
        icon-class="back_top"
      />
    </back-to-top>
    <feedback v-if="!hideFeedback" :show-position="100" />
    <AuthModal v-model="loginModalShow" />
    <TransferDialog v-model="transferDialogShow" :user-data="transferUserData" />
    <articleImport
      v-model="importModalShow"
      @importArticle="importArticle"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AuthModal from '@/components/Auth/index.vue'
import BackToTop from '@/components/BackToTop'
import articleImport from '@/components/article_import/index.vue'
import feedback from '@/components/feedback'
import footer from '~/components/footer/index.vue'
import TransferDialog from '@/components/TransferDialog'

export default {
  name: 'Default',
  components: {
    gFooter: footer,
    AuthModal,
    BackToTop,
    articleImport,
    feedback,
    TransferDialog
  },
  data() {
    return {
      time: null
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    loginModalShow: {
      get() {
        return this.$store.state.loginModalShow
      },
      set(v) {
        if(v && this.isLogined) return

        this.$store.commit('setLoginModal', v)
      }
    },
    importModalShow: {
      get() {
        return this.$store.state.importArticle.importModalShow
      },
      set(v) {
        this.$store.commit('importArticle/setImportModal', v)
      }
    },
    // 转账 dialog show
    transferDialogShow: {
      get() {
        return this.$store.state.transferDialog.transferDialog
      },
      set(v) {
        this.$store.commit('transferDialog/setTransferDialog', v)
        if (!v) {
          this.$store.commit('transferDialog/setTransferUserData', Object.create(null))
        }
      }
    },
    // 转账 dialog user data
    transferUserData: {
      get() {
        return this.$store.state.transferDialog.transferUserData
      }
    },
    hideBackTop() {
      return this.$route.name === 'publish-type-id'
    },
    hideFooter() {
      const hide = ['publish-type-id', 'login-github', 'index']
      return !hide.includes(this.$route.name)
    },
    hideFeedback() {
      return this.$route.name === 'publish-type-id'
    },
    hideHeader() {
      return this.$route.name === 'home'
    }
  },
  mounted() {
    this.$store.dispatch('testLogin')
    if (process.browser) {
      this.removeOverflowHide()
      // this.testDomain()
    }
  },
  methods: {
    importArticle() {
    },
    removeOverflowHide() {
      // 这段代码也是无奈之举
      // 这里的代码, 如果没有找到为什么会设置 overflow hideen, 就删除了的话, 就等着加班吧 !!!
      clearInterval(this.time)
      this.time = setInterval(() => {
        const bodyDom = document.querySelector('body')
        if (bodyDom.style.overflow) {
          const dialog = document.querySelectorAll('.el-dialog__wrapper')
          let dialogStatus = false
          // 循环 所有元素有一个不是node 说明是展开的dialog
          for (let i = 0; i < dialog.length; i++) {
            if (dialog[i].style.display !== 'none') {
              dialogStatus = true
              break
            }
          }
          // 此时body hidden 否则 auto
          if (dialogStatus) {
            bodyDom.style.overflow = 'hidden'
          } else {
            bodyDom.style.overflow = 'auto'
          }
        }
      }, 1000)
    },
    // 检测域名
    testDomain() {
      try {
        // 开发模式不管
        if (process.env.NODE_ENV === 'development') return
        // 在微信里面不管
        if (this.$utils.isInWeixin()) return

        let IO = process.env.VUE_APP_DOMAIN_IO
        let isIo = this.$utils.isDomain(IO)
        if (!isIo) {
          this.$message(`请使用非微信浏览器访问 ${IO} 使用该功能`)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app {
  .backtop {
    width: 45px;
    height: 45px;
    cursor: pointer;
    z-index: 99;
    font-size: 14px;
    position: fixed;
    right: 40px;
    bottom: 200px;
    color: #B2B2B2;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.05);
    border-radius: 4px;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    &:hover {
      opacity: 0.9;
    }

    &-icon {
      color: #B2B2B2;
      font-size: 24px;
    }
  }
}

.app-container {
  padding-top: 60px;
  min-height: calc(100% - 240px);
  // footer 高度是不固定的 后面考虑调整
}

@media screen and (max-width: 768px) {
  .app {
    .backtop {
      width: 30px;
      height: 30px;
      right: 20px;
      bottom: 380px;
      &-icon {
        font-size: 16px;
      }
    }
  }
}

@media screen and (max-width: 540px) {
  .app-container {
    padding-top: 50px;
    min-height: calc(100% - 230px);
  }
}
</style>
