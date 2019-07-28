<template>
  <div class="info">
    <div class="cover">
      <img v-if="false" src="" alt="cover">
      <img v-else src="@/assets/img/article_bg.svg" alt="cover">
    </div>
    <avatar class="avatar" />
    <h3 class="author">
      xiaotiandada
    </h3>
    <p class="des">
      我身体的70%是由电子乐组成的我身体的70%是由电子乐组成的。。
    </p>
    <div class="line" />
    <div class="follow-fan">
      <div class="data">
        <p class="num">
          120
        </p>
        <p class="title">
          关注
        </p>
      </div>
      <div class="data">
        <p class="num">
          120
        </p>
        <p class="title">
          关注
        </p>
      </div>
    </div>
    <div class="line" />
    <button class="button">
      关注
    </button>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  }
}
</script>

<style lang="less" scoped>
.line{
  width: 190px;
  height: 1px;
  background-color: #DBDBDB;
  margin: 0 auto;
}

.info {
  overflow: hidden;
  border-radius: @borderRadius10;
  background-color: #fff;
}
.avatar {
    width: 60px !important;
    height: 60px !important;
    margin: -30px auto;
    background: #eee;
    z-index: 1;
    position: relative;
}
.cover {
  width: 100%;
  height: 90px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.author {
      text-align: center;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0,0,0,1);
    line-height: 28px;
    margin: 40px 0 0;
}
.des {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 17px;
    width: 70%;
    text-align: left;
    margin: 10px auto 20px;
}

.follow-fan {
    display: flex;
    justify-content: center;
    align-items: center;
    .data {
       margin: 20px 18px;
    text-align: center;
      .num {
font-size:24px;
font-weight:600;
color:rgba(28,156,254,1);
line-height:33px;
padding: 0;
margin: 0;
      }
      .title {
font-size:14px;
font-weight:400;
color:rgba(0,0,0,1);
line-height:17px;
padding: 0;
margin: 2px 0 0;
      }
    }
}

.button {
  background-color: @black;
border-radius:@borderRadius6;
    width: 190px;
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
    margin: 20px auto 40px;
    text-align: center;
    display: block;
}
</style>
