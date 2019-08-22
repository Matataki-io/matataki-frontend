<template>
  <div class="info">
    <div class="cover">
      <img src="@/assets/img/article_bg.svg" alt="cover">
    </div>
    <div class="avatar-content">
      <avatar class="avatar" :src="userInfo.avatar" />
      <div class="info-type" :class="iconType">
        <svg-icon title="账号类型" class="icon-type" :icon-class="iconType" />
      </div>
    </div>
    <h3 class="author">
      {{ userTitle }}
      <svg-icon v-if="isMe($route.params.id)" class="icon-edit" icon-class="edit" @click="jumpTo" />
    </h3>

    <p class="des">
      {{ userInfo.introduction || '暂无' }}
    </p>
    <div class="follow-fan">
      <div class="data">
        <n-link class="num" tag="p" :to="{name: 'user-id-follow', params: {id: nowId}}">
          {{ userInfo.follows || 0 }}
        </n-link>
        <p class="title">
          关注
        </p>
      </div>
      <div class="data">
        <n-link class="num" tag="p" :to="{name: 'user-id-fan', params: {id: nowId}}">
          {{ userInfo.fans || 0 }}
        </n-link>
        <p class="title">
          粉丝
        </p>
      </div>
    </div>
    <!-- 如果是设置页面不显示 -->
    <template v-if="!isSetting">
      <!-- 个人主页 -->
      <button
        v-if="!isMe($route.params.id)"
        class="button"
        @click="followOrUnfollowUser({
          id: $route.params.id,
          type: userInfo.followed ? 0 : 1
        })"
      >
        {{ userInfo.followed ? '取消关注' : '关注' }}
      </button>
    </template>
    <!-- 如果是设置页面不显示 end -->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    isSetting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconType: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['isMe', 'currentUserInfo']),
    nowId() {
      if (this.isSetting) return this.currentUserInfo.id
      else return this.$route.params.id
    },
    userTitle() {
      return this.userInfo && this.userInfo.name && this.userInfo.name.slice(0, 10)
    }
  },
  watch: {
    currentUserInfo() {
      if (this.isSetting) this.refreshUser({ id: this.currentUserInfo.id })
      this.iconType = (this.currentUserInfo.idProvider).toLocaleLowerCase()
    }
  },

  mounted() {
    if (!this.isSetting) this.refreshUser({ id: this.$route.params.id })
    else if (this.currentUserInfo.id) this.refreshUser({ id: this.currentUserInfo.id })
    if (this.currentUserInfo.idProvider) this.iconType = (this.currentUserInfo.idProvider).toLocaleLowerCase()
  },
  methods: {
    ...mapActions('user', [
      'refreshUser',
      'followOrUnfollowUser'
    ]),
    jumpTo() {
      this.$router.push({
        name: 'user-setting'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.line{
  width: 190px;
  height: 1px;
  background-color: #DBDBDB;
  margin: 0 auto;
}

.info {
  overflow: hidden;
  background-color: #fff;
  border-radius: @borderRadius10;
}
.avatar {
    width: 60px !important;
    height: 60px !important;
    background: #eee;
    z-index: 1;
    position: relative;
}
.avatar-content {
  width: 60px !important;
  height: 60px !important;
  margin: -30px auto;
  position: relative;
  .info-type {
    position: absolute;
    right: -4px;
    bottom: -2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    .icon-type {
      color: #fff;
      width: 60%;
      height: 60%;
    }
    &.email {
      background-color: #F7B500;
    }
    &.eos {
      background-color: #333;
    }
    &.ont {
      background-color: #4d9afd;
    }
    &.github {
      background-color: #882592;
    }
  }
}
.cover {
  width: 100%;
  height: 90px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.author {
    font-size: 20px;
    font-weight: bold;
    color: #000000;
    margin: 46px auto 0;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    width: 80%;
    .icon-edit {
      position: absolute;
      margin-left: 6px;
      cursor: pointer;
      color: #B2B2B2;
  }
}
.des {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 17px;
    width: 80%;
    text-align: center;
    margin: 10px auto;
}

.follow-fan {
    display: flex;
    justify-content: center;
    align-items: center;
    .data {
      margin: 20px 18px;
      text-align: center;
      .num {
        font-size:24px;
        font-weight:600;
        color:rgba(28,156,254,1);
        line-height:33px;
        padding: 0;
        margin: 0;
        cursor: pointer;
      }
      .title {
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:17px;
        padding: 0;
        margin: 2px 0 0;
      }
    }
}

.button {
  background-color: @black;
  border-radius:@borderRadius6;
  width: 190px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  line-height: 22px;
  margin: 20px auto 40px;
  text-align: center;
  display: block;
}
</style>
