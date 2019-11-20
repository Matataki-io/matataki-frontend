<template>
  <div @click.stop="documentClick" class="main">
    <g-header :popover-visible="visiblePopover.visible2" @popoverVisible="poopverDone('visible2')" />

    <div class="container">
      <!-- 文章封面 -->
      <div v-if="cover" class="TitleImage">
        <img :src="cover" alt="cover">
      </div>
      <article class="Post-Header">
        <header>
          <div class="fl ac jsb">
            <!-- 标题 -->
            <h1 class="Post-Title">
              {{ article.title }}
            </h1>
            <el-dropdown v-if="isMe(article.uid)" @command="handleMoreAction" trigger="click">
              <div class="more-setting">
                <svg-icon class="more-icon-setting" icon-class="setting" />
                <span class="more-text-setting">设置</span>
              </div>
              <el-dropdown-menu slot="dropdown" class="user-dorpdown">
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
          <!-- 文章信息 头像 昵称 时间 阅读量 关注 -->
          <UserInfoHeader :article="article" />
        </header>
        <!-- ipfs -->
        <articleIpfs :is-hide="isHideIpfsHash" :hash="article.hash" />
        <!-- 文章内容 -->
        <div v-html="compiledMarkdown" class="Post-RichText markdown-body article-content" />
        <!-- 文章页脚 声明 是否原创 -->
        <ArticleFooter v-if="hasPaied" :article="article" style="margin-top: 20px;" />

        <div v-if="!hasPaied && !isProduct" class="lock-line">
          <el-divider>
            <span class="lock-text">达成条件即可阅读全文</span>
          </el-divider>
          <svg-icon
            class="icon-arrow"
            icon-class="arrow_down"
          />
          <div class="lock-line-full" />
        </div>
      </article>
      <!-- 解锁按钮 -->
      <div v-if="(isTokenArticle || isPriceArticle) && !isProduct" class="lock">
        <div class="lock-left">
          <img v-if="!hasPaied" class="lock-img" src="@/assets/img/lock.png" alt="lock">
          <img v-else class="lock-img" src="@/assets/img/unlock.png" alt="lock">
        </div>
        <div class="lock-info">
          <h3 class="lock-info-title">
            {{ !hasPaied ? '购买全文' : '已拥有本文' }}
          </h3>
          <h5 class="lock-info-subtitle" v-if="!hasPaied">购买后即可解锁全部精彩内容</h5>
          <p v-if="!isMe(article.uid)" class="lock-info-des">
            <ul>
              <li v-if="isPriceArticle">
                价格：{{ getArticlePrice }} CNY
              </li>
              <li v-if="isTokenArticle">
                条件：持有{{ needTokenAmount }}枚以上的{{ needTokenSymbol }}粉丝通证
                <!-- 不显示 - 号 -->
                <span> {{ !tokenHasPaied ? '还差' : '目前拥有' }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }}枚{{ needTokenSymbol }}</span>
              </li>
            </ul>
            <span v-if="hasPaied" class="lock-pay-text">已支付</span>
          </p>
          <p v-else class="lock-info-des">
            自己发布的文章
          </p>
          <div class="lock-bottom" v-if="!hasPaied">
            <el-button
              type="primary"
              @click="wxpayArticle"
              size="small"
            >
              一键购买
            </el-button>
          </div>
        </div>
      </div>

      <!-- sidebar -->
      <div class="sidebar">
        <div v-if="isProduct" @click="buy" class="article-btn">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ $t('p.buyShop') }}</span>
        </div>
        <!-- 投资按钮 -->
        <!-- <div v-if="isProduct" @click="invest" class="article-btn">
          <div :class="isProduct ? 'yellow' : 'blue'" class="icon-container blue">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? this.$t('p.invested') : this.$t('p.investShop')) : (isSupport ? this.$t('p.invested') : this.$t('p.investArticle')) }}</span>
        </div> -->

        <!-- <div
          v-if="!isProduct"
          class="comment fl ac fdc"
          >
          <div class="comment-block">
            <svg-icon icon-class="comment" class="comment-icon" />
          </div>
          <span>评论</span>
          </div> -->

        <div
          @click="share"
          class="article-btn"
        >
          <el-popover
            v-model="visiblePopover.visible1"
            placement="right"
            width="300"
            trigger="manual"
          >
            <p>{{ $t('p.sharePopover') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button @click="poopverDone('visible1')" class="el-button--purple" type="primary" size="mini">
                {{ $t('p.confirmPopover') }}
              </el-button>
            </div>

            <div
              slot="reference"
            >
              <div
                :class="isProduct ? 'yellow' : 'blue'"
                class="icon-container blue"
              >
                <svg-icon icon-class="share" class="icon" />
              </div>
              <span>{{ $t('share') }}</span>
            </div>
          </el-popover>
        </div>

        <el-popover
          v-model="visiblePopover.visible"
          placement="right"
          width="300"
          trigger="manual"
        >
          <p>{{ $t('p.likePopover') }}</p>
          <div style="text-align: right; margin: 0">
            <el-button @click="poopverDone('visible')" class="el-button--purple" type="primary" size="mini">
              {{ $t('p.confirmPopover') }}
            </el-button>
          </div>
          <div
            slot="reference"
          >
            <CoinBtn
              v-if="!isProduct"
              :time="timeCount"
              :token="ssToken"
              :article="article"
              @like="like"
              @dislike="dislike"
              style="margin-top: 40px;"
            />
          </div>
        </el-popover>
      </div>
    </div>

    <div class="p-w btns-container">
      <div ref="actionBtns" :class="isProduct && 'btns-center'" class="btns">
        <!-- 商品 -->
        <!-- 分享 投资 购买 -->
        <div v-if="isProduct" @click="share" class="article-btn article-btn-margin">
          <div :class="isProduct ? 'yellow' : 'blue'" class="icon-container blue">
            <svg-icon icon-class="share" class="icon" />
          </div>
          <span> {{ $t('share') }}</span>
        </div>
        <div v-if="isProduct" @click="buy" class="article-btn article-btn-margin">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ $t('p.buyShop') }}</span>
        </div>
        <!-- 投资商品 -->
        <!-- <div v-if="isProduct" @click="invest" class="article-btn">
          <div :class="isProduct ? 'yellow' : 'blue'" class="icon-container blue">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? this.$t('p.invested') : this.$t('p.investShop')) : (isSupport ? this.$t('p.invested') : this.$t('p.investArticle')) }}</span>
        </div> -->

        <!-- 文章 -->
        <!-- 分享 推荐 不推荐 -->

        <!-- 文章下方的功能按钮, 由于修改的之前的代码, share模块用插槽的形式写入 -->
        <TokenFooter
          v-if="!isProduct"
          :time="timeCount"
          :token="ssToken"
          :article="article"
          @like="like"
          @dislike="dislike"
        >
          <!-- slot 插槽写入 -->
          <template>
            <div @click="toggleBookmark" class="article-btn">
              <div v-if="!isProduct" :class="{ actived: isBookmarked }" class="icon-container blue">
                <svg-icon :iconClass="'bookmark-solid'" class="icon" />
              </div>
              <span>{{ !isBookmarked ? $t('bookmark') : $t('unbookmark') }}</span>
            </div>
            <div @click="share" class="article-btn">
              <div :class="isProduct ? 'yellow' : 'blue'" class="icon-container blue">
                <svg-icon icon-class="share" class="icon" />
              </div>
              <span>{{ $t('share') }}</span>
            </div>
          </template>
        </TokenFooter>
      </div>
      <!-- 商品页面下面的详情信息 -->
      <ArticleInfoFooter v-if="isProduct" :article="article" class="product" />
    </div>
    <!-- tag 标签 -->
    <div v-if="isShowTags" class="p-w" style="margin-bottom: 20px;">
      <router-link
        v-for="(item, index) in article.tags"
        :key="index"
        :to=" {name: 'tag-id', params: {id: item.id}, query: {name: item.name, type: item.type}}"
        style="margin-right: 10px;"
        class="tag-card"
      >
        {{ item.name }}
      </router-link>
    </div>

    <!-- 内容居中 -->
    <div class="p-w">
      <!-- 评论内容 -->
      <commentInput v-if="!isProduct" :article="article" @doneComment="commentRequest = Date.now()" />
      <CommentList :class="!isProduct && 'has-comment-input'" :comment-request="commentRequest" :sign-id="article.id" :type="article.channel_id" />
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

    <!-- 阅读文章积分提示框 目前已经去除 -->
    <!-- <FeedbackModal v-model="feedbackShow" :points="ssToken.points" /> -->
    <OrderModal v-model="showOrderModal" :form="{...form, type: 'buy_token_output', limitValue}" :tradeNo="tradeNo" />
    <!-- 关联文章侧边栏 -->
    <div :class="relatedLeftCollapse && 'open'" @click.stop class="related left">
      <div class="related-container">
        <div class="fl afe jsb">
          <div>
            <span class="related-title">已关联<span>{{ total }}</span></span>
            <!-- <span class="related-rort">
              正序
              <svg-icon icon-class="sort" class="icon" />
            </span> -->
          </div>
          <div>
            <span class="related-summary">摘要
              <el-switch
                v-model="relatedSummary"
                active-color="#542DE0"
              />
            </span>
          </div>
        </div>

        <div slot="list" v-loading="loading">
          <no-content-prompt :list="pull.list">
            <div v-for="(item, index) in relatedList" :key="index" class="related-list">
              <div :class="!item.content || !relatedSummary && 'no-margin-bottom'" class="related-list-title">
                <div class="fl jsb">
                  <div class="fl ac related-7">
                    <div class="related-list-link">
                      <a v-if="currentSite(item.url)" :href="item.url" @click="toggleArticle(item.url, $event)">{{ item.title }}</a>
                      <a v-else :href="item.url" target="_blank">{{ item.title }}</a>
                    </div>
                  </div>
                  <div class="fl ac jfe related-3">
                    <span class="related-id">{{ item.number }}</span>
                  </div>
                </div>
                <div class="fl ac related-link">
                  <a class="link" href="javascript:void(0);">{{ item.url }}</a>
                  <svg-icon @click="copyCode(item.url)" class="icon-copy" icon-class="copy2" />
                  <a :href="item.url" target="_blank">
                    <svg-icon class="icon-share" icon-class="jump" />
                  </a>
                </div>
              </div>
              <transition>
                <div v-if="relatedSummary" :class="!item.collapse && 'open'">
                  <div class="related-list-content">
                    {{ item.content }}
                  </div>
                  <div v-if="item.showCollapse" class="related-more">
                    <transition name="fade">
                      <div v-if="!item.collapse" class="more-full" />
                    </transition>
                    <span @click.stop="item.collapse = !item.collapse">
                      {{ item.collapse ? '折叠': '展开' }}
                      <i class="el-icon-arrow-up arrow-up" /></span>
                  </div>
                </div>
              </transition>
            </div>

            <user-pagination
              v-show="!loading"
              :current-page="currentPage"
              :params="pull.params"
              :api-url="pull.apiUrl"
              :url-replace="$route.params.id + ''"
              :page-size="pull.params.pagesize"
              :total="total"
              :reload="pull.reload"
              @paginationData="paginationData"
              @togglePage="togglePage"
              class="pagination"
            />
          </no-content-prompt>
        </div>
      </div>

      <div @click.stop="relatedLeftCollapse = !relatedLeftCollapse" class="related-arrow">
        <svg-icon icon-class="arrow" class="icon" />
        <span v-if="!relatedLeftCollapse">已关联{{ total }}篇</span>
      </div>
    </div>
    <div :class="relatedRightCollapse && 'open'" @click.stop class="related right">
      <div class="related-container">
        <div class="fl afe jsb">
          <div>
            <span class="related-title">被关联<span>{{ beingTotal }}</span></span>
            <!-- <span class="related-rort">
              正序
              <svg-icon icon-class="sort" class="icon" />
            </span> -->
          </div>
          <el-button v-loading="relatedLoadingBtn" @click="posts" type="primary" size="small" icon="el-icon-link">
            关联本文
          </el-button>
        </div>

        <div slot="list" v-loading="beingLoading">
          <no-content-prompt :list="beingPull.list">
            <div v-for="(item, index) in beingRelatedList" :key="index" class="related-list">
              <div class="related-list-title no-margin-bottom">
                <div class="fl jsb">
                  <div class="fl ac related-7">
                    <div class="related-list-link">
                      <a v-if="currentSite(item.url)" :href="item.url" @click="toggleArticle(item.url, $event)">{{ item.title }}</a>
                      <a v-else :href="item.url" target="_blank">{{ item.title }}</a>
                    </div>
                  </div>
                  <!-- <div class="fl ac jfe related-3">
                    <span class="related-id">{{ item.number }}</span>
                  </div> -->
                </div>
                <div class="fl ac related-link">
                  <a class="link" href="javascript:void(0);">{{ item.url }}</a>
                  <svg-icon @click="copyCode(item.url)" class="icon-copy" icon-class="copy2" />
                  <a :href="item.url" target="_blank">
                    <svg-icon class="icon-share" icon-class="jump" />
                  </a>
                </div>
              </div>
            </div>

            <user-pagination
              v-show="!beingLoading"
              :current-page="beingCurrentPage"
              :params="beingPull.params"
              :api-url="beingPull.apiUrl"
              :url-replace="$route.params.id + ''"
              :page-size="beingPull.params.pagesize"
              :total="beingTotal"
              :reload="beingPull.reload"
              @paginationData="beingPaginationData"
              @togglePage="beingTogglePage"
              class="pagination"
            />
          </no-content-prompt>
        </div>
      </div>

      <div @click.stop="relatedRightCollapse = !relatedRightCollapse" class="related-arrow">
        <svg-icon icon-class="arrow" class="icon" />
        <span v-if="!relatedRightCollapse">被关联{{ beingTotal }}次</span>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import moment from 'moment'
