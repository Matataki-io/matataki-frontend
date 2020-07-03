<template>
  <div class="card">
    <n-link
      :to="{ name: 'p-id', params: {id: card && card.id} }"
      target="_blank"
      class="card-link"
    >
      <div class="article">
        <div class="container">
          <div class="article-title">
            <n-link
              class="title search-res"
              :to="{ name: 'p-id', params: {id: card && card.id} }"
              target="_blank"
              v-html="xssTitle"
            />
          </div>
          <div
            class="content-text search-res"
            v-html="xssContent"
          />
          <div class="des">
            <div
              v-if="card && card.status === 1"
              class="off-shelves"
            >
              {{ $t('articleCard.deleted') }}
            </div>
            <!-- 文章发布时间 -->
            <div class="date">
              {{ dateCard }}
            </div>
            <div class="empty" />
            <div class="fl ac">
              <!-- 付费文章 -->
              <span class="lock-text">{{ lock }}</span>
              <!-- 阅读量 -->
              <span class="data">
                <i class="el-icon-view" />
                {{ read }}
              </span>
              <!-- 点赞量 -->
              <span class="data like">
                <svg-icon icon-class="like" />
                {{ likes }}
              </span>
              <!-- 复制分享链接 -->
              <a href="javascript:;" class="copy-tag">
                <span
                  class="copy"
                  @click="copyCode(clipboard(card))"
                >
                  <svg-icon icon-class="copy_mini" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <template v-if="!hideAuthor">
          <div class="split-line" />
          <!-- 适用于 首页, Fan圈 -->
          <!-- 区分那种卡 -->
          <div class="author">
            <n-link
              :to="{ name: 'user-id', params: {id: card && card.uid} }"
              target="_blank"
            >
              <c-user-popover :user-id="Number(card.uid)">
                <c-avatar
                  :src="avatarImg" 
                  class="avatar"
                />
              </c-user-popover>
            </n-link>
            <n-link
              :to="{ name: 'user-id', params: {id: card && card.uid} }"
              target="_blank"
              class="username"
            >
              {{ card && (card.nickname || card.author || '') }}
            </n-link>
            <!-- 关注按钮 -->
            <!-- <div class="follow">
              <svg-icon
                icon-class="add"
              />
            </div>-->
          </div>
        </template>
      </div>
    </n-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { precision } from '@/utils/precisionConversion'
import { isNDaysAgo, isThisYear } from '@/utils/momentFun'
import { filterOutHtmlTags } from '@/utils/xss'

