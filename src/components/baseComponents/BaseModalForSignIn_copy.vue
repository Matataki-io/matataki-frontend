<template>
  <Modal v-model="showModaCopy" footer-hide class-name="modalCenter" @on-visible-change="change">
    <div class="info-content">
      <p class="info-content-title">{{ modalText.text }}</p>

      <div class="modal-login">
        <div v-for="(item, index) in idProvider" :key="index" class="modal-body">
          <div class="modal-body-content">
            <div class="modal-body-head">支持钱包</div>
            <div class="modal-wallet">
              <a
                v-for="(itemWallet, indexWallet) in item.wallet"
                :key="indexWallet"
                :href="itemWallet.href"
                target="_blank"
              >
                <img :src="itemWallet.url" :alt="itemWallet.alt" />
              </a>
            </div>
            <div class="modal-logo">
              <div
                class="modal-logo-button"
                :class="'active' + index"
                @click="walletLogin(item.type)"
              >
                <img :src="item.url" :alt="item.title" />
                <span>{{ item.title }}</span>
              </div>
            </div>
          </div>
          <a class="modal-doc" target="_blank" :href="item.doc.href">{{ item.doc.title }}</a>
        </div>
      </div>
      <Divider>或者</Divider>
      <div
        class="modal-logo-button"
        :class="'active2'"
        style="text-align: center;"
        @click="walletLogin('GitHub')"
      >
        <img :src="iconGithub" :alt="'iconGithub'" />
      </div>
      <div v-if="modalLoading" class="modal-loading">
        <van-loading type="spinner" color="#1989fa" />
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import iconEOS from '@/assets/img/icon_logo_eos.svg'
import iconTokenpocket from '@/assets/img/icon_tokenpocket.svg'
import iconMathwallet from '@/assets/img/icon_mathwallet.svg'
import iconScatter from '@/assets/img/icon_scatter.svg'
import iconONT from '@/assets/img/icon_logo_ont.svg'
import iconCyano from '@/assets/img/icon_cyano.svg'
import iconLeafwallet from '@/assets/img/icon_leafwallet.svg'
import iconChallte from '@/assets/img/icon_challte.svg'
import iconMeet from '@/assets/img/icon_meet.svg'
import iconGithub from '@/assets/img/icon_logo_github.svg'
import iconOnto from '@/assets/img/icon_logo_onto.svg'
import iconImtoken from '@/assets/img/icon_logo_imtoken.svg'

export default {
  name: 'BaseModalForSignIn',
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['userConfig']),
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    showModal(newVal) {
      this.showModaCopy = newVal
    }
  },
  data() {
    return {
      showModaCopy: this.showModal,
      modalLoading: false,
      modalText: {
        text: '选择授权方式'
      },
      iconGithub,
      idProvider: [
        {
          url: iconEOS,
          title: 'EOS登录',
          type: 'EOS',
          wallet: [
            {
              url: iconTokenpocket,
              href: 'https://www.tokenpocket.pro/',
              alt: 'https://www.tokenpocket.pro/'
            },
            {
              url: iconScatter,
              href: 'https://get-scatter.com/',
              alt: 'https://get-scatter.com/'
            },
            {
              url: iconChallte,
              href: 'http://eblock.io/',
              alt: 'http://eblock.io/'
            },
            {
              url: iconMathwallet,
              href: 'http://www.medishares.org/',
              alt: 'http://www.medishares.org/'
            },
            {
              url: iconLeafwallet,
              href: 'https://www.leafwallet.io/',
              alt: 'https://www.leafwallet.io/'
            },
            {
              url: iconMeet,
              href: 'https://meet.one/',
              alt: 'https://meet.one/'
            },
            {
              url: iconImtoken,
              href: 'https://token.im/download',
              alt: 'https://token.im/download'
            }
          ],
          doc: {
            title: '《如何使用EOS登录》',
            href: 'https://smartsignature.io/article/515'
          }
        },
        {
          url: iconONT,
          title: 'ONT登录',
          type: 'ONT',
          wallet: [
            {
              url: iconOnto,
              href: 'https://onto.app/',
              alt: 'https://onto.app/'
            },
            {
              url: iconCyano,
              href:
                'https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm',
              alt:
                'https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm'
            },
            {
              url: iconMathwallet,
              href: 'http://www.medishares.org/',
              alt: 'http://www.medishares.org/'
            }
          ],
          doc: {
            title: '《如何使用ONT登录》',
            href: 'https://smartsignature.io/article/516'
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions(['signIn']),
    change(status) {
      if (this.modalLoading) this.modalLoading = false
      this.showModaCopy = status
      this.$emit('changeInfo', status)
    },
    async walletLogin(type) {
      this.modalLoading = true
      if (type === 'GitHub') {
        this.$router.push({ name: 'Login' })
        return
      }
      await this.signInx(type)
      this.modalLoading = false
      this.change(false)
    },
    async signInx(type) {
      try {
        await this.signIn({ idProvider: type })
        this.$backendAPI.accessToken = this.currentUserInfo.accessToken
      } catch (error) {
        try {
          await this.signIn({ idProvider: type })
          this.$backendAPI.accessToken = this.currentUserInfo.accessToken
        } catch (err) {
          console.log(err)
          this.$toast.fail({
            duration: 1000,
            message: '登陆失败'
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.info-content {
  margin: 0 30px;
  transition: all 0.3s;
  &-title {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
    margin: 20px 0 48px;
  }

  .modal-login {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .modal-body {
    flex: 0 0 50%;
    text-align: center;
    margin: 0 14px;
    transition: all 0.3s;
    &-content {
      background-color: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 0 14px 0;
      height: 220px;
    }

    &-head {
      width: 100%;
      background: #e6e6e6;
      padding: 7px 0;
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
    }

    .modal-logo {
      flex: 1;
      display: flex;
      align-items: flex-end;
      width: 100%;
      padding: 0 20px;
      &-button {
        text-align: center;
        color: #fff;
        margin: 16px 0 0;
        padding: 0;
        flex: 1;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #eee;
        &.active0 {
          background: #444;
        }
        &.active1 {
          background: #4d9afd;
        }
        img {
          height: 16px;
          padding: 0;
          margin: 8px 8px 8px 0;
          cursor: pointer;
          box-sizing: border-box;
        }
        span {
          font-size: 14px;
          font-weight: 400;
          padding: 0;
          margin: 0;
        }
      }
    }
    .modal-wallet {
      border-radius: 16px;
      padding: 0;
      margin: 0;
      text-align: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 120px;
      flex-wrap: wrap;
      a {
        display: inline-block;
        padding: 0;
        width: 28px;
        height: 28px;
        margin: 5px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .modal-doc {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 118, 255, 1);
      margin: 34px 0 28px 0;
      display: inline-block;
    }
  }
  .modal-loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.1);
  }
}

@media screen and (max-width: 400px) {
  .info-content {
    margin: 0 10px;
    .modal-body {
      margin: 0 4px;
    }
  }
}
</style>
