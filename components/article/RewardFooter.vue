<template>
  <div class="reward-container">
    <button class="reward-btn" @click="reward">
      <svg-icon
        icon-class="shang"
        class="reward-icon"
      />
    </button>
    <p class="reward-tip">喜欢就打赏Fan票吧～</p>
    <p class="reward-list-tip">- {{ rewardCount }}位瞬Matataki用户已打赏 -</p>
    <div class="recommended-designer-avatar-wrap js-recommended-avatar">
      <div v-for="(item, i) of list" :key="i" class="avatar-container-40">
        <a :href="`/user/${item.from_uid}`" :title="item.nickname" class="avatar-container_face">
          <img :src="$API.getImg(item.avatar)">
        </a>
      </div>
      <div v-if="leftCount > 0 && !showAll" class="avatar-container-40">
        <button class="left-count" @click="showAll = true">
          +{{ leftCount }}
        </button>
      </div>
    </div>
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
      showSuccess: false,
      rewardList: [],
      rewardCount: 0,
      pagesize: 8,
      showAll: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    leftCount() {
      return Number(this.rewardCount) - Number(this.pagesize)
    },
    list() {
      if (this.showAll) {
        return this.rewardList
      }
      return this.rewardList.slice(0, this.pagesize)
    }
  },
  mounted() {
    this.getRewardList()
  },
  methods: {
    getRewardList() {
      this.$API.getRewardList(this.$route.params.id).then(res => {
        this.rewardList = res.data.list
        this.rewardCount = res.data.count
      })
    },
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
.recommended-designer-avatar-wrap {
  width: max-content;
  max-width: 600px;
  height: 60px;
  overflow: hidden;
  margin: 0 auto 20px;
  display: flex;
  flex-flow: wrap;
  .avatar-container-40 {
    margin: 20px 10px 0;
    width: 40px;
    position: relative;
  }
  .left-count {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: block;
    background: #542DE0;
    color: #ffffff;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
    border: none;
  }
  .avatar-container_face {
    border-radius: 50%;
    display: block;
    background: #F2F2F2;
    >img {
      border-radius: 50%;
      display: block;
      width: 40px;
      height: 40px;
    }
  }
}
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
    font-size: 18px;
  }
  .reward-list-tip {
    color: #B2B2B2;
    font-size: 14px;
  }
}
</style>