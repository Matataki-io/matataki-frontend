<template>
  <div class="container">
    <div class="brick" />
    <div class="number">
      <div class="four" />
      <div class="zero">
        <div class="nail" />
      </div>
      <div class="four" />
    </div>
    <div class="info">
      <p>{{ $t('notPage') }}</p>
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

.number{
    position: relative;
    z-index: 100;
    text-align: center;
    margin-top: 79px;
}

.number .four{
    width: 230px;
    height: 292px;
    display: inline-block;
    background-image: url("../../assets/img/404/four.png");
    background-repeat: no-repeat;
    background-size: 100%;
    z-index: 19;
    position: relative;
}

.number .zero{
    width: 230px;
    height: 292px;
    display: inline-block;
    background-image: url("../../assets/img/404/zero.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: 0px 20px;
    position: relative;
    z-index: 18;
    -moz-animation: 4s ease 0s normal none infinite zero;
    -moz-transform-origin: center top;
    -webkit-animation:zero 4s infinite ease-in-out;
    -webkit-transform-origin:top;
    -o-animation: 4s ease 0s normal none infinite zero;
    -o-transform-origin: center top;
    -o-animation:zero 4s infinite ease-in-out;
    -o-transform-origin:top;
    -ms-animation: 4s ease 0s normal none infinite zero;
    -ms-transform-origin: center top;
    -ms-animation:zero 4s infinite ease-in-out;
    -ms-transform-origin:top;
    animation: 4s ease 0s normal none infinite zero;
    transform-origin: center top;
    animation:zero 4s infinite ease-in-out;
    transform-origin:top;
}

.number .zero .nail{
    width: 30px;
    height: 50px;
    top: 6px;
    left: 115px;
    background-image: url("../../assets/img/404/nail.png");
    background-repeat: no-repeat;
    background-size: 100%;
    position: absolute;
}

@-moz-keyframes zero {
    0%{-moz-transform:rotate(-2deg)}
    50%{-moz-transform:rotate(2deg)}
    100%{-moz-transform:rotate(-2deg)}
}

@-webkit-keyframes zero {
    0%{-webkit-transform:rotate(-2deg)}
    50%{-webkit-transform:rotate(2deg)}
    100%{-webkit-transform:rotate(-2deg)}
}

@-o-keyframes zero {
    0%{-o-transform:rotate(-2deg)}
    50%{-o-transform:rotate(2deg)}
    100%{-o-transform:rotate(-2deg)}
}

@-ms-keyframes zero {
    0%{-ms-transform:rotate(-2deg)}
    50%{-ms-transform:rotate(2deg)}
    100%{-ms-transform:rotate(-2deg)}
}

@keyframes zero {
    0%{transform:rotate(-2deg)}
    50%{transform:rotate(2deg)}
    100%{transform:rotate(-2deg)}
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
