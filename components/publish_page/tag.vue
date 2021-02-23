<template>
  <div>
    <h4 class="set-subtitle">
      <!-- {{ $t('publish.tagTitle') }} -->
      {{ $t("add-tag")
      }}<span
        class="tag"
      >（{{ $t("you-can-also-add-tags", [tagMaxLen - tags.length]) }}）</span>
    </h4>
    <div class="set-content">
      <ul class="tag-list">
        <li
          v-for="(item, index) in tags"
          :key="index"
          class="tag-item"
          @click="$emit('removeTag', { index: index })"
        >
          {{ item }}
          <svg-icon icon-class="close_thin" class="icon" />
        </li>
        <li v-show="tags.length < tagMaxLen">
          <div class="item-input">
            <div class="search-container">
              <el-autocomplete
                ref="tagRef"
                v-model="tagVal"
                :fetch-suggestions="querySearchAsync"
                :placeholder="$t('please-enter-content')"
                size="small"
                max="20"
                class="tag-input-search"
                popper-class="tag-drag-item"
                @select="dragHandleSelect"
                @keyup.enter.native="addTag({ type: 'input' })"
              >
                <template slot-scope="{ item }">
                  <!-- id is -1 默认选择项 -->
                  <div class="item" :class="item.id === -1 && 'fixed'">
                    <svg-icon v-if="(item.id !== -1 && item.type === 'history')" icon-class="tag-time" class="icon" />
                    <svg-icon v-else-if="(item.id !== -1 && item.type === 'hotest')" icon-class="tag-hotest" class="icon" />
                    <svg-icon v-else-if="(item.id !== -1 && item.type === 'tag')" icon-class="tag" class="icon" />
                    {{ item.value }}
                  </div>
                </template>
              </el-autocomplete>
            </div>
            <span class="tag-tip">{{
              $t("press-enter-to-create-the-label")
            }}</span>
          </div>
        </li>
      </ul>
    </div>
    <h5 class="hot-tag">{{ $t('hotest-tag') }}</h5>
    <ul class="hot-tag-item">
      <li
        v-for="(item, index) in hotTags"
        :key="index"
        @click="addTag({ type: 'hotest', data: { name: item.name.trim() } })"
      >
        <svg-icon icon-class="tag-hotest" class="icon" />{{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import store from '@/utils/store.js'

export default {
  props: {
    tagMaxLen: {
      // tag 最大数量
      type: Number,
      required: true,
    },
    tags: {
      // tags 数据
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tagVal: '', // 标签内容
      hotTags: [], // 推荐标签 { id, name, count }
    }
  },
  watch: {
    // 监听tag设置width
    tagVal(val) {
      try {
        const tagContainer = this.$refs.tagRef
        // console.log('tagContainer', tagContainer)
        const tagEl = tagContainer.$el
        // const tag = tagContainer.$children[0].$el

        if (tagContainer) {
          const width = (val.length + 1) * 12

          if (val && width > 104) {
          // tag.style.width = (width <= 282 ? width : 282) + 'px'
            tagEl.style.width = (width <= 282 ? width : 282) + 'px'
          } else {
          // tag.style.width = '104px'
            tagEl.style.width = '104px'
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  },
  mounted() {
    if (process.client) {
      this.hotestTags()
    }
  },
  methods: {
    // 获取热门标签
    async hotestTags() {
      try {
        const result = await this.$API.hotestTags()
        if (result.code === 0) {
          this.hotTags = result.data
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    // 记录 Tag 历史
    tagHistory(val) {
      try {
        let tagHistory = store.get('tagHistory')
        // console.log('tagHistory', tagHistory)
        let list = []
        if (tagHistory) {
          list = JSON.parse(tagHistory)
          // max 10
          if (list.length >= 10) {
            list.shift()
          }
          list.push(val)
        } else {
          list = [ val ]
        }
        store.set('tagHistory',  JSON.stringify(list))
      } catch (error) {
        console.log(error)
        store.remove('tagHistory')
      }
    },
    // 添加标签方法
    addTag({ type, data = {} }) {
      // 输入框添加标签
      const _inputAddTagFn = (val) => {
        if (val) {
          this.$emit('addTag', { tag: val })
          this.tagVal = ''
        }

        this.tagHistory(val)
      }

      if (type === 'input') {
        _inputAddTagFn(this.tagVal.trim())
      } else if (type === 'drag') {
        // 默认选择项
        if (data.id === -1) {
          // data { id: -1, name: value, value: value }
          this.$emit('addTag', { tag: data.name })
          this.tagVal = ''
        } else {
          _inputAddTagFn(this.tagVal.trim())
        }
      } else if (type === 'hotest') {
        // data { name: value }
        this.$emit('addTag', { tag: data.name })
      } else {
        console.log('other')
      }
    },
    // 搜索tag
    async querySearchAsync(queryString, cb) {
      let queryStringTrim = queryString.trim()
      if (queryStringTrim) {
        const res = await this.$utils.factoryRequest(this.$API.searchDbTag({
          word:  queryStringTrim,
          pagesize: 5
        }))
        let empty = {
          id: -1,
          name: queryStringTrim,
          value: `创建“${queryStringTrim}”标签`
        }
        if (!res) {
          cb([empty])
          return
        }

        // { id, name, value }
        let list = res.data.list.map(i => {
          return {
            ...i,
            'value' : i.name,
            type: 'tag'
          }
        })

        let _mergendList = this.mergedTagList({ query: queryStringTrim, data: list })
        _mergendList.unshift(empty)
        cb(_mergendList)
      } else {
        let _list = this.mergedTagList({ query: '', data: [] })
        cb(_list)
      }
    },
    // 搜索标签选择
    dragHandleSelect(item) {
      console.log('dragHandleSelect', item)
      this.addTag({ type: 'drag', data: item })
    },
    // 合并数组 tag 数据
    // 1. 优先展示我历史输入过的标签
    // 2. 展示当前热门的标签
    // 3. 最后展示其他标签
    // 1 2， 3 1 2 简单合并 数据库搜索的已经是匹配的数据只需要在搜索的时候对 1 2 匹配即可
    mergedTagList({ query = '', data = [] }) {
      let _historyList = []
      let _hotestList = this.hotTags.map(i => ({ ...i, value: i.name, type: 'hotest' }))

      try {
        let tagHistory = store.get('tagHistory')
        let list = JSON.parse(tagHistory)
        let listReverse = list.reverse()
        _historyList = listReverse.map(i => ({ id: 0, name: i, value: i, type: 'history' }))
      } catch (error) {
        console.log('error', error)
      }

      if (query) {
        const list = _historyList.concat(_hotestList)
        const queryLower = query.toLocaleLowerCase()
        const listSearchFn = i => {
          let str = (i.name).toLocaleLowerCase()
          return str.search(queryLower) !== -1
        }
        let listSearch = list.filter(listSearchFn)

        return data.concat(listSearch)
      }
      return _historyList.concat(_hotestList)
    }
  },
}
</script>

<style lang="less" scoped>
.set-subtitle {
  font-size: 14px;
  font-weight: 400;
  margin: 10px 0;
  padding: 0;
}

// tag
.tag-list {
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;

  li {
    display: inline-block;
    margin-top: 12px;
  }
}

.tag-item {
  color: #fff;
  background: #542de0;
  border: none;
  border-radius: 16px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  padding: 0 15px;
  margin-right: 12px;
  position: relative;
  font-size: 12px;
  font-weight: 400;
  transition: all 0.2s;
  user-select: none;

  .icon {
    display: none;
    font-size: 12px;
    line-height: 30px;
  }

  &:hover {
    padding-right: 25px;
    background-color: mix(#542de0, #fff, 90%);
    transition-duration: 0.2s;

    .icon {
      display: inherit;
      margin-right: -12px;
      margin-left: 4px;
    }
  }
}

.tag-input {
  border-radius: 20px;
  padding: 0 15px;
  line-height: 30px;
  height: 30px;
  width: 104px;
  border: 1px solid #ccd0d7;
  box-sizing: border-box;
  transition: color 0.2s ease, background-color 0.2s ease,
  border-color 0.2s ease;
  outline: none;
  color: #333;
  font-size: 12px;
  font-weight: 400;

  &:focus {
    border-color: rgb(84, 45, 224);
  }
}
.tag-input-search {
  width: 104px;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 400;
  /deep/ .el-input__inner {
    border-radius: 20px;
  }
}

.tag-tip {
  color: #99a2aa;
  line-height: 30px;
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
}

.hot-tag {
  font-size: 14px;
  font-weight: 400;
  color: #b2b2b2;
  padding: 0;
  margin: 20px 0 10px;
}
.hot-tag-item {
  padding: 0;
  margin: 0;
  li {
    font-size: 14px;
    font-weight: 500;
    color: #542de0;
    display: inline-block;
    margin-right: 20px;
    padding: 0;
    cursor: pointer;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    .icon {
      margin-right: 6px;
    }
  }
}
.item-input {
  display: flex;
  align-items: center;
}

.search-container {
  position: relative;
  ul {
    padding: 0;
    margin: 0;
    position: absolute;
    left: 0;
    top: 40px;
    background: #fff;
    border: 1px solid #542ddf;
    z-index: 10;
    li {
      display: flex;
      margin: 0;
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: #542ddf;
        color: #fff;
      }
    }
  }
}
</style>

<style lang="less">
.tag-drag-item {
  border: 1px solid #542ddf;
  width: auto !important;
  ul li {
    padding-right: 5px;
    padding-left: 5px;
    .item {
      .icon {
        margin-right: 6px;
      }
      font-size: 14px;
      font-weight: 500;
      color: #542de0;
      padding-right: 5px;
      padding-left: 5px;
      &.fixed {
        background: #EBE6FF;
        border-radius: 4px;
      }
    }
    &:hover {
      background: #EBE6FF;
    }
  }
  .popper__arrow {
    border-bottom-color: #542ddf !important;
  }
}
</style>