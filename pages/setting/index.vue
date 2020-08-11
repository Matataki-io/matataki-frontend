<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        {{ $t('user.userInformation') }}
      </h2>
      <div class="set-main">
        <div class="item list center">
          <span class="item-label title">{{ $t('avatar') }}</span>
          <img-upload
            :img-upload-done="imgUploadDone"
            :update-type="'avatar'"
            class="avatar"
            @doneImageUpload="doneImageUpload"
          >
            <div
              slot="uploadButton"
              class="user-avatar"
            >
              <div class="edit">
                <i class="el-icon-camera" />
                {{ $t('avatar') }}
              </div>
              <img
                v-if="avatar"
                slot="description"
                :src="avatar"
                alt="avatar"
              >
            </div>
          </img-upload>
        </div>
        <div class="item list center">
          <span class="item-label title">
            {{ $t('nickname') }}
          </span>
          <div class="input">
            <el-input
              v-model="username"
              :placeholder="$t('rule.username')"
              maxlength="50"
              show-word-limit
              clearable
            />
          </div>
        </div>
        <!-- <div class="list center">
          <span class="title"> {{ $t('email') }}</span>
          <div class="input">
            <el-input
              v-model="email"
              :placeholder="$t('rule.loginEmailMessage')"
              show-word-limit
              clearable
            />
          </div>
        </div> -->
        <div class="item list">
          <span class="item-label title">{{ $t('profile') }}</span>
          <div class="input">
            <el-input
              v-model="introduction"
              :rows="4"
              :placeholder="$t('rule.content')"
              type="textarea"
              maxlength="200"
              show-word-limit
            />
          </div>
        </div>
        <!-- 相关网站 -->
        <div class="item social-div">
          <span class="item-label title">
            {{ $t('social.relatedWebsites') }}
          </span>
          <div>
            <div
              v-for="(item, index) in about"
              :key="index"
              class="fl ac about-input social-list"
            >
              <el-input
                v-model="about[index].name"
                class="input web-name"
                placeholder="网站名称"
                :maxlength="20"
              />
              <el-input
                v-model="about[index].url"
                class="input"
                :placeholder="$t('social.fillLink')"
                :maxlength="255"
              />
              <div
                v-if="about.length > 1"
                class="about-input-btn less"
                @click="abountLess(index)"
              >
                <i class="el-icon-minus" />
              </div>
            </div>
            <div
              v-if="about.length < 5"
              class="about-input-btn add"
              @click="aboutAdd"
            >
              <i class="el-icon-plus" />
            </div>
          </div>
        </div>
        <!-- 社交账号 -->
        <div class="item social-div">
          <span class="item-label title right0">
            {{ $t('social.socialAccount') }}
          </span>
          <div>
            <span class="title-note">
              {{ $t('social.forInformationOnly') }}
            </span>
            <div
              v-for="(item, index) in social"
              :key="index"
              class="social-list"
            >
              <p class="social-title">
                {{ item.name }}
                <span v-html="item.tooltip" />
              </p>
              <div class="fl">
                <div class="social-icons">
                  <socialIcon :icon="item.symbol" />
                </div>
                <el-input
                  v-model="item.value"
                  :placeholder="item.placeholder"
                  class="social-input"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 保存 -->
        <el-button
          :loading="loading"
          :class="(setProfile || aboutModify || socialModify) && 'active'"
          class="save "
          @click="save"
        >
          {{ $t('save') }}
        </el-button>
      </div>
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import socialIcon from '@/components/social_icon/index.vue'

import imgUpload from '@/components/imgUpload/index.vue'

