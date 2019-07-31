<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="setting" />
      <div class="set-main">
        <div class="list">
          <span class="title">修改头像</span>
          <div class="content">
            1
          </div>
        </div>
        <div class="list">
          <span class="title">修改昵称</span>
          <div class="content">
            1
          </div>
        </div>
        <div class="list">
          <span class="title">修改简介</span>
          <div class="content">
            1
          </div>
        </div>
        <div class="line" />
        <div class="list">
          <span class="title">接受文章转让</span>
          <div class="content">
            1
          </div>
        </div>
        <button class="save">
          保存
        </button>
      </div>
    </template>
    <template slot="info">
      <userInfo />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
export default {
  components: {
    userLayout,
    userInfo,
    userNav
  },
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
  }
}
</script>

<style lang="less" scoped src="../../index.less">
</style>
<style lang="less" scoped>

</style>
