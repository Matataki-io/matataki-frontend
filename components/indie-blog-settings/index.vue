<template>
  <div>
    <div v-if="loadingPagesStatus" v-loading="true" class="list center">
      {{ $t('indie-blog.deploy-status-loading') }}
    </div>
    <div v-else-if="siteAvailable" class="list">
      <div class="site-available">
        <span style="flex: 1">{{ siteBuilding ? $t('indie-blog.deploying') : $t('indie-blog.deployed') }}</span>
        <a class="site-link" :href="siteLink" target="_blank">{{ siteLink }}</a>
      </div>
      <el-button @click="isSiteLinkAvailable">
        <i class="el-icon-refresh" />
        {{ $t('indie-blog.refresh-status') }}
      </el-button>
    </div>
    <div v-else class="list">
      <span>{{ $t('indie-blog.not-deployed-part1') }}</span>
      <a
        v-if="repoName && githubUserName"
        class="link"
        :href="`https://github.com/${githubUserName}/${repoName}/settings/pages`"
        target="_blank"
      >{{ $t('indie-blog.not-deployed-part2') }}</a>
      <span v-else>{{ $t('indie-blog.not-deployed-part2') }}</span>
      <span style="flex: 1">{{ $t('indie-blog.not-deployed-part3') }}</span>
      <el-button @click="isSiteLinkAvailable">
        <i class="el-icon-refresh" />
        {{ $t('indie-blog.refresh-status') }}
      </el-button>
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.title') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.titleHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-input
        v-model="settings.title"
        class="list-content"
      />
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.subtitle') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.subtitleHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-input
        v-model="settings.subtitle"
        class="list-content"
      />
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.description') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.descriptionHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-input
        v-model="settings.description"
        class="list-content"
      />
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.keywords') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.keywordsHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-input
        v-model="settings.keywords"
        class="list-content"
      />
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.author') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.authorHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-input
        v-model="settings.author"
        class="list-content"
      />
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.language') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.languageHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-select v-model="settings.language" class="list-content">
        <el-option
          v-for="(language, index) in languages"
          :key="index"
          :value="language"
          :label="$t('languages.' + language)"
        >
          <span style="float: left">{{ $t('languages.' + language) }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ language }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.timezone') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.timezoneHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-select
        v-model="settings.timezone"
        class="list-content"
      >
        <el-option
          v-for="(timezone, index) in timezones"
          :key="index"
          :label="timezone.name"
          :value="timezone.value"
        />
      </el-select>
    </div>
    <div class="list">
      <span class="list-title">{{ $t('indie-blog.theme') }}
        <el-tooltip
          class="max-width-80"
          effect="dark"
          :content="$t('indie-blog.themeHelp')"
          placement="top-start"
        >
          <svg-icon class="help-icon" icon-class="help" />
        </el-tooltip>
      </span>
      <el-select
        v-model="settings.theme"
        class="list-content"
      >
        <el-option
          v-for="(theme, index) in themeList"
          :key="index"
          :label="theme"
          :value="theme"
        />
      </el-select>
    </div>
    <div class="list">
      <div class="list-title" />
      <div class="list-content set-captcha">
        <vue-hcaptcha
          v-if="doINeedHCaptcha"
          ref="hCaptcha"
          :sitekey="hCaptchaSiteKey"
          :language="appLang"
          @verify="onCaptchaVerify"
          @expired="onExpire"
          @error="onError"
          @reset="onCaptchaReset"
        />
      </div>
    </div>

    <div class="list">
      <div class="list-title" />
      <div class="list-content">
        <el-button :loading="saving" :disabled="!isCaptchaOK" @click="validateSettings">
          {{ $t('indie-blog.save') }}
        </el-button>
        <el-button>
          <a href="https://www.matataki.io/p/8864">
            {{ $t('indie-blog.config-guide') }}
            <i class="el-icon-position" />
          </a>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import lodash from 'lodash'
import { getCookie } from '@/utils/cookie'
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'

