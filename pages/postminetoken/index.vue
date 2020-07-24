<template>
  <section class="main">
    <span class="back">
      <svg-icon icon-class="arrow" class="icon" />返回Fan票
    </span>

    <div class="token">
      <section class="steps">
        <section class="step" :class="active >= 0 && 'active'">
          ① 基础信息
        </section>
        <section class="step" :class="active > 1 && 'active'">
          ② Fan票设置
        </section>
        <section class="step" :class="active > 2 && 'active'">
          ③ 提交申请
        </section>
      </section>

      <div class="token-head">
        <span class="h-title">免费发行Fan票</span>
        <a class="h-rule" href="#" target="_blank">
          完整Fan票规则说明<svg-icon icon-class="arrow" class="icon" />
        </a>
      </div>

      <stepOne v-show="active === 0" @done="() => active++" />
      <stepTwo v-show="active === 1" @done="() => active++" @prev="() => active--" />
      <stepThree v-show="active === 2" @done="() => active++" @prev="() => active--" />
      <stepFour v-show="active === 3" />
    </div>
  </section>
</template>


<script>
import stepOne from '@/components/postminetoken_page/step_one'
import stepTwo from '@/components/postminetoken_page/step_two'
import stepThree from '@/components/postminetoken_page/step_three'
import stepFour from '@/components/postminetoken_page/step_four'
export default {
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFour
  },
  data() {
    return {
      active: 3,
      stepOneStatus: false,
      stepTwoStatus: false,
      stepThreeStatus: false,
    }
  },

  methods: {
    prev() {
      this.active--
    },
    next() {

      if (!this.stepOneStatus) {
        this.$message({ showClose: true, message: '请先所有任务哦~', type: 'warning'})
        return
      }
      this.active++

    }
  }
}
</script>
<style lang="less" scoped>
.back {
  display: inline-block;
  margin: 20px 0;
  font-size:20px;
  font-weight:600;
  color:rgba(0,0,0,1);
  line-height:28px;
  cursor: pointer;

  .icon {
    transform: rotate(180deg);
    margin-right: 4px;
  }
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
.token {
  background: #fff;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  overflow: hidden;
  padding: 40px 80px;
  box-sizing: border-box;
}

.steps {
  &::after {
    display: block;
    content: "";
    width: 0;
    height: 0;
    clear: both;
  }
  .step {
    float: left;
    background-color: #dbdbdb;
    padding: 10px 30px;

    font-size: 14px;
    color: rgba(178, 178, 178, 1);

    &:nth-of-type(1) {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    &:nth-last-of-type(1) {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    &.active {
      background-color: #fa6400;
      color: #fff;
    }
  }
}
.token-head {
  margin: 40px 0;
  .h-title {
    font-size: 30px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 42px;
  }
  .h-rule {
    font-size: 16px;
    font-weight: 500;
    color: rgba(250, 100, 0, 1);
    line-height: 22px;
    margin-left: 10px;
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
}
</style>