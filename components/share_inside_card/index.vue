<template>
  <div class="card-box">
    <!-- 编辑模式下的关闭按钮 -->
    <span
      v-if="!shareCard && cardType === 'edit'"
      class="card-box-remove"
      @click="removeCard"
    >
      <i class="el-icon-close icon" />
    </span>
    <!-- 卡片主体 -->
    <router-link
      :to="cardUrl"
      class="card"
      target="_blank"
    >
      <div class="card-info">
        <div class="card-info__user">
          <avatar
            :src="avatarSrc"
            class="card-avatar"
          />
          <span class="card-username">{{ username }}</span>
        </div>
        <div
          v-if="cardType !== 'edit' && $route.name === 'sharehall'"
          class="card-operate"
        >
          <svg-icon
            class="icon"
            icon-class="copy"
            @click="copy(card.url, $event)"
          />
          <svg-icon
            class="icon"
            icon-class="quote"
            @click="ref(card.url, $event)"
          />
        </div>
      </div>
      <div class="card-content">
        <span
          :class="!shareCard && 'card-sharehall'"
          class="card-text"
          v-html="content"
        />
      </div>
    </router-link>
  </div>
</template>

<script>
import { renderLinkUser } from '@/utils/share'
import { filterOutHtmlShare } from '@/utils/xss'

import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    cardType: {
      type: String,
      default: 'edit' // edit read
    },
    // 是否拥有切换文章功能
    toggleArticle: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: '' // beref
    },
    idx: {
      type: Number,
      default: 0
    },
    card: {
      type: Object,
      required: true
    },
    // 如果是分享卡片 隐藏删除按钮
    shareCard: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardUrl() {
      // beref use sign_id
      if (this.toggleArticle) return {}
      else if (this.cardType === 'edit') return {}
      else if (this.from === 'beref') return { name: 'share-id', params: { id: this.card.sign_id } }
      else return { name: 'share-id', params: { id: this.card.ref_sign_id } }
    },
    username() {
      if (this.cardType === 'edit') {
        return this.card.user.nickname || this.card.user.username
      } else if (this.cardType === 'read') {
        return this.card.nickname || this.card.username
      } else return ''
    },
    avatarSrc() {
      if (this.cardType === 'edit') {
        if (this.card.user.avatar) return this.$ossProcess(this.card.user.avatar, { h: 60 })
        return ''
      } else if (this.cardType === 'read') {
        if (this.card.avatar) return this.$ossProcess(this.card.avatar, { h: 60 })
        return ''
      } else return ''
    },
    content() {
      // 向后兼容 this.card.short_content_share || this.card.short_content
      return this.$utils.compose(renderLinkUser, filterOutHtmlShare)(this.card.short_content_share || this.card.short_content || this.card.summary || this.$t('not'))
    }
  },
  methods: {
    removeCard(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      if (this.cardType !== 'edit') return
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'message-box__mobile'
      }).then(() => {
        this.$emit('removeShareLink', this.idx)
      }).catch(() => {})
      return false
    },
    toggle(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      if (this.toggleArticle) {
        // beref use sign_id
        const id = this.from === 'beref' ? this.card.sign_id : this.card.ref_sign_id
        this.$emit('getArticle', id, false)
      }
      return false
    },
    copy(val, e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.$copyText(val).then(
        () => this.$message({ showClose: true, message: this.$t('success.copy'), type: 'success' }),
        () => this.$message({ showClose: true, message: this.$t('error.copy'), type: 'error' })
      )
      return false
    },
    ref(val, e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.$emit('ref', val)
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.card-box {
  position: relative;
  &-remove {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    cursor: pointer;
    .icon {
      font-size: 14px;
    }
  }
}
.card {
  background-color: transparent;
  border: 1px solid #ccd6dd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  &:active .card-operate {
    color: @purpleDark;
  }
  &-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card-avatar {
      margin-right: 5px;
      width: 30px !important;
      height: 30px !important;
      flex: 0 0 30px;
    }
    .card-username {
      font-size:14px;
      font-weight:bold;
      color:rgba(0,0,0,1);
      line-height:17px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }
  &-info__user {
    display: flex;
    align-items: center;
  }
  &-operate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      cursor: pointer;
      padding: 4px 6px;
      font-size: 14px;
      color: @purpleDark;
      &:nth-child(2) {
        font-size: 16px;
      }
    }
  }
  &-content {
    position: relative;
    width: 100%;
    margin-top: 5px;
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;

    .card-text {
      font-size:14px;
      font-weight:400;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      width: 100%;
      word-break: break-word;
      white-space: pre-line;
      line-height: 1.5;
      em {
        font-weight: bold;
        font-style: normal;
        color: @purpleDark;
      }
      a {
        color: rgb(47, 174, 227)
      }
    }
  }
}

</style>
