<template>
  <div class="container">
    <img src="@/assets/img/application_complete.png" alt="done" class="image">
    <p class="text">您的Fan票申请已经成功</p>
    <a href="javascript:;" class="f-btn" @click="done">确定</a>
  </div>
</template>

<script>
export default {
  methods: {
    done() {
      this.$emit('done')
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  padding: 0;
  margin: 20px 0 0;
}
.image {
  width: 240px;
  margin: 200px auto 0;
  display: block;
}


.f-btn {
  width: 300px;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  text-align: center;
  background: rgba(250, 100, 0, 1);
  color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(250, 100, 0, 1);
  margin: 40px auto 0;
  display: block;
}
</style>