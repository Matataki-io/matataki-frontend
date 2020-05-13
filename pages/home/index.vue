<template>
  <div class="home">
    <!-- screen1 -->
    <section class="screen1">
      <section class="screen1-main">
        <header>
          <img src="@/assets/img/home/logo.png" alt="logo" class="logo">
          <a href="javascript:;" class="login-btn">注册/登录</a>
        </header>
        <section class="screen1-block__text">
          <div class="screen1-block__text__content">
            <h1>我们帮助创作者<br>建立 <span>跨平台\跨媒介</span> 的粉丝群<br>& 轻松获得收入</h1>
            <p>您可以在Matataki发行自己的专属粉丝通证，与您的好友或是追随者们互相持有，基于web3.0区块链技术得以让您的社交关系跨平台、地域存在。Matataki支持任何形式的创作，包括：图文、代码、绘画、资料、素材 等，并且您可以对创作中的任何内容进行加锁处理，以获得更多的收入。</p>
          </div>

          <section class="screen1-block__btn">
            <a href="javascript:;" class="screen1-btn create">成为作者</a>
            <a href="javascript:;" class="screen1-btn subscribe">订阅我们</a>
            <a href="javascript:;" class="screen1-more">探索更多</a>
          </section>
        </section>
        <section class="screen1-block__img">
          <img src="@/assets/img/home/home_screen1_img.png" alt="img">
        </section>
      </section>

      <div class="screen1-bc">
        <img src="@/assets/img/home/home_screen1_icon1.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon2.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon3.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon4.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon5.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon6.png" alt="icon">
      </div>
    </section>

    <!-- screen2 -->
    <section class="screen2">
      <h3 class="screen-title">
        TA们都在使用瞬matataki进行创作
      </h3>
      <section class="screen2-content">
        <el-carousel
          v-if="swipeMode !== ''"
          class="swipe-carousel"
          :height="swipeHeight"
          indicator-position="outside"
          trigger="click"
          :interval="300000"
        >
          <el-carousel-item v-for="item in 4" :key="item">
            <div class="swipe">
              <template v-if="swipeMode === 'double'">
                <div v-for="itemChild in 2" :key="itemChild" class="swipe-block">
                  <div class="swipe-tag">
                    已入驻340天
                  </div>

                  <section class="swipe-head">
                    <c-avatar />
                    <section class="swipe-head-info">
                      <p class="swipe-info-title">加菲猫</p>
                      <p class="swipe-info-sub">知名音乐人，区块链音乐平台soundrio创始人</p>
                    </section>
                  </section>
                  <p class="swipe-text">
                    迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证。小岛和他的团队已经寻得了内容通证。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。
                  </p>
                  <div class="swipe-line" />
                  <p class="swipe-publish">
                    <span>132</span>篇文章已发表
                  </p>
                  <div class="swipe-article">
                    <div class="swipe-article-full" />
                    <img src="https://report.niucodata.com/mbd_55491571493902928.jpg" alt="cover">
                    <p class="swipe-article-text">第二届Hackthon大赛「上海站」即将开始报名，请各位踊跃参加！前10名报名者会有神秘礼物～～</p>
                  </div>
                </div>
              </template>
              <template v-if="swipeMode === 'single'">
                <div class="swipe-block single">
                  <div class="swipe-tag">
                    已入驻340天
                  </div>

                  <section class="swipe-head">
                    <c-avatar />
                    <section class="swipe-head-info">
                      <p class="swipe-info-title">加菲猫</p>
                      <p class="swipe-info-sub">知名音乐人，区块链音乐平台soundrio创始人</p>
                    </section>
                  </section>
                  <p class="swipe-text">
                    迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证。小岛和他的团队已经寻得了内容通证。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。迄今为止，Matataki是内容价值领域最易用直观的产品。
                  </p>
                  <div class="swipe-line" />
                  <p class="swipe-publish">
                    <span>132</span>篇文章已发表
                  </p>
                  <div class="swipe-article">
                    <div class="swipe-article-full" />
                    <img src="https://report.niucodata.com/mbd_55491571493902928.jpg" alt="cover">
                    <p class="swipe-article-text">第二届Hackthon大赛「上海站」即将开始报名，请各位踊跃参加！前10名报名者会有神秘礼物～～</p>
                  </div>
                </div>
              </template>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>
    </section>

    <!-- screen3 -->
    <section class="screen3">
      <div class="screen3-bc">
        <img src="@/assets/img/home/home_screen3_icon1.png" alt="icon">
      </div>
      <h3 class="screen-title">
        为什么要在瞬Matataki上创作？
      </h3>
      <section class="screen3-content">
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_1.png" alt="icon">
          <h4>永久保存<br>只管放心发表</h4>
          <p>无需担心被和谐，你创造的内容被永久存储在IPFS分布式网络上，且无法被任何人进行再次修改，方便在其他平台日后维权。</p>
        </section>
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_1.png" alt="icon">
          <h4>永久保存<br>只管放心发表</h4>
          <p>无需担心被和谐，你创造的内容被永久存储在IPFS分布式网络上，且无法被任何人进行再次修改，方便在其他平台日后维权。</p>
        </section>
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_1.png" alt="icon">
          <h4>永久保存<br>只管放心发表</h4>
          <p>无需担心被和谐，你创造的内容被永久存储在IPFS分布式网络上，且无法被任何人进行再次修改，方便在其他平台日后维权。</p>
        </section>
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_1.png" alt="icon">
          <h4>永久保存<br>只管放心发表</h4>
          <p>无需担心被和谐，你创造的内容被永久存储在IPFS分布式网络上，且无法被任何人进行再次修改，方便在其他平台日后维权。</p>
        </section>
      </section>
    </section>


    <!-- screen4 -->
    <section class="screen4">
      <h3 class="screen-title">
        三步使用瞬Matataki
      </h3>
      <section class="screen4-content">
        <section class="screen4-block">
          <h4>1.创建账号</h4>
          <p>在Matataki上进行自由创作，并且为你的大作添加上 支付可见 或 持币可见 的权限。</p>
          <img src="@/assets/img/home/home_screen4_1.png" alt="icon">
        </section>
        <img src="@/assets/img/home/home_screen4_arrow.png" alt="screen" class="screen4-arrow">
        <section class="screen4-block">
          <h4>1.创建账号</h4>
          <p>在Matataki上进行自由创作，并且为你的大作添加上 支付可见 或 持币可见 的权限。</p>
          <img src="@/assets/img/home/home_screen4_1.png" alt="icon">
        </section>
        <img src="@/assets/img/home/home_screen4_arrow.png" alt="screen" class="screen4-arrow">
        <section class="screen4-block">
          <h4>1.创建账号</h4>
          <p>在Matataki上进行自由创作，并且为你的大作添加上 支付可见 或 持币可见 的权限。</p>
          <img src="@/assets/img/home/home_screen4_1.png" alt="icon">
        </section>
      </section>

      <p class="screen4-title">每一份能满足他人需求的努力都值得被付费。 <span>—— 瞬Matataki</span></p>
      <p class="screen4-btn">
        <a href="javascript:;" class="screen4-btn">立即创作</a>
      </p>
    </section>

    <!-- screen5 -->
    <section class="screen5">
      <h3 class="screen-title">
        订阅 瞬Matataki 资讯
      </h3>
      <section class="screen5-content">
        <input type="text" placeholder="请输入您的邮箱">
        <a href="javascript:;">订阅我们</a>
      </section>
    </section>

    <!-- screen6 -->
    <section class="screen6">
      <h3>Q & A</h3>
      <section class="screen6-content">
        <section class="screen6-block">
          <h4>1 瞬Matataki如何收费？</h4>
          <p>使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！</p>
        </section>

        <section class="screen6-block">
          <h4>2 瞬Matataki如何收费？</h4>
          <p>使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！</p>
        </section>

        <section class="screen6-block">
          <h4>3 瞬Matataki如何收费？</h4>
          <p>使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！</p>
        </section>

        <section class="screen6-block">
          <h4>4 瞬Matataki如何收费？</h4>
          <p>使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！使用瞬Matataki完全免费，仅在你获得收入并提现时，扣除 6% 的服务费(包含1%微信渠道费用)，无需等待至下月，满 1 元即可提现，提现秒到账！</p>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  data() {
    return {
      resizeEvent: null,
      swipeMode: '', // single double
      swipeHeight: '720px', // 高度
    }
  },
  created() {
    this.init()
    if (process.browser) {
      this.$nextTick(() => {
        this.initSwipe()
        this.resizeEvent = throttle(this.initSwipe, 300)
        window.addEventListener('resize', this.resizeEvent)
      })
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    async init() {
    },

    // 初始化轮播图 
    initSwipe() {
      try {
        const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        console.log('clientWidth', clientWidth)
        if (clientWidth < 800) {
          this.swipeMode = 'single'
        } else {
          this.swipeMode = 'double'
        }

        if (clientWidth < 540) {
          this.swipeHeight = '480px'
        } else {
          this.swipeHeight = '720px'
        }
      } catch(e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>