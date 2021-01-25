<template>
  <el-autocomplete
    v-model="value"
    class="search-token"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholder || $t('please-enter-search-content')"
    size="small"
    clearable
    @clear="clear"
    @select="handleSelect"
    @keyup.enter.native="searchTag"
  >
    <template slot-scope="{ item }">
      <div class="fl ac">
        <c-avatar class="token-logo" :src="logo(item.logo)" />
        <span class="token-name">{{ item.symbol }} - {{ item.name }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    // 接口地址 对应后端api
    apiUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    // 自动搜索
    async querySearchAsync(queryString, cb) {
      if (queryString.trim()) {
        const res = await this.$utils.factoryRequest(this.$API.searchDb(this.apiUrl, { 
          word:  this.value.trim(),
          pagesize: 5
        }))

        if (!res) {
          cb([])
          return
        }
        let list = res.data.list.map(i => {
          return {
            ...i,
            'value' : i.symbol
          }
        })
        cb(list)
      } else {
        cb([])
      }
    },
    // 备选项选择
    handleSelect(item) {
      if (item && item.value) {
        this.$emit('search', item.value)
      }
    },
    // 搜索tag enter event
    searchTag() {
      this.$emit('search', this.value.trim())
    },
    clear() {
      this.$emit('clear')
    },
    logo(logo) {
      return logo ? this.$ossProcess(logo, { h: 60 }) : ''
    },
  }
}
</script>

<style lang="less" scoped>
.token-logo {
  flex: 0 0 30px;
}
.token-name {
  font-size: 14px;
  color: #333;
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>