<template>
  <n-link :to="{name: 'p-id', params: {id: card && card.id}}" class="card" target="_blank">
    <div class="bg">
      <div class="article">
        <div class="container">
          <div class="article-title">
            <h3 v-clampy="2" v-html="xssTitle" class="search-res" />
          </div>
          <div v-html="xssContent" class="content-text search-res" />
          <div class="des">
            <!-- 文章发布时间 -->
            <div class="date">
              {{ dateCard }}
            </div>
            <span class="empty" />
            <!-- 付费文章 -->
            <img
              v-if="card.require_holdtokens || card.require_buy"
              class="lock-img"
              src="@/assets/img/lock.png"
              alt="lock"
            >
            <!-- 阅读量 -->
            <span class="data">
              <i class="el-icon-view" />
              {{ read }}
            </span>
            <!-- 点赞量 -->
            <span class="data">
              <svg-icon icon-class="like" />
              {{ likes }}
            </span>
            <!-- 复制分享链接 -->
            <a href="javascript:;">
              <span @click="copyCode(clipboard(card))" class="copy">
                <svg-icon icon-class="copy_mini" />
              </span>
            </a>
          </div>
        </div>

        <div v-if="!hideAuthor" class="split-line" />
        <!-- 适用于 首页, Fan圈 -->
        <!-- 区分那种卡 -->
        <div v-if="!hideAuthor" class="author">
          <n-link :to=" {name: 'user-id', params: {id: Uid}} " target="_blank">
            <avatar :size="'60px'" :src="avatarImg" class="avatar" />
          </n-link>
          <div class="username">
            {{ card && (card.nickname || card.author || '') }}
          </div>
          <!-- 关注按钮 -->
          <!-- <div class="follow">
            <svg-icon
              icon-class="add"
            />
          </div>-->
        </div>
      </div>
      <!-- 文章卡片内容 -->
    </div>
    <div style="width: 0;height: 0;" />
  </n-link>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'
import { isNDaysAgo } from '@/utils/momentFun'
import { tagColor } from '@/utils/tag'
import { xssFilter } from '@/utils/xss'

export default {
  name: 'ArticleCard',
  components: {
    avatar
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    },
    // 是否为搜索卡
    isSearchCard: {
      type: Boolean,
      default: false
    },
    // 是否为搜索卡
    hideAuthor: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['isMe', 'currentUserInfo', 'isLogined']),
    xssTitle() {
      if (this.card.title) {
        return xssFilter(this.card.title)
      } else return ''
    },
    xssContent() {
      if (this.card.short_content) {
        return xssFilter(this.card.short_content)
      } else return ''
    },
    cover() {
      if (!this.card) return ''
      return this.card.cover ? this.$API.getImg(this.card.cover) : ''
    },
    avatarImg() {
      if (!this.card) return ''
      return this.card.avatar ? this.$API.getImg(this.card.avatar) : ''
    },
    cardEosValue() {
      if (!this.card) return 0
      if (!this.card.eosprice) return 0
      return precision(this.card.eosprice, 'eos')
    },
    tagName() {
      return (
        this.card &&
        this.card.tags &&
        (this.card.tags.length !== 0 ? this.card.tags[0].name : '')
      )
    },
    tagId() {
      return (
        this.card &&
        this.card.tags &&
        (this.card.tags.length !== 0 ? this.card.tags[0].id : 0)
      )
    },
    tagType() {
      return (
        this.card &&
        this.card.tags &&
        (this.card.tags.length !== 0 ? this.card.tags[0].type : '')
      )
    },
    Uid() {
      return this.card && this.card.uid
    },
    dateCard() {
      if (!this.card) return ''
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    likes() {
      if (!this.card || !this.card.likes) return 0
      if (this.card.likes > 9999) { return Math.round(this.card.likes / 10000) + '万' }
      return this.card.likes
    },
    read() {
      if (!this.card || !this.card.read) return 0
      if (this.card.read > 9999) { return Math.round(this.card.read / 10000) + '万' }
      return this.card.read
    }
  },
  methods: {
    ...mapActions('user', ['followOrUnfollowUser']),
    clipboard(article) {
      const { currentUserInfo } = this
      const { protocol, host } = window.location
      // console.debug(this.article);
      const articleUrl = `${protocol}//${host}/p/${this.card.id}`
      const shareLink = this.isLogined
        ? `${articleUrl}/?invite=${currentUserInfo.id}&referral=${currentUserInfo.id}`
        : articleUrl
      return `《${article.title}》by ${article.nickname ||
        article.author ||
        ''} \n${shareLink}\n${this.$t('p.clipboardText1')} \n ${this.$t(
        'p.clipboardText2'
      )}${this.$point.regInvitee}${this.$t('p.clipboardText3')}`
    },
    copyCode(code) {
      console.log(code)
      this.$copyText(code).then(
        () => {
          this.$message.success(this.$t('success.copy'))
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  display: block;
  margin-bottom: 20px;
}
.imgObjectFitCover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.empty {
  flex: 1;
}

.bg {
  width: 100%;
  background: #fff;
  transition: all 0.3s;
  border-radius: @br10;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  &:nth-child(1) {
    margin-top: 0;
  }
  &:hover {
    transform: translate(0, -4px);
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  }
}

.container {
  flex: 1;
  // height: 148px;
  // padding: 0 0 0 20px;
  overflow: hidden;
}
.article {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
  text-decoration: none;

  &-title {
    // height: 56px;
    margin-bottom: 10px;
    overflow: hidden;
    h3 {
      padding: 0;
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 28px;
    }
  }

  &-title {
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      cursor: pointer;
      margin: 0;
      padding: 0;
    }
  }

  .split-line {
    width: 1px;
    height: 60px;
    background: #b2b2b2;
    margin: auto 20px;
  }
}

// 卡片封面
.author {
  overflow: hidden;
  width: 192px;
  flex: 0 0 192px;
  // margin-top: 29px;
  // margin-bottom: auto;
  margin: auto;
  .avatar {
    flex: 0 0 30px;
    margin: auto;
  }
  .username {
    margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    font-size: 16px;
    color: #000000;
    text-align: center;
  }
  .follow {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #542de0;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    position: relative;
    left: 116px;
    bottom: 50px;
    cursor: pointer;
    &:hover {
      background-color: mix(#fff, #542de0, 10%);
    }
  }
}

// 卡牌内容
.content {
  font-size: 20px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 28px;
  margin: 0;
  padding: 0;
  cursor: pointer;
  word-break: break-all;
}

.des {
  display: flex;
  margin: 20px 0 0 0;
  padding: 0;
  .title {
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: @purpleDark;
    line-height: 22px;
  }
  .data {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    margin-right: 8px;
    width: 50px;
  }
  .date {
    text-align: left;
    color: #b2b2b2;
    flex: 0 0 120px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
  }
  .copy {
    font-size: 14px;
    color: #542de0;
    line-height: 22px;
    margin-right: 8px;
  }
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.content-text {
  font-size: 14px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 1.5;
  letter-spacing: 1px;
  overflow: hidden;
  word-break: break-all;
  height: 40px;
  /*!autoprefixer:off*/
  -webkit-box-orient: vertical; // 不怕兼容问题吗????
  /*autoprefixer:on*/
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
}

.lock-img {
  margin: 4px 23px 0 0;
  height: 13px;
}
</style>

<style lang="less">
.search-res em {
  font-weight: bold;
  font-style: normal;
  color: @purpleDark;
}
</style>
