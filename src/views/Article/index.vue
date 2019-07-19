/* eslint-disable no-shadow */
<template>
  <div class="article" @click.stop="opr = false">
    <BaseHeader
      :pageinfo="{ title: article.channel_id === 2 ? '商品详情' : '文章详情' }"
      :show-logo="'true'"
    >
      <div v-if="isMe(article.uid)" slot="right" class="more" @click.stop="opr = !opr">
        <img src="@/assets/more.svg" alt="more" />
        <transition name="fade" mode="out-in">
          <div v-show="opr" class="dropdown">
            <div
              class="dropdown-item"
              @click="
                $router.push({
                  name: 'Publish',
                  params: { id: article.id },
                  query: { from: 'edit', hash: article.hash }
                })
              "
            >
              编辑
            </div>
            <div class="dropdown-item" @click="transferModal = true">转让</div>
            <div class="dropdown-item" @click="delArticleButton">删除</div>
          </div>
        </transition>
      </div>
      <div slot="info" class="information" @click="infoModa = true">
        <img src="@/assets/newimg/gonglue_innovationbar.svg" alt="information" />
        <span>攻略</span>
      </div>
    </BaseHeader>

    <ContentLoader v-if="articleLoading" class="content-loader" :height="300">
      <circle cx="36" cy="24" r="12" />
      <rect x="54" y="14" rx="0" ry="0" width="64" height="10" />
      <rect x="54" y="26" rx="0" ry="0" width="30" height="8" />
      <rect x="27" y="46" rx="0" ry="0" width="334" height="240" />
    </ContentLoader>
    <template v-else>
      <img v-if="cover" v-lazy="cover" :src="cover" alt="" class="top-image" />
      <header class="ta_header">
        <h1>{{ article.title }}</h1>
        <div class="userinfo-container">
          <div class="avatar-info">
            <div
              class="avatar"
              @click="() => $router.push({ name: 'User', params: { id: article.uid } })"
            >
              <img :src="articleAvatar" class="avatar-size" alt="avatar" :onerror="defaultAvatar" />
            </div>
            <div class="avatar-right">
              <p
                class="author"
                @click="() => $router.push({ name: 'User', params: { id: article.uid } })"
              >
                {{ article.nickname || article.author }}
              </p>
              <p class="other">
                发布于
                {{ articleCreateTimeComputed }}
                <svg-icon icon-class="view" class="avatar-read" />
                {{ article.read || 0 }}阅读
              </p>
            </div>
          </div>
          <template v-if="!isMe(article.uid)">
            <template v-if="!followed">
              <div class="follow-btn" @click="followOrUnfollowUser({ id: article.uid, type: 1 })">
                <van-icon name="plus" /> 关注
              </div>
            </template>
            <template v-else>
              <span class="follow-btn" @click="followOrUnfollowUser({ id: article.uid, type: 0 })"
                >取消关注</span
              >
            </template>
          </template>
        </div>
      </header>
      <mavon-editor v-show="false" style="display: none;" />
      <div class="markdown-body" v-html="compiledMarkdown"></div>

      <div class="ipfs-hash">
        <img
          src="@/assets/img/icon_copy.svg"
          class="copy-hash"
          alt="hash"
          @click="copyText(getCopyIpfsHash)"
        />
        <span>IPFS Hash: {{ article.hash || 'Loading...' }}</span>
      </div>

      <div class="decoration">
        <a
          data-pocket-label="pocket"
          data-pocket-count="horizontal"
          class="pocket-btn"
          data-lang="en"
        ></a>
        <span class="is-original">
          本文发布于智能签名<br />
          <template v-if="isOriginal">
            未经授权禁止转载
          </template>
        </span>
      </div>
      <!-- don't tag hide -->
      <div v-if="article.tags !== undefined && article.tags.length !== 0" class="tag-review">
        <tag-card
          v-for="(item, index) in article.tags"
          :key="index"
          :tag-card="item"
          :tag-mode="false"
        />
      </div>
    </template>
    <router-link :to="{ name: 'BuyHistory' }">
      <div v-if="article.is_buy" class="buy-alert">已购买成功，请前往“购买记录”页面查看！</div>
    </router-link>

    <div class="comments-list">
      <h1 class="comment-title">
        {{ article.channel_id === 2 ? '支持队列' : '投资队列' }}
        {{ article.ups || 0 }}
      </h1>
      <!--<div class="commentslist-title">
        <span>投资队列 {{article.ups || 0}}</span>
      </div>-->
      <!--<div class="product" v-if="article.product">
        <div class="product-list" v-for="(item, index) in article.product" :key="index">
          <span>《{{item.title}}》&#45;&#45;key: {{item.digital_copy}}</span>
          <img
            src="@/assets/img/icon_copy.svg"
            class="copy-product-info"
            alt="hash"
            @click="copyText('《' + item.title + '》&#45;&#45;key:'+ item.digital_copy)">
        </div>
      </div>-->
      <CommentsList
        class="comments"
        :sign-id="signId"
        :is-request="isRequest"
        :type="article.channel_id"
        @stopAutoRequest="status => (isRequest = status)"
      />
    </div>

    <footer class="footer">
      <div class="footer-block footer-info">
        <div class="amount">
          <Dropdown trigger="click" @on-click="toggleAmount">
            <div>
              <div
                :class="totalSupportedAmount.showName === 'eos' ? 'eos' : 'ont'"
                class="amount-img"
              ></div>
              <span class="footer-number" :class="{ 'text-yellow': article.channel_id === 2 }">{{
                totalSupportedAmount.show
              }}</span
              >&nbsp;
              <Icon type="ios-arrow-up" />
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="eos" class="amount-icon">
                <img src="@/assets/img/icon_eos_article.svg" alt="eos" />
                {{ totalSupportedAmount.eos }}
              </DropdownItem>
              <DropdownItem name="ont" class="amount-icon">
                <img src="@/assets/img/icon_ont_article.svg" alt="ont" />
                {{ totalSupportedAmount.ont }}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div class="amount-text">
            {{ article.channel_id === 2 ? '总收益' : '投资总额' }}
          </div>
        </div>
        <div v-if="article.channel_id !== 2" class="fission">
          <div>
            <div class="amount-img fission"></div>
            <span class="footer-number">{{ getDisplayedFissionFactor }}</span>
          </div>
          <div class="amount-text">裂变系数</div>
        </div>
      </div>
      <div v-if="article.channel_id === 2" class="footer-block footer-btn">
        <button
          v-if="isSupported === -1"
          class="button-support bg-yellow border-yellow"
          @click="b4support"
        >
          投资<img src="@/assets/newimg/touzi.svg" />
        </button>
        <button v-if="isSupported === 0" class="button-support bg-yellow border-yellow" disabled>
          投资中
        </button>
        <button
          v-else-if="isSupported === 1"
          class="button-support bg-yellow border-yellow"
          @click="invest"
        >
          投资<img src="@/assets/newimg/touzi.svg" />
        </button>
        <button
          v-else-if="isSupported === 2"
          class="button-support bg-yellow border-yellow"
          disabled
        >
          已投资
        </button>

        <button
          v-if="isSupported === -1"
          class="button-support bg-yellow border-yellow"
          @click="b4support"
        >
          购买<img src="@/assets/newimg/goumai.svg" />
        </button>
        <button
          v-else-if="isSupported === 0"
          class="button-support bg-yellow border-yellow"
          disabled
        >
          购买中<img src="@/assets/newimg/goumai.svg" />
        </button>
        <button
          v-else
          class="button-support bg-yellow border-yellow"
          :disabled="product.stock === 0"
          @click="buyButton"
        >
          {{ product.stock === 0 ? '售罄' : '购买' }}<img src="@/assets/newimg/goumai.svg" />
        </button>
        <button class="button-share border-yellow text-yellow" @click="widgetModal = true">
          分享<img src="@/assets/newimg/share2.svg" />
        </button>
      </div>
      <div v-else class="footer-block footer-btn">
        <button v-if="isSupported === -1" class="button-support" @click="b4support">
          投资<img src="@/assets/newimg/touzi.svg" />
        </button>
        <button v-if="isSupported === 0" class="button-support" disabled>
          投资中
        </button>
        <button v-else-if="isSupported === 1" class="button-support" @click="invest">
          投资<img src="@/assets/newimg/touzi.svg" />
        </button>
        <button v-else-if="isSupported === 2" class="button-support" disabled>
          已投资
        </button>
        <button class="button-share" @click="widgetModal = true">
          分享<img src="@/assets/newimg/share.svg" />
        </button>
      </div>
    </footer>

    <van-dialog
      v-model="supportModal"
      title="投资"
      show-cancel-button
      class="ffff"
      :before-close="support"
      :close-on-click-overlay="true"
      @cancel="supportModal = false"
    >
      <van-field v-model="comment" type="textarea" placeholder="输入推荐语…" rows="4" autosize />
      <van-field v-model="amount" :placeholder="displayPlaceholder" @input="handleChange(amount)" />
    </van-dialog>

    <van-popup v-model="buyProductModal" class="buy-product-modal">
      <h1 class="title">购买商品</h1>
      <div class="info-container">
        <img :src="cover" alt="cover" class="cover" />
        <div class="info-inner">
          <div class="product-price">
            <span class="ont-price">
              <img src="@/assets/newimg/ont2.svg" alt="ont" />
              <span>{{ product.ontPrice }}</span>
            </span>
            <span class="eos-price">
              <img src="@/assets/newimg/eos2.svg" alt="eos" />
              <span>{{ product.eosPrice }}</span>
            </span>
          </div>
          <div class="product-amount">
            <span>数量</span>
            <van-stepper v-model="productNumber" disabled />
          </div>
        </div>
      </div>
      <van-field
        v-model="comment"
        type="textarea"
        placeholder="输入推荐语…"
        rows="4"
        autosize
        class="comment-container"
      />
      <div class="buy-container">
        <span class="storage">库存还有剩{{ product.stock }}份</span>
        <div class="buy-btn" @click="buyProduct">购买</div>
      </div>
    </van-popup>

    <van-popup v-model="investProductModal" class="buy-product-modal">
      <h1 class="title">{{ investTitle }}</h1>
      <div class="invest-info">
        <div class="info-item">
          <span class="info-number">{{ getDisplayedFissionFactor }}</span>
          <span class="info-subtitle">裂变系数</span>
        </div>
        <div class="info-item">
          <span class="info-number percent">{{ article.fission_rate }}</span>
          <span class="info-subtitle">裂变返利</span>
        </div>
        <div class="info-item">
          <span class="info-number percent">{{ article.referral_rate }}</span>
          <span class="info-subtitle">推荐返利</span>
        </div>
      </div>
      <van-field
        v-model="amount"
        :placeholder="displayPlaceholder"
        class="comment-container"
        @input="handleChange(amount)"
      />
      <van-field
        v-model="comment"
        type="textarea"
        placeholder="请输入您的留言"
        rows="4"
        autosize
        class="comment-container"
      />
      <div class="invest-container">
        <div class="invest-btn" @click="investProduct">投资</div>
      </div>
    </van-popup>

    <van-popup v-model="buySuccessModal" class="buy-product-modal">
      <h1 class="title">购买成功！</h1>
      <p class="tip">请去“购买记录”页面查看已购商品！</p>
      <div class="invest-container">
        <router-link :to="{ name: 'BuyHistory' }">
          <div class="invest-btn">查看</div>
        </router-link>
      </div>
    </van-popup>

    <!-- 文章 Info -->
    <ArticleInfo
      :info-moda="infoModa"
      :channel="article.channel_id"
      @changeInfo="status => (infoModa = status)"
    />
    <BaseModalForSignIn :show-modal="showModal" @changeInfo="changeInfo" />
    <Widget
      :id="article.id"
      :widget-modal="widgetModal"
      :get-clipboard="getClipboard"
      :invite="currentUserInfo.id"
      :share-info="{
        title: article.title,
        avatar: articleAvatar,
        name: article.nickname || article.author,
        time: articleCreateTimeComputed,
        content: compiledMarkdown,
        shareLink: getShareLink
      }"
      @changeWidgetModal="status => (widgetModal = status)"
    />
    <article-transfer
      :transfer-modal="transferModal"
      :article-id="article.id"
      :from="'article'"
      @changeTransferModal="status => (transferModal = status)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
