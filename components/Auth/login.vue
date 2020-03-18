<template>
  <section
    v-loading="loading"
    class="login"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="ss-form"
    >
      <el-form-item prop="email">
        <el-input
          v-model="loginForm.email"
          :placeholder="$t('rule.loginEmailMessage')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :placeholder="$t('rule.passwordMessage')"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button
          type="primary"
          @click="submitLoginForm"
        >
          {{ $t('login') }}
        </el-button>
        <div class="bottom-tip">
          <span class="red">{{ $t('auth.firstLogin', [$point.loginNew]) }}</span>
          <!-- <a href="javascript:void(0);">忘记密码</a> |  -->
          <a
            href="javascript:void(0);"
            @click="$emit('switch')"
          >{{ $t('rule.forgetPassword') }}</a>
        </div>
      </el-form-item>
    </el-form>
    <div class="oauth-box">
      <h1 class="oauth-title">
        {{ $t('auth.otherAccount') }}
      </h1>
      <div class="oauth">
        <el-tooltip
          :content="$t('auth.vntTitle')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            class="oauth-bg bg-blue1"
            @click="walletLogin('Vnt')"
          >
            <svg-icon
              class="vnt"
              icon-class="vnt"
            />
          </div>
        </el-tooltip>

        <el-tooltip
          :content="$t('auth.eosTitle')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            class="oauth-bg bg-gray"
            @click="walletLogin('EOS')"
          >
            <svg-icon
              class="eos"
              icon-class="eos_login"
            />
          </div>
        </el-tooltip>

        <el-tooltip
          :content="$t('auth.metamaskTitle')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            class="oauth-bg bg-gray"
            @click="walletLogin('MetaMask')"
          >
            <svg-icon
              class="eos"
              icon-class="metamask"
            />
          </div>
        </el-tooltip>

        <el-tooltip
          :content="$t('auth.ontType')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            class="oauth-bg bg-blue"
            @click="walletLogin('ONT')"
          >
            <img
              src="@/assets/img/icon_logo_ont.svg"
              alt="ONT"
            >
          </div>
        </el-tooltip>
        <!-- <el-tooltip class="item" effect="dark" content="微信登录" placement="top">
          <a :href="wxloginHref" class="oauth-bg bg-green">
            <div>
              <svg-icon class="github" icon-class="weixin" />
            </div>
          </a>
        </el-tooltip>-->
      </div>
      <div class="oauth">
        <el-tooltip
          :content="$t('auth.githubTitle')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            class="oauth-bg bg-purple"
            @click="walletLogin('GitHub')"
          >
            <svg-icon
              class="github"
              icon-class="github"
            />
          </div>
        </el-tooltip>
        <el-tooltip
          :content="$t('auth.telegramTitle')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            class="oauth-bg bg-tg"
            @click="walletLogin('Telegram')"
          >
            <svg-icon
              class="github"
              icon-class="telegram"
            />
          </div>
        </el-tooltip>
        <el-tooltip
          :content="$t('auth.twitterTitle')"
          class="item"
          effect="dark"
          placement="top"
        >
          <div
            style="cursor: not-allowed;"
            class="oauth-bg bg-twitter"
            @click="walletLogin('Twitter')"
          >
            <svg-icon
              class="twitter"
              icon-class="twitter"
            />
          </div>
        </el-tooltip>
      </div>
    </div>
    <img
      v-if="referral"
      :alt="$t('auth.invite')"
      class="referral"
      src="@/assets/img/invite.png"
    >
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import { idProvider } from "./icon.js";
import { getCookie, setCookie } from '@/utils/cookie'

