<template>
  <div class="userplatform">
    <router-link
      :to="{name: 'user-id', params: {id: card.id}}"
      target="_blank"
    >
      <c-user-popover :user-id="Number(card.id)">
        <c-avatar
          :src="avatarSrc"
          class="userplatform-avatar"
          :level="1"
          :level-token="1"
        />
      </c-user-popover>
    </router-link>
    <router-link
      class="userplatform-info"
      :to="{name: 'user-id', params: {id: card.id}}"
      target="_blank"
    >
      <h4>
        {{ card.nickname || card.username }}
      </h4>
      <p>
        {{ card.introduction }}
      </p>
    </router-link>
    <div class="userplatform-platform">
      <el-tooltip
        class="item"
        effect="dark"
        :content="`@${card.twitter_name}`"
        :disabled="!card.twitter_name"
        placement="top"
      >
        <a
          class="userplatform-platform-unit"
          :class="card.twitter_name || 'unit-disable'"
          :href="card.twitter_name && `https://twitter.com/${card.twitter_name}`"
          target="_blank"
        >
          <svg-icon icon-class="twitter" />
        </a>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        :content="`UUID:${card.bilibili_id}`"
        :disabled="!card.bilibili_id"
        placement="top"
      >
        <a
          class="userplatform-platform-unit"
          :class="card.bilibili_id || 'unit-disable'"
          :href="card.bilibili_id && `https://space.bilibili.com/${card.bilibili_id}`"
          target="_blank"
        >
          <svg-icon icon-class="bilibili_tv" />
        </a>
      </el-tooltip>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatarSrc() {
      if (this.card && this.card.avatar) return this.$ossProcess(this.card.avatar, { h: 60 })
      return ''
    },
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.userplatform {
  display: flex;
  padding: 20px 0 0;

  &:nth-child(1) {
    padding-top: 0;
  }

  &-avatar {
    width: 45px;
    height: 45px;
    flex: 0 0 45px;
    /deep/ .recommend-icon {
      right: -10px !important;
      bottom: -5px !important;
      width: 26px !important;
    }
  }

  &-info {
    flex: 1;
    margin: 0 5px 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h4 {
      font-size: 16px;
      flex: 1;
      text-overflow: ellipsis;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      padding: 0;
      margin: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    p {
      color: #333;
      flex: 1;
      text-overflow: ellipsis;
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 20px;
      padding: 0;
      margin: 3px 0 0 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }

  &-platform {
    display: flex;
    align-items: center;

    &-unit {
      width: 33px;
      height: 33px;
      min-width: 33px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 20px;
      color: #00ACED;
      transition: all ease-in 0.1s;
      background: #00000000;

      svg {
        transition: all ease-in 0.1s;
      }

      &:hover {
        background: #00000010;

        svg {
          transform: scale(1.15);
        }
      }

      &.unit-disable {
        color: #b2b2b2;
        background: #00000000;
        cursor: no-drop;

        svg {
          transform: scale(1);
        }
      }
    }
  }
}
</style>
