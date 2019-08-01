<template>
  <header class="header home-fixed" :style="customizeHeaderBcComputed">
    <div class="home-head mw">
      <div class="head-flex">
        <a href="/"><img class="logo" :src="customizeHeaderLogoColorComputed" alt="logo"></a>
        <!-- nav -->
        <a
          v-for="(item, index) in nav"
          :key="index"
          href="javascript:;"
          class="nav"
          :style="customizeHeaderTextColorComputed"
          :class="$route.name === item.url && 'active'"
          @click="togglePage(item.url)"
        >
          {{ item.title }}
        </a>
      </div>

      <div class="head-flex">
        <svg-icon
          class="create"
          icon-class="write"
          :style="customizeHeaderIconColorComputed"
          @click="$router.push({ name: 'publish', params: { id: 'create' } })"
        />
        <el-dropdown v-if="isLogined">
          <div class="home-head-avatar" @click="$emit('login')">
            <img v-if="avatar" :src="avatar" alt="avatar">
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item>
              <n-link class="link" :to="{name: 'user-id', params:{id: currentUserInfo.id}}">
                {{ currentUserInfo.nickname || currentUserInfo.name }}
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <n-link class="link" :to="{name: 'setting-id', params:{id: currentUserInfo.id}}">
                我的账户
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link class="link" :to="{name: 'setting-id-original', params:{id: currentUserInfo.id}}">
                我的原创
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link class="link" :to="{name: 'setting-id-investment', params:{id: currentUserInfo.id}}">
                我的投资
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link class="link" :to="{name: 'setting-id-draft', params:{id: currentUserInfo.id}}">
                我的草稿
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link class="link" :to="{name: 'setting-id-buy', params:{id: currentUserInfo.id}}">
                购买记录
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="link" @click="btnsignOut">
                退出
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <a
          v-else
          href="javascript:void(0);"
          class="home-head-notlogin"
          @click="login"
        >登录</a>
        <slot name="more" />
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import homeLogo from '@/assets/img/home_logo.png'
import homeLogoWhile from '@/assets/img/home_logo_white.png'
export default {
  name: 'HomeHead',
  props: {
    // 自定义头部背景
    customizeHeaderBc: {
      type: String,
      default: '#fff'
    },
    // 自定义头部文字颜色
    customizeHeaderTextColor: {
      type: String,
      default: '#b2b2b2'
    },
    // 自定义头部Icon颜色
    customizeHeaderIconColor: {
      type: String,
      default: '#000'
    },
    // 自定义头部logo
    customizeHeaderLogo: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      nav: [
        {
          title: '文章',
          url: 'index'
        },
        {
          title: '商品',
          url: 'commodity'
        }
      ],
      avatar: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    customizeHeaderBcComputed() {
      return {
        backgroundColor: this.customizeHeaderBc,
        border: '1px solid ' + this.customizeHeaderBc
      }
    },
    customizeHeaderTextColorComputed() {
      return 'color: ' + this.customizeHeaderTextColor
    },
    customizeHeaderIconColorComputed() {
      return 'color: ' + this.customizeHeaderIconColor
    },
    customizeHeaderLogoColorComputed() {
      if (this.customizeHeaderLogo === 'white') return homeLogoWhile
      else return homeLogo
    }
  },
  watch: {
    isLogined(newState) {
      if (newState) this.refreshUser()
    }
  },
  created() {
    const { isLogined, refreshUser } = this
    if (isLogined) refreshUser()

    console.log(this.$route)
  },
  methods: {
    ...mapActions(['getCurrentUser', 'signOut']),
    async refreshUser() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$backendAPI.getAvatarImage(avatar)
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    togglePage(url) {
      this.$router.push({
        name: url
      })
    },
    btnsignOut() {
      if (confirm('确定退出吗?')) {
        this.$utils.deleteAllCookies()
        window.location.reload()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  box-sizing: border-box;
}
.home-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
}
.home-head {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  text-decoration: none;
  .head-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    width: 114px;
  }
  .create {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-right: 40px;
    color: #000;
  }
  &-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #eee;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-notlogin {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 2px;
    padding: 6px 12px;
    background: #000;
    border-radius: 6px;
    text-decoration: none;
  }
  .nav {
    font-size: 20px;
    color: rgba(178, 178, 178, 1);
    margin: 0 0 0 40px;
    position: relative;
    text-align: center;
    transition: all 0.18s ease-in-out;
    font-weight: 500;
    text-decoration: none;
    &.active {
      color: #000 !important;
    }
  }
}

</style>

<style lang="less">
// 覆盖下拉框
.user-dorpdown {
  max-width: 150px;
  box-sizing: border-box;
  &.el-dropdown-menu {
    padding: 0;
    border: noen;
  }
  .el-dropdown-menu__item {
    font-size: 14px;
    letter-spacing: 1px;
    color: #333;
    line-height: 28px;
    padding-top: 8px;
    padding-bottom: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:nth-of-type(1) {
      border-radius: 4px 4px 0 0;
    }
    &:nth-last-of-type(1) {
      border-radius: 0 0 4px 4px;
    }
  }
  .el-dropdown-menu__item--divided {
    margin-top: 0;
  }
  .el-dropdown-menu__item--divided:before {
    display: none;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover  {
    background-color: @blue;
    color: #fff;
    .link {
      color: #fff;
    }
  }
}
</style>
<style lang="less" scoped>
.link {
  display: block;
  text-decoration: none;
  color: #333;
}
</style>
