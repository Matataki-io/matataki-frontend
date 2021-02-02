<template>
  <a class="linkbox" :href="'https://www.bilibili.com/video/av' + card.aid" target="_blank">
    <div class="videocard">
      <div class="videocard-l">
        <el-image
          :src="card.pic"
          alt="image"
          fit="cover"
          lazy
        />
        <div class="videocard-l-type">
          {{ $t('contribution-video') }}
        </div>
      </div>
      <div class="videocard-r">
        <h4>
          {{ card.title }}
        </h4>
        <p>
          {{ card.desc }}
        </p>
        <div class="videocard-r-heat">
          <div class="videocard-r-heat-views">
            <svg-icon icon-class="bilibili_views" />
            {{ card.stat.view }}
          </div>
          <div class="videocard-r-heat-barrage">
            <svg-icon icon-class="bilibili_barrage" />
            {{ card.stat.danmaku }}
          </div>
        </div>
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
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}

.videocard {
  border: 1px solid #E6E9EE;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  height: 127px;
  display: flex;
  max-width: 520px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  }

  &-l {
    width: 203px;
    height: 100%;
    min-width: 203px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
    &-type {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #fb7299;
      text-align: center;
      font-size: 12px;
      height: 18px;
      color: white;
      padding: 0 4px;
      border-radius: 5px;
      overflow: hidden;
    }
  }

  &-r {
    margin: 0 12px 0 16px;
    h4 {
      font-size: 14px;
      font-weight: 500;
      line-height: 19px;
      color: #212121;
      height: 38px;
      margin: 9px 0 0;
      padding: 0;
      .word-limit();
    }

    p {
      height: 38px;
      margin:  8px 0 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 19px;
      color: #666;
      padding: 0;
      .word-limit();
    }

    &-heat {
      display: flex;
      margin-top: 8px;
      &-views {
        margin: 0 10px 0 0;
        color: #999;
        font-size: 12px;
        line-height: 18px;
        svg {
          font-size: 14px;
        }
      }

      &-barrage {
        margin: 0;
        color: #999;
        font-size: 12px;
        line-height: 18px;
        svg {
          font-size: 14px;
        }
      }
    }
  }

}
</style>