<template>
  <div class="share-footer">
    <div class="icon-num">
      <div @click="$emit('bookmarked', bookmarked)">
        <svg-icon :class="bookmarked && 'active'" class="icon" icon-class="bookmark-solid" />
      </div>
      <p>收藏</p>
    </div>
    <div class="icon-num">
      <div @click="pushShare">
        <svg-icon class="icon" icon-class="reference" />
      </div>
      <p>{{ $t('quote') }}</p>
    </div>
    <div class="icon-num">
      <div @click="$emit('share')">
        <svg-icon class="icon" icon-class="share2" />
      </div>
      <p>分享</p>
    </div>
    <div class="icon-num">
      <div @click="$emit('like', 2)">
        <svg-icon :class="isLiked === 2 && 'active'" class="icon" icon-class="great-solid" />
      </div>
      <p>{{ $t('p.like')}}<span>{{ likes }}</span></p>
    </div>
    <div class="icon-num">
      <div @click="$emit('like', 1)">
        <svg-icon :class="isLiked === 1 && 'active'" class="icon" icon-class="bullshit-solid" />
      </div>
      <p>{{ $t('p.unlike')}}<span>{{ dislikes }}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 是否收藏
    bookmarked: {
      type: Number,
      default: 0
    },
    // 是否点赞 like 2 dislike 1
    isLiked: {
      type: Number,
      default: 0
    },
    // 点赞数
    likes: {
      type: Number,
      default: 0
    },
    // 不推荐数
    dislikes: {
      type: Number,
      default: 0
    }
  },
  methods: {
    pushShare() {
      // 优化体验, 大厅取这个key
      sessionStorage.setItem('shareRef', this.$route.params.id)
      this.$router.push({ name: 'sharehall' })
    }
  }
}
</script>

<style lang="less" scoped>
.share-footer {
  // height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .icon {
    font-size: 32px;
    color: #B2B2B2;
    &.active {
      color: @purpleDark;
    }
  }

  .icon-num {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // position: relative;
    & > div {
      width: 80px;
      height: 80px;
      background-color: #F1F1F1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        transform: scale(1.07);
        background-color: mix(#000, #f1f1f1, 2%);
      }
    }
    p {
      text-align: center;
      font-size:16px;
      font-weight: bold;
      color:rgba(0,0,0,1);
      line-height:22px;
      padding: 0;
      margin: 10px 0 0;
      span {
        font-size:16px;
        font-weight:bold;
        color: @purpleDark;
        line-height:22px;
        margin-left: 4px;
      }
    }
  }
}
</style>
