<template>
  <router-link :to="cardUrl" @click.native="toggle" class="card" target="_blank">
    <div class="card-info">
      <div class="card-info__user">
        <avatar :src="avatarSrc" class="card-avatar" />
        <span class="card-username">{{ username }}</span>
      </div>
      <div v-if="cardType !== 'edit' && $route.name === 'sharehall'" class="card-operate">
        <svg-icon @click="copy(card.url, $event)" class="icon" icon-class="copy" />
        <svg-icon @click="ref(card.url, $event)" class="icon" icon-class="quote" />
      </div>
    </div>
    <div class="card-content">
      <svg-icon v-if="!shareCard" class="icon" icon-class="quotation_marks" />
      <svg-icon v-if="!shareCard" class="icon" icon-class="quotation_marks" />
      <img v-if="shareCard" src="@/assets/img/quote.png" alt="quote" class="icon-img">
      <img v-if="shareCard" src="@/assets/img/quote.png" alt="quote" class="icon-img">
      <span :class="!shareCard && 'card-sharehall'" class="card-text">{{ card.summary || $t('not') }}</span>
    </div>
    <span v-if="!shareCard && cardType === 'edit'" @click="removeCard" class="card-remove">
      <i class="el-icon-close icon" />
    </span>
  </router-link>
</template>

<script>
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
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
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
.card {
  background: #EAEAEA;
  border-radius: 6px;
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
      text-overflow: ellipsis;
      white-space: nowrap;
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
    padding: 0 20px;
    width: 100%;
    margin-top: 5px;
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
    .icon {
      position: absolute;
      color: #000;
      font-size: 8px;
      &:nth-child(1) {
        left: 0;
        top: 0;
      }
      &:nth-child(2) {
        bottom: 0;
        right: 0;
        transform: rotate(-180deg);
      }
    }

    .icon-img {
      position: absolute;
      color: #000;
      width: 8px;
      &:nth-child(1) {
        left: 0;
        top: 0;
      }
      &:nth-child(2) {
        bottom: 0;
        right: 0;
        transform: rotate(-180deg);
      }
    }

    .card-text {
      font-size:14px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
      overflow: hidden;
      max-height: 85px;
      padding: 0;
      margin: 0;
      white-space: pre-wrap;
    }
    .card-sharehall {
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
  }

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
    cursor: pointer;
    .icon {
      font-size: 14px;
    }
  }
}

</style>
