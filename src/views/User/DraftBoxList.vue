<template>
  <div
    class="card"
    @click="
      () => {
        this.$router.push({
          name: 'Publish',
          params: { id: draftbox.id },
          query: { from: 'draft' }
        })
      }
    "
  >
    <div class="info">
      <div class="avatar">
        <div class="avatar-img">
          <img :src="avatar" alt="avatar" :onerror="defaultAvatar" />
        </div>
        <span>{{ draftbox.nickname || draftbox.author }}</span>
      </div>
      <span>{{ friendlyDate }}</span>
    </div>
    <div class="container">
      <div class="img-outer">
        <img v-lazy="cover" :src="cover" alt="cover" class="img-inner" />
        <div class="full"></div>
      </div>
      <div class="card-text">
        <h2 v-clampy="2" class="title">{{ draftbox.title }}</h2>
        <div>
          <button
            class="del-btn"
            @click.stop="
              delListBtn({
                id: draftbox.id,
                index: index
              })
            "
          >
            删除
          </button>
        </div>
        <!--<Icon
          type="md-close-circle"
          style="color: #515a6e;font-size: 24px;"
          @click.stop="
            delListBtn({
              id: draftbox.id,
              index: index
            })
          "
        />-->
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { isNDaysAgo } from '@/common/methods'
import clampy from '@clampy-js/vue-clampy'
import Vue from 'vue'

import coverDefault from '@/assets/img/cover_default.png'

Vue.use(clampy)

export default {
  name: 'DraftBoxList',
  directives: {
    clampy
  },
  props: {
    draftbox: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`
    }
  },
  computed: {
    friendlyDate() {
      const time = moment(this.draftbox.update_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    hash() {
      return this.draftbox.id // 原来是 hash 现在用id进入
    },
    avatar() {
      if (this.draftbox.avatar) return this.$backendAPI.getAvatarImage(this.draftbox.avatar)
      return ''
    },
    cover() {
      if (this.draftbox.cover) return this.$backendAPI.getAvatarImage(this.draftbox.cover)
      return coverDefault
    }
  },
  methods: {
    delListBtn(data) {
      this.$emit('delId', data)
    }
  }
}
</script>

<style scoped lang="less">
.del-btn {
  float: right;
  border-radius: 6px;
  border: none;
  background: #000000;
  color: #ffffff;
  width: 60px;
  height: 25px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}
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
