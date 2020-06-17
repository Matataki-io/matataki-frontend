<template>
  <n-link
    :to="{name: 'p-id', params: {id: card && card.id}}"
    class="card"
    target="_blank"
  >
    <div class="bg">
      <div class="article">
        <!-- 适用于 首页, 商品页, 标签页 -->
        <!-- 区分那种卡 -->
        <div class="cover">
          <el-image
            v-if="cover"
            :src="cover"
            class="img-lazy"
            lazy
            alt="cover"
          />
          <img
            v-else
            src="@/assets/img/article_bg.svg"
            alt="cover"
          >
          <div
            v-if="card && card.status === 1"
            class="overlay"
          >
            <div class="circle">
              {{ $t('articleCard.deleted') }}
            </div>
          </div>
        </div>
        <div class="container">
          <div class="info">
            <!-- 暂时用文章页代替跳转地址 -->
            <n-link
              :to=" {name: 'user-id', params: {id: Uid}} "
              target="_blank"
              class="author"
            >
              <avatar
                :size="'30px'"
                :src="avatarImg"
                class="avatar"
              />
              <span class="username">
                {{ card && (card.nickname || card.author || '') }}
              </span>
            </n-link>
            <!-- 暂时用文章页代替跳转地址 end -->
            <div class="date">
              {{ dateCard }}
            </div>
          </div>
          <div class="article-title">
            <h3
              class="search-res"
              v-html="xssTitle"
            />
          </div>
          <div class="des">
            <!-- 文章卡阅读和投资 -->
            <span class="data">
              {{ card && (card.read === 0 ? 0 : card.read) }}
              {{ $t('articleCard.read') }}
            </span>
            <span class="data">
              {{ card.likes }}
              {{ $t('p.like') }}
            </span>
            <!-- <span class="data">
              {{ card && card.ups || 0 }}
              投资</span> -->
            <img
              v-if="card.require_holdtokens || card.require_buy"
              class="lock-img"
              src="@/assets/img/lock.png"
              alt="lock"
            >

            <span class="empty" />
            <!-- 暂时用文章页代替跳转地址 -->
            <n-link
              :to=" {name: 'tags-id', params: {id: tagId}, query: { name: tagName, type: tagType}} "
              target="_blank"
              class="title"
            >
              {{ tagName }}
            </n-link>
            <!-- 暂时用文章页代替跳转地址 end -->
          </div>
        </div>
      </div>
      <!-- 文章卡片内容 -->
      <div
        v-if="isSearchCard"
        v-clampy="4"
        class="content-text search-res"
        v-html="xssContent"
      />
    </div>
    <div style="width: 0;height: 0;" />
  </n-link>
</template>

<script>

import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'
import { isNDaysAgo } from '@/utils/momentFun'
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
    }
  },
  computed: {
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
      // console.log(this.card)
      if (!this.card) return ''
      return this.card.cover ? this.$ossProcess(this.card.cover, { h: 200 }) : ''
    },
    avatarImg() {
      if (!this.card) return ''
      return this.card.avatar ? this.$ossProcess(this.card.avatar, { h: 60 }) : ''
    },
    cardEosValue() {
      if (!this.card) return 0
      if (!this.card.eosprice) return 0
      return precision(this.card.eosprice, 'eos')
    },
    tagName() {
      return this.card && this.card.tags && (this.card.tags.length !== 0 ? this.card.tags[0].name : '')
    },
    tagId() {
      return this.card && this.card.tags && (this.card.tags.length !== 0 ? this.card.tags[0].id : 0)
    },
    tagType() {
      return this.card && this.card.tags && (this.card.tags.length !== 0 ? this.card.tags[0].type : '')
    },
    Uid() {
      return this.card && this.card.uid
    },
    dateCard() {
      if (!this.card) return ''
      const time = this.moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
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
  height: 148px;
  padding: 0 0 0 20px;
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
    height: 56px;
    margin: 20px 0;
    overflow: hidden;
    h3 {
      padding: 0;
      margin: 0;
      font-size:20px;
      font-weight:500;
      color:rgba(0,0,0,1);
      line-height:28px;
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

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

// 卡片封面
.cover {
  cursor: pointer;
  overflow: hidden;
  width: 296px;
  flex: 0 0 296px;
  height: 148px;
  background: rgba(0,0,0,0.05);
  border-radius: @borderRadius6;
  transform: rotate(0deg);

  .img-lazy {
    .imgObjectFitCover();
    transition: all 0.3s;
    &:hover {
      transform: scale(1.02);
    }
  }

  .overlay {
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    color: white;
    font-size: 16px;
    text-align: center;
    vertical-align: middle;
    line-height: 100px;
    top: 0;
    bottom: 0;

    .circle {
      background: rgba(0, 0, 0, 0.5);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
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
  margin: 0;
  padding: 0;
  .title {
    cursor: pointer;
    font-size:16px;
    font-weight:500;
    color: @purpleDark;
    line-height:22px;
  }
  .data {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
    margin-right: 8px;
  }
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  .date {
    text-align: right;
    color: #b2b2b2;
    flex: 0 0 120px;
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}
.author {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .avatar {
    flex: 0 0 30px;
  }
  .username {
    margin-left: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    font-size: 18px;
    color: #000000;
  }
}

.content-text {
  margin-top: 20px;
  font-size:16px;
  font-weight:400;
  color: #333;
  line-height: 1.5;
  letter-spacing: 1px;
  overflow: hidden;
  word-break: break-all;
}

.lock-img {
  width: 18px;
  margin-left: 4px;
}

</style>

<style lang="less">
.search-res em {
  font-weight: bold;
  font-style: normal;
  color: @purpleDark;
}
</style>
