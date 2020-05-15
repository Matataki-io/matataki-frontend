<template>
  <div class="sidebar share-footer">
    <el-badge :value="likes" type="primary" class="icon-num">
      <div @click="$emit('like', 2)">
        <svg-icon
          :class="isLiked === 2 && 'active'"
          class="icon"
          icon-class="great-solid"
        />
      </div>
      <p>{{ $t('p.like') }}<span>{{ likes }}</span></p>
    </el-badge>

    <el-badge :value="dislikes" type="primary" class="icon-num">
      <div @click="$emit('like', 1)">
        <svg-icon
          :class="isLiked === 1 && 'active'"
          class="icon"
          icon-class="bullshit-solid"
        />
      </div>
      <p>{{ $t('p.unlike') }}<span>{{ dislikes }}</span></p>
    </el-badge>

    
    <div class="icon-num">
      <div @click="$emit('bookmarked', bookmarked)">
        <svg-icon
          :class="bookmarked && 'active'"
          class="icon"
          icon-class="bookmark-solid"
        />
      </div>
      <p>{{ !bookmarked ? $t('bookmark') : $t('unbookmark') }}</p>
    </div>
    <div class="icon-num">
      <div @click="$emit('share')">
        <svg-icon
          class="icon"
          icon-class="share2"
        />
      </div>
      <p>{{ $t('share') }}</p>
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
}
</script>

<style lang="less" scoped>
.sidebar {
  max-width: 350px;
  margin: 30px auto 20px;
}
.share-footer {
  // height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /deep/ .el-badge__content.is-fixed {
    top: 2px;
    right: 14px;
    display: none;
  }
  .icon {
    font-size: 24px;
    color: #b2b2b2;
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
      width: 60px;
      height: 60px;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);

      &:hover {
        transform: scale(1.04);
      }
    }
    p {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      padding: 0;
      margin: 10px 0 0;
      span {
        font-size: 16px;
        font-weight: 400;
        color: @purpleDark;
        line-height: 22px;
        margin-left: 4px;
      }
    }
  }
}

// 大于1040px
@media screen and (min-width: 990px) {
  .sidebar {
    position: fixed;
    top: 20%;
    margin-left: -80px;
    flex-direction: column;
    .share-footer {
      .icon {
        font-size: 20px;
      }
    }
    .icon-num {
      margin: 0 0 10px;
      & > div {
        width: 50px;
        height: 50px;
      }
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
      p {
        display: none;
      }
    }
  }
    .share-footer {
      /deep/ .el-badge__content.is-fixed {
        display: block;
      }
    }
}
</style>
