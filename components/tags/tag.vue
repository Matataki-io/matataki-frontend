<template>
  <!-- 暂时用文章页代替跳转地址 -->
  <n-link
    :to=" {name: 'p-id', params: {id: tag.id}} "
    tag="div"
    class="tag"
    :class="typeIndex === 0 ? 'article' : 'commodity'"
  >
    <div class="tag-icon" :style="tagStyleObject">
      <img :src="tagIcon" alt="icon">
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
import tagColor from '@/utils/tagColor'
import bibi from '@/assets/img/tags/bibi.svg'
import brainHole from '@/assets/img/tags/brain_hole.svg'
import comment from '@/assets/img/tags/comment.svg'
import display from '@/assets/img/tags/display.svg'
import evaluation from '@/assets/img/tags/evaluation.svg'
import evidence from '@/assets/img/tags/evidence.svg'
import hot from '@/assets/img/tags/hot.svg'
import iCanNotSee from '@/assets/img/tags/i_can_not_see.svg'
import knowledge from '@/assets/img/tags/knowledge.svg'
import otherNot from '@/assets/img/tags/other_not.svg'
import ss from '@/assets/img/tags/ss.svg'
import technology from '@/assets/img/tags/technology.svg'

import game from '@/assets/img/tags/game.svg'
import ticket from '@/assets/img/tags/ticket.svg'
import digitalAssets from '@/assets/img/tags/digitalAssets.svg'
import tool from '@/assets/img/tags/tool.svg'

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
  computed: {
    tagIcon() {
      const iconId = {
        1: comment,
        2: brainHole,
        3: otherNot,
        4: bibi,
        5: evidence,
        6: knowledge,
        7: hot,
        8: display,
        9: evaluation,
        10: iCanNotSee,
        11: technology,
        12: ss,
        13: technology,
        14: technology,
        15: technology,
        16: technology,
        17: technology,
        18: technology,
        19: technology,
        20: technology,
        101: ticket,
        102: game,
        103: digitalAssets,
        104: tool
      }
      return iconId[this.tag.id]
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
