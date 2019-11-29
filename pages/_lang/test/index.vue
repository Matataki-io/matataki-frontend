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
          <svg-icon
            class="btn-list_btn"
            icon-class="article"
          />
          <svg-icon
            class="btn-list_btn"
            icon-class="fan"
          />
          <svg-icon
            class="btn-list_btn"
            icon-class="exchange_home"
          />
        </div>
      </div>
      <!-- background -->
      <img class="home-background__left" src="@/assets/img/index/main_bg_left.png" alt="matataki home background">
      <img class="home-background__right" src="@/assets/img/index/main_bg_right.png" alt="matataki home background">
    </section>

    <!-- story -->
    <section class="story">
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
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
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
              <img src="@/assets/img/index/sotry_passion_title.png" alt="sustainability">
            </figure>
            <p class="summary">
              - 我所热爱的就是最大的。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
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
              <img src="@/assets/img/index/sotry_passion_title.png" alt="boundary">
            </figure>
            <p class="summary">
              - 我所热爱的就是最大的。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
            <p class="summary">
              - 在未来，我们与AI有什么不同？是生生不息的 热爱、探索与执着让我们如此不同！
            </p>
            <p class="summary">
              - 投资执着和努力创作的人，未来，一个人就 是。 一家“公司”。
            </p>
          </article>
        </section>
      </section>
    </section>

    <!-- roadmap -->
    <section class="roadmap">
      <section class="roadmap-content">
        <div class="roadmap-block">
          <img class="roadmap-bg" src="@/assets/img/index/roadmap_bg.png" alt="roadmap-background">
          <img class="roadmap-text" src="@/assets/img/index/roadmap_text.png" alt="roadmap-text">
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
import { TimelineLite } from 'gsap'

export default {
  mounted() {
    if (process.browser) {
      this._resizeHomeHeight()
      window.addEventListener('scroll', this._scrollStory)
    }
  },
  methods: {
    _resizeHomeHeight() {
      const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
      if (clientHeight < 800) return false
      else this.$refs.home.style.height = clientHeight + 'px'
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
    },
    _scrollStory() {
      const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      const { storyOne, storyTwo, storyThree } = this.$refs

      // let storyOneOffsetTop = storyOne.offsetTop
      // let storyTwoOffsetTop = storyTwo.offsetTop
      // let storyThreeOffsetTop = storyThree.offsetTop

      // let storyOneDistanceToTop = story_01

      console.log(scrollTop)
    }
  }
}
</script>

<style scoped lang="less" src="./index.less">

</style>
