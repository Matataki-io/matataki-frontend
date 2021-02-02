<template>
  <section class="login-page">
    <section class="inner">
      <section class="main">
        <p class="method">{{ $t('weChat-scan-code-login') }}</p>
        <section class="wrapper wechat-login">
          <section class="wechat-login">
            <section v-loading="loading" class="inner invalid">
              <img v-if="qrCodeUrl" :src="qrCodeUrl" :alt="$t('qr-code')">
              <section v-if="invalid <= 0" class="invalid" @click="refresh">
                <section>
                  <i class="el-icon-refresh icon" />
                  <p>{{ $t('qr-code-has-expired-click-refresh') }}</p>
                </section>
              </section>
            </section>
          </section>
        </section>
        <!-- <div class="third-methods"></div> -->
        <p class="follow-public-account">{{ $t('follow-the-Andoromeda-public-account-you-can-log-in') }}</p>
      </section>
      <img src="../../assets/img/login_auth.svg" alt="书桌" class="decoration">
    </section>
  </section>
</template>

<script>
export default {
  layout: 'empty',
  data() {
    return {
      loading: false,
      qrCodeUrl: '', // 二维码
      invalid: 60, // 过期时间
      timer: null
    }
  },
  created() {
    if (process.browser) {
      this.qrCode()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 生成二维码
    async qrCode() {
      this.loading = true
      const res = await this.$utils.factoryRequest(this.$API.apiWeChatQRCode({ source: 1 }))
      if (res && res.data && res.data.qrcode) {
        this.qrCodeUrl = res.data.qrcode
        this.loginByWx(res.data.scene)
      } else {
        console.log('生成二维码失败', res)
        this.invalid = 0
      }
      this.loading = false
    },
    // 轮询登录
    async loginByWx(scene) {
      clearInterval(this.timer)
      this.timer = setInterval(async () => {
        this.invalid--

        if (this.invalid <= 0) {
          clearInterval(this.timer)
        }
        const res = await this.$utils.factoryRequest(this.$API.apiLoginByWx({ scene }))
        if (res && res.data) {

          this.$store.commit('setAccessToken', res.data)
          this.$store.commit('setUserConfig', { idProvider: 'weixin' })
          clearInterval(this.timer)
          let to = this.$route.query.to || ''

          if (to) {
            window.location.href = decodeURIComponent(to)
          } else {
            this.$router.push({ name: 'article' })
          }
        }
      }, 1000)

    },
    // 刷新二维码
    refresh() {
      this.qrCode()
      this.invalid = 60
    }
  }
}
</script>


<style lang="less" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fff;
  .inner {
    display: flex;
    align-items: flex-start;

    .main {
      width: 346px;
      overflow: hidden;
      .method {
        font-size: 32px;
        font-weight: 600;
        padding: 0;
        margin: 0;
      }
      .wrapper {
        margin-top: 50px;
        display: flex;
        flex-wrap: nowrap;
        transition: transform 0.3s;
        > section {
          width: 100%;
          flex-shrink: 0;
        }
        &.wechat-login {
          // transform: translateX(calc(-100% - 10px));
          transform: translateX(-10px);
          .inner {
            width: 220px;
            height: 220px;
            overflow: hidden;
            position: relative;
            & > img {
              width: 100%;
              transition: transform 0.3s;
              transform: translateX(0);
            }
            > .invalid {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: hsla(0, 0%, 100%, 0.86);
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              transition: background-color 0.3s;
              animation: invalid 0.5s;
              &:hover {
                background-color: hsla(0, 0%, 100%, 0.9);
                .icon {
                  transform: rotate(90deg);
                }
              }
              > section {
                text-align: center;
              }
              p {
                font-size: 12px;
                font-weight: 600;
                padding: 0;
                margin: 14px 0 0 0;
              }
              .icon {
                font-size: 30px;
                display: inline-block;
                transition: transform 0.3s;
                font-weight: bold;
              }
            }
          }
        }
      }
      .follow-public-account {
        margin-top: 80px;
        font-size: 12px;
        color: #9b9b9f;
      }
    }
  }

  .decoration {
    margin-left: 200px;
  }
}

@media screen and (max-width: 1440px) {
  .login-page .inner .decoration {
    margin-left: 50px;
  }
}
@media screen and (max-width: 1440px) {
  .decoration {
    width: 500px;
  }
}

@media screen and (max-width: 900px) {
  .decoration {
    display: none;
  }

  .login-page .inner {
    text-align: center;
  }
  .login-page .inner .main .wrapper.wechat-login {
    transform: none;
  }
  .login-page .inner .main .wrapper.wechat-login .inner {
    margin: 0 auto;
  }
}

@keyframes invalid {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-6px);
  }

  50% {
    transform: translateX(0);
  }

  75% {
    transform: translateX(6px);
  }

  to {
    transform: translateX(0);
  }
}
</style>