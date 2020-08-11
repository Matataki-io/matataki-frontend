<template>
  <div class="main">
    <bannerFan />
    <div v-if="havePermission">
      <div class="container">
        <!-- 文章封面 -->
        <div v-if="cover" class="TitleImage">
          <img :src="cover" alt="cover">
        </div>
        <article class="Post-Header">
          <header>
            <img v-if="isRecommend" src="@/assets/img/matatakiselected@2x.png" class="matataki-selected">
            <!-- 标题 -->
            <h1 class="Post-Title">
              {{ article.title }}
            </h1>
            <el-alert
              v-if="isDeleted"
              title="这篇文章已隐藏"
              type="info"
              description="加密文章只有你本人可见，普通文章仅作者和知晓文章IPFS哈希的人可见"
              show-icon
            />
            <div class="fl ac jsb article-header">
              <!-- 文章信息 头像 昵称 时间 阅读量 关注 -->
              <UserInfoHeader
                class="article-author"
                :article="article"
                :article-ipfs-array="articleIpfsArray"
                :is-hide="isHideIpfsHash"
              />
              <el-dropdown
                v-if="isMe(article.uid) && !isDeleted"
                trigger="click"
                @command="handleMoreAction"
              >
                <div class="more-setting">
                  <svg-icon
                    class="more-icon-setting"
                    icon-class="setting"
                  />
                  <span class="more-text-setting">{{ $t('setting') }}</span>
                </div>
                <el-dropdown-menu
                  slot="dropdown"
                  class="user-dorpdown"
                >
                  <el-dropdown-item command="edit">
                    {{ $t('edit') }}
                  </el-dropdown-item>
                  <el-dropdown-item command="transfer">
                    {{ $t('transfer') }}
                  </el-dropdown-item>
                  <el-dropdown-item command="del">
                    {{ $t('delete') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </header>
          <fontSize v-model="fontSizeVal" />
          <!-- 文章内容 -->
          <no-ssr>
            <mavon-editor v-show="false" style="display: none;" />
          </no-ssr>
          <!-- v-highlight -->
          <div
            v-viewer="viewerOptions"
            class="markdown-body article-content"
            :class="fontSizeComputed"
            v-html="compiledMarkdown"
          />
          <!-- 文章页脚 声明 是否原创 -->

          <div
            v-if="!hasPaied && !isProduct && (isTokenArticle || isPriceArticle)"
            class="lock-line"
          >
            <el-divider>
              <span class="lock-text">{{ $t('p.fulfillTheConditions') }}</span>
            </el-divider>
            <svg-icon
              class="icon-arrow"
              icon-class="arrow_down"
            />
            <div class="lock-line-full" />
          </div>
          <ArticleFooter
            v-else
            :article="article"
            style="margin-top: 20px;"
          />
        </article>

        <!-- 解锁按钮 -->
        <div
          v-if="(isTokenArticle || isPriceArticle) && !isProduct"
          v-loading="lockLoading"
          class="lock"
        >
          <div class="lock-left">
            <img
              v-if="!hasPaied"
              class="lock-img"
              src="@/assets/img/lock.png"
              alt="lock"
            >
            <img
              v-else
              class="lock-img"
              src="@/assets/img/unlock.png"
              alt="lock"
            >
          </div>
          <div class="lock-info">
            <h3 class="lock-info-title">
              {{ !hasPaied ? unlockText + $t('paidRead.article') : $t('paidRead.already') + unlockText + $t('paidRead.article') }}
            </h3>
            <h5 class="lock-info-subtitle">
              {{ !hasPaied ? $t('paidRead.needToReach') : $t('paidRead.hasBeenReached') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('paidRead.meetAllConditions') "
                placement="top-start"
              >
                <svg-icon
                  icon-class="anser"
                  class="prompt-svg"
                />
              </el-tooltip>
            </h5>
            <p
              v-if="!isMe(article.uid)"
              class="lock-info-des"
            >
              <ul>
                <li
                  v-if="isPriceArticle"
                  class="fl"
                >
                  <div class="fl price">
                    {{ $t('paidRead.pay') }}
                    <span class="amount">{{ getArticlePrice }}</span>
                    <template v-if="getPayToken.token_id !== 0">
                      <router-link
                        :to="{name: 'token-id', params:{ id:getPayToken.token_id }}"
                        target="_blank"
                        class="fl"
                      >
                        <avatar
                          :size="'16px'"
                          :src="$API.getImg(getPayToken.logo)"
                          class="avatar-token"
                        />
                        {{ getPayToken.symbol }} <template v-if="getPayToken.name">（{{ getPayToken.name }}）</template>
                      </router-link>
                    </template>
                    <template v-else>
                      <svg-icon
                        icon-class="currency"
                        class="avatar-cny"
                      />
                      {{ getPayToken.symbol }}
                    </template>
                  </div>
                  <span>
                    已持有：{{ payTokenBalance }} {{ getPayToken.symbol }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('paidRead.purchaseHistory')"
                      placement="left"
                    >
                      <svg-icon icon-class="anser" />
                    </el-tooltip>
                  </span>
                </li>
                <li
                  v-if="isTokenArticle"
                  class="fl"
                >
                  <div class="fl price">
                    {{ $t('paidRead.hold') }}
                    <span class="amount">{{ needTokenAmount }}</span>
                    <router-link
                      :to="{name: 'token-id', params:{ id:needTokenId }}"
                      target="_blank"
                      class="fl"
                    >
                      <avatar
                        :size="'16px'"
                        :src="needTokenLogo"
                        class="avatar-token"
                      />
                      {{ needTokenSymbol }}（{{ needTokenName }}）
                    </router-link>
                  </div>
                  <!-- 不显示 - 号 -->
                  <span> {{ !tokenHasPaied ? $t('paidRead.stillNeedToHold') : $t('paidRead.alreadyHeld') }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }} {{ needTokenSymbol }} 
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="只要满足持币条件随时可以查看全文"
                      placement="left"
                    >
                      <svg-icon icon-class="anser" />
                    </el-tooltip>
                  </span>
                </li>
              </ul>
            </p>
            <p
              v-else
              class="lock-info-des"
            >
              {{ $t('paidRead.myArticles') }}
            </p>
            <div
              v-if="!hasPaied"
              class="lock-bottom"
            >
              <div class="btn-ccc">
                <!-- <span class="lock-bottom-total">{{ $t('paidRead.totalAbout') + totalCny }}CNY</span> -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('paidRead.tounlockThisArticle')"
                  placement="top-end"
                >
                  <el-button
                    type="primary"
                    size="small"
                    @click="wxpayArticle"
                  >
                    {{ unlockTextFull }}
                    <!-- {{ $t('paidRead.oneKey') + unlockText }}全文 -->
                  </el-button>
                </el-tooltip>
              </div>
              <!-- <NoticeCreator
                v-if="!readTokenExs"
                :tokenId="form.outputToken.id"
                :postId="article.id"
              /> -->
            </div>
          </div>
        </div>

        <!-- 编辑全文 -->
        <becomeAnArticleEditor
          :article="article"
          :has-paied="editHasPaied"
          :token-has-paied="editTokenHasPaied"
          :difference-token="editDifferenceToken"
          :form="editForm"
          :input-amount-error="getEditInputAmountError"
          :lock-loading="lockLoading"
          :is-toll-read="isTokenArticle || isPriceArticle"
          :has-paied-read="hasPaied || !(isTokenArticle || isPriceArticle)"
          @createOrder="createEditOrder"
        />
      </div>
      <AssosiateWith 
        v-if="article.assosiate_with"
        :article="article"
      />
      <!-- 赞赏 -->
      <RewardFooter :user-data="{ id: article.uid }" @success="getRewardCount" />

      <!-- tag 标签 -->
      <div
        v-if="tags.length !== 0"
        class="p-w tag-list"
      >
        <router-link
          v-for="(item, index) in tags"
          :key="index"
          :to=" {name: 'tags-id', params: {id: item.id}, query: {name: item.name,}}"
          class="tag-card"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- sidebar -->
      <sidebar
        :bookmarked="isBookmarked ? 1 : 0"
        :is-liked="Number(ssToken.is_liked)"
        :likes="article.likes"
        :dislikes="article.dislikes"
        @like="likeEvent"
        @bookmarked="toggleBookmark"
        @share="share"
      />

      <!-- 内容居中 -->
      <div class="p-w">
        <!-- 评论内容 -->
        <commentInput v-if="!isProduct" :article="article" @success="getCommentCount" />

        <div class="comment-reward">
          <span class="comment-reward-title" :class="commentRewardTab === 0 && 'active'" @click="commentRewardTab = 0">评论<span>{{ commentCount }}</span></span>
          <span class="comment-reward-title" :class="commentRewardTab === 1 && 'active'" @click="commentRewardTab = 1">打赏<span>{{ rewardCount }}</span></span>
        </div>
        <!-- 这里的 success 通过 孙组件一层层上传发过来的事件 -->
        <CommentList
          v-if="commentRewardTab === 0"
          :sign-id="article.id"
          :type="article.channel_id"
          :comment-anchor="commentAnchor"
          @success="getCommentCount"
        />
        <commentReward v-if="commentRewardTab === 1" />
      </div>

      <InvestModal
        v-model="investModalShow"
        :article="{
          ...article,
          title: $t('p.investArticle')
        }"
        @investDone="payDone"
      />
      <!-- 分享dialog -->
      <ShareModal
        v-model="shareModalShow"
        :article="{
          ...article,
          content: compiledMarkdown,
          avatar
        }"
      />
      <!-- 购买 -->
      <PurchaseModal
        v-model="purchaseModalShow"
        :article="{
          ...article,
          cover
        }"
        @purchaseDone="payDone"
      />
      <!-- 文章转让 -->
      <article-transfer
        v-model="transferModal"
        :article-id="Number(article.id)"
        from="article"
      />

      <OrderModal
        v-model="showOrderModal"
        :form="{...form, type: 'buy_token_output', limitValue}"
        :trade-no="tradeNo"
      />
      <ExsModal
        v-model="showExs"
        :article="article"
        :token="copyForm.outputToken"
        :amount="copyForm.output"
        :need-price="copyForm.needPrice"
        :need-token="copyForm.needToken"
      />
    </div>
    <div v-else class="container deleted">
      <div>
        <img src="@/assets/img/deleted.png" alt="deleted">
      </div>
      <div class="message">
        <span>{{ $t('p.deleted') }}</span>
      </div>
      <div class="ipfs-hash">
        <!-- article history start here -->
        <ArticleHistory :article-ipfs-array="articleIpfsArray" />
      </div>
    </div>
  </div>
</template>

<script>
// import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'
import { xssFilter, xssImageProcess, filterOutHtmlTags, processLink } from '@/utils/xss'
import UserInfoHeader from '@/components/article/UserInfoHeader'
import ArticleFooter from '@/components/article/ArticleFooter'
// import articleIpfs from '@/components/article/article_ipfs'
import InvestModal from '@/components/modal/Invest'
import PurchaseModal from '@/components/modal/Purchase'
import ShareModal from '@/components/modal/Share'
import articleTransfer from '@/components/articleTransfer'
// import FeedbackModal from '@/components/article/Feedback'
import commentInput from '@/components/article_comment'
import CommentList from '@/components/comment/List'
import { ipfsData, wxShare } from '@/api/async_data_api.js'
import { extractChar } from '@/utils/reg'
import { precision } from '@/utils/precisionConversion'
import OrderModal from '@/components/article/ArticleOrderModal'
import { CNY } from '@/components/exchange/consts.js'
import utils from '@/utils/utils'
import avatar from '@/components/avatar/index.vue'
import becomeAnArticleEditor from '@/components/become_an_article_editor/index.vue'
import ArticleHistory from '@/common/components/ipfs_all/history.vue'

import lockSvg from '@/assets/img/lock.svg'
import unlockSvg from '@/assets/img/unlock.svg'

import sidebar from '@/components/p_page/sidebar'
import AssosiateWith from '@/components/article/AssosiateWith.vue'
import RewardFooter from '@/components/article/RewardFooter'
import fontSize from '@/components/p_page/font_size'
import commentReward from '@/components/p_page/reward'
import ExsModal from '@/components/ExsModal'

import { getCookie } from '@/utils/cookie'
import store from '@/utils/store.js'
import bannerFan from '@/components/p_page/banner_fan'

const markdownIt = require('markdown-it')({
  html: true,
  breaks: true
})
const mkItFootnote = require('markdown-it-footnote')
const mkItKatex = require('markdown-it-katex')
markdownIt.use(mkItKatex)
markdownIt.use(mkItFootnote)

export default {
  components: {
    CommentList,
    InvestModal,
    ShareModal,
    PurchaseModal,
    UserInfoHeader,
    ArticleFooter,
    ArticleHistory,
    // articleIpfs,
    articleTransfer,
    // FeedbackModal,
    AssosiateWith,
    commentInput,
    OrderModal,
    becomeAnArticleEditor,
    avatar,
    sidebar,
    RewardFooter,
    fontSize,
    commentReward,
    ExsModal,
    bannerFan,
  },
  data() {
    return {
      avatar: null,
      investModalShow: false,
      shareModalShow: false,
      transferModal: false,
      purchaseModalShow: false,
      oldOffSetTop: 0,
      isSupport: false, // 是否赞赏, 重新通过token请求文章数据
      timer: null,
      timeCount: 0,
      ssToken: {
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      },
      article: Object.create(null),
      post: Object.create(null),
      postsIdReadnewStatus: false, // 新文章阅读是否上报
      isReading: false, // read接口是否请求完毕
      comment: '', //评论内容
      currentProfile: Object.create(null),
      differenceToken: '0',
      editDifferenceToken: '0',
      showLock: false,
      showOrderModal: false,
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      editForm: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      getInputAmountError: '',
      getEditInputAmountError: '',
      payBtnDisabled: true,
      pull: {
        params: {
          pagesize: 20
        },
        reload: 0,
        apiUrl: 'postsReferences',
        list: [] // 因为写的时候用的其他变量, 故而这里没有使用list存放数据
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      beingPull: {
        params: {
          pagesize: 20
        },
        reload: 0,
        apiUrl: 'postsPosts',
        list: [] // 因为写的时候用的其他变量, 故而这里没有使用list存放数据
      },
      beingCurrentPage: Number(this.$route.query.page) || 1,
      beingLoading: false, // 加载数据
      beingTotal: 0,
      relatedLoadingBtn: false, // 关联btn
      tradeNo: '',
      isBookmarked: false,
      tokenHasPaied: false,
      priceHasPaied: false,
      editTokenHasPaied: false,
      editPriceHasPaied: false,
      hasPaied: true,
      editHasPaied: true,
      lockLoading: true,
      articleIpfsArray: [], // ipfs hash
      resizeEvent: null,
      tags: [], // 文章标签
      commentAnchor: Number(this.$route.query.comment) || 0, //评论锚点
      fontSizeVal: 1,
      commentRewardTab: 0, // 评论赞赏切换
      commentCount: 0, // 评论次数
      rewardCount: 0, // 赞赏次数
      viewerOptions: { filter: (image) => image.dataset.noenlarge !== '1' },
      showExs: false,
      copyForm: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {},
        needPrice: false,
        needToken: false
      },
      readTokenExs: true,
      editTokenExs: true,
      payTokenBalance: 0
    }
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.short_content },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: this.article.title },
        { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: this.article.short_content },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `${process.env.VUE_APP_PC_URL}/p/${this.article.id}` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.article.cover) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI' },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: this.article.title },
        { hid: 'article:published_time', name: 'article:published_time', property: 'article:published_time', content: this.articleTimeISO },
        { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', name: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_PC_URL}/p/${this.article.id}` },
        { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.$API.getImg(this.article.cover) },
        { hid: 'og:description', name: 'description', property: 'og:description', content: this.article.short_content }
        /* end */
      ],
      script: [
        {
          // 因为 editor 组件的 cdn 加入比较晚, 导致下方的数学公式加载不出来 手动引入 cdn
          src: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.js'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe', 'currentUserInfo']),
    articleTimeISO() {
      const { create_time: createTime } = this.article
      const time = this.moment(createTime)
      return this.moment(time).toISOString()
    },
    articleCreateTimeComputed() {
      const { create_time: createTime } = this.article
      const time = this.moment(createTime)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    isRecommend() {
      return Boolean(this.article.is_recommend)
    },
    compiledMarkdown() {
      // 前提: 都在自己的平台下
      // 因为之前批量替换了getImg接口,导致上传图片在允许webp的平台会产生一个webp格式的链接, 所以这里过优化一下(比如chrome上传会带webp,safari就不会带webp)
      // 如果已经上传过webp 在允许webp返回webp 如果不允许则修改格式为png (上传接口取消webp格式上传 因为在ipfs模版页面会出问题)
      // 如果上传的是默认的图片, 在允许webp返回webp 如果不允许则返回默认的格式
      try {
        if (process.browser) {
          const markdownItEditor = this.$mavonEditor.markdownIt
          const { content } = this.post

          let md = markdownItEditor.render(content)

          return this.$utils.compose(processLink, xssImageProcess, xssFilter)(md)
        } else {
          let md = markdownIt.render(this.post.content)
          return this.$utils.compose(xssImageProcess, xssFilter)(md)
        }
      } catch (e) {
        return this.post.content
      }


    },
    cover() {
      if (this.article.cover) return this.$ossProcess(this.article.cover)
      return null
    },
    havePermission() {
      if (!this.article) return null
      if (this.isDeleted) {
        return this.isMe(this.article.uid)
      }
      return this.article.status === 0 
    },
    isDeleted() {
      if (!this.article) return null
      return this.article.status === 1
    },
    avatarSrc() {
      if (this.currentUserInfo.avatar) return this.$ossProcess(this.currentUserInfo.avatar)
      return ''
    },
    isProduct() {
      return this.article.channel_id === 2
    },
    likedOrDisLiked() {
      return parseInt(this.ssToken.is_liked) !== 0
    },
    getArticlePrice() {
      if (this.isPriceArticle) {
        const ad = this.article.prices[0]
        return this.$utils.fromDecimal(ad.price)
      } else {
        return 0
      }
    },
    payTokenEnough() {
      return this.payTokenBalance >= this.getArticlePrice
    },
    getPayToken() {
      if (this.isPriceArticle) {
        const ad = this.article.prices[0]
        return ad
      } else {
        return {}
      }
    },
    // 是否是付费文章
    isPriceArticle() {
      return (this.article.prices && this.article.prices.length !== 0)
    },
    // 是否是持通证文章
    isTokenArticle() {
      return (this.article.tokens && this.article.tokens.length !== 0)
    },
    // 是否是持通证编辑文章
    isTokenEditArticle() {
      return (this.article.editTokens && this.article.editTokens.length !== 0)
    },
    // 是否是付费编辑文章
    isPriceEditArticle() {
      return (this.article.editPrices && this.article.editPrices.length !== 0)
    },
    unlockText() {
      if (this.isPriceArticle) {
        return this.$t('p.buy')
      }
      return this.$t('p.unlock')
    },
    unlockTextFull() {
      if (this.isPriceArticle) {
        if (this.payTokenEnough) return '一键购买全文'
        else return '余额不足，去购买'
      }
      return '一键解锁全文'
    },
    totalCny() {
      let result = 0
      if (this.isTokenArticle) {
        result += parseFloat(this.form.input || 0)
      }
      return utils.up2points(result + this.getArticlePrice)
    },
    // 需要多少Fan票
    needTokenAmount() {
      if (this.article.tokens.length !== 0) {
        return precision(this.article.tokens[0].amount, 'CNY', this.article.tokens[0].decimals)
      } else return 0
    },
    // Fan票ID
    needTokenId() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].id
      } else return -1
    },
    // 需要多少Fan票代号
    needTokenSymbol() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    },
    // 需要多少Fan票名称
    needTokenName() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].name
      } else return ''
    },
    // 需要多少Fan票LOGO
    needTokenLogo() {
      if (this.article.tokens.length !== 0) {
        return this.$ossProcess(this.article.tokens[0].logo)
      } else return ''
    },
    limitValue() {
      const { input } = this.form
      return (parseFloat(input) / (1 - 0.01)).toFixed(4)
    },
    // 如果是自己文章始终看到hash
    // 如果不是, 只要是付费文章都不能看到无论是否购买
    isHideIpfsHash() {
      if (this.isMe(this.article.uid)) return true
      else {
        if (this.article.require_holdtokens || this.article.require_buy) return false
        return true
      }
    },
    // 动态返回文章字号大小
    // >992 16 18 20 22 24
    // >600 <=992 14 16 18 20 22
    // <- 600 12 14 16 18 20
    // 第二个标准值是css文章的默认字体大小
    fontSizeComputed() {
      try {
        let list = {}
        let clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        if (clientWidth <= 992 && clientWidth > 600) {
          list = {
            0: 'font14',
            1: '',
            2: 'font18',
            3: 'font20',
            4: 'font22',
          }
        } else if (clientWidth <= 600) {
          list = {
            0: 'font12',
            1: '',
            2: 'font16',
            3: 'font18',
            4: 'font20',
          }
        } else {
          list = {
            0: 'font16',
            1: '',
            2: 'font20',
            3: 'font22',
            4: 'font24',
          }
        }
        return list[this.fontSizeVal] || ''
      } catch(e) {
        return ''
      }
    }
  },
  watch: {
    timeCount(v) {
      if (!this.postsIdReadnewStatus && v >= 30) {
        this.postsIdReadnewStatus = true
      }
      if (v >= 150) {
        clearInterval(this.timer)
      }
    },
    compiledMarkdown() {
      this.setAllHideContentStyle()
      this.formatPreview()
    },
    // 保存font size 选择
    fontSizeVal(newVal) {
      store.set('p_font_size', newVal)
    } 
  },

  async asyncData({ $axios, route, req }) {
    // 获取cookie token
    let accessToekn = ''
    // 请检查您是否在服务器端
    if (process.server) {
      const cookie = req && req.headers.cookie ? req.headers.cookie : ''
      const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
      accessToekn = token ? token[0] : ''
    }

    const hashOrId = route.params.id
    // post hash获取; p id 短链接;
    const url = /^[0-9]*$/.test(hashOrId) ? 'p' : 'post'
    const info = await $axios({
      url: `/${url}/${hashOrId}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn }
    })
    let data = {}
    // 判断是否为付费阅读文章
    const isProduct = info.data.channel_id === 2
    if (((info.data.tokens && info.data.tokens.length !== 0) || (info.data.prices && info.data.prices.length > 0)) && !isProduct) {
      data = {
        article: info.data,
        post: {
          content: info.data.short_content
        }
      }
    } else {
      const { hash } = info.data
      // 有hash
      if (hash) {
        const res = await ipfsData($axios, hash)
        if (res.code === 0) {
          // console.log('return', res.data)
          data = {
            article: info.data,
            post: res.data
          }
        } else {
          // 获取失败
          data = {
            article: info.data,
            post: {
              content: info.data.short_content
            }
          }
        }
      } else {
        // 没有hash
        // console.log('not hash')
        data = {
          article: info.data,
          post: {
            content: info.data.short_content
          }
        }
      }
    }

    // wx share 
    let userAgent = req && req.headers['user-agent'].toLowerCase()
    const isWeixin = () => /micromessenger/.test(userAgent)
    // 在微信内才请求分享 避免造成不必要的请求
    if (isWeixin()) {
      console.log('yes', req.headers['user-agent'].toLowerCase())
      
      let defaultLink = ''
      if (process.server) {
        defaultLink = `${process.env.VUE_APP_WX_URL}${route.fullPath}`
      } else if (process.browser) {
        defaultLink = window.location.href
      } else {
        defaultLink = ''
      }

      if (defaultLink) {
        try {
          const res = await wxShare($axios, defaultLink)
          if (res.code === 0) {
            data.wxShareData = res.data
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
    // wx share end

    return data
  },
  created() {
    if (process.browser) {
      this.setWxShare()
    }
  },
  mounted() {
    if (process.browser) {
      // read语法的解锁方法，需要使用onclick触发
      window.unlock = (need, hold) => this.unlock(need, hold)

      this.setAvatar()
      this.addReadAmount()
      this.getCurrentProfile()
      this.getTags()
      this.getArticleIpfs()

      this.setAllHideContentStyle()

      this.$nextTick(() => {
        this.setFontSize()
        this.getCommentRewardCount()

        window.onload = () => {
          this.formatPreview()
        }

      })
    }

  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: { 
    // 增加文章阅读量
    async addReadAmount() { await this.$API.addReadAmount({ articlehash: this.article.hash }).catch(err => console.log('add read amount error', err))},
    // 获取用户在当前文章的属性
    async getCurrentProfile(id) {
      if (!getCookie('ACCESS_TOKEN')) {
        this.lockLoading = false
        this.tokenHasPaied = false
        this.priceHasPaied = false
        this.editTokenHasPaied = false
        this.editPriceHasPaied = false
        this.hasPaied = false
        this.editHasPaied = false
        this.editHasPaied= false
        this.form.outputToken = this.article.tokens && this.article.tokens.length > 0 ? this.article.tokens[0] : {}
        this.editForm.outputToken = this.article.editTokens && this.article.editTokens.length > 0 ? this.article.editTokens[0] : {}
        this.calPayFormParams()
        this.calPayEditFormParams()
        return
      }
      const data = {
        id: id || this.$route.params.id
      }
      this.lockLoading = true
      await this.$API.currentProfile(data).then(async res => {
        this.lockLoading = false
        if (res.code === 0) {
          // console.log('这是currentProfile的数据：', res.data)
          this.currentProfile = res.data
          if(res.data.holdMineTokens && res.data.holdMineTokens.length > 0 && this.article.tokens && this.article.tokens.length > 0)
            this.form.outputToken = res.data.holdMineTokens.filter(list => list.id === this.article.tokens[0].id)[0]
          if(res.data.holdMineTokens && res.data.holdMineTokens.length > 0 && this.article.editTokens && this.article.editTokens.length > 0)
            this.editForm.outputToken = res.data.holdMineTokens.filter(list => list.id === this.article.editTokens[0].id)[0]
          this.differenceTokenFunc()
          this.editDifferenceTokenFunc()
          this.calPayFormParams()
          this.calPayEditFormParams()
          this.getSupportStatus(res.data)
          this.getPayTokenBalance(this.getPayToken.token_id)
          this.isBookmarked = Boolean(res.data.is_bookmarked)
          if (this.form.outputToken) {
            this.readTokenExs = await this.hasExs(this.form.outputToken.id)
          }
          if (this.editForm.outputToken.id) {
            this.editTokenExs = await this.hasExs(this.editForm.outputToken.id)
          } 
        } else if (res.code === 401) {
          console.log(res.message)
        } else {
          console.log(res.message)
        }
      }).catch(err => console.log(err))
    },
    // 差多少token 变为字符界面显示截取 - 号
    differenceTokenFunc() {
      if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0 && this.article.tokens && this.article.tokens.length > 0) {
        const tokenName = this.currentProfile.holdMineTokens.filter(list => list.id === this.article.tokens[0].id)

        // 获取有多少token
        const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
        let needTokenAmount = 0
        // 获取需要多少token
        if (this.article.tokens && this.article.tokens.length !== 0) {
          needTokenAmount = this.article.tokens[0].amount
        }
        // 减之后 换算
        const amountToken = precision(amount - needTokenAmount, 'CNY', tokenName[0].decimals)

        this.differenceToken = amountToken < 0 ? amountToken + '' : '+' + precision(amount, 'CNY', tokenName[0].decimals)
      } else this.differenceToken = '0'
      /* // 是否是需要持通证阅读的文章
      this.isTokenArticle = Boolean(this.currentProfile.holdMineTokens) && this.currentProfile.holdMineTokens.length > 0
      // 是否是需要购买的文章
      this.isPriceArticle = Boolean(this.currentProfile.require_buy) */
      if (this.isMe(this.article.uid)) {
        this.tokenHasPaied = true
        this.priceHasPaied = true
        this.hasPaied = true
        this.getIpfsData()
      } else {
        if (this.isTokenArticle) {
          this.tokenHasPaied = Number(this.differenceToken) > 0
        } else this.tokenHasPaied = true
        if (this.isPriceArticle) {
          this.priceHasPaied = Boolean(this.currentProfile.is_buy)
        } else this.priceHasPaied = true
        if (this.priceHasPaied && this.tokenHasPaied) {
          this.hasPaied = true
          this.getIpfsData()
        } else {
          this.hasPaied = false
        }
      }
    },

    // 编辑文章差多少token
    editDifferenceTokenFunc() {
      if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0 && this.article.editTokens && this.article.editTokens.length > 0) {
        const tokenName = this.currentProfile.holdMineTokens.filter(list => list.id === this.article.editTokens[0].id)

        // 获取有多少token
        const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
        let needTokenAmount = 0
        // 获取需要多少token
        if (this.article.editTokens && this.article.editTokens.length !== 0) {
          needTokenAmount = this.article.editTokens[0].amount
        }
        // 减之后 换算
        const amountToken = precision(amount - needTokenAmount, 'CNY', tokenName[0].decimals)

        this.editDifferenceToken = amountToken < 0 ? amountToken + '' : '+' + precision(amount, 'CNY', tokenName[0].decimals)
      } else this.editDifferenceToken = '0'
      if (this.isMe(this.article.uid)) {
        this.editTokenHasPaied = true
        this.editPriceHasPaied = true
        this.editHasPaied = true
      } else {
        if (this.isTokenEditArticle) {
          this.editTokenHasPaied = Number(this.editDifferenceToken) > 0
        } else this.editTokenHasPaied = true
        if (this.isPriceEditArticle) {
          this.editPriceHasPaied = Boolean(this.currentProfile.is_buy)
        } else this.editPriceHasPaied = true
        if (this.editPriceHasPaied && this.editTokenHasPaied) {
          this.editHasPaied = true
        } else {
          this.editHasPaied = false
        }
      }
    },

    async getIpfsData() {
      const { hash } = this.article
      if (!hash) {
        console.log('not hash')
        return
      } else {
        await this.$API.getIpfsData(hash)
          .then(res => {
            if (res.code === 0) {
            // 在获取ipfs内容后替换title, 因为数据库存储的title有上限
              this.article.title = res.data.title
              this.post.content = res.data.content
            } else {
              this.$message({ showClose: true, message: res.message, type: 'warning'})
            }
          }).catch(err => {
            console.log('err', err)
          })
      }
    },
    async getArticleInfoFunc() {
      await this.$API.getArticleInfo(this.$route.params.id)
        .then(res => {
          if (res.code === 0) this.article = res.data
          else this.$message({ showClose: true, message: res.message, type: 'warning'})
        }).catch(err => {
          console.log('err', err)
        })
    },
    likeEvent(res) {
      if (Number(this.ssToken.is_liked) === 1 || Number(this.ssToken.is_liked) === 2) {
        console.log('已经操作过了')
        return
      }
      if (res === 2) {
        // 点赞
        this.like()
      } else if (res === 1) {
        // 不推荐
        this.dislike()
      } else {
        //
      }
    },
    // 推荐
    like() {
      this.$API.like(this.article.id, {
        time: 0
      }).then(res => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.ssToken.is_liked = 2
          this.ssToken.points = res.data
          // this.feedbackShow = true

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          console.log(res.message)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      })
    },
    // 不推荐
    dislike() {
      this.$API.dislike(this.article.id, {
        time: 0
      }).then(res => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.ssToken.is_liked = 1
          this.ssToken.points = res.data
          // this.feedbackShow = true

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          console.log(res.message)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      })
    },
    async postBackendReading(res) {
      // 阅读接口请求完毕才开始计时
      // 如果推荐/不推荐过 不进行调用
      if (parseInt(res.is_liked) === 1 || parseInt(res.is_liked) === 2) return
      await this.$API.reading(this.article.id)
        .then(res => {
          if (res.code === 0) {
            this.isReading = true
            this.reading()
            // console.log('reading done')
          }
        }).catch(err => {
          console.log('article reading err', err)
        })
    },
    reading() {
      if (this.timer === null && !this.likedOrDisLiked) {
        this.timer = setInterval(() => {
          this.timeCount++
        }, 1000)
      }
    },
    handleMoreAction(command) {
      this[command]()
    },
    del() {
      const delSuccess = () => {
        this.$message({ showClose: true, duration: 2000, message: this.$t('p.deleteArticle') })
        this.$router.push('/article')
      }
      const fail = (err) => {
        this.$message.error(this.$t('p.deleteFail'))
        console.log('error', err)
      }
      const delArticleFunc = async (id) => {
        if (!id) return fail(this.$t('p.noId'))
        try {
          const res = await this.$API.delArticle({ id })
          if (res.code === 0) delSuccess()
          else fail(res.message)
        } catch (error) {
          return fail(error)
        }
      }
      this.$confirm(this.$t('p.ipfsPrompt'), this.$t('promptTitle'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel')
      })
        .then(() => {
          delArticleFunc(this.article.id)
        })
        .catch(() => {})
    },
    transfer() {
      this.transferModal = true
    },
    edit() {
      this.$router.push({
        name: 'publish-type-id',
        params: { type: 'edit', id: this.article.id },
        query: { hash: this.article.hash }
      })
    },
    // 检测能否投资
    detection(buy = false) {
      if (this.isSupport && !buy) {
        this.$message.success(this.$t('p.invested'))
        return false
      }
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      // email github 无法赞赏
      const { idProvider } = this.currentUserInfo
      if (this.$publishMethods.invalidId(idProvider)) {
        this.$message.warning(`${this.$t('p.account', [idProvider])}`)
        return false
      }
      return true
    },
    invest() {
      if (this.detection()) { this.investModalShow = true }
    },
    buy() {
      if (this.detection(true)) this.purchaseModalShow = true
    },
    share() {
      this.shareModalShow = true
    },
    async toggleBookmark() {
      try {
        if (!this.isBookmarked) {
          const res = await this.$API.bookmark(this.article.id)
          if (res.code === 0) {
            this.isBookmarked = true
          }
        } else {
          await this.$API.unbookmark(this.article.id)
          this.isBookmarked = false
        }
      } catch (err) {
        console.error('ToggleBookmark err', err)
        if (err.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      }
    },
    async setAvatar() {
      await this.$API.getUser(this.article.uid).then((res) => {
        if (res.code === 0) {
          this.avatar = res.data.avatar ? this.$ossProcess(res.data.avatar) : ''
        } else this.$message({ showClose: true, message: res.message, type: 'warning'})
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 获取是否赞赏状态
    getSupportStatus(res) {
      this.isSupport = res.is_support
      this.ssToken = {
        points: res.points || [], // 用户是否喜欢了这篇文章
        dislikes: res.dislikes,
        likes: res.likes,
        is_liked: res.is_liked || 0 // is_liked：0：没有操作过，1：不推荐，2：推荐
      }
      this.postBackendReading(res)
    },
    payDone() {
      setTimeout(() => {
        this.$store.commit('setCommentRequest')
      }, 3000)
    },
    async getPayTokenBalance(id) {
      // 查看余额
      const res = await this.$API.getUserBalance(id)
      console.log('getPayTokenBalance', id, res)
      const balance = this.$utils.fromDecimal(res.data)
      this.payTokenBalance = balance
    },
    // 处理支付币阅读的文章
    async handlePayToken() {
      // 判断余额，余额不足->去创建买币订单，余额足->直接支付
      const {
        decimals,
        logo,
        token_id: id,
        name,
        symbol
      } = this.article.prices[0]
      this.form.outputToken = {
        decimals,
        id,
        logo,
        name,
        symbol
      }
      const needPay = this.getArticlePrice
      // 查看余额
      const balance = this.payTokenBalance
      // 余额不足，去创建买币订单
      if (balance < needPay) {
        const _needPay = new BigNumber(needPay)
        this.form.output = parseFloat(_needPay.minus(balance).toString())
        this.createOrder()
        /* this.$alert('是否创建订单？', '余额不足', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              this.createOrder()
            }
          }
        }) */
      } else { // 余额足，直接支付
        this.form.output = 0
        this.$alert('是否直接支付？', '余额充足', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              this.payTokenToArticle()
            }
          }
        })
      }
      console.log('balance', balance, 'this.form.output', this.form.output)
    },
    // 直接支付token
    async payTokenToArticle() {
      const loading = this.$loading({
        lock: false,
        text: '购买中',
        background: 'rgba(0, 0, 0, 0.4)'
      })
      this.$API.payTokenToArticle({
        pid: this.article.id
      })
        .then(res => {
          loading.close()
          if (res.code === 0) {
            window.location.reload()
          } else {
            this.$message({
              showClose: true,
              message: res.message || '支付失败，请刷新页面重试',
              type: 'error'
            })
          }
        })
    },
    async createEditOrder(nt) {
      this.copyForm = this.editForm
      this.$nextTick(() => {
        this.createOrder(nt, false, this.editForm)
      })
    },
    async createOrder(nt, np, _form) {
      let needToken = nt === undefined ? false : nt
      let needPrice = np === undefined ? false : np
      if (nt === undefined) {
        // 是持币阅读文章 或者 是需要买币阅读（非cny）
        if ((this.isTokenArticle && !this.tokenHasPaied) || this.getPayToken.token_id !== 0) {
          needToken = true
        }
      }
      if (np === undefined) {
        if (this.isPriceArticle && !this.priceHasPaied && this.getPayToken.token_id === 0) {
          needPrice = true
        }
      }
      console.log(needPrice, needToken)
      if (_form === undefined) {
        this.copyForm = {
          input: this.form.input,
          inputToken: Object.assign({}, this.form.inputToken),
          output: this.form.output,
          outputToken: Object.assign({}, this.form.outputToken),
          needPrice,
          needToken,
        }
      } else {
        this.copyForm = {
          ..._form,
          needPrice,
          needToken,
        }
      }
      if (needPrice) {
        // type这个字段不重要，可以去除
        this.$store.dispatch('order/createOrder', {
          ...this.copyForm,
          needToken,
          needPrice,
          signId: this.article.id
        })
      } else {
        this.showExs = true
      }
    },
    async wxpayArticle() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      // 如果是付币阅读的文章
      if (this.isPriceArticle && !this.priceHasPaied && this.getPayToken.token_id !== 0) {
        await this.handlePayToken()
      } else {
        this.createOrder()
      }
    },
    async hasExs(tokenId) {
      let hasMarket = true
      let hasUniswap = true
      const uniswapResult = await this.$API.getCurrentPoolSize(tokenId)
      if (uniswapResult.code === 0) {
        hasUniswap = true
        if (uniswapResult.data.token_amount <= 0) hasUniswap = false
      } else {
        hasUniswap = false
      }
      const marketResult = await this.$API.directTrade.getItem(tokenId)
      if (marketResult.code === 0) {
        hasMarket = true
        if (marketResult.data.balance <= 0) hasMarket = false // 余额不足
        if (marketResult.data.status !== 0) hasMarket = false // 市场被关闭
      } else {
        hasMarket = false
      }
      return hasMarket || hasUniswap
    },
    async calPayFormParams() {
      if (this.article.tokens && this.article.tokens.length !== 0) {
        if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0) {
          const tokenName = this.currentProfile.holdMineTokens.filter(list => list.id === this.article.tokens[0].id)
          // 获取有多少token
          const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
          // 获取需要多少token
          const needTokenAmount = this.article.tokens[0].amount
          // 减之后 换算
          if (needTokenAmount <= amount) this.form.output = 0
          else this.form.output = utils.fromDecimal(needTokenAmount - amount)
          const { inputToken, output, outputToken } = this.form
          if (output > 0) {
            const { data, error } = await this.getInputAmount(inputToken.id, outputToken.id, output)
            this.form.input = data
            this.getInputAmountError = error
          }
        } else {
          // 获取需要多少token
          const needTokenAmount = this.article.tokens[0].amount
          this.form.output = utils.fromDecimal(needTokenAmount)
          const { inputToken, output, outputToken } = this.form
          if (output > 0) {
            const { data, error } = await this.getInputAmount(inputToken.id, outputToken.id, output)
            this.form.input = data
            this.getInputAmountError = error
          }
        }
      }
    },

    // 获取编辑权限需要多少钱
    async calPayEditFormParams() {
      if (this.article.editTokens && this.article.editTokens.length !== 0) {
        if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0) {
          const tokenName = this.currentProfile.holdMineTokens.filter(list => list.id === this.article.editTokens[0].id)
          // 获取有多少token
          const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
          // 获取需要多少token
          const needTokenAmount = this.article.editTokens[0].amount
          // 减之后 换算
          if (needTokenAmount <= amount) this.editForm.output = 0
          else this.editForm.output = utils.fromDecimal(needTokenAmount - amount)
          const { inputToken, output, outputToken } = this.editForm
          if (output > 0) {
            console.log('传入的数据：', inputToken.id, outputToken.id, output, outputToken)
            const { data, error } = await this.getInputAmount(inputToken.id, outputToken.id, output)
            this.editForm.input = data
            this.getEditInputAmountError = error
          }
        } else {
          // 获取需要多少token
          const needTokenAmount = this.article.editTokens[0].amount
          this.editForm.output = utils.fromDecimal(needTokenAmount)
          const { inputToken, output, outputToken } = this.editForm
          if (output > 0) {
            console.log('传入的数据：', inputToken.id, outputToken.id, output, outputToken)
            const { data, error } = await this.getInputAmount(inputToken.id, outputToken.id, output)
            this.editForm.input = data
            this.getEditInputAmountError = error
          }
        }
      }
    },

    async getInputAmount(inputTokenId, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = utils.toDecimal(outputAmount, deciaml)
      try {
        let res = await this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount)
        this.payBtnDisabled = false
        if (res.code === 0) {
          // rmb向上取整
          if (inputTokenId === 0 && parseFloat(res.data) >= 100) {
            return {
              data: parseFloat(utils.formatCNY(res.data, deciaml)).toFixed(2),
              error: ''
            }
          } else {
            return {
              data: parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4),
              error: ''
            }
          }
        } else {
          console.error(res.message)
          return {
            data: '',
            error: res.message
          }
        }
      } catch(err) {
        console.error(err)
        return {
          data: '',
          error: ''
        }
      }
    },

    copyText(getCopyIpfsHash) {
      this.$copyText(getCopyIpfsHash).then(
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
    },
    // 获取文章的ipfs hash信息
    async getArticleIpfs(id = this.$route.params.id) {
      await this.$API.getArticleIpfs(id)
        .then(res => {
          if (res.code === 0) {
            this.articleIpfsArray = res.data
          } else {
            console.log(res.message)
          }
        }).catch(err => {
          console.log('err', err)
        })
    },
    /** 遍历所有的持币可见内容 */
    setAllHideContentStyle() {
      this.$nextTick(() => {
        const unlockPrompts = document.getElementsByClassName('unlock-prompt')
        const unlockContents = document.getElementsByClassName('unlock-content')

        for(let i = 0; i < unlockPrompts.length; i++) {
          this.setUnlockPromptStyle(unlockPrompts[i])
        }
        for(let i = 0; i < unlockContents.length; i++) {
          this.setUnlockContentStyle(unlockContents[i])
        }
      })
    },
    /** 持币可见未解锁的样式 */
    setUnlockPromptStyle(unlockPrompt) {
      const need = JSON.parse(unlockPrompt.getAttribute('data-need'))
      if(!need) return
      const hold = JSON.parse(unlockPrompt.getAttribute('data-hold')) || []

      // 条件列表
      let list = ''
      for(let i = 0; i < need.length; i++) {
        const difference = hold[i] ? (need[i].amount - hold[i].amount) : need[i].amount
        list += `
        <div class="condition fl">
          <p style="flex: 1">
            持有：${need[i].amount / 10000 }
            <a href="/token/${need[i].id}">
            <img src="${this.$ossProcess(need[i].logo)}" alt="logo" data-noenlarge="1">
            ${need[i].symbol}(${need[i].name})
            </a>
          </p>
          <p class="condition-difference">
            ${ difference < 1 && hold[i] ? '已持有' : '还需持有' }${ (difference < 1 && hold[i] ? hold[i].amount : difference) / 10000 } ${need[i].symbol}
          </p>
        </div>
        `
      }
      // 整体的html
      unlockPrompt.innerHTML = `
        <div class="lock-bg">
          <img
            src="${lockSvg}" alt="lock" data-noenlarge="1"
          />
        </div>
        ${unlockPrompt.innerHTML.trim() !== 'Hidden content' ? unlockPrompt.innerHTML + '\n<hr />' : ''}
        <div>
          <div class="fl">
            <h4 class="condition-title">
              隐藏内容，满足以下条件解锁:
            </h4>
            <button class="condition-button" onclick='unlock(${JSON.stringify(need)},${JSON.stringify(hold)})'>
              解锁
            </button>
          </div>
          ${list}
        </div>`
    },
    /** 持币可见解锁后的样式 */
    setUnlockContentStyle(unlockContent) {
      unlockContent.innerHTML = `
        <div class="lock-bg">
          <img
            src="${unlockSvg}" alt="lock" data-noenlarge="1"
          />
        </div>
      ` + unlockContent.innerHTML
    },
    /** 买Fan票，解锁持币可见 */
    async unlock (need, hold) {
      if(need.length > 1) return this.$message({
        duration: 10000,
        showClose: true,
        type: 'warning',
        message: '系统暂不支持同时购买多种Fan票，请点击Fan票名称前往详情页手动购买。',
      })
      if(!this.isLogined) return this.$store.commit('setLoginModal', true)
      if(hold.length < 1) return this.$message.warning('数据加载中，稍后重试。')

      const loading = this.$loading({
        lock: true,
        text: 'Getting the price ...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const difference = need[0].amount - hold[0].amount
        const {data, error} = await this.getInputAmount(0, need[0].id, difference / 10000)
        loading.close()
        if(error) return this.$message.error(error)
        const _form = {
          input: data,
          output: need[0].amount / 10000,
          outputToken: {
            decimals: 4,
            id: need[0].id
          },
          inputToken: CNY
        }
        this.createOrder(true, false, _form)
      }
      catch(e) {
        loading.close()
        console.error(e)
        this.$message.error('订单创建失败')
      }
    },
    // 获取文章标签
    async getTags() {
      await this.$API.tagsById({
        id: this.$route.params.id
      }).then(res => {
        if (res.code === 0) {
          this.tags = res.data
        } else {
          console.log(res.message)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 设置微信分享
    setWxShare() {
      let desc = ''
      try {
        // 解析html
        const markdownIt = this.$mavonEditor.markdownIt
        let md = markdownIt.render(this.post.content)
        // 过滤所有的html标签
        desc = this.$utils.compose(filterOutHtmlTags)(md)
      } catch (error) {
        console.log(error)
        // 提取内容 删除多余的标签
        const regRemoveContent = (str) => {
          if (!str) return str
          // 去除空格
          const strTrim = str => str.replace(/\s+/g, '')
          // 去除标签
          const regRemoveTag = str => str.replace(/<[^>]+>/gi, '')
          // 去除markdown img
          const regRemoveMarkdownImg = str => str.replace(/!\[.*?\]\((.*?)\)/gi, '')
          // 去除 markdown 标签
          // eslint-disable-next-line no-useless-escape
          const regRemoveMarkdownTag = str => str.replace(/[\\\`\*\_\[\]\#\+\-\!\>]/gi, '')

          const regRemoveTagResult = regRemoveTag(str)
          const regRemoveMarkdownImgResult = regRemoveMarkdownImg(regRemoveTagResult)
          const regRemoveMarkdownTagResult = regRemoveMarkdownTag(regRemoveMarkdownImgResult)
          return strTrim(regRemoveMarkdownTagResult)
        }
        // 出错就用原来的正则过滤
        desc = regRemoveContent(this.post.content)
      }

      this.$wechatShare({
        title: this.article.title,
        desc: desc,
        imgUrl: this.article.cover ? this.$ossProcess(this.article.cover) : '',
        data: this.wxShareData || {}
      })
    },
    // 设置文章默认文字大小
    setFontSize() {
      try {
        let fontSize = store.get('p_font_size')
        if (fontSize) {
          this.fontSizeVal = Number(fontSize)
        }
      } catch(e) {
        console.log(e)
      }
    },
    // 评论数
    async getCommentCount() {
      const commentResult = await this.$utils.factoryRequest(this.$API.commentGetComments({
        signid: this.$route.params.id
      }))

      if (commentResult) {
        this.commentCount = commentResult.data.allcount
      }
    },
    // 赞赏数
    async getRewardCount() {
      const rewardResult = await this.$utils.factoryRequest(this.$API.getRewardList(this.$route.params.id, 1, 1))

      if (rewardResult) {
        this.rewardCount = rewardResult.data.count
      }
    },
    // 获取评论和赞赏次数
    async getCommentRewardCount() {
      await this.getCommentCount()
      await this.getRewardCount()
    },
    // 格式化文章样式
    formatPreview() {
      try {
        if (window.$ && window.finishView) {
          window.finishView(window.$('.article-content'))
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style lang="less" scoped src="./index.less"></style>

<style lang="less" scoped>
.placeholder {
  min-height: 300px;
  text-align: center;
  font-size: 16px;
  padding: 100px 0 0;
  box-sizing: border-box;
}
</style>