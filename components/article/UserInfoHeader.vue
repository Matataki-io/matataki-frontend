<template>
  <div class="Post-Author">
    <div class="AuthorInfo">
      <router-link :to="{name: 'user-id', params: {id : article.uid}}">
        <avatar :size="'38px'" :src="avatarSrc" class="Avatar" />
      </router-link>
      <div class="AuthorInfo-content">
        <router-link :to="`/user/${article.uid}`">
          <span class="UserLink AuthorInfo-name">{{ article.nickname || article.author }}</span>
        </router-link>
        <span class="Post-Time">{{ $t('p.publishFrom') }}{{ time }}</span>
        <span class="View-Num">
          <svg-icon class="icon" icon-class="read" />
          {{ article.read || 0 }}</span>
      </div>
    </div>
    <template v-if="!isMe(article.uid)">
      <el-button :class="!info.is_follow && 'black'" @click.stop="followOrUnFollow" size="small" class="follow">
        <i v-if="!info.is_follow" class="el-icon-plus" />
        {{ followBtnText }}
      </el-button>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      avatarSrc: '',
      info: {
        is_follow: 0 // 默认值
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe']),
    followBtnText() {
      return this.info.is_follow ? this.$t('following') : this.$t('follow')
    },
    time() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  },
  watch: {
    article() {
      // 完成获取用户信息
      this.getUserInfo(this.article.uid)
      console.log('完成获取用户信息')
    }
  },
  mounted() {
    // 完成获取用户信息
    this.getUserInfo(this.article.uid)
  },
  methods: {
    // 主要获取关注状态
    getUserInfo(id) {
      this.$API.getUser({ id }).then(res => {
        if (res.code === 0) {
          this.info.is_follow = res.data.is_follow
          this.avatarSrc = res.data.avatar ? this.$API.getImg(res.data.avatar) : ''
        } else {
          this.$message.warning(res.message)
        }
      }).catch(err => {
        console.log(`获取关注状态失败${err}`)
      })
    },
    followOrUnFollow() {
      if (this.info.is_follow) {
        this.$confirm(this.$t('p.confirmUnFollowMessage'), this.$t('promptTitle'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.followOrUnfollowUser(this.article.uid, 0)
        })
      } else {
        this.followOrUnfollowUser(this.article.uid, 1)
      }
    },
    async followOrUnfollowUser(id, type) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')
      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if (res.code === 0) {
          this.$message.success(`${message}${this.$t('success.success')}`)
          this.info.is_follow = type === 1
          // 在获取一次防止出错
          this.getUserInfo(this.article.uid)
        } else {
          this.$message.error(`${message}${this.$t('error.fail')}`)
        }
      } catch (error) {
        this.$message.error(`${message}${this.$t('error.fail')}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
.Avatar {
  background: #fff;
  border-radius: 50%;
  vertical-align: top;
  height: 38px;
  width: 38px;
}
.AuthorInfo-content {
  display: flex;
  align-items: center;
}
.Post-Author {
  display: flex;
  align-items: center;
  .AuthorInfo {
    flex: 1 1;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .AuthorInfo-name {
    margin-left: 14px;
    font-size:18px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:33px;
  }
}
.Post-Time {
  margin-left: 18px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:33px;
}
.View-Num {
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:33px;
  margin-left: 18px;
  display: flex;
  align-items: center;
  .icon {
    font-size: 22px;
    margin-right: 6px;
  }
}
.Post-Time, .View-Num {
  font-size: 16px;
  color: @gray;
}
.follow {
  &.black {
    background: #333;
    color: #fff;
    border: 1px solid #333;
  }
}
</style>
