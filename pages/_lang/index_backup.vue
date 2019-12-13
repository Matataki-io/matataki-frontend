<template>
  <div class="main">
    <!-- home -->
    <section ref="home" class="home">
      <!-- logo -->
      <img ref="logo" class="home-logo" src="@/assets/img/index/logo.png" alt="logo">
      <img ref="sumary" class="home-sumary" src="@/assets/img/index/sumary.png" alt="sumary">
      <!-- btn -->
      <div class="btn-menu">
        <div ref="btn" @click="showMoreMenu" class="btn">
          <svg-icon
            icon-class="add"
          />
        </div>
        <div ref="btnList" class="btn-list">
          <router-link :to="{name: 'article'}">
            <svg-icon
              class="btn-list_btn"
              icon-class="article"
            />
          </router-link>
          <router-link :to="{name: 'token'}">
            <svg-icon
              class="btn-list_btn"
              icon-class="fan"
            />
          </router-link>
          <router-link :to="{name: 'exchange'}">
            <svg-icon
              class="btn-list_btn"
              icon-class="exchange_home"
            />
          </router-link>
        </div>
      </div>
      <!-- background -->
      <img class="home-background__left" src="@/assets/img/index/main_bg_left.png" alt="matataki home background">
      <img class="home-background__right" src="@/assets/img/index/main_bg_right.png" alt="matataki home background">
    </section>

    <!-- story -->
    <section class="story ">
      <div>
        <!-- story 1 -->
        <section ref="storyOne" class="component-story story-left story_01">
          <section class="component-story__header">
            <article class="component-story__inner">
              <figure class="component-story__inner__title">
                <img src="@/assets/img/index/passion.png" alt="passion">
              </figure>
              <div class="visual-wrap">
                <figure>
                  <img src="@/assets/img/index/story_passion.png" alt="passion">
                </figure>
              </div>
            </article>
          </section>
          <section class="component-story__summary">
            <article class="component-story__inner">
              <figure class="component-story__summary__title">
                <img src="@/assets/img/index/sotry_passion_title.png" alt="passion">
              </figure>
              <ul>
                <li>
                  <p class="summary">
                    我所热爱的就是最大的。
                  </p>
                </li>
                <li>
                  <p class="summary">
                    在未来，我们与AI有什么不同？是生生不息的热爱、探索与执着让我们如此不同！
                  </p>
                </li>
                <li>
                  <p class="summary">
                    投资执着和努力创作的人，未来，一个人就是一家“公司”。
                  </p>
                </li>
              </ul>
            </article>
          </section>
        </section>

        <!-- story 2 -->
        <section ref="storyTwo" class="component-story story-right story_02">
          <section class="component-story__header">
            <article class="component-story__inner">
              <figure class="component-story__inner__title">
                <img src="@/assets/img/index/sustainability.png" alt="sustainability">
              </figure>
              <div class="visual-wrap">
                <figure>
                  <img src="@/assets/img/index/story_sustainability.png" alt="sustainability">
                </figure>
              </div>
            </article>
          </section>
          <section class="component-story__summary">
            <article class="component-story__inner">
              <figure class="component-story__summary__title">
                <img src="@/assets/img/index/sotry_sustainability_title.png" alt="sustainability">
              </figure>
              <ul>
                <li>
                  <p class="summary">
                    利用区块链为创作数据确权，数据资产完全归属作者，不再被平台剥夺、剥削。
                  </p>
                </li>
                <li>
                  <p class="summary">
                    完善的区块链价值工具集，保证作者的创作价值触达更多爱好者，用社区的力量反哺创作，用创作的价值壮大社区。
                  </p>
                </li>
                <li>
                  <p class="summary">
                    区块链上价值透明可传导，保证衍生创作持续输血原作，让优秀的创作生生不息。
                  </p>
                </li>
              </ul>
            </article>
          </section>
        </section>

        <!-- story 3 -->
        <section ref="storyThree" class="component-story story-left story_03">
          <section class="component-story__header">
            <article class="component-story__inner">
              <figure class="component-story__inner__title">
                <img src="@/assets/img/index/boundary.png" alt="boundary">
              </figure>
              <div class="visual-wrap">
                <figure>
                  <img src="@/assets/img/index/story_boundary.png" alt="boundary">
                </figure>
              </div>
            </article>
          </section>
          <section class="component-story__summary">
            <article class="component-story__inner">
              <figure class="component-story__summary__title">
                <img src="@/assets/img/index/sotry_boundary_title.png" alt="boundary">
              </figure>
              <ul>
                <li>
                  <p class="summary">
                    思想高度多样化的群体，智能水平能够超越多年训练的专家
                  </p>
                </li>
                <li>
                  <p class="summary">
                    社交媒体快速抢占我们的注意力，而思考和学习需要慢时间，如何让慢的事情高质量变快？
                  </p>
                </li>
                <li>
                  <p class="summary">
                    市场和经济系统能够奖励优秀的思想，合作能够快速传播思想和带来思想的进化，<b>”市场激励“</b>加<b>”合作“</b>能让群体的“慢”思考变快，提升社会中每个人的能力和收益。
                  </p>
                </li>
              </ul>
            </article>
          </section>
        </section>
      </div>
    </section>

    <!-- roadmap -->
    <section class="roadmap">
      <section class="roadmap-content">
        <div class="roadmap-block">
          <img class="roadmap-bg" src="@/assets/img/index/roadmap.png" alt="roadmap-background">
          <!-- <img class="roadmap-text" src="@/assets/img/index/roadmap_text.png" alt="roadmap-text"> -->
        </div>
        <section class="roadmap-time">
          <div class="roadmap-time__block">
            <h4><img src="@/assets/img/index/2019Q4.png" alt="2019.Q4"></h4>
            <ul>
              <li>
                <p class="sumary">
                  用户创作数据区块链时间戳确权，为原创作品保驾护航
                </p>
              </li>
              <li>
                <p class="sumary">
                  去中心化存储协议保证数据资产权益完全归用户所有
                </p>
              </li>
              <li>
                <p class="sumary">
                  数据价值量化系统“Fan票”上线，丰富数据的商业化应用场景，为创作者商业变现赋能
                </p>
              </li>
            </ul>
          </div>
          <div class="roadmap-time__block">
            <h4><img src="@/assets/img/index/2020Q1.png" alt="2020.Q1"></h4>
            <ul>
              <li>
                <p class="sumary">
                  FanDAOs 创作者社群去中心化协作工具集上线，帮助创作社群自发、高效运转，让社群专注价值生产。
                </p>
              </li>
            </ul>
          </div>
          <div class="roadmap-time__block">
            <h4><img src="@/assets/img/index/2020Q2.png" alt="2020.Q2"></h4>
            <div class="leftFrame">
              <ul>
                <li>
                  <p class="sumary">
                    上线零工经济系统。
                  </p>
                </li>
                <li>
                  <p class="sumary">
                    完善去中心化存储激励协议层。
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="roadmap-time__block">
            <h4><img src="@/assets/img/index/2020Q3.png" alt="2020.Q3"></h4>
            <ul>
              <li>
                <p class="sumary">
                  全面开放平台API，提供完善的开发工具套件，平台转向社区化运营。
                </p>
              </li>
            </ul>
          </div>
          <div class="roadmap-time__block">
            <h4><img src="@/assets/img/index/2020Q4.png" alt="2020.Q4"></h4>
            <ul>
              <li>
                <p class="sumary">
                  “人类知识共享、创新计划”上线，建设全网开放、通用的语义网络数据集。
                </p>
              </li>
            </ul>
          </div>
          <div class="roadmap-time__line" />
        </section>
      </section>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-undef */
