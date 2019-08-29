<template>
  <div class="home">
    <g-header />
    <div class="home-head">
      <div class="mw flex">
        <div class="head-text">
          <img class="home-head-logo" src="@/assets/img/home/home_logo.png" alt="matataki">
          <p class="home-text-des">
            瞬MATATAKI的名字来源于圣斗士星矢的仙女座瞬
          </p>
          <p class="home-text-des">
            瞬MATATAKI的名字来源于圣斗士星矢的仙女座瞬
          </p>
          <p class="home-text-des">
            瞬MATATAKI的名字来源于圣斗士星矢的仙女座瞬
          </p>
          <p class="home-text-des">
            瞬MATATAKI的名字来源于圣斗士星矢的仙女座瞬
          </p>
        </div>
        <img class="home-head-img" src="@/assets/img/home/home_head.png" alt="matataki">
      </div>
      <div class="skew effect-bg" />
    </div>
    <div class="home-effect">
      <el-row class="mw effect">
        <el-col v-for="(item, index) in effectList" :key="index" :span="8">
          <div class="effect-block">
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
        <div class="home-text">
          <h3 class="home-text-title">
            内容上链和版权记录
          </h3>
          <p class="home-text-content">
            工信部：区块链与数字版权保护能够完美地结合，解决盗版横行的现状。首先在确权环节，现有机制下的专利申请流程耗时长、效率低下。区块链的分布式账本和时间戳技术使全网对知识产权所属权迅速达成共识成为可能，理论上可实现及时确权。不对称加密技术保证了版权的唯一性，时间戳技术保证了版权归属方，版权主可以方便快捷地完成确权这一流程，解决了传统确权机制低效的问题。
          </p>
        </div>
        <img class="effect-flex-img" src="@/assets/img/home/home_head1.png" alt="matataki">
      </div>
    </div>
    <div class="home-block ipfs">
      <div class="stage-bg">
        <div class="skew effect-bg top" />
      </div>
      <div class="mw flex">
        <div class="home-text ipfs">
          <h3 class="home-text-title">
            IPFS分布式存储<br>
            不用担心文件被删除
          </h3>
          <p class="home-text-content">
            数据采用IPFS协议分布式存储，每个文件只存在独一无二的一份，减少存储资源浪费，降低存储成本，实现平台资源永不丢失，网站永不关停，保障用户权益永久有效。
            <br>
            <br>
            凯文凯利：次级单位之间彼此高度连接,点对点间的影响通过网络形成了非线性因果关系.一个分布式的复杂网络所具有的弹性是极强的。
          </p>
          <a class="read-more" href="#">阅读更多 >>></a>
        </div>
        <img class="effect-flex-img" src="@/assets/img/home/home_head2.png" alt="matataki">
      </div>
      <div class="skew point-bg" />
    </div>
    <div class="home-block flex point">
      <div class="mw flex">
        <img class="effect-flex-img" src="@/assets/img/home/home_head3.png" alt="matataki">

        <div class="home-text point">
          <h3 class="home-text-title">
            积分奖励<br>
            让生态共建者共赢
          </h3>
          <p class="home-text-content">
            每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，每个参与瞬MATATAKI生态建设的共建者都有所付出，
          </p>
          <a class="read-more" href="#">阅读更多 >>></a>
        </div>
      </div>
    </div>
    <div class="home-stage">
      <div class="stage-bg">
        <div class="skew point-bg top" />
      </div>
      <el-row class="mw flex stage">
        <el-col v-for="(item, index) in stageList" :key="index" :span="8">
          <div class="stage-block">
            <img class="stage-img" :src="item.img" alt="stage">
            <h3 class="stage-title">
              {{ item.title }}
            </h3>
            <p class="stage-des">
              {{ item.des }}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
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
          subtitle: '存证困难',
          img: effect1,
          des: '在数据、隐私这块“新大陆”上，面对来势汹汹的巨头“牛仔”，不要做眼巴巴看着自己地盘被圈、或是把自己的地盘廉价卖出换来几颗好看彩珠的“原住民”。什么是好看的彩珠？就是免费的、新潮的、便利的但同时才收集你个人偏好、数据乃至隐私的网络服务。'
        },
        {
          title: '行业痛点',
          subtitle: '版权无法被保护',
          img: effect2,
          des: '在数据、隐私这块“新大陆”上，面对来势汹汹的巨头“牛仔”，不要做眼巴巴看着自己地盘被圈、或是把自己的地盘廉价卖出换来几颗好看彩珠的“原住民”。什么是好看的彩珠？就是免费的、新潮的、便利的但同时才收集你个人偏好、数据乃至隐私的网络服务。'
        },
        {
          title: '行业痛点',
          subtitle: '随时被删号',
          img: effect3,
          des: '在数据、隐私这块“新大陆”上，面对来势汹汹的巨头“牛仔”，不要做眼巴巴看着自己地盘被圈、或是把自己的地盘廉价卖出换来几颗好看彩珠的“原住民”。什么是好看的彩珠？就是免费的、新潮的、便利的但同时才收集你个人偏好、数据乃至隐私的网络服务。'
        },
        {
          title: '特征',
          subtitle: '内容上链',
          img: effect4,
          des: '在数据、隐私这块“新大陆”上，面对来势汹汹的巨头“牛仔”，不要做眼巴巴看着自己地盘被圈、或是把自己的地盘廉价卖出换来几颗好看彩珠的“原住民”。什么是好看的彩珠？就是免费的、新潮的、便利的但同时才收集你个人偏好、数据乃至隐私的网络服务。'
        },
        {
          title: '特征',
          subtitle: '版权记录',
          img: effect5,
          des: '在数据、隐私这块“新大陆”上，面对来势汹汹的巨头“牛仔”，不要做眼巴巴看着自己地盘被圈、或是把自己的地盘廉价卖出换来几颗好看彩珠的“原住民”。什么是好看的彩珠？就是免费的、新潮的、便利的但同时才收集你个人偏好、数据乃至隐私的网络服务。'
        },
        {
          title: '特征',
          subtitle: '永久储存',
          img: effect6,
          des: '在数据、隐私这块“新大陆”上，面对来势汹汹的巨头“牛仔”，不要做眼巴巴看着自己地盘被圈、或是把自己的地盘廉价卖出换来几颗好看彩珠的“原住民”。什么是好看的彩珠？就是免费的、新潮的、便利的但同时才收集你个人偏好、数据乃至隐私的网络服务。'
        }
      ],
      stageList: [
        {
          title: '阶段1',
          des: '建立内容分享和永久存储的平台',
          img: stage1
        },
        {
          title: '阶段2',
          des: '建立版权保护系统与非法行为抗争',
          img: stage2
        },
        {
          title: '阶段3',
          des: '建立人类知识共享和创新的平台',
          img: stage3
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped src="./index.less">

</style>
<style lang="less">
.effect {
  .el-col {
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
