<template>
  <div class="card">
    <div class="card-head">
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="user"
        :href="`${nftUrl}/${card.owner.username}`"
      >
        <c-avatar
          :src="card.owner.avatar || ''"
          class="token-popover"
        />
        <span class="username">{{ card.owner.username }}</span>
      </a>
    </div>
    <div class="card-content">
      <div class="media-images">
        <img
          :src="card.tokenURI"
          alt="Content"
        >
      </div>
    </div>
    <div class="card-footer">
      <h5>{{ card.title || '' }}</h5>
      <div class="card-footer-price">
        <div>
          <p class="price">{{ card.price }}</p>
          <p class="name">List price</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    // nft url
    nftUrl() {
      if (process.browser) {
        return process.env.VUE_APP_NFT
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="less" scoped>
.card {
  color: rgb(0, 0, 0);
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.card-head {
  padding: 22px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .user-avatar {
      flex: 0 0 32px;
    }
  }
  .username {
    font-weight: 500;
    font-size: 16px;
    color: #000;
    margin: 0px 0px 0px 10px;
  }
  .time {
    font-size: 14px;
    font-weight: 400;
    opacity: 0.5;
    margin: 0px;
    color: #000;
  }
}
.card-content {
  overflow: hidden;
  z-index: 0;
  position: relative;
  /* height: 100%;
  width: 100%; */
  height: 342px;
  max-width: 342px;
  /* width: 342px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* flex: 1; */
  border: 1px solid rgba(0, 0, 0, 0.05);
  .media-video,
  .media-text,
  .media-file,
  .media-url {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    margin: 0px auto;
    object-fit: contain;
  }
  .media-images {
    width: 100%;
    height: 100%;
    /* min-height: 300px; */
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      margin: 0px auto;
      object-fit: contain;
    }
  }
  .media-audio {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.card-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  h5 {
    margin: 24px 0 22px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-size: 24px;
    font-family: "Playfair Display", serif;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
  }
}
.card-footer-price {
  display: flex;
  align-items: center;
  justify-content: start;
  & > div:nth-child(1) {
    margin-right: 62px;
  }
  width: 100%;
  .price {
    font-size: 20px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #193cb1;
    line-height: 24px;
    padding: 0;
    margin: 0;
  }
  .name {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #193cb1;
    line-height: 17px;
    padding: 0;
    margin: 4px 0 0 0;
  }
}
</style>