<template>
  <div class="share-flows">
    <!-- 转发 -->
    <div class="share-flows-forward">
      <svg-icon icon-class="dynamic-repo" @click="$emit('ref-push')" />
      <span v-if="flows.retweet">
        {{ flows.retweet }}
      </span>
    </div>
    <!-- 评论 -->
    <div class="share-flows-comment flows-disable">
      <el-tooltip
        class="item"
        effect="dark"
        content="🚧 “评论”功能正在施工"
        placement="top"
      >
        <svg-icon icon-class="dynamic-comment" />
      </el-tooltip>
      <span v-if="flows.comment">
        {{ flows.comment }}
      </span>
    </div>
    <!-- 喜欢 -->
    <div class="share-flows-like">
      <svg-icon
        :class="likeIconClass"
        icon-class="dynamic-good"
        @click="$emit('like', 2)"
      />
      <span v-if="flows.favorite">
        {{ flows.favorite }}
      </span>
    </div>
    <!-- 分享 -->
    <div class="share-flows-share">
      <svg-icon icon-class="dynamic-share" @click="$emit('copy-link')" />
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
  computed: {
    likeIconClass () {
      return {
        'like-touch': true,
        'active': !!this.flows.iLiked
      }
    },
    flows () {
      return {
        // 评论
        comment: 0,
        // 转发
        retweet: 0,
        // 喜欢
        favorite: this.likes,
        iLiked: this.isLiked === 2,
        dislikes: this.dislikes,
        iDislike: this.isLiked === 1,
      }
    },
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
.share-flows {
  display: flex;
  padding: 10px 0 0;
  margin: 0 10px 0;
  .flow-default {
    font-size: 18px;
    flex: 1;
    svg {
      height: 18px;
      width: 18px;
      color: #657786;
      -moz-user-select:none;
      -webkit-user-select:none;
      user-select:none;
    }
    span {
      margin:  0 0 0 5px;
      font-size: 15px;
    }
    &.flows-disable {
      svg {
        color: #dcdcdc;
      }
    }
  }
  .default-hover {
    transition: all ease-in 0.05s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }

  &-forward {
    .flow-default();

    svg {
      .default-hover();
      width: 21px;
    }
  }

  &-comment {
    .flow-default();

    svg {
      width: 19px;
    }
  }

  &-like {
    .flow-default();

    svg {
      width: 20px;
    }

    .like-touch {
      -moz-user-select:none;
      -webkit-user-select:none;
      user-select:none;
      transition: all ease-in 0.05s;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }

      &:active {
        transform: scale(1);
      }

      &.active {
        color: #ca8f04;
        transform: scale(1);
        cursor: default;
      }
    }
  }

  &-share {
    .flow-default();
    flex: 0;
    margin-right: 5px;

    svg {
      .default-hover();
      width: 17px;
    }
  }
}
</style>
