<template>
  <router-link tag="div" class="card" :to="{ name: 'Article', params: { hash } }">
    <!-- 他人主页隐藏info -->
    <div v-if="!isOtherUser" class="info">
      <div class="avatar">
        <div class="avatar-img">
          <img :src="avatar" alt="avatar" :onerror="defaultAvatar" />
        </div>
        <span>{{ article.nickname || article.author }}</span>
      </div>
      <span>{{ friendlyDate }}</span>
    </div>
    <div class="container">
      <div class="img-outer">
        <img v-lazy="cover" :src="cover" alt="cover" class="img-inner" />
        <div class="full"></div>
      </div>
      <div class="card-text">
        <h2 v-clampy="2" class="title">{{ article.title }}</h2>
        <!-- 他人主页显示时间 -->
        <template v-if="!isOtherUser">
          <p v-if="nowIndex === 0" class="read-ups">
            {{ article.read }}浏览&nbsp;&nbsp;{{ article.ups }}投资
          </p>
          <p v-else class="read-ups">
            {{ article.sale }}销量<span>&nbsp;&nbsp;{{ articleEosValue }}EOS/份</span>
          </p>
        </template>
        <template v-else>
          <p class="read-ups">
            {{ friendlyDate }}
          </p>
        </template>
      </div>
    </div>
  </router-link>
</template>

<script>
import moment from 'moment'
import { isNDaysAgo } from '@/common/methods'
import { precision } from '@/common/precisionConversion'

import clampy from '@clampy-js/vue-clampy'
import Vue from 'vue'

import coverDefault from '@/assets/img/cover_default.png'

Vue.use(clampy)

export default {
  name: 'ArticleCard',
  directives: {
    clampy
  },
  props: {
    article: {
      type: Object,
      default: () => {}
    },
    nowIndex: {
      type: Number,
      default: () => 0
    },
    // isOtherUser 是其他用户信息视角吗
    isOtherUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`
    }
  },
  computed: {
    friendlyDate() {
      const time = moment(this.article.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    hash() {
      return this.article.id // 原来是 hash 现在用id进入
    },
    avatar() {
      if (this.article.avatar) return this.$backendAPI.getAvatarImage(this.article.avatar)
      return ''
    },
    cover() {
      if (this.article.cover) return this.$backendAPI.getAvatarImage(this.article.cover)
      return coverDefault
    },
    articleEosValue() {
      return precision(this.article.eosprice, 'eos')
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.card {
  padding: 10px 20px;
  text-align: left;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
}
.info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 10px;
  .avatar {
    display: flex;
    align-items: center;
    flex: 1;
    &-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #eee;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    span {
      flex: 1;
      font-size: 12px;
      font-weight: bold;
      color: #000000;
      margin: 0 0 0 5px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: left;
    }
  }
  span {
    text-align: right;
    width: 90px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
  }
}

.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.read-ups {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  text-align: left;
  span {
    font-size: 12px;
    font-weight: 500;
    color: rgba(247, 181, 0, 1);
  }
}

.title {
  font-size: 14px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 18px;
  white-space: normal;
}

.img-outer {
  flex: 0 0 120px;
  width: 120px;
  height: 60px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-right: 10px;
  .img-inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s;
  }
  .full {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.card-text {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: space-between;
}

// 因为不开放适配 所以媒体查询放大
@media screen and (min-width: 750px) {
  .card {
    padding: 15px 20px;
    &:hover {
      transform: translate(0, -2px);
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      .img-outer .img-inner {
        transform: scale(1.04);
      }
    }
  }

  .img-outer {
    flex: 0 0 228px;
    width: 228px;
    height: 114px;
    margin-right: 20px;
  }

  .card-text {
    height: 100px;
    .title {
      font-size: 18px;
    }
  }

  .card .read-ups {
    font-size: 15px;
  }
}
</style>
