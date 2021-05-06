<!--
页面作者: 柠喵
对此页代码有疑问请钉柠喵或发送邮件至 chheese048@gmail.com
-->
<template>
  <userLayout>
    <template v-slot:main>
      <div>
        <h2 class="tag-title">
          {{ $t('indie-blog.page-tile') }}
        </h2>
        <el-tooltip :content="$t('indie-blog.experimental-feature')">
          <svgIcon icon-class="experimental" />
        </el-tooltip>
      </div>
      <div v-if="allOK">
        <div v-if="siteAvailable" class="list">
          <div>
            {{ $t('indie-blog.deployed') }} <div class="w-10px" /><a :href="'http://' + siteLink" target="_blank">http://{{ siteLink }}</a>
          </div>
        </div>
        <!-- TODO:当后端可用时解除注释-->
        <!--        <div v-else class="list">-->
        <!--          NOT AVAILABLE-->
        <!--        </div>-->
      </div>
      <div v-if="loading" v-loading="true" class="list center">
        <span>{{ $t('indie-blog.status-loading') }}</span>
      </div>
      <div v-if="getStatusFailed" class="list center">
        <span>{{ $t('indie-blog.status-load-failed') }}</span>
        <div class="w-10px" />
        <el-button @click="getSiteStatus">
          {{ $t('indie-blog.retry') }}
        </el-button>
      </div>
      <div>
        <div v-if="unavailable" class="list">
          <span>{{ activeStep === 2 ? $t('indie-blog.you-are-done') : $t('indie-blog.follow-this-steps-to-create-indie-blog') }}</span>
        </div>
        <el-steps
          v-if="unavailable"
          align-center
          class="list"
          :active="activeStep"
          finish-status="success"
        >
          <el-step
            v-for="(step, index) in steps"
            :key="index"
            :description="$t(step)"
            :title="stepStatus(index, activeStep)"
          />
        </el-steps>
        <div v-if="activeStep === 0" class="list center">
          <a href="/setting/account">
            <el-button>
              {{ $t('indie-blog.go-to-bind-github') }}
            </el-button>
          </a>
        </div>
        <div v-else-if="activeStep === 1" class="list">
          <span class="list-title">{{ $t('indie-blog.repo-name') }}</span>
          <el-input
            v-model="repoName"
            class="list-content"
            :disabled="repoInputDisabled"
            :prefix-icon="repoInputDisabled ? 'el-icon-loading' : ''"
          />
          <div class="w-10px" />
          <el-button :loading="creating" @click="modifyRepoNameAndContinue">
            {{ $t('indie-blog.save-and-refresh') }}
          </el-button>
        </div>
        <div v-else-if="activeStep === 2" class="list center">
          <el-button @click="getSiteStatus">
            {{ $t('indie-blog.go-settings') }}
          </el-button>
        </div>
        <div v-if="allOK && settings">
          <div class="list">
            <span class="list-title">{{ $t('indie-blog.title') }}</span>
            <el-input
              v-model="settings.title"
              class="list-content"
            />
          </div>
          <div class="list">
            <span class="list-title">{{ $t('indie-blog.subtitle') }}</span>
            <el-input
              v-model="settings.subtitle"
              class="list-content"
            />
          </div>
          <div class="list">
            <span class="list-title">{{ $t('indie-blog.description') }}</span>
            <el-input
              v-model="settings.description"
              class="list-content"
            />
          </div>
          <div class="list">
            <span class="list-title">{{ $t('indie-blog.keywords') }}</span>
            <el-input
              v-model="settings.keywords"
              class="list-content"
            />
          </div>
          <div class="list">
            <span class="list-title">{{ $t('indie-blog.author') }}</span>
            <el-input
              v-model="settings.author"
              class="list-content"
            />
          </div>
          <div class="list">
            <span class="list-title">{{ $t('indie-blog.language') }}</span>
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
            <span class="list-title">{{ $t('indie-blog.timezone') }}</span>
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
            <span class="list-title">{{ $t('indie-blog.theme') }}</span>
            <el-input
              v-model="settings.theme"
              class="list-content"
            />
          </div>
          <div class="list center">
            <el-button :loading="saving" @click="validateSettings">
              {{ $t('indie-blog.save') }}
            </el-button>
          </div>
        </div>
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

