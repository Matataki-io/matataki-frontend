<template>
  <van-popup v-model="sidebarShow" position="left" class="sidebar" z-index="1000">
    <div class="container">
      <template v-if="isLogined">
        <div class="account">
          <div class="top-container">
            <router-link :to="{ name: 'UserEdit', params: { id } }">
              <div class="avatar-container">
                <img :src="avatar" alt="avatar" :onerror="defaultAvatar" />
              </div>
            </router-link>
            <router-link :to="{ name: 'Help' }">
              <img src="@/assets/newimg/setting.svg" alt="setting" class="setting" />
            </router-link>
          </div>
          <p class="account-name">{{ name }}</p>
          <p class="wallet-info">{{ displayBalanceSymbol }}钱包余额：{{ displayBalance }}</p>
        </div>
        <div class="follow-info">
          <router-link :to="{ name: 'FollowList', params: { id, listtype: '关注' } }">
            <div class="follow">
              <p>{{ follows }}</p>
              <p>关注</p>
            </div>
          </router-link>
          <router-link :to="{ name: 'FollowList', params: { id, listtype: '粉丝' } }">
            <div class="fans">
              <p>{{ fans }}</p>
              <p>粉丝</p>
            </div>
          </router-link>
        </div>
        <div class="cell-container">
          <router-link :to="{ name: 'Asset', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <img src="@/assets/newimg/shouye-zhanghu.svg" alt="home" class="left-img" />
                <span class="left-text">我的账户</span>
              </div>
              <div class="cell-right">
                <span>已绑定{{ stats.accounts }}个账户</span>
              </div>
            </div>
          </router-link>
        </div>
        <div class="cell-container">
          <router-link :to="{ name: 'Original', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <img src="@/assets/newimg/yuanchuang.svg" alt="article" class="left-img" />
                <span class="left-text">我的原创</span>
              </div>
              <div class="cell-right">
                <span>{{ stats.articles }}篇</span>
              </div>
            </div>
          </router-link>
          <router-link :to="{ name: 'Reward', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <img src="@/assets/newimg/zanshang.svg" alt="article" class="left-img" />
                <span class="left-text">我的投资</span>
              </div>
              <div class="cell-right">
                <span>{{ stats.supports }}篇</span>
              </div>
            </div>
          </router-link>
          <router-link :to="{ name: 'DraftBox', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <img src="@/assets/newimg/caogaoxiang.svg" alt="article" class="left-img" />
                <span class="left-text">我的草稿</span>
              </div>
              <div class="cell-right">
                <span>{{ stats.drafts }}篇</span>
              </div>
            </div>
          </router-link>
        </div>
        <div class="cell-container">
          <router-link :to="{ name: 'BuyHistory' }">
            <div class="cell">
              <div class="cell-left">
                <img src="@/assets/newimg/goumaijilu.svg" alt="article" class="left-img" />
                <span class="left-text">购买记录</span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="login-btn" href="javascript:;" @click="showModal = true">立即登录</div>
      </template>
      <div class="cell-container">
        <a href="https://smartsignature.io/article/617">
          <div class="cell">
            <div class="cell-left">
              <img src="@/assets/newimg/gonglue.svg" alt="article" class="left-img" />
              <span class="left-text">规则介绍</span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
        <a href="https://t.me/smartsignature_io" target="_blank">
          <div class="cell">
            <div class="cell-left">
              <img src="@/assets/newimg/telegram.svg" alt="article" class="left-img" />
              <span class="left-text">加入电报</span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
      </div>
      <div class="cell-container">
        <a href="https://smartsignature.io/article/616">
          <div class="cell">
            <div class="cell-left">
              <img src="@/assets/img/icon_sidebar_sb.svg" alt="article" class="left-img" />
              <span class="left-text">智能公告牌</span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
      </div>
    </div>
    <BaseModalForSignIn :show-modal="showModal" @changeInfo="changeInfo" />
  </van-popup>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultAvatar from '@/assets/avatar-default.svg'

export default {
  name: 'Sidebar',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      showModal: false,
      sidebarShow: false,
      balance: 1,
      id: null,
      followed: false,
      follows: 0,
      fans: 0,
      name: '',
      email: '',
      avatar: '',
      introduction: '',
      stats: {
        accounts: 0,
        articles: 0,
        supports: 0,
        drafts: 0
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'displayName', 'isLogined', 'isMe']),
    displayBalance() {
      const { balance } = this.currentUserInfo
      return balance ? balance.slice(0, -4) : ''
    },
    displayBalanceSymbol() {
      const { balance } = this.currentUserInfo
      return balance ? balance.slice(-4) : ''
    }
  },
  watch: {
    value(val) {
      this.sidebarShow = val
    },
    sidebarShow(val) {
      this.$emit('input', val)
    },
    isLogined(newState) {
      if (newState) this.refreshUser()
    }
  },
  created() {
    this.refreshUser()
  },
  methods: {
    async refreshUser() {
      const { isMe } = this
      const id = this.currentUserInfo.id
      this.id = this.currentUserInfo.id
      const setUser = ({
        avatar,
        email,
        fans,
        follows,
        is_follow,
        nickname,
        introduction,
        username,
        accounts,
        articles,
        supports,
        drafts
      }) => {
        this.email = email
        this.fans = fans
        this.follows = follows
        this.introduction = introduction
        this.followed = is_follow
        this.name = nickname || username
        this.setAvatarImage(avatar)
        this.stats = {
          accounts,
          articles,
          supports,
          drafts
        }
      }

      if (isMe(id)) {
        const {
          data: { data }
        } = await this.$backendAPI.getMyUserData()
        setUser(data)
      }
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$backendAPI.getAvatarImage(hash)
      else this.avatar = defaultAvatar
    },
    changeInfo(status) {
      this.showModal = status
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  width: 75%;
  max-width: 280px;
  background-color: #f1f1f1;
  color: #000000;
  .login-btn {
    text-align: center;
    margin: 50px 30px;
    background-color: #000;
    color: #fff;
    padding: 8px 20px;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 1px;
    min-width: 100px;
    cursor: pointer;
  }
  .container {
    .account {
      padding: 20px;
      .top-container {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .avatar-container {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #aaa;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .setting {
        width: 20px;
        cursor: pointer;
      }
      .account-name {
        font-size: 20px;
        color: #000000;
        font-weight: 700;
        line-height: 28px;
        margin-bottom: 5px;
        text-align: left;
      }
      .wallet-info {
        font-size: 14px;
        line-height: 20px;
        text-align: left;
      }
    }
    .follow-info {
      width: 100%;
      background-color: #ffffff;
      padding: 10px;
      box-sizing: border-box;
      .follow,
      .fans {
        display: inline-block;
        width: 50%;
        color: #000000;
        text-align: center;
        p:first-of-type {
          font-size: 20px;
          line-height: 28px;
          font-weight: 700;
        }
        p:last-of-type {
          font-size: 12px;
          line-height: 17px;
        }
      }
    }
  }
  .cell-container {
    margin-top: 10px;
  }
  .cell {
    &:hover {
      background-color: #cccccc;
    }
    background-color: #ffffff;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .cell-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .left-img {
        margin-right: 10px;
      }
      .left-text {
        color: #000000;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
      }
    }
    .cell-right {
      span {
        color: #b2b2b2;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
  .cell.active {
    .left-text {
      color: #1c9cfe;
    }
  }
}
</style>
