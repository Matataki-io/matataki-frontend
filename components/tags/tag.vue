<template>
  <div
    class="tag"
    :class="typeIndex === 0 ? 'article' : 'commodity'"
  >
    <div class="tag-icon" :style="tagStyleObject">
      <img :src="comment" alt="icon">
    </div>
    <span :class="typeIndex === 1 && 'left'">{{ tag.name }}</span>
    <div
      :style="tagStyleObjectBg"
      class="full"
    />
  </div>
</template>

<script>
import tagColor from '@/utils/tagColor'
import comment from '@/assets/img/tags/comment.svg'

export default {
  props: {
    tag: {
      type: Object,
      default: () => {}
    },
    typeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      comment,
      tagStyleObject: {},
      tagStyleObjectBg: {}
    }
  },
  computed: { },
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
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #eee;
  z-index: 1;
  transition: all .2s;
  img {
  width: 76%;
  height: 76%;
  object-fit: contain;
  }
}
span {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
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
  left: 60px;
  border-radius: 0 @borderRadius10 @borderRadius10 0;
  opacity: 0;
  transition: all .2s;
}
</style>
