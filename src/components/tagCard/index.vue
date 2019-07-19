<template>
  <div class="tag-card" :style="tagStyleObject" @click="toggleTagStatus(tagCardCopy.status)">
    {{ tagCardCopy.name }}
  </div>
</template>

<script>
import tagColor from '@/common/tagColor'

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
      tagColors: {},
      tagStyleObject: {
        // 默认的颜色
        color: '#fff',
        backgroundColor: '#fff',
        border: '1px solid #fff'
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
    this.tagColors = tagColor()
    // console.log(this.tagCard)
    // 初始化根据模式设置
    this.setStyle(!this.tagMode)
  },
  methods: {
    // status: true 选中状态 false 默认状态
    setStyle(status = false) {
      const getTagColor = this.tagColors[this.tagCardCopy.id]
      if (status) {
        this.tagStyleObject.color = '#fff'
        this.tagStyleObject.backgroundColor = getTagColor
      } else {
        this.tagStyleObject.color = getTagColor
        this.tagStyleObject.backgroundColor = '#fff'
      }
      this.tagStyleObject.border = `1px solid ${getTagColor}`
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

<style scoped lang="less" src="./index.less"></style>
