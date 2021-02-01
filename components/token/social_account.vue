<template>
  <div class="social">
    <h2 class="token-title">
      {{ $t('social.socialAccount') }}
    </h2>

    <div
      v-if="resourcesSocialss.length !== 0"
      class="social-btn"
    >
      <div
        v-for="(item, index) in resourcesSocialss"
        :key="index"
        class="circle"
      >
        <socialIcon
          :show-tooltip="true"
          :icon="item.type"
          :content="item.content"
        />
        <span>{{ item.content }}</span>
        <a v-if="socialUrl(item.type, item.content)" :href="socialUrl(item.type, item.content)" target="_blank">{{ $t('jump') }}</a>
        <a v-else href="Javascript:;" @click="copyCode(item.content)">{{ $t('copy') }}</a>
      </div>
    </div>
    <span
      v-else
      class="not"
    >{{ $t('not') }}</span>
  </div>
</template>
<script>
import socialIcon from '@/components/social_icon/index.vue'

export default {
  components: {
    socialIcon
  },
  props: {
    resourcesSocialss: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      urlList: {
        'email': 'mailto:',
        'weibo': 'https://www.weibo.com/',
        'telegram': 'https://telegram.me/',
        'twitter': 'https://twitter.com/',
        'facebook': 'https://facebook.com/',
        'github': 'https://github.com/'
      }
    }
  },
  // computed: {},
  watch: {
  },
  // created() {},
  // mounted() {},
  methods: {
    // 返回社交链接
    socialUrl(type, content) {
      let listType = this.urlList[type.toLocaleLowerCase()]
      return listType ? listType + content : ''
    },
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$message({ showClose: true, message: this.$t('success.copy'), type: 'success' })
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
.social {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  &-btn {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
  }
}

.circle {
  // flex: 0 0 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 10px 8px 0;
  &:nth-child(6n) {
    margin-right: 0;
  }
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

.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0;
}
.not {
  color: #333;
  font-style: 14px;
  padding-top: 20px;
  display: inline-block;
}

@media screen and (max-width: 1200px) {
  .social-btn .circle {
    &:nth-child(6n) {
      margin-right: 10px;
    }
  }
}
@media screen and (max-width: 600px) {
  .token-title {
    font-size: 20px;
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
