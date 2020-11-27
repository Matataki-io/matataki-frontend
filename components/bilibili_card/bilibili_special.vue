<template>
  <a :href="sketch.target_url" target="_blank">
    <div class="videocard">
      <div class="videocard-l">
        <el-image
          :src="sketch.cover_url"
          alt="image"
          fit="cover"
          lazy
        />
      </div>
      <div class="videocard-r">
        <h4>
          {{ sketch.title }}
        </h4>
        <p>
          {{ sketch.desc_text }}
        </p>
      </div>
    </div>
  </a>
</template>

<script>

export default {
  props: {
    // 卡片数据
    sketch: {
      type: Object,
      required: true
    }
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>

.word-limit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

a {
  text-decoration: none;
}

.videocard {
  margin-top: 10px;
  border: 1px solid #E6E9EE;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  height: 82px;
  display: flex;
  max-width: 520px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  }

  &-l {
    width: 80px;
    height: 80px;
    min-width: 80px;
    min-height: 80px;
    position: relative;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  &-r {
    margin: 0 12px 0 16px;
    h4 {
      font-size: 14px;
      font-weight: 500;
      line-height: 19px;
      color: #212121;
      margin: 16px 0 0;
      padding: 0;
      .word-limit();
    }

    p {
      margin:  10px 0 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 19px;
      color: #666;
      padding: 0;
      .word-limit();
    }
  }

}
</style>