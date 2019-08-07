<template>
  <!-- 暂时用文章页代替跳转地址 -->
  <n-link
    :to=" {name: 'tag-id', params: {id: tag.id}, query: {name: tag.name, type: tag.type}} "
    class="tag"
  >
    <div class="tag-icon" :style="tagStyleObject">
      <tag-icon :id="tag.id" />
    </div>
    <span :class="typeIndex === 1 && 'left'">{{ tag.name }}</span>
    <div
      :style="tagStyleObjectBg"
      class="full"
    />
  </n-link>
  <!-- 暂时用文章页代替跳转地址 end -->
</template>

<script>

import { tagColor } from '@/utils/tag'
import tagIcon from '@/components/tags/tagIcon.vue'
export default {
  components: {
    tagIcon
  },
  props: {
    typeIndex: {
      type: Number,
      default: 0
    },
    tag: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tagStyleObject: {},
      tagStyleObjectBg: {}
    }
  },
  created() {
    this.tagStyleObject = {
      backgroundColor: tagColor()[this.tag.id] + 'c7'
    }
    this.tagStyleObjectBg = {
      backgroundColor: tagColor()[this.tag.id]
    }
  }

}
</script>

<style lang="less" scoped>
.tag {
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s;
}
.tag:hover span {
  color: #fff;
}
.tag:hover .tag-icon {
  border-radius: @borderRadius10 0 0 @borderRadius10;
}
.tag:hover .full {
  opacity: 1;
}
.tag-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #eee;
  z-index: 1;
  transition: all .2s;
  img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  }
}
span {
  text-align: center;
  font-size: 18px;
  color: rgba(0, 0, 0, 1);
  line-height: 28px;
  flex: 1;
  z-index: 1;
  &.left {
    text-align: left;
    padding-left: 10px;
  }
}
.full {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 54px;
  border-radius: 0 @borderRadius10 @borderRadius10 0;
  opacity: 0;
  transition: all .2s;
}
</style>
