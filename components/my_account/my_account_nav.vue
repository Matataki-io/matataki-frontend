<template>
  <div class="info">
    <router-link v-for="(tag, index) in tagsList" :to="{ name: tag.url }" :key="index" :class="$route.name === tag.url && 'active'">
      {{ tag.title }}
    </router-link>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      tagsList: [
        { title: this.$t('user.information'), url: 'setting' },
        { title: this.$t('user.accountSetting'), url: 'setting-account' },
        { title: this.$t('user.buycoins'), url: 'tokens' },
        { title: this.$t('user.editcoins'), url: 'editminetoken' },
        { title: this.$t('user.myBookmark'), url: 'bookmark' },
        { title: this.$t('user.wallet'), url: 'account' },
        { title: this.$t('user.buyHistory'), url: 'buy' },
        { title: this.$t('user.invite'), url: 'invite' },
        { title: this.$t('user.systemSetting'), url: 'setting-system' }
      ]
    }
  },
  computed: {
  },
  watch: {
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
  padding: 10px 20px;
  a {
    display:block;
    color: #000;
    font-size: 18px;
    padding: 10px 0;
    &.active {
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
  }
}
</style>
