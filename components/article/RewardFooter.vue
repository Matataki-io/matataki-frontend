<template>
  <div class="reward-container">
    <button
      class="reward-btn"
      :disabled="isMe(userData.id)"
      :title="isMe(userData.id) && '不能给自己赞赏~'"
      @click="reward"
    >
      <svg-icon
        icon-class="shang"
        class="reward-icon"
      />
    </button>
    <p class="reward-tip">喜欢就打赏Fan票吧～</p>
    <p v-if="rewardCount > 0" class="reward-list-tip">- {{ rewardCount }}位瞬Matataki用户已打赏 -</p>
    <div v-if="rewardCount > 0" class="recommended-designer-avatar-wrap js-recommended-avatar">
      <div v-for="(item, i) of list" :key="i" class="avatar-container-30">
        <c-user-popover :user-id="Number(item.from_uid)">
          <router-link
            :to="{name: 'user-id', params: { id: item.from_uid }}"
            :title="item.nickname"
            class="avatar-container_face"
            target="_blank"
          >
            <c-avatar
              :src="avatar(item.avatar)"
              :recommend-author="item.user_is_recommend === 1"
              :token-user="item.user_is_token === 1"
            />
          </router-link>
        </c-user-popover>
      </div>
      <div v-if="leftCount > 0 && !showAll" class="avatar-container-30">
        <button class="left-count" @click="showAll = true">
          +{{ leftCount }}
        </button>
      </div>
      <div v-if="showAll" class="avatar-container-30">
        <button class="left-count" @click="showAll = false">
          收起
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
import { uniqBy } from 'lodash'

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
      pagesize: 9,
      showAll: false
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe']),
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
      this.$API.getRewardList(this.$route.params.id, 1, 9999)
        .then(res => {
          let list = uniqBy(res.data.list, 'from_uid')
          this.rewardList = list
          this.rewardCount = list.length
        })
    },
    success() {
      this.showSuccess = true
      this.getRewardList()
      this.$emit('success')
    },
    reward() {
      if (this.isLogined) {
        this.show = true
      } else {
        // popup login modal
        this.$store.commit('setLoginModal', true)
        this.$emit('login')
        this.$message({
          showClose: true,
          message: '请先登录～',
          type: 'warning'
        })
      }
    },
    avatar(src) {
      return src ? this.$ossProcess(src, { h: 60 }) : ''
    }
  }
}
</script>
<style lang="less" scoped>
@media screen and (max-width: 540px) {
  .recommended-designer-avatar-wrap {
    justify-content: center;
  }
}
.recommended-designer-avatar-wrap {
  max-width: 500px;
  margin: 0 auto 20px;
  display: flex;
  flex-wrap: wrap;
  .avatar-container-30 {
    margin: 20px 10px 0;
    width: 30px;
    position: relative;
  }
  .left-count {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: block;
    background: #542de0;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    border: none;
    font-size: 12px;
    user-select: none;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  .avatar-container_face {
    border-radius: 50%;
    display: block;
    background: #f2f2f2;
    > img {
      border-radius: 50%;
      display: block;
      width: 30px;
      height: 30px;
    }
  }
}
.reward-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .reward-btn {
    background-color: #542de0;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-top: 40px;
    cursor: pointer;
    border: none;
    transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
    &:hover {
      background-color: rgba(84, 45, 224, 0.9);
      box-shadow: inset 0 0 20px rgba(77, 12, 255, 0.5), 0 0 20px rgba(218, 185, 255, 0.863);
      outline: none;
      transform: scale(1.05);
      outline-offset: 15px;
      text-shadow: 1px 1px 2px #427388;
    }
    &:disabled {
      background-color: #a1a1a1;
      box-shadow: none;
    }
    &:active {
      transform: scale(0.9);
      background-color: #502DCF;
      box-shadow: 0 2px 25px rgba(140, 0, 255, 0.747);
    }
  }
  .reward-icon {
    font-size: 40px;
  }
  .reward-tip {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    padding: 0;
    margin: 10px 0 0 0;
  }
  .reward-list-tip {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
    padding: 0;
    margin: 20px 0 0 0;
  }
}
</style>