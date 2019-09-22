<template>
  <el-dropdown class="language">
    <span class="el-dropdown-link">
      {{ language }}<i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <span @click="toggleLanguage('zh')">
          中文
        </span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span @click="toggleLanguage('en')">
          English
        </span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    language() {
      console.log(this.$route)
      return this.$i18n.locale === 'zh' ? '中文' : 'English'
    }
  },
  methods: {
    toggleLanguage(lang) {
      // this.$i18n.locale = lang
      if (lang === 'zh') {
        this.$router.replace({
          // eslint-disable-next-line no-useless-escape
          path: this.$route.fullPath.replace(/^\/[^\/]+/, '')
        })
      } else {
        this.$router.replace({
          path: '/en' + this.$route.fullPath
        })
      }
      this.$store.commit('SET_LANG', lang)
    }
  }
}
</script>

<style lang="less" scoped>
.language {
  margin-left: 16px;
  span {
    display: block;
  }
}
</style>
