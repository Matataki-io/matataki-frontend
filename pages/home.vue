<template>
  <div class="container">
    <h1>home</h1>
    <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type">
      {{ tag.name }}
    </el-tag>
    <button @click="getAccount">登录</button>
    <BaseModalForSignIn />
  </div>
</template>

<script>
/* eslint-disable */
import BaseModalForSignIn from "@/components/BaseModalForSignIn";
export default {
  components: {
    BaseModalForSignIn
  },
  data() {
    return {
      tags: [
        { name: "标签一", type: "" },
        { name: "标签二", type: "success" },
        { name: "标签三", type: "info" },
        { name: "标签四", type: "warning" },
        { name: "标签五", type: "danger" }
      ]
    };
  },
  async mounted() {
    /* const data = await this.$axios.$get(
      `${this.$API.wx}?url=${window.location.url}`
    ) */
    const data = await this.$API.wx(window.location.url)
    console.log(data);
    console.log(this.$utils.getCookie('ACCESS_TOKEN'))
    this.$store.dispatch('test')
  },
  methods: {
    getAccount() {
      console.log(this.$store.state('test'));

      this.$store.dispatch('test')
    }
  }
};
</script>

<style lang='less' scoped>
.container {
  .minHeight();
}
h1 {
  color: @yellow;
  //.subinfo-font();
}
</style>
