<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="setting" />
      <div class="set-main">
        <div class="list center">
          <span class="title">修改头像</span>
          <img-upload
            class="avatar"
            :img-upload-done="imgUploadDone"
            :update-type="'avatar'"
            @doneImageUpload="doneImageUpload"
          >
            <div slot="uploadButton" class="user-avatar">
              <div class="edit">
                <i class="el-icon-camera" />
                修改头像
              </div>
              <img v-if="avatar" slot="description" :src="avatar" alt="avatar">
            </div>
          </img-upload>
        </div>
        <div class="list center">
          <span class="title">修改昵称</span>
          <div class="input">
            <el-input
              v-model="username"
              placeholder="请输入昵称"
              maxlength="12"
              show-word-limit
              clearable
            />
          </div>
        </div>
        <div class="list center">
          <span class="title">修改邮箱</span>
          <div class="input">
            <el-input
              v-model="email"
              placeholder="请输入邮箱"
              show-word-limit
              clearable
            />
          </div>
        </div>
        <div class="list">
          <span class="title">修改简介</span>
          <div class="input">
            <el-input
              v-model="introduction"
              type="textarea"
              :rows="4"
              maxlength="20"
              show-word-limit
              placeholder="请输入内容"
            />
          </div>
        </div>
        <div class="line" />
        <div class="list center">
          <span class="title">接受他人文章权限移交</span>
          <el-switch
            v-model="isTransfer"
            active-color="#1c9cfe"
            @change="changeTransfer"
          />
        </div>
        <el-button :loading="loading" class="save" :class="setProfile && 'active'" @click="save">
          保存
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

import imgUpload from '@/components/imgUpload/index.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    imgUpload
  },
  data() {
    return {
      userData: null,
      username: '',
      email: '',
      introduction: '',
      isTransfer: true,
      avatar: '',
      setProfile: false, // 是否编辑信息
      imgUploadDone: 0, // 图片是否上传完成
      loading: false
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
    }
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
      let canSetProfile = true
      if (!reg.test(this.username)) {
        this.$message.error('昵称长度为1-12位,中文、英文、数字但不包括下划线等符号')
        canSetProfile = false
      } else if (this.introduction.length > 20) {
        this.$message.error('简介不能超过20个字符')
        canSetProfile = false
      } else if (this.email !== '' && !regEmail.test(this.email)) {
        this.$message.error('请输入正确的邮件地址')
        canSetProfile = false
      }
      return canSetProfile
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$backendAPI.getAvatarImage(hash)
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
        console.log(data)
        this.userData = data
        this.username = data.nickname || data.username
        this.email = data.email || ''
        this.introduction = data.introduction || ''
        this.setAvatarImage(data.avatar)
      }
      try {
        const res = await this.$API.getMyUserData()
        if (res.code === 0) {
          setUser(res.data)
          this.isTransfer = !!res.data.accept
        } else console.log('获取用户信息失败')
      } catch (error) {
        console.log(`获取用户信息失败${error}`)
      }
    },
    // 改变转让状态
    async changeTransfer(status) {
      try {
        this.articleTransfer = status
        const accept = status ? 1 : 0
        const res = await this.$backendAPI.setProfile({ accept })
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error('修改失败')
          this.articleTransfer = !status
        }
      } catch (error) {
        this.articleTransfer = !status
        console.log(`转让状态错误${error}`)
        this.$message.error('修改失败')
      }
    },
    // 保存按钮
    async save() {
      if (!this.setProfile) return
      if (!this.checkSaveParams()) return
      // 过滤请求数据
      const filterRequestData = () => {
        const requestData = {
          nickname: this.username,
          introduction: this.introduction,
          email: this.email
        }
        if (this.username === (this.userData.nickname || this.userData.username)) delete requestData.nickname
        if (this.introduction === this.userData.introduction) delete requestData.introduction
        if (this.email === this.userData.email) delete requestData.email
        return requestData
      }
      // await console.log(filterRequestData())
      this.loading = true
      await this.$backendAPI
        .setProfile(filterRequestData())
        .then(res => {
          console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            this.$message({
              message: '修改信息成功',
              type: 'success'
            })
            this.refreshUser({ id: this.currentUserInfo.id })
            this.getMyUserData()
          } else this.$message.error('修改信息失败')
        })
        .catch(error => {
          console.log(`修改信息失败 catch error ${error}`)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped src="../index.less">
</style>
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
  .title {
    font-size:18px;
    font-weight:400;
    color:#333;
    line-height:28px;
    margin-right: 20px;
  }
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
  width: 240px;
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
    background: @blue;
  }
}
</style>