import Cookies from 'js-cookie'
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor-matataki'
import { xssFilter } from '@/utils/xss'
import CommentList from '@/components/comment/List'
import UserInfoHeader from '@/components/article/UserInfoHeader'
import ArticleInfoFooter from '@/components/article/ArticleInfoFooter'
import ArticleFooter from '@/components/article/ArticleFooter'
import articleIpfs from '@/components/article/article_ipfs'
import InvestModal from '@/components/modal/Invest'
import PurchaseModal from '@/components/modal/Purchase'
import ShareModal from '@/components/modal/Share'
import articleTransfer from '@/components/articleTransfer'
import CoinBtn from '@/components/article/CoinBtn'
import TokenFooter from '@/components/article/TokenFooter'
// import FeedbackModal from '@/components/article/Feedback'
import commentInput from '@/components/article_comment'
import { ipfsData } from '@/api/async_data_api.js'
import { extractChar, regRemoveContent } from '@/utils/reg'
import { precision } from '@/utils/precisionConversion'
import store from '@/utils/localStorage.js'
import OrderModal from '@/components/article/ArticleOrderModal'
import { CNY } from '@/components/exchange/consts.js'
import utils from '@/utils/utils'
import { getCookie } from '@/utils/cookie'

import userPagination from '@/components/user/user_pagination.vue'

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
    ArticleInfoFooter,
    ArticleFooter,
    articleIpfs,
    articleTransfer,
    CoinBtn,
    TokenFooter,
    // FeedbackModal,
    commentInput,
    OrderModal,
    userPagination
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
      commentRequest: 0,
      timer: null,
      timeCount: 0,
      ssToken: {
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      },
      // feedbackShow: false,
      // 三个引导提示的状态
      visiblePopover: {
        visible: false,
        visible1: false,
        visible2: false
      },
      timerShare: null, // 分享计时器
      timeCountShare: 0, // 分享计时
      article: Object.create(null),
      post: Object.create(null),
      postsIdReadnewStatus: false, // 新文章阅读是否上报
      isReading: false, // read接口是否请求完毕
      comment: '', //评论内容
      currentProfile: Object.create(null),
      differenceToken: '0',
      showLock: false,
      showOrderModal: false,
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      getInputAmountError: '',
      payBtnDisabled: true,
      relatedLeftCollapse: false, // 左侧关联
      relatedRightCollapse: false, // 右侧关联
      relatedSummary: true, // 关联摘要
      relatedList: [
        // {
        //   url: 'http://localhost:8080/publish/draft/create',
        //   title: '1区块链文娱产品形态猜想：文化概念的区块链化',
        //   content: '解决了区块链有具有商商业前品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
        //   collapse: false,
        //   showCollapse: true
        // }
      ],
      beingRelatedList: [
      //   {
      //     url: 'http://localhost:8080/publish/draft/create',
      //     title: '1区块链文娱产品形态猜想：文化概念的区块链化',
      //     content: '解决了区块链有具有商商业前品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。'
      //   },
      ],
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
      tokenHasPaied: true,
      priceHasPaied: true,
      hasPaied: true
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
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css' }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    articleTimeISO() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return moment(time).toISOString()
    },
    articleCreateTimeComputed() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    compiledMarkdown() {
      if (process.browser) {
        const markdownIt = mavonEditor.getMarkdownIt()
        return markdownIt.render(xssFilter(this.post.content))
      } else {
        return markdownIt.render(xssFilter(this.post.content))
      }
    },
    cover() {
      if (this.article.cover) return this.$API.getImg(this.article.cover)
      return null
    },
    avatarSrc() {
      if (this.currentUserInfo.avatar) return this.$API.getImg(this.currentUserInfo.avatar)
      return ''
    },
    isProduct() {
      return this.article.channel_id === 2
    },
    likedOrDisLiked() {
      return parseInt(this.ssToken.is_liked) !== 0
    },
    isShowTags() {
      return this.article.tags && this.article.tags.length !== 0
    },
    getArticlePrice() {
      if (this.isPriceArticle) {
        const ad = this.article.prices[0]
        return this.$utils.fromDecimal(ad.price)
      } else {
        return 0
      }
    },
    // 是否是付费文章
    isPriceArticle() {
      return (this.article.prices && this.article.prices.length !== 0)
    },
    // 是否为付费文章
    isTokenArticle() {
      return (this.article.tokens && this.article.tokens.length !== 0)
    },
    // 需要多少粉丝通证
    needTokenAmount() {
      if (this.article.tokens.length !== 0) {
        return precision(this.article.tokens[0].amount, 'CNY', this.article.tokens[0].decimals)
      } else return 0
    },
    // 需要多少粉丝通证名称
    needTokenSymbol() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    },
    limitValue() {
      const { input } = this.form
      return (parseFloat(input) / (1 - 0.01)).toFixed(4)
    },
    // 如果是自己的文章 显示hash 否则走 持币阅读
    isHideIpfsHash() {
      if (this.isMe(this.article.uid)) return false
      else return this.isTokenArticle
    }
  },
  watch: {
    timeCount(v) {
      if (!this.postsIdReadnewStatus && v >= 30) {
        this.postsIdReadnew()
        this.postsIdReadnewStatus = true
      }
      if (v >= 150) {
        clearInterval(this.timer)
      }
    },
    timeCountShare(v) {
      if (v >= 60 && !store.get('shareVisible')) {
        this.visiblePopover.visible1 = true
        clearInterval(this.timerShare)
      }
    }
    // '$route'(to, from) {
    //   document.title = to.meta.title || 'Your Website'
    // }
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
    // console.log('info', info)

    // 判断是否为付费阅读文章
    if ((info.data.tokens && info.data.tokens.length !== 0) || (info.data.prices && info.data.prices.length > 0)) {
      return {
        article: info.data,
        post: {
          content: info.data.short_content
        }
      }
    } else {
      const content = await ipfsData($axios, info.data.hash)
      return {
        article: info.data,
        post: content.data
      }
    }
  },
  mounted() {
    this.setAvatar()
    this.addReadAmount()
    this.handleFocus()
    this.getCurrentProfile()
    // if (!document.hidden) {
    //   this.reading()
    // }

    // dom加载完提示 推荐/不推荐
    this.$nextTick(() => {
      // undefined false 显示
      if (!store.get('likeVisible')) this.visiblePopover.visible = true
      this.shareCount()
      // this.showOrderModal = true
    })

    this.renderRelatedListContent()

    this.setRelatedSlider()
    window.addEventListener('resize', throttle(this.setRelatedSlider, 300))
    window.addEventListener('popstate', this._popstateEvent)
  },
  destroyed() {
    // window.removeEventListener('resize', throttle(this.setRelatedSlider))
    window.removeEventListener('popstate', this._popstateEvent)

    clearInterval(this.timer)
    clearInterval(this.timerShare)
  },
  methods: {
    _popstateEvent() {
      this.toggleArticle(window.location.href, null, true)
      // console.log(111, this.$route.params, window.location, history)
    },
    // 增加文章阅读量
    async addReadAmount() {
      await this.$API.addReadAmount({ articlehash: this.article.hash }).catch(err => console.log('add read amount error', err))
    },
    // 获取用户在当前文章的属性
    async getCurrentProfile(id) {
      if (!getCookie('ACCESS_TOKEN')) {
        this.tokenHasPaied = false
        this.priceHasPaied = false
        this.hasPaie = false
        return
      }
      const data = {
        id: id || this.$route.params.id
      }

      // console.log(data)

      await this.$API.getCurrentProfile(data).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.currentProfile = res.data
          this.form.outputToken = res.data.holdMineTokens && res.data.holdMineTokens.length > 0 ? res.data.holdMineTokens[0] : {}
          // Object.assign(this.article, this.currentProfile)
          // console.log('article', this.article)
          this.differenceTokenFunc()
          this.calPayFormParams()
          this.getSupportStatus(res.data)
          this.isBookmarked = Boolean(res.data.is_bookmarked)
        } else if (res.code === 401) {
          console.log(res.message)
        } else {
          console.log(res.message)
        }
      }).catch(err => console.log(err))
    },
    // 差多少token 变为字符界面显示截取 - 号
    differenceTokenFunc() {
      if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0 && this.article.tokens) {
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
      /* // 是否是需要持币阅读的文章
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

    shareCount() {
      this.timerShare = setInterval(() => {
        this.timeCountShare++
        // console.log(this.timeCountShare)
      }, 1000)
    },
    // 提示点击确定后
    poopverDone(visible) {
      // likeVisible shareVisible userVisible
      if (visible === 'visible') {
        store.set('likeVisible', true)
        this.visiblePopover.visible = false
      } else if (visible === 'visible1') {
        store.set('shareVisible', true)
        this.visiblePopover.visible1 = false
      } else if (visible === 'visible2') {
        store.set('userVisible', true)
        this.visiblePopover.visible2 = false
      }
    },
    // 推荐或不推荐显示 用户popover提示
    showUserPopover() {
      if (!store.get('userVisible')) this.visiblePopover.visible2 = true
    },
    async getIpfsData() {
      await this.$API.getIpfsData(this.article.hash)
        .then(res => {
          if (res.code === 0) {
            this.post.content = res.data.content
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {
          console.log('err', err)
        })
    },
    async getArticleInfoFunc() {
      await this.$API.getArticleInfo(this.$route.params.id)
        .then(res => {
          if (res.code === 0) this.article = res.data
          else this.$message.warning(res.message)
        }).catch(err => {
          console.log('err', err)
        })
    },
    // 推荐
    like() {
      this.showUserPopover()
      this.$API.like(this.article.id, this.timeCount).then(res => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.ssToken.is_liked = 2
          this.ssToken.points = res.data
          // this.feedbackShow = true
          this.$message.success(this.$t('articleFooter.commentDoneMessage'))

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          this.$message.error(`${this.$t('articleFooter.like')},${this.$t('error.fail')}`)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      })
    },
    // 不推荐
    dislike() {
      this.showUserPopover()
      this.$API.dislike(this.article.id, this.timeCount).then(res => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.ssToken.is_liked = 1
          this.ssToken.points = res.data
          // this.feedbackShow = true
          this.$message.success(this.$t('articleFooter.commentDoneMessage'))

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          this.$message.error(`${this.$t('articleFooter.unlike')},${this.$t('error.fail')}`)
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
          // console.log('计时', this.timeCount)
        }, 1000)
      }
    },
    handleFocus() {
      // https://github.com/hehongwei44/my-blog/issues/184
      window.onfocus = () => {
        // console.log('页面激活')
        clearInterval(this.timer)
        if (this.isReading) this.reading()
      }
      window.onblur = () => {
        // console.log('页面隐藏')
        clearInterval(this.timer)
        this.timer = null
      }
    },
    handleMoreAction(command) {
      this[command]()
    },
    del() {
      const delSuccess = () => {
        this.$message({ duration: 2000, message: this.$t('p.deleteArticle') })
        this.$router.push('/article')
      }
      const fail = (err) => {
        this.$message.error(this.$t('p.deleteFail'))
        console.log('error', err)
      }
      const delArticleFunc = async (id) => {
        if (!id) return fail(this.$t('p.noId'))
        try {
          const response = await this.$backendAPI.delArticle({ id })
          if (response.status === 200 && response.data.code === 0) delSuccess()
          else fail(response.data.message)
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
        .catch((action) => {})
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
          const res = await this.$API.unbookmark(this.article.id)
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
      await this.$API.getUser({ id: this.article.uid }).then((res) => {
        if (res.code === 0) {
          this.avatar = res.data.avatar ? this.$API.getImg(res.data.avatar) : ''
        } else this.$message.warning(res.message)
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
        this.commentRequest = Date.now()
      }, 3000)
    },
    postsIdReadnew() {
      const isNDaysAgo = this.$utils.isNDaysAgo(3, this.article.create_time)
      if (this.article.is_readnew !== 1 && !isNDaysAgo) {
        // console.log('阅读新文章增加积分')
        this.$API.postsIdReadnew(this.article.id, this.timeCount)
          .then(res => {
            if (res.code === 0) {
              this.$message.success(this.$t('articleFooter.readNew', [this.$point.readNew]))
              // console.log('阅读新文章增加积分成功')
            } else console.log('阅读新文章增加积分失败')
          }).catch(err => console.log(`阅读新文章增加积分失败${err}`))
      }
    },
    makeOrderParams() {
      const requestParams = {
        useBalance: 0,
        items: []
      }
      // token未支付
      if (this.isTokenArticle && !this.tokenHasPaied) {
        const { output, outputToken } = this.form
        requestParams.items.push({
          tokenId: outputToken.id,
          type: 'buy_minetoken',
          amount: utils.toDecimal(output, outputToken.decimals)
        })
      }
      // 文章price未支付
      if (this.isPriceArticle && !this.priceHasPaied) {
        requestParams.items.push({
          signId: this.article.id,
          type: 'buy_post'
        })
      }
      return requestParams
    },
    wxpayArticle() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      if (this.getInputAmountError) {
        this.$message.error(this.getInputAmountError)
        return
      }
      const loading = this.$loading({
        lock: false,
        text: '提交中',
        background: 'rgba(0, 0, 0, 0.4)'
      })
      const requestParams = this.makeOrderParams()
      this.$API.createArticleOrder(requestParams).then(res => {
        loading.close()
        if (res.code === 0) {
          this.tradeNo = res.data
          this.showOrderModal = true
          // this.$router.push({ name: 'porder-id', params: {id: res.data}})
        } else {
          this.$message.error('订单创建失败')
        }
      })
    },
    wxpay() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      if (this.getInputAmountError) {
        this.$message.error(this.getInputAmountError)
        return
      }
      this.showOrderModal = true
    },
    // 微信支付购买
    calPayFormParams() {
      if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0 && this.article.tokens) {
        const tokenName = this.currentProfile.holdMineTokens.filter(list => list.id === this.article.tokens[0].id)
        // 获取有多少token
        const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
        let needTokenAmount = 0
        // 获取需要多少token
        if (this.article.tokens && this.article.tokens.length !== 0) {
          needTokenAmount = this.article.tokens[0].amount
        }
        // 减之后 换算
        if (needTokenAmount <= amount) this.form.output = 0
        else this.form.output = utils.fromDecimal(needTokenAmount - amount)
        const { inputToken, output, outputToken } = this.form
        if (output > 0) {
          this.getInputAmount(inputToken.id, outputToken.id, output)
        }
      }
    },
    getInputAmount(inputTokenId, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = utils.toDecimal(outputAmount, deciaml)
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then((res) => {
        this.payBtnDisabled = false
        if (res.code === 0) {
          this.getInputAmountError = ''
          // rmb向上取整
          if (inputTokenId === 0 && parseFloat(res.data) >= 100) {
            this.form.input = parseFloat(utils.formatCNY(res.data, deciaml)).toFixed(2)
          } else {
            this.form.input = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
          }
        } else {
          this.getInputAmountError = res.message
          this.form.input = ''
        }
      })
    },
    /**
     * 渲染关联内容 判断是否显示展开或折叠
     * 如果传递参数 循环所有, 否则判断单个
     */
    renderRelatedListContent(i) {
      this.$nextTick(() => {
        if (i) {
          const ele = document.querySelectorAll('.related-list-content')[i]
          if (!ele) return
          if (ele.clientHeight < 80) this.relatedList[i].showCollapse = false
          else this.relatedList[i].showCollapse = true
        } else {
          const relatedList = document.querySelectorAll('.related-list-content')
          if (!relatedList) return
          relatedList.forEach((ele, i) => {
            // console.log(ele.clientHeight)
            if (!this.relatedList[i]) return
            if (ele.clientHeight < 80) this.relatedList[i].showCollapse = false
            else this.relatedList[i].showCollapse = true
          })
        }
      })
    },
    setRelatedSlider() {
      this.$nextTick(() => {
        const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        // 10 + 37
        const sliderWidth = (clientWidth / 2) - 47
        if (sliderWidth < 580) {
          const relatedDom = document.querySelectorAll('.related')
          relatedDom.forEach((ele, i) => {
            // console.log(ele)
            ele.style.maxWidth = sliderWidth + 'px'
          })
        }
      })
    },
    // 隐藏侧边关联栏
    documentClick() {
      this.relatedLeftCollapse = false
      this.relatedRightCollapse = false
    },
    paginationData(res) {
      this.total = res.data.count || 0
      this.relatedList.length = 0
      res.data.list.map(i => {
        this.relatedList.push({
          url: i.url,
          title: i.title,
          content: i.summary,
          number: i.number,
          collapse: false,
          showCollapse: true
        })
      })
      this.pull.list = res.data.list
      this.loading = false

      this.renderRelatedListContent()
    },
    togglePage(i) {
      this.loading = true
      this.pull.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    },
    beingPaginationData(res) {
      this.beingTotal = res.data.count || 0
      this.beingRelatedList.length = 0
      res.data.list.map(i => {
        this.beingRelatedList.push({
          url: `${process.env.VUE_APP_PC_URL}/p/${i.id}`,
          title: i.title,
          // content: i.summary,
          // number: i.number,
          collapse: false,
          showCollapse: true
        })
      })
      this.beingPull.list = res.data.list
      this.beingLoading = false

      this.renderRelatedListContent()
    },
    beingTogglePage(i) {
      this.beingLoading = true
      this.beingPull.list = []
      this.beingCurrentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    },
    // 关联本文
    async posts() {
      if (this.isLogined) {
        // 生成草稿
        // 添加关联
        const addRelated = (id) => {
          this.relatedLoadingBtn = true
          const data = {
            url: window.location.href,
            title: this.article.title,
            summary: regRemoveContent(xssFilter(this.post.content)).slice(0, 500) // 500 字
          }
          this.$API.draftsReferences(id, data).then(res => {
            if (res.code === 0) this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: id } })
            else this.$message.error(res.message)
          }).catch(err => {
            console.log('err', err)
          }).finally(() => {
            this.relatedLoadingBtn = false
          })
        }

        // 不需要处理其他内容 如果其他内容变动会自动生成草稿
        await this.$API.createDraft({
          title: '',
          content: '',
          cover: '',
          commentPayPoint: 1,
          fissionFactor: 2000,
          is_original: 0,
          tags: ''
        })
          .then(res => {
            if (res.code === 0) {
              // 添加关联
              addRelated(res.data)
            } else this.$message.error(res.message)
          })
          .catch(err => {
            console.log(err)
          })

        // 跳转页面
      } else this.$store.commit('setLoginModal', true)
    },
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$message.success(this.$t('success.copy'))
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    },
    // 判断文章关联链接是本站还是外站
    currentSite(link) {
      const reg = /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/
      const linkArr = link.match(reg)
      const prot = linkArr && linkArr[3] ? linkArr[3] : ''
      const linkHost = linkArr ? linkArr[1] + '://' + linkArr[2] + prot : ''

      // 地址
      const urlList = {
        development: [
          process.env.VUE_APP_URL,
          process.env.VUE_APP_PC_URL,
          process.env.WX_SHARE_HOST,
          'http://localhost:8080',
          'https://localhost:8080',
          'http://127.0.0.1:8080'
        ],
        production: [
          process.env.VUE_APP_URL,
          process.env.VUE_APP_PC_URL,
          process.env.WX_SHARE_HOST
        ]
      }

      const currentUrlList = urlList[process.env.NODE_ENV]
      return currentUrlList.includes(linkHost)
    },
    // 切换文章
    toggleArticle(url, e, popEvent = false) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      const reg = /\/p\/[\d].*/
      const urlId = url.match(reg)
      const id = urlId ? urlId[0].slice(3) : -1
      const idInt = parseInt(id)
      if (idInt !== -1) this.getArticle(idInt, popEvent)
      else window.open(url)
      return false
    },
    // 切换文章 得到文章信息
    async getArticle(id, popEvent) {
      await this.$API.getArticleInfo(id)
        .then(res => {
          if (res.code === 0) {
            this.article = res.data

            // 切换 url不刷新
            this.$route.params.id = res.data.id
            if (!popEvent) {
              const url = window.location.origin + '/p/' + res.data.id
              history.pushState({}, '', url)
            }
            // 判断是否为付费阅读文章
            if ((res.data.tokens && res.data.tokens.length !== 0) || (res.data.prices && res.data.prices.length > 0)) {
              this.post.content = res.data.short_content
            } else {
              // 切换文章 得到ipfs内容
              this.getIpfsData(res.data.hash)
            }

            // 有写是写在组件内的, 通过props传递的参数判断是否切换文章

            // created
            this.getCurrentProfile(res.data.id)
            // mounted
            this.setAvatar() // 头像
            this.addReadAmount() // 增加阅读量
            this.handleFocus()

            // dom加载完提示 推荐/不推荐
            this.$nextTick(() => {
              this.ssToken = {
                points: [],
                dislikes: 0,
                likes: 0,
                is_liked: 0
              }

              // 清空两个定时器
              clearInterval(this.timerShare)
              this.timerShare = null
              this.timeCountShare = 0

              clearInterval(this.timer)
              this.timer = null
              this.timeCount = 0
              this.shareCount()

              this.loading = this.beingLoading = true
              this.pull.reload = this.beingPull.reload = Date.now()
            })
          } else {
            this.$message.warning(res.message)
          }
          console.log('res', res)
        }).catch(err => {
          console.log('err', err)
        })
    }
  }

}
</script>

<style lang="less" scoped src="./index.less"></style>
