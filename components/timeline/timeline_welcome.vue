<template>
  <div class="welcome">
    <!-- -- -->
    <img src="@/assets/img/dynamic_banner_people.png" alt="" class="welcome-people">
    <h2 class="welcome-title">
      {{ $t('welcome-to-join') }}
    </h2>
    <h2 class="welcome-title" v-html="$t('an-open-and-permanent-digital-library')" />
    <div class="welcome-text">
      <p class="welcome-description">{{ $t('please') }} <span @click="login">{{ $t('login') }}</span> {{ $t('after-viewing-your') }}</p>
      <p class="welcome-description-time" v-html="$t('personalized-dynamic-timeline')" />
      <a
        href="javascript:;"
        class="btn"
        @click="login"
      >{{ $t('home.signIn') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineWelcome',
  serverCacheKey() {
    return 'TimelineWelcome'
  },
  methods: {
    login() {
      try {
        this.$store.commit('setLoginModal', true)
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>


<style lang="less" scoped>
.welcome {
  height: 345px;
  position: relative;
  box-sizing: border-box;
  background-color: #ece7ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 68px;
  margin-top: 44px;
  background-image: url(../../assets/img/dynamic_banner_bc.png);
  background-size: cover;
  &-people {
    position: absolute;
    left: -20px;
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
  &-text {
    text-align: right;
    margin-top: 22px;
    .btn {
      display: inline-block;
      background: rgba(84, 45, 224, 1);
      border-radius: 15px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      padding: 5px 47px;
      margin: 30px 0 0 0;
      &:hover {
        background-color: mix(rgba(84, 45, 224, 1), #000, 90%);
      }
    }
  }
  &-description {
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 30px;
    padding: 0;
    margin: 0;
    span {
      color: #542de0;
      cursor: pointer;
    }
  }
  &-description-time {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    word-spacing: 2px;
    padding: 0;
    margin: 10px -10px 0 0;
    span {
      color: #b2b2b2;
    }
  }
}
</style>