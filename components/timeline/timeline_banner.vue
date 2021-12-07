<template>
  <div class="banner">
    <section class="banner-main">
      <h2 class="banner-title">
        {{ $t('welcome-to-join') }}
      </h2>
      <h2 class="banner-title bold" v-html="$t('an-open-and-permanent-digital-library')" />
      <p class="banner-description" v-html="$t('personalized-dynamic-timeline')" />
      <img src="@/assets/img/dynamic_banner_people.png" alt="people" class="banner-people">
      <img src="@/assets/img/dynamic_banner_decoration.png" alt="decoration" class="banner-decoration">
    </section>
  </div>
</template>

<script>
export default {
  name: 'TimelineBanner',
  serverCacheKey() {
    return 'TimelineBanner'
  },
}
</script>

<style lang="less" scoped>
.banner {
  max-width: 1200px;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  height: 240px;
  margin-top: 40px;

  &-main {
    height: 100%;
    background-color: #ece7ff;
    border-radius: 10px;
    position: relative;
    text-align: center;
    background-image: url(../../assets/img/dynamic_banner_bc.jpeg);
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &-people {
    position: absolute;
    left: -30px;
    top: -20px;
    height: calc(100% + 20px);
  }

  &-title {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 40px;
    padding: 0;
    margin: 0;
    /deep/ span {
      color: #fa6400;
    }
  }

  &-description {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    word-spacing: 2px;
    padding: 0;
    margin: 20px 0 0 0;
    color: #000;
    span {
      color: #b2b2b2;
    }
  }

  &-decoration {
    height: 70%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  @media screen and (max-width: 768px) {
    .banner-people,
    .banner-decoration {
      display: none;
    }
    .banner-title {
      font-size: 18px;
      line-height: 1.4;
    }
    .banner-description {
      font-size: 12px;
      line-height: 1.4;
      margin: 10px 0 0 0;
    }
  }
}
</style>