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
            placeholder="..."
          />
        </vue-tribute>
      </client-only>
    </div>
    <div class="input-footer">
      <div class="i-f-info">
        <span class="info-status">{{ currentText }}/{{ totalText }}</span>
        <div class="emoji-container">
          <svg-icon icon-class="emoji" class="icon" @click="emoji = !emoji" />
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
      <el-button v-loading="loadingSubmit" size="small" @click="handleSubmit">
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'
import VueTribute from '@/plugins/vue-tribute.js'
import debounce from 'lodash/debounce'
// import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'

import { filterOutHtmlShare } from '@/utils/xss'
export default {
  components: {
    VueTribute,
    Picker,
  },
  data() {
    return {
      emoji: false,
      loadingSubmit: false,
      totalText: 500,
      currentText: 0,
      tributeOptions: {
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
        ],
      },
      timer: null
    }
  },
  mounted() {
    if (process.browser) {
      this.timer = setInterval(this.handleKeydown, 2000)
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined'])
  },
  destroyed() {
    if (process.browser) {
      clearInterval(this.timer)
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
    handleKeydown() {
      let editDom = document.querySelector('.content-editable')
      let editDomText = editDom.innerText
      this.currentText = editDomText.length
    },
    async handleSubmit() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }

      this.loadingSubmit = true
      let editDom = document.querySelector('.content-editable')
      let editDomContent = editDom.innerHTML.toString()
      console.log('editDom', editDom.innerHTML)

      const idProvider = getCookie('idProvider')
      const { name: author = '' } = this.currentUserInfo

      const data = {
        author: author,
        content: filterOutHtmlShare(editDomContent),
        platform: idProvider.toLocaleLowerCase(),
        refs: [
          {
            cover: null,
            summary: '分享图片测试3',
            title: null,
            url: 'https://test.smartsignature.io/share/102331',
          },
        ],
      }
      const res = await this.$API.createShare(data)
      try {
        if (res.code === 0) {
          this.$message({ message: '发布成功', type: 'success' })
        } else {
          throw new Error(res)
        }
      } catch (e) {
        console.log(e.toString())
        this.$message({ message: '发布失败', type: 'error' })
      }
      this.loadingSubmit = false
    },
    addEmoji(emoji) {
      let editDom = document.querySelector('.content-editable')
      editDom.insertAdjacentHTML('beforeend', emoji.native)

      console.log('emoji', emoji)
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
  font-size: 16px;
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
  // min-height: 140px;
  background: #fff;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  border-radius: 3px;
}
.container-input {
  // max-width: 700px;
  margin: 20px auto 0;
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
  top: 30px;
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