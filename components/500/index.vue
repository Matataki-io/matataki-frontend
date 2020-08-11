<template>
  <div class="container">
    <div class="brick" />
    <img
      class="error-gif"
      src="@/assets/img/500/01.gif"
      alt="error"
    >
    <div class="info">
      <p>{{ $t('serverError') }}</p>
      <p class="back">
        三秒后自动返回首页...
      </p>
      <a
        href="/"
        class="btn"
      >{{ $t('backHome') }}</a>
      <a
        href="https://support.qq.com/products/98576"
        target="_blank"
        class="btn"
      >{{ $t('feedback') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null
    }
  },
  created() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.$router.push('/')
    }, 3000)
  }
}
</script>

<style scoped>
.btn{
    font-size: 18px;
    font-weight: 300;
    color: #ffffff;
    /* border: 0px solid;
    border-bottom: 2px solid;
    border-color: #12172e; */
    /* padding: 10px 10px; */
    /* border-radius: 5px; */
    background: none;
    display: inline-block;
    margin: 10px;
    /* background-color: #00a9e1; */
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    text-decoration: none;
    cursor: pointer;
    text-decoration: underline;
}

/* .btn:hover{
    background: #0090c0;
    color: #ffffff;
    text-decoration: none;
} */

.container{
    min-height: 100%;
    height: 100%;
    width: 100%;
}

.brick{
    position: absolute;
    top: 135px;
    left: -20px;
    width: 435px;
    height: 210px;
    background-image: url("../../assets/img/404/wall-1.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
}

.error-gif {
    position: relative;
    z-index: 999;
    display: block;
    margin: 0 auto 80px;
    transform: scale(1.8);
}
.info{
    position: relative;
    z-index: 999;
    text-align: center;
}

.info h2{
    font-size: 50px;
    font-weight: 300;
    color: #ffc938;
}

.info p{
    font-size: 20px;
    color: #ffffff;
}
.info .back {
    padding: 0;
    margin: 0;
    font-weight: 400;
    letter-spacing: 1px;
    font-size: 16px;
}
</style>

