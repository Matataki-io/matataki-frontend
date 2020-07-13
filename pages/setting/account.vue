<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        {{ $t('user.accountSetting') }}
      </h2>
      <div class="list">
        <div
          v-for="(item, idx) in accountList"
          :key="idx"
          class="fl ac"
        >
          <div
            v-loading="item.loading"
            :class="[item.type, item.status && 'bind']"
            :data-disabled="item.disabled"
            class="list-account"
            @click="buildAccount(item.type, item.typename, idx)"
          >
            <svg-icon
              :icon-class="item.icon"
              class="icon"
            />
            <span class="typename">{{ item.typename }}</span>
            <span class="username">{{ item.username }}</span>
            <span class="close">{{ $t('thirdParty.unbind') }}</span>
            <svg-icon
              icon-class="correct"
              class="correct"
            />
            <svg-icon
              icon-class="close_thin"
              class="close_thin"
            />
          </div>
          <el-radio
            :value="accountRadio"
            :label="item.type"
            :disabled="item.disabled"
            style="margin-left: 10px;"
            @change="accountChangeFunc(item.type, idx)"
          >
            <span v-if="accountRadio === item.type">{{ $t('thirdParty.mainAccount') }}</span>
            <span v-else>&nbsp;</span>
          </el-radio>
        </div>
        <p class="list-p">
          {{ $t('thirdParty.bindExplanation1') }}
        </p>
        <p class="list-p">
          {{ $t('thirdParty.bindExplanation2') }}
        </p>
      </div>
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'
import { getSignatureForLogin } from '@/api/eth'
import { getCookie } from '@/utils/cookie'
import store from '@/utils/store.js'

