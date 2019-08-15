<template>
  <div>
    <div class="coin-btn">
      <div class="info-container">
        <div :class="['crycle', {'clickStyle': clicked}]">
          <span class="solid-icon" v-show="!clicked">+ 0</span>
          <svg-icon v-show="type==='great'" icon-class="great-solid" class="solid-icon" />
          <svg-icon v-show="type==='bullshit'" icon-class="bullshit-solid" class="solid-icon" />
        </div>
        <div>
          <span class="title">评价领取SS积分</span>
        </div>
      </div>
      <div class="btns-container">
        <button class="great-cointainer" @click="like" :disabled="clicked">
          <svg-icon icon-class="great" />
          <span>推荐</span>
        </button>
        <button class="bullshit-cointainer" @click="dislike" :disabled="clicked">
          <svg-icon icon-class="bullshit" />
          <span>不推荐</span>
        </button>
      </div>
    </div>
    <div class="article-info">
      <div class="info1">
        <span>已阅读{{readTime}}</span>
      </div>
      <!-- <div class="info2">
        <span>新内容 +5</span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      default: 0
    },
    value: {
      type: String,
      default: 'title'
    },
    token: {
      type: Object,
      default: () => ({
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      })
    }
  },
  data() {
    return {
      type: 'title'
    }
  },
  watch: {
    type(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.type = val
    }
  },
  computed: {
    // 是否被点击过
    clicked() {
      return this.type !== 'title'
    },
    readTime() {
      const time = this.time
      if (time < 60) {
        return `${time}秒`
      } else {
        const m = Math.floor(time / 60)
        const s = time - m * 60
        if (s !== 0) return `${m}分钟${s}秒`
        else return `${m}分钟`
      }
    }
  },
  methods: {
    like() {
      this.type = 'great'
      this.$emit('like')
    },
    dislike() {
      this.type = 'bullshit'
      this.$emit('dislike')
    }
  }
}
</script>

<style scoped lang="less">
.solid-icon {
  font-size: 30px;
}
.btns-container {
  .flexCenter();
  flex-direction: column;
  margin-left: 80px;
  margin-bottom: 30px;
  .btn-base {
    width: 100px;
    font-size: 14px;
    text-align: center;
    border-radius: 100px;
    box-sizing: border-box;
    border: 1px solid @blue;
    .flexCenter();
    height: 30px;
    cursor: pointer;
    user-select: none;
    span {
      margin-left: 3px;
    }
  }
  .great-cointainer {
    background: @blue;
    color: #fff;
    .btn-base();
  }
  .bullshit-cointainer {
    background: transparent;
    color: @blue;
    .btn-base();
    margin-top: 20px;
  }
}
.info-container {
  .flexCenter();
  flex-direction: column;
  text-align: center;
}
.coin-btn {
  .flexCenter();
  position: relative;
}
.crycle {
  z-index: 100;
  width: 80px;
  height: 80px;
  border-radius: 60%;
  box-sizing: border-box;
  border: 4px solid @blue;
  background: #F1F1F1;
  color: @blue;
  font-size: 20px;
  font-weight: 700;
  .flexCenter();
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background: @blue;
    color: #fff;
  }
}
.title {
  color: #000000;
  white-space: nowrap;
  font-size: 16px;
  line-height: 20px;
}
.clickStyle {
  background: @blue;
  color: #fff;
}
.hidden {
  visibility: hidden;
}
.article-info {
  margin-top: 40px;
  padding: 15px 40px;
  border: 1px solid #dbdbdb;
  border-radius: 40px;
  box-sizing: border-box;
  font-size: 16px;
  width: 400px;
  .flexCenter();
  .info1 {
    margin-right: 40px;
  }
  .info2, .info1 {
    .flexCenter();
    img {
      margin: 0 5px 0 10px;
    }
    .num {
      color:  @blue;
      font-weight: 700;
    }
  }
}
</style>
