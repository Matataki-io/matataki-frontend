<template>
  <el-button
    v-if="showBtn"
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
    },
    token: {
      type: Boolean,
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
    },
    showBtn() {
      if (this.isMe(this.id)) {
        return this.token
      } else return true
    }
  },
  created() {
  },
  methods: {
    ...mapActions('user', [
      'refreshUser'
    ]),
    fanCoins() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (this.isMe(this.id)) {
        this.$router.push({
          name: 'user-account-minetoken'
        })
      } else {
        this.$router.push({
          name: 'exchange'
        })
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
