<template>
  <div class="card-share">
    <div class="card-info">
      <router-link :to="{ name: 'user-id', params: { id: card.uid } }" class="card-info__left">
        <avatar class="card-avatar" :src="avatarSrc"></avatar>
        <div class="card-author">
          <span class="card-username">{{ card.nickname || card.author }}</span>
          <div>
            <span class="card-date">{{ time }}</span>
            <span class="card-read">
              <svg-icon class="icon" icon-class="eye_blod" />{{ card.read }}
            </span>
          </div>
        </div>
      </router-link>
      <div class="card-quote" @click="$emit('refClick', card)">
        <svg-icon class="icon" icon-class="quote" />
        <span>引用&nbsp;{{card.beRefs.length}}</span>
      </div>
    </div>
    <router-link :to="{ name: 'share-id', params: { id: card.id } }" class="card-content">
      <svg-icon class="icon" icon-class="quotation_marks" />
      <svg-icon class="icon" icon-class="quotation_marks" />
      <p>{{ card.short_content || "&nbsp;" }}</p>
    </router-link>
    <div class="card-list" v-if="this.card.refs.length !== 0">
      <template v-for="(item, index) in this.card.refs.slice(0, 1)">
        <shareOuterCard :card="item" v-if="item.ref_sign_id === 0" cardType="read" class="list-card"  :key="'shareOuterCard' + index"></shareOuterCard>
        <sharePCard :card="item" v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1" cardType="read" class="list-card"  :key="'sharePCard' + index"></sharePCard>
        <shareInsideCard :card="item" v-else-if="item.ref_sign_id && item.channel_id === 3" cardType="read" class="list-card"  :key="'shareInsideCard' + index"></shareInsideCard>
      </template>
      <div class="card-list__more" :class="toggleMore && 'open'">
        <template v-for="(item, index) in shareListMore">
          <shareOuterCard :card="item" v-if="item.ref_sign_id === 0" cardType="read" class="list-card" :key="'shareOuterCard' + index"></shareOuterCard>
          <sharePCard :card="item" v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1" cardType="read" class="list-card" :key="'shareOuterCard' + index"></sharePCard>
          <shareInsideCard :card="item" v-else-if="item.ref_sign_id && item.channel_id === 3" cardType="read" class="list-card" :key="'shareOuterCard' + index"></shareInsideCard>
        </template>
      </div>
      <div v-if="shareListMore.length !== 0" class="card-more" :class="toggleMore && 'open'" @click="toggleMore = !toggleMore">
        <span>{{toggleMore ? '收起更多' : '查看更多' }}</span><i class="el-icon-d-arrow-left icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import avatar from '@/components/avatar/index.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
export default {
  components: {
    avatar,
    shareOuterCard,
    sharePCard,
    shareInsideCard,
  },
  props: {
    card: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      toggleMore: false,
    }
  },
  computed: {
    shareListMore() {
      if (this.card.refs.length > 1) return this.card.refs.slice(1)
      else return []
    },
    time() {
      return moment(this.card.create_time).format('lll')
    },
    avatarSrc() {
      if (this.card.avatar) return this.$API.getImg(this.card.avatar)
      return ''
    },
  },
  created() {
  },
}
</script>

<style lang="less" scoped>
.card-share {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.card {
    &-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__left {
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;
      margin-right: 10px;
      text-decoration: none;
      cursor: pointer;
    }
    .card-author {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      overflow: hidden;
    }
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
      width: 100%;
    }
    .card-date {
      font-size:12px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
    }

    .card-read {
      font-size:12px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
      margin-left: 6px;
      .icon {
        margin-right: 4px;
      }
    }
  }

  &-quote {
    border-radius:4px;
    border:1px solid @purpleDark;
    color: @purpleDark;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon {
      font-size: 16px;
    }
    span {
      font-size:12px;
      font-weight: bold;
      color: @purpleDark;
      line-height:17px;
    }
  }
  &-content {
    position: relative;
    padding: 0 20px;
    width: 100%;
    margin-top: 10px;
    text-decoration: none;
    cursor: pointer;
    .icon {
      position: absolute;
      color: @purpleDark;
      font-size: 10px;
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
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      overflow: hidden;
      max-height: 102px;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      white-space: pre-wrap;
    }
  }
  &-list {
    border-radius:6px;
    background-color: #eaeaea;
    padding: 0;
    width: 100%;
    margin: 14px 0 0 0;
    position: relative;
    &::before {
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent #eaeaea transparent;
      position: absolute;
      left: 20px;
      top: -20px;
    }

    &__more {
      max-height: 0;
      transition: all .3s;
      overflow: hidden;
      &.open {
        max-height: none;
      }
    }
  }

  &-more {
    text-align: center;
    padding: 10px 0;
    &.open .icon {
      transform: rotate(90deg);
    }
    span {
      font-size:12px;
      font-weight:400;
      color:@purpleDark;
      line-height:17px;
      margin-right: 2px;
    }
    .icon {
      color:@purpleDark;
      transform: rotate(-90deg);
      font-size:12px;
    }
  }
}

</style>