export default {
  components: {
    userLayout,
    myAccountNav
  },
  data() {
    return {
      accountRadio: '',
      accountList: [
        {
          type: 'email',
          icon: 'email', // 随时可换 防止影响
          typename: this.$t('email'),
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'weixin',
          icon: 'wechat', // 随时可换 防止影响
          typename: this.$t('thirdParty.wechatAccount'),
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'eth',
          icon: 'eth', // 随时可换 防止影响
          typename: 'ETH',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'eos',
          icon: 'eos', // 随时可换 防止影响
          typename: 'EOS',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'ont',
          icon: 'ont', // 随时可换 防止影响
          typename: 'ONT',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'vnt',
          icon: 'vnt', // 随时可换 防止影响
          typename: 'VNT',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'github',
          icon: 'github', // 随时可换 防止影响
          typename: 'Github',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'telegram',
          icon: 'telegram', // 随时可换 防止影响
          typename: 'Telegram',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'twitter',
          icon: 'twitter', // 随时可换 防止影响
          typename: 'Twitter',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'google',
          icon: 'google', // 随时可换 防止影响
          typename: 'Google',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        },
        {
          type: 'facebook',
          icon: 'facebook', // 随时可换 防止影响
          typename: 'Facebook',
          username: '', // 最好后端混淆后返回
          loading: false,
          status: false,
          is_main: 0,
          disabled: false
        }
      ]
    }
  },
  computed: {
    ...mapState(['scatter', 'metamask']),
    ...mapGetters(['scatter/currentUsername', 'isLogined'])
  },
  mounted() {
    this.getAccountList()
  },
  methods: {
    ...mapActions('scatter', ['connect', 'getSignature', 'login']),
    ...mapActions('ontology', ['getAccount', 'getSignature']),
    ...mapActions('metamask', ['getSignature', 'fetchAccount']),
    ...mapActions('vnt', ['bind']),
    // ...mapActions(['signOut']),
    telegramLogin(user) {
      alert(JSON.stringify(user))
    },
    accountBild(params, idx) {
      this.accountList[idx].loading = true
      this.$API.accountBind(params).then(res => {
        if (res.code === 0) {
          this.$message({ showClose: true, message: res.message, type: 'success'})
          this.getAccountList()
        } else {
          this.$message({ showClose: true, message: res.message, type: 'warning'})
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(this.$t('thirdParty.bindFailed') + params.platform.toUpperCase())
      }).finally(() => {
        this.accountList[idx].loading = false
      })
    },
    accountUnbild(params, idx) {
      this.accountList[idx].loading = true
      this.$API.accountUnbind(params).then(res => {
        if (res.code === 0) {
          let idProvider = getCookie('idProvider').toLocaleLowerCase()
          idProvider = idProvider === 'metamask' ? 'eth' : idProvider
          if (idProvider === this.accountList[idx].type.toLocaleLowerCase()) {
            this.$message.warning(this.$t('thirdParty.loginAgainAfterUnbinding'))
            // this.signOut()
            this.$utils.delCookie('ACCESS_TOKEN')
            this.$utils.delCookie('idProvider')
            store.clear()
            sessionStorage.clear()
            // this.$utils.deleteAllCookies()
            setTimeout(() => {
              window.location.reload()
            }, 300)
          } else {
            this.$message({ showClose: true, message: res.message, type: 'success'})
            this.getAccountList()
          }
        } else if (res.code === 999) {
          let msg = '<ul>'
          msg += res.message.reduce((accumulator, item) => {
            return accumulator + `<li>${item.error}</li>`
          }, '')
          msg += '</ul>'
          this.$alert(msg, this.$t('thirdParty.accountRiskWarning'), {
            dangerouslyUseHTMLString: true
          })
        } else {
          this.$message({ showClose: true, message: res.message, type: 'warning'})
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(this.$t('thirdParty.unbindingFailed') + params.platform.toUpperCase())
      }).finally(() => {
        this.accountList[idx].loading = false
      })
    },
    accountChange(params, idx) {
      this.accountList[idx].loading = true
      this.$API.accountChange(params).then(res => {
        if (res.code === 0) {
          this.accountRadio = this.accountList[idx].type
          this.$message({ showClose: true, message: res.message, type: 'success'})
          this.getAccountList()
        } else {
          this.$message({ showClose: true, message: res.message, type: 'warning'})
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(this.$t('thirdParty.unbindingFailed') + params.platform.toUpperCase())
      }).finally(() => {
        this.accountList[idx].loading = false
      })
    },
    setPathToSession(name, from) {
      if (window.sessionStorage) {
        sessionStorage.setItem(name, from)
      } else {
        console.log('don\'t support sessionStorage')
      }
    },
    // 绑定方法
    async bindFunc(type, typename, idx) {
      if (this.accountList[idx].loading) return
      this.accountList[idx].loading = true

      if (type === 'email') {
        if (!this.isLogined) return this.$store.commit('setLoginModal', true)
        // const url = 'http://localhost:8080/login/email'
        const url = `${window.location.origin}/login/email`
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
        openRequestedPopup(url, 'buildEmail')
      } else if (type === 'weixin') {
        // 判断是否在微信中
        if (this.$utils.isInWeixin()) {
          this.setPathToSession('wechatFrom', 'buildAccount')
          this.$router.push({ name: 'login-weixin' })
        } else {
          this.$message(this.$t('请在微信内操作'))
        }
      } else if (type === 'eth') {
        try {
          await this.$store.dispatch('metamask/fetchAccount')
          const { signature, msgParams } = await getSignatureForLogin('Bind')
          // console.log('🚀', signature, msgParams)
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publickey: this.metamask.account,
            sign: signature,
            msgParams
          }, idx)
        } catch (error) {
          console.log(error)
          if (error.message && error.code === 4001) {
            if (error.message && error.message.includes('User denied account authorization')) this.$message.warning(this.$t('thirdParty.userDeniedAccountAuthorization'))
            else if (error.message && error.message.includes('MetaMask Message Signature: User denied message signature')) this.$message.warning(this.$t('thirdParty.rejectSigningRequest'))
            else this.$message.warning(this.$t('thirdParty.signingFailed'))
          } else if (error.message) {
            this.$message({ showClose: true, message: `请在钱包环境下操作,  错误信息${error.message}`, type: 'warning'})
            console.log(error.message)
          }
          else {
            this.$message.warning(`请在钱包环境下操作,  错误信息${error.toString()}`)
            console.log(error.toString())
          }
        }
      } else if (type === 'eos') {
        try {
          // connect
          if (!this.scatter.isConnected) {
            const result = await this.$store.dispatch('scatter/connect')
            if (!result) throw new Error(this.$t('thirdParty.scatterConnectionFailed'))
          }
          if (!this.scatter.isLoggingIn) {
            const result = await this.$store.dispatch('scatter/login')
            if (!result) throw new Error(this.$t('thirdParty.scatterLoginFailed'))
          }
          // get currentUsername
          const currentUsername = await this['scatter/currentUsername'] || ''
          if (!currentUsername) throw new Error('Scatter ' + this.$t('thirdParty.failedGetAccount'))
          // signature
          // 没有扩展
          const { publicKey, signature, username } = await this.$store.dispatch('scatter/getSignature', { mode: 'Auth', rawSignData: [currentUsername] })
          // console.log('🚀', signature)
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publickey: publicKey,
            sign: signature,
            username: username
          }, idx)
        } catch (error) {
          // 因为之前的base scatter原因 第一次登录连接会失败, 下面重复一次 如果修改请同步修改 谢谢
          try {
          // connect
            if (!this.scatter.isConnected) {
              const result = await this.$store.dispatch('scatter/connect')
              if (!result) throw new Error(this.$t('thirdParty.scatterConnectionFailed'))
            }
            if (!this.scatter.isLoggingIn) {
              const result = await this.$store.dispatch('scatter/login')
              if (!result) throw new Error(this.$t('thirdParty.scatterLoginFailed'))
            }
            // get currentUsername
            const currentUsername = await this['scatter/currentUsername'] || ''
            if (!currentUsername) throw new Error(this.$t('thirdParty.scatterFailedGetAccount'))
            // signature
            // 没有扩展
            const { publicKey, signature, username } = await this.$store.dispatch('scatter/getSignature', { mode: 'Auth', rawSignData: [currentUsername] })
            // console.log('🚀', signature)
            await this.accountBild({
              platform: type.toLocaleLowerCase(),
              publickey: publicKey,
              sign: signature,
              username: username
            }, idx)
          } catch (error) {
            console.log(error)
            if (error.isError) {
            // User rejected the signature request
              this.$message.warning(this.$t('thirdParty.rejectSigningRequest'))
            } else if (error.toString().includes('\'name\' of null')) this.$message.warning(this.$t('thirdParty.unableToConnect'))
            else if (error.message && error.message.includes('The user did not allow this app to connect to their Scatter')) this.$message.warning(this.$t('thirdParty.scatterAccessDenied'))
            else {
              this.$message.warning(`请在钱包环境下操作,  错误信息${error.toString()}`)
              console.log(error.toString())
            }
          }
        }
      } else if (type === 'ont') {
        try {
          const getAccount = await this.$store.dispatch('ontology/getAccount')
          if (!getAccount) throw new Error('Ont ' + this.$t('thirdParty.failedGetAccount'))
          // 没有扩展
          const { publicKey, signature, username } = await this.$store.dispatch('ontology/getSignature', { mode: 'Auth', rawSignData: [getAccount] })
          // console.log('🚀', signature)
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publickey: publicKey,
            sign: signature,
            username: username
          }, idx)
        } catch (error) {
          console.log(error)
          let errText = ''
          if (error.message && error.message.includes('Could not establish connection')) errText = this.$t('thirdParty.couldNotEstablishConnection')
          else if (error === 'CANCELED') errText = this.$t('thirdParty.cancelSigningRequest')
          else errText = this.$t('thirdParty.rejectSigningRequest')

          this.$message.warning(`请在钱包环境下操作,  错误信息${errText}`)

        }
      } else if (type === 'vnt') {
        try {
          const username = await this.$store.dispatch('vnt/bind')
          if (!username) throw new Error('Vnt' + this.$t('thirdParty.failedGetAccount'))
          await this.accountBild({
            platform: type.toLocaleLowerCase(),
            publickey: 'vnt',
            sign: 'vnt',
            username: username
          }, idx)
        } catch(e) {
          this.$message.warning(`请在钱包环境下操作,  错误信息${e.toString()}`)
        }
      } else if (type === 'github') {
        if (this.testDomain()) {
          this.setPathToSession('githubFrom', 'buildAccount')
          this.$router.push({
            name: 'login-github'
          })
        }
      } else if (type === 'telegram') {
        if (this.testDomain()) {
          this.$router.push({ name: 'login-telegram' })
        }
      } else if (type === 'twitter') {
        if (this.testDomain()) {
          this.$router.push({ name: 'login-twitter' })
        }
      } else if (type === 'google') {
        if (this.testDomain()) {
          this.$router.push({ name: 'login-google' })
        }
      } else if (type === 'facebook') {
        if (this.testDomain()) {
          this.$router.push({ name: 'login-facebook' })
        }
      } else this.$message.warning(this.$t('thirdParty.pcDoesNotSupportBinding'))

      this.accountList[idx].loading = false
    },
    // 解绑
    unbindFunc(type, typename, idx) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (!this.accountList[idx].status) return this.$message.warning(this.$t('thirdParty.pleaseBindAccountFirst'))
      if (type === 'email') {
        this.$prompt(this.$t('thirdParty.whetherToUnbind'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          inputValue: '',
          inputPlaceholder: this.$t('rule.passwordMessage'),
          inputType: 'password', // password 会默认填充账号(浏览器机制) 暂时明文显示吧
          inputValidator: function (value) {
            if (!value) return false
            else return true
          },
          inputErrorMessage: this.$t('rule.passwordMessage')
        }).then(({ value }) => {
          this.accountUnbild({
            platform: this.accountList[idx].type,
            account: this.accountList[idx].username,
            password: value
          }, idx)
        })
      } else {
        this.$confirm(this.$t('thirdParty.whetherToUnbind'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.accountUnbild({
            platform: type.toLocaleLowerCase(),
            account: this.accountList[idx].username
          }, idx)
        })
      }
    },
    // 绑定账号
    buildAccount: debounce(function (type, typename, idx) {
      if (this.accountList[idx].disabled) return
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      // if (this.accountList[idx].is_main === 1) return this.$message.warning('主账号不允许绑定或解除')
      if (this.accountList[idx].status) {
        this.unbindFunc(type, typename, idx)
      } else {
        this.bindFunc(type, typename, idx)
      }
    }, 300),
    // 得到账号列表
    getAccountList() {
      this.$API.accountList().then(res => {
        if (res.code === 0) {
          // console.log(res)
          this.accountList.map(i => {
            const filterPlatform = res.data.filter(j => j.platform === i.type)
            // console.log(filterPlatform)
            if (filterPlatform.length > 0) {
              i.username = filterPlatform[0].account
              i.status = filterPlatform[0].status
              i.is_main = filterPlatform[0].is_main
            } else {
              i.username = ''
              i.status = false
              i.is_main = 0
            }

            if (i.is_main === 1) this.accountRadio = i.type
          })
        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 修改账号绑定
    accountChangeFunc(label, idx) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (!this.accountList[idx].status) return this.$message.warning(this.$t('thirdParty.unableToSetMasterAccount'))
      if (label === 'email') {
        this.$prompt(this.$t('thirdParty.enterYourEmailPassword'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          inputValue: '',
          inputPlaceholder: this.$t('rule.passwordMessage'),
          inputType: 'password', // password 会默认填充账号(浏览器机制) 暂时明文显示吧
          inputValidator: function (value) {
            if (!value) return false
            else return true
          },
          inputErrorMessage: this.$t('rule.passwordMessage')
        }).then(({ value }) => {
          this.accountChange({
            platform: this.accountList[idx].type,
            account: this.accountList[idx].username,
            password: value
          }, idx)
        })
      } else {
        this.$confirm(this.$t('thirdParty.whetherToSwitchAccounts'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          console.log(this.accountList[idx])
          this.accountChange({
            platform: this.accountList[idx].type,
            account: this.accountList[idx].username
          }, idx)
        })
      }
    },
    // 检测域名
    testDomain() {
      try {
        let IO = process.env.VUE_APP_DOMAIN_IO
        let isIo = this.$utils.isDomain(IO)
        if (!isIo) {
          this.$message(`请使用非微信浏览器访问 ${IO} 使用该功能`)
        }
        return isIo
      } catch (e) {
        console.log(e)
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
}
.list-account {
  display: flex;
  align-items: center;
  max-width: 335px;
  width: calc(100% - 80px); // 76px + 偏差
  // height: 40px;
  background-color: #eee;
  color: #fff;
  border-radius: 6px;
  margin: 10px 0;
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
  &.weixin {
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
  &.telegram {
    background-color: #4d9afd;
    &:hover {
      background-color: mix(#000, #4d9afd, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.twitter {
    background-color: #00ACED;
    &:hover {
      background-color: mix(#000, #00ACED, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.google {
    background-color: #4285F4;
    &:hover {
      background-color: mix(#000, #4285F4, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }
  &.facebook {
    background-color: #4267B2;
    &:hover {
      background-color: mix(#000, #4267B2, 20%);
    }
    .icon {
      font-size: 20px;
    }
  }

  &[data-disabled="true"] {
    cursor: not-allowed;
    background-color: #dadada;
    &:hover {
      background-color: #dadada;
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
  &[data-disabled="true"].bind {
    .correct {
      display: none;
    }
    .username {
      display: block;
    }
    &:hover {
      .correct {
        display: none;
      }
      .username {
        display: block;
      }
      .close,
      .close_thin {
        display: none;
      }
    }
  }
  /deep/ .el-loading-mask {
    z-index: 1;
  }
}
.list-p{
  font-size: 12px;
  color: #555555;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 10px;
}
</style>
