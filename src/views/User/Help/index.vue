<template>
  <div class="mw help">
    <BaseHeader :pageinfo="{ title: '设置' }" />
    <div class="help-block">
      <a class="help-list" href="https://smartsignature.io/article/617">
        <span class="help-list-title">规则介绍</span>
        <img src="@/assets/img/icon_arrow.svg" alt="view" />
      </a>

      <div
        v-for="(item, index) in helpDoc"
        :key="index"
        class="help-list"
        @click="jumpTo({ name: item.name })"
      >
        <span class="help-list-title">{{ item.title }}</span>
        <img src="@/assets/img/icon_arrow.svg" alt="view" />
      </div>
    </div>

    <div class="help-block">
      <div class="help-list">
        <span class="help-list-title">接受他人文章权限移交</span>
        <span class="help-list-sub">
          <van-switch
            v-model="articleTransfer"
            size="22px"
            active-color="#1C9CFE"
            inactive-color="#F0F0F0"
            @change="changeTransfer"
          />
        </span>
      </div>
    </div>

    <div class="help-block">
      <a
        class="help-list"
        href="https://github.com/smart-signature/smart-signature-future"
        target="_blank"
      >
        <span class="help-list-title">关于我们</span>
        <div class="help-list-right">
          <span class="help-list-sub">Github 入口</span>
          <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="view" />
        </div>
      </a>
      <a class="help-list" href="https://t.me/smartsignature_io" target="_blank">
        <span class="help-list-title">加入电报</span>
        <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="view" />
      </a>
      <!--<div class="help-list">
        <span class="help-list-title">当前版本</span>
        <span class="help-list-sub">v2.3.2</span>
      </div>-->
    </div>
    <div class="signout">
      <p class="version">-version2.4.1-</p>
      <a class="signout-button" href="javascript:;" @click="btnsignOut">登出</a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  naem: 'Help',
  data() {
    return {
      articleTransfer: false,
      helpDoc: [
        {
          title: '用户协议',
          name: ''
        },
        {
          title: '隐私政策',
          name: ''
        }
      ]
    }
  },
  created() {
    this.getMyUserData()
  },
  methods: {
    ...mapActions(['signOut']),
    btnsignOut() {
      this.signOut()
      this.jumpTo({ name: 'home' })
    },
    jumpTo(params) {
      if (!params.name) return
      this.$router.push(params)
    },
    // 获取用户信息 - 转让状态
    async getMyUserData() {
      try {
        const res = await this.$backendAPI.getMyUserData()
        if (res.status === 200 && res.data.code === 0) this.articleTransfer = !!res.data.data.accept
        else console.log('获取转让状态失败')
      } catch (error) {
        console.log(`获取转让状态失败${error}`)
      }
    },
    // 改变转让状态
    async changeTransfer(status) {
      try {
        this.articleTransfer = status
        let accept = status ? 1 : 0
        const res = await this.$backendAPI.setProfile({ accept })
        if (res.status === 200 && res.data.code === 0)
          return this.$toast.success({ duration: 1000, message: '成功' })
        else {
          this.$toast.fail({ duration: 1000, message: '失败' })
          this.articleTransfer = !status
        }
      } catch (error) {
        this.articleTransfer = !status
        console.log(`转让状态错误${error}`)
        this.$toast.fail({ duration: 1000, message: '失败' })
      }
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
