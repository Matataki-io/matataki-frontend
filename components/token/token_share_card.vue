<template>
  <div class="card">
    <div :class="cardStyleComputed" class="card-bg">
      <div class="avatar">
        <img :src="cover" alt="avatar">
      </div>
      <h1 class="title">
        {{ minetokenToken.symbol }}
      </h1>
      <p class="name">
        {{ minetokenToken.name }}
      </p>
    </div>
    <div class="content">
      <div class="list">
        <div class="list-title">
          {{ $t('token.founder') }}：
        </div>
        <div class="list-content">
          {{ minetokenUser.nickname || minetokenUser.username }}
        </div>
      </div>
      <div class="list margin">
        <div class="list-title">
          发行量：
        </div>
        <div class="list-content">
          {{ amount }}-{{ minetokenToken.symbol }}
        </div>
      </div>
      <div class="list">
        <div class="list-title">
          简&emsp;介：
        </div>
        <div v-clampy="6" class="list-content">
          {{ minetokenToken.brief }}
        </div>
      </div>

      <img class="slogan" src="@/assets/img/token_share_slogan.png" alt="slogan">
      <div class="fl ac jc">
        <img class="logo" src="@/assets/img/token_share_logo.png" alt="logo">
        <qrcode :value="link" :options="{ width: '80' }" class="code" />
      </div>
      <el-divider>
        <div class="info">
          扫描二维码&nbsp;&nbsp;了解Fan票
        </div>
      </el-divider>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    qrcode: VueQrcode
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
    minetokenUser: {
      type: Object,
      required: true
    },
    cardStyle: {
      type: Number,
      required: true
    }
  },
  computed: {
    cover() {
      return this.minetokenToken.logo ? this.$ossProcess(this.minetokenToken.logo) : ''
    },
    amount() {
      const tokenamount = precision(this.minetokenToken.total_supply || 0, 'CNY', this.minetokenToken.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    link() {
      return `${process.env.VUE_APP_URL}/token/${this.$route.params.id}`
    },
    cardStyleComputed() {
      return this.cardStyle === 1 ? 'bg1' : 'bg2'
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  max-width: 360px;
  // height: 666px;
  // border: 1px solid #f1f1f1;
}

.card-bg {
  width: 100%;
  height: 180px;
  background: #431055;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
  text-align: center;
  &.bg1 {
    background-image: url('../../assets/img/token_share_bg1.png');
  }
  &.bg2 {
    background-image: url('../../assets/img/token_share_bg2.png');
  }
}
.card-bg.bg2 .title {
  color: #000;
}
.card-bg.bg2 .name {
  color: @purpleDark;
}
.avatar {
  border: 2px solid #fff;
  border-radius: 50%;
  margin: 34px auto 0;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.title {
  font-size: 30px;
  color: #ffffff;
  margin: 4px auto 0;
  padding: 0;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
}
.name {
  font-size: 12px;
  font-weight:normal;
  color:rgba(247,181,0,1);
  margin: 0 auto;
  padding: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
  line-height: 1.5;
}

.list {
  display: flex;
  &.margin {
    margin: 10px 0;
  }
  &-title {
    flex: 0 0 60px;
    width: 60px;
    font-size:12px;
    color:rgba(178,178,178,1);
    letter-spacing:1px;
    line-height: 1.5;
  }
  &-content {
    font-size:12px;
    color:rgba(0,0,0,1);
    letter-spacing:2px;
    line-height: 1.5;
  }
}
.content {
  padding: 30px 40px 14px 40px;
}

.slogan {
  height: 18px;
  display: block;
  margin: 50px auto 20px;
}
.code {
  margin: 0 12px;
}
.logo {
  margin: 0 12px;
  height: 62px;
}
.info {
  font-size: 12px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 17px;
  width: 140px;
  text-align: center;
}
</style>
