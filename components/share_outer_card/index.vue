<template>
  <a :href="card.url" target="_blank" class="card">
    <div v-if="card.cover" class="card-cover">
      <img :src="coverSrc" :alt="card.title">
    </div>
    <div>
      <p class="card-text">{{ card.title || '暂无' }}</p>
      <p class="card-summary">{{ card.summary || '暂无' }}</p>
    </div>
    <span v-if="cardType === 'edit'" @click="removeCard" class="card-remove">
      <i class="el-icon-close icon" />
    </span>
  </a>
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
    }
  },
  computed: {
    coverSrc() {
      if (this.card.cover) return this.$API.getImg(this.card.cover)
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
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  color: #000;
  &-cover {
    width: 120px;
    height: 60px;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 10px;
    flex: 0 0 120px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-text {
    font-size:15px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height: 18px;
    flex: 1;
    max-height: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
  &-summary {
    font-size:14px;
    // font-weight: bold;
    line-height: 18px;
    flex: 1;
    max-height: 38px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #737373;
    white-space: pre-wrap;
    padding: 0;
    margin: 4px 0 0 0;
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
