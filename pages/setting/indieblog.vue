<!--
页面作者: 柠喵 LemonNekoGH
对此页代码有疑问请钉柠喵或发送邮件至 chheese048@gmail.com
-->
<template>
  <userLayout>
    <template v-slot:main>
      <div>
        <h2 class="tag-title">
          {{ $t('indie-blog.page-title') }}
        </h2>
        <el-tooltip :content="$t('indie-blog.experimental-feature')">
          <svgIcon icon-class="experimental" />
        </el-tooltip>
      </div>
      <div v-if="loading" v-loading="true" class="list center">
        <span>{{ $t('indie-blog.status-loading') }}</span>
      </div>
      <div v-if="getStatusFailed" class="list center">
        <span v-if="siteCreated && getSettingsFailed">{{ $t('indie-blog.repository-deleted') }}</span>
        <span v-else>{{ $t('indie-blog.status-load-failed') }}</span>
        <div class="w-10px" />
        <el-button @click="getSiteStatus">
          {{ $t('indie-blog.retry') }}
        </el-button>
      </div>
      <div v-if="unavailable">
        <indie-blog-creation @refresh="getSiteStatus" />
      </div>

      <div v-if="allOK">
        <indie-blog-settings @refresh="getSiteStatus" />
      </div>
    </template>
    <template v-slot:nav>
      <myAccountNav />
    </template>
  </userLayout>
</template>
<script>
import userLayout from '@/components/user/user_layout'
import myAccountNav from '@/components/my_account/my_account_nav'
import svgIcon from '@/components/SvgIcon'
import indieBlogSettings from '@/components/indie-blog-settings'
import indieBlogCreation from '@/components/indie-blog-creation'

export default {
  components: {
    userLayout,
    myAccountNav,
    svgIcon,
    indieBlogSettings,
    indieBlogCreation
  },
  data() {
    return {
      loading: false,
      getStatusFailed: false,
      unavailable: false,
    }
  },
  computed: {
    allOK() {
      return this.loading === false
        && this.getStatusFailed === false
        && this.unavailable === false
    }
  },
  mounted() {
    this.getSiteStatus()
  },
  methods: {
    /**
     * 获取子站状态
     * 点击独立子站 getSiteStatus /user/siteStatus
     */
    async getSiteStatus() {
      this.resetStatus()
      try {
        const res = await this.$API.getIndieBlogSiteStatus()
        if (res) {
          const {code} = res
          if (code === 10021) {
            this.loading = false
            this.unavailable = true
          } else {
            this.loading = false
            this.siteCreated = true
          }
        } else {
          this.getStatusFailed = true
        }
      } catch (e) {
        console.log(e.message)
        this.loading = false
        this.getStatusFailed = true
      }
    },
    /** 重置状态，只在 getSiteStatus 中调用 */
    resetStatus() {
      this.loading = true
      this.unavailable = false
      this.getStatusFailed = false
    },
  }
}
</script>
<style lang="less" scoped src="./indieblog.less"></style>
