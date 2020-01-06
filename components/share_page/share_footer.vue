<template>
  <div class="share-footer">
    <div class="icon-num">
      <div>
        <svg-icon class="icon active" icon-class="bookmark-solid" />
      </div>
      <p>收藏</p>
    </div>
    <div class="icon-num">
      <div>
        <svg-icon @click="pushShare" class="icon" icon-class="reference" />
      </div>
      <p>引用</p>
    </div>
    <div class="icon-num">
      <div>
        <svg-icon @click="$emit('share')" class="icon" icon-class="share2" />
      </div>
      <p>分享</p>
    </div>
    <div class="icon-num">
      <div>
        <svg-icon class="icon" icon-class="great-solid" />
      </div>
      <p>推荐<span>12</span></p>
    </div>
    <div class="icon-num">
      <div>
        <svg-icon class="icon" icon-class="bullshit-solid" />
      </div>
      <p>不推荐<span>123</span></p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    pushShare() {
      this.$router.push({
        name: 'sharehall',
        query: {
          id: this.$route.params.id,
          from: 'share'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.share-footer {
  // height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .icon {
    font-size: 32px;
    color: #B2B2B2;
    &.active {
      color: @purpleDark;
    }
  }

  .icon-num {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // position: relative;
    & > div {
      width: 80px;
      height: 80px;
      background-color: #F1F1F1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform .3s;
      &:hover {
        transform: scale(1.07);
      }
    }
    p {
      text-align: center;
      font-size:16px;
      font-weight: bold;
      color:rgba(0,0,0,1);
      line-height:22px;
      padding: 0;
      margin: 10px 0 0;
      span {
        font-size:16px;
        font-weight:bold;
        color: @purpleDark;
        line-height:22px;
        margin-left: 4px;
      }
    }
  }
}
</style>
