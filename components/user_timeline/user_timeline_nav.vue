
<template>
  <div v-loading="switchLoding" class="user-mark">
    <nav class="user-mark-nav">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="user-mark-nav-tab"
        :class="tab === item.value && 'active'"
        @click="updateQuery('tab', item.value)"
      >
        {{ item.label }}
      </div>
    </nav>
    <p v-if="screenName">
      <svg-icon icon-class="twitter" />
      Twitter:
      <a :href="`https://twitter.com/${screenName}`" target="_blank">
        @{{ screenName }}
      </a>
    </p>
    <el-dropdown
      v-if="screenName && isMe($route.params.id)"
      trigger="click"
      class="clickablebox"
      @command="dropdownCommand"
    >
      <span class="clickable">
        <i class="el-icon-more" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="closeTimeline">
          关闭推文同步
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
  props: {
    screenName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      switchLoding: false,
      tabs: [
        {
          label: 'twitter',
          value: 'twitter'
        },
        {
          label: 'bilibili',
          value: 'bilibili'
        },
        {
          label: 'mastodon',
          value: 'mastodon'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    tab () {
      return this.$route.query.tab || 'twitter'
    }
  },
  methods: {
    async switchUserTimeLine(timelineSwitch = 1) {
      try {
        this.switchLoding = true
        await this.$API.setTwitterUserTimeLineSwitch(timelineSwitch)
        this.$message.success(this.$t('success.success'))
        this.$router.go(0)
      }
      catch (e) {
        console.error('[switch user timeline failure] Error:', e)
        this.$message.error(this.$t('error.fail'))
        this.switchLoding = false
      }
    },
    async dropdownCommand(command) {
      if(command === 'closeTimeline') {
        await this.switchUserTimeLine(0)
      }
    },
    /** 更改 Query */
    updateQuery (key, val) {
      const query = { ...this.$route.query }
      if (query[key] !== val) {
        if (!val) delete query[key]
        else query[key] = val
        this.$router.replace({ query }).catch(e => { // 过滤掉不必要的错误
          if (!e.message.includes('Avoided redundant navigation to current location')) {
            console.error(e.message)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-mark {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: black;
  background: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  height: 58px;
  padding:  0 20px;
  @media screen and (max-width: 580px) {
    overflow-x: auto;
  }

  p {
    color: black;
    margin: 0 0 0 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    font-size: 14px;
    svg {
      color: #1b95e0;
      margin-right: 5px;
    }
    a {
      color: #1b95e0;
      text-decoration: none;
      font-size: 14px;
      &:hover {
        color: #1b95e0;
        text-decoration: underline;
      }
    }
    @media screen and (max-width: 580px) {
      display: none;
    }
  }
  .clickablebox {
    margin-left: 5px;
  }
  .clickable {
    padding: 0 5px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    color: #99a2aa;
    line-height: 26px;
    font-size: 12px;
    white-space: nowrap;
    &:hover {
      color: #542DE0;
      background: #e5e9ef;
    }
  }

  &-nav {
    flex: 1;
    display: flex;
    height: 58px;

    @media screen and (max-width: 400px) {
      flex: 0;
    }

    &-tab {
      color: black;
      font-size: 18px;
      line-height: 22px;
      height: 58px;
      width: 95px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 2px solid #00000000;
      border-bottom: 2px solid #00000000;
      cursor: pointer;
      margin-left: 10px;

      &:nth-child(1) {
        margin-left: 0;
      }

      &.active {
        cursor: default;
        color: #542DE0;
        border-bottom: 2px solid #542DE0;
      }
    }
  }
}
</style>
