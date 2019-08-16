<template>
  <div class="coin-btn" @mouseenter="enterBtn" @mouseleave="leaveBtn">
    <Progress :p="time">
      <template slot="text">
        <span v-show="!clicked" class="center-text">+ {{ readPoint }}</span>
        <svg-icon v-show="type==='great'" icon-class="great-solid" class="center-icon" />
        <svg-icon v-show="type==='bullshit'" icon-class="bullshit-solid" class="center-icon" />
      </template>
    </Progress>
    <!-- <div :class="['crycle', {'clickStyle': clicked || showTip}]">
      <span v-show="!clicked">+ 0</span>
      <svg-icon v-show="type==='great'" icon-class="great-solid" />
      <svg-icon v-show="type==='bullshit'" icon-class="bullshit-solid" />
    </div> -->
    <div :class="['title-container', {'hidden': showTip && !clicked}]">
      <span class="title">SS积分</span>
    </div>
    <div v-show="showTip && !clicked" class="like-btn">
      <div class="btns-container">
        <button class="great-cointainer" :disabled="clicked" @click="like">
          <svg-icon icon-class="great" />
          <span>推荐</span>
        </button>
        <button class="bullshit-cointainer" :disabled="clicked" @click="dislike">
          <svg-icon icon-class="bullshit" />
          <span>不推荐</span>
        </button>
      </div>
      <p>已阅读{{ readTime }}</p>
      <p class="tip">
        * 阅读5分钟 +10 SS积分
      </p>
      <p class="tip">
        * 新内容 +5 SS积分
      </p>
    </div>
  </div>
</template>

<script>
import Progress from './Progress'
export default {
  components: {
    Progress
  },
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
      type: 'title',
      showTip: false
    }
  },
  computed: {
    // 是否被点击过
    clicked() {
      return this.type !== 'title'
    },
    // 阅读积分
    readPoint() {
      if (this.time >= 150) {
        return 10
      }
      if (this.clicked) {
        return 0
      } else {
        return Math.floor(this.time / 30) * 2
      }
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
  watch: {
    type(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.type = val
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
    },
    enterBtn() {
      this.showTip = true
    },
    leaveBtn() {
      this.showTip = false
    }
  }
}
</script>

<style scoped lang="less">
.center-text {
  color: #1C9CFE;
  font-size: 18px;
}
.center-icon {
  color: #1C9CFE;
  font-size: 20px;
}
.title-container {
  margin-top: 10px;
}
.like-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  padding: 10px 36px;
  background: #ddd;
  z-index: 99;
  font-size: 14px;
  border-radius: 6px;
  p {
    color: #000;
    margin: 10px 0;
  }
  .btns-container {
    .flexCenter();
  }
  .btn-base {
    width: 75px;
    font-size: 14px;
    text-align: center;
    border-radius: 6px;
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
    margin-left: 10px;
  }
}
.coin-btn {
  .flexCenter();
  flex-direction: column;
  position: relative;
}
.crycle {
  z-index: 100;
  width: 60px;
  height: 60px;
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
.tip {
  color: #ccc;
  font-style:italic;
}
</style>
