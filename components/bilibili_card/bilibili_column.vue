<template>
  <a class="linkbox" :href="'https://www.bilibili.com/read/cv' + card.id" target="_blank">
    <div class="videocard">
      <div class="videocard-cover">
        <el-image
          v-for="(urls, index) in card.image_urls"
          :key="index"
          :src="urls"
          alt="image"
          fit="cover"
          lazy
        />
      </div>
      <div class="videocard-main">
        <h4>
          {{ card.title }}
        </h4>
        <p>
          {{ card.summary }}
        </p>
      </div>
    </div>
  </a>
</template>

<script>

export default {
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    }
  },
  computed: {

  }
}
</script>

<style lang="less" scoped>

.linkbox {
  text-decoration: none;
  display: block;
}

.word-limit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.videocard {
  margin-top: 10px;
  border: 1px solid #E6E9EE;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  max-width: 520px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  }

  &-cover {
    height: 128px;
    min-width: 203px;
    position: relative;
    overflow: hidden;
    display: flex;

    .el-image {
      flex: 1;
      height: 100%;
    }
  }

  &-main {
    padding: 10px 20px 14px;

    h4 {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: #212121;
      margin: 0 0 6px;
      padding: 0;
      .word-limit();
      -webkit-line-clamp: 1;
    }

    p {
      height: 38px;
      margin:  0;
      padding: 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 19px;
      color: #666;
      .word-limit();
      -webkit-line-clamp: 2;
    }
  }

}
</style>