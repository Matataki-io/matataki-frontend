<template>
  <div class="card-share__content">
    <div class="card-share">
      <div class="card-info">
        <router-link
          :to="{ name: 'user-id-share', params: { id: card.uid } }"
          :target="blank && '_blank'"
          class="card-info__left"
        >
          <avatar
            :src="avatarSrc"
            class="card-avatar"
          />
          <div class="card-author">
            <span class="card-username">{{ card.nickname || card.author }}</span>
            <div>
              <span class="card-date">{{ time }}</span>
              <span class="card-read">
                <svg-icon
                  class="icon"
                  icon-class="eye_blod"
                />{{ card.read }}
              </span>
            </div>
          </div>
        </router-link>
        <div
          class="card-quote"
          @click="$emit('refClick', card)"
        >
          <svg-icon
            class="icon"
            icon-class="quote"
          />
          <span>{{ $t('quote') }}&nbsp;{{ card.beRefs ? card.beRefs.length : '' }}</span>
        </div>
      </div>
      <router-link
        :to="{ name: 'share-id', params: { id: card.id } }"
        class="card-content"
        target="_blank"
      >
        <svg-icon
          class="icon"
          icon-class="quotation_marks"
        />
        <svg-icon
          class="icon"
          icon-class="quotation_marks"
        />
        <div
          class="search-res"
          v-html="content || '&nbsp;'"
        />
      </router-link>
    </div>
    <div
      v-if="card.refs && card.refs.length !== 0"
      class="card-list"
    >
      <template v-for="(item, index) in card.refs.slice(0, 1)">
        <shareOuterCard
          v-if="item.ref_sign_id === 0"
          :key="'shareOuterCard' + index"
          :card="item"
          card-type="read"
          class="list-card"
          @ref="val => $emit('ref', val)"
        />
        <sharePCard
          v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
          :key="'sharePCard' + index"
          :card="item"
          card-type="read"
          class="list-card"
          @ref="val => $emit('ref', val)"
        />
        <shareInsideCard
          v-else-if="item.ref_sign_id && item.channel_id === 3"
          :key="'shareInsideCard' + index"
          :card="item"
          card-type="read"
          class="list-card"
          @ref="val => $emit('ref', val)"
        />
      </template>
      <div
        :class="toggleMore && 'open'"
        class="card-list__more"
      >
        <template v-for="(item, index) in shareListMore">
          <shareOuterCard
            v-if="item.ref_sign_id === 0"
            :key="'shareOuterCard' + index"
            :card="item"
            card-type="read"
            class="list-card"
            @ref="val => $emit('ref', val)"
          />
          <sharePCard
            v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
            :key="'shareOuterCard' + index"
            :card="item"
            card-type="read"
            class="list-card"
            @ref="val => $emit('ref', val)"
          />
          <shareInsideCard
            v-else-if="item.ref_sign_id && item.channel_id === 3"
            :key="'shareOuterCard' + index"
            :card="item"
            card-type="read"
            class="list-card"
            @ref="val => $emit('ref', val)"
          />
        </template>
      </div>
      <div
        v-if="shareListMore.length !== 0"
        :class="toggleMore && 'open'"
        class="card-more"
        @click="toggleMore = !toggleMore"
      >
        <span>{{ toggleMore ? $t('hideMore') : $t('viewMore') }}</span><i class="el-icon-d-arrow-left icon" />
      </div>
    </div>
    <div
      v-if="card.media && card.media.length > 0"
      class="card-share-photoalbum"
    >
      <div class="card-share-photoalbum-pillar" />
      <photoAlbum class="card-share-photoalbum-main" :media="card.media" />
    </div>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import { filterOutHtmlShare } from '@/utils/xss'
import { renderLinkUser } from '@/utils/share'
import photoAlbum from '@/components/dynamic/photo_album'

export default {
  components: {
    avatar,
    shareOuterCard,
    sharePCard,
    shareInsideCard,
    photoAlbum
  },
  props: {
    card: {
      type: Object,
      required: true
    },
    blank: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      toggleMore: false
    }
  },
  computed: {
    shareListMore() {
      if (this.card.refs && this.card.refs.length > 1) return this.card.refs.slice(1)
      else return []
    },
    time() {
      return this.moment(this.card.create_time).format('lll')
    },
    avatarSrc() {
      if (this.card.avatar) return this.$ossProcess(this.card.avatar, { h: 60 })
      return ''
    },
    // 分享内容
    content() {
      // 向后兼容 this.card.short_content_share || this.card.short_content
      return this.$utils.compose(renderLinkUser, filterOutHtmlShare)(this.card.short_content_share || this.card.short_content)
    }
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
.card-share__content {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}
.card-share {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.card-share-photoalbum {
  position: relative;
  margin-top: 10px;
  width: 100%;

  &-pillar {
    padding-bottom: 56.25%;
  }

  &-main {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
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
      // flex: 1;
      max-width: 300px;
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
      font-size:14px;
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
      font-size:14px;
      font-weight: bold;
      color: @purpleDark;
      line-height:17px;
    }
  }
  &-content {
    position: relative;
    padding: 0 20px;
    width: 100%;
    margin: 10px 0;
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
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
      font-size:16px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      overflow: hidden;
      max-height: 102px;
      padding: 0;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
  &-list {
    margin: 0px 20px 0 20px;
    // &::before {
    //   display: block;
    //   content: '';
    //   width: 0;
    //   height: 0;
    //   border-width: 10px;
    //   border-style: solid;
    //   border-color: transparent transparent #eaeaea transparent;
    //   position: absolute;
    //   left: 20px;
    //   top: -20px;
    // }

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
      cursor: pointer;
    }
    .icon {
      color:@purpleDark;
      transform: rotate(-90deg);
      font-size:12px;
    }
  }
}

</style>

<style lang="less">
.search-res {
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
  word-break: break-word;
  line-height: 1.5;
  em {
    font-weight: bold;
    font-style: normal;
    color: @purpleDark;
  }
  a {
    color: rgb(47, 174, 227)
  }
}

</style>
