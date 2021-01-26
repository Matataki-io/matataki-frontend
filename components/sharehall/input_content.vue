<template>
  <div class="container-input">
    <div class="container-tribute">
      <client-only>
        <vue-tribute
          :options="tributeOptions"
          @tribute-no-match="noMatchFound"
          @tribute-replaced="tributeReplaced"
        >
          <div
            id="tributeShare"
            class="content-editable"
            contenteditable="true"
            placeholder="谈谈感想"
          />
        </vue-tribute>
      </client-only>
    </div>
    <div class="input-footer">
      <div class="i-f-info">
        <span class="info-status">
          <span :style="{ color: currentText > totalText ? 'red' : '' }">{{ currentText }}</span>/{{ totalText }}</span>
        <div class="emoji-container">
          <svg-icon icon-class="emoji" class="icon" @click.stop="emoji = !emoji" />
          <client-only>
            <picker
              v-show="emoji"
              title="Pick your emoji…"
              emoji="point_up"
              class="emoji-picker"
              @select="addEmoji"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'
import VueTribute from '@/plugins/vue-tribute.js'
import debounce from 'lodash/debounce'

export default {
  components: {
    VueTribute,
    Picker,
  },
  props: {
    totalText: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      emoji: false,
      loadingSubmit: false,
      currentText: 0,
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
      timer: null,
      // handleEventClick: null
    }
  },
  mounted() {
    if (process.browser) {
      this.timer = setInterval(this.handleCurrentText, 2000)
      // this.handleEventClick = (e) => {
      //   console.log(e)
      //   this.emoji = false
      // }
      // document.addEventListener('click', this.handleEventClick, false)
    }
  },
  destroyed() {
    if (process.browser) {
      clearInterval(this.timer)
      // document.removeEventListener(this.handleEventClick)
    }
  },
  methods: {
    noMatchFound() {
      console.log('No matches found!')
    },
    tributeReplaced(e) {
      console.log(
        'Original event that triggered text replacement:',
        e.detail.event
      )
      console.log('Matched item:', e.detail.item)
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
    // 处理当前文本 （获取长度）
    handleCurrentText() {
      let editDom = document.querySelector('.content-editable')
      let editDomText = editDom.innerText
      this.currentText = editDomText.length
    },
    // 添加 Emojii
    addEmoji(emoji) {
      let editDom = document.querySelector('.content-editable')
      editDom.insertAdjacentHTML('beforeend', emoji.native)

      // console.log('emoji', emoji)
    },
    // test xss
    // test() {
    //   let editDom = document.querySelector('.content-editable')
    //   let editDomContent = editDom.innerHTML.toString()

    //   const html = filterOutHtmlShare(editDomContent)
    //   console.log(html)
    // }
  },
}
</script>

<style lang="less">
// .scroll {
//   width: 100%;
//   max-height: 300px;
//   overflow-y: auto;
//   position: relative;
// }
.container {
  // max-width: 355px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
}
.v-tribute {
  width: 100%;
  position: relative;
}
// input[type="text"],
.content-editable {
  appearance: none;
  border: none;
  box-sizing: border-box;
  padding: 1rem 1rem;
  color: #666;
  width: 100%;
  height: 120px;
  overflow: auto;
  border-radius: 0.25rem;
  font-size: 14px;
  outline: none;
  &:focus {
    background: #fff;
  }
}
.content-editable:empty:before {
  content: attr(placeholder);
  display: block;
  color: #666;
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
.container-tribute {
  background: #fff;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  border-radius: 3px;
  min-height: 120px;
}
.container-input {
  // max-width: 700px;
  margin: 0 auto;
}
.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}
.emoji-container {
  position: relative;
  .icon {
    padding: 10px;
    cursor: pointer;
    font-size: 20px;
  }
}
.emoji-picker {
  position: absolute;
  left: 0px;
  top: 36px;
  z-index: 9;
}
.i-f-info {
  display: flex;
  align-items: center;
}
.info-status {
  font-size: 14px;
  color: #696969;
}
</style>