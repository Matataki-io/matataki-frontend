<template>
  <div class="share-header">
    <router-link
      :to="{name: 'user-id', params: {id: id}}"
      target="_blank"
    >
      <avatar
        :src="avatarSrc"
        class="share-header-avatar"
      />
    </router-link>
    <div class="share-header-info">
      <div class="share-header-info-top">
        <router-link
          :to="{name: 'user-id', params: {id: id}}"
          class="share-header__author"
          target="_blank"
        >
          <span class="share-header__username">{{ username }}</span>
        </router-link>
        <div class="share-header__fl1" />
        <m-ipfs :hash="hash" />
        <shareHeadRight
          v-if="isMe(id)"
          :id="shareId"
        />
      </div>
      <div class="share-header-info-bottom">
        <span class="share-header__time">{{ timeFormat }}</span>
        <span class="share-header__read">
          <svg-icon
            icon-class="eye_blod"
            class="icon"
          />
          {{ read }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'
import shareHeadRight from '@/components/share_page/share_head_right'
export default {
  components: {
    avatar,
    shareHeadRight
  },
  props: {
    // 用户id
    id: {
      type: Number,
      default: -1
    },
    // 头像
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
    },
    // 分享的id
    shareId: {
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    avatarSrc() {
      if (this.avatar) return this.$ossProcess(this.avatar, { h: 90 })
      return ''
    },
    timeFormat() {
      return this.time ? this.moment(this.time).format('lll') : '00:00:00'
    },
  },
}
</script>

<style lang="less" scoped>
.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 14px;

  &-avatar {
    width: 45px !important;
    height: 45px !important;
  }
  &-info {
    flex: 1;

    &-top {
      display: flex;
      margin: 0 0 5px;
    }

    &-bottom {
      display: flex;
    }
  }

  &__fl1 {
    flex: 1;
  }

  &__author {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  &__username {
    font-size:16px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:17px;
    margin-left: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    &:hover {
      color: #542DE0;
      text-decoration: underline;
    }
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

  &__right {
    display: flex;
    align-items: center;
  }
}
</style>
