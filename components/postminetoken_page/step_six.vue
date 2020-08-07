<template>
  <div class="container">
    <img src="@/assets/img/application_complete.png" alt="done" class="image">
    <p class="text">{{ $t('postminetoken.stepSix') }}</p>
    <p v-if="reason" class="token-reason">{{ reason }}</p>
    <a href="javascript:;" class="f-btn" @click="done">{{ $t('postminetoken.stepSixRest') }}</a>
  </div>
</template>

<script>
export default {
  props: {
    reason: {
      type: String,
      default: ''
    }
  },
  methods: {
    done() {
      this.$emit('done')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
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
  margin: 100px auto 0;
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

.token-reason {
  white-space: pre-wrap;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 10px 0;
  padding: 0;
  overflow: hidden;
  word-break: break-all;
  display: inline-block;
  max-width: 400px;
}

@media screen and (max-width: 540px) {
  .image {
    margin-top: 100px;
  }
  .f-btn {
    width: 100%;
    margin-top: 100px;
  }
}
</style>