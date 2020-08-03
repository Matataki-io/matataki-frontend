<template>
  <div class="about">
    <h2 class="token-title">
      {{ $t('social.relatedWebsites') }}
    </h2>
    <ul v-if="resourcesWebsites.length !== 0 && resourcesWebsites[0].url">
      <li
        v-for="(item, index) in resourcesWebsites"
        :key="index"
      >
        <a
          :href="formatUrl(item.url)"
          target="_blank"
        >{{ item.name || item.url }}</a>
      </li>
    </ul>
    <span
      v-else
      class="not"
    >{{ $t('not') }}</span>
  </div>
</template>
<script>

export default {
  components: {
  },
  props: {
    resourcesWebsites: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
    }
  },
  // computed: {},
  watch: {
  },
  // created() {},
  // mounted() {},
  methods: {
    formatUrl(url) {
      const isHttp = url.indexOf('http://')
      const isHttps = url.indexOf('https://')
      if (isHttp !== 0 && isHttps !== 0) url = 'http://' + url
      return url
    },
  }
}
</script>
<style lang="less" scoped>
.about {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  ul {
    padding: 0;
    margin: 10px 0 0;
    overflow: hidden;
    li {
      list-style: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 10px 0;
      a {
        font-size: 16px;
        color: @black;
        line-height: 22px;
        text-decoration: underline;
      }
    }
  }
}
.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0;
}
.not {
  color: #333;
  font-style: 14px;
  padding-top: 20px;
  display: inline-block;
}
@media screen and (max-width: 600px) {
  .token-title {
    font-size: 20px;
  }
}
</style>
