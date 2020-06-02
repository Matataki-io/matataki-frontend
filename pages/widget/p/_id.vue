<template>
  <div class="container">
    <div class="widget">
      <img class="logo" src="@/assets/img/widget/share_logo.png" alt="logo">
      <h1 class="jumpPage">
        {{ articleData.title || '' }}
      </h1>
      <div class="widget-content">
        <div class="cover jumpPage">
          <img v-if="cover" :src="cover" alt="cover">
        </div>
        <p class="widget-des">{{ content }}</p>
      </div>
      <p class="author">by: {{ articleData.nickname || articleData.username }}</p>
      <div class="readorups jumpPage">
        <span><img src="@/assets/img/widget/read.svg" alt="read">{{ articleData.read || 0 }}</span>
        <span><img src="@/assets/img/widget/ups.svg" alt="ups">{{ articleData.likes || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { filterOutHtmlTags } from '@/utils/xss'

export default {
  layout: 'empty',
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
  async asyncData({ $axios, route }) {
    let id = route.params.id
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
  created() {
    if (process.browser) {
      if (!this.$route.params.id) {
        this.$router.push({ name: 'widget' })
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


.jumpPage {
  cursor: pointer;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}
.spinner {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.spinner > div {
  width: 6px;
  height: 100%;
  background-color: #4facfe;
  display: inline-block;
  /* animation: scaleAnimation 0 timing-function delay iteration-count direction fill-mode; */
  animation: scaleAnimation 1.2s infinite ease-in-out;
}

.spinner .spinner-rect2 {
  animation-delay: -1.1s;
}
.spinner .spinner-rect3 {
  animation-delay: -1s;
}
.spinner .spinner-rect4 {
  animation-delay: -0.9s;
}
.spinner .spinner-rect5 {
  animation-delay: -0.8s;
}

@keyframes scaleAnimation {
  0%, 100% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(1);
  }
}

@media screen and (max-width: 600px) {
.widget-content .cover {
    width: 70px;
    flex: 0 0 70px;
  }
}
</style>