export default {
  components: {
    userLayout,
    myAccountNav,
    svgIcon
  },
  data () {
    return {
      loading: false,
      getStatusFailed: false,
      unavailable: false,
      repoUsed: false,
      repoName: '',
      showBind: false,
      creating: false,
      settings: {},
      steps: [
        'indie-blog.bind-github-account',
        'indie-blog.create-repo-for-indie-blog',
        'indie-blog.complete'
      ],
      activeStep: -1,
      repoInputDisabled: true,
      oldSettings: {},
      siteLink: '',
      saving: false,
      languages: ['en','zh','zh-TW', 'zh-HK','ja','fr','es'],
      timezones: [
        { name: 'UTC-14', value: 'Etc/GMT-14'},
        { name: 'UTC-13', value: 'Etc/GMT-13'},
        { name: 'UTC-11', value: 'Etc/GMT-11'},
        { name: 'UTC-10', value: 'Etc/GMT-10'},
        { name: 'UTC-9', value: 'Etc/GMT-9'},
        { name: 'UTC-8', value: 'Etc/GMT-8'},
        { name: 'UTC-7', value: 'Etc/GMT-7'},
        { name: 'UTC-6', value: 'Etc/GMT-6'},
        { name: 'UTC-5', value: 'Etc/GMT-5'},
        { name: 'UTC-4', value: 'Etc/GMT-4'},
        { name: 'UTC-4', value: 'Etc/GMT-3'},
        { name: 'UTC-2', value: 'Etc/GMT-2'},
        { name: 'UTC-1', value: 'Etc/GMT-1'},
        { name: 'UTC', value: 'Etc/GMT'},
        { name: 'UTC+1', value: 'Etc/GMT+1'},
        { name: 'UTC+2', value: 'Etc/GMT+2'},
        { name: 'UTC+3', value: 'Etc/GMT+3'},
        { name: 'UTC+4', value: 'Etc/GMT+4'},
        { name: 'UTC+5', value: 'Etc/GMT+5'},
        { name: 'UTC+6', value: 'Etc/GMT+6'},
        { name: 'UTC+7', value: 'Etc/GMT+7'},
        { name: 'UTC+8', value: 'Etc/GMT+8'},
        { name: 'UTC+9', value: 'Etc/GMT+9'},
        { name: 'UTC+10', value: 'Etc/GMT+10'},
        { name: 'UTC+11', value: 'Etc/GMT+11'},
        { name: 'UTC+12', value: 'Etc/GMT+12'}
      ],
      siteAvailable: false
    }
  },
  computed: {
    allOK() {
      return this.loading === false
      && this.getStatusFailed === false
        && this.unavailable === false
    }
  },
  watch: {
    siteLink(val) {
      if (!val) return
      // TODO:后端可用时解除注释
      // this.isSiteLinkAvailable()
    }
  },
  mounted() {
    this.getSiteStatus()
  },
  methods: {
    createRepo() {
      this.$API.createIndieBlogRepo().then((res) => {
        if (res) {
          const {code} = res
          if (code === undefined) {
            this.$message('服务器返回数据有问题')
          } else {
            this.creating = false
            if (code === 1) {
              this.$message.error('创建子站失败')
            } else {
              this.$message.success('创建子站成功')
              this.activeStep = 2
            }
          }
        } else {
          this.$message.error('服务器返回数据有问题')
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    /**
     * 点击独立子站 getSiteStatus /user/siteStatus
     * 如果已经创建独立子站 直接显示子站设置
     * 如果没有 显示一个按钮让他创建子站，点击完按钮之后刷新状态
     */
    async getSiteStatus () {
      this.resetStatus()
      try {
        const res = await this.$API.getIndieBlogSiteStatus()
        if (res) {
          const {code} = res
          if (code === 10021) {
            this.loading = false
            this.unavailable = true
            this.activeStep = 1
            this.getRepoName()
          } else if (code === 10019) {
            await this.isBindOnGitHub()
          } else {
            this.getSettingsItem()
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
    modifyRepoNameAndContinue() {
      const repo = /^([a-zA-Z0-9]+-?\.?)+$/
      if (!this.repoName.match(repo)) {
        this.$alert(this.$t('indie-blog.repo-name-rule'), this.$t('indie-blog.repo-name-format-error'), {
          confirmButtonText: this.$t('indie-blog.ok')
        })
        return
      }
      this.creating = true
      this.$API.modifyIndieBlogRepoName({ repo: this.repoName }).then((res) => {
        if (res) {
          if (res.code === 0) {
            this.createRepo()
          } else {
            this.creating = false
            this.$alert(this.$t('indie-blog.repo-exists', { name: this.repoName }), this.$t('indie-blog.save-repo-name-failed'),{
              confirmButtonText: this.$t('indie-blog.ok')
            })
          }
        } else {
          this.$message.error(this.$t('indie-blog.save-repo-name-failed'))
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    getSettingsItem() {
      this.$API.getIndieBlogSiteConfig().then((res) => {
        this.loading = false
        if (res) {
          if (res.code === 0) {
            this.settings = {...res.data}
            this.oldSettings = {...res.data}
            this.settings.siteLink = undefined
            this.oldSettings.siteLink = undefined
            this.siteLink = res.data.siteLink
          } else {
            this.getStatusFailed = true
            this.$message.error('服务器返回的数据有点问题')
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
    getRepoName() {
      this.$API.getIndieBlogRepoStatus().then(res => {
        if (!res) {
          return
        }
        this.repoName = res.data.articleRepo
        this.repoInputDisabled = false
      }).catch(e => {
        console.log(e)
      })
    },
    resetStatus() {
      this.loading = true
      this.unavailable = false
      this.getStatusFailed = false
      this.repoUsed = false
      this.showBind = false
      this.activeStep = -1
      this.repoInputDisabled = true
      this.saving = false
    },
    async isBindOnGitHub() {
      try {
        const res = await this.$API.accountList()
        this.loading = false
        if (!res) {
          this.$message.error('服务器状态异常')
          this.getStatusFailed = true
        }
        const data = res.data
        let isBind = false
        for (const account of data) {
          if (account.platform === 'github') {
            isBind =  true
            break
          }
        }
        if (isBind) {
          this.unavailable = true
          this.activeStep = 0
        } else {
          this.unavailable = true
          this.activeStep = 0
        }
      } catch (e) {
        this.$message.error('获取用户已绑定的平台失败')
        this.getStatusFailed = true
      }
    },
    validateSettings() {
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
    /**
     * 保存设置 POST /user/siteConfig
     */
    saveSettings() {
      this.saving = true
      this.$API.changeIndieBlogSiteConfig(this.settings).then((res) => {
        this.saving = false
        if (!res) {
          this.$message.error('保存设置失败')
        } else {
          if (res.code === 0) {
            this.$message.success('保存设置成功')
            this.getSiteStatus()
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
    stepStatus(index, activeStep) {
      if (index < activeStep) {
        return this.$t('indie-blog.done')
      } else if (index === activeStep) {
        return this.$t('indie-blog.processing')
      } else {
        return this.$t('indie-blog.step') + (index + 1)
      }
    },
    /** 检测独立子站是否已经成功部署 */
    // TODO:后端可用时解除注释
    // async isSiteLinkAvailable() {
    //   let siteLink = this.siteLink
    //   if (!siteLink.startsWith('http://')) {
    //     siteLink = 'http://' + siteLink
    //   }
    //   try {
    //     const request = http.request(siteLink)
    //     request.method = 'GET'
    //     request.on('response', res => {
    //       this.siteAvailable = res.statusCode !== 404
    //       console.log(res)
    //     })
    //     request.end()
    //   } catch (e) {
    //     this.siteAvailable = false
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 10px;
  display: inline;
}

.list {
  margin: 20px 0 0 0;
  display: flex;

  .list-content {
    flex: 8;
  }

  .list-title {
    flex: 2;
    align-self: center;
  }
}

.title {
  font-size: 16px;
  font-weight: 400;
  color: #333;
  line-height: 28px;
  margin-right: 20px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.w-10px {
  width: 10px;
}
</style>
