<template>
  <div class="container">
    <img src="@/assets/img/application_complete.png" alt="done" class="image">
    <p class="text">{{ $t('postminetoken.stepFour') }}</p>
    <p class="text">{{ $t('postminetoken.stepFour1') }}</p>

    <div class="token-footer">  
      <a class="h-rule" href="http://andoromeda.mikecrm.com/a93Le8z" target="_blank">
        {{ $t('postminetoken.feedback') }}<svg-icon icon-class="arrow" class="icon" />
      </a>
      <a href="javascript:;" class="f-btn next" @click="done">{{ $t('postminetoken.define') }}</a>
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
  }
}

@media screen and (max-width: 540px) {
  .token-footer {
    margin-top: 70px;
    .f-btn {
      width: 100%;
      margin: 10px 0 0 0;
    }
  }
}
</style>