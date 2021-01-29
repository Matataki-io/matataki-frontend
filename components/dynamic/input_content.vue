<template>
  <div class="container-input">
    <!-- 输入框 -->
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
            placeholder="输入你想要发表的动态吧～"
          />
        </vue-tribute>
      </client-only>
    </div>
    <!-- 分享链接 -->
    <div v-if="shareLinkList.length > 0" class="link-item">
      <template v-for="(item, index) in shareLinkList">
        <shareOuterCard
          v-if="item.ref_sign_id === 0"
          :key="'shareInsideCard' + index"
          :card="item"
          :idx="index"
          class="list-card"
          @removeShareLink="removeShareLink"
        />
        <sharePCard
          v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
          :key="'shareInsideCard' + index"
          :card="item"
          :idx="index"
          class="list-card"
          @removeShareLink="removeShareLink"
        />
        <shareInsideCard
          v-else-if="item.ref_sign_id && item.channel_id === 3"
          :key="'shareOuterCard' + index"
          :card="item"
          :idx="index"
          class="list-card"
          @removeShareLink="removeShareLink"
        />
      </template>
    </div>
    <!-- 操作区域 -->
    <div class="input-footer">
      <div class="i-f-info">
        <svg-icon icon-class="at" class="icon" @click.stop="showMenuForCollection(0)" />
        <svg-icon icon-class="topic" class="icon" @click.stop="showMenuForCollection(1)" />
        <shareLink :share-link-list="shareLinkList" @pushItem="item => shareLinkList.push(item.data)">
          <svg-icon icon-class="link1" class="icon" />
        </shareLink>
        <div class="emoji-container">
          <svg-icon icon-class="emoji1" class="icon" @click.stop="emoji = !emoji" />
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
        <uploadMedia
          v-model="mediaList"
          :visible-state.sync="uploadMediaVisible"
          @uploading="item => mediaUploading = item"
        >
          <svg-icon icon-class="image" class="icon" />
        </uploadMedia>
      </div>
      <div class="fl ac">
        <span class="info-status">
          <span :style="{ color: currentText > totalText ? 'red' : '' }">{{ currentText }}</span>/{{ totalText }}
        </span>
        <div class="i-f-line" />
        <el-button
          v-loading="btnSubmitLoading"
          type="primary"
          size="small"
          class="btn-submit"
          @click="pushShare"
        >
          发布动态
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Picker } from 'emoji-mart-vue'

import VueTribute from '@/plugins/vue-tribute.js'
import debounce from 'lodash/debounce'
import uploadMedia from '@/components/dynamic/upload_media'
import shareLink from '@/components/dynamic/share_link'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import { filterOutHtmlShare } from '@/utils/xss'
import { getCookie } from '@/utils/cookie'

export default {
  components: {
    VueTribute,
    Picker,
    uploadMedia,
    shareLink,
    shareOuterCard,
    sharePCard,
    shareInsideCard
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
      shareLinkList: [], // share link [ {}, {} ]
      uploadMediaVisible: false,
      mediaList: [],
      mediaUploading: false,
      btnSubmitLoading: false, // 发布动态loading
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined'])
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
    // 获取输入框内容的信息
    _getInputContent() {
      // 获取分享内容
      let editDom = document.querySelector('.content-editable')
      let editDomContent = editDom.innerHTML.toString()
      // console.log('editDom', editDom.innerHTML)

      // 从 dom 获取 user id
      let userIds = editDom.querySelectorAll('a.tribute-mention')
      const receivingIds = [...userIds].map(i => i.getAttribute('data-user'))
      // console.log('receivingIds', receivingIds)

      return {
        editDomContent: filterOutHtmlShare(editDomContent),
        receivingIds
      }
    },
    // 重置数据
    _reset() {
      this.shareLinkList = []
      this.mediaList = []
      this.uploadMediaVisible = false
      // 清空分享内容
      document.querySelector('.content-editable').innerHTML = ''
    },
    // 发布分享
    async pushShare() {
      // console.log('currentUserInfo', this.currentUserInfo)
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      const { editDomContent, receivingIds } = this._getInputContent()

      if (editDomContent.length <= 0) {
        this.$message({ message: '分享内容不能为空', type: 'warning' })
        return
      }
      if (editDomContent.length > this.totalText) {
        this.$message({ message: '分享内容不能超过最高限制', type: 'warning' })
        return
      }
      if (this.mediaUploading) {
        this.$message.warning('媒体正在上传中，请稍后再试')
        return
      }
      // 平台检测
      const idProvider = getCookie('idProvider')
      if (!idProvider) {
        this.$message({ message: '发生错误, 请您重新登录', type: 'error' })
        this.$store.commit('setLoginModal', true)
        return
      }

      const { name: author = '' } = this.currentUserInfo

      const data = {
        author,
        content: editDomContent.trim(),
        short_content_share: (editDomContent.trim()).slice(0, 3000), // 数据库存的3000
        platform: idProvider.toLocaleLowerCase(),
        refs: [],
        media: [],
        receivingIds
      }
      this.shareLinkList.map(i => {
        // 目前只有外展
        data.refs.push({
          url: i.url,
          title: i.title,
          summary: i.summary,
          cover: i.cover
        })
      })
      if (this.mediaList) {
        data.media = this.mediaList.map(item => {
          return {
            type: item.type,
            url: item.url
          }
        })
      }

      try {
        this.btnSubmitLoading = true
        const res = await this.$API.createShare(data)
        if (res.code === 0) {
          this.$message({ message: '发布成功', type: 'success' })
          this._reset()
        } else {
          throw new Error(res)
        }
      } catch (e) {
        console.log(e.toString())
        this.$message({ message: '发布失败', type: 'error' })
      } finally {
        this.btnSubmitLoading = false
      }
    },
    // 显示菜单 collectionIndex 集合索引
    showMenuForCollection(collectionIndex) {
      try {
        let input = document.getElementById('tributeShare')
        window._tribute.showMenuForCollection(input, collectionIndex)
      } catch (e) {
        console.log(e)
      }
    },
    // 移除分享链接
    removeShareLink(i) {
      this.shareLinkList.splice(i, 1)
    },
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
    &:hover {
      color: @purpleDark;
    }
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
  min-height: 62px;
}
// input[type="text"],
.content-editable {
  appearance: none;
  border: none;
  box-sizing: border-box;
  padding: 0;
  color: #666;
  width: 100%;
  height: 62px;
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
.emoji-picker {
  position: absolute;
  left: 0px;
  top: 36px;
  z-index: 9;
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
.btn-submit {
}
</style>