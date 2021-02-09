<template>
  <router-link class="container" :to="{ name: 'user-id', params: { id: $route.query.id } }" target="_blank">
    <div class="widget">
      <img class="logo" src="@/assets/img/widget/share_logo.png" alt="logo">
      <div class="widget-content">
        <div class="token">
          <img class="token-cover" :src="avatar" alt="cover">
        </div>
        <div class="token-info">
          <div class="token-info-line">
            <div class="token-title">
              {{ userData.nickname || userData.username || $t('no-nickname') }}
            </div>
          </div>
          <div class="token-info-line">
            <div class="token-sub">
              {{ $t('follow') }}：{{ userData.follows || 0 }}
              &nbsp;
              &nbsp;
              {{ $t('fans') }}：{{ userData.fans || 0 }}
            </div>
          </div>
          <div class="token-info-line">
            <div class="token-sub">
              {{ $t('Introduction') }}：{{ userData.introduction || $t('not') }}
            </div>
          </div>
        </div>
      </div>
      <span class="footer">
        Powered by 瞬MATATAKI
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  layout: 'empty',
  data() {
    return {
    }
  },
  computed: {
    avatar() {
      return this.userData.avatar ?  this.$ossProcess(this.userData.avatar, { h: 120 }) : ''
    }
  
  },
  async asyncData({ $axios, route }) {
    let id = route.query.id
    try {
      const res = await $axios.get(`/user/${id}`)
      if (res.code === 0) {
        return { userData: res.data }
      } else {
        return { userData: {} }
      }
    } catch(e) {
      return { userData: {} }
    }
  },
  created() {
    if (process.browser) {
      if (!this.$route.query.id) {
        this.$router.push({ name: 'widget-404' })
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.container {
  height: 176px;
  /* iframe 有边框不会出现滚动条 */
  display: block;
}
.widget {
  width: 600px;
  background-color: #333333;
  padding: 30px 20px 0;
  position: relative;
  box-sizing: border-box;
  .logo {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 26px;
    height: 26px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .footer {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 17px;
    margin: 20px 0 10px;
    display: inline-block;
  }
}

.token-info {
  color: #fff;
  margin-left: 10px;
  flex: 1;
  overflow: hidden;
}

.token-info-line {
  display: flex;
  margin: 6px 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
}
.token-title {
  font-size: 20px;
  color: rgba(255, 255, 255, 1);
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
  line-height: 28px;
  text-decoration: none;
}

.token-sub {
  padding: 0;
  word-break: break-all;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255,255,255,1);
  line-height: 24px;
  max-height: 72px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  display: -webkit-box;
}

.widget h1 {
  padding: 0 40px 0 0;
  margin: 6px 0 0 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.widget-content {
  display: flex;
  /* align-items: center; */
  /* justify-content: space-between; */
  .token {
    flex: 0 0 90px;
    width: 90px;
    height: 90px;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid #ececec;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.widget-content .cover {
  width: 140px;
  height: 70px;
  flex: 0 0 140px;
  margin-right: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.widget-content .widget-des {
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 24px;
}
.widget .author {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  padding: 0 150px 0 0;
  margin: 10px 0 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}



@media screen and (max-width: 600px) {
  .widget {
    width: 100%;
  }
  .widget-content .token {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
  }
}

/* 上线前需要添加前缀和压缩 */
</style>