export default {
  name: 'ArticleCard',
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
  data() {
    return {
      chosenHtml: '<span class="article-chosen">精选</span> '
    }
  },
  computed: {
    ...mapGetters(['isMe', 'currentUserInfo', 'isLogined']),
    xssTitle() {
      if (this.card.title) {
        const chosenHtml = this.card.is_recommend ? this.chosenHtml : ''
        return chosenHtml + filterOutHtmlTags(this.card.title, {
          em: []
        })
      } else return ''
    },
    xssContent() {
      if (this.card.short_content) {
        return filterOutHtmlTags(this.card.short_content, {
          em: []
        })
      } else return ''
    },
    // cover() {
    //   if (!this.card) return ''
    //   return this.card.cover ? this.$ossProcess(this.card.cover) : ''
    // },
    avatarImg() {
      if (!this.card) return ''
      return this.card.avatar ? this.$ossProcess(this.card.avatar, { h: 90 }) : ''
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
      const time = this.moment(this.card.create_time)
      if (!isThisYear(time)) {
        // return time.format('YYYY MMMDo HH:mm')
        return time.format('lll')
      }
      return isNDaysAgo(2, time) ? time.format('YYYY-MM-DD HH:mm') : time.fromNow()
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
    },
    lock() {
      if (this.card.is_ownpost && (this.card.pay_symbol || this.card.token_symbol)) return '我创建的'

      if (this.card.pay_symbol) {
        if (this.card.pay_unlock) return '已付费'
        return `需付费 ${precision(this.card.pay_price, 'CNY', this.card.pay_decimals)} ${this.card.pay_symbol}`
      } else if (this.card.token_symbol) {
        if (this.card.token_unlock) return '已解锁'
        return `需持有 ${precision(this.card.token_amount, 'CNY', this.card.token_decimals)} ${this.card.token_symbol}`
      } else {
        return ''
      }
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
        ''} \n${shareLink}\n${this.$t('p.clipboardText1')} \n`
    },
    copyCode(code) {
      console.log(code)
      this.$copyText(code).then(
        () => {
          this.$message({
            showClose: true,
            message: this.$t('success.copy'),
            type: 'success'
          })
        },
        () => {
          this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  display: block;
  width: 100%;
  background: #fff;
  transition: all 0.3s;
  border-radius: @br10;
  margin: 20px 0;
  box-sizing: border-box;
  // box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  // &:nth-child(1) {
  //   margin-top: 0;
  // }
  &:hover {
    transform: translate(0, -4px);
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  }
  .card-link {
    display: block;
  }
}
.imgObjectFitCover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.empty {
  flex: 1;
}

.article-title {
  margin-bottom: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  .title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    line-height: 28px;
    max-height: 56px;
    overflow: hidden;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: pre-wrap;
    word-break: break-word;

    flex: 1;
  }
}

.container {
  flex: 1;
  // height: 148px;
  // padding: 0 0 0 20px;
  overflow: hidden;
}
.article {
  padding: 20px;
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
    .off-shelves {
      color: #b2b2b2;
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
  overflow: hidden;
  text-align: center;
  .avatar {
    width: 60px;
    height: 60px;
    flex: 0 0 60px;
    margin: auto;
  }
  .username {
    display: inline-block;
    width: 100%;
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
  flex-wrap: wrap;
  .off-shelves {
    background: #b3b3b3;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    flex: 0 0 120px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin-right: 10px;
  }
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
    margin-right: 20px;
  }
  .date {
    text-align: left;
    color: #b2b2b2;
    flex: 0 0 150px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    display: flex;
    align-items: center;
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
  line-height: 20px;
  letter-spacing: 1px;
  overflow: hidden;
  word-break: break-all;
  max-height: 40px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
}
.lock-img-container {
  display: flex;
  align-items: center;
}
.lock-img {
  margin: 0 10px 0 0;
  height: 16px;
}
.lock-text {
  font-size:14px;
  font-weight:400;
  color: #F7B500;
  line-height:20px;
  margin: 0 18px 0 0;
}

// 小于600
@media screen and (max-width: 600px) {
  .split-line,
  .copy-tag,
  .author {
    display: none;
  }

  .card {
      margin: 10px 0;
      padding: 20px;
      border-radius: 8px;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  .article {
    padding: 0;
  }

  .article-title .title {
    font-size: 16px;
    line-height: 20px;
    max-height: 40px;
  }

  .content-text {
    font-size: 13px;
    line-height: 18px;
    max-height: 36px;
  }
  .des {
    margin: 10px 0 0 0;
    .data {
      &.like {
        margin-right: 0;
      }
    }
    .date {
      font-size: 12px;
    }
  }
}
@media screen and (max-width: 540px) {
  .lock-img {
    height: 14px;
  }
  .article-title {
    .title {
      font-size: 14px;
    }
  }

  .content-text,
  .lock-text,
  .des .data,
  .des .data.like {
    font-size: 12px;
  }
}
</style>

<style lang="less">
.search-res {
  .article-chosen {
    background: #F7B500;
    font-size: 12px;
    font-weight: 500;
    color: white;
    line-height: 23px;
    height: 22px;
    border-radius: 4px;
    padding: 0px 5px;
    display: inline-block;
    vertical-align: text-bottom;
  }
  em {
    font-weight: bold;
    font-style: normal;
    color: @purpleDark;
  }
}

@media screen and (max-width: 600px) {
  .search-res {
    .article-chosen {
      line-height: 18px;
      height: 17px;
    }
  }
}
</style>
