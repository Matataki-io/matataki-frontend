<template>
  <div class="tag">
    <g-header />
    <div class="row">
      <div class="col-6">
        <section class="head">
          <h3 class="head-title">
            {{ $t('tag.contain') }}<em>{{ $route.query.name }}</em>{{ $t('tag.tags') }}
          </h3>
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
            @buttonLoadMore="buttonLoadMore"
          />
        </div>
      </div>
      <div class="col-3 sticky">
        <section class="head">
          <h3 class="head-title">
            {{ $t('tag.moreTag') }}
          </h3>
          <section class="tag-list">
            <router-link
              v-for="(item, index) in tags"
              :key="index"
              class="tag-item"
              :to="{name: 'tag-id', params: { id: item.id }, query: { name: item.name }}"
            >
              {{ item.name }}
            </router-link>
          </section>
        </section>
      </div>
    </div>
  </div>
</template>


<script>
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'


export default {
  components: {
    articleCardListNew,
    buttonLoadMore
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 20,
          tagid: this.$route.params.id,
          extra: 'short_content'
        },
        apiUrl: 'getPostByTagById',
        list: [],
        isAtuoRequest: true
      },
      tags: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.tagsHotest()
    },
    // 热门标签
    async tagsHotest() {
      await this.$API.tagsHotest({
        pagesize: 20
      }).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.tags = res.data.list
        } else {
          console.log(res.message)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) this.pull.list = this.pull.list.concat(res.data.list)
    }
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
  margin: 20px auto 0;
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

.head {
  height: 24px;
  &-title {
    margin: 0;
    padding: 0;
    margin-right: 30px;
    font-size: 18px;
    em {
      font-style: normal;
      color: @purpleDark;
    }
  }
}

.tag-list {
  margin: 20px 0 0 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  .tag-item {
    text-align: center;
    transition: all .3s;
    margin: 0 10px 8px 0;
    background: #e4e4e4;
    border-radius: 100px;
    padding: 0 12px;
    border: 1px solid #e4e4e4;
      font-size: 12px;
      color: #505050;
      line-height: 22px;
      vertical-align: middle;
      z-index: 10;
      display: inline-block;
      height: 22px;

    &:hover {
      border-color: @purpleDark;
      color: @purpleDark;
    }
  }
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
}
</style>