<template>
  <div class="sidebar share-footer">
    <el-badge :value="likes" type="primary" class="icon-num">
      <div @click="$emit('like', 2)">
        <svg-icon
          :class="isLiked === 2 && 'active'"
          class="icon like-icon"
          icon-class="great-solid"
        />
      </div>
      <p>{{ $t('p.like') }}<span>{{ likes }}</span></p>
    </el-badge>

    <el-badge :value="dislikes" type="primary" class="icon-num dislike-btn">
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

  .like-icon {
    transition: left 2s ease all;
    &:hover {
      left: 20px;
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

      &:active {
        transform: scale(0.9);
        color: #4f2fd7;
        background-color: #fff;
        box-shadow: 0 2px 25px rgba(163, 163, 163, 0.747);
      }

      @media (hover: hover) {
        & > svg:hover {
          color: #4f2fd7;
        }
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

@media screen and (max-width: 540px) {
  .share-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    margin: 0;
    max-width: 100%;
    z-index: 99;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 0;
    padding-bottom: calc(2px + constant(safe-area-inset-bottom));
    padding-bottom: calc(2px + env(safe-area-inset-bottom));
    border-top: 1px solid #f1f1f1;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    .icon-num > div {
      box-shadow: none;
      width: 30px;
      height: 30px;
    }
    .icon {
      font-size: 20px;
    }
    .icon-num {
      p {
        font-size: 12px;
        line-height: inherit;
        margin: 0;
        span {
          font-size: 12px;
          line-height: inherit;
        }
      }
    }
  }
}
</style>