export default {
  components: {
    userLayout,
    imgUpload,
    socialIcon,
    myAccountNav
  },
  data() {
    return {
      userData: null,
      linksData: null,
      username: '',
      introduction: '',
      avatar: '',
      setProfile: false, // 是否编辑信息
      imgUploadDone: 0, // 图片是否上传完成
      loading: false,
      numPage: 1,
      aboutModify: false,
      socialModify: false,
      about: [{
        url: '',
        name: ''
      }],
      social: [
        {
          symbol: 'Email',
          type: 'email',
          name: 'Email：',
          tooltip: '',
          placeholder: this.$t('email'),
          url: '',
          value: ''
        },
        {
          symbol: 'QQ',
          type: 'qq',
          name: 'QQ：',
          tooltip: '',
          placeholder: this.$t('thirdParty.qqAccount'),
          url: '',
          value: ''
        },
        {
          symbol: 'Wechat',
          type: 'wechat',
          name: `${this.$t('thirdParty.wechat')}：`,
          tooltip: '',
          placeholder: this.$t('thirdParty.wechatAccount'),
          url: '',
          value: ''
        },
        {
          symbol: 'Weibo',
          type: 'weibo',
          name: `${this.$t('thirdParty.weibo')}：`,
          tooltip: `(https://www.weibo.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: this.$t('thirdParty.weibo') + this.$t('thirdParty.usernameNoFullUrl'),
          url: 'https://www.weibo.com',
          value: ''
        },
        {
          symbol: 'Telegram',
          type: 'telegram',
          name: 'Telegram：',
          tooltip: '',
          placeholder: `Telegram ${this.$t('username')}`,
          url: '',
          value: ''
        },
        {
          symbol: 'Twitter',
          type: 'twitter',
          name: 'Twitter：',
          tooltip: `(https://twitter.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Twitter${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://twitter.com',
          value: ''
        },
        {
          symbol: 'Facebook',
          type: 'facebook',
          name: 'Facebook：',
          tooltip: `(https://facebook.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Facebook${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://facebook.com',
          value: ''
        },
        {
          symbol: 'Github',
          type: 'github',
          name: 'Github：',
          tooltip: `(https://github.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Github${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://github.com',
          value: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    username(newVal) {
      if (
        this.detection(newVal, 'username') ||
        this.detectionIntroduction()) this.setProfile = true
      else this.setProfile = false
    },
    introduction(newVal) {
      if (
        this.detection(newVal, 'introduction') ||
        this.detectionUsername()) this.setProfile = true
      else this.setProfile = false
    },
    about: {
      deep: true,
      handler() {
        this.aboutModify = JSON.stringify(this.linksData.websites) !== JSON.stringify(this.about)
      }
    },
    social: {
      deep: true,
      handler() {
        for (const item of this.social) {
          const oSocial = this.linksData.socialAccounts.find(age => age.type === item.type)
          if (oSocial == null) {
            if (item.value !== '') {
              this.socialModify = true
              return
            }
          } else if (oSocial.value !== item.value) {
            this.socialModify = true
            return
          }
        }
        this.socialModify = false
      }
    }
    // social(newVal) {

    // }
  },
  created() {
  },
  mounted() {
    this.getMyUserData()
  },
  methods: {
    ...mapActions('user', [
      'refreshUser'
    ]),
    // 检测
    detection(val, type) {
      if (type === 'username') return val !== (this.userData.nickname || this.userData.username)
      if (type === 'introduction') return val !== this.userData.introduction
    },
    detectionUsername() {
      return this.username !== (this.userData.nickname || this.userData.username)
    },
    detectionIntroduction() {
      return this.introduction !== this.userData.introduction
    },
    // 输入框内容检测
    checkSaveParams() {
      // 中文 字母 数字 1-12
      const reg = /^[\u4E00-\u9FFF\u3400-\u4DFF\u3131-\uD79Dぁ-んァ-ンA-Za-z0-9]{1,50}$/
      // const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!reg.test(this.username)) {
        throw this.$t('rule.strEnglishNumber', ['1-50'])
      } else if (this.introduction.length > 200) {
        throw this.$t('rule.profileNotExceedStr', [200])
      }
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$ossProcess(hash)
    },
    // 完成上传
    doneImageUpload(res) {
      console.log(res)
      this.imgUploadDone += Date.now()
      this.refreshUser({ id: this.currentUserInfo.id })
      this.getMyUserData()
    },
    // 获取用户信息 - 转让状态
    async getMyUserData() {
      const setUser = data => {
        // console.log(data)
        this.userData = data
        this.username = data.nickname || data.username
        this.introduction = data.introduction || ''
        this.setAvatarImage(data.avatar)
      }
      const setLinks = data => {
        this.linksData = data
        // 为了对比是否修改，需要深拷贝
        if (data.websites.length !== 0) this.about = JSON.parse(JSON.stringify(data.websites))
        data.socialAccounts.forEach(item => {
          this.social.find(age => age.type === item.type).value = item.value
        })
      }
      try {
        const res = await this.$API.getMyUserData()
        const resLinks = await this.$API.getUserLinks({ id: this.currentUserInfo.id })
        if (res.code === 0 && resLinks.code === 0) {
          setUser(res.data)
          setLinks(resLinks.data)
        } else console.log('获取用户信息失败')
      } catch (error) {
        console.log(`获取用户信息失败${error}`)
      }
    },
    // 保存按钮
    async save() {
      if (!this.setProfile && !this.aboutModify && !this.socialModify) return

      const saveProfile = async () => {
        if (!this.setProfile) return

        this.checkSaveParams()

        const requestData = {
          nickname: this.username,
          introduction: this.introduction
        }
        if (this.username === (this.userData.nickname || this.userData.username)) delete requestData.nickname
        if (this.introduction === this.userData.introduction) delete requestData.introduction

        await this.$API.setProfile(requestData)

        this.setProfile = false
      }
      const saveLinks = async () => {
        if (!this.aboutModify && !this.socialModify) return

        const requestData = {
          websites: this.about.filter(web => web.url),
          socialAccounts: (() => {
            const nSocial = {}
            this.social.forEach(item => {
              if (item.value && item.value !== '') {
                nSocial[item.type] = item.value
              }
            })
            return nSocial
          })()
        }

        await this.$API.setUserLinks(requestData)

        this.aboutModify = false
        this.socialModify = false
      }

      this.loading = true
      try {
        await Promise.all([saveProfile(), saveLinks()])

        this.refreshUser({ id: this.currentUserInfo.id })
        this.getMyUserData()
        this.$message({
          showClose: true,
          message: this.$t('success.success'),
          type: 'success'
        })
      } catch (error) {
        if (typeof error === 'string') {
          this.$message.error(error)
        } else if (error.response && error.response.data) {
          this.$message.error(error.response.data.message)
        } else {
          console.error(`修改信息失败 catch error ${error}`)
          this.$message({ showClose: true, message: this.$t('error.fail'), type: 'error'})
          this.$message({ showClose: true, message: this.$t('error.fail'), type: 'error'})
        }
      } finally {
        this.loading = false
      }
    },
    aboutAdd() {
      if (this.about.length >= 5) return
      this.about.push({
        url: '',
        name: ''
      })
    },
    abountLess(i) {
      if (this.about.length <= 1) return
      this.about.splice(i, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 1px;
  background-color: #eee;
}
.list {
  margin: 40px 0;
  padding: 0;
  display: flex;
  &.center {
    align-items: center;
  }
}
.title {
  font-size: 18px;
  font-weight: 400;
  color: #333;
  line-height: 28px;
  margin-right: 20px;
  &.right0 {
    margin-right: 0;
  }
}
.title-note {
  font-size: 14px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 28px;
}

@avatarWidth: 90px;
.avatar {
  width: @avatarWidth;
  height: @avatarWidth;
  border-radius: 50%;
  background: #eee;
  overflow: hidden;
  cursor: pointer;
  .user-avatar {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
  &:hover .edit {
    display: flex;
  }
  .edit {
    display: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: #eee;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    .el-icon-camera {
      font-size: 24px;
      margin-bottom: 4px;
      color: #eee;
    }
  }
}
.icon-avatar {
  width: @avatarWidth;
  height: @avatarWidth;
  color: #bbb;
}
.input {
  width: 400px;
}
.save {
  display: block;
  width: 200px;
  height: 40px;
  border-radius: @borderRadius6;
  border: none;
  outline: none;
  color: #fff;
  margin: 100px auto 0;
  background-color: #bfbfbf;
  cursor: pointer;
  &.active {
    background: @purpleDark;
  }
}

.social-title {
  padding: 0;
  margin: 12px 0 10px 60px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
  span {
    /deep/ span {
      color: red;
    }
  }
}
.social-icons {
  width: 60px;
  flex: 0 0 60px;
}
.social-input {
  width: 340px;
}
.social-div {
  padding-top: 24px;
  padding-bottom: 34px;
}
.about-input {
  margin: 0 0 10px;
  .input {
    width: 400px;
    &.web-name {
      max-width: 150px;
      margin-right: 5px;
    }
  }
}
.about-input-btn {
  width: 24px;
  height: 24px;
  background-color: @purpleDark;
  color: @white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 0;
  cursor: pointer;
  &.less {
    margin-left: 10px;
  }
}
.set-main {
  padding-left: 10px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
  margin: 0;
}

.item {
  display: flex;
  &-label {
    display: block;
    width: 100px;
    flex: 0 0 100px;
    margin-right: 10px;
  }
}

// < 640
@media screen and (max-width: 640px) {
  .item {
    display: block;
    width: 100%;
    &-label {
      margin-right: 0;
      margin-bottom: 4px;
    }
  }

  .input,
  .about-input .input,
  .social-input {
    width: 100%;
  }
  .set-main,
  .tag-title {
    padding-left: 0;
  }

  .list {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .social-div {
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
