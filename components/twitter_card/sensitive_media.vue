<template>
  <div class="sensitive">
    <p>
      该媒体不可用，因为它包含敏感内容。
    </p>
    <span @click="$emit('view')">
      查看
    </span>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="less" scoped>

.sensitive {
  // border: 1px solid #ccd6dd;
  background: #f5f8fa;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    color: #657786;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    margin: 0;
  }

  span {
    color: #657786;
    font-size: 15px;
    font-weight: 700;
    line-height: 20px;
    margin: 0;
    white-space:nowrap;
    cursor: pointer;
  }

}
@media screen and (max-width: 490px) {
  .sensitive {
    flex-direction: column;
    p {
      margin-bottom: 5px;
    }
  }
}

@media screen and (max-width: 375px) {
  .sensitive {
    padding: 10px;
    p {
      font-size: 12px;
    }
  }
}
</style>