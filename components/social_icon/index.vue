<template>
  <div
    :class="icon"
    class="social-icon"
  >
    <el-tooltip
      v-if="showTooltip"
      :content="content"
      effect="dark"
      placement="top"
    >
      <a
        v-if="link"
        :href="link + content"
        target="_blank"
      >
        <svg-icon :icon-class="iconName" />
      </a>
      <svg-icon
        v-else
        :icon-class="iconName"
      />
    </el-tooltip>
    <svg-icon
      v-else
      :icon-class="iconName"
    />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    showTooltip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      social: [
        {
          symbol: 'Email',
          icon: 'email',
          name: 'Email：',
          tooltip: '',
          placeholder: this.$t('email'),
          url: 'mailto:',
          value: ''
        },
        {
          symbol: 'QQ',
          icon: 'qq',
          name: 'QQ：',
          tooltip: '',
          placeholder: this.$t('thirdParty.qqAccount'),
          url: '',
          value: ''
        },
        {
          symbol: 'Wechat',
          icon: 'wechat',
          name: `${this.$t('thirdParty.wechat')}：`,
          tooltip: '',
          placeholder: this.$t('thirdParty.wechatAccount'),
          url: '',
          value: ''
        },
        {
          symbol: 'Weibo',
          icon: 'weibo1',
          name: `${this.$t('thirdParty.weibo')}：`,
          tooltip: `(https://www.weibo.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: this.$t('thirdParty.weibo') + this.$t('thirdParty.usernameNoFullUrl'),
          url: 'https://www.weibo.com/',
          value: ''
        },
        {
          symbol: 'Telegram',
          icon: 'tg',
          name: 'Telegram：',
          tooltip: '',
          placeholder: `Telegram ${this.$t('username')}`,
          url: 'https://telegram.me/',
          value: ''
        },
        {
          symbol: 'Twitter',
          icon: 'twitter',
          name: 'Twitter：',
          tooltip: `(https://twitter.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Twitter${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://twitter.com/',
          value: ''
        },
        {
          symbol: 'Facebook',
          icon: 'fb',
          name: 'Facebook：',
          tooltip: `(https://facebook.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Facebook${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://facebook.com/',
          value: ''
        },
        {
          symbol: 'Github',
          icon: 'github1',
          name: 'Github：',
          tooltip: `(https://github.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Github${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://github.com/',
          value: ''
        }
      ]
    }
  },
  computed: {
    iconName() {
      const socialFillter = this.social.filter(i => i.symbol === this.icon)
      return socialFillter[0].icon
    },
    link() {
      const socialFillter = this.social.filter(i => i.symbol === this.icon)
      return socialFillter[0].url
    }
  }
}
</script>

<style lang="less" scoped>
.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: @black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: @white;
  &:hover {
    &.Email {
      background: #542de0;
    }
    &.QQ {
      background: #5EAADE;
    }
    &.Wechat {
      background: #00C800;
    }
    &.Weibo {
      background: #FF003D;
    }
    &.Telegram {
      background: #32A8E5;
    }
    &.Twitter {
      background: #5EAADE;
    }
    &.Facebook {
      background: #3B5998;
    }
    &.Github {
      background: #882592;
    }
  }
  a {
    color: @white;
    outline: none;
  }
}
</style>
