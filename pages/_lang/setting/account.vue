<template>
  <userLayout>
    <template slot="main">
      <userNav nav-list-url="setting" />
      <div class="list">
        <div
          v-for="(item, idx) in accountList"
          v-loading="item.loading"
          :key="idx"
          :class="[item.type, item.status && 'bind']"
          @click="buildAccount(item.type, item.typename, idx)"
          class="list-account"
        >
          <svg-icon :icon-class="item.icon" class="icon" />
          <span class="typename">{{ item.typename }}</span>
          <span class="username">{{ item.username }}</span>
          <span class="close">取消绑定</span>
          <svg-icon icon-class="correct" class="correct" />
          <svg-icon icon-class="close_thin" class="close_thin" />
        </div>
      </div>
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import { getSignatureForLogin } from '@/api/eth'

export default {
  components: {
    userLayout,
    userInfo,
    userNav
  },
  data() {
    return {
      accountList: [
        {
          type: 'email',
          icon: 'email', // 随时可换 防止影响
          typename: '邮箱',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: false
        },
        {
          type: 'wechat',
          icon: 'wechat', // 随时可换 防止影响
          typename: '微信',
          username: '123456****342343423434234342343423434234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: true
        },
        {
          type: 'eth',
          icon: 'eth', // 随时可换 防止影响
          typename: 'ETH',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: false
        },
        {
          type: 'eos',
          icon: 'eos', // 随时可换 防止影响
          typename: 'EOS',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: false
        },
        {
          type: 'ont',
          icon: 'ont', // 随时可换 防止影响
          typename: 'ONT',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: true
        },
        {
          type: 'vnt',
          icon: 'vnt', // 随时可换 防止影响
          typename: 'VNT',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: true
        },
        {
          type: 'github',
          icon: 'github', // 随时可换 防止影响
          typename: 'Github',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          loading: false,
          status: false
        }
      ]
    }
  },
  computed: {
    ...mapState(['scatter', 'metamask']),
    ...mapGetters(['scatter/currentUsername'])
  },
  mounted() {
  },
  methods: {
    ...mapActions('scatter', ['connect', 'getSignature', 'login']),
    ...mapActions('ontology', ['getAccount', 'getSignature']),
    ...mapActions('metamask', ['getSignature']),
    accountBild(params, idx) {
      this.accountList[idx].loading = true
      this.$API.accountBind(params).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
        } else {
          this.$message.success(res.message)
        }
      }).catch(err => {
        console.log(err)
        this.$message.success(`绑定失败${params.platform.toUpperCase()}`)
      }).finally(() => {
        this.accountList[idx].loading = false
      })
    },
    buildAccount: debounce(async function (type, typename, idx) {
      if (type === 'email') {
        let windowObjectReference = null
        const openRequestedPopup = (strUrl, strWindowName) => {
          if (windowObjectReference == null || windowObjectReference.closed) {
            windowObjectReference = window.open(
              strUrl,
              strWindowName,
              'left=100,top=100,width=600,height=500,resizable,scrollbars,status'
            )
          } else {
            windowObjectReference.focus()
          }
        }
        openRequestedPopup('http://localhost:8080/login/email', 'buildEmail')
      } else if (type === 'wechat') {
        this.$message.warning(`PC端暂不支持${typename}绑定`)
      } else if (type === 'eth') {
        try {
          const { signature, msgParams } = await getSignatureForLogin('Bind')
          console.log('🚀', signature, msgParams)
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publicKey: this.metamask.account,
            sign: signature,
            msgParams
          }, idx)
        } catch (error) {
          console.log(error)
          if (error.message && error.code === 4001) {
            if (error.message && error.message.includes('User denied account authorization')) this.$message.warning('用户拒绝帐户授权')
            else if (error.message && error.message.includes('MetaMask Message Signature: User denied message signature')) this.$message.warning('您拒绝了签名请求')
            else this.$message.warning('签名失败')
          } else if (error.message) this.$message.warning(error.message)
          else this.$message.warning(error.toString())
        }
      } else if (type === 'eos') {
        try {
          // connect
          if (!this.scatter.isConnected) {
            const result = await this.$store.dispatch('scatter/connect')
            if (!result) throw new Error('scatter连接失败')
          }
          if (!this.scatter.isLoggingIn) {
            const result = await this.$store.dispatch('scatter/login')
            if (!result) throw new Error('Scatter登录失败')
          }
          // get currentUsername
          const currentUsername = await this['scatter/currentUsername'] || ''
          if (!currentUsername) throw new Error('Scatter获取账户信息失败')
          // signature
          // 没有扩展
          const { publicKey, signature, username } = await this.$store.dispatch('scatter/getSignature', { mode: 'Auth', rawSignData: [currentUsername] })
          console.log('🚀', signature)
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publicKey: publicKey,
            sign: signature,
            username: username
          }, idx)
        } catch (error) {
          console.log(error)
          if (error.isError) {
            // User rejected the signature request
            this.$message.warning('您拒绝了签名请求')
          } else if (error.toString().includes('\'name\' of null')) this.$message.warning('无法连接钱包, 请稍后再试')
          else if (error.message && error.message.includes('The user did not allow this app to connect to their Scatter')) this.$message.warning('用户不允许此应用连接到他们的Scatter')
          else this.$message.warning(error.toString())
        }
      } else if (type === 'ont') {
        try {
          const getAccount = await this.$store.dispatch('ontology/getAccount')
          if (!getAccount) throw new Error('Ont获取账户信息失败')
          // 没有扩展
          const { publicKey, signature, username } = await this.$store.dispatch('ontology/getSignature', { mode: 'Auth', rawSignData: [getAccount] })
          console.log('🚀', signature)
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publicKey: publicKey,
            sign: signature,
            username: username
          }, idx)
        } catch (error) {
          console.log(error)
          if (error.message && error.message.includes('Could not establish connection')) this.$message.warning('无法建立连接')
          else if (error === 'CANCELED') this.$message.warning('您取消了签名请求')
          else this.$message.warning('您拒绝了签名请求')
        }
      } else if (type === 'vnt') {
        this.$message.warning(`PC端暂不支持${typename}绑定`)
      } else if (type === 'github') {
        this.$router.push({
          name: 'login-github',
          query: {
            from: 'buildAccount'
          }
        })
      } else this.$message.warning('PC端暂不支持绑定')
    }, 500)

  }
}
</script>

