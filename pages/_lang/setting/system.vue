<template>
  <userLayout>
    <template slot="main">
      <userNav nav-list-url="setting" />
      <div class="list">
        <span class="title">{{ $t('user.transfer') }}</span>
        <el-switch
          v-model="isTransfer"
          @change="changeTransfer"
          active-color="#542DE0"
        />
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

export default {
  components: {
    userLayout,
    userInfo,
    userNav
  },
  data() {
    return {
      isTransfer: true
    }
  },
  mounted() {
    this.getMyUserData()
  },
  methods: {
    // 获取用户信息 - 转让状态
    async getMyUserData() {
      const res = await this.$API.getMyUserData().then(res => {
        if (res.code === 0) {
          this.isTransfer = !!res.data.accept
        } else console.log('获取用户信息失败')
      }).catch(err => {
        console.log(`获取用户信息失败${err}`)
      })
    },
    // 改变转让状态
    async changeTransfer(status) {
      try {
        this.articleTransfer = status
        const accept = status ? 1 : 0
        const res = await this.$backendAPI.setProfile({ accept })
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            message: this.$t('success.success'),
            type: 'success'
          })
        } else {
          this.$message.error(this.$t('error.fail'))
          this.articleTransfer = !status
        }
      } catch (error) {
        this.articleTransfer = !status
        console.log(`转让状态错误${error}`)
        this.$message.error(this.$t('error.fail'))
      }
    }
  }
}
</script>

<style lang="less" scoped>

.title {
  font-size:16px;
  font-weight:400;
  color:#333;
  line-height:28px;
  margin-right: 20px;
}
.list {
  margin: 20px 0 0 10px;
}
</style>
