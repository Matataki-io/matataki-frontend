<template>
  <userLayout>
    <template v-slot:main>
      <h2 class="tag-title">
        {{ $t('indie-blog.title') }}
      </h2>
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
          <span>{{ $t('indie-blog.unavailable') }}</span>
        </div>
        <div v-if="errorMessage !== ''" class="list">
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="repoUsed" class="list">
          <span class="list-title">{{ $t('indie-blog.repo-name') }}</span>
          <el-input v-model="repoName" class="list-content" />
          <div class="w-10px" />
          <el-button :loading="creating" @click="modifyRepoNameAndContinue">
            {{ $t('indie-blog.save-and-refresh') }}
          </el-button>
        </div>
        <div v-if="showCreate" class="list center">
          <el-button :loading="creating" @click="createSite">
            {{ $t('indie-blog.create') }}
          </el-button>
        </div>
        <div v-if="showBind" class="list center">
          <a href="/setting/account">
            <el-button>
              {{ $t('indie-blog.go-to-bind-github') }}
            </el-button>
          </a>
        </div>
        <div v-if="allOK">
          <div class="list">
            <div class="list-title">
              子站设置
            </div>
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

export default {
  components: {
    userLayout,
    myAccountNav
  },
  data () {
    return {
      loading: false,
      getStatusFailed: false,
      unavailable: false,
      errorMessage: '',
      repoUsed: false,
      repoName: '',
      showCreate: false,
      showBind: false,
      creating: false
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
              this.getSiteStatus()
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
          console.log(code)
          if (code === 10021) {
            this.loading = false
            this.unavailable = true
            this.showCreate = true
            this.errorMessage = this.$t('indie-blog.not-created')
          } else if (code === 10019) {
            const isBindOnGitHub = await this.isBindOnGitHub()
            this.loading = false
            if (isBindOnGitHub === true) {
              this.unavailable = true
              this.showBind = true
              this.errorMessage = this.$t('indie-blog.should-rebind-github')
            } else if (isBindOnGitHub === undefined) {
              this.getStatusFailed = true
            } else {
              this.unavailable = true
              this.showBind = true
              this.errorMessage = this.$t('indie-blog.should-bind-github')
            }
          } else {
            this.loading = false
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
        this.$alert('一个好的 GitHub 仓库名称应当类似于 matataki-save', 'GitHub 仓库名称格式不正确', {
          confirmButtonText: '确定'
        })
        return
      }
      this.creating = true
      this.$API.modifyIndieBlogRepoName({ repo: this.repoName }).then((res) => {
        console.log(this.repoName)
        if (res) {
          if (res.code === 0) {
            this.createRepo()
          } else {
            this.$message(res.message)
          }
        } else {
          this.$message(this.$t('indie-blog.save-repo-name-failed'))
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    resetStatus() {
      this.loading = true
      this.unavailable = false
      this.getStatusFailed = false
      this.errorMessage = ''
      this.repoUsed = false
      this.showCreate = false
      this.showBind = false
    },
    createSite() {
      this.creating = true
      this.$API.getIndieBlogRepoStatus().then(res => {
        if (res) {
          const {code} = res
          this.creating = false
          if (code === undefined) {
            this.$message(this.$t('indie-blog.get-repo-status-failed'))
          } else {
            if (code === 10020) {
              this.repoUsed = true
              this.showCreate = false
              this.errorMessage = this.$t('indie-blog.repo-used-by-other')
            } else {
              this.createRepo()
            }
          }
        } else {
          this.$message(this.$t('indie-blog.get-repo-status-failed'))
        }
      }).catch(e => {
        console.log(e)
      })
    },
    async isBindOnGitHub() {
      try {
        const res = await this.$API.accountList()
        if (!res) {
          this.$message.error('服务器状态异常')
          return undefined
        }
        const data = res.data
        for (const account of data) {
          if (account.platform === 'github') {
            return true
          }
        }
        return false
      } catch (e) {
        this.$message.error('获取用户已绑定的平台失败')
        return undefined
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 10px;
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
