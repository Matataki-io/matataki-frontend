<template>
  <div class="home">
    <g-header />
    <div class="home-head">
      <div class="mw flex">
        <div
          v-scroll-reveal="{ distance: '20px'}"
          class="head-text "
        >
          <img class="home-head-logo" src="@/assets/img/home/home_logo.png" alt="matataki">
          <p class="home-head-des">
            一个永久存储和版权确权的内容平台
          </p>
          <p class="home-text-des">
            瞬MATATAKI 是一个保护创作者权益的高质量内容平台，通过IPFS协议保障内容的永久可访问和确权信息可查询；使用了通证经济来激励创作者、探索者、布道者共建未来的超级知识链接网络；致力于回归更加开放去中心化的互联网。
          </p>
          <n-link :to="{name: 'article'}" style="margin-right: 10px;">
            <el-button class="home-btn" icon="el-icon-reading">
              开始阅读
            </el-button>
          </n-link>
          <el-button class="home-btn" icon="el-icon-edit" @click="jumpTo('publish')">
            立即创作
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
            版权永久记录，时间戳高效确权
          </h3>
          <p class="home-text-content">
            区块链与数字版权保护能够完美地结合，解决盗版横行的现状。首先在确权环节，现有机制下的专利申请流程耗时长、效率低下。区块链的分布式账本和时间戳技术使全网对知识产权所属权迅速达成共识成为可能，理论上可实现及时确权。不对称加密技术保证了版权的唯一性，时间戳技术保证了版权归属方，版权主可以方便快捷地完成确权这一流程，解决了传统确权机制低效的问题。
          </p>
          <a target="_blank" class="read-more" href="https://www.matataki.io/p/806">阅读更多 >>></a>
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
            IPFS存储内容，永久记录不删除
          </h3>
          <p class="home-text-content">
            IPFS（InterPlanetary File System）中文名叫星际文件系统，是一种基于内容寻址、版本化、点对点的超媒体传输协议，集合了P2P网络技术、BitTorrent传输技术、Git版本控制、自证明文件系统等技术，允许网络中的参与者互相存储、索取和传输可验证的数据。而且IPFS协议上的数据可永久保存在Web上，不再删除数据。不再依赖主干网络的分布式网络，可以有效抵御黑客对中心化服务器的攻击，用户数据和隐私可以得到更好的保护。
          </p>
          <a target="_blank" class="read-more" href="https://www.matataki.io/p/807">阅读更多 >>></a>
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
            平台积分奖励，与生态共建者共赢
          </h3>
          <p class="home-text-content">
            瞬MATATAKI将回馈所有参与生态建设的共建者！
            <br>
            <br>
            因为你们付出的注意力帮助我们更好得判断内容质量，你们付出的注意力将直接帮助其他探索者节省时间！
            <br>
            <br>
            因为你们付出的创作力帮助我们更好的发展壮大，你们付出的创作力将直接帮助每一位探索者进步！
            <br>
            <br>
            因为你们付出的传播力帮助我们更好得被众人所知，你们付出的传播力将推动世界变得更加美好！
          </p>
          <a target="_blank" class="read-more" href="https://www.matataki.io/p/781">阅读更多 >>></a>
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
          title: '行业痛点',
          subtitle: '激励手段不明确',
          img: effect1,
          des: '传统创作平台的积分激励手段让参与者感觉自己就是局外人，虽然为平台做出了贡献，可是缺乏公开透明的机制，无法规避平台暗箱操作，可能出现积分失效、积分增发、积分无法流通交易等问题。'
        },
        {
          title: '行业痛点',
          subtitle: '权益难以被保障',
          img: effect2,
          des: '作者创作的内容以及创作行为的数据存在平台数据库，缺乏信任可被随意删改，因此难以证明内容的版权。一旦需要进行法律维权则缺乏有效证据。'
        },
        {
          title: '行业痛点',
          subtitle: '平台掌握所有权',
          img: effect3,
          des: '写作爱好者将自己的文笔记录在创作平台、社交网络、微信公众号中。但是这些平台可以对你的内容自由删改，对你的账号随意封禁，网站也可能会停运。'
        },
        {
          title: '解决方案',
          subtitle: '运用IPFS技术',
          img: effect4,
          des: '瞬MATATAKI采用了星际文件系统（IPFS）协议，每个文件只存在独一无二的一份，减少存储资源浪费，降低存储成本，实现平台资源永不丢失，网站永不关停，保障用户权益永久有效。'
        },
        {
          title: '解决方案',
          subtitle: '支持区块链账号',
          img: effect5,
          des: '支持使用EOS、本体等主流公链的去中心化账号登入，平台无法触碰用户私钥。使用IPFS技术记录内容修改操作，任何人包括平台都无法篡改。'
        },
        {
          title: '解决方案',
          subtitle: '积分激励系统',
          img: effect6,
          des: '冷启动阶段专注于满足用户需求和验证商业模式，通过注意力挖矿和劳动力挖矿获得积分，用积分形式代在产品内部流转。正式启动后按比例映射为生态Token，并给予用户诸多平台权益。'
        }
      ],
      stageList: [
        {
          title: '阶段1',
          des: '建立内容分享和永久存储的平台',
          des1: '打造IPFS内容生态入口',
          img: stage1
        },
        {
          title: '阶段2',
          des: '建立版权保护系统与非法行为抗争',
          des1: '打造安全的区块链内容生态',
          img: stage2
        },
        {
          title: '阶段3',
          des: '建立人类知识共享和创新的平台',
          des1: '打造区块链永存知识数据库',
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
          this.$message({ message: '请先登录', type: 'warning', customClass: 'zindex-3000' })
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
  background-image: url('../assets/img/home/stage_bg.png');
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
