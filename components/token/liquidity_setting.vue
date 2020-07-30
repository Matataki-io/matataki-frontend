<template>
  <div class="setting">
    <div class="setting-header">
      <h3 @click="$router.go(-1)">
        管理后台
        <i class="el-icon-arrow-right" />
        流动性管理
      </h3>
    </div>
    <div class="setting-nav">
      <router-link
        v-for="(tag, index) in tagsList"
        :key="index"
        :to="{ name: tag.url }"
        :class="$route.name === tag.url && 'active'"
        replace
      >
        {{ tag.title }}
      </router-link>
    </div>
    <div class="slot-card">
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      tagsList: [
        { title: '增发设置', url: 'liquidity-mint' },
        { title: '直通车', url: 'liquidity-trade' }
      ],
      tokens: false
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.setting {
  max-width: 1200px;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  margin-bottom: 100px;
  &-header {
    display: flex;
    margin: 20px 0;
    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      color: black;
      line-height: 28px;
      cursor: pointer;
    }
  }
  &-nav {
    display: flex;
    margin-bottom: 20px;
    a {
      font-size: 16px;
      font-weight: bold;
      color: #B2B2B2;
      line-height: 22px;
      margin: 0 20px 0 0;
      &.active {
        color: black;
      }
    }
  }
  .slot-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
    padding: 40px 100px;
  }
}

@media screen and (max-width: 1000px) {
  .setting {
    .slot-card {
      padding: 20px 20px;
    }
  }
}
</style>
