<template>
  <n-link :to="{name: 'p-id', params: {id: card && card.id}}" target="_blank">
    <div class="bg">
      <div class="article">
        <!-- 适用于 首页, 商品页, 标签页 -->
        <!-- 区分那种卡 -->
        <div class="cover">
          <img v-if="cover" :src="cover" alt="cover">
          <img v-else src="@/assets/img/article_bg.svg" alt="cover">
        </div>
        <div class="container">
          <div class="info">
            <!-- 暂时用文章页代替跳转地址 -->
            <n-link
              target="_blank"
              :to=" {name: 'user-id', params: {id: Uid}} "
              class="author"
            >
              <avatar class="avatar" :size="'30px'" :src="avatarImg" />
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
            <h3 v-clampy="2" class="search-res" v-html="xssTitle" />
          </div>
          <div class="des">
            <!-- 文章卡阅读和投资 -->
            <span class="data">
              {{ card && (card.read === 0 ? 0 : card.read) }}
              浏览</span>
            <span class="data">
              {{ card && card.ups || 0 }}
              {{ '投资' }}</span>
            <span class="empty" />
            <!-- 暂时用文章页代替跳转地址 -->
            <n-link
              :to=" {name: 'tag-id', params: {id: tagId}, query: { name: tagName, type: tagType}} "
              target="_blank"
              class="title"
            >
              {{ tagName }}
            </n-link>
            <!-- 暂时用文章页代替跳转地址 end -->
          </div>
        </div>
      </div>
      <div v-if="isSearchCad" class="content-text search-res" v-html="xssContent" />
    </div>
    <div style="width: 0;height: 0;" />
  </n-link>
</template>

<script>

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
    isSearchCad: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    xssTitle() {
      return xssFilter(this.card.title)
    },
    xssContent() {
      return xssFilter(this.card.short_content)
    },
    cover() {
      // console.log(this.card)
      if (!this.card) return ''
      return this.card.cover ? this.$backendAPI.getAvatarImage(this.card.cover) : ''
    },
    avatarImg() {
      if (!this.card) return ''
      return this.card.avatar ? this.$backendAPI.getAvatarImage(this.card.avatar) : ''
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
      return this.card && this.card.tags && (this.card.tags.length !== 0 ? this.card.tags[0].id : '')
    },
    tagType() {
      return this.card && this.card.tags && (this.card.tags.length !== 0 ? this.card.tags[0].type : '')
    },
    Uid() {
      return this.card && this.card.uid
    },
    dateCard() {
      if (!this.card) return ''
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  }
}
</script>

<style lang="less" scoped>
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
  border-radius: 10px;
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
  padding: 20px;
  overflow: hidden;
  margin-top: 14px;
  text-decoration: none;

  &:nth-child(1) {
    margin-top: 20px;
  }
  &-title {
    height: 56px;
    margin: 20px 0;
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

  img {
    .imgObjectFitCover();
    transition: all 0.3s;
    &:hover {
      transform: scale(1.02);
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
    color: #1C9CFE;
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
  padding: 0 20px 20px;
  font-size:16px;
  font-weight:400;
  color: #333;
  line-height: 1.5;
  letter-spacing: 1px;
  overflow: hidden;
  word-break: break-all;
}

</style>

<style>
.search-res em {
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  color: #1C9CFE;
}
</style>
