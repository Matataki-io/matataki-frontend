<template>
  <header class="header home-fixed">
    <div class="home-head mw">
      <div class="head-flex">
        <a href="/"><img class="logo" src="@/assets/img/hone_logo.png" alt="logo"></a>
        <a
          v-for="(item, index) in nav"
          :key="index"
          class="nav"
          :class="nowIndex === index && 'active'"
          href="javascript:void(0);"
          @click="$emit('toggleNav', index)"
        >{{ item }}</a>
      </div>

      <div class="head-flex">
        <!-- <svg-icon
          class="create"
          icon-class="write"
          @click="$router.push({ name: 'Publish', params: { id: 'create' } })"
        /> -->

        <div v-if="isLogined" class="home-head-avatar" @click="$emit('login')">
          <img :src="avatar" alt="avatar">
        </div>
        <a
          v-else
          href="javascript:void(0);"
          class="home-head-notlogin"
          @click="$emit('login')"
        >登录</a>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HomeHead',
  props: {
    nav: {
      type: Array,
      default: () => []
    },
    nowIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      avatar: ''
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
  }
  .nav {
    font-size: 20px;
    color: rgba(178, 178, 178, 1);
    margin: 0 0 0 40px;
    position: relative;
    text-align: center;
    transition: all 0.18s ease-in-out;
    font-weight: 500;
    &.active {
      color: rgba(0, 0, 0, 1);
    }
  }
}
</style>
