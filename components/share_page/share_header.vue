<template>
  <div class="share-header">
    <div class="share-header__info">
      <router-link :to="{name: 'user-id', params: {id: id}}" class="share-header__author" target="_blank">
        <avatar :src="avatarSrc" class="avatar" />
        <span class="share-header__username">{{ username.length > 12 ? username.slice(0, 12) + '...' : username }}</span>
      </router-link>
      <span class="share-header__time">{{ timeFormat }}</span>
      <span class="share-header__read">
        <svg-icon icon-class="eye_blod" class="icon" />
        {{ read }}
      </span>
    </div>
    <m-ipfs :hash="hash" />
  </div>
</template>

<script>
import moment from 'moment'
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    read: {
      type: Number,
      default: 0
    },
    hash: {
      type: String,
      default: ''
    }
  },
  computed: {
    avatarSrc() {
      if (this.avatar) return this.$API.getImg(this.avatar)
      return ''
    },
    timeFormat() {
      return this.time ? moment(this.time).format('lll') : '00:00:00'
    }
  }
}
</script>

<style lang="less" scoped>
.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 14px;
  &__info {
    display: flex;
    align-items: center;
  }
  &__author {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  .avatar {
    width: 45px !important;
    height: 45px !important;
  }
  &__username {
    font-size:16px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:17px;
    margin-left: 10px;
  }
  &__time {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:17px;
    margin-left: 10px;
  }
  &__read {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:17px;
    margin-left: 10px;
    .icon {
      font-size: 16px;
    }
  }
}
</style>
