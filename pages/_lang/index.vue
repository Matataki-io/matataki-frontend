<template>
  <div class="home">
    <g-header />
    <div class="home-head">
      <div class="mw flex">
        <div
          v-scroll-reveal="{ distance: '20px'}"
          class="head-text "
        >
          <img class="home-head-logo" src="@/assets/img/home/home_logo.png" :alt="$t('about.logo')">
          <p class="home-head-des">
            {{ $t('about.homeTitle') }}
          </p>
          <p class="home-text-des">
            {{ $t('about.homeDes') }}
          </p>
          <n-link :to="{name: 'article'}" style="margin-right: 10px;">
            <el-button class="home-btn" icon="el-icon-reading">
              {{ $t('about.homeBtnRead') }}
            </el-button>
          </n-link>
          <el-button class="home-btn" icon="el-icon-edit" @click="jumpTo('publish')">
            {{ $t('about.homeBtnCreate') }}
          </el-button>
        </div>
        <img v-scroll-reveal="{ distance: '20px', delay: 300}" class="home-head-img" src="@/assets/img/home/home_head.png" alt="matataki">
      </div>
      <div class="skew effect-bg" />
    </div>
    <div class="home-effect">
      <el-row class="mw effect">
        <el-col v-for="(item, index) in effectList" :key="index" :span="8">
          <div v-scroll-reveal="{distance: '20px', delay: index * 200}" class="effect-block">
            <h3 class="effect-title">
              {{ item.title }}
            </h3>
            <h4 class="effect-subtitle">
              {{ item.subtitle }}
            </h4>
            <img :src="item.img" alt="effect" class="effect-img">
            <p class="effect-des">
              {{ item.des }}
            </p>
          </div>
        </el-col>
      </el-row>
      <div class="mw flex recording">
        <div v-scroll-reveal="{ distance: '20px'}" class="home-text">
          <h3 class="home-text-title">
            {{ $t('about.blockTitle1') }}
          </h3>
          <p class="home-text-content">
            {{ $t('about.blockDes1') }}
          </p>
          <a target="_blank" class="read-more" href="https://www.matataki.io/p/806"> {{ $t('readMore') }}</a>
        </div>
        <img v-scroll-reveal="{ distance: '20px', delay: 300}" class="effect-flex-img" src="@/assets/img/home/home_head1.png" alt="matataki">
      </div>
    </div>
    <div class="home-block ipfs">
      <div class="stage-bg">
        <div class="skew effect-bg top" />
      </div>
      <div class="mw flex">
        <div v-scroll-reveal="{ distance: '20px'}" class="home-text ipfs">
          <h3 class="home-text-title">
            {{ $t('about.blockTitle2') }}
          </h3>
          <p class="home-text-content">
            {{ $t('about.blockDes2') }}
          </p>
          <a target="_blank" class="read-more" href="https://www.matataki.io/p/807"> {{ $t('readMore') }}</a>
        </div>
        <img v-scroll-reveal="{ distance: '20px', delay: 300}" class="effect-flex-img" src="@/assets/img/home/home_head2.png" alt="matataki">
      </div>
      <div class="skew point-bg" />
    </div>
    <div class="home-block flex point">
      <div class="mw flex">
        <img v-scroll-reveal="{ distance: '20px', delay: 300}" class="effect-flex-img" src="@/assets/img/home/home_head3.png" alt="matataki">

        <div v-scroll-reveal="{ distance: '20px'}" class="home-text point">
          <h3 class="home-text-title">
            {{ $t('about.blockTitle3') }}
          </h3>
          <p class="home-text-content">
            {{ $t('about.blockDes31') }}
            <br>
            <br>
            {{ $t('about.blockDes32') }}
            <br>
            <br>
            {{ $t('about.blockDes33') }}
            <br>
            <br>
            {{ $t('about.blockDes34') }}
          </p>
          <a target="_blank" class="read-more" href="https://www.matataki.io/p/781"> {{ $t('readMore') }}</a>
        </div>
      </div>
    </div>
    <div class="home-stage">
      <div class="stage-bg">
        <div class="skew point-bg top" />
      </div>
      <el-row class="mw flex stage">
        <el-col v-for="(item, index) in stageList" :key="index" :span="8">
          <div v-scroll-reveal="{distance: '20px', delay: index*200}" class="stage-block">
            <img class="stage-img" :src="item.img" alt="stage">
            <h3 class="stage-title">
              {{ item.title }}
            </h3>
            <p class="stage-des">
              {{ item.des }}
            </p>
            <p class="stage-des">
              {{ item.des1 }}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import effect1 from '@/assets/img/home/effect1.png'
