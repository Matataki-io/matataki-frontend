<template>
  <div class="banner-container mw">
    <div class="banner">
      <n-link :to="{name: 'index'}" class="banner-logo">
        <img class="logo" src="@/assets/img/matataki_logo.png" alt="logo">
      </n-link>
      <div class="banner-data">
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerUser') }}
          </p>
          <p class="data-num">
            {{ postsStats.users || 0 }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerArticles') }}
          </p>
          <p class="data-num">
            {{ postsStats.articles || 0 }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerPoint') }}
          </p>
          <p class="data-num">
            {{ postsStats.points || 0 }}
          </p>
        </div>
      </div>
      <div class="banner-img">
        <img src="@/assets/img/pc_banner_img.png" alt="banner">
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postsStats: Object.create(null)
    }
  },
  mounted() {
    this.getPostsStats()
  },
  methods: {
    getPostsStats() {
      this.$API.postsStats().then(res => {
        if (res.code === 0) this.postsStats = res.data
      }).catch(err => console.log(`${err}`))
    }
  }
}
</script>

<style lang="less" scoped>
.banner-container {
  padding: 0 10px;
  box-sizing: border-box;
}
.banner {
  margin-top: 80px;
  height:200px;
  background: @purpleLight;
  border-radius: @borderRadius10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px 0 80px;
  box-sizing: border-box;
}

.banner-logo {
  display: flex;
  flex-direction: column;
  align-items: self-end;
  .logo {
    width: 174px;
  }
}

.banner-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-right: 20px;
}

.data {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 10px;
  box-sizing: border-box;
  &-title {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    padding: 0;
    margin: 0;
  }
  &-num {
    font-size: 56px;
    font-weight:bold;
    color: @purpleDark;
    padding: 0;
    margin: 10px 0 0;
    word-break: break-all;
  }
}

.banner-img {
  height: 100%;
  display: flex;
  align-items: center;
  img {
    height: 84%;
  }
}

// .banner-more {
//   font-size: 14px;
//   margin: 8px 0 0;
//   text-decoration: underline;
//   color: #542de0;
// }
</style>