// import { TimelineLite, TimelineMax, TweenMax, Linear } from 'gsap'
import throttle from 'lodash/throttle'
export default {
  head: {
    script: [
      { src: '/gsap.min.js' },
      { src: '/ScrollMagic.min.js' },
      { src: '/animation.gsap.min.js' },
      { src: '/debug.addIndicators.min.js' }
      // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js' },
      // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/plugins/animation.gsap.min.js' }
      // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/plugins/debug.addIndicators.min.js' }
    ]
  },
  data() {
    return {
    }
  },
  mounted() {
    if (process.browser) {
      this._setDefaultStyle()

      this.$nextTick(() => {
        this._resizeHomeHeight()
        window.addEventListener('resize', throttle(this._resizeHomeHeight, 300))
        this._initScrollAnimation()
      })
    }
  },
  methods: {
    _initScrollAnimation() {
      const initStory = () => {
        const componentStory = document.querySelectorAll('.component-story')
        const controller = new ScrollMagic.Controller()
        // const clientHeight = document.body.clientHeight || document.documentElement.clientHeight

        componentStory.forEach((el, i) => {
          const childHeaderInner = el.querySelector('.component-story__header .component-story__inner')
          const childSumaryInner = el.querySelector('.component-story__summary .component-story__inner')

          const timelinemax = new TimelineMax()

          // timelinemax.to(el, 1, { z: 0, ease: Linear.easeNone }, 'story')
          timelinemax.to(childHeaderInner, 1, { y: '30%', ease: Linear.easeNone }, 'story')
          timelinemax.to(childSumaryInner, 1, { y: '-90%', ease: Linear.easeNone }, 'story')

          // timelinemax.to('.roadmap .roadmap-time__block', 1, { z: 0, y: -20, ease: Linear.easeNone })

          const scene = new ScrollMagic.Scene({
            triggerElement: el,
            triggerHook: 1,
            duration: '200%'
          // offset: -clientHeight
          })
            .setTween(timelinemax)
            // .addIndicators({
            //   colorTrigger: 'black',
            //   colorStart: 'black',
            //   colorEnd: 'black',
            //   indent: 10
            // })
            .addTo(controller)
        })
      }

      const initRoadmap = () => {
        const controller = new ScrollMagic.Controller()
        const tl = new TimelineMax()
        const roadmap = document.querySelector('.roadmap')
        const roadmapBlock = roadmap.querySelectorAll('.roadmap-time__block')

        roadmapBlock.forEach((el, i) => {
          tl.to(el, 0.3, {
            x: function () {
              return i % 2 === 0 ? 0 : '100%'
            },
            y: 0,
            opacity: 1,
            ease: Linear.easeNone
          })
        })

        const scene1 = new ScrollMagic.Scene({
          triggerElement: roadmap
          // triggerHook: 1,
          // duration: '160%'
        // offset: -clientHeight
        })
          .setTween(tl)
          // .addIndicators({
          // colorTrigger: 'black',
          // colorStart: 'black',
          // colorEnd: 'black',
          // indent: 10
          // })
          .addTo(controller)
      }
      initStory()
      initRoadmap()
    },
    _resizeHomeHeight() {
      const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
      if (clientHeight < 800) return false
      else this.$refs.home.style.height = clientHeight + 'px'
    },
    /**
     * 设置默认样式, 从css里面抽离出来, 减少样式的印象
     */
    _setDefaultStyle() {
      const { btnList } = this.$refs
      const timeline = new TimelineLite()

      TweenMax.set('.btn-list', {
        opacity: 0,
        y: 0
      })

      TweenMax.set('.story', {
        perspective: 1000
      })
      // TweenMax.set('.component-story', {
      //   z: -40
      // })
      TweenMax.set('.component-story .component-story__header .component-story__inner', {
        y: '-10%'
      })
      TweenMax.set('.roadmap .roadmap-time__block', {
        y: 20,
        opacity: 0
      })
    },
    // 首页第一屏按钮点击显示菜单
    showMoreMenu() {
      const { btn, btnList } = this.$refs
      const timeline = new TimelineLite()
      const btnVisible = btn.getAttribute('data-visible') === 'true'
      btn.setAttribute('data-visible', !btnVisible)

      if (btnVisible) {
        timeline.to(btn, 0.2, {
          rotation: 0
        })
        timeline.to(btnList, 0.2, {
          y: 0,
          opacity: 0
        },
        '-=0.1')
      } else {
        timeline.to(btn, 0.2, {
          rotation: 45
        })
        timeline.to(btnList, 0.2, {
          y: 10,
          opacity: 1
        },
        '-=0.1')
      }
    }
  }
}
</script>

<style scoped lang="less" src="./index/index.less">

</style>
