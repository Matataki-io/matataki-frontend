<template>
  <div>
    <!-- 复制了一份 来区别是否支持刷新 目前没有想到别的好办法 -->
    <!-- 负责刷新 -->
    <van-pull-refresh v-if="isRefresh" v-model="refreshing" @refresh="refresh">
      <slot></slot>
    </van-pull-refresh>
    <slot v-else></slot>
    <!-- 负责滚动 -->
    <InfiniteLoading
      ref="infiniteLoading"
      :identifier="infiniteId"
      spinner="circles"
      @infinite="infiniteHandler"
    >
      <div slot="no-results" class="pull-message">>{{ loadingTextComputed }}</div>
      <div slot="no-more"></div>
      <div slot="error" slot-scope="{ trigger }">
        <p class="error-message">您的网络似乎不太给力,请稍后重试</p>
        <a class="error-refresh" href="javascript:;" @click="trigger">重新加载</a>
      </div>
    </InfiniteLoading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'BasePull',
  components: {
    InfiniteLoading
  },
  props: {
    // 加载完的文字提示
    loadingText: {
      type: Object,
      default: () => ({
        nomore: '🎉 哇，你真勤奋，所有文章已经加载完了～ 🎉', // 没有更多
        noresults: '无文章' // 没有数据
      })
    },
    // 传进来的params
    params: {
      type: Object
    },
    // api 地址
    apiUrl: {
      type: String,
      required: true
    },
    // 当前聚焦索引
    activeIndex: {
      type: Number,
      default: 0
    },
    // 当前索引
    nowIndex: {
      type: Number,
      default: 0
    },
    // 返回的数据是对象还是数组
    isObj: {
      type: Object,
      default: () => ({
        type: 'Array',
        key: '',
        keys: null
      })
    },
    // 是否支持刷新
    isRefresh: {
      type: Boolean,
      default: true
    },
    // 自动请求时间
    autoRequestTime: {
      type: Number,
      default: 0
    },
    // 是否需要token
    needAccessToken: {
      type: Boolean,
      default: false
    },
    // 显示没有更多icon
    showNoMoreIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refreshing: false, // 刷新
      page: 1, // 分页
      articles: [],
      activeIndexCopy: this.activeIndex,
      infiniteId: new Date()
    }
  },
  computed: {
    loadingTextComputed() {
      if (this.articles.length <= 0) return this.loadingText.noresults
      return this.loadingText.nomore
    }
  },
  watch: {
    // 改变tab
    activeIndex(newVal) {
      this.activeIndexCopy = newVal
      this.page = 1
      this.articles = []
      this.infiniteId += 1
    },
    // 父级请求完参数 刷新滚动分页
    params() {
      this.refresh()
    },
    // 自动请求 通过time++
    autoRequestTime() {
      this.refresh()
    }
  },
  created() {
    this.infiniteId = new Date()
  },
  methods: {
    // 滚动分页
    async infiniteHandler($state, isEmptyArray = false) {
      // 如果传了参数但是为null 阻止请求 场景发生在文章获取分享列表处
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(this.params)) if (!value) return

      // if (this.nowIndex !== this.activeIndexCopy) return;

      const params = this.params || {}
      params.page = this.page
      const url = this.apiUrl

      // 获取数据成功执行
      const getDataSuccess = data => {
        if (isEmptyArray) this.articles.length = 0 // 清空数组
        const isObjType = this.isObj.type // 传进来的类型
        let resDataList = [] // 请求回来的list 通过长度判断是否请求完毕

        if (isObjType === 'Array') {
          // 如果返回的数据是 Array 返回整个 data
          this.articles = [...this.articles, ...data]
          resDataList = data
        } else if (isObjType === 'Object') {
          // 如果返回的是 Object 根据传进来的字段获取相应的 list
          const resData = data[this.isObj.key]
          resDataList = resData
          this.articles = [...this.articles, ...resData]
        } else if (isObjType === 'newObject') {
          // 接口新格式 后面统一格式就能去掉一个判断
          // 如果返回的是 Object 根据传进来的字段获取相应的 list
          let resData = []

          // 根据传来的key 和 keys 判断读取的层数 (接口的数据层级有时候一样需要判断)
          if (!this.isObj.keys) resData = data[this.isObj.key]
          else resData = data[this.isObj.key][this.isObj.keys]

          resDataList = resData

          // 因为接口的数据格式没有统一 这个判断先加在这里 统一格式之后拿出去
          if (data.code === 0) this.articles = [...this.articles, ...resData]
          else throw new Error(data.message)
        }

        this.$emit('getListData', {
          data, // 整个数据
          list: this.articles, // list数据
          index: this.nowIndex // 当前索引
        })
        this.page += 1

        if (resDataList.length >= 0 && resDataList.length < 20) $state.complete()
        else $state.loaded()
      }

      // 获取数据失败执行
      const getDataFail = () => $state.error()

      // 获取数据
      await this.$backendAPI
        .getBackendData({ url, params }, this.needAccessToken)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) getDataSuccess(res.data)
          else getDataFail()
        })
        .catch(err => {
          console.log(err)
          getDataFail()
        })
    },
    // 刷新
    async refresh() {
      const { stateChanger } = this.$refs.infiniteLoading
      // stateChanger.reset();
      this.refreshing = true
      this.page = 1 // 重置分页索引
      await this.infiniteHandler(stateChanger, true)
      this.refreshing = false
    }
  }
}
</script>

<style scoped>
.error-message {
  font-size: 14px;
  color: #6f6f6f;
}
.error-refresh {
  display: inline-block;
  background: #478970;
  color: #fff;
  padding: 10px 20px;
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  margin: 10px 0 0;
  cursor: pointer;
}
/* 加载更多提示 */
.pull-message {
  padding: 20px 0;
  color: #999;
  font-size: 14px;
  text-align: center;
}
</style>
