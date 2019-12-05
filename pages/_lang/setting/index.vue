<template>
  <userLayout>
    <template slot="main">
      <userNav nav-list-url="setting" />
      <div class="set-main">
        <div class="list center">
          <span class="title">{{ $t('avatar') }}</span>
          <img-upload
            :img-upload-done="imgUploadDone"
            :update-type="'avatar'"
            @doneImageUpload="doneImageUpload"
            class="avatar"
          >
            <div slot="uploadButton" class="user-avatar">
              <div class="edit">
                <i class="el-icon-camera" />
                {{ $t('avatar') }}
              </div>
              <img slot="description" v-if="avatar" :src="avatar" alt="avatar">
            </div>
          </img-upload>
        </div>
        <div class="list center">
          <span class="title">
            {{ $t('nickname') }}
          </span>
          <div class="input">
            <el-input
              v-model="username"
              :placeholder="$t('rule.username')"
              maxlength="12"
              show-word-limit
              clearable
            />
          </div>
        </div>
        <div class="list center">
          <span class="title"> {{ $t('email') }}</span>
          <div class="input">
            <el-input
              v-model="email"
              :placeholder="$t('rule.loginEmailMessage')"
              show-word-limit
              clearable
            />
          </div>
        </div>
        <div class="list">
          <span class="title">{{ $t('profile') }}</span>
          <div class="input">
            <el-input
              v-model="introduction"
              :rows="4"
              :placeholder="$t('rule.content')"
              type="textarea"
              maxlength="20"
              show-word-limit
            />
          </div>
        </div>
        <div class="line" />
        <!-- 相关网站 -->
        <div class="social-div">
          <span class="title">
            相关网站
          </span>
          <div v-for="(item, index) in about" :key="index" class="fl ac about-input social-list">
            <el-input v-model="about[index]" class="input" placeholder="请填写网站链接，包含http(s)://" />
            <div v-if="about.length > 1" @click="abountLess(index)" class="about-input-btn">
              <i class="el-icon-minus" />
            </div>
          </div>
          <div v-if="about.length < 5" @click="aboutAdd" class="about-input-btn add">
            <i class="el-icon-plus" />
          </div>
        </div>
        <!-- 社交账号 -->
        <div class="social-div">
          <span class="title">
            社交账号
          </span>
          <div v-for="(item, index) in social" :key="index" class="social-list">
            <p class="social-title">
              {{ item.name }}
              <span v-html="item.tooltip" />
            </p>
            <div class="fl">
              <div class="social-icons">
                <socialIcon :icon="item.symbol" />
              </div>
              <el-input v-model="item.value" :placeholder="item.placeholder" class="social-input" />
            </div>
          </div>
        </div>
        <!-- 保存 -->
        <div class="line" />
        <el-button :loading="loading" :class="(setProfile || aboutModify || socialModify) && 'active'" @click="save" class="save ">
          {{ $t('save') }}
        </el-button>
      </div>
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import socialIcon from '@/components/social_icon/index.vue'

