<template>
  <div class="container">
    <img src="@/assets/img/application_complete.png" alt="done" class="image">
    <p class="text">您的Fan票申请已经成功提交！</p>
    <p class="text">审核结果将会在5个工作日内通过邮件发送</p>

    <div class="token-footer">  
      <a class="h-rule" href="http://andoromeda.mikecrm.com/a93Le8z" target="_blank">
        任何反馈<svg-icon icon-class="arrow" class="icon" />
      </a>
      <a href="javascript:;" class="f-btn next" @click="done">确定</a>
    </div>
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
.h-rule {
  font-size: 16px;
  font-weight: 500;
  color: rgba(250, 100, 0, 1);
  line-height: 22px;
  margin-right: 20px;
  .icon {
    transition: all 0.2s;
    margin-left: 4px;
  }
  &:hover {
    text-decoration: underline;
    .icon {
      transform: translateX(4px);
    }
  }
}
.token-footer {
  margin-top: 200px;
  text-align: right;
  .f-btn {
    width: 300px;
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    &.next {
      background: rgba(250, 100, 0, 1);
      color: rgba(255, 255, 255, 1);
      border: 1px solid rgba(250, 100, 0, 1);
    }
    &.prev {
      background-color: #fff;
      border: 1px solid rgba(250, 100, 0, 1);
      color: rgba(250, 100, 0, 1);
      margin-right: 20px;
    }
  }
}
</style>