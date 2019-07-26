<template>
  <header class="header home-fixed" :style="customizeHeaderBcComputed">
    <div class="home-head mw">
      <div class="head-flex">
        <a href="/"><img class="logo" :src="customizeHeaderLogoColorComputed" alt="logo"></a>
        <!-- nav -->
        <nuxt-link
          v-for="(item, index) in nav"
          :key="index"
          class="nav"
          :style="customizeHeaderTextColorComputed"
          :class="$route.path === item.url && 'active'"
          :to="item.url"
        >
          {{ item.title }}
        </nuxt-link>
      </div>

      <div class="head-flex">
        <svg-icon
          class="create"
          icon-class="write"
          :style="customizeHeaderIconColorComputed"
          @click="$router.push({ name: 'Publish', params: { id: 'create' } })"
        />

        <el-dropdown v-if="isLogined">
          <div class="home-head-avatar" @click="$emit('login')">
            <img v-if="avatar" :src="avatar" alt="avatar">
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item>
              xiaotiandada
            </el-dropdown-item>
            <el-dropdown-item divided>
              我的账户
            </el-dropdown-item>
            <el-dropdown-item>我的原创</el-dropdown-item>
            <el-dropdown-item>我的投资</el-dropdown-item>
            <el-dropdown-item>我的草稿</el-dropdown-item>
            <el-dropdown-item>
              购买记录
            </el-dropdown-item>
            <el-dropdown-item divided>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided>
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <a
          v-else
          href="javascript:void(0);"
          class="home-head-notlogin"
          @click="login"
        >登录</a>
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
          url: '/'
        },
        {
          title: '商品',
          url: '/commodity'
        }
      ],
      avatar: ''
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
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
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    async refreshUser() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$backendAPI.getAvatarImage(avatar)
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
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
      color: rgba(0, 0, 0, 1);
    }
  }
}

</style>

<style lang="less">
// 覆盖下拉框
.user-dorpdown {
  max-width: 140px;
  box-sizing: border-box;
  &.el-dropdown-menu {
    padding: 0;
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
  }
}
</style>
