<template>
  <!-- :style="customizeHeaderBcComputed" -->
  <header class="header home-fixed">
    <div class="home-head">
      <div class="head-flex">
        <a
          class="logo-link"
          href="/article"
        ><img
          :src="customizeHeaderLogoColorComputed"
          class="logo"
          alt="logo"
        ></a>
        <!-- nav -->
        <router-link
          v-for="(item, index) in nav"
          :key="index"
          :style="customizeHeaderTextColorComputed"
          :class="item.urlList.includes($route.name) && 'active'"
          :to="{name: item.url}"
          class="nav"
        >
          {{ item.title }}
          <sup
            v-if="item.sup"
            style="color: orange;"
          >{{ item.sup }}</sup>
        </router-link>
      </div>

      <div class="pc head-flex">
        <metaComponents :token-id="metaData.tokenId" :token-amount="metaData.tokenAmount" :token-symbol="metaData.tokenSymbol" />
        <div class="search">
          <input
            v-model="searchInput"
            :placeholder="$t('home.searchPlaceholder')"
            type="text"
            class="input"
            autocomplete="off"
            readonly
            onfocus="this.removeAttribute('readonly')"
            onblur="this.setAttribute('readonly', 'readonly')"
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
            <li
              v-for="(item, index) in searchRecommendList"
              :key="index"
              @click.stop="jutmpToSearchRecommend(item.word)"
            >
              <a href="javascript:;">{{ item.word }}</a>
            </li>
          </ul>
        </div>

        <el-tooltip
          v-if="isLogined"
          class="item"
          effect="dark"
          :content="$t('message-center')"
          placement="bottom"
        >
          <n-link
            class="create"
            to="/notification"
          >
            <el-badge
              :value="notifyUnreadQuantity"
              :hidden="notifyUnreadQuantity === 0"
              :max="99"
              class="item"
            >
              <svg-icon
                :style="customizeHeaderIconColorComputed"
                class="notification"
                icon-class="bell"
              />
            </el-badge>
          </n-link>
        </el-tooltip>
        <!-- <el-tooltip
          class="item"
          effect="dark"
          :content="$t('publish.importArticle')"
          placement="bottom"
        >
          <svg-icon
            :style="customizeHeaderIconColorComputed"
            class="create"
            icon-class="import"
            @click="postImport"
          />
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('header.newArticle')"
          placement="bottom"
        >
          <svg-icon
            :style="customizeHeaderIconColorComputed"
            class="create"
            icon-class="write"
            @click="writeP"
          />
        </el-tooltip> -->

        <el-dropdown v-if="isLogined" class="user-menu">
          <!-- <avatarComponents :size="'30px'" :src="avatar" class="home-head-avatar" /> -->
          <c-avatar
            :src="avatar"
            :recommend-author="user.is_recommend === 1"
            :token-user="!!tokenInfo.id"
            :level-token="1"
          />
          <el-dropdown-menu
            slot="dropdown"
            class="user-dorpdown"
          >
            <n-link
              :to="{name: 'user-id', params:{id: currentUserInfo.id}}"
              class="link border-tl-tr"
            >
              <el-dropdown-item>
                {{ currentUserInfo.nickname || currentUserInfo.name }}
              </el-dropdown-item>
            </n-link>
            <n-link
              :to="{name: 'setting', params:{id: currentUserInfo.id}}"
              class="link"
            >
              <el-dropdown-item>
                {{ $t('home.account') }}
              </el-dropdown-item>
            </n-link>
            <n-link
              :to="{name: 'dashboard'}"
              class="link"
            >
              <el-dropdown-item>
                {{ $t('menu-dashboard') }}
              </el-dropdown-item>
            </n-link>

            <div
              class="link border-br-bl"
              @click="btnsignOut"
            >
              <el-dropdown-item>
                {{ $t('home.signOut') }}
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <a
          v-else
          href="javascript:void(0);"
          class="home-head-notlogin"
          @click="login"
        >{{ $t('home.signIn') }}</a>
        <slot name="more" />
        <div v-if="isLogined" class="write-btn" @click="writeP">
          <svg-icon
            class="write-icon"
            icon-class="write"
          />
          {{ $t('header.newArticle') }}
        </div>
        <!-- <language class="language" /> -->
      </div>
      <div class="mobile">
        <el-badge
          :value="notifyUnreadQuantity"
          :hidden="notifyUnreadQuantity === 0"
          :max="99"
          class="item"
        >
          <svg-icon icon-class="menu" class="menu" @click="toggleMenu = !toggleMenu" />
        </el-badge>
        <ul v-show="toggleMenu" class="menu-ul">
          <li class="menu-ul-item">
            <div class="menu-search">
              <input
                v-model="searchInput"
                :placeholder="$t('home.searchPlaceholder')"
                type="text"
                class="input"
                autocomplete="off"
                readonly
                onfocus="this.removeAttribute('readonly')"
                onblur="this.setAttribute('readonly', 'readonly')"
                @keyup.enter="jutmpToSearch"
                @focus="searchFcous = true"
                @blur="inputBlur"
              >

              <svg-icon
                class="icon-search"
                icon-class="search"
                @click.stop="jutmpToSearch"
              />
              <ul v-if="searchRecommendList.length !== 0 && searchFcous" class="menu-search-list">
                <li
                  v-for="(item, index) in searchRecommendList"
                  :key="index"
                  @click.stop="jutmpToSearchRecommend(item.word)"
                >
                  {{ item.word }}
                </li>
              </ul>
            </div>
          </li>
          <template v-if="isLogined">
            <li class="menu-ul-item">
              <n-link :to="{name: 'user-id', params:{id: currentUserInfo.id}}">
                <div class="fl ac">
                  <c-avatar
                    :src="avatar"
                    class="menu-avatar"
                    :recommend-author="user.is_recommend === 1"
                    :token-user="!!tokenInfo.id"
                    :level-token="1"
                  />
                  <span class="username">{{ currentUserInfo.nickname || currentUserInfo.name }}</span>
                </div>
              </n-link>
            </li>
            <li class="menu-ul-item">
              <n-link :to="{name: 'setting', params:{id: currentUserInfo.id}}" class="link">
                <svg-icon icon-class="menu_account" class="icon" />{{ $t('home.account') }}
              </n-link>
            </li>
            <li class="menu-ul-item">
              <n-link :to="{name: 'token-id', params:{id: metaData.tokenId}}" class="link">
                <svg-icon icon-class="menu_account" class="icon" />{{ metaData.tokenAmount }} {{ metaData.tokenSymbol }}
              </n-link>
            </li>
            <li class="menu-ul-item">
              <n-link :to="{name: 'dashboard'}" class="link">
                <svg-icon icon-class="menu_account" class="icon" />{{ $t('menu-dashboard') }}
              </n-link>
            </li>
            <li class="menu-ul-item" @click="btnsignOut">
              <a href="javascript:;">
                <svg-icon icon-class="menu_logout" class="icon" />{{ $t('home.signOut') }}
              </a>
            </li>
          </template>
          <li v-if="!isLogined" class="menu-ul-item" @click="login">
            <a href="javascript:;">
              <svg-icon icon-class="menu_login" class="icon" />{{ $t('home.signIn') }}
            </a>
          </li>
          <li class="menu-ul-item">
            <n-link to="/notification">
              <svg-icon icon-class="menu_notice" class="icon" />{{ $t('message-center') }}
              <span v-if="numMessagesLabel" class="news">
                {{ numMessagesLabel }}
              </span>
            </n-link>
          </li>

          <li class="menu-ul-item" @click="postImport">
            <a href="javascript:;">
              <svg-icon icon-class="menu_import" class="icon" />{{ $t('publish.importArticle') }}
            </a>
          </li>

          <li class="menu-ul-item" @click="writeP">
            <a href="javascript:;">
              <svg-icon icon-class="menu_write" class="icon" />{{ $t('header.newArticle') }}
            </a>
          </li>
        </ul>
        <div v-if="toggleMenu" class="menu-full" @click="toggleMenu = !toggleMenu" />
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import homeLogo from '@/assets/img/home_logo.png' // 因为tag页面不需要换颜色了, 可以逐步删掉props
// import language from './language'
import homeLogo from '@/assets/img/m_logo_square.png'
import homeLogoWhile from '@/assets/img/home_logo_white.png'
// import avatarComponents from '@/components/avatar/index.vue'
import { removeCookie } from '@/utils/cookie'

