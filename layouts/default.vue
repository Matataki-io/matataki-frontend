<template>
  <div class="app">
    <nuxt />
    <g-footer v-if="!hideFooter" />
    <back-to-top v-if="!hideBackTop" :visibility-height="300" :back-position="50" class="backtop" transition-name="fade">
      <svg-icon
        class="backtop-icon"
        icon-class="backtop"
      />
    </back-to-top>
    <feedback v-if="!hideFeedback" :showPosition="100" />
    <AuthModal v-model="loginModalShow" />
    <articleImport v-model="importModalShow" @importArticle="importArticle" />
  </div>
</template>

<script>
import footer from '~/components/footer/index.vue'
import AuthModal from '@/components/Auth/index.vue'
import BackToTop from '@/components/BackToTop'
import articleImport from '@/components/article_import/index.vue'
import feedback from '@/components/feedback'
export default {
  name: 'Default',
  components: {
    gFooter: footer,
    AuthModal,
    BackToTop,
    articleImport,
    feedback
  },
  data() {
    return {
      time: null
    }
  },
  computed: {
    loginModalShow: {
      get() {
        return this.$store.state.loginModalShow
      },
      set(v) {
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
    hideBackTop() {
      return this.$route.name === 'publish-type-id'
    },
    hideFooter() {
      // 发布页面 GitHub登录
      return this.$route.name === 'publish-type-id' || this.$route.name === 'login-github'
    },
    hideFeedback() {
      return this.$route.name === 'publish-type-id'
    }
  },
  created() {

  },
  mounted() {
    this.$store.dispatch('testLogin')
    this.removeOverflowHide()
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
          const dialog = document.querySelector('.el-dialog__wrapper')
          if (dialog) {
            if (dialog.style.display === 'none') bodyDom.style.overflow = 'auto'
          } else {
            bodyDom.style.overflow = 'auto'
          }
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.app .backtop {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: @purpleDark;
  cursor: pointer;
  z-index: 99;
  font-size: 18px;
  position: fixed;
  right: 40px;
  bottom: 186px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  // box-shadow: 0 4px 24px rgba(84, 45, 224, .5);
  &:hover {
    opacity: 0.9;
  }

  &-icon {
    color: #fff;
  }
}

</style>
