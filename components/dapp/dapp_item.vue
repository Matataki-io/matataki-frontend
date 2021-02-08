<template>
  <li class="item">
    <div class="item-cover">
      <img
        :style="(itemBlock.width ? `width: ${itemBlock.width};` : '') + (itemBlock.height ? `height: ${itemBlock.height};` : '')"
        :src="itemBlock.img"
        :alt="item.title"
      >
    </div>
    <p class="item-title">{{ itemBlock.title }}</p>
    <p class="item-description">{{ itemBlock.description }}</p>
    <div>
      <a
        v-if="itemBlock.repo"
        :href="itemBlock.repo"
        class="item-btn github"
        target="_blank"
      >{{ $t('github-address') }}</a>
      <a
        :href="itemBlock.disabled ? 'javascript:;' :itemBlock.url"
        class="item-btn"
        :class="itemBlock.disabled && 'disabled'"
        :target="itemBlock.disabled ? '' : '_blank'"
      >{{ itemBlock.btn }}</a>
    </div>
  </li>
</template>

<script>
export default {
  name: 'DappItem',
  serverCacheKey(props) {
    return `DappItem::${props.itemBlock.title}::${props.itemBlock.url}::${props.itemBlock.repo}`
  },
  props: {
    itemBlock: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  &::after {
    display: block;
    content: "";
    width: 0;
    height: 0;
    clear: both;
  }
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  float: left;
  padding: 0 20px 20px;
  box-sizing: border-box;
  text-align: center;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
  }
  .item-cover {
    height: 168px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 36px;
    img {
      width: 168px;
      height: 168px;
      object-fit: contain;
    }
  }

  .item-title {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 28px;
    padding: 0;
    margin: 40px 0 0 0;
    text-align: center;
  }
  .item-description {
    font-size: 16px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    padding: 0;
    margin: 20px 0 44px;
    text-align: center;
    flex: 1;
  }
  .item-btn {
    border-radius: 8px;
    border: 1px solid rgba(84, 45, 224, 1);
    font-size: 14px;
    font-weight: 500;
    color: rgba(84, 45, 224, 1);
    line-height: 20px;
    padding: 5px 16px;
    margin: 0 10px;
    display: inline-block;
    text-align: center;
    transition: all 0.2s;
    &.github {
      padding-left: 8px;
      padding-right: 8px;
      color: #333;
      border: 1px solid rgba(178, 178, 178, 1);
    }
    &.disabled {
      border-color: rgba(241, 241, 241, 1);
      background: rgba(241, 241, 241, 1);
      color: rgba(178, 178, 178, 1);
      cursor: not-allowed;
      &:hover {
        border-color: rgba(241, 241, 241, 1);
        background: rgba(241, 241, 241, 1);
        color: rgba(178, 178, 178, 1);
      }
    }
    &:hover {
      background: rgba(84, 45, 224, 1);
      color: #fff;
      &.github {
        border-color: rgba(178, 178, 178, 1);
        background-color: rgba(178, 178, 178, 1);
      }
    }
  }
}

@media screen and (max-width: 540px) {
  .item {
    // width: calc(100%);
    // margin-left: 0;
    // margin-right: 0;
    // &:nth-of-type(3n) {
    //   margin-right: 0;
    // }

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>