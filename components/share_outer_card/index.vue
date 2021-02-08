<template>
  <div class="card-box">
    <span
      v-if="!shareCard && cardType === 'edit'"
      class="card-box-remove"
      @click="removeCard"
    >
      <i class="el-icon-close icon" />
    </span>
    <a
      :href="card.url"
      target="_blank"
      class="card"
    >
      <div
        v-if="card.cover"
        class="card-cover"
      >
        <img
          :src="coverSrc"
          :alt="card.title"
        >
      </div>
      <div class="card-info">
        <div class="card-operate">
          <p
            :class="!shareCard && 'card-sharehall'"
            class="card-text"
          >{{ card.title || $t('not') }}</p>
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
        <p
          :class="!shareCard && 'card-sharehall'"
          class="card-summary"
        >{{ card.summary || $t('not') }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    cardType: {
      type: String,
      default: 'edit' // edit read
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
    coverSrc() {
      if (this.card.cover) return this.$ossProcess(this.card.cover)
      return ''
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
    copy(val, e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.$copyText(val).then(
        () => this.$message({
          showClose: true,
          message: this.$t('success.copy'),
          type: 'success'
        }),
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
  display: flex;
  // align-items: center;
  position: relative;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  color: #000;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid #ccd6dd;
  overflow: hidden;
  // padding: 10px;
  box-sizing: border-box;
  &-cover {
    width: 240px;
    height: 120px;
    border-radius: 3px;
    overflow: hidden;
    flex: 0 0 240px;
    border-right: 1px solid #ededed;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
  &-text {
    font-size:15px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height: 18px;
    flex: 1;
    max-height: 18px;
    overflow: hidden;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
    &.card-sharehall {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  &-summary {
    font-size:14px;
    // font-weight: bold;
    line-height: 18px;
    flex: 1;
    max-height: 36px;
    overflow: hidden;
    color: #737373;
    white-space: pre-wrap;
    padding: 0;
    margin: 4px 0 0 0;
    &.card-sharehall {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.card-info {
  padding: 10px;
}
</style>
