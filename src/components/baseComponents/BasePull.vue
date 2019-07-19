<template>
  <!-- 复制了一份 来区别是否支持刷新 目前没有想到别的好办法 -->
  <van-pull-refresh v-if="isRefresh" v-model="refreshing" @refresh="refresh">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :immediate-check="immediateCheck"
      @load="onLoad"
    >
      <slot></slot>
      <div class="no-more">
        <img
          v-if="showNoMoreIcon && articles.length === 0"
          src="@/assets/img/icon_no_more.svg"
          alt="no_more"
        />
        <p v-if="finished && articles.length === 0" :class="showNoMoreIcon && 'big'">
          {{ loadingText }}
        </p>
      </div>
    </van-list>
  </van-pull-refresh>
  <van-list
    v-else
    v-model="loading"
    :finished="finished"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    :immediate-check="immediateCheck"
    @load="onLoad"
  >
    <slot></slot>
    <div class="no-more">
      <img
        v-if="showNoMoreIcon && articles.length === 0"
        src="@/assets/img/icon_no_more.svg"
        alt="no_more"
      />
      <p v-if="finished && articles.length === 0" :class="showNoMoreIcon && 'big'">
        {{ loadingText }}
      </p>
    </div>
  </van-list>
</template>

<script>
export default {
  name: 'BasePull',
  props: {
    // 加载完的文字提示
    loadingText: {
      type: String,
      default: ''
    },
    // 传进来的params
    params: {
      type: Object,
      default: () => {}
    },
    // api 地址
    apiUrl: {
      type: String,
      required: true
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
    },
    // 是否在初始化时立即执行滚动位置检查
    immediateCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      refreshing: false, // 刷新
      page: 1, // 分页
      articles: [],
      loading: false,
      finished: false,
      error: false,
      oldPage: 0 // 上一页
    }
  },
  watch: {
    // 父级请求完参数 刷新滚动分页
    params() {
      console.log('params', this.params)
      this.refresh()
    },
    // 自动请求 通过time++
    autoRequestTime() {
      console.log('autoRequestTime')
      this.refresh()
    }
  },
  created() {},
  methods: {
    // 滚动分页
    async onLoad(isEmptyArray = false) {
      // console.log("开始分页");
      // 如果传了参数但是为null 阻止请求 场景发生在文章获取分享列表处
      for (const [key, value] of Object.entries(this.params)) if (!value) return
      const params = this.params || {}
      params.page = this.page
      const url = this.apiUrl

      // hack 手段
      // 1. params改变会加载一次, 关闭了自动加载但是还是自动加载了一次(当内容比较少的时候) 如果内容多是正常的
      // 2. 通过对比两次请求页数是否相同来return
      if (this.page === this.oldPage) return
      this.oldPage = this.page
      // hack end

      // 获取数据成功执行
      const getDataSuccess = (data, isEmptyArray) => {
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
        this.loading = false

        if (resDataList.length >= 0 && resDataList.length < 20) this.finished = true
      }

      // 获取数据失败执行
      const getDataFail = () => (this.error = true)
      // 获取数据
      try {
        const res = await this.$backendAPI.getBackendData({ url, params }, this.needAccessToken)
        if (res.status === 200 && res.data.code === 0) getDataSuccess(res.data, isEmptyArray)
        else getDataFail()
      } catch (error) {
        console.log(error)
        getDataFail()
      }
    },
    // 刷新
    async refresh() {
      this.refreshing = true
      this.page = 1 // 重置分页索引
      this.loading = false
      this.finished = false
      this.error = false
      this.oldPage = 0
      await this.onLoad(true)
      this.refreshing = false
    }
  }
}
</script>

<style scoped lang="less">
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
.no-more {
  text-align: center;
  margin-top: 40px;
  p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 28px;
    padding: 0;
    margin: 20px 0 0;
    &.big {
      font-size: 20px;
    }
  }
}
</style>
