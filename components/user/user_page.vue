<template>
  <div class="user-page">
    <div v-if="userInfo.banner" class="banner user-page-banner">
      <img :src="userInfo.banner" alt="banner">
    </div>
    <div v-else class="default-banner user-page-banner">
      <img src="@/assets/img/user_banner.png" alt="banner">
    </div>
    <div class="user-info user-page-info">
      <div class="user-info-center">
        <div class="fl ac jc token-avatar">
          <c-avatar
            :src="userInfo.avatar"
            class="avatar"
            :recommend-author="user.is_recommend === 1"
            :level="3"
            :token-user="!!tokenInfo.id"
            :level-token="3"
            :class="{'has-border': !tokenInfo.id }"
          />
          <img
            v-if="tokenUser"
            class="token-link"
            src="@/assets/img/token_link.png"
            alt="token-link"
          >
          <tokenAvatar
            v-if="tokenUser"
            :token="tokenData"
          />
        </div>
        <div>
          <h1 class="username">
            {{ userInfo.name }}
          </h1>
        </div>

        <p class="profile">{{ userInfo.introduction || $t('not') }}</p>
        <div class="fl jc">
          <router-link
            :to="{name: 'user-id-follow', params: {id: $route.params.id}}"
            class="fl fdc ac follow-block"
          >
            <span class="follow-number">{{ userInfo.follows || 0 }}</span>
            <span class="follow-title">{{ $t('follow') }}</span>
          </router-link>

          <router-link
            :to="{name: 'user-id-fan', params: {id: $route.params.id}}"
            class="fl fdc ac follow-block"
          >
            <span class="follow-number">{{ userInfo.fans || 0 }}</span>
            <span class="follow-title">{{ $t('fans') }}</span>
          </router-link>
        </div>
        <el-tooltip
          v-if="isMe(Number($route.params.id))"
          class="item"
          effect="dark"
          :content="$t('imgUpload.uploadBackgroundImg')"
          placement="top"
        >
          <bannerUpload
            :img-upload-done="imgUploadDone"
            :update-type="'banner'"
            class="banner-upload"
            @doneImageUpload="doneImageUpload"
          >
            <el-button
              slot="uploadButton"
              size="small"
              class="ibutton"
              type="info"
              icon="el-icon-s-open"
            />
          </bannerUpload>
        </el-tooltip>
        <followBtn
          v-if="!isMe(Number($route.params.id))"
          :id="Number($route.params.id)"
          class="follow"
        />
        <router-link
          v-else
          :to="{name: 'setting'}"
        >
          <el-button
            size="small"
            class="follow edit"
          >
            {{ $t('user.editProfile') }}
          </el-button>
        </router-link>
        <el-button
          size="small"
          class="share"
          @click="shareModalShow = true"
        >
          <svg-icon icon-class="share_new" />
          {{ $t('share') }}
        </el-button>
        <el-button
          size="small"
          class="transfer"
          @click="transfer"
        >
          <i class="el-icon-money" />
          转账
        </el-button>
      </div>
    </div>
    <div class="user-page-content">
      <userPageNav />
      <div class="article">
        <slot name="list" />
      </div>
    </div>
    <Share
      :share-modal-show="shareModalShow"
      :minetoken-user="{nickname: userInfo.name}"
      :page-type="1"
      :img="userInfo.avatar"
      @input="val => shareModalShow = val"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import userPageNav from './user_page_nav'
import tokenAvatar from './token_avatar.vue'
import followBtn from '@/components/follow_btn'
import Share from '@/components/token/token_share.vue'

import bannerUpload from '@/components/bannerUpload/index.vue'

