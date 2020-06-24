
<template>
  <userPage>
    <div slot="list" v-loading="loading" class="user-info-content">
      <template v-if="urls.length !== 0">
        <h3 class="title">
          {{ $t('social.relatedWebsites') }}
        </h3>
        <a
          v-for="(item, index ) in urls"
          :key="index"
          :href="formatUrl(item)"
          target="_blank"
          class="websites-link"
        >{{ item }} </a>
      </template>
      <template v-if="social.length !== 0">
        <h3 class="title">
          {{ $t('social.socialAccount') }}
        </h3>
        <div class="social-btn">
          <div
            v-for="(item, index) in social"
            :key="index"
            class="circle"
          >
            <socialIcon
              :icon="item.icon"
              :show-tooltip="true"
              :content="item.content"
            />
            <span>{{ item.content }}</span>
            <a v-if="socialUrl(item.type, item.content)" :href="socialUrl(item.type, item.content)" target="_blank">跳转</a>
            <a v-else href="Javascript:;" @click="copyCode(item.content)">复制</a>
          </div>
        </div>
      </template>
      <template>
        <h3 class="title">
          {{ $t('user.registrationTime') }}
        </h3>
        <p>{{ create_time }}</p>
      </template>
      <!-- <div
        v-if="social.length === 0 && urls.length === 0 && loading === false"
        class="social no-data"
      >
        <p>
          {{ $t('noInfo') }}
        </p>
      </div> -->
    </div>
  </userPage>
</template>

<script>
import moment from 'moment'

import { mapState, mapActions } from 'vuex'
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
      social: [],
      socialTemplate: [
        {
          icon: 'Email',
          type: 'email',
          content: ''
        },
        {
          icon: 'QQ',
          type: 'qq',
          content: ''
        },
        {
          icon: 'Wechat',
          type: 'wechat',
          content: ''
        },
        {
          icon: 'Weibo',
          type: 'weibo',
          content: ''
        },
        {
          icon: 'Telegram',
          type: 'telegram',
          content: ''
        },
        {
          icon: 'Twitter',
          type: 'twitter',
          content: ''
        },
        {
          icon: 'Facebook',
          type: 'facebook',
          content: ''
        },
        {
          icon: 'Github',
          type: 'github',
          content: ''
        }
      ],
      urls: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    create_time() {
      if(this.userInfo && this.userInfo.create_time) {
        return moment(this.userInfo.create_time).format('YYYY-MM-DD')
      }
      else return '-- -- --'
    }
  },
  mounted() {
    this.getMyUserLinks()
    this.$nextTick(() => {
      this.refreshUser({ id: this.$route.params.id })
    })
  },
  methods: {
    ...mapActions('user', ['refreshUser']),
    async getMyUserLinks() {
      this.loading = true
      try {
        const resLinks = await this.$API.getUserLinks({ id: this.$route.params.id })
        if (resLinks.code === 0) {
          const data = resLinks.data
          this.urls = data.websites
          data.socialAccounts.forEach(item => {
            this.socialTemplate.find(age => age.type === item.type).content = item.value
          })
          this.social = this.socialTemplate.filter(age => age.content !== '' && age.content != null)
          this.loading = false
        } else console.log('获取用户信息失败')
      } catch (error) {
        console.log(`获取用户信息失败${error}`)
      }
    },
    formatUrl(url) {
      const isHttp = url.indexOf('http://')
      const isHttps = url.indexOf('https://')
      if (isHttp !== 0 && isHttps !== 0) url = 'http://' + url
      return url
    },
    // 返回社交链接
    socialUrl(type, content) {
      let list = {
        'email': 'mailto:',
        'weibo': 'https://www.weibo.com/',
        'telegram': 'https://telegram.me/',
        'twitter': 'https://twitter.com/',
        'facebook': 'https://facebook.com/',
        'github': 'https://github.com/'
      }
      let listType = list[type.toLocaleLowerCase()]
      return listType ? listType + content : ''
    },
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$message({
            showClose: true,
            message: this.$t('success.copy'),
            type: 'success'
          })
        },
        () => {
          this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.user-info-content {
  padding-bottom: 100px;
}
.social-icons {
  margin: 10px 10px 0 0;
}
.title {
  margin: 20px 0 0 0;
  font-size: 18px;
  font-weight: 600;
}
.websites-link {
    display: inline-block;
    width: 100%;
    text-decoration: underline;
    color: #333;
    font-size: 16px;
    margin: 10px 0 0;
}
.no-data {
  text-align: center;
  p {
    margin-top: 40px;
    font-size:14px;
    color:rgba(178,178,178,1);
  }
}

.social-btn {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

}
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 10px 10px 0;
  span {
    margin-left: 10px;
    font-size: 14px;
    display: none;
  }
  a {
    margin-left: 10px;
    font-size: 14px;
    text-decoration: underline;
    color: #333;
    display: none;
  }
}

@media screen and (max-width: 540px) {
  .social-btn .circle {
    width: 100%;
    justify-content: flex-start;
    span,
    a {
      display: inherit;
    }
  }
}

</style>
