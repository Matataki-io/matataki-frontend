<template>
  <div>
    <div class="no-create-title">
      {{
        activeStep === 3
          ? $t("indie-blog.you-are-done")
          : $t("indie-blog.follow-this-steps-to-create-indie-blog")
      }}
    </div>
    <el-steps align-center :active="activeStep" finish-status="success">
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
          {{ $t("indie-blog.go-to-bind-github") }}
        </el-button>
      </a>
    </div>
    <div v-else-if="activeStep === 1" class="list">
      <span class="list-title">{{ $t("indie-blog.repo-name") }}</span>
      <el-input
        v-model="repoName"
        class="list-content"
        :disabled="repoInputDisabled || saving"
        :prefix-icon="repoInputDisabled ? 'el-icon-loading' : ''"
      />
      <div class="w-10px" />
      <el-button
        :disabled="repoInputDisabled || saving"
        :loading="saving"
        @click="modifyRepoNameAndContinue"
      >
        {{ $t("indie-blog.save-and-refresh") }}
      </el-button>
    </div>
    <div v-else-if="activeStep === 2">
      <div class="list center">
        <div class="set-captcha">
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
      <div class="list center">
        <el-button
          :disabled="!isCaptchaOK"
          :loading="creating"
          @click="createRepo"
        >
          {{ $t("indie-blog.complete") }}
        </el-button>
      </div>
    </div>
    <div v-else-if="activeStep === 3" class="list center">
      <el-button @click="$emit('refresh')">
        {{ $t("indie-blog.go-settings") }}
      </el-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import { getCookie } from '@/utils/cookie'

export default Vue.extend({
  components: {
    VueHcaptcha,
  },
  data() {
    return {
      steps: [
        'indie-blog.bind-github-account',
        'indie-blog.create-repo-for-indie-blog',
        'indie-blog.complete',
        'indie-blog.begin-setting',
      ],
      activeStep: -1,
      repoInputDisabled: true,
      repoName: '',
      saving: false,
      creating: false,
      doINeedHCaptcha: false,
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
      // if (!this.doINeedHCaptcha) return true
      // return (!this.hCaptchaData.expired) && Boolean(this.hCaptchaData.token)

      return true
    },
    appLang() {
      return getCookie('language')
    },
  },
  mounted() {
    this.isBindOnGitHub()
    // this.$API.doINeedHCaptcha().then((_doINeedHCaptcha) => {
    //   this.doINeedHCaptcha = _doINeedHCaptcha;
    // });
  },
  methods: {
    /**
     * 返回步骤标题
     * 完成：正在进行的步骤索引大于当前步骤
     * 进行中：正在进行的步骤就是当前步骤
     * 步骤<索引>：正在进行的步骤小于当前步骤
     */
    stepStatus(index, activeStep) {
      if (index < activeStep) {
        return this.$t('indie-blog.done')
      } else if (index === activeStep) {
        return this.$t('indie-blog.processing')
      } else {
        return this.$t('indie-blog.step') + (index + 1)
      }
    },
    /** 第二步：修改仓库名并继续 */
    modifyRepoNameAndContinue() {
      const repo = /^([a-zA-Z0-9]+-?\.?)+$/
      if (!this.repoName.match(repo)) {
        this.$alert(
          this.$t('indie-blog.repo-name-rule'),
          this.$t('indie-blog.repo-name-format-error'),
          {
            confirmButtonText: this.$t('indie-blog.ok'),
          }
        )
        return
      }
      this.saving = true
      this.$API
        .modifyIndieBlogRepoName({ repo: this.repoName })
        .then((res) => {
          if (res) {
            if (res.code === 0) {
              this.activeStep = 2
            } else {
              this.$alert(
                this.$t('indie-blog.repo-exists', { name: this.repoName }),
                this.$t('indie-blog.save-repo-name-failed'),
                {
                  confirmButtonText: this.$t('indie-blog.ok'),
                }
              )
            }
          } else {
            this.$message.error(this.$t('indie-blog.save-repo-name-failed'))
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.saving = false
        })
    },
    /**
     * 创建仓库，并当完成时进行初始化
     */
    async createRepo() {
      try {
        this.creating = true
        let res = await this.$API.createIndieBlogRepo(this.hCaptchaData)
        let repoCreated = false
        if (res) {
          const { code } = res
          if (code === undefined) {
            this.$message('服务器返回数据有问题')
          } else {
            this.creating = false
            if (code === 1) {
              this.$message.error('创建子站仓库失败')
            } else {
              repoCreated = true
            }
          }
        } else {
          this.$message.error('服务器返回数据有问题')
        }
        if (repoCreated) {
          res = await this.$API.initialIndieBlogRepo()
          if (res) {
            const { code } = res
            if (code === undefined) {
              this.$message('服务器返回数据有问题')
            } else {
              this.creating = false
              if (code === 1) {
                this.$message.error('初始化子站仓库失败')
              } else {
                this.activeStep = 3
              }
            }
          } else {
            this.$message.error('服务器返回数据有问题')
          }
        }
      } catch (e) {
        this.$message.error('服务器返回数据有问题')
      } finally {
        this.creating = false
      }
    },
    /** 查询用户是否已经绑定 GitHub */
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
            isBind = true
            break
          }
        }
        if (isBind) {
          this.activeStep = 1
          await this.getRepoName()
        } else {
          this.activeStep = 0
        }
      } catch (e) {
        this.$message.error('获取用户已绑定的平台失败')
        this.getStatusFailed = true
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
        return ''
      } finally {
        this.repoInputDisabled = false
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
  },
})
</script>
<style lang="less" scoped src="../../pages/setting/indieblog.less" />
