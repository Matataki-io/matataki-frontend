<template>
  <el-button
    size="small"
    class="fan-coins"
    @click="fanCoins"
  >
    {{ fanCoinsBtn }}
  </el-button>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined']),
    fanCoinsBtn() {
      return this.isMe(this.id) ? this.$t('user.manageCoins') : this.$t('user.transactionCoins')
    }
  },
  methods: {
    ...mapActions('user', [
      'refreshUser'
    ]),
    fanCoins() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (this.isMe(this.id)) {

      } else {

      }
    }
  }
}
</script>

<style scoped lang="less">
.fan-coins {
  background: @purpleDark;
  color: #fff;
  border: 1px solid @purpleDark;
}
</style>
