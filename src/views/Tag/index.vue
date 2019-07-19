<template>
  <div class="tag mw">
    <BaseHeader
      :pageinfo="{ title: tagTitle }"
      :white="true"
      :customize-header-bc="tagBanner"
      :icon-color="iconColorStatusColor"
      :is-scroll-emit="true"
      :scroll-show-title="true"
      @scrollToggleStatus="status => (iconColorStatus = status)"
    />
    <div class="tag-banner" :style="{ backgroundColor: tagBanner }">
      <div class="tag-banner-title">
        <img src="@/assets/img/icon_article_tag.svg" alt="tag" />
        <span>{{ tagTitle }}</span>
      </div>
    </div>
    <p class="tag-title">最新</p>
    <BasePull
      class="tag-article"
      :loading-text="'无草稿'"
      :params="params"
      :is-obj="{ type: 'Object', key: 'data' }"
      :api-url="apiUrl"
      @getListData="getListData"
    >
      <ArticleCard v-for="(item, index) in tagList" :key="index" :article="item" />
    </BasePull>
  </div>
</template>

<script>
import tagColor from '@/common/tagColor'
import { ArticleCard } from '@/components/'

export default {
  name: 'Tag',
  components: { ArticleCard },
  // inject: ["reload", "openReload"], // 刷新页面的解决方案
  // beforeRouteEnter: (to, from, next) => next(vm => vm.reload()),
  data() {
    return {
      tagTitle: this.$route.query.name,
      tagBanner: '#000',
      tagList: [],
      params: {
        tagid: this.$route.query.id
      },
      apiUrl: 'getPostByTagById',
      iconColorStatus: false
    }
  },
  computed: {
    iconColorStatusColor() {
      return this.iconColorStatus ? '#000' : '#fff'
    }
  },
  created() {
    this.tagBanner = tagColor()[this.$route.query.id] || '#000'
  },
  methods: {
    getListData(res) {
      this.tagList = res.list
    }
  }
}
</script>

<style src="./index.less" scoped lang="less"></style>
