<template>
  <div class="social">
    <svg-icon :icon-class="icon" />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.social {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: @black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: @white;
}
</style>
