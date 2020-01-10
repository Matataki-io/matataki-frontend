<template>
  <router-link :to="cardUrl" class="card" @click.native="toggle">
    <div class="card-info">
      <avatar class="card-avatar" :src="avatarSrc"></avatar>
      <span class="card-username">{{ username }}</span>
    </div>
    <div class="card-content">
      <svg-icon class="icon" icon-class="quotation_marks" />
      <svg-icon class="icon" icon-class="quotation_marks" />
      <p>{{ card.summary || '暂无' }}</p>
    </div>
    <span v-if="cardType === 'edit'" class="card-remove" @click="removeCard">
      <i class="el-icon-close icon"></i>
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
    from : {
      type: String,
      default: '', // beref
    },
    idx: {
      type: Number,
      default: 0
    },
    card: {
      type: Object,
      required: true
    },
  },
  computed: {
    cardUrl() {
      if (this.toggleArticle) {
        return {}
      } else {
        if (this.cardType === 'edit') return {}
        else {
          // beref use sign_id
          if (this.from === 'beref') return { name: 'share-id', params: { id: this.card.sign_id } }
          else return { name: 'share-id', params: { id: this.card.ref_sign_id } }
        }
      }
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
        if (this.card.user.avatar) return this.$API.getImg(this.card.user.avatar)
        return ''
      } else if (this.cardType === 'read') {
        if (this.card.avatar) return this.$API.getImg(this.card.avatar)
        return ''
      } else return ''
    },
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
    toggle() {
      if (this.toggleArticle) {
        // beref use sign_id
        let id = this.from === 'beref' ? this.card.sign_id : this.card.ref_sign_id
        this.$emit('getArticle', id, false)
      }
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
  &-info {
    width: 100%;
    display: flex;
    align-items: center;
    .card-avatar {
      margin-right: 5px;
      width: 30px !important;
      height: 30px !important;
      flex: 0 0 30px;
    }
    .card-username {
      font-size:12px;
      font-weight:bold;
      color:rgba(0,0,0,1);
      line-height:17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-content {
    position: relative;
    padding: 0 20px;
    width: 100%;
    margin-top: 5px;
    text-decoration: none;
    cursor: pointer;
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

    p {
      font-size:12px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
      overflow: hidden;
      max-height: 87px;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      white-space: pre-wrap;
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