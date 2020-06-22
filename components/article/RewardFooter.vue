<template>
  <div class="reward-container">
    <button class="reward-btn" @click="reward">
      <svg-icon
        icon-class="shang"
        class="reward-icon"
      />
    </button>
    <p class="reward-tip">喜欢就打赏Fan票吧～</p>
    <RewardDialog v-model="show" :user-data="userData" @success="success" />
    <RewardSuccess v-model="showSuccess" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import RewardDialog from '@/components/RewardDialog'
import RewardSuccess from '@/components/RewardSuccess'

export default {
  components: {
    RewardDialog,
    RewardSuccess
  },
  props: {
    userData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      show: false,
      showSuccess: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
  },
  methods: {
    success() {
      this.showSuccess = true
    },
    reward() {
      if (this.isLogined) {
        this.show = true
      } else {
        this.$message({
          showClose: true,
          message: '请先登录～',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.reward-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .reward-btn {
    background-color: #542DE0;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-top: 20px;
    cursor: pointer;
    border: none;
    &:hover {
       background-color: rgba(84,45,224,0.9);
    }
  }
  .reward-icon {
    font-size: 2rem;
  }
  .reward-tip {
    color: #000000;
    font-size: 16px;
  }
}
</style>