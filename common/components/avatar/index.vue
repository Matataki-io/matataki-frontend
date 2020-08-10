<template>
  <!-- no-border 发币用户的边框 取消 最外层的描边 -->
  <!-- levelClass 推荐用户只增加 icon -->
  <div class="components-avatar" :class="[{ 'no-border': tokenUser}, levelClass]">
    <!-- 发币用户 -->
    <div v-if="tokenUser" class="token-user" :class="levelClassTokenUser">
      <div class="avatar-box">
        <img v-if="src" :src="src" alt="avatar">
        <img v-else :src="defaultAvatar" alt="avatar">
      </div>
    </div>
    <!-- 普通框 -->
    <template v-else>
      <div class="avatar-box">
        <img v-if="src" :src="src" alt="avatar">
        <img v-else :src="defaultAvatar" alt="avatar">
      </div>
    </template>
    <!-- 推荐用户 -->
    <img
      v-if="recommendAuthor"
      src="@/assets/img/recommend_author.svg"
      alt="icon"
      class="recommend-icon"
    >
  </div>
</template>

<script>
import defaultAvatar from '@/assets/img/default_avatar.png'

export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    // 发币用户
    tokenUser: {
      type: Boolean,
      default: false
    },
    levelToken: {
      type: Number,
      default: 0
    },
    // 推荐作者
    recommendAuthor: {
      type: Boolean,
      default: false
    },
    // 等级 用来区分推荐作者的宽高
    // -- 0 <= 30px 1px
    // 1 <= 60px 2px
    // 2 <= 90px 3px
    // 3 <= 120px 4px
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      defaultAvatar
    }
  },
  computed: {
    levelClass() {
      if (this.recommendAuthor) {
        let list = {
          // '0': 'w30',
          '1': 'w60',
          '2': 'w90',
          '3': 'w120',
        }
        return 'recommend ' + list[this.level] || ''
      } else {
        return ''
      }
    },
    levelClassTokenUser() {
      if (this.tokenUser) {
        let list = {
          // '0': 'w30',
          '1': 'w60',
          '2': 'w90',
          '3': 'w120',
        }
        return list[this.levelToken] || ''
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.components-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  user-select: none;
  border: 1px solid #ddd;
  box-sizing: border-box;
  position: relative;
  outline: none;
  .avatar-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: #f1f1f1;
    }
  }
}

.recommend {
  .recommend-icon {
    position: absolute;
    right: -6px;
    bottom: -2px;
    z-index: 2;
    width: 15px;
  }

  &.w60 {
    .recommend-icon {
      right: -12px;
      bottom: -2px;
      width: 30px;
    }
  }

  &.w90 {
    .recommend-icon {
      right: -18px;
      bottom: -2px;
      width: 45px;
    }
  }

  &.w120 {
    .recommend-icon {
      right: -24px;
      bottom: -2px;
      width: 60px;
    }
  }
}
// 发币用户
.components-avatar.no-border {
  border: none !important;
}
.token-user {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  user-select: none;
  box-sizing: border-box;
  position: relative;
  .avatar-box {
    border: 1px solid #fff;
  }
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 50%;
    background: linear-gradient(
      180deg,
      rgba(253, 157, 0, 1),
      rgba(250, 100, 0, 1)
    );
    z-index: 1;
    animation: _rotate 3s linear infinite;
  }

  &.w60 {
    .avatar-box {
      border-width: 2px;
    }
    &::after {
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
    }
  }

  &.w90 {
    .avatar-box {
      border-width: 3px;
    }
    &::after {
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
    }
  }

  &.w120 {
    .avatar-box {
      border-width: 4px;
    }
    &::after {
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
    }
  }
}

@keyframes _rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
