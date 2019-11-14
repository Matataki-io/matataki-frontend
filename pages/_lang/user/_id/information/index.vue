
<template>
  <userPage>
    <div slot="list" v-loading="loading">
      <div v-if="urls.length !== 0" class="websites">
        <h3 class="inline h3">
          相关网站
        </h3>
        <div class="inline url">
          <p v-for="(item, index ) in urls" :key="index">
            <a class="link" :href="item">{{ item }} </a>
          </p>
        </div>
      </div>
      <div v-if="social.length !== 0" class="social">
        <h3 class="inline h3">
          社交账号
        </h3>
        <div class="inline">
          <div v-for="(item, index) in social" :key="index" class="social-icons inline">
            <socialIcon :icon="item.icon" :show-tooltip="true" :content="item.content" />
          </div>
        </div>
      </div>
      <div v-if="social.length === 0 && urls.length === 0 && loading === false" class="social no-data">
        <p>
          暂无信息
        </p>
      </div>
    </div>
  </userPage>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters(['currentUserInfo'])
  },
  mounted() {
    this.getMyUserLinks()
  },
  methods: {
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
    }
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
.no-data {
  text-align: center;
  p {
    margin-top: 40px;
    font-size:14px;
    color:rgba(178,178,178,1);
  }
}
</style>
