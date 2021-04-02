<template>
  <div class="comments">
    <client-only>
      <vue-tribute
        :options="tributeOptions"
      >
        <div
          ref="contentEditable"
          class="content-editable"
          contenteditable="true"
          :placeholder="$t('p.commentPointPlaceholder')"
        />
      </vue-tribute>
    </client-only>
  </div>
</template>

<script>
import VueTribute from '@/plugins/vue-tribute.js'
import debounce from 'lodash/debounce'

export default {
  name: 'CommentsInput',
  components: {
    VueTribute
  },
  data() {
    return {
      tributeOptions: { // tribute options
        collection: [
          {
            trigger: '@',
            values: (query, cb) => {
              console.log('query', query)
              if (!query) {
                return cb([])
              }

              return this.searchUser(query, cb)
            },
            loadingItemTemplate: '<div style="padding: 16px">Loading</div>',
            lookup: 'key',
            fillAttr: 'key',
            selectTemplate: function (item) {
              console.log('item', item)
              return `<a
                  class="tribute-mention"
                  contenteditable="false"
                  href="javascript:;"
                  title="${item.original.value}"
                  data-user="${item.original.id}">@${item.original.value}</a>`
            },
          },
          {
            trigger: '#',
            values: (query, cb) => {
              console.log('query', query)
              if (!query) {
                return cb([])
              }

              return this.searchTag(query, cb)
            },
            loadingItemTemplate: '<div style="padding: 16px">Loading</div>',
            lookup: 'key',
            fillAttr: 'key',
            selectTemplate: function (item) {
              console.log('item', item)
              return `<a
                  class="tribute-mention"
                  contenteditable="false"
                  href="javascript:;"
                  title="${item.original.value}"
                  data-tag="${item.original.id}">#${item.original.value}</a>`
            },
          },
        ],
      },
    }
  },
  mounted(){
    if (process.client) {
      // let { contentEditable } = this.$refs
      // console.log('contentEditable', contentEditable)
      // contentEditable.addEventListener('input', this.emitChange, false)
    }
  },
  beforeDestroy() {
    if (process.client) {
      // let { contentEditable } = this.$refs
      // console.log('contentEditable', contentEditable)
      // contentEditable.removeEventListener('input', this.emitChange)
    }
  },
  methods: {
    emitChange() {
      this.$emit('change')
    },
    // 搜索用户
    searchUser: debounce(async function (val, cb) {
      const params = {
        word: val.trim(),
        pagesize: 10,
      }
      const res = await this.$API.search('user', params)
      if (res.code === 0) {
        const list = res.data.list.map((i) => ({
          key: i.nickname || i.username,
          value: i.nickname || i.username,
          id: i.id,
        }))
        return cb(list)
      } else {
        return cb([])
      }
    }, 300),
    // 搜索Tag
    searchTag: debounce(async function (val, cb) {
      const params = {
        word: val.trim(),
        pagesize: 10,
      }
      const res = await this.$API.searchDbTag(params)
      if (res.code === 0) {
        const list = res.data.list.map((i) => ({
          key: i.name,
          value: i.name,
          id: i.id,
        }))
        return cb(list)
      } else {
        return cb([])
      }
    }, 300),
  }
}
</script>

<style lang="less">

// .scroll {
//   width: 100%;
//   max-height: 300px;
//   overflow-y: auto;
//   position: relative;
// }
.v-tribute {
  width: 100%;
  position: relative;
}
.content-editable:empty:before {
  content: attr(placeholder);
  display: block;
  color: #C0C4CC;
}
// textarea {
//   appearance: none;
//   border: none;
//   background: #eee;
//   padding: 1rem;
//   width: 100%;
//   border-radius: 0.25rem;
//   font-size: 16px;
//   height: 100px;
//   outline: none;
//   &:focus {
//     background: #fff;
//   }
// }
// .btn {
//   appearance: none;
//   border: none;
//   cursor: pointer;
//   margin: 20px 0;
//   background: #fc466b;
//   color: #fff;
//   font-size: 16px;
//   padding: 8px 16px;
//   border-radius: 3px;
//   box-shadow: 0 1px 3px rgba(#000, 0.18);
//   &:hover {
//     background: darken(#fc466b, 3%);
//   }
// }
// Tribute-specific styles
.tribute-container {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  max-height: 300px;
  max-width: 500px;
  overflow: auto;
  display: block;
  z-index: 999999;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(#000, 0.13);
}
.tribute-container ul {
  margin: 0;
  margin-top: 2px;
  padding: 0;
  list-style: none;
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgba(#000, 0.13);
  background-clip: padding-box;
  overflow: hidden;
  word-spacing: 2px;
}
.tribute-container li {
  color: #3f5efb;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}
.tribute-container li.highlight,
.tribute-container li:hover {
  background: #3f5efb;
  color: #fff;
}
.tribute-container li span {
  font-weight: bold;
}
.tribute-container li.no-match {
  cursor: default;
}
.tribute-container .menu-highlighted {
  font-weight: bold;
}

.tribute-mention {
  color: #1989fa;
}
</style>

<style lang="less" scoped>
.container-input {
  margin: 0 auto;
  // height: 145px;
  background: #FFFFFF;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  .icon {
    cursor: pointer;
    font-size: 24px;
    color: #657786;
    margin: 0 10px 0 0;
    transition: all ease-in 0.05s;
    &:hover {
      color: @purpleDark;
    }
    &:active {
      transform: scale(0.90);
    }
    @media screen and (max-width: 768px) {
      font-size: 20px;
    }
  }
  .no-poiniter {
    margin: 0 10px 0 0;
    font-size: 24px;
    @media screen and (max-width: 768px) {
      font-size: 20px;
    }
  }
}
.container-tribute {
  background: #fff;
  // border: 1px solid #e4e7ed;
  box-sizing: border-box;
  border-radius: 3px;
  min-height: 63px;
}
// input[type="text"],
.content-editable {
  appearance: none;
  border: none;
  box-sizing: border-box;
  padding: 0;
  color: #666;
  width: 100%;
  min-height: 63px;
  overflow: auto;
  border-radius: 0.25rem;
  font-size: 14px;
  outline: none;
  &:focus {
    background: #fff;
  }
}
.link-item {
  margin-top: 10px;
}
.list-card {
  margin-top: 10px;
  &:nth-child(1) {
    margin-top: 0;
  }
}
.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 0;
}
.emoji-container {
  position: relative;
}

.input-emoji-picker-popover {
  padding: 0;
}
.emoji-picker {
  border: none;
}
.i-f-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.i-f-line {
  height: 20px;
  width: 2px;
  background: #DBDBDB;
  margin: 0 10px;
}
.info-status {
  font-size: 12px;
  color: #B2B2B2;
}
</style>

<style lang="less" scoped>
.comments {
  display: block;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  background-image: none;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);

  max-height: 200px;
  overflow: auto;
  min-height: 75px;
}
</style>