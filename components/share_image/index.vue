<template>
  <div class="share-image">
    <img class="share-image__head" src="@/assets/img/share_image_head.png" alt="share_image_head">
    <p class="share-image__text">
      {{ content || '&nbsp;' }}
      <img class="ref" src="@/assets/img/share_ref.png" alt="ref">
    </p>
    <div class="share-image__user">
      <avatar :src="avatarSrc" class="avatar" />
      <span>{{ username.length > 12 ? username.slice(0, 12) + '...': username }}</span>
    </div>
    <div class="share-image__ref">
      <template v-for="(item, index) in reference">
        <div :key="index" class="ref-index">
          <div class="ref-index__line" />
          <div class="ref-index__number">
            {{ index }}
          </div>
        </div>
      </template>
    </div>
    <img src="@/assets/img/share_image_logo.png" alt="share-image__logo" class="share-image__logo">
    <img src="@/assets/img/share_image_description.png" alt="share-image__description" class="share-image__description">
    <qrcode :value="url" :options="{ width: 64 }" class="share-image__code" />
    <p class="share-image__code__description">
      扫码查看分享详情
    </p>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar,
    qrcode: VueQrcode
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    avatarSrc: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    reference: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: '1'
    }
  }
}
</script>

<style lang="less" scoped>
.share-image {
  width: 375px;
  // height: 990px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
  &__head {
    display: block;
    width: 168px;
    margin: 0 auto;
  }
  &__text {
    padding: 0;
    margin: 20px 0 0 0;
    font-size:14px;
    font-weight:bold;
    color:rgba(84,45,224,1);
    line-height:20px;
    position: relative;
    .ref {
      width: 47px;
      position: absolute;
      left: 0;
      top: -25px
    }
  }
  &__user {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .avatar {
      width: 30px !important;
      height: 30px !important;
    }
    span {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      padding: 0;
      margin: 0 0 0 5px;
    }
  }
  &__ref {
    background-color: #EAEAEA;
    // height: 430px;
    min-height: 40px;
    border-radius:6px;
    margin: 15px 0 0 0;
    padding: 10px;
    position: relative;
    box-sizing: border-box;
    .ref-index {
      position: relative;
      display: flex;
      justify-content: center;
      &__line {
        width: 100%;
        height: 1px;
        background-color: #DBDBDB;
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        z-index: 1;
      }
      &__number {
        width: 20px;
        height: 20px;
        font-size:12px;
        color:rgba(0,0,0,1);
        background-color: #DBDBDB;
        line-height:17px;
        font-weight: bold;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }
    }
    &::before {
      position: absolute;
      top: -24px;
      left: 20px;
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 15px;
      border-color: transparent transparent #EAEAEA transparent;
    }
  }

  &__logo {
    width: 64px;
    display: block;
    margin: 20px auto 0;
  }
  &__description {
    width: 225px;
    display: block;
    margin: 10px auto 0;
  }
  &__code {
    width: 64px;
    height: 64px;
    display: block;
    margin: 20px auto 0;
  }
  &__code__description {
    margin: 10px 0 0 0;
    text-align: center;
    font-size:12px;
    font-weight:400;
    color:rgba(0,0,0,1);
  }
}
</style>
