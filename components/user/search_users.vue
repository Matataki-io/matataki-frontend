<template>
  <div>
    <el-select
      v-model="userVal"
      filterable
      remote
      reserve-keyword
      :placeholder="placeholder"
      :remote-method="userRemoteMethod"
      :loading="userLoading"
      style="width: 100%;"
      @change="userValChange"
    >
      <el-option
        v-for="item in userList"
        :key="item.id"
        :label="searchUsername(item.nickname, item.username)"
        :value="item.id"
      >
        <div class="fl ac">
          <c-avatar :src="cover(item.avatar)" />
          <span class="username">{{ searchUsername(item.nickname, item.username) }}</span>
        </div>
      </el-option>
    </el-select>
    <!-- 常用候选对象列表 -->
    <div v-if="historyUser.length !== 0" class="history-user">
      <el-tag
        v-for="item in historyUser"
        :key="item.id"
        type="info"
        class="history-user__tag"
        size="small"
        @click="continueUser(item)"
      >
        {{
          (item.nickname || item.username).length > 20
            ? `${(item.nickname || item.username).slice(0, 20)}...`
            : item.nickname || item.username
        }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { filterOutHtmlTags } from '@/utils/xss'

export default {
  components: {
  },
  model: {
    prop: 'userData'
  },
  props: {
    userData: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: '请输入关键词'
    }
  },
  data() {
    return {
      historyUser: [], // 历史转让用户
      userVal: '',
      userLoading: false,
      userList: [] // 用户列表
    }
  },
  // computed: {},
  watch: {
    userData() {
      this.initUser()
    }
  },
  created() {
    this.historyUserFunc('token')
    this.initUser()
  },
  // mounted() {},
  methods: {
    initUser() {
      if (!this.userData) return
      this.userVal = this.userData.nickname || this.userData.username
      this.userList = [this.userData]
    },
    // 用户远程搜索方法
    userRemoteMethod(query) {
      if (query !== '') {
        this.userLoading = true

        const params = {
          word: query,
          pagesize: 10
        }

        this.$API.search('user', params).then(res => {
          if (res.code === 0 && res.data.list.length !== 0) {
            this.userList = res.data.list
          } else {
            console.log(res.message)
            this.userList = []
          }
        }).catch(err => {
          console.log(err)
          this.userList = []
        }).finally(() => {
          this.userLoading = false
        })

      } else {
        this.userList = []
      }
    },
    // 用户改变事件
    userValChange(val) {
      console.log(val)
      this.$emit('input', this.userList.find(user => user.id === val) || { id: val })
    },
    // 搜索用户名
    searchUsername(nickname, username) {
      let name = nickname || username
      return name ? filterOutHtmlTags(name) : ''
    },
    // logo
    cover(cover) {
      return cover ? this.$ossProcess(cover) : ''
    },
    continueUser(val) {
      console.log(val)
      this.$emit('input', val)
      this.userVal = val.nickname || val.username
      this.userList = [val]
    },
    // 获取常用用户列表
    historyUserFunc(type) {
      this.$API.historyUser({
        type
      }).then(res => {
        if (res.code === 0) {
          this.historyUser = res.data.slice(0, 10)
        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },

  }
}
</script>

<style lang="less" scoped>
.history-user {
  &::after {
    display: block;
    content: '';
    width: 0;
    height: 0;
    clear: both;
  }
}
.history-user__tag {
  cursor: pointer;
  margin: 10px 10px 0 0;
  float: left;
}
.username {
  margin: 0 0 0 10px;
  font-size: 14px;
  font-weight: 400;
}
</style>
