
<template>
  <userPage>
    <div slot="list" v-loading="loading">
      <div class="websites">
        <h3 class="inline h3">
          相关网站
        </h3>
        <div class="inline url">
          <p v-for="(item, index ) in urls" :key="index">
            <a class="link" :href="item">{{ item }} </a>
          </p>
        </div>
      </div>
      <div class="social">
        <h3 class="inline h3">
          社交账号
        </h3>
        <div class="inline">
          <div v-for="(item, index) in social" :key="index" class="social-icons inline">
            <socialIcon :icon="item.icon" :show-tooltip="true" :content="item.content" />
          </div>
        </div>
      </div>
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import socialIcon from '@/components/social_icon/index.vue'

export default {
  components: {
    userPage,
    socialIcon
  },
  data() {
    return {
      loading: false,
      social: [
        {
          icon: 'QQ',
          name: 'QQ：',
          content: '185446975'
        },
        {
          icon: 'Wechat',
          name: '微信：',
          content: '185446975'
        },
        {
          icon: 'Weibo',
          name: '微博：',
          content: '185446975'
        },
        {
          icon: 'Telegram',
          name: 'Telegram：',
          content: '185446975'
        },
        {
          icon: 'Twitter',
          name: 'Twitter：',
          content: '185446975'
        },
        {
          icon: 'Github',
          name: 'Github：',
          content: '185446975'
        }
      ],
      urls: [
        'http://www.dibibi.com',
        'http://www.abcdefg.com',
        'http://www.efig.com'
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.social-icons {
  width: 60px;
}
.inline {
  display: inline-flex;
  &.h3 {
    margin-right: 20px;
  }
  &.url {
    display: inline-table;
  }
  a:link {color:black}
  a:visited {color: black}
  a:hover {color:dimgrey}
  a:active {color: darkgray}
}
.websites {
  margin-bottom: 20px;
}
.social {
  padding-bottom: 100px;
}
</style>
