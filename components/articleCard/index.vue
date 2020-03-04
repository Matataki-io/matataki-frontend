<template>
  <div :class="cardType" class="article">
    <!-- 适用于 首页, 商品页, 标签页 -->
    <!-- 区分那种卡 -->
    <n-link :to="{name: 'p-id', params: {id: card && card.id}}" target="_blank">
      <div class="cover">
        <el-image v-if="cover" :src="cover" class="img-lazy" alt="cover" lazy />
        <img v-else src="@/assets/img/article_bg.svg" alt="cover">
      </div>
      <div class="article-title">
        <h3 v-clampy="2" v-html="cardTitle" />
      </div>
      <!-- 只有文章卡才会有内容 -->
      <p v-if="cardType === 'article-card'" v-clampy="3" class="content">
        {{ card && (card.short_content || '') }}
      </p>
      <div class="des">
        <!-- 暂时用文章页代替跳转地址 -->
        <n-link
          :to=" {name: 'tag-id', params: {id: tagId}, query: { name: tagName, type: tagType}} "
          target="_blank"
          class="title"
        >
          {{ tagName }}
        </n-link>
        <!-- 暂时用文章页代替跳转地址 end -->

        <span class="empty" />
        <!-- 文章卡阅读和投资 -->
        <template v-if="typeIndex === 0">
          <span class="data">
            {{ card && (card.read === 0 ? 0 : card.read) }}
            {{ $t('articleCard.read') }}</span>
          <!-- <span class="data">
            {{ card && (card.ups === 0 ? 0 : card.ups) }}
            {{ $t('articleCard.investment') }}</span> -->
          <span class="data">
            {{ card.likes }}
            {{ $t('p.like')}}</span>
        </template>
        <!-- 商品卡销量和金额 -->
        <template v-else>
          <span class="data">
            {{ card && (card.sale === 0 ? 0 : card.sale) }}
            {{ $t('articleCard.sale') }}
          </span>
          <span class="data money">
            {{ cardEosValue }}
            {{ $t('articleCard.saleUnit') }}
          </span>
        </template>
      </div>
      <div class="line" />
      <div class="info">
        <!-- 暂时用文章页代替跳转地址 -->
        <n-link
          :to=" {name: 'user-id', params: {id: uid}} "
          target="_blank"
          class="author"
        >
          <avatar :size="'28px'" :src="avatarImg" class="avatar" />
          <span class="username">
            {{ card && (card.nickname || card.author || '') }}
          </span>
        </n-link>
        <!-- 暂时用文章页代替跳转地址 end -->
        <div class="date">
          {{ dateCard }}
        </div>
      </div>
    </n-link>
    <div style="width: 0;height: 0;" />
  </div>
</template>

<script>
import moment from 'moment'
import { isNDaysAgo } from '@/utils/momentFun'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'
import { tagColor } from '@/utils/tag'
import { xssFilter } from '@/utils/xss'

export default {
  name: 'ArticleCard',
  components: {
    avatar
  },
  props: {
    typeIndex: {
      type: Number,
      default: 0
    },
    cardType: {
      // 区分卡类型
      // 1. recommend-card 推荐
      // 2. article-card 文章
      // 3. commodity-card 商品
      type: String,
      required: true
    },
    card: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    cover() {
      // console.log(this.card)
      if (!this.card) return ''
      return this.card.cover ? this.$ossProcess(this.card.cover) : ''
    },
    avatarImg() {
      if (!this.card) return ''
      return this.card.avatar ? this.$ossProcess(this.card.avatar) : ''
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
    uid() {
      return this.card && this.card.uid
    },
    dateCard() {
      if (!this.card) return ''
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    cardTitle() {
      return xssFilter(this.card && this.card.title)
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>

<style lang="less">
.article-title h3 em {
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  color: @purpleDark;
}

.recommend-card .cover {
  img {
    transition: all 0.3s;
    &:hover {
      transform: scale(1.04);
    }
  }
}
.article-card .cover,
.commodity-card .cover {
  img {
    transition: all 0.3s;
    &:hover {
      transform: scale(1.02);
    }
  }
}
</style>
