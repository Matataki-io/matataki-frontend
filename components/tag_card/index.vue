<template>
  <div class="tag-card" :style="tagStyleObject" @click="toggleTagStatus(tagCardCopy.status)">
    {{ tagCardCopy.name }}
  </div>
</template>

<script>

export default {
  name: 'TagColor',
  props: {
    tagCard: {
      type: Object,
      required: true
    },
    tagMode: {
      type: Boolean,
      default: true // true 可编辑 false 预览
    }
  },
  data() {
    return {
      tagStyleObject: {
        // 默认的颜色
        color: '#fff',
        backgroundColor: '#fff'
      },
      tagCardCopy: Object.assign({}, this.tagCard)
    }
  },
  watch: {
    tagCard: {
      handler(newVal) {
        // console.log(newVal)
        this.tagCardCopy = Object.assign({}, newVal)
        this.setStyle(this.tagCard.status)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // console.log(this.tagCard)
    // 初始化根据模式设置
    this.setStyle(!this.tagMode)
  },
  methods: {
    // status: true 选中状态 false 默认状态
    setStyle(status = false) {
      if (status) {
        this.tagStyleObject.color = '#fff'
        this.tagStyleObject.backgroundColor = '#1c9cfe'
      } else {
        this.tagStyleObject.color = '#1c9cfe'
        this.tagStyleObject.backgroundColor = '#e6f4ff'
      }
    },
    // 切换状态
    toggleTagStatus(status) {
      if (!this.tagMode) {
        this.$router.push({
          name: 'Tag',
          query: {
            id: this.tagCard.id,
            name: this.tagCard.name
          }
        })
      } else {
        this.tagCardCopy.status = !status
        this.setStyle(!status)
        // 向父级传递数据
        this.$emit('toggleTagStatus', this.tagCardCopy)
      }
    }
  }
}
</script>

<style scoped lang="less">
.tag-card {
  display: inline-block;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  margin: 5px;
  box-sizing: border-box;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 400 !important;
}
</style>
