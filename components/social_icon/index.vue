<template>
  <div class="social-icon" :class="icon">
    <el-tooltip v-if="showTooltip" effect="dark" :content="content" placement="top">
      <a v-if="link" :href="link + '/' + content" target="_blank">
        <svg-icon :icon-class="iconName" />
      </a>
      <svg-icon v-else :icon-class="iconName" />
    </el-tooltip>
    <svg-icon v-else :icon-class="iconName" />
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
          symbol: 'QQ',
          icon: 'qq1',
          name: 'QQ：',
          tooltip: '',
          placeholder: 'QQ帐号',
          url: '',
          value: ''
        },
        {
          symbol: 'Wechat',
          icon: 'wechat',
          name: '微信：',
          tooltip: '',
          placeholder: '微信号',
          url: '',
          value: ''
        },
        {
          symbol: 'Weibo',
          icon: 'weibo1',
          name: '微博：',
          tooltip: '(https://www.weibo.com/<span>帐号</span>)',
          placeholder: '微博用户名(不需要完整URL)',
          url: 'https://www.weibo.com',
          value: ''
        },
        {
          symbol: 'Telegram',
          icon: 'tg',
          name: 'Telegram：',
          tooltip: '',
          placeholder: 'Telegram用户名',
          url: '',
          value: ''
        },
        {
          symbol: 'Twitter',
          icon: 'twitter1',
          name: 'Twitter：',
          tooltip: '(https://twitter.com/<span>帐号</span>)',
          placeholder: 'Twitter用户名(不需要完整URL)',
          url: 'https://twitter.com',
          value: ''
        },
        {
          symbol: 'Facebook',
          icon: 'fb',
          name: 'Facebook：',
          tooltip: '(https://facebook.com/<span>帐号</span>)',
          placeholder: 'Facebook用户名(不需要完整URL)',
          url: 'https://facebook.com',
          value: ''
        },
        {
          symbol: 'Github',
          icon: 'github1',
          name: 'Github：',
          tooltip: '(https://github.com/<span>帐号</span>)',
          placeholder: 'Github用户名(不需要完整URL)',
          url: 'https://github.com',
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