export default Vue.extend({
  components: {
    VueHcaptcha,
  },
  data() {
    return {
      timezones: [
        {name: this.$t('indie-blog.auto-detect'), value: ''},
        {name: 'UTC-14', value: 'Etc/GMT-14'},
        {name: 'UTC-13', value: 'Etc/GMT-13'},
        {name: 'UTC-11', value: 'Etc/GMT-11'},
        {name: 'UTC-10', value: 'Etc/GMT-10'},
        {name: 'UTC-9', value: 'Etc/GMT-9'},
        {name: 'UTC-8', value: 'Etc/GMT-8'},
        {name: 'UTC-7', value: 'Etc/GMT-7'},
        {name: 'UTC-6', value: 'Etc/GMT-6'},
        {name: 'UTC-5', value: 'Etc/GMT-5'},
        {name: 'UTC-4', value: 'Etc/GMT-4'},
        {name: 'UTC-4', value: 'Etc/GMT-3'},
        {name: 'UTC-2', value: 'Etc/GMT-2'},
        {name: 'UTC-1', value: 'Etc/GMT-1'},
        {name: 'UTC', value: 'Etc/GMT'},
        {name: 'UTC+1', value: 'Etc/GMT+1'},
        {name: 'UTC+2', value: 'Etc/GMT+2'},
        {name: 'UTC+3', value: 'Etc/GMT+3'},
        {name: 'UTC+4', value: 'Etc/GMT+4'},
        {name: 'UTC+5', value: 'Etc/GMT+5'},
        {name: 'UTC+6', value: 'Etc/GMT+6'},
        {name: 'UTC+7', value: 'Etc/GMT+7'},
        {name: 'UTC+8', value: 'Etc/GMT+8'},
        {name: 'UTC+9', value: 'Etc/GMT+9'},
        {name: 'UTC+10', value: 'Etc/GMT+10'},
        {name: 'UTC+11', value: 'Etc/GMT+11'},
        {name: 'UTC+12', value: 'Etc/GMT+12'}
      ],
      settings: {},
      oldSettings: {},
      languages: ['en', 'zh', 'zh-TW', 'zh-HK', 'ja', 'fr', 'es'],
      themeList: [],
      saving: false,
      loadingPagesStatus: false,
      siteBuilding: false,
      siteAvailable: false,
      doINeedHCaptcha: true,
      siteLink: '',
      repoName: '',
      githubUserName: '',
      hCaptchaData: {
        expired: false,
        token: null,
        eKey: null,
        error: null,
      },
    }
  },
  computed: {
    hCaptchaSiteKey() {
      return process.env.VUE_APP_HCAPTCHA_SITE_KEY
    },
    isCaptchaOK() {
      // 如果是白名单，则为 true
      if (!this.doINeedHCaptcha) return true
      return (!this.hCaptchaData.expired) && Boolean(this.hCaptchaData.token)
    },
    appLang() {
      return getCookie('language')
    },
  },
  mounted() {
    this.getSettingsItem()
    this.getThemeList()
    this.getRepoName()
    this.getGithubId()
    this.isSiteLinkAvailable()
    this.$API.doINeedHCaptcha().then((_doINeedHCaptcha) => {
      this.doINeedHCaptcha = _doINeedHCaptcha
    })
  },
  methods: {
    /** 获取设置项目 */
    getSettingsItem() {
      this.$API.getIndieBlogSiteConfig().then((res) => {
        this.loading = false
        if (res) {
          if (res.code === 0) {
            this.settings = {...res.data}
            this.oldSettings = {...res.data}
            this.settings.siteLink = undefined
            this.oldSettings.siteLink = undefined
          } else {
            this.getSettingsFailed = true
            this.getStatusFailed = true
          }
        } else {
          this.getStatusFailed = true
          this.$message.error('服务器返回的数据有点问题')
        }
      }).catch(e => {
        console.log(e.message)
        this.loading = false
        this.getStatusFailed = true
        this.$message.error('网络问题')
      })
    },
    /** 修改设置之前进行校验 */
    validateSettings() {
      if (lodash.isEqual(this.settings, this.oldSettings)) {
        this.$message.info(this.$t('indie-blog.no-items-modified'))
        return
      }

      const themeModified = this.settings.theme !== this.oldSettings.theme
      const timezoneModified = this.settings.timezone !== this.oldSettings.timezone
      if (!timezoneModified && !themeModified) {
        this.saveSettings()
        return
      }
      let alertMessage = '<div style="margin-left: 20px"><ol>'
      if (themeModified) {
        alertMessage += `<li style="list-style: decimal">${this.$t('indie-blog.theme-modified')}</li>`
      }
      if (timezoneModified) {
        alertMessage += `<li style="list-style: decimal">${this.$t('indie-blog.timezone-modified')}</li>`
      }
      alertMessage += '</ol></div>' + this.$t('indie-blog.is-continue')
      // 警告用户是否进行修改
      this.$alert(alertMessage, this.$t('indie-blog.two-step-confirm'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('indie-blog.ok'),
        cancelButtonText: this.$t('indie-blog.cancel'),
        showCancelButton: true,
        callback: (action) => {
          if (action === 'confirm') {
            this.saveSettings()
          }
        }
      })
    },
    /** 保存设置 POST /user/siteConfig */
    saveSettings() {
      this.saving = true
      this.$API.changeIndieBlogSiteConfig(this.settings).then((res) => {
        this.saving = false
        if (!res) {
          this.$message.error('保存设置失败')
        } else {
          if (res.code === 0) {
            this.$message.success('保存设置成功')
            this.$emit('refresh')
          } else {
            this.$message.error('保存设置失败')
          }
        }
      }).catch((e) => {
        this.saving = false
        console.log(e.message)
        this.$message.error('保存设置失败')
      })
    },
    /** 获取所有可用主题列表 */
    getThemeList() {
      this.$API.getIndieBlogThemes().then((res) => {
        if (res && res.code === 0) {
          this.themeList = res.data
        } else {
          this.$message.error('服务器返回的数据有问题')
        }
      }).catch((e) => {
        this.$message.error('获取主题列表失败')
        console.log(e.message)
      })
    },
    /** 检查独立子站的部署状态 */
    async isSiteLinkAvailable() {
      try {
        this.loadingPagesStatus = true
        const res = await this.$API.getIndieBlogPagesStatus()
        this.loadingPagesStatus = false
        if (!res || res.code !== 0 || res.data.status !== 'built') {
          this.siteAvailable = false
          if (res.data.status === 'building') {
            this.siteAvailable = true
            this.siteBuilding = true
          }
        } else {
          this.siteLink = res.data.url
          this.siteAvailable = true
          if (res.data.status === 'building') {
            this.siteBuilding = true
          }
        }
      } catch (e) {
        this.loadingPagesStatus = false
        this.siteAvailable = false
      }
    },
    /** 获取仓库名称 */
    async getRepoName() {
      try {
        const res = await this.$API.getIndieBlogRepoStatus()
        if (!res) this.repoName = ''
        this.repoName = res.data.articleRepo
      } catch (e) {
        console.log(e)
        this.repoName = ''
      }
    },
    /** 获取用户 GitHub ID */
    async getGithubId() {
      try {
        const res = await this.$API.accountList()
        if (!res) this.githubUserName = ''
        const list = res.data
        const github = list.find(it => it.platform === 'github')
        if (github) {
          this.githubUserName = github.account
        }
        this.githubUserName =''
      } catch (e) {
        console.log(e)
        this.githubUserName = ''
      }
    },
    /** Captcha 验证相关 */
    onCaptchaVerify(token, eKey) {
      this.hCaptchaData = { token, eKey, expired: false }
    },
    onExpire() {
      this.hCaptchaData = { token: null, eKey: null, expired: true }
    },
    onError(err) {
      this.hCaptchaData = { token: null, eKey: null, expired: true }
      console.error('captcha error: ', err)
    },
    // 当hCaptcha状态重置时，重置hCaptchaData对象的值
    onCaptchaReset() {
      this.hCaptchaData = {
        expired: false,
        token: null,
        eKey: null,
        error: null,
      }
    },
  }
})
</script>
<style lang="less" scoped src="../../pages/setting/indieblog.less"/>