export default {
  name: "LoginContent",
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === "") {
        return callback(new Error(this.$t("rule.loginEmailMessage")));
      } else {
        // const res = await this.$API.verifyEmail(value)
        // if (res.data) {
        //   callback()
        // } else {
        //   callback(new Error('邮箱尚未注册'))
        // }
        callback();
      }
    };
    return {
      loginForm: {
        email: "",
        password: ""
      },
      loginRules: {
        email: [
          { validator: checkEmail, trigger: "blur" },
          {
            type: "email",
            message: this.$t("rule.emailMessage"),
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("rule.passwordMessage"),
            trigger: "blur"
          },
          {
            min: 8,
            max: 16,
            message: this.$t("rule.passwordLengthMessage", [8, 16]),
            trigger: "blur"
          }
        ]
      },
      referral: false,
      loading: false
    };
  },
  computed: {
    ...mapState(["userConfig", "loginModalShow"]),
    ...mapGetters(["currentUserInfo"]),
    wxloginHref() {
      const appid = "wx95829b6a2307300b";
      const redirectUri = `${process.env.WX_SHARE_HOST}`;
      const scope = "snsapi_login";
      return `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
    }
  },
  watch: {
    // 登录框关闭 隐藏loading
    loginModalShow(newVal) {
      if (newVal) {
        // 和移动端有点不一样, 这里借用这个func来执行 referral
        this.getReferral();
      } else {
        this.loading = false;
      }

    }
  },
  mounted() {
    if (process.browser) this.getReferral()
  },
  methods: {
    ...mapActions(["signIn"]),
    ...mapActions("vnt", ["login"]),
    ...mapActions("metamask", ["fetchAccount", "login"]),
    setPathToSession(name) {
      if (window.sessionStorage) {
        const { pathname, search, hash } = window.location
        sessionStorage.setItem(name, pathname + search + hash)
      } else {
        console.log('don\'t support sessionStorage')
      }
    },
    async walletLogin(type) {
      this.setPathToSession('githubFrom')
      if (type === "GitHub") {
        this.$router.push({
          name: "login-github"
        });
        return;
      } else if (type === "Vnt") {
        this.vntLogin();
      } else if (type === "MetaMask") {
        this.loginWithMetaMask();
      } else if (type === "Telegram") {
        this.telegramLogin();
      } else if (type === "Twitter") {
        // this.twitterLogin();
      } else await this.signInx(type);
    },
    async signInx(type) {
      try {
        await this.signIn({ idProvider: type });
        this.$store.commit("setLoginModal", false);
        this.$backendAPI.accessToken = this.currentUserInfo.accessToken;
        window.location.reload(); // 登录完成刷新一次
      } catch (error) {
        try {
          await this.signIn({ idProvider: type });
          this.$store.commit("setLoginModal", false);
          this.$backendAPI.accessToken = this.currentUserInfo.accessToken;
          window.location.reload(); // 登录完成刷新一次
        } catch (err) {
          console.log("signInx 错误", err);
          this.$message.error(this.$t("error.loginFail"));
        }
      }
    },
    async vntLogin() {
      this.loading = true;
      try {
        let res = await this.$store.dispatch("vnt/login");
        this.$store.commit("setUserConfig", { idProvider: "Vnt" });
        this.loading = false;
        this.$message.closeAll();
        this.$message.success(res);
        await this.$store.commit("setLoginModal", false);
        window.location.reload();
      } catch (error) {
        this.loading = false;
        this.$message.closeAll();
        this.$message.error(error.toString());
      }
    },
    async loginWithMetaMask() {
      this.loading = true;
      this.fetchAccount();
      try {
        let res = await this.$store.dispatch("metamask/login");
        this.$store.commit("setUserConfig", { idProvider: "MetaMask" });
        this.loading = false;
        this.$message.closeAll();
        this.$message.success(res);
        await this.$store.commit("setLoginModal", false);
        window.location.reload();
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.$message.closeAll();
        if (error.message) {
          this.$message.error(error.message);
        } else {
          this.$message.error(error.toString());
        }
      }
    },
    async telegramLogin() {
      this.$store.commit('setLoginModal', false)
      this.$router.push({ name: 'login-telegram', query: { from: 'login' } })
    },
    async twitterLogin() {
      this.$store.commit('setLoginModal', true)
      this.$store.commit('setTwitterLoginMode', 'login')
      this.$router.push({ name: 'login-twitter', query: { from: 'login' } })
    },
    // 登录提交
    submitLoginForm() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            const res = await this.$API.login({
              username: this.loginForm.email,
              password: this.loginForm.password
            });
            if (res.code === 0) {
              this.$store.commit("setAccessToken", res.data);
              this.$store.commit("setUserConfig", { idProvider: "Email" });
              this.$message.success(this.$t("success.loginSuccess"));
              this.$emit("hide");
              this.$userMsgChannel.postMessage("login")
              window.location.reload(); // 登录完成刷新一次
            } else {
              this.$message.error(this.$t("error.loginFailPasswordOrAccount"));
            }
          } catch (error) {
            this.$message.error(this.$t("error.loginFail"));
          }
        } else {
          // console.log('error submit!!')
          return false;
        }
      });
    },
    switchRegister() {
      this.$emit("switch");
    },
    // 得到邀请状态
    getReferral() {
      let search = window.location.search.slice(1)
      let searchArr = search.split('&')
      let searchFilter = searchArr.filter((i) => i.includes('referral='))
      // 有邀请id
      if (searchFilter.length) {
        setCookie('referral', searchFilter[0].slice(9))
        this.referral = true
      } else {
        let referral = getCookie('referral')
        if (referral) this.referral = true
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bottom-tip {
  width: 100%;
  font-size: 14px;
  float: right;
  line-height: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .red {
    color: #fb6877;
  }
}
.oauth-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  .oauth-title {
    font-size: 16px;
    color: #000000;
    margin: 20px 0 20px;
    font-weight: 400;
  }
  .warning-tip {
    font-size: 14px;
    color: #fb6877;
    margin: 14px 0 22px;
    font-weight: 400;
  }
  .oauth {
    margin-bottom: 10px;
    .vnt {
      font-size: 24px;
      padding-top: 2px;
      color: #fff;
    }
    .eos {
      font-size: 24px;
      color: #fff;
    }
    .github {
      font-size: 22px;
      color: #fff;
    }
    .twitter {
      font-size: 22px;
      color: #fff;
    }
    .flexCenter();
    .oauth-bg {
      cursor: pointer;
      .flexCenter();
      width: 32px;
      height: 32px;
      border-radius: 50%;
      padding: 6px;
      img {
        width: 20px;
      }
      + .oauth-bg {
        margin-left: 20px;
      }
    }
  }
}
.bg-black {
  background: #000000;
}
.bg-gray {
  background: #333;
}
.bg-blue {
  background: #4d9afd;
}
.bg-blue1 {
  background: #3289ff;
}
.bg-purple {
  background: #882592;
}
.bg-green {
  background: #44b549;
}
.bg-tg {
  background: #0088cc;
}
.bg-twitter {
  // background: #00ACED;
  background: #b2b2b2;
}

.referral {
  height: 30px;
  position: absolute;
  right: 20px;
  top: 0;
}
</style>