export default {
  components: {
    followBtn,
    userPageNav,
    tokenAvatar,
    Share,
    bannerUpload
  },
  props: {
    userData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      token: false,
      seedUser: false,
      tokenUser: false,
      tokenData: Object.create(null),
      shareModalShow: false,
      imgUploadDone: 0, // 图片是否上传完成
      user: Object.create(null), // 用户信息 
      tokenInfo: Object.create(null), // token info
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['isMe', 'isLogined']),
  },
  created() {
    // this.getMyUserData()
  },
  mounted() {
    if (process.browser) {
      if (!this.$route.params.id) this.$router.go(-1)
      this.getUserInfo(this.$route.params.id)
      this.getTokenUser(this.$route.params.id)

      this.$nextTick(() => {
        this.refreshUser({ id: this.$route.params.id })
        this.tokenUserId(this.$route.params.id)
      })
    }
  },
  methods: {
    ...mapActions('user', ['refreshUser', 'followOrUnfollowUser']),
    getUserInfo(id) {
      this.$API.getUser(id)
        .then(res => {
          if (res.code === 0) {

            this.user = res.data

          }
        })
        .catch(e => {
          console.log('get user info error', e)
        })
    },
    async getTokenUser(id) {
      // 获取是否有 token
      const tokenRes = await this.$utils.factoryRequest(this.$API.tokenUserId(id))
      // not token, data is null
      this.tokenInfo = tokenRes ? (tokenRes.data || {}) : {}
    },
    async getMyUserData() {
      await this.$API
        .getMyUserData()
        .then(res => {
          const statusToken =
            res.data.status & this.$userStatus.hasMineTokenPermission
          const statusSeedUser = res.data.status & this.$userStatus.isSeedUser
          if (res.code === 0 && statusToken) this.token = true
          if (res.code === 0 && statusSeedUser) this.seedUser = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    async tokenUserId(id) {
      await this.$API
        .tokenUserId(id)
        .then(res => {
          if (res.code === 0 && res.data.id > 0) {
            this.tokenUser = true
            this.tokenData = res.data
          }
        })
        .catch(err => console.log('get token user error', err))
    },
    doneImageUpload() {
      this.imgUploadDone += Date.now()
      this.refreshUser({ id: this.$route.params.id })
    },
    transfer() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }

      if (this.isMe(this.$route.params.id)) {
        this.$message({
          showClose: true,
          message: '不能给自己转账',
          type: 'warning'
        })
        return
      }

      const userDataWithId = this.userData ? {
        ...this.userData,
        id: Number(this.$route.params.id)
      } : null

      this.$store.commit('transferDialog/setTransferUserData', userDataWithId)
      this.$store.commit('transferDialog/setTransferDialog', true)
    },
  }
}
</script>

<style lang="less" scoped>
.banner {
  height: 290px;
  background-color: #ffffff;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  padding: 0px;
  img {
    max-width: 3840px;
    height: 100%;
    display: block;
    object-fit: cover;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    height: 100%;
  }
}
.default-banner {
  height: 290px;
  background-color: #c8d7ff;
  box-sizing: border-box;
  img {
    height: 100%;
    display: block;
    margin: 0 auto;
  }
}

.user-info {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  .token-avatar {
    margin-top: -62px;
    margin-bottom: 20px;
  }
  &-center {
    max-width: 766px;
    height: 100%;
    margin: 0 auto;
    padding: 1px 10px 20px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
  }
  .avatar {
    display: inline-block;
    background: #fff;
    box-sizing: border-box;
    width: 120px;
    height: 120px;
    border: 6px solid #fff;
  }
  .username {
    font-size: 24px;
    font-weight: bold;
    color: #000;
    line-height: 1;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    display: inline-block;
    position: relative;
    .tooltip {
      position: absolute;
      right: -28px;
    }
  }
  .token-link {
    width: 50px;
    height: 20px;
    margin: 0 20px;
  }
  .seeduser {
    font-size: 36px;
    background: #fff;
    margin-left: 4px;
  }
  .tokens {
    cursor: pointer;
    width: 26px;
    margin-left: 4px;
  }
  .profile {
    font-size: 16px;
    font-weight: 400;
    color: #000;
    line-height: 22px;
    padding: 0;
    margin: 20px 0 40px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .follow-block {
    margin: 0 34px;
  }
  .follow-number {
    font-size: 24px;
    font-weight: bold;
    color: rgba(84, 45, 224, 1);
    line-height: 28px;
    padding: 0;
    margin: 0 0 8px;
  }
  .follow-title {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
    padding: 0;
    margin: 0;
  }
  .transfer {
    position: absolute;
    right: 10px;
    bottom: 0px;
  }
  .share {
    position: absolute;
    right: 10px;
    bottom: 40px;
  }
  .banner-upload {
    position: absolute;
    right: 10px;
    bottom: 250px;
    .ibutton {
      font-size: 18px;
      padding: 5px;
      background: #9093998c;
      border-color: #00000000;
      &:hover {
        background: #909399;
      }
    }
  }
  .follow {
    position: absolute;
    right: 10px;
    bottom: 80px;
    &.edit {
      padding-left: 11px;
      padding-right: 11px;
    }
  }
}

.article {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.user-page-content {
  max-width: 766px;
  margin: 0 auto;
  padding: 0 10px;
}

// <600
@media screen and (max-width: 600px) {
  .banner {
    height: 200px;
  }
  .user-info {
    .token-avatar {
      margin-top: -32px;
    }
    .avatar {
      width: 60px !important;
      height: 60px !important;
      &.no-recommend {
        border: 2px solid #fff;
      }
      // 同步组件内的 w60

      /deep/ .avatar-box {
        border-width: 2px;
      }
      /deep/ .recommend-icon {
        right: -8px !important;
        bottom: -2px !important;
        width: 30px !important;
      }
      /deep/ .recommend::after {
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
      }
    }
    .token-link {
      width: 25px;
      height: 10px;
    }
  }
  .token {
    width: 60px;
    height: 60px;
    /deep/ .minetoken {
      width: 36px;
      height: 36px;
      margin: -5px 0 0 -5px;
    }
  }
}
</style>
