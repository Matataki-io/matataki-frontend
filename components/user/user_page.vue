<template>
  <div class="user-page">
    <g-header />
    <div class="banner user-page-banner">
      <img src="@/assets/img/user_banner.png" alt="banner">
    </div>
    <div class="user-info user-page-info">
      <div class="user-info-center">
        <avatar :src="userInfo.avatar" size="100px" class="avatar" />
        <h1 class="username">
          {{ userInfo.name }}
          <!-- {{ userInfo }} -->
          <!-- <el-tooltip
            v-if="seedUser"
            class="item"
            effect="dark"
            content="种子用户"
            placement="top"
          >
            <svg-icon
              class="seeduser"
              icon-class="seeduser"
            />
          </el-tooltip> -->
        </h1>

        <p class="profile">
          {{ userInfo.introduction || $t('not') }}
        </p>
        <div class="fl jc">
          <div class="fl fdc ac follow-block">
            <span class="follow-number">{{ userInfo.follows || 0 }}</span>
            <span class="follow-title">{{ $t('follow') }}</span>
          </div>
          <div class="fl fdc ac follow-block">
            <span class="follow-number">{{ userInfo.fans || 0 }}</span>
            <span class="follow-title">{{ $t('fans') }}</span>
          </div>
        </div>
        <fanCoinsBtn :id="Number($route.params.id)" :token="token" class="fans-coins-btn" />
        <followBtn v-if="!isMe(Number($route.params.id))" :id="Number($route.params.id)" class="follow" />
        <router-link
          v-else
          :to="{name: 'setting'}"
        >
          <el-button
            size="small"
            class="follow"
          >
            {{ $t('user.editProfile') }}
          </el-button>
        </router-link>
      </div>
    </div>
    <div class="user-page-content">
      <userPageNav />
      <div class="article">
        <slot name="list" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import userPageNav from './user_page_nav'
import avatar from '@/components/avatar/index'
import followBtn from '@/components/follow_btn'
import fanCoinsBtn from '@/components/user/fan_coins_btn.vue'
export default {
  components: {
    avatar,
    followBtn,
    userPageNav,
    fanCoinsBtn
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['isMe'])
  },
  data() {
    return {
      token: false,
      seedUser: false
    }
  },
  created() {
    if (!this.$route.params.id) this.$router.go(-1)
    this.getMyUserData()
  },
  mounted() {
    this.refreshUser({ id: this.$route.params.id })
  },
  methods: {
    ...mapActions('user', [
      'refreshUser',
      'followOrUnfollowUser'
    ]),
    async getMyUserData() {
      const res = await this.$API.getMyUserData().then(res => {
        const statusToken = (res.data.status & this.$userStatus.hasMineTokenPermission)
        const statusSeedUser = (res.data.status & this.$userStatus.isSeedUser)
        if (res.code === 0 && statusToken) this.token = true
        if (res.code === 0 && statusSeedUser) this.seedUser = true
      }).catch(err => {
        console.log(err)
      })
    }

  }

}
</script>

<style lang="less" scoped>
.user-page {
  .minHeight();
}
.banner {
  height: 290px;
  background-color: #C8D7FF;
  box-sizing: border-box;
  img {
    height: 100%;
    display: block;
    margin: 0 auto;
  }
}

.user-info {
  width: 100%;
  height: 220px;
  background-color: #fff;
  box-sizing: border-box;
  &-center {
    width: 766px;
    height: 100%;
    margin: 0 auto;
    padding: 1px 10px 0;
    text-align: center;
    position: relative;
    box-sizing: border-box;
  }
  .avatar {
    border: 4px solid #fff;
    display: inline-block;
    margin-top: -52px;
    background: #fff;
  }
  .username {
    font-size:24px;
    font-weight: bold;
    color: #000;
    line-height:33px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .seeduser {
    font-size: 36px;
    background: #fff;
    margin-left: 4px;
  }
  .profile {
    font-size:16px;
    font-weight:400;
    color: #000;
    line-height:22px;
    padding: 0;
    margin: 10px 0 20px;
  }
  .follow-block {
    margin: 0 34px;
  }
  .follow-number {
    font-size:24px;
    font-weight:bold;
    color:rgba(84,45,224,1);
    line-height:28px;
    padding: 0;
    margin: 0 0 8px;
  }
  .follow-title {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
    padding: 0;
    margin: 0;
  }
  .follow {
    position: absolute;
    right: 10px;
    bottom: 20px;
  }
  .fans-coins-btn {
    position: absolute;
    right: 10px;
    bottom: 60px;
  }
}

.article {
  width: 766px;
  height: 100%;
  margin: 0 auto;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
