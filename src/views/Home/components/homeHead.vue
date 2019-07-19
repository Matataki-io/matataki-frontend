<template>
  <div class="home-fixed home-head mw">
    <div v-if="isLogined" class="home-head-avatar" @click="$emit('login')">
      <img :src="avatar" alt="avatar" :onerror="defaultAvatar" />
    </div>
    <a v-else href="javascript:void(0);" class="home-head-notlogin" @click="$emit('login')">登录</a>

    <div class="home-head-nav">
      <a
        v-for="(item, index) in nav"
        :key="index"
        :class="nowIndex === index && 'active'"
        href="javascript:void(0);"
        @click="$emit('toggleNav', index)"
      >
        <span>{{ item }}</span>
      </a>
    </div>

    <img
      class="home-head-create"
      src="@/assets/img/icon_home_create.svg"
      alt="create"
      @click="$router.push({ name: 'Publish', params: { id: 'create' } })"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HomeHead',
  props: ['nav', 'nowIndex'],
  data() {
    return {
      avatar: '',
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined'])
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
    }
  }
}
</script>

<style lang="less" scoped>
.home-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
}
.home-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  padding: 10px 20px;
  background-color: #fff;
  box-sizing: border-box;
  &-avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-notlogin {
    font-size: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 2px;
    padding: 4px 8px;
    background: #000;
    border-radius: 6px;
  }
  &-nav {
    a {
      font-size: 20px;
      font-weight: 600;
      color: rgba(178, 178, 178, 1);
      margin: 0 12px;
      position: relative;
      text-align: center;
      transition: all 0.18s ease-in-out;
      span {
        z-index: 2;
        position: relative;
      }
      &.active {
        color: rgba(0, 0, 0, 1);
      }
      &.active::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: -2px;
        right: -2px;
        display: block;
        height: 5px;
        background-color: #1c9cfe;
      }
    }
  }

  &-create {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>
