<template>
  <div class="easter-egg">
    <h1 class="title">🎉 恭喜你发现了隐藏的彩蛋！</h1>
    <p>当前模式：{{ env }}</p>
    <p>版本号： {{ version }}</p>
    <p v-if="checkIsBuildOnCommit">
      基于 commit <a :href="commitUrl">{{ commitHash }} </a> 构建
    </p>
    <Button @click="xxx()">神秘按鈕</Button>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex";

export default {
  name: 'Easter-Egg',
  computed: {
    env() { return process.env.NODE_ENV; },
    version() { return process.env.VUE_APP_VERSION; },
    commitHash() { return process.env.VUE_APP_COMMIT_HASH; },
    checkIsBuildOnCommit() {
      // undefined will be stringify to "undefined"
      // Ref: https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/util/resolveClientEnv.js#L1
      return this.commitHash !== 'undefined';
    },
    commitUrl() {
      return `https://github.com/smart-signature/smart-signature-future/commit/${this.commitHash}`;
    },
  },
  methods: {
    /*
    ...mapActions(["makeOrder"]),
    async buySomething() {
      const num = 10;
      await this.makeOrder({ num, amount: num * 20000, signId: 100455, sponsor: { id: null, username: null } });
    }, */
    /*
    ...mapActions(["accountCheck"]),
    async xxx() {
      this.accountCheck();
    }, */
  },
};
</script>
