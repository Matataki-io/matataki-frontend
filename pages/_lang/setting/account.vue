<template>
  <userLayout>
    <template slot="main">
      <userNav nav-list-url="setting" />
      <div class="list">
        <div v-for="(item, idx) in accountList" :key="idx" :class="[item.type, item.status && 'bind']" @click="buildAccount(item.type)" class="list-account">
          <svg-icon :icon-class="item.icon" class="icon" />
          <span class="typename">{{ item.typename }}</span>
          <span class="username">{{ item.username }}</span>
          <span class="close">取消绑定</span>
          <svg-icon icon-class="correct" class="correct" />
          <svg-icon icon-class="close_thin" class="close_thin" />
        </div>
      </div>
    </template>
    <template slot="info">
      <userInfo :is-setting="true" />
    </template>
  </userLayout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'

export default {
  components: {
    userLayout,
    userInfo,
    userNav
  },
  data() {
    return {
      accountList: [
        {
          type: 'email',
          icon: 'email', // 随时可换 防止影响
          typename: '邮箱',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          status: false
        },
        {
          type: 'wechat',
          icon: 'wechat', // 随时可换 防止影响
          typename: '微信',
          username: '123456****342343423434234342343423434234', // 最好后端混淆后返回
          redirect: '??????????????',
          status: true
        },
        {
          type: 'eth',
          icon: 'eth', // 随时可换 防止影响
          typename: 'ETH',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          status: false
        },
        {
          type: 'eos',
          icon: 'eos', // 随时可换 防止影响
          typename: 'EOS',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          status: false
        },
        {
          type: 'ont',
          icon: 'ont', // 随时可换 防止影响
          typename: 'ONT',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          status: true
        },
        {
          type: 'github',
          icon: 'github', // 随时可换 防止影响
          typename: 'Github',
          username: '123456****34234', // 最好后端混淆后返回
          redirect: '??????????????',
          status: false
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    buildAccount(type) {
      console.log(type)
      if (type === 'github') {
        this.$router.push({
          name: 'login-github',
          query: {
            from: 'buildAccount'
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  margin-left: 10px;
}
.list-account {
  display: flex;
  align-items: center;
  width: 335px;
  // height: 40px;
  background-color: #eee;
  color: #fff;
  border-radius:6px;
  margin: 20px 0;
  padding: 9px 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all .2s;

  &.email {
    background-color:#542DE0;
    &:hover {
      background-color: mix(#000, #542DE0, 20%);
    }
      .icon {
      font-size: 20px
    }
  }
    &.wechat {
    background-color:#00C800;
        &:hover {
      background-color: mix(#000, #00C800, 20%);
    }
       .icon {
      font-size: 20px
    }
  }
    &.eth {
    background-color:#6C7AB7;
         &:hover {
      background-color: mix(#000, #6C7AB7, 20%);
    }
       .icon {
      font-size: 20px
    }

  }
    &.eos {
    background-color:#333333;
         &:hover {
      background-color: mix(#000, #333, 20%);
    }
       .icon {
      font-size: 20px
    }
  }
    &.ont {
    background-color:#4D9AFD;
         &:hover {
      background-color: mix(#000, #4D9AFD, 20%);
    }
       .icon {
      font-size: 20px
    }
  }
    &.github {
    background-color:#882592;
         &:hover {
      background-color: mix(#000, #882592, 20%);
    }
       .icon {
      font-size: 20px
    }
  }
  .typename, .close {
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:22px;
    margin-left: 4px;
  }
  .username {
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:22px;
    margin-left: 10px;
    margin-right: 40px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: none;
  }
  .correct {
    font-size: 16px;
    display: none;
  }
  .close {
    display: none;
    flex: 1;
  }
  .close_thin {
    font-size: 16px;
    display: none;
  }
  &.bind {
    .correct, .username {
      display: block;
    }
    &:hover {
      .username, .correct {
        display: none;
      }
      .close, .close_thin {
        display: block;
      }
    }
  }
}
</style>
