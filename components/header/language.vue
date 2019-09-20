<template>
  <el-dropdown class="language">
    <span class="el-dropdown-link">
      {{ language }}<i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>中文</el-dropdown-item>
      <el-dropdown-item>English</el-dropdown-item>
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
      console.log(this.$i18n)
      // return this.$i18n.locale === 'zh' ? '中文' : 'English'
      return '中文'
    }
  }
}
</script>

<style lang="less" scoped>
.language {
  margin-left: 16px;
}
</style>