import effect2 from '@/assets/img/home/effect2.png'
import effect3 from '@/assets/img/home/effect3.png'
import effect4 from '@/assets/img/home/effect4.png'
import effect5 from '@/assets/img/home/effect5.png'
import effect6 from '@/assets/img/home/effect6.png'

import stage1 from '@/assets/img/home/stage1.png'
import stage2 from '@/assets/img/home/stage2.png'
import stage3 from '@/assets/img/home/stage3.png'

export default {
  data() {
    return {
      effectList: [
        {
          title: this.$t('about.painPoint'),
          subtitle: this.$t('about.painPointTitle1'),
          img: effect1,
          des: this.$t('about.painPointDes1')
        },
        {
          title: this.$t('about.painPoint'),
          subtitle: this.$t('about.painPointTitle2'),
          img: effect2,
          des: this.$t('about.painPointDes2')
        },
        {
          title: this.$t('about.painPoint'),
          subtitle: this.$t('about.painPointTitle3'),
          img: effect3,
          des: this.$t('about.painPointDes3')
        },
        {
          title: this.$t('about.program'),
          subtitle: this.$t('about.programTitle1'),
          img: effect6,
          des: this.$t('about.programDes1')
        },
        {
          title: this.$t('about.program'),
          subtitle: this.$t('about.programTitle2'),
          img: effect4,
          des: this.$t('about.programDes2')
        },
        {
          title: this.$t('about.program'),
          subtitle: this.$t('about.programTitle3'),
          img: effect5,
          des: this.$t('about.programDes3')
        }
      ],
      stageList: [
        {
          title: this.$t('about.stageTitle1'),
          des: this.$t('about.stageDes11'),
          des1: this.$t('about.stageDes12'),
          img: stage1
        },
        {
          title: this.$t('about.stageTitle2'),
          des: this.$t('about.stageDes21'),
          des1: this.$t('about.stageDes22'),
          img: stage2
        },
        {
          title: this.$t('about.stageTitle3'),
          des: this.$t('about.stageDes31'),
          des1: this.$t('about.stageDes32'),
          img: stage3
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  mounted() {
  },
  methods: {
    jumpTo(name) {
      if (name === 'publish') {
        if (this.isLogined) this.$router.push({ name: 'publish', params: { id: 'create' } })
        else {
          this.$store.commit('setLoginModal', true)
        }
      } else {
        this.$router.push({ name: name })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .minHeight();
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skew {
  width: 120%;
  height: 240px;
  background: #fff;
  position: absolute;
  bottom: -240px;
  transform: rotate(-4deg);
  transform-origin: 0;
  z-index: 9;
  &.effect-bg {
    background-color: #F9F8FF;
  }
  &.point-bg {
    background-color: #FCFBFF;
  }
  &.top {
    bottom: auto;
    top: -240px;
    right: 0;
    left: auto;
    transform: rotate(-4deg);
    transform-origin: 100% 0;
  }
}

.home-text {
  margin-right: 140px;
  &.ipfs {
    margin-right: 140px;
  }
  &.point {
    margin-right: 0;
    margin-left: 140px;
  }
}
.home-text-title {
  font-size:30px;
  font-weight: bold;
  color:rgba(0,0,0,1);
  line-height:42px;
  padding: 0;
  margin: 0 0 40px 0;
}
.home-text-content {
  font-size:16px;
  font-weight:400;
  color: #fff;
  padding: 0;
  color:rgba(0,0,0,1);
  line-height:26px;
  word-break: break-all;
}
.read-more {
  text-align: right;
  font-size:16px;
  font-weight:400;
  color:@purpleDark;
  line-height:22px;
  float: right;
  margin-top: 40px;
}

.home-head {
  height: 1084px;
  background: radial-gradient(circle, #5f2ca4, #070222);
  display: flex;
  align-items: center;
  padding: 0 0 200px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .head-text {
    margin-right: 140px;
  }
  &-img {
    max-width: 680px;
  }
  &-logo {
    width: 260px;
  }
  .home-text-des {
    font-size:16px;
    font-weight:400;
    color: #fff;
    padding: 0;
    margin: 6px 0;
    line-height: 1.5;
  }
  .home-head-des {
    font-size: 20px;
    font-weight:400;
    color: #fff;
    padding: 0;
    margin: 10px 0 20px;
    line-height: 1.5;
  }
  .home-btn {
    background-color: @purpleDark;;
    border-color: @purpleDark;;
    color: #fff;
    margin-top: 24px;
    font-size: 18px;
    &:hover {
      opacity: .9;
    }
  }
}

.home-effect {
  background-color: #F9F8FF;
  .recording {
    padding-top: 240px;
    padding-bottom: 120px;
  }
}
.effect {
  margin-top: -230px;
  z-index: 10;
  &-block {
    max-width: 347px;
    height: 560px;
    background-color: #fff;
    box-shadow:0px 4px 30px 0px rgba(0,0,0,0.1);
    border-radius:14px;
    box-sizing: border-box;
    padding: 40px 40px 0 40px;
    margin: 40px auto 0;
    box-sizing: border-box;
    transition: box-shadow .2s;;
    cursor: pointer;
  }
  &-img {
    width: 140px;
    display: block;
    margin: 40px auto;
  }
  &-title {
    font-size:30px;
    font-weight: bold;
    color:@purpleDark;
    padding: 0;
    margin: 0;
    text-align: center;
  }
  &-subtitle {
    padding: 0;
    margin: 10px 0 0;
    text-align: center;
    font-size:20px;
    font-weight:600;
    color:rgba(51,51,51,1);
  }
  &-des {
    font-size:16px;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:22px;
  }
}
.effect-flex-img {
  max-width: 580px;
}
.ipfs-flex-img {
  max-width: 620px;
}

.home-block {
  &.ipfs {
    background-color: #fff;
    position: relative;
    padding: 200px 0;
    overflow: hidden;
  }
  &.point {
    background: #FCFBFF;
    position: relative;
    overflow: hidden;
    padding: 170px 0 150px;
  }
}
.home-stage {
  background-color: #fff;
  background-image: url('../../assets/img/home/stage_bg.png');
  background-position: center;
  background-size: cover;
  position: relative;
  overflow: hidden;
  .stage {
    padding: 90px 0 200px;
  }
  .stage-block {
    margin: 0 auto;
  }
  .stage-title {
    text-align: center;
    font-size:30px;
    color:@purpleDark;
    line-height:42px;
    padding: 0;
    margin: 40px 0 20px;
  }
  .stage-des {
    text-align: center;
    font-size:20px;
    color:rgba(51,51,51,1);
    line-height:28px;
    padding: 0;
    margin: 0;
  }
  .stage-img {
    max-width: 224px;
    display: block;
    margin: 0 auto;
  }
  .stage-bg {
    position: relative;
    height: 240px;
    overflow: hidden;
  }
}
</style>
<style lang="less">
.effect {
  .el-col {
    transition: transform .3s;
    &:hover {
      transform: translate(0, -4px);
      .effect-block {
        box-shadow:0px 4px 30px 0px rgba(0,0,0,0.15);
      }
    }
    &:nth-child(3n+1) .effect-block {
      margin: 40px 0 0 0;
    }
    &:nth-child(3n) .effect-block {
      margin-right: 0;
      margin-left: auto;
    }
  }
}
</style>
