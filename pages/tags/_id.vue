<template>
  <div class="tag">
    <g-header />
    <div class="row">
      <div class="col-6">
        <section class="head">
          <h3 class="head-title">
            <span># {{ $route.query.name }}</span>
            <router-link :to="{name: 'tags'}" class="title-link">
              查看全部
              <svg-icon icon-class="arrow" class="icon" />
            </router-link>
          </h3>
          <div class="tags-text">
            <span class="tags-title" :class="mode === 'hot' && 'active'" @click="toggleTag('hot')">最热</span>
            <span class="tags-title" :class="mode === 'new' && 'active'" @click="toggleTag('new')">最新</span>
          </div>
        </section>
        <articleCardListNew
          v-for="(item, index) in pull.list"
          :key="index"
          :card="item"
        />
        <div class="load-more-button">
          <buttonLoadMore
            :type-index="0"
            :params="pull.params"
            :api-url="pull.apiUrl"
            :is-atuo-request="pull.isAtuoRequest"
            :auto-request-time="pull.reload"
            @buttonLoadMore="buttonLoadMore"
          />
        </div>
      </div>
      <div class="col-3 sticky">
        <section class="head">
          <h3 class="head-title">
            热门主题
          </h3>
          <router-link :to="{name: 'tags'}">
            查看全部
            <svg-icon icon-class="arrow" class="icon" />
          </router-link>
        </section>
        <tagsHot />
      </div>
    </div>
  </div>
</template>


<script>
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import tagsHot from '@/components/tags/tags_hot.vue'

export default {
  components: {
    articleCardListNew,
    buttonLoadMore,
    tagsHot
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 20,
          tagid: this.$route.params.id,
          extra: 'short_content',
          orderBy: 'hot_score',
          order: 'desc'
        },
        apiUrl: 'getPostByTagById',
        list: [],
        isAtuoRequest: true,
        reload: 0
      },
      mode: 'hot',
    }
  },
  mounted() {
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) this.pull.list = this.pull.list.concat(res.data.list)
    },
    // 切换
    toggleTag(val) {
      if (val === 'hot') {
        this.pull.params.orderBy = 'hot_score'
      } else if (val === 'new') {
        this.pull.params.orderBy = 'create_time'
      } else {
        this.pull.params.orderBy = 'hot_score'
      }
      this.mode = val
      this.pull.list = []
      this.pull.reload = Date.now()
    },
  }
}
</script>


<style lang="less" scoped>
.tag {
  .minHeight();
}

.row {
  max-width: 1200px;
  width: 100%;
  margin: 40px auto 0;
  padding-bottom: 40px;
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
  .col-6 {
    width: 66.666%;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
  }
  .col-3 {
    width: 33.333%;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
  }
}

.tags-title {
  font-size: 16px;
  font-weight: 400;
  color: #b2b2b2;
  padding: 0;
  margin: 0 20px 0 0;
  cursor: pointer;
  &:nth-last-child(1) {
    margin-right: 0;
  }
  &.active {
    color: #000000;
  }
}
.tags-text {
  // flex: 1;
}
.title-link {
  margin-left: 10px;
  display: none;
}
.head {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-title {
    margin: 0;
    padding: 0;
    margin-right: 10px;
    font-size: 18px;
    color: #000;
  }
  a {
    font-size:14px;
    font-weight:500;
    color:rgba(178,178,178,1);
    line-height:20px;
    &:hover {
      text-decoration: underline;
      .icon {
        transform: translateX(2px);
      }
    }
    .icon {
      line-height:20px;
      font-size: 12px;
      margin-bottom: 1px;
      transition: transform .2s;
    }
  }
}
// 组件的
.tag-list {
  margin: 20px 0 0 0;
}

.sticky {
  position: sticky;
  top: 80px;
}
// 页面小于
@media screen and (max-width: 768px) {
  .row {
    margin-top: 20px;
    .col-6 {
      width: 100%;
    }
    .col-3 {
      display: none;
    }
  }
  .title-link {
    display: initial;
  }
}

// 小于600
@media screen and (max-width: 600px) {
  .tag {
    background-color: #fff;
  }
}
</style>