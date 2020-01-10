<template>
  <router-link :to="cardUrl" class="card">
    <div v-if="card.cover" class="card-cover">
      <img :src="coverSrc" :alt="card.title">
    </div>
    <div class="card-content">
      <p class="card-text">{{ card.title || '暂无' }}</p>
      <div class="card-info">
        <span>
          <svg-icon icon-class="eye" class="icon"></svg-icon>{{ card.real_read_count }}
        </span>
        <span>
          <svg-icon icon-class="like_thin" class="icon"></svg-icon>{{ card.likes }}
        </span>
        <!-- <span>
          <svg-icon icon-class="lock" class="icon"></svg-icon>120&nbsp;CNY
        </span> -->
      </div>
    </div>
    <span v-if="cardType === 'edit'" class="card-remove" @click="removeCard">
      <i class="el-icon-close icon"></i>
    </span>
  </router-link>
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
    cardUrl() {
      if (this.cardType === 'edit') return {}
      else return { name: 'p-id', params: { id: this.card.ref_sign_id } }
    },
    coverSrc() {
      if (this.card.cover) return this.$API.getImg(this.card.cover)
      return ''
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
    width: 100px;
    height: 50px;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 5px;
    flex: 0 0 100px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    height: 50px;
  }
  &-text {
    font-size:12px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:17px;
    flex: 1;
    max-height: 36px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: pre-wrap;
  }
  &-info {
    display: flex;
    span {
      font-size:12px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
      margin-left: 10px;
      .icon {
        margin-right: 4px;
      }
      &:nth-child(1) {
        margin-left: 0;
      }
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