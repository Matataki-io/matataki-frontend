<template>
  <header class="header home-fixed" :style="customizeHeaderBcComputed">
    <div class="home-head">
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
        <div class="search">
          <input
            v-model="searchInput"
            type="text"
            class="input"
            @keyup.enter="jutmpToSearch"
            @focus="searchFcous = true"
            @blur="inputBlur"
          >
          <svg-icon
            class="icon-search"
            icon-class="search"
            @click.stop="jutmpToSearch"
          />
          <ul v-if="searchRecommendList.length !== 0 && searchFcous" class="search-list">
            <li v-for="(item, index) in searchRecommendList" :key="index" @click.stop="jutmpToSearchRecommend(item.word)">
              <a href="javascript:;">{{ item.word }}</a>
            </li>
          </ul>
        </div>
        <svg-icon
          v-if="isLogined"
          class="create"
          icon-class="write"
          :style="customizeHeaderIconColorComputed"
          @click="writeP"
        />
        <span v-else class="integral">新用户登录领100SS积分</span>
        <el-popover
          v-if="isLogined"
          v-model="visible"
          placement="bottom"
          width="300"
          trigger="manual"
        >
          <p>请用鼠标指向用户头像并点击「我的账户」前往积分页面查看积分详情。</p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="$emit('popoverVisible', false)">
              知道了
            </el-button>
          </div>

          <el-dropdown
            slot="reference"
          >
            <div class="home-head-avatar" @click="$emit('login')">
              <avatar :size="'30px'" :src="avatar" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dorpdown">
              <el-dropdown-item>
                {{ currentUserInfo.nickname || currentUserInfo.name }}
              </el-dropdown-item>
              <el-dropdown-item divided>
                <n-link class="link" :to="{name: 'user-account', params:{id: currentUserInfo.id}}">
                  我的账户
                </n-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <n-link class="link" :to="{name: 'user-id', params:{id: currentUserInfo.id}}">
                  我的主页
                </n-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <n-link class="link" :to="{name: 'user-setting', params:{id: currentUserInfo.id}}">
                  设置
                </n-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="link" @click="btnsignOut">
                  退出
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-popover>

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
import avatar from '@/components/avatar/index.vue'

import { strTrim } from '@/utils/reg'

export default {
  name: 'HomeHead',
  components: {
    avatar
  },
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
    },
    // 搜索内容
    searchQueryVal: {
      type: String,
      default: ''
    },
    // 用户提示
    popoverVisible: {
      type: Boolean,
      default: false
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
          url: 'shop'
        }
      ],
      avatar: '',
      searchFcous: false,
      searchInput: this.searchQueryVal,
      visible: this.popoverVisible,
      searchRecommendList: []
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
    },
    // 监听提示状态
    popoverVisible(newVal) {
      this.visible = newVal
    },
    searchQueryVal(newVal) {
      this.searchInput = newVal
    }
  },
  created() {
    const { isLogined, refreshUser } = this
    if (isLogined) refreshUser()
  },
  mounted() {
    this.getRecommend()
  },
  methods: {
    ...mapActions(['getCurrentUser', 'signOut']),
    writeP() {
      if (this.isLogined) this.$router.push({ name: 'publish', params: { id: 'create' } })
      else {
        this.$message({ message: '请先登录', type: 'info', customClass: 'zindex-3000' })
        this.login()
      }
    },
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
        this.$utils.delCookie('ACCESS_TOKEN')
        // this.$utils.deleteAllCookies()
        this.$router.push('/')
        window.location.reload()
      }
    },
    // 跳转搜索
    jutmpToSearch() {
      if (!strTrim(this.searchInput)) return this.$message.warning('搜索内容不能为空')

      const name = this.$route.name
      this.$router.push({
        name: name === 'search-shop' || name === 'search-user' ? name : 'search',
        query: {
          q: strTrim(this.searchInput)
        }
      })
      this.$emit('search', strTrim(this.searchInput))
    },
    // 推荐跳转
    jutmpToSearchRecommend(word) {
      this.searchInput = word
      this.jutmpToSearch()
    },
    // 失去焦点
    inputBlur() {
      setTimeout(() => {
        this.searchFcous = false
      }, 150)
    },
    // 获得推荐
    async getRecommend() {
      await this.$API.searchRecommend({ area: 1 })
        .then(res => {
          if (res.code === 0) this.searchRecommendList = res.data
        })
        .catch(err => { console.log(err) })
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
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

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
    margin: 0 40px;
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
    font-weight: bold;
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
    font-weight: bold;
    text-decoration: none;
    &.active {
      color: #000 !important;
    }
  }
}

.search {
  position: relative;
  width:248px;
  background:rgba(241,241,241,1);
  border-radius:4px;
  display: flex;
  box-sizing: border-box;
  .input {
    flex: 1;
    padding: 11px 40px 11px 10px;
    border: none;
    outline: none;
    background-color: transparent;

    font-size:14px;
    color:rgba(0,0,0,1);
  }
  .icon-search {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
  }
}
.search-list {
  position: absolute;
  top: 50px;
  left: 0;
  background: #fff;
  width: 100%;
  max-height: 280px;
  background: rgba(255,255,255,1);
  box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.16);
  border-radius: 4px;
  overflow: auto;
  padding: 0;
  margin: 0;
  li {
    list-style: none;
    &:hover {
      background-color: #f1f1f1;
    }
    a {
      font-size: 14px;
      color: #000;
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
      letter-spacing: 1px;
      padding: 14px 10px;
    }
  }
}

.integral {
  font-size:16px;
  font-weight:500;
  color:rgba(28,156,254,1);
  margin: 0 20px;
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
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
