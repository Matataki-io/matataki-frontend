<template>
  <!-- :style="customizeHeaderBcComputed" -->
  <header class="header home-fixed">
    <div class="home-head">
      <div class="head-flex">
        <a
          class="logo-link"
          href="/home"
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
          <ul
            v-if="searchRecommendList.length !== 0 && searchFcous"
            class="search-list"
          >
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
          content="通知中心"
          placement="bottom"
        >
          <n-link
            :class="{ badge: hasNewNotification }"
            class="create"
            to="/notification"
          >
            <svg-icon
              :style="customizeHeaderIconColorComputed"
              class="notification"
              icon-class="bell"
            />
          </n-link>
        </el-tooltip>
        <el-tooltip
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
        </el-tooltip>

        <el-dropdown
          v-if="isLogined"
          class="user-menu"
        >
          <!-- <avatarComponents :size="'30px'" :src="avatar" class="home-head-avatar" /> -->
          <div class="user-avatar">
            <img
              v-if="avatar"
              :src="avatar"
              alt="user avatar"
            >
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="user-dorpdown"
          >
            <n-link
              :to="{name: 'user-id', params:{id: currentUserInfo.id}}"
              class="link"
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
  
            <div
              class="link"
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
        <language class="language" />
      </div>
      <div class="mobile">
        <svg-icon icon-class="menu" class="menu" @click="toggleMenu = !toggleMenu" />
        <ul v-show="toggleMenu" class="menu-ul">
          <li>
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
              <ul
                v-if="searchRecommendList.length !== 0 && searchFcous"
                class="search-list"
              >
                <li
                  v-for="(item, index) in searchRecommendList"
                  :key="index"
                  @click.stop="jutmpToSearchRecommend(item.word)"
                >
                  <a href="javascript:;">{{ item.word }}</a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <n-link to="/notification">
              通知中心
            </n-link>
          </li>

          <li @click="postImport">
            <a href="javascript:;">{{ $t('publish.importArticle') }}</a>
          </li>

          <li @click="writeP">
            <a href="javascript:;">
              {{ $t('header.newArticle') }}
            </a>
          </li>


          <template v-if="isLogined">
            <li>
              <n-link :to="{name: 'user-id', params:{id: currentUserInfo.id}}">
                <div class="fl ac">
                  <c-avatar :src="avatar" />
                  <span class="username">{{ currentUserInfo.nickname || currentUserInfo.name }}</span>
                </div>
              </n-link>
            </li>
            <li>
              <n-link
                :to="{name: 'setting', params:{id: currentUserInfo.id}}"
                class="link"
              >
                {{ $t('home.account') }}
              </n-link>
            </li>

            <li @click="btnsignOut">
              <a href="javascript:;">
                {{ $t('home.signOut') }}
              </a>
            </li>
          </template>
          <li v-else @click="login">
            <a href="javascript:;">
              {{ $t('home.signIn') }}
            </a>
          </li>
          <li>
            <a href="javascript:;">
              <language />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import homeLogo from '@/assets/img/home_logo.png' // 因为tag页面不需要换颜色了, 可以逐步删掉props
import language from './language'
import homeLogo from '@/assets/img/m_logo_square.png'
import homeLogoWhile from '@/assets/img/home_logo_white.png'
// import avatarComponents from '@/components/avatar/index.vue'
import { removeCookie } from '@/utils/cookie'

import { strTrim } from '@/utils/reg'
import store from '@/utils/store.js'

export default {
  name: 'HomeHead',
  components: {
    // avatarComponents,
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
  },
  data() {
    return {
      avatar: '',
      searchFcous: false,
      searchInput: this.searchQueryVal,
      searchRecommendList: [],
      toggleMenu: false, // 菜单切换
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    ...mapGetters('notification', ['hasNewNotification']),
    nav() {
      return [
        {
          title: this.$t('home.creation'),
          url: 'article',
          sup: '',
          urlList: ['article', 'ring-id']
        },
        {
          title: this.$t('home.dynamic'),
          url: 'dynamic',
          sup: '',
          urlList: ['dynamic']
        },
        {
          title: this.$t('home.fanTicket'),
          url: 'token',
          sup: '',
          urlList: ['token']
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
    searchQueryVal(newVal) {
      this.searchInput = newVal
    },
    async $route() {
      if (this.isLogined) await this.getNotificationCounters()
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
    ...mapActions(['getCurrentUser', 'signOut', 'resetAllStore']),
    ...mapActions('notification', ['getNotificationCounters']),
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
      if (avatar) this.avatar = this.$ossProcess(avatar, { h: 60 })
      await this.getNotificationCounters()
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
    margin: 0 20px 0 0;
    color: #000;
    .notification {
    width: 100%;
    height: 100%;
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
    color: rgba(0, 0, 0, 1);
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
.language {
  margin-left: 16px;
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
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
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

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  border: 1px solid #ddd;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    padding: 0 10px 20px;
    margin: 0;
    list-style: none;
    li {
      border-bottom: 1px solid #dfdfdf;
      padding: 0;
      font-size: 14px;
      color: #333;
      font-weight: 400;
      cursor: pointer;

      &:nth-last-child(1) {
        border-bottom: none;
      }
      a {
        display: block;
        padding: 10px 0;
        color: #333;
      }

      .username {
        margin-left: 10px;
      }
    }
  }
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
    .search {
      width: 100%;
      margin: 10px 0;
    }
  }
}
</style>
