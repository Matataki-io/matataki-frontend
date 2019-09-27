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
    }
  },
  data() {
    return {
      tokens: false
    }
  },
  computed: {
    ...mapGetters(['isMe', 'isLogined']),
    fanCoinsBtn() {
      return this.isMe(this.id) ? this.$t('user.manageCoins') : this.$t('user.transactionCoins')
    },
    showBtn() {
      if (this.isMe(this.id)) {
        return this.tokens
      } else return true
    }
  },
  created() {
    this.getMyUserData()
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
    },
    async getMyUserData() {
      const res = await this.$API.getMyUserData().then(res => {
        if (res.code === 0 && res.data.level > 0) this.tokens = true
      }).catch(err => {
        console.log(err)
      })
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
