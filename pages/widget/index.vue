<template>
  <router-link class="container" :to="{ name: 'p-id', params: { id: $route.query.id }, query: { invite: $route.query.invite, referral: $route.query.referral } }" target="_blank">
    <div class="widget">
      <img class="logo" src="@/assets/img/widget/share_logo.png" alt="logo">
      <h1 class="jumpPage">
        {{ articleData.title || '' }}
      </h1>
      <div class="widget-content">
        <div class="cover jumpPage">
          <img v-if="cover" :src="cover" alt="cover">
        </div>
        <p class="widget-des">{{ $route.query.content || content }}</p>
      </div>
      <p class="author">by: {{ articleData.nickname || articleData.username }}</p>
      <div class="readorups jumpPage">
        <span><img src="@/assets/img/widget/read.svg" alt="read">{{ articleData.read || 0 }}</span>
        <span><img src="@/assets/img/widget/ups.svg" alt="ups">{{ articleData.likes || 0 }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { filterOutHtmlTags } from '@/utils/xss'

export default {
  layout: 'empty',
  async asyncData({ $axios, route }) {
    let id = route.query.id
    try {
      const res = await $axios.get(`/p/${id}`)
      if (res.code === 0) {
        return { articleData: res.data }
      } else {
        return { articleData: {} }
      }
    } catch(e) {
      return { articleData: {} }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    cover() {
      return this.articleData.cover ?  this.$ossProcess(this.articleData.cover, { h: 120 }) : ''
    },
    content() {
      return this.articleData.short_content ? filterOutHtmlTags(this.articleData.short_content) : '没有简介信息'
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
  max-width: 600px;
  width: 100%;
  background-color: #333333;
  padding: 8px 10px;
  position: relative;
  box-sizing: border-box;
}

.widget .logo {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  overflow: hidden;
}

.widget h1 {
  padding: 0 40px 0 0;
  margin: 6px 0 0 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,1);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.widget-content {
  display: flex;
  /* align-items: center; */
  /* justify-content: space-between; */
  margin: 12px 0 0 0;
}

.widget-content .cover {
  width: 140px;
  height: 70px;
  flex: 0 0 140px;
  margin-right: 10px;
  overflow: hidden;
  background-color: #a9a9a9;
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
  color: rgba(255,255,255,1);
  line-height: 24px;
  max-height: 72px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  display: -webkit-box;
}
.widget .author {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255,255,255,1);
  padding: 0 150px 0 0;
  margin: 10px 0 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.widget .readorups {
  position: absolute;
  bottom: -18px;
  right: 14px;
  background-color: #542de0;
  color: #fff;
  border-radius: 3px;
  padding: 10px 6px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .1);
  display: flex;
}

.widget .readorups span {
  margin: 0 4px;
  font-size: 12px;
  font-weight:500;
  color:rgba(255,255,255,1);
  display: flex;
  align-items: center;
}
.widget .readorups span img {
  height: 12px;
  margin-right: 4px;
}



@media screen and (max-width: 600px) {
.widget-content .cover {
    width: 70px;
    flex: 0 0 70px;
  }
}
</style>