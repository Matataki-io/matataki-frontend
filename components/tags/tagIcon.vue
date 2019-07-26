<template>
  <img :src="Icon" alt="icon">
</template>

<script>
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
    id: {
      type: Number,
      default: 1
    }
  },
  computed: {
    Icon() {
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
        101: ticket,
        102: game,
        103: digitalAssets,
        104: tool
      }
      return iconId[this.id]
    }
  }
}
</script>

<style>

</style>
