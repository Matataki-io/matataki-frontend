<template>
  <userLayout>
    <template v-slot:main>
      <h2 class="tag-title">
        {{ $t('user.indieBlogSettings') }}
      </h2>
      <div class="list">
        <div class="title list-title">
          {{ $t('user.usesGitHubRepository') }}
        </div>
        <el-input v-model="githubRepo" class="list-content" disabled />
      </div>
      <div class="list">
        <div class="title list-title">
          {{ $t('user.usesTheme') }}
        </div>
        <el-input v-model="usesTheme" class="list-content" disabled />
      </div>
      <div class="list">
        <div class="title list-title">
          {{ $t('user.indieBlogTitle') }}
        </div>
        <el-input v-model="siteTitle" class="list-content" disabled />
      </div>
      <div class="list align-center">
        <el-button>{{ $t('save') }}</el-button>
      </div>
    </template>
    <template v-slot:nav>
      <myAccountNav />
    </template>
  </userLayout>
</template>
<script>
import userLayout from '@/components/user/user_layout'
import myAccountNav from '@/components/my_account/my_account_nav'

export default {
  components: {
    userLayout,
    myAccountNav
  },
  data() {
    return {
      githubRepo: 'matataki-save',
      usesTheme: 'landscape',
      siteTitle: 'Your Indie Blog | Matataki'
    }
  }
}
</script>
<style lang="less" scoped>
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 10px;
}
.list {
  margin: 20px 0 0 0;
  display: flex;
  .list-content {
    flex: 8;
  }
  .list-title {
    flex: 2;
    align-self: center;
  }
}
.title {
  font-size:16px;
  font-weight:400;
  color:#333;
  line-height:28px;
  margin-right: 20px;
}
.align-center {
  display: flex;
  justify-content: center;
}
</style>
