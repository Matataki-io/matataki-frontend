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
                placeholder="请输入内容"
                size="small"
                max="20"
                class="tag-input-search"
                @select="handleSelect"
                @keyup.enter.native="addTag"
              />
              <!-- <input
                ref="tagRef"
                v-model="tagVal"
                class="tag-input"
                type="text"
                maxlength="20"
                @keyup.enter="addTag"
              >
              <ul v-if="searchResultTags.length > 0">
                <li
                  v-for="(item, index) in searchResultTags"
                  :key="index"
                  @click="$emit('addTag', { tag: item.trim() })"
                >
                  {{ item }}
                </li>
              </ul> -->
            </div>
            <span class="tag-tip">{{
              $t("press-enter-to-create-the-label")
            }}</span>
          </div>
        </li>
      </ul>
    </div>
    <h5 class="hot-tag">推荐标签</h5>
    <ul class="hot-tag-item">
      <li
        v-for="(item, index) in hotTags"
        :key="index"
        @click="$emit('addTag', { tag: item.trim() })"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { debounce } from 'lodash'

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
      hotTags: [], // 推荐标签
      searchResultTags: [],
    }
  },
  watch: {
    // 监听tag设置width
    tagVal(val) {
      try {
        const tagContainer = this.$refs.tagRef
        console.log('tagContainer', tagContainer)
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

      // this.searchTag(val)
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
          this.hotTags = result.data.map(i => i.name)
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    // 添加标签
    addTag() {
      const val = this.tagVal.trim()
      if (val) {
        this.$emit('addTag', { tag: val })
        this.tagVal = ''
      }
    },
    // 搜索tag
    searchTag: debounce(async function (val) {
      const params = {
        word: val.trim(),
        pagesize: 10,
      }
      const res = await this.$API.searchDbTag(params)
      if (res.code === 0) {
        const list = res.data.list.map((i) => i.name)
        this.searchResultTags = list
      }
    }, 300),
    async querySearchAsync(queryString, cb) {
      if (queryString.trim()) {
        const res = await this.$utils.factoryRequest(this.$API.searchDbTag({
          word:  queryString.trim(),
          pagesize: 5
        }))

        if (!res) {
          cb([])
          return
        }
        let list = res.data.list.map(i => {
          return {
            ...i,
            'value' : i.name
          }
        })
        cb(list)
      } else {
        cb([])
      }
    },
    handleSelect(item) {
      console.log(item)
      this.addTag()
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