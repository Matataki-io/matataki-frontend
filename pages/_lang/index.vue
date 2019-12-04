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
              <p class="summary">
                - 我所热爱的就是最大的。
              </p>
              <p class="summary">
                - 在未来，我们与AI有什么不同？是生生不息的热爱、探索与执着让我们如此不同！
              </p>
              <p class="summary">
                - 投资执着和努力创作的人，未来，一个人就是一家“公司”。
              </p>
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
              <p class="summary">
                - 利用区块链为创作数据确权，数据资产完全归属作者，不再被平台剥夺、剥削。
              </p>
              <p class="summary">
                - 完善的区块链价值工具集，保证作者的创作价值触达更多爱好者，用社区的力量反哺创作，用创作的价值壮大社区。
              </p>
              <p class="summary">
                - 区块链上价值透明可传导，保证衍生创作持续输血原作，让优秀的创作生生不息。
              </p>
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
              <p class="summary">
                - 思想高度多样化的群体，智能水平能够超越多年训练的专家
              </p>
              <p class="summary">
                - 社交媒体快速抢占我们的注意力，而思考和学习需要慢时间，如何让慢的事情高质量变快？
              </p>
              <p class="summary">
                - 市场和经济系统能够奖励优秀的思想，合作能够快速传播思想和带来思想的进化，<b>”市场激励“</b>加<b>”合作“</b>能让群体的“慢”思考变快，提升社会中每个人的能力和收益。
              </p>
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
            <h4>2019.4</h4>
            <p class="sumary">
              我所热爱的就是最大的。在未来，我们与AI有什么不同？是生生不息的 。热爱、探索与执着让我们如此不同！ 投资执着和努力创作的人，未来，一个人就是。 一家“公司”。
            </p>
          </div>
          <div class="roadmap-time__block">
            <h4>2019.4</h4>
            <p class="sumary">
              我所热爱的就是最大的。在未来，我们与AI有什么不同？是生生不息的 。热爱、探索与执着让我们如此不同！ 投资执着和努力创作的人，未来，一个人就是。 一家“公司”。
            </p>
          </div>
          <div class="roadmap-time__block">
            <h4>2019.4</h4>
            <p class="sumary">
              我所热爱的就是最大的。在未来，我们与AI有什么不同？是生生不息的 。热爱、探索与执着让我们如此不同！ 投资执着和努力创作的人，未来，一个人就是。 一家“公司”。
            </p>
          </div>
          <div class="roadmap-time__block">
            <h4>2019.4</h4>
            <p class="sumary">
              我所热爱的就是最大的。在未来，我们与AI有什么不同？是生生不息的 。热爱、探索与执着让我们如此不同！ 投资执着和努力创作的人，未来，一个人就是。 一家“公司”。
            </p>
          </div>
          <div class="roadmap-time__line" />
        </section>
      </section>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-undef */

import { TimelineLite, TimelineMax, TweenMax, Linear } from 'gsap'
import throttle from 'lodash/throttle'
export default {
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/plugins/animation.gsap.min.js' }
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