import { ContentLoader } from 'vue-content-loader'
import { xssFilter } from '@/common/xss'
import { sleep, isNDaysAgo } from '@/common/methods'
import { ontAddressVerify } from '@/common/reg'
import { precision } from '@/common/precisionConversion'

import CommentsList from './CommentsList.vue'
import ArticleInfo from './ArticleInfo.vue'
import Widget from './Widget'
import articleTransfer from '@/components/articleTransfer'
import tagCard from '@/components/tagCard/index'

// MarkdownIt 实例
const markdownIt = mavonEditor.getMarkdownIt()

const RewardStatus = {
  // 0=加载中,1=未打赏 2=已打赏, -1未登录
  NOT_LOGGINED: -1,
  LOADING: 0,
  NOT_REWARD_YET: 1,
  REWARDED: 2
}

export default {
  name: 'Article',
  components: {
    CommentsList,
    ArticleInfo,
    ContentLoader,
    mavonEditor,
    Widget,
    tagCard,
    articleTransfer
  },
  props: ['hash'],
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      investTitle: '投资文章',
      followed: false,
      productNumber: 1,
      buySuccessModal: false,
      investProductModal: false,
      buyProductModal: false,
      post: {
        author: '',
        title: '',
        content: ''
      },
      article: {
        author: '',
        createTime: '',
        fission_factor: 0,
        id: null
      },
      articleAvatar: '',
      amount: '',
      comment: '',
      totalSupportedAmount: {
        show: 0, // 用于默认数据显示
        showName: 'eos', // 用于默认数据显示
        eos: 0,
        ont: 0
      },
      product: {
        eosPrice: 0,
        ontPrice: 0,
        stock: 0
      },
      showModal: false,
      supportModal: false,
      opr: false,
      infoModa: false,
      isRequest: false,
      articleLoading: true, // 文章加载状态
      isOriginal: false,
      widgetModal: false, // 分享 widget dialog
      transferModal: false // 转让
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    cover() {
      if (this.article.cover) return this.$backendAPI.getAvatarImage(this.article.cover)
      return null
    },
    displayPlaceholder() {
      return `请输入 ${this.currentUserInfo.idProvider} 投资金额`
    },
    compiledMarkdown() {
      return markdownIt.render(xssFilter(this.post.content))
    },
    getClipboard() {
      const { article, currentUserInfo } = this
      const { protocol, host } = window.location
      // console.debug(this.article);
      const articleUrl = `${protocol}//${host}/article/${article.id}`
      const shareLink = this.isLogined ? `${articleUrl}?invite=${currentUserInfo.id}` : articleUrl
      return `《${article.title}》by ${article.username} \n${shareLink}\n投资好文，分享有收益 ！`
    },
    getShareLink() {
      const { article, currentUserInfo } = this
      const { protocol, host } = window.location
      // console.debug(this.article);
      const articleUrl = `${protocol}//${host}/article/${article.id}`
      const shareLink = this.isLogined ? `${articleUrl}?invite=${currentUserInfo.id}` : articleUrl
      return shareLink
    },
    getCopyIpfsHash() {
      return `${this.article.hash}`
    },
    getDisplayedFissionFactor() {
      return this.article.fission_factor / 1000
    },
    getUrl() {
      const { article } = this
      const { protocol, host } = window.location
      return `${protocol}//${host}/article/${article.id}`
    },
    getInvite() {
      const { invite } = this.$route.query
      return invite ? invite : null
    },
    // 这里发现有问题 应该是下面直接设置了属性报错 后续需要修改
    // errorinfo - vue.js:634 [Vue warn]: Computed property "isSupported" was assigned to but it has no setter.
    isSupported() {
      const { article, isLogined } = this
      let isSupported = false
      if (isLogined)
        isSupported = article.is_support ? RewardStatus.REWARDED : RewardStatus.NOT_REWARD_YET
      else isSupported = RewardStatus.NOT_LOGGINED
      return isSupported
    },
    signId() {
      return this.article.id
    },
    articleCreateTimeComputed() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  },
  watch: {
    article() {
      this.$emit('updateHead')
    },
    post() {
      this.$emit('updateHead')
    },
    isLogined(newState) {
      if (newState) this.getArticleInfo(this.hash, false)
    },
    isRequest(newVal) {
      // 监听是否请求默认为false被改变为true下面不执行，请求完毕又被改变为false执行下列方法
      if (!newVal) {
        this.getArticleInfo(this.hash)
      }
    }
  },
  created() {
    document.title = '正在加载文章 - Smart Signature'
    this.getArticleInfo(this.hash) // 得到文章信息
  },
  head: {
    title() {
      const { post } = this
      return {
        inner: `${post.title} by ${post.author}`,
        separator: '-',
        complement: 'Smart Signature'
      }
    },
    // Meta tags // 做ssr 再使用
    // meta() {
    // const { article, getUrl, post } = this;
    // return [
    // Open Graph
    // { p: 'og:url', c: getUrl },
    // { p: 'og:site_name', c: 'Smart Signature' },
    // { p: 'og:type', c: 'article' },
    // { p: 'og:title', c: post.title },
    // { p: 'og:description', c: post.desc },
    // { p: 'article:author', c: post.author },
    // { p: 'article:published_time', c: article.create_time },
    // { p: 'og:image', c: 'https://example.com/image.jpg' },
    //  Twitter
    // { n: 'twitter:card', c: post.desc },
    // { n: 'twitter:site', c: '@Smart Signature' },
    // { n: 'twitter:creator', c: '@article' }, // @username for the content creator / author.
    // 未來支持推特連接後， 可以顯示其推特帳號在推特 card 預覽裡
    // ];
    // },
    script() {
      return [
        {
          type: 'text/javascript',
          id: 'pocket-btn-js', // id 不知道作用 生成的 script 有id就带着好了
          src: 'https://widgets.getpocket.com/v1/j/btn.js?v=1'
        },
        {
          type: 'text/javascript',
          src: '//cdn.embedly.com/widgets/platform.js'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['makeShare', 'makeOrder']),
    changeInfo(status) {
      this.showModal = status
    },
    // 复制hash
    copyText(getCopyIpfsHash) {
      this.$copyText(getCopyIpfsHash).then(
        () => {
          this.$toast.success({ duration: 1000, message: '复制成功' })
        },
        () => {
          this.$toast.fail({ duration: 1000, message: '复制失败' })
        }
      )
    },
    // 得到文章信息 hash id, supportDialog 为 true 则只更新文章信息
    async getArticleInfo(hash, supportDialog = false) {
      await this.$backendAPI
        .getArticleInfo(hash)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.setArticle(res.data.data, supportDialog)
            // 默认会执行获取文章方法，更新文章调用则不需要获取内容
            if (!supportDialog) {
              this.getArticleDatafromIPFS(res.data.data.hash)
              this.setAvatar(res.data.data.uid)
            }
          } else {
            this.$toast({ duration: 1000, message: res.data.message })
          }
        })
        .catch(err => {
          console.error(err)
          this.$toast({ duration: 1000, message: '获取文章信息失败' })
        })
    },
    // 获取文章内容 from ipfs
    async getArticleDatafromIPFS(hash) {
      await this.$backendAPI
        .getArticleDatafromIPFS(hash)
        .then(({ data }) => {
          // console.log(data);
          this.setPost(data.data)
        })
        .catch(err => {
          console.error(err)
          this.$Message.error('获取文章内容失败请重试')
        })
    },
    // 设置文章
    async setArticle(article, supportDialog = false) {
      try {
        await this.$backendAPI.addReadAmount({ articlehash: article.hash }) // 增加文章阅读量
      } catch (error) {
        console.error('addReadAmount :', error)
      }
      this.article = article
      if (article.channel_id === 2) {
        this.product = {
          eosPrice: article.prices[0].price / 10 ** article.prices[0].decimals,
          ontPrice: article.prices[1].price / 10 ** article.prices[1].decimals,
          stock: article.prices[0].stock_quantity
        }
      }
      this.article.CreateTime = article.create_time
      this.totalSupportedAmount.show = article.value ? precision(article.value, 'eos') : 0 // 用于默认显示
      this.totalSupportedAmount.eos = article.value ? precision(article.value, 'eos') : 0 // eos
      this.totalSupportedAmount.ont = precision(article.ontvalue, 'ont') // ont

      this.articleLoading = false // 文章加载状态隐藏
      this.isOriginal = Boolean(article.is_original)
      // 未登录下点击投资会自动登陆并且重新获取文章信息 如果没有打赏并且是点击投资 则显示投资框
      if (!article.is_support && supportDialog) {
        this.supportModal = true
      }
    },
    // 设置文章内容
    setPost(post) {
      this.post = post
      this.articleLoading = false // 文章加载状态隐藏
    },
    handleChange(amount) {
      let amountValue = amount
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'EOS') {
        // 小数点后三位 如果后面需要解除限制修改正则  {0,3}
        amountValue = amountValue.match(/^\d*(\.?\d{0,3})/g)[0] || null
      } else if (idProvider === 'ONT') {
        amountValue = amountValue.match(/^\d*/g)[0] || null
      }
      this.amount = amountValue
    },
    b4support() {
      if (!this.isLogined) {
        this.showModal = true
      }
    },
    // 根据 idProvider 查询商品数据
    findBlockchain(articlePrices, idProvider) {
      const findBlockchain = (arr, symbol) => arr.filter(i => i.symbol === symbol)
      return findBlockchain(articlePrices, idProvider)
    },
    // 购买按钮
    buyButton() {
      const { currentUserInfo, findBlockchain, article } = this
      const { idProvider } = currentUserInfo
      const filterBlockchain = findBlockchain(article.prices, idProvider)
      const { stock_quantity: stockQuantity } = filterBlockchain[0]
      if (stockQuantity <= 0) {
        return this.$toast({ duration: 1000, message: '库存不足' })
      }
      this.buyProductModal = true
    },
    // 投资按钮
    async invest() {
      if (this.currentUserInfo.idProvider === 'GitHub')
        return this.$toast({ duration: 1000, message: 'Github账号暂不支持投资功能' })
      // 如果是商品 判断库存是否充足
      if (this.article.channel_id === 2) {
        const { currentUserInfo, findBlockchain, article } = this
        const { idProvider } = currentUserInfo
        const filterBlockchain = findBlockchain(article.prices, idProvider)
        const { stock_quantity: stockQuantity } = filterBlockchain[0]
        if (stockQuantity <= 0) {
          return this.$toast({ duration: 1000, message: '库存不足' })
        }
        this.investTitle = '投资商品'
      } else {
        this.investTitle = '投资文章'
      }
      this.investProductModal = true
    },
    async buyProduct() {
      const loading = this.$toast.loading({
        mask: true,
        duration: 0,
        message: '购买中...'
      })
      const { comment, signId, product } = this
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'GitHub') return
      const num = this.productNumber
      const amount =
        idProvider === 'ONT'
          ? num * product.ontPrice
          : idProvider === 'EOS'
          ? num * product.eosPrice
          : 0
      const toSponsor = async idOrName => {
        if (!idOrName) return { id: null, username: null }
        if (/^(0|[1-9][0-9]*)$/.test(idOrName)) {
          try {
            const id = idOrName
            const { status, data } = await this.$backendAPI.getUser({ id })
            if (status === 200 && data.code === 0) return { id, username: data.data.username }
          } catch (error) {
            console.error(error)
          }
        }
        return { id: null, username: idOrName }
      }
      this.isSupported = RewardStatus.LOADING
      let sponsor = await toSponsor(this.getInvite)
      await this.makeOrder({ amount, num, signId, sponsor, comment })
      /*try {
        // 發 comment 到後端
        console.log("Send comment...");
        const response = await sendComment({ comment, signId });
        console.log(response);
        if (response.status !== 200) throw new Error(error);
      } catch (error) {
        console.error(error);
        console.log("Resend comment...");
        const response = await sendComment({ comment, signId });
        console.log(response);
        if (response.status !== 200) throw new Error(error);
      }*/
      loading.clear()
      this.isSupported = RewardStatus.NOT_REWARD_YET
      this.isRequest = true
      this.buyProductModal = false
      this.buySuccessModal = true
    },
    async investProduct() {
      this.support('confirm', () => {
        this.investProductModal = false
      })
    },
    async support(action, done) {
      if (action !== 'confirm') return done()
      let action_text = this.article.channel_id === 2 ? '投资' : '投资'
      const loading = this.$toast.loading({
        mask: true,
        duration: 0,
        message: `${action_text}中...`
      })
      const { article, comment, signId } = this
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'GitHub') return
      // 默认 ‘’ 转成了 NAN
      const amount = this.amount === '' ? 0 : parseFloat(this.amount)
      // 检查金额是否符合
      let checkPricesMatch = true

      // 检查价格
      const checkPrices = (prices, range, message) => {
        if (prices < range) {
          loading.clear()
          this.$toast({ duration: 1000, message })
          return false
        }
        return true
      }
      // 文章投资金额
      const minimumAmount = idProvider => {
        if (idProvider === 'EOS') return 0.01
        if (idProvider === 'ONT') return 1
      }
      checkPricesMatch = checkPrices(
        amount,
        minimumAmount(idProvider),
        `请输入正确的金额 最小${action_text}金额为 ${minimumAmount(idProvider)} ${idProvider}`
      )
      if (!checkPricesMatch) return done(false)

      // 检查商品价格
      const checkCommodityPrices = () => {
        const filterBlockchain = this.findBlockchain(article.prices, idProvider)
        if (filterBlockchain.length !== 0) {
          const { symbol, price, decimals } = filterBlockchain[0]
          // exponentiation operator (**)
          if (symbol === 'EOS')
            checkPricesMatch = checkPrices(
              amount,
              price / 10 ** decimals,
              `${action_text}金额不能小于商品价格`
            )
          else if (symbol === 'ONT')
            checkPricesMatch = checkPrices(
              amount,
              price / 10 ** decimals,
              `${action_text}金额不能小于商品价格`
            )
        }
      }

      // 文章是商品判断价格
      // if (article.channel_id === 2) checkCommodityPrices();
      if (!checkPricesMatch) return done(false)

      const toSponsor = async idOrName => {
        if (!idOrName) return { id: null, username: null }
        if (/^(0|[1-9][0-9]*)$/.test(idOrName)) {
          try {
            const id = idOrName
            const { status, data } = await this.$backendAPI.getUser({ id })
            if (status === 200 && data.code === 0) return { id, username: data.data.username }
          } catch (error) {
            console.error(error)
          }
        }
        return { id: null, username: idOrName }
      }

      let sponsor = await toSponsor(this.getInvite)
      try {
        this.isSupported = RewardStatus.LOADING

        // 如果是ONT true 如果是 EOS或者其他 false
        const isOntAddressVerify = ontAddressVerify(sponsor.username)
        // 如果是EOS账户投资 但是邀请人是ONT用户 则认为没有邀请
        if (idProvider === 'EOS' && isOntAddressVerify) sponsor = { id: null, username: null }
        // 如果是ONT账户投资 但是邀请人EOS账户 则认为没有邀请
        else if (idProvider === 'ONT' && !isOntAddressVerify) sponsor = { id: null, username: null }

        await this.makeShare({ amount, signId, sponsor, comment })
        // if ( this.article.channel_id === 2 ) await this.makeOrder({ amount, signId, sponsor });

        // try {
        //   // 發 comment 到後端
        //   console.log("Send comment...");
        //   const response = await sendComment({ comment, signId });
        //   console.log(response);
        //   if (response.status !== 200) throw new Error(error);
        // } catch (error) {
        //   console.error(error);
        //   console.log("Resend comment...");
        //   const response = await sendComment({ comment, signId });
        //   console.log(response);
        //   if (response.status !== 200) throw new Error(error);
        // }
        this.isSupported = RewardStatus.REWARDED // 按钮状态
        this.$toast.success({ duration: 1000, message: `${action_text}成功！` })
        this.isRequest = true // 自动请求
        this.supportModal = false // 关闭dialog
        loading.clear()
        done()
      } catch (error) {
        loading.clear()
        console.error(error)
        this.isSupported = RewardStatus.NOT_REWARD_YET
        this.$toast({
          duration: 1000,
          message: `${action_text}失败，可能是由于网络故障或账户余额不足等原因。`
        })
        done(false)
      }
    },
    // 删除文章
    delArticleButton() {
      const jumpTo = name => this.$router.push({ name })
      const delSuccess = async () => {
        this.$Modal.remove()
        this.$toast({ duration: 2000, message: '删除成功,三秒后自动跳转到首页' })
        await sleep(3000)
        jumpTo('home')
      }
      const fail = err => {
        this.$Modal.remove()
        this.$toast({ duration: 1000, message: '删除失败' })
        console.log('error', err)
      }
      const delArticleFunc = async id => {
        if (!id) return fail('没有id')
        try {
          const response = await this.$backendAPI.delArticle({ id })
          if (response.status === 200 && response.data.code === 0) delSuccess()
          else fail(`删除文章错误${error}`)
        } catch (error) {
          return fail(error)
        }
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>该文章已上传至 IPFS 永久保存, 本次操作仅删除智能签名中的显示。</p>',
        loading: true,
        onOk: () => {
          delArticleFunc(this.article.id)
        }
      })
    },
    // 获取用户 得到头像
    async setAvatar(id) {
      try {
        const res = await this.$backendAPI.getUser({ id })
        if (res.status === 200 && res.data.code === 0) {
          this.followed = res.data.data.is_follow
          if (res.data.data.avatar)
            this.articleAvatar = this.$backendAPI.getAvatarImage(res.data.data.avatar)
        } else console.log('获取用户信息错误')
      } catch (error) {
        console.log(`获取用户信息错误${error}`)
      }
    },
    // 切换投资总额显示
    toggleAmount(name) {
      if (name === 'eos') {
        this.totalSupportedAmount.show = this.totalSupportedAmount.eos
      } else if (name === 'ont') {
        this.totalSupportedAmount.show = this.totalSupportedAmount.ont
      }
      this.totalSupportedAmount.showName = name
    },
    async followOrUnfollowUser({ id, type }) {
      if (!this.isLogined) {
        this.showSignInModal = true
        return
      }
      const message = type === 1 ? '关注' : '取消关注'
      try {
        if (type === 1) await this.$backendAPI.follow({ id })
        else await this.$backendAPI.unfollow({ id })
        this.$toast.success({ duration: 1000, message: `${message}成功` })
        this.followed = type === 1
      } catch (error) {
        this.$toast.fail({ duration: 1000, message: `${message}失败` })
        this.showSignInModal = this.$errorHandling.isNoToken(error)
      }
    }
  }
}
</script>

<style src="./index.less" scoped lang="less"></style>
<style>
/* 覆盖投资框宽度 */
.article .van-dialog {
  max-width: 350px;
}
</style>
