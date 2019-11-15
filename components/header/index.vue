<template>
  <!-- :style="customizeHeaderBcComputed" -->
  <header class="header home-fixed">
    <div class="home-head">
      <div class="head-flex">
        <a class="logo-link" href="/"><img :src="customizeHeaderLogoColorComputed" class="logo" alt="logo"></a>
        <!-- nav -->
        <template v-for="(item, index) in nav">
          <el-tooltip
            v-if="item.url === 'exchange'"
            :key="index"
            class="item"
            effect="dark"
            content="粉丝币交易所"
            placement="bottom"
          >
            <router-link
              :style="customizeHeaderTextColorComputed"
              :class="$route.name === item.url && 'active'"
              :to="{name: item.url}"
              class="nav"
            >
              {{ item.title }}
              <sup v-if="item.sup" style="color: orange;">{{ item.sup }}</sup>
            </router-link>
          </el-tooltip>
          <router-link
            v-else
            :key="index"
            :style="customizeHeaderTextColorComputed"
            :class="$route.name === item.url && 'active'"
            :to="{name: item.url}"
            class="nav"
          >
            {{ item.title }}
            <sup v-if="item.sup" style="color: orange;">{{ item.sup }}</sup>
          </router-link>
        </template>
        <!-- <a
          class="nav"
          href="javascript:;"
          @click="writeP"
        >
          导入文章
        </a> -->
      </div>

      <div class="head-flex">
        <div class="search">
          <input
            v-model="searchInput"
            :placeholder="$t('home.searchPlaceholder')"
            @keyup.enter="jutmpToSearch"
            @focus="searchFcous = true"
            @blur="inputBlur"
            type="text"
            class="input"
          >
          <svg-icon
            @click.stop="jutmpToSearch"
            class="icon-search"
            icon-class="search"
          />
          <ul v-if="searchRecommendList.length !== 0 && searchFcous" class="search-list">
            <li v-for="(item, index) in searchRecommendList" :key="index" @click.stop="jutmpToSearchRecommend(item.word)">
              <a href="javascript:;">{{ item.word }}</a>
            </li>
          </ul>
        </div>

        <el-popover
          v-model="visible"
          placement="bottom"
          width="300"
          trigger="manual"
        >
          <p>{{ $t('home.pointPopover') }}</p>
          <div style="text-align: right; margin: 0">
            <el-button @click="$emit('popoverVisible', false)" class="el-button--purple" type="primary" size="mini">
              {{ $t('home.pointPopoverConfirm') }}
            </el-button>
          </div>
          <point slot="reference" />
        </el-popover>
        <el-tooltip class="item" effect="dark" content="导入文章" placement="bottom">
          <svg-icon
            :style="customizeHeaderIconColorComputed"
            @click="postImport"
            class="create"
            icon-class="import"
          />
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="写文章" placement="bottom">
          <svg-icon
            :style="customizeHeaderIconColorComputed"
            @click="writeP"
            class="create"
            icon-class="write"
          />
        </el-tooltip>

        <el-dropdown
          v-if="isLogined"
          class="user-menu"
        >
          <div @click="$emit('login')" class="home-head-avatar">
            <avatar :size="'30px'" :src="avatar" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item>
              <n-link :to="{name: 'user-id', params:{id: currentUserInfo.id}}" class="link">
                {{ currentUserInfo.nickname || currentUserInfo.name }}
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link :to="{name: 'account', params:{id: currentUserInfo.id}}" class="link">
                {{ $t('home.account') }}
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link :to="{name: 'tokens' }" class="link">
                我的粉丝币
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <n-link :to="{name: 'setting', params:{id: currentUserInfo.id}}" class="link">
                {{ $t('home.setting') }}
              </n-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="btnsignOut" class="link">
                {{ $t('logout') }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <a
          v-else
          @click="login"
          href="javascript:void(0);"
          class="home-head-notlogin"
        >{{ $t('login') }}</a>
        <slot name="more" />
        <language />
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import homeLogo from '@/assets/img/home_logo.png' // 因为tag页面不需要换颜色了, 可以逐步删掉props
import point from './point'
import language from './language'
import homeLogo from '@/assets/img/m_logo.png'
import homeLogoWhile from '@/assets/img/home_logo_white.png'
import avatar from '@/components/avatar/index.vue'

import { strTrim } from '@/utils/reg'

export default {
  name: 'HomeHead',
  components: {
    avatar,
    point,
    language
  },
  props: {
    // 自定义头部背景
    // customizeHeaderBc: {
    //   type: String,
    //   default: '#fff'
    // },
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
      avatar: '',
      searchFcous: false,
      searchInput: this.searchQueryVal,
      visible: this.popoverVisible,
      searchRecommendList: []
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    nav() {
      return [
        {
          title: this.$t('home.navArticle'),
          url: 'article',
          sup: ''
        },
        {
          title: this.$t('home.navShop'),
          url: 'shop',
          sup: ''
        },
        {
          title: '粉丝币',
          url: 'token',
          sup: ''
        },
        {
          title: 'Lab',
          url: 'exchange',
          sup: 'beta'
        }
      ]
    },
    // customizeHeaderBcComputed() {
    //   return {
    //     backgroundColor: this.customizeHeaderBc,
    //     border: '1px solid ' + this.customizeHeaderBc
    //   }
    // },
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
    postImport() {
      if (this.isLogined) this.$store.commit('importArticle/setImportModal', true)
      else this.login()
    },
    writeP() {
      if (this.isLogined) this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: 'create' } })
      else this.login()
    },
    async refreshUser() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$API.getImg(avatar)
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    btnsignOut() {
      if (confirm(this.$t('warning.confirmLogout'))) {
        this.$utils.delCookie('ACCESS_TOKEN')
        this.$utils.delCookie('idProvider')
        window.localStorage.clear()
        // this.$utils.deleteAllCookies()
        this.$router.push({
          name: 'index'
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    },
    // 跳转搜索
    jutmpToSearch() {
      if (!strTrim(this.searchInput)) return this.$message.warning(this.$t('warning.searchContent'))

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
  height: 60px;
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
  height: 100%;
  margin: 0 auto;

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
  .logo-link {
    margin: 0 20px 0 0;
  }
  .logo {
    width: 180px;
  }
  .create {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin: 0 20px 0 0;
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
    font-size: 18px;
    color: @gray;
    margin: 0 14px;
    text-align: center;
    transition: all 0.18s ease-in-out;
    text-decoration: none;
    display: inline-block;
    font-weight: bold;
    &.active {
      color: #000 !important;
    }
  }
}

.search {
  position: relative;
  width:200px;
  background:rgba(241,241,241,1);
  border-radius:4px;
  display: flex;
  box-sizing: border-box;
  margin: 0 10px 0 0;
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
    background-color: @purpleDark;
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