<style lang="less" scoped>
.list {
  margin-left: 10px;
}
.list-account {
  display: flex;
  align-items: center;
  width: 335px;
  // height: 40px;
  background-color: #eee;
  color: #fff;
  border-radius: 6px;
  margin: 20px 0;
  padding: 9px 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s;

  &.email {
    background-color: #542de0;
    &:hover {
      background-color: mix(#000, #542de0, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.wechat {
    background-color: #00c800;
    &:hover {
      background-color: mix(#000, #00c800, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.eth {
    background-color: #6c7ab7;
    &:hover {
      background-color: mix(#000, #6c7ab7, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.eos {
    background-color: #333333;
    &:hover {
      background-color: mix(#000, #333, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.ont {
    background-color: #4d9afd;
    &:hover {
      background-color: mix(#000, #4d9afd, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.vnt {
    background-color: #3289ff;
    &:hover {
      background-color: mix(#000, #3289ff, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.github {
    background-color: #882592;
    &:hover {
      background-color: mix(#000, #882592, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  .typename,
  .close {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    margin-left: 4px;
  }
  .username {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    margin-left: 10px;
    margin-right: 40px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: none;
  }
  .correct {
    font-size: 16px;
    display: none;
  }
  .close {
    display: none;
    flex: 1;
  }
  .close_thin {
    font-size: 16px;
    display: none;
  }
  &.bind {
    .correct,
    .username {
      display: block;
    }
    &:hover {
      .username,
      .correct {
        display: none;
      }
      .close,
      .close_thin {
        display: block;
      }
    }
  }
}
</style>
