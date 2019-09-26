<template>
  <el-dropdown class="language">
    <span class="el-dropdown-link">
      {{ language }}<i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <span @click="changeLanguage('zh')">
          中文
        </span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span @click="changeLanguage('en')">
          English
        </span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {

    }
  },
  computed: {
    language() {
      // console.log(this.$route)
      return this.$i18n.locale === 'zh' ? '中文' : 'English'
    }
  },
  methods: {
    changeLanguage(lang) {
      Cookies.set('language', lang)

      this.$i18n.locale = lang
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
