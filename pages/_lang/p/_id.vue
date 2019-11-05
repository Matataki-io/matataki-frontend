<template>
  <div class="main">
    <g-header :popover-visible="visiblePopover.visible2" @popoverVisible="poopverDone('visible2')">
      <template slot="more">
        <el-dropdown v-if="isMe(article.uid)" trigger="click" @command="handleMoreAction">
          <div class="more-icon">
            <svg-icon class="icon" icon-class="more" />
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
      </template>
    </g-header>

    <div class="container">
      <div v-if="cover" class="TitleImage">
        <img :src="cover" alt="cover">
      </div>

      <article class="Post-Header">
        <header>
          <h1 class="Post-Title">
            {{ article.title }}
          </h1>
          <UserInfoHeader
            :article="{
              ...article,
              avatar,
              articleCreateTimeComputed,
            }"
          />
        </header>
        <!-- ipfs -->
        <articleIpfs :is-hide="tokenArticle" :hash="article.hash" />

        <div class="Post-RichText markdown-body article-content" v-html="compiledMarkdown" />
        <ArticleFooter v-if="isTokenArticle" style="margin-top: 20px;" :article="article" />
        <!-- 解锁按钮 -->
        <div v-if="tokenArticle" class="lock">
          <el-divider v-if="!isTokenArticle">
            <i class="el-icon-lock lock-icon" />
          </el-divider>

          <div class="lock-info fl ac jsb">
            <div class="fl ac">
              <img v-if="!isTokenArticle" class="lock-img" src="@/assets/img/lock.png" alt="lock">
              <img v-else class="lock-img" src="@/assets/img/unlock.png" alt="lock">
              <div>
                <h3 class="lock-info-title">
                  {{ !isTokenArticle ? '解锁全文的条件' : '已解锁全文' }}
                  <el-tooltip class="item" effect="dark" content="阅读本文需要先持有特定数量的粉丝币，满足本文的阅读条件后刷新页面即可阅读全文。" placement="top-start">
                    <svg-icon
                      class="help-icon"
                      icon-class="help"
                    />
                  </el-tooltip>
                </h3>

                <p v-if="!isMe(article.uid)" class="lock-info-des">
                  持有{{ needTokenAmount }}枚以上的{{ needTokenSymbol }}粉丝币
                  <!-- 不显示 - 号 -->
                  <span> {{ !isTokenArticle ? '还差' : '目前拥有' }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }}枚{{ needTokenSymbol }}</span>
                </p>
                <p v-else class="lock-info-des">
                  自己发布的文章
                </p>
              </div>
            </div>

            <div>
              <el-button
                v-if="!isTokenArticle"
                plain
                :disabled="payBtnDisabled"
                type="primary"
                size="small"
                @click="wxpay"
              >
                微信支付
              </el-button>
              <router-link
                :to="{name: 'exchange'}"
              >
                <el-button type="primary" size="small">
                  交易所
                </el-button>
              </router-link>
            </div>
          </div>
        </div>
      </article>

      <!-- sidebar -->
      <!-- v-show="navShow" -->
      <div class="sidebar">
        <div v-if="isProduct" class="article-btn" @click="buy">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ $t('p.buyShop') }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? this.$t('p.invested') : this.$t('p.investShop')) : (isSupport ? this.$t('p.invested') : this.$t('p.investArticle')) }}</span>
        </div>

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
          class="article-btn"
          @click="share"
        >
          <el-popover
            v-model="visiblePopover.visible1"
            placement="right"
            width="300"
            trigger="manual"
          >
            <p>{{ $t('p.sharePopover') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button class="el-button--purple" type="primary" size="mini" @click="poopverDone('visible1')">
                {{ $t('p.confirmPopover') }}
              </el-button>
            </div>

            <div
              slot="reference"
            >
              <div
                class="icon-container blue"
                :class="isProduct ? 'yellow' : 'blue'"
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
            <el-button class="el-button--purple" type="primary" size="mini" @click="poopverDone('visible')">
              {{ $t('p.confirmPopover') }}
            </el-button>
          </div>
          <div
            slot="reference"
          >
            <CoinBtn
              v-if="!isProduct"
              style="margin-top: 40px;"
              :time="timeCount"
              :token="ssToken"
              :article="article"
              @like="like"
              @dislike="dislike"
            />
          </div>
        </el-popover>
      </div>
    </div>

    <div class="p-w btns-container">
      <!-- 文章 -->
      <!-- 推荐 不推荐 分享 -->

      <!-- 商品 -->

      <!-- 投资 购买 分享 -->

      <div ref="actionBtns" class="btns">
        <div v-if="isProduct" class="article-btn" @click="share">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="share" class="icon" />
          </div>
          <span> {{ $t('share') }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="buy">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ $t('p.buyShop') }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? this.$t('p.invested') : this.$t('p.investShop')) : (isSupport ? this.$t('p.invested') : this.$t('p.investArticle')) }}</span>
        </div>

        <TokenFooter
          v-if="!isProduct"
          :time="timeCount"
          :token="ssToken"
          :article="article"
          @like="like"
          @dislike="dislike"
        >
          <div class="article-btn" @click="share">
            <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
              <svg-icon icon-class="share" class="icon" />
            </div>
            <span>{{ $t('share') }}</span>
          </div>
        </TokenFooter>
      </div>
      <ArticleInfoFooter v-if="isProduct" class="product" :article="article" />
    </div>
    <div v-if="isShowTags" class="p-w" style="margin-bottom: 20px;">
      <n-link
        v-for="(item, index) in article.tags"
        :key="index"
        style="margin-right: 10px;"
        class="tag-card"
        :to=" {name: 'tag-id', params: {id: item.id}, query: {name: item.name, type: item.type}}"
      >
        {{ item.name }}
      </n-link>
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
    <ShareModal
      v-model="shareModalShow"
      :article="{
        ...article,
        time: articleCreateTimeComputed,
        content: compiledMarkdown,
        avatar
      }"
    />
    <PurchaseModal
      v-model="purchaseModalShow"
      :article="{
        ...article,
        cover
      }"
      @purchaseDone="payDone"
    />
    <article-transfer
      v-model="transferModal"
      :article-id="Number(article.id)"
      from="article"
    />

    <FeedbackModal v-model="feedbackShow" :points="ssToken.points" />
    <OrderModal v-model="showOrderModal" :form="{...form, type: 'buy_token_output', limitValue}" />

    <div class="related left">
      <div class="fl afe jsb">
        <div>
          <span class="related-title">已关联文章<span>6</span></span>
          <span class="related-rort">
            正序
            <svg-icon icon-class="sort" class="icon" />
          </span>
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

      <div v-for="(item, index) in relatedList" :key="index" class="related-list">
        <template v-if="item.edit">
          <el-input
            v-model="item.urlInput"
            class="related-input"
            placeholder="输入链接（可自动检测本站文章）"
          >
            <el-tooltip slot="suffix" effect="dark" content="自动检测" placement="top">
              <img class="auto-test" src="@/assets/img/auto_test.png" alt="auto test">
            </el-tooltip>
          </el-input>
          <el-input
            v-model="item.titleInput"
            type="text"
            class="related-input"
            placeholder="输入标题"
            maxlength="50"
            show-word-limit
          />
          <el-input
            v-model="item.contentInput"
            class="related-input"
            type="textarea"
            placeholder="推荐理由或摘要（选填）"
            maxlength="500"
            show-word-limit
            rows="6"
          />
          <div class="related-add">
            <div class="fl ac">
              <div class="add-icon" @click="remakeRelated(index)">
                <svg-icon icon-class="cancel" />
              </div>
              <span>取消修改</span>
            </div>
            <div class="fl ac" style="margin-left: 20px;">
              <div class="add-icon" @click="confirmRelated(index)">
                <i class="el-icon-plus" />
              </div>
              <span>确认修改</span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="fl jsb">
            <div class="fl ac related-7">
              <div class="related-list-link">
                <a :href="item.url" target="_blank">{{ item.url }}</a>
              </div>
              <a :href="item.url">
                <svg-icon class="related-icon-icon" icon-class="link" />
              </a>
            </div>
            <div class="fl ac jfe related-3">
              <el-tooltip class="related-edit" effect="dark" content="修改" placement="top">
                <svg-icon class="related-icon-icon" icon-class="pencli" @click="item.edit = !item.edit" />
              </el-tooltip>

              <el-tooltip effect="dark" content="删除" placement="top">
                <svg-icon class="related-icon-icon" icon-class="delete" @click="removeRelated(index)" />
              </el-tooltip>
              <span class="related-id">#a1</span>
            </div>
          </div>
          <div class="related-list-title">
            {{ item.title }}
          </div>
          <div :class="!item.collapse && 'open'">
            <div class="related-list-content">
              {{ item.content }}
            </div>
            <div v-if="item.showCollapse" class="related-more">
              <span @click="item.collapse = !item.collapse">
                {{ item.collapse ? '折叠': '展开' }}
                <i class="el-icon-arrow-up arrow-up" /></span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="related right">
      <div class="fl afe jsb">
        <div>
          <span class="related-title">被关联次数<span>6</span></span>
          <span class="related-rort">
            正序
            <svg-icon icon-class="sort" class="icon" />
          </span>
        </div>
        <el-button type="primary" size="small" icon="el-icon-link">
          关联本文
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Cookies from 'js-cookie'
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { xssFilter } from '@/utils/xss'
import 'mavon-editor-matataki/dist/css/index.css'
import 'mavon-editor-matataki/dist/markdown/github-markdown.min.css'
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
import FeedbackModal from '@/components/article/Feedback'
import commentInput from '@/components/article_comment'
import { ipfsData } from '@/api/async_data_api.js'
import { extractChar } from '@/utils/reg'
import { precision } from '@/utils/precisionConversion'
import store from '@/utils/localStorage.js'
import OrderModal from '@/components/exchange/OrderModal'
import { CNY } from '@/components/exchange/consts.js'
import utils from '@/utils/utils'

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
    FeedbackModal,
    commentInput,
    OrderModal
  },
  data() {
    return {
      avatar: null,
      followed: false,
      investModalShow: false,
      shareModalShow: false,
      transferModal: false,
      purchaseModalShow: false,
      oldOffSetTop: 0,
      navShow: true,
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
      feedbackShow: false,
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
      relatedSummary: false, // 关联摘要
      relatedLink: '',
      relatedTitle: '',
      relatedContent: '',
      relatedList: [
        {
          url: 'http://localhost:8080/publish/draft/create',
          urlInput: 'http://localhost:8080/publish/draft/create',
          title: '1区块链文娱产品形态猜想：文化概念的区块链化',
          titleInput: '1区块链文娱产品形态猜想：文化概念的区块链化',
          content: '解决了区块链有具有商商业前品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          contentInput: '解决了区块链有具有商商业前品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          collapse: false,
          showCollapse: true,
          edit: false
        },
        {
          url: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
          urlInput: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
          title: '2区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
          titleInput: '2区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
          content: '解决了区块链改造文娱行业的历史合有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          contentInput: '解决了区块链改造文娱行业的历史合有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          collapse: false,
          showCollapse: true,
          edit: false
        },
        {
          url: 'http://localhost:8080/publish/draft/create',
          urlInput: 'http://localhost:8080/publish/draft/create',
          title: '3区块链文娱产品形态猜想：文化概念的区块链化',
          titleInput: '3区块链文娱产品形态猜想：文化概念的区块链化',
          content: '设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          contentInput: '设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          collapse: false,
          showCollapse: true,
          edit: false
        },
        {
          url: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
          urlInput: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
          title: '4区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
          titleInput: '4区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
          content: '解决了区块链改造文娱——有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          contentInput: '解决了区块链改造文娱——有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          collapse: false,
          showCollapse: true,
          edit: false
        },
        {
          url: 'http://localhost:8080/publish/draft/create',
          urlInput: 'http://localhost:8080/publish/draft/create',
          title: '5区块链文娱产品形态猜想：文化概念的区块链化',
          titleInput: '5区块链文娱产品形态猜想：文化概念的区块链化',
          content: '',
          contentInput: '',
          collapse: false,
          showCollapse: true,
          edit: false
        },
        {
          url: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
          urlInput: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
          title: '6块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
          titleInput: '6块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
          content: '解决了区块链改造文娱行业的历的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          contentInput: '解决了区块链改造文娱行业的历的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
          collapse: false,
          showCollapse: true,
          edit: false
        }
      ]
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
    articleCreateTimeComputed() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    compiledMarkdown() {
      return markdownIt.render(xssFilter(this.post.content))
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
    tokenArticle() {
    // 是否为付费文章
      return this.article.tokens.length !== 0
    },
    isTokenArticle() {
      // 付费文章
      if (this.article.tokens.length !== 0) {
        if (this.showLock) return true
        else return false
      } else { // 不付费
        return true
      }
    },
    // 需要多少粉丝币
    needTokenAmount() {
      if (this.article.tokens.length !== 0) {
        return precision(this.article.tokens[0].amount, 'CNY', this.article.tokens[0].decimals)
      } else return 0
    },
    // 需要多少粉丝币名称
    needTokenSymbol() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    },
    limitValue() {
      const { input } = this.form
      return (parseFloat(input) / (1 - 0.01)).toFixed(4)
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
    if (info.data.tokens && info.data.tokens.length !== 0) {
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

  created() {
    this.getCurrentProfile()
  },
  mounted() {
    this.setAvatar()
    this.oldOffSetTop = this.$refs.actionBtns.offsetTop
    this.addReadAmount()
    window.addEventListener('scroll', this.handleScroll)
    this.handleFocus()
    // if (!document.hidden) {
    //   this.reading()
    // }

    // dom加载完提示 推荐/不推荐
    this.$nextTick(() => {
      // undefined false 显示
      if (!store.get('likeVisible')) this.visiblePopover.visible = true
      this.shareCount()
    })

    this.renderRelatedListContent()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.timer)
    clearInterval(this.timerShare)
  },
  methods: {
    // 增加文章阅读量
    async addReadAmount() {
      await this.$API.addReadAmount({ articlehash: this.article.hash }).catch(err => console.log('add read amount error', err))
    },
    // 获取用户在当前文章的属性
    async getCurrentProfile() {
      const data = {
        id: this.$route.params.id
      }

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

      this.showLockFunc(this.differenceToken)
    },
    // 是否显示 Lock
    showLockFunc(differenceToken) {
      if (Number(differenceToken) < 0) {
        if (this.isMe(this.article.uid)) { // 自己的文章
          this.showLock = true
          this.getIfpsData()
        } else this.showLock = false
      } else {
        this.showLock = true
        this.getIfpsData()
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
    async getIfpsData() {
      await this.$API.getIfpsData(this.article.hash)
        .then(res => {
          if (res.code === 0) {
            this.post.content = res.data.content
          } else {
            console.log(res.message)
          }
        })
    },
    async getArticleInfoFunc() {
      await this.$API.getArticleInfo(this.$route.params.id)
        .then(res => {
          if (res.code === 0) this.article = res.data
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
    handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.body.clientHeight
      scrollTop + clientHeight - 100 > this.oldOffSetTop ? (this.navShow = false) : (this.navShow = true)
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
    async setAvatar() {
      await this.$API.getUser({ id: this.article.uid }).then((res) => {
        if (res.code === 0) {
          const data = res.data
          this.followed = data.is_follow
          if (data.avatar) this.avatar = this.$API.getImg(data.avatar)
        }
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
    wxpay() {
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
        this.form.output = utils.fromDecimal(needTokenAmount - amount)
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
          if (ele.clientHeight < 80) this.relatedList[i].showCollapse = false
          else this.relatedList[i].showCollapse = true
        } else {
          const relatedList = document.querySelectorAll('.related-list-content')
          relatedList.forEach((ele, i) => {
            if (ele.clientHeight < 80) this.relatedList[i].showCollapse = false
            else this.relatedList[i].showCollapse = true
          })
        }
      })
    },
    // 取消关联编辑
    remakeRelated(i) {
      this.relatedList[i].urlInput = this.relatedList[i].url
      this.relatedList[i].titleInput = this.relatedList[i].title
      this.relatedList[i].contentInput = this.relatedList[i].content
      this.relatedList[i].edit = false
    },
    // 确定管理编辑
    confirmRelated(i) {
      this.relatedList[i].url = this.relatedList[i].urlInput
      this.relatedList[i].title = this.relatedList[i].titleInput
      this.relatedList[i].content = this.relatedList[i].contentInput
      this.relatedList[i].edit = false
      this.renderRelatedListContent(i)
    },
    // 删除关联
    removeRelated(i) {
      // 提交数据等判断
      this.relatedList.splice(i, 1)
    }
  }

}
</script>

<style lang="less" scoped src="./index.less"></style>
