/* eslint-disable no-shadow */
<template>
  <div class="edit-user mw">
    <BaseHeader :pageinfo="{ title: '编辑', rightPage: 'home' }">
      <div slot="right">
        <span class="done-button" :class="!setProfile && 'no-modify'" @click="save">完成</span>
      </div>
    </BaseHeader>
    <div class="edit-card">
      <div class="edit-card-list">
        <span>头像</span>
        <img-upload
          class="imgcard"
          :img-upload-done="imgUploadDone"
          :update-type="'avatar'"
          @doneImageUpload="doneImageUpload"
        >
          <div slot="uploadButton" class="user-avatar">
            <img slot="description" :src="avatar" alt="" :onerror="defaultAvatar" />
          </div>
        </img-upload>
      </div>

      <div class="edit-card-list">
        <span>昵称</span>
        <input v-model="newNickName" placeholder="1-12位字符,包含中文、英文、数字" />
      </div>

      <div class="edit-card-list">
        <span>简介</span>
        <input v-model="newIntroduction" placeholder="不能超过20位字符" />
      </div>

      <div class="edit-card-list">
        <span>邮箱</span>
        <input v-model="newEmail" placeholder="请输入邮箱" />
      </div>
    </div>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload/index.vue'
import { mapActions } from 'vuex'

export default {
  name: 'User',
  components: { imgUpload },
  props: ['id'],
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      playerincome: 0,
      editing: false,
      nickname: '', // 昵称
      newNickName: '', // 昵称
      avatar: '',
      imgUploadDone: 0, // 图片是否上传完成
      introduction: '', // 简介
      newIntroduction: '', // 简介
      email: '',
      newEmail: '',
      setProfile: false // 是否编辑信息
    }
  },
  computed: {},
  watch: {
    // 监听内容修改 如果内容改动则改变setProfile
    newNickName(newVal) {
      if (
        newVal !== this.nickname ||
        this.introduction !== this.newIntroduction ||
        this.email !== this.newEmail
      )
        this.setProfile = true
      else this.setProfile = false
    },
    // 监听内容修改 如果内容改动则改变setProfile
    newIntroduction(newVal) {
      if (
        newVal !== this.introduction ||
        this.nickname !== this.newNickName ||
        this.email !== this.newEmail
      )
        this.setProfile = true
      else this.setProfile = false
    },
    // 监听内容修改 如果内容改动则改变setProfile
    newEmail(newVal) {
      if (
        newVal !== this.email ||
        this.introduction !== this.newIntroduction ||
        this.nickname !== this.newNickName
      )
        this.setProfile = true
      else this.setProfile = false
    }
  },
  created() {
    this.refreshUser()
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    checkSaveParams() {
      // 中文 字母 数字 1-12
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,12}$/
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      let canSetProfile = true
      if (!reg.test(this.newNickName)) {
        this.myToasted('昵称长度为1-12位,中文、英文、数字但不包括下划线等符号')
        canSetProfile = false
      }
      if (this.newIntroduction.length > 20) {
        this.myToasted('简介不能超过20个字符')
        canSetProfile = false
      }
      if (this.newEmail !== '' && !regEmail.test(this.newEmail)) {
        this.myToasted('请输入正确的邮件地址')
        canSetProfile = false
      }
      return canSetProfile
    },
    myToasted(message) {
      this.$toast({ duration: 1000, message })
    },
    async save() {
      // 如果没有改动返回上一页
      if (!this.setProfile) return this.$router.go(-1)
      if (!this.checkSaveParams()) return
      const requestData = {
        nickname: this.newNickName,
        introduction: this.newIntroduction,
        email: this.newEmail
      }
      if (this.newNickName === this.nickname) delete requestData.nickname
      if (this.newIntroduction === this.introduction) delete requestData.introduction
      if (this.newEmail === this.email) delete requestData.email
      console.log(requestData)
      // 设置用户信息
      await this.$backendAPI
        .setProfile(requestData)
        .then(res => {
          console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            this.$toast.success({ duration: 1000, message: res.data.message })
            this.nickname = this.newNickName
            this.$navigation.cleanRoutes() // 清除路由记录
          } else this.myToasted(res.data.message)
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 401) {
            this.$toast.fail({
              duration: 1000,
              message: '没有登陆'
            })
          } else {
            this.$toast.fail({
              duration: 1000,
              message: '登陆失败'
            })
          }
        })
    },
    async refreshUser() {
      const setUser = data => {
        this.nickname = data.nickname
        this.newNickName = this.nickname || data.username
        this.email = data.email
        this.newEmail = this.email
        this.introduction = data.introduction
        this.newIntroduction = this.introduction
        this.setAvatarImage(data.avatar)
      }

      setUser(await this.getCurrentUser())
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$backendAPI.getAvatarImage(hash)
    },
    // 完成上传
    async doneImageUpload(res) {
      console.log(res)
      this.refreshUser()
      this.imgUploadDone += Date.now()
    }
  }
}
</script>

<style lang="less" scoped>
.edit-user {
  background-color: #f1f1f1;
  min-height: 100%;
  padding-top: 45px;
}
.edit-card {
  //background:rgba(255,255,255,1);
  &-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 18px 20px;
    margin-bottom: 10px;
    background: #ffffff;
    /* &:nth-child(n+2)::before{
      content: '';
      display: block;
      position: absolute;
      left: 20px;
      right: 20px;
      top: 0;
      height: 1px;
      background-color: #f1f1f1;
    }*/
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
    }
    input {
      flex: 1;
      text-align: right;
      border: none;
      background: transparent;
      outline: none;
      overflow: hidden;
      padding-left: 10px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      &::placeholder {
        font-size: 14px;
        font-weight: 500;
        color: #b2b2b2;
      }
    }
  }
}

.imgcard {
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
  .user-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .camera {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
}
.done-button {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  cursor: pointer;
  &.no-modify {
    color: rgba(0, 0, 0, 1);
  }
}
</style>
