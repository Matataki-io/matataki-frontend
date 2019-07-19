/* eslint-disable no-shadow */
<template>
  <div class="user mw" style="white-space:nowrap;">
    <template v-if="isMe(id)">
      <!-- 自己 -->
      <!-- 有侧边栏 代替了 -->
      <BaseHeader :pageinfo="{ title: '个人中心' }">
        <div slot="right" class="help-button" @click="jumpTo({ name: 'Help' })">
          <img src="@/assets/img/icon_user_settings.svg" alt="settings" />
        </div>
      </BaseHeader>
      <div class="usercard">
        <div class="user-avatar">
          <img v-if="avatar" v-lazy="avatar" :src="avatar" />
        </div>
        <div class="texts">
          <p class="user-info">
            <span class="nmae">{{ name }}</span>
            <router-link class="edit-button" :to="{ name: 'UserEdit', params: { id } }"
              >编辑</router-link
            >
          </p>
          <p class="userstatus">
            <router-link :to="{ name: 'FollowList', params: { listtype: '关注' } }"
              >关注：{{ follows }}</router-link
            >
            <router-link :to="{ name: 'FollowList', params: { listtype: '粉丝' } }"
              >粉丝：{{ fans }}</router-link
            >
          </p>
        </div>
      </div>

      <div class="user-block">
        <div class="user-block-list" @click="jumpTo({ name: 'Asset', params: { id } })">
          <span class="user-block-list-title">账户资产</span>
          <span class="user-block-list-des">
            已绑定{{ stats.accounts }}个账户
            <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="查看" />
          </span>
        </div>
      </div>

      <div class="user-block">
        <div class="user-block-list" @click="jumpTo({ name: 'Original', params: { id } })">
          <span class="user-block-list-title">原创文章</span>
          <span class="user-block-list-des">
            {{ stats.articles }}篇
            <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="查看" />
          </span>
        </div>
        <div class="user-block-list" @click="jumpTo({ name: 'Reward', params: { id } })">
          <span class="user-block-list-title">投资文章</span>
          <span class="user-block-list-des">
            {{ stats.supports }}篇
            <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="查看" />
          </span>
        </div>
        <div class="user-block-list" @click="jumpTo({ name: 'DraftBox', params: { id } })">
          <span class="user-block-list-title">草稿箱</span>
          <span class="user-block-list-des">
            {{ stats.drafts }}篇
            <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="查看" />
          </span>
        </div>
      </div>

      <div class="user-block">
        <div class="user-block-list" @click="jumpTo({ name: 'BuyHistory' })">
          <span class="user-block-list-title">购买记录</span>
          <span class="user-block-list-des">
            <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="查看" />
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 他人 -->
      <BaseHeader
        :pageinfo="{ title: name }"
        :customize-header-bc="'#1C9CFE'"
        :scroll-toggle-bc="'#fff'"
        :is-scroll-emit="true"
        :scroll-show-title="true"
        :scroll-show-right="true"
        @scrollToggleStatus="status => (scrollStatus = status)"
      >
        <div v-if="!isMe(id)" slot="right">
          <template v-if="!followed">
            <span class="follow-button dark" @click="followOrUnfollowUser({ id, type: 1 })">
              <svg-icon icon-class="add" />
              关注</span
            >
          </template>
          <template v-else>
            <span class="follow-button" @click="followOrUnfollowUser({ id, type: 0 })">已关注</span>
          </template>
        </div>
      </BaseHeader>

      <div class="otherUser">
        <div class="user-avatar">
          <img v-if="avatar" v-lazy="avatar" class="userpic" :src="avatar" />
        </div>
        <p class="name">{{ name }}</p>
        <p class="introduction">简介：{{ introduction || '暂无' }}</p>
        <p class="userstatus">
          <router-link :to="{ name: 'FollowList', params: { listtype: '关注' } }">
            <span class="statusNumber">{{ follows }}</span>
            <span class="statusKey">关注</span>
          </router-link>
          <router-link :to="{ name: 'FollowList', params: { listtype: '粉丝' } }">
            <span class="statusNumber">{{ fans }}</span>
            <span class="statusKey">粉丝</span>
          </router-link>
        </p>

        <template v-if="!scrollStatus">
          <transition name="fade">
            <span
              v-if="!followed"
              class="follow-button other dark"
              @click="followOrUnfollowUser({ id, type: 1 })"
            >
              <svg-icon icon-class="add" />
              关注</span
            >
            <span v-else class="follow-button other" @click="followOrUnfollowUser({ id, type: 0 })">
              已关注</span
            >
          </transition>
        </template>
      </div>
      <ArticlesList
        :id="id"
        ref="ArticlesList"
        :is-other-user="true"
        class="user-list"
        :listtype="'others'"
      />
    </template>

    <BaseModalForSignIn
      :show-modal="showSignInModal"
      @changeInfo="stats => (showSignInModal = stats)"
    />
  </div>
</template>

<script>
// 这个页面被改完了 还有一堆没有的方法待删除 -- 希望修改的时候改干净吧 :(
import { mapGetters } from 'vuex'
import ArticlesList from './ArticlesList.vue'

export default {
  name: 'User',
  components: { ArticlesList },
  props: ['id'],
  data() {
    return {
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
      },
      showSignInModal: false,
      scrollStatus: false // 根据滚动状态判断是否显示按钮
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'displayName', 'isLogined', 'isMe'])
  },
  watch: {
    isLogined() {
      this.refreshUser()
    }
  },
  created() {
    this.refreshUser()
  },
  methods: {
    jumpTo(params) {
      this.$router.push(params)
    },
    async refreshUser() {
      const { isMe, id } = this
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
        this.stats = { accounts, articles, supports, drafts }
      }

      const {
        data: { data }
      } = await (isMe(id) ? this.$backendAPI.getMyUserData() : this.$backendAPI.getUser({ id }))
      // console.debug(data);
      setUser(data)
    },
    async followOrUnfollowUser({ id, type }) {
      if (!this.isLogined) {
        this.showSignInModal = true
        return
      }
      const message = type === 1 ? '关注' : '取消关注'
      try {
        if (type === 1) await this.$backendAPI.follow({ id })
        else await this.$backendAPI.unfollow({ id })
        this.$toast.success({ duration: 1000, message: `${message}成功` })
        this.followed = type === 1
      } catch (error) {
        this.$toast.fail({ duration: 1000, message: `${message}失败` })
        this.showSignInModal = this.$errorHandling.isNoToken(error)
      }
      this.refreshUser()
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$backendAPI.getAvatarImage(hash)
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
