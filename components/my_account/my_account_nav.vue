<template>
  <div class="info">
    <router-link
      v-for="(tag, index) in tagsList"
      :key="index"
      :to="{ name: tag.url }"
      :class="$route.name === tag.url && 'active'"
    >
      {{ tag.title }}
    </router-link>
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
        { title: this.$t('user.userInformation'), url: 'setting' },
        { title: this.$t('user.accountSetting'), url: 'setting-account' },
        // { title: this.$t('user.myBookmark'), url: 'bookmark' },
        { title: this.$t('user.wallet'), url: 'account' },
        { title: this.$t('user.buyHistory'), url: 'buy' },
        { title: this.$t('user.invite'), url: 'invite' },
        { title: this.$t('user.indieBlogSettings'), url: 'setting-indieblog'},
        { title: this.$t('user.systemSetting'), url: 'setting-system' }
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
.info {
  overflow: hidden;
  background-color: #fff;
  border-radius: @br10;
  padding: 0 20px;
  a {
    display:block;
    color: #b2b2b2;
    font-size: 18px;
    margin: 20px 0 0;
    font-size: 500;
    &.active {
      color:rgba(0,0,0,1);
    }
    &:nth-last-of-type(1) {
      margin-bottom: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  .info {
    a {
      display: inline-block;
      margin-right: 10px;
      font-size: 16px;
    }
  }
}
</style>