import imgUpload from '@/components/imgUpload/index.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    imgUpload,
    socialIcon
  },
  data() {
    return {
      userData: null,
      linksData: null,
      username: '',
      email: '',
      introduction: '',
      avatar: '',
      setProfile: false, // 是否编辑信息
      imgUploadDone: 0, // 图片是否上传完成
      loading: false,
      numPage: 1,
      aboutModify: false,
      socialModify: false,
      about: [''],
      social: [
        {
          symbol: 'QQ',
          type: 'qq',
          name: 'QQ：',
          tooltip: '',
          placeholder: 'QQ帐号',
          url: '',
          value: ''
        },
        {
          symbol: 'Wechat',
          type: 'wechat',
          name: '微信：',
          tooltip: '',
          placeholder: '微信号',
          url: '',
          value: ''
        },
        {
          symbol: 'Weibo',
          type: 'weibo',
          name: '微博：',
          tooltip: '(https://www.weibo.com/<span>帐号</span>)',
          placeholder: '微博用户名(不需要完整URL)',
          url: 'https://www.weibo.com',
          value: ''
        },
        {
          symbol: 'Telegram',
          type: 'telegram',
          name: 'Telegram：',
          tooltip: '',
          placeholder: 'Telegram用户名',
          url: '',
          value: ''
        },
        {
          symbol: 'Twitter',
          type: 'twitter',
          name: 'Twitter：',
          tooltip: '(https://twitter.com/<span>帐号</span>)',
          placeholder: 'Twitter用户名(不需要完整URL)',
          url: 'https://twitter.com',
          value: ''
        },
        {
          symbol: 'Facebook',
          type: 'facebook',
          name: 'Facebook：',
          tooltip: '(https://facebook.com/<span>帐号</span>)',
          placeholder: 'Facebook用户名(不需要完整URL)',
          url: 'https://facebook.com',
          value: ''
        },
        {
          symbol: 'Github',
          type: 'github',
          name: 'Github：',
          tooltip: '(https://github.com/<span>帐号</span>)',
          placeholder: 'Github用户名(不需要完整URL)',
          url: 'https://github.com',
          value: ''
          // resourcesSocialss: [],
          // resourcesWebsites: [],
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
        this.detectionIntroduction() ||
        this.detectionEmail()) this.setProfile = true
      else this.setProfile = false
    },
    email(newVal) {
      if (
        this.detection(newVal, 'email') ||
        this.detectionIntroduction() ||
        this.detectionUsername()) this.setProfile = true
      else this.setProfile = false
    },
    introduction(newVal) {
      if (
        this.detection(newVal, 'introduction') ||
        this.detectionUsername() ||
        this.detectionEmail()) this.setProfile = true
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
      if (type === 'email') return val !== this.userData.email
      if (type === 'introduction') return val !== this.userData.introduction
    },
    detectionUsername() {
      return this.username !== (this.userData.nickname || this.userData.username)
    },
    detectionEmail() {
      return this.email !== this.userData.email
    },
    detectionIntroduction() {
      return this.introduction !== this.userData.introduction
    },
    // 输入框内容检测
    checkSaveParams() {
      // 中文 字母 数字 1-12
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,12}$/
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!reg.test(this.username)) {
        throw this.$t('rule.strEnglishNumber', ['1-12'])
      } else if (this.introduction.length > 20) {
        throw this.$t('rule.profileNotExceedStr', [20])
      } else if (this.email !== '' && !regEmail.test(this.email)) {
        throw this.$t('rule.emailMessage')
      }
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$API.getImg(hash)
    },
    // 完成上传
    doneImageUpload(res) {
      // console.log(res)
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
        this.email = data.email || ''
        this.introduction = data.introduction || ''
        this.setAvatarImage(data.avatar)
      }
      const setLinks = data => {
        this.linksData = data
        this.about = [
          ...data.websites.length !== 0 ? data.websites : ['']
        ]
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
          introduction: this.introduction,
          email: this.email
        }
        if (this.username === (this.userData.nickname || this.userData.username)) delete requestData.nickname
        if (this.introduction === this.userData.introduction) delete requestData.introduction
        if (this.email === this.userData.email) delete requestData.email

        await this.$backendAPI.setProfile(requestData)

        this.setProfile = false
      }
      const saveLinks = async () => {
        if (!this.aboutModify && !this.socialModify) return

        const requestData = {
          websites: this.about.filter(Boolean),
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

        await this.$backendAPI.setUserLinks(requestData)

        this.aboutModify = false
        this.socialModify = false
      }

      this.loading = true
      try {
        await Promise.all([saveProfile(), saveLinks()])

        this.refreshUser({ id: this.currentUserInfo.id })
        this.getMyUserData()
        this.$message({
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
          this.$message.error(this.$t('error.fail'))
        }
      } finally {
        this.loading = false
      }
    },
    aboutAdd() {
      if (this.about.length >= 5) return
      this.about.push('')
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
  font-size:18px;
  font-weight:400;
  color:#333;
  line-height:28px;
  margin-right: 20px;
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
  .edit{
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
    background: rgba(0,0,0,.6);
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
  width:200px;
  height:40px;
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
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:20px;
  span {
    span {
      color: red;
    }
  }
}
.social-icons {
  width: 60px;
}
.social-input {
  width: 340px;
}
.social-div {
  padding-top: 24px;
  padding-bottom: 34px;
  .social-list {
    margin-left: 56px;
  }
}
.about-input {
  margin: 0 0 10px;
  .input {
    width: 400px;
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
  margin: 0 0 0 10px;
  cursor: pointer;
  &.add {
    margin-left: 56px;
  }
}
.set-main {
  padding-left: 10px;
}
</style>