import { strTrim } from '@/utils/reg'
import store from '@/utils/store.js'

import metaComponents from './meta'

export default {
  name: 'HomeHead',
  components: {
    // avatarComponents,
    // language
    metaComponents
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
  },
  data() {
    return {
      avatar: '',
      searchFcous: false,
      searchInput: this.searchQueryVal,
      searchRecommendList: [],
      toggleMenu: false, // 菜单切换
      notifyUnreadQuantity: 0,
      user: Object.create(null), // 用户信息
      tokenInfo: Object.create(null), // token info
      metaData: { // meta 组件数据
        tokenId: 238,
        tokenAmount: 0,
        tokenSymbol: 'METACC'
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    nav() {
      return [
        {
          title: this.$t('home.creation'),
          url: 'article',
          sup: '',
          urlList: ['article', 'article-latest', 'ring-id']
        },
        {
          title: this.$t('home.timeline'),
          url: 'timeline',
          sup: '',
          urlList: ['timeline']
        },
        {
          title: this.$t('home.fanTicket'),
          url: 'token',
          sup: '',
          urlList: ['token']
        },
        {
          title: 'DAPP',
          url: 'dapp',
          sup: '',
          urlList: ['dapp']
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
    },
    numMessagesLabel() {
      if(!this.notifyUnreadQuantity) return ''
      return `（${this.notifyUnreadQuantity}条新消息）`
    }
  },
  watch: {
    isLogined(newState) {
      if (newState) {
        this.refreshUser()
        this.getTokenUser(this.currentUserInfo.id)
        this.getToken()
      }
    },
    searchQueryVal(newVal) {
      this.searchInput = newVal
    },
    async $route() {
      if (this.isLogined) await this.getNotifyUnreadQuantity()
      this.toggleMenu = false
    }
  },
  created() {
    const { isLogined, refreshUser } = this
    if (isLogined) {
      refreshUser()
      this.getTokenUser(this.currentUserInfo.id)
    }
  },
  mounted() {
    this.getRecommend()
    if (process.client) {
      this.getToken()
    }
  },
  methods: {
    ...mapActions(['getCurrentUser', 'signOut', 'resetAllStore']),
    async getNotifyUnreadQuantity() {
      const res = await this.$API.getNotifyUnreadQuantity()
      if(res.code === 0) {
        this.notifyUnreadQuantity = res.data
      }
    },
    postImport() {
      if (this.isLogined) this.$store.commit('importArticle/setImportModal', true)
      else this.login()
    },
    writeP() {
      if (this.isLogined) this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: 'create' } })
      else this.login()
    },
    async refreshUser() {
      try {
        const result = await this.getCurrentUser()
        const { avatar } = result

        this.user = result

        if (avatar) this.avatar = this.$ossProcess(avatar, { h: 60 })
        await this.getNotifyUnreadQuantity()
      } catch (e) {
        console.log('refreshUser error: ',e)
      }
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    btnsignOut() {
      if (confirm(this.$t('warning.confirmLogout'))) {

        // 出错后弹出框提示
        const alertDialog = () => {
          this.$alert('很抱歉，退出登录失败，点击确定刷新', '温馨提示', {
            showClose: false,
            type: 'success',
            callback: () => {
              window.location.reload()
            }
          })
        }

        // 重置all store
        this.resetAllStore()
          .then(() => {
            removeCookie('ACCESS_TOKEN')
            removeCookie('idProvider')
            removeCookie('referral')
            store.clear()
            sessionStorage.clear()

            if (this.$route.name === 'article') {
              this.$router.go(0)
            } else {
              this.$router.replace({
                name: 'article'
              })
            }

            // 通知刷新其他页面
            setTimeout(() => {
              this.$userMsgChannel.postMessage('logout')
            }, 2000)

          }).catch(err => {
            console.log(err)
            alertDialog()
          })
      }
    },
    // 跳转搜索
    jutmpToSearch() {
      if (!strTrim(this.searchInput)) return this.$message.warning(this.$t('warning.searchContent'))

      const names = ['sharehall', 'share-id', 'token', 'token-id']
      const types = [1, 1, 2, 2]
      const type = types[names.indexOf(this.$route.name)]

      const query = {}
      if (type) query.type = type
      query.q = strTrim(this.searchInput)

      if (this.$route.name === 'search') {
        this.$router.replace({
          name: 'search',
          query
        })
      } else {
        const { href } = this.$router.resolve({
          name: 'search',
          query
        })
        window.open(href, '_blank')
      }
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
    },
    async getTokenUser(id) {
    // 获取是否有 token
      const tokenRes = await this.$utils.factoryRequest(this.$API.tokenUserId(id))
      // not token, data is null
      this.tokenInfo = tokenRes ? (tokenRes.data || {}) : {}
    },
    // 获取token
    getToken() {
      // token list 因为测试网没有META用其他Token代替
      const FSB = {
        id: 21,
        symbol: 'FSB'
      }
      const METACC = {
        id: 238,
        symbol: 'METACC'
      }
      const list = {
        development: FSB,
        testing: FSB,
        production: METACC
      }
      // 获取token持有数据
      const getTokenData = async ({ token }) => {
        try {
          const res = await this.$API.getUserBalance(token.id)
          if (res.code === 0) {
            this.metaData.tokenAmount = this.$utils.fromDecimal(res.data)
            this.metaData.tokenId = token.id
            this.metaData.tokenSymbol = token.symbol
          }
        } catch (error) {
          console.log('error', error)
        }
      }

      if (this.isLogined) {
        let token = list[process.env.NODE] || list.production
        getTokenData({ token })
      }
    }

  }

}
</script>

<style lang="less" scoped>
.qq-tips {
  margin-right: 20px;
  color: #B2B2B2;
  font-size: 14px;
}
.user-menu  {
  margin-right: 20px;
}
.write-btn {
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  border-radius: 30px;
  font-size: 14px;
  color: #fff;
  background-color: #542DE0;
  position: relative;
  padding: 6px 22px;
  border: 2px solid transparent;
  transition: scale 0.3s ease-in-out;
  .write-icon {
    color: #fff;
  }
  &::before {
    content: '';
    border-radius: 30px;
    position: absolute;
    opacity: 0;
    display: none;
    border: 3px solid transparent;
    left: -6px;
    top: -6px;
    right: -6px;
    bottom: -6px;
  }

  &:hover {
    transform: scale(0.94);
    border: 2px solid #fff;
    &::before {
      display: block;
      opacity: 1;
      border: 3px solid #542ddf;
    }
  }

  // &:hover::before, &:focus::before {
  //   opacity: 1;
  //   display: inline;
  // }

  // &:hover::after, &:focus::after {
  //   animation: none;
  //   display: none;
  // }

  // &:active {
  //   transform: scale(0.8);
  // }
}
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
  // min-width: 800px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;

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
    height: 40px;
  }
  .create {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin: 0 20px;
    color: #000;
    .notification {
    width: 24px;
    height: 24px;
    }
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
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 2px;
    padding: 0 18px;
    background: #000;
    border-radius: 4px;
    text-decoration: none;
    margin-left: 10px;
    white-space: nowrap;
    height: 40px;
    line-height: 40px;
  }
  .nav {
    font-size: 18px;
    color: @gray;
    margin: 0 10px;
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
  width: 200px;
  background: rgba(241, 241, 241, 1);
  border-radius: 4px;
  display: flex;
  box-sizing: border-box;
  margin: 0 10px 0 0;
  .input {
    flex: 1;
    padding: 11px 40px 11px 10px;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 14px;
    color: #000000;
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
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  overflow: auto;
  padding: 0;
  margin: 0;
  z-index: 99;
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

.menu-search {
  position: relative;
  width: 100%;
  background: rgba(241, 241, 241, 1);
  border-radius: 4px;
  display: flex;
  box-sizing: border-box;
  margin: 0;
  .input {
    flex: 1;
    padding: 0 40px 0 10px;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 12px;
    color: #000000;
    height: 30px;

  }
  .icon-search {
    width: 14px;
    height: 14px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
  }
}
.menu-search-list {
  position: absolute;
  top: 40px;
  left: 0;
  background: #fff;
  width: 100%;
  max-height: 280px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  overflow: auto;
  padding: 0;
  margin: 0;
  z-index: 99;
  li {
    list-style: none;
    font-size: 12px;
    color: #000;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    letter-spacing: 1px;
    padding: 14px 10px;
    border-bottom: 1px solid #ededed;
    &:nth-last-child(1) {
      border-bottom: none;
    }
  }
}

.language {
  margin-left: 16px;
}
</style>

<style lang="less">
// 覆盖下拉框
.user-dorpdown {
  max-width: 150px;
  box-sizing: border-box;
  .border-tl-tr {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
  }
  .border-br-bl {
    border-radius: 0 0 4px 4px;
    overflow: hidden;
  }
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
  }
  .el-dropdown-menu__item--divided {
    margin-top: 0;
  }
  .el-dropdown-menu__item--divided:before {
    display: none;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: @purpleDark;
    color: #fff;
    .link {
      color: #fff;
    }
  }
  /deep/ .popper__arrow {
    margin-top: -1px;
  }
}
</style>
<style lang="less" scoped>
.link {
  display: block;
  text-decoration: none;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice {
  h3 {
    padding: 0;
    margin: 12px 0 8px 0;
  }
  p {
    padding: 0;
    margin: 6px 0;
    font-size: 14px;
    line-height: 1.3;
  }
}
.notice-btn {
  margin-left: 10px;
  cursor: pointer;
}
.badge {
  position: relative;
  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: rgba(251, 104, 119, 1);
    position: absolute;
    z-index: 1000;
    right: 0%;
    margin-right: -3px;
    margin-top: -3px;
  }
}


.menu {
  cursor: pointer;
  font-size: 30px;
  color: #000;
  &-ul {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
    padding: 10px 20px 0 20px;
    margin: 0;
    list-style: none;
    .menu-ul-item {
      border-bottom: 1px solid #DBDBDB;
      padding: 0;
      font-size: 14px;
      color: #333;
      font-weight: 400;
      cursor: pointer;
      height: 45px;
      box-sizing: border-box;

      &:nth-last-child(1) {
        border-bottom: none;
      }
      a {
        display: block;
        color: #333;
        line-height: 45px;
      }
      .icon {
        font-size: 20px;
        margin: 0 10px 0 0;
      }

      .username {
        margin-left: 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .menu-avatar {
      min-width: 20px;
      min-height: 20px;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      line-height: 20px;
    }
  }
}
.news {
  color: #F56C6C;
}
.menu-ul {
  z-index: 2;
}
.menu-full {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 60px;
  background-color: rgba(0,0,0,.4);
  z-index: 1;
}
// 页面大于
@media screen and (min-width: 801px) {
  .header {
    .mobile {
      display: none;
    }
  }
}
// 页面小于
@media screen and (max-width: 800px) {
  .header {
    .pc {
      display: none;
    }
  }
}


@media screen and (max-width: 992px) {
  .home-head {
    padding-left: 10px;
    padding-right: 10px;
    .logo {
      height: 30px;
    }
    .nav {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .home-head-notlogin {
    font-size: 12px;
  }
  .qq-tips {
    font-size: 13px;
  }

  .write-btn {
    font-size: 12px;
  }
}

@media screen and (max-width: 540px) {
  .header {
    height: 50px;
  }
  .menu-ul,
  .menu-full {
    top: 50px;
  }
}
</style>
