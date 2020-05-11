<template>
  <div class="info">
    <!-- <div class="info-container">
        <div :class="['crycle', {'clickStyle': clicked}]">
          <span class="solid-icon" v-show="!clicked">+ 0</span>
          <svg-icon v-show="type==='great'" icon-class="great-solid" class="solid-icon" />
          <svg-icon v-show="type==='bullshit'" icon-class="bullshit-solid" class="solid-icon" />
        </div>
        <div>
          <span class="title">评价领取积分</span>
        </div>
      </div> -->
    <div class="btns-container">
      <slot />
      <div class="btn-outer">
        <button
          :class="['great-cointainer', {'actived': type === 'great'}]"
          :disabled="clicked"
          @click="like"
        >
          <svg-icon icon-class="great-solid" />
        </button>
        <span>{{ $t('p.like') }}<em class="like">{{ article && article.likes }}</em></span>
      </div>
      <div class="btn-outer">
        <button
          :class="['bullshit-cointainer', {'actived': type === 'bullshit'}]"
          :disabled="clicked"
          @click="dislike"
        >
          <svg-icon icon-class="bullshit-solid" />
        </button>
        <span>{{ $t('p.unlike') }} <em class="like">{{ article && article.dislikes }}</em></span>
      </div>
    </div>
    <!-- <div v-if="token.points.length !== 0 || !clicked" class="article-info">
      <div v-if="!clicked" class="info1">
        <span>{{ $t('p.reads') }}{{ readTime }}</span>
      </div>
      <template v-else>
        <div
          v-if="p.reading > 0"
          class="info1"
        >
          <span>{{ $t('p.readAddPoint', [p.reading]) }}</span>
        </div>
        <div
          v-if="p.reading_new > 0"
          class="info1"
        >
          <span>{{ $t('p.newAddPoint', [p.reading_new]) }}</span>
        </div>
      </template>
    </div> -->
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
    },
    article: {
      type: Object,
      required: true
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
    p() {
      const { points } = this.token
      const l = points.length
      const result = {
        reading_new: 0,
        reading: 0
      }
      for (let i = 0; i < l; i++) {
        if (points[i].type === 'read_new') {
          result.reading_new = points[i].amount
        }
        if (points[i].type === 'read_dislike' || points[i].type === 'read_like') {
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
.info {
  width: 500px;
}
.solid-icon {
  font-size: 30px;
}
.btn-outer {
  text-align: center;
}
.btns-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    color: @purpleDark;
    border: none;
    span {
      margin-left: 3px;
    }
    &:hover:enabled {
      background: @purpleDark;
      color: #fff;
    }
    &.actived {
      background: @purpleDark;
      color: #fff;
    }
  }
  .great-cointainer {
    .btn-base();
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
.crycle {
  z-index: 100;
  width: 80px;
  height: 80px;
  border-radius: 60%;
  box-sizing: border-box;
  border: 4px solid @purpleDark;
  background: #F1F1F1;
  color: @purpleDark;
  font-size: 20px;
  font-weight: 700;
  .flexCenter();
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background: @purpleDark;
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
  background: @purpleDark;
  color: #fff;
}
.hidden {
  visibility: hidden;
}
.article-info {
  margin-top: 40px;
  padding: 15px 0;
  border: 1px solid #dbdbdb;
  border-radius: 40px;
  box-sizing: border-box;
  font-size: 16px;
  width: 500px;
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
      color:  @purpleDark;
      font-weight: 700;
    }
  }
}

.like {
  font-size:16px;
  color: @purpleDark;
  font-style: normal;
  margin-left: 4px;
}
</style>
