<template>
  <div>
    <div class="coin-btn">
      <!-- <div class="info-container">
        <div :class="['crycle', {'clickStyle': clicked}]">
          <span class="solid-icon" v-show="!clicked">+ 0</span>
          <svg-icon v-show="type==='great'" icon-class="great-solid" class="solid-icon" />
          <svg-icon v-show="type==='bullshit'" icon-class="bullshit-solid" class="solid-icon" />
        </div>
        <div>
          <span class="title">评价领取SS积分</span>
        </div>
      </div> -->
      <div class="btns-container">
        <div class="btn-outer">
          <button :class="['great-cointainer', {'actived': type === 'great'}]" :disabled="clicked" @click="like">
            <svg-icon icon-class="great-solid" />
          </button>
          <span>推荐</span>
        </div>
        <div class="btn-outer bullshit-outer">
          <button :class="['bullshit-cointainer', {'actived': type === 'bullshit'}]" :disabled="clicked" @click="dislike">
            <svg-icon icon-class="bullshit-solid" />
          </button>
          <span>不推荐</span>
        </div>
      </div>
    </div>
    <div class="article-info">
      <div class="info1" v-if="!clicked">
        <span>已阅读{{readTime}}</span>
      </div>
      <template v-else>
        <div class="info1" v-if="p.reading > 0">
          <span>阅读 + {{p.reading}}SS积分</span>
        </div>
        <div class="info1" v-if="p.reading_new > 0">
          <span>新文章 + {{p.reading_new}}SS积分</span>
        </div>
      </template>
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
    return {}
  },
  computed: {
    // 是否被点击过
    clicked() {
      return this.type !== 'title'
    },
    type() {
      if (parseInt(this.token.is_liked) === 0) {
        return 'title'
      }
      if (parseInt(this.token.is_liked) === 2) {
        return 'great'
      }
      if (parseInt(this.token.is_liked) === 1) {
        return 'bullshit'
      }
      return 'title'
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
    },
    p() {
      const { points } = this.token
      const l = points.length
      const result = {
        reading_new: 0,
        reading: 0
      }
      for (let i = 0; i < l; i++) {
        if (points[i].type === 'reading_new') {
          result.reading_new = points[i].amount
        }
        if (points[i].type === 'reading_dislike' || points[i].type === 'reading_like') {
          result.reading = points[i].amount
        }
      }
      return result
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
      this.$emit('like')
    },
    dislike() {
      this.$emit('dislike')
    }
  }
}
</script>

<style scoped lang="less">
.solid-icon {
  font-size: 30px;
}
.btn-outer {
  text-align: center;
}
.btns-container {
  .flexCenter();
  .btn-base {
    width: 80px;
    height: 80px;
    font-size: 36px;
    text-align: center;
    border-radius: 50%;
    box-sizing: border-box;
    margin-bottom: 10px;
    .flexCenter();
    cursor: pointer;
    user-select: none;
    background: #F1F1F1;
    color: @blue;
    border: none;
    span {
      margin-left: 3px;
    }
    &:hover:enabled {
      background: @blue;
      color: #fff;
    }
    &.actived {
      background: @blue;
      color: #fff;
    }
  }
  .great-cointainer {
    .btn-base();
  }
  .bullshit-outer {
    margin-left: 100px;
  }
  .bullshit-cointainer {
    .btn-base();
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
    text-align: center;
  }
  .info1+.info1 {
    margin-left: 20px;
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
