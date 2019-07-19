<template>
  <div class="asset mw">
    <BaseHeader :pageinfo="{ left: 'back', title: '我的账户', rightPage: 'home' }" />
    <div class="asset-list">
      <div v-for="(item, index) in assetList" :key="index" class="list" @click="jumpTo(index)">
        <div class="list-left">
          <img class="list-icon" :src="item.imgUrl" :alt="item.type" />
          <span class="list-type" :class="item.status || 'unbind'">{{ item.type }}</span>
        </div>
        <div class="list-right">
          <template v-if="item.status">
            <div>
              <p class="list-right-text withdraw">
                <span>{{ item.withdraw }}</span
                >待提现
              </p>
              <p class="list-right-text total">{{ item.total }}总收益</p>
            </div>
          </template>
          <template v-else>
            <p class="list-right-unbind">即将上线,敬请期待</p>
          </template>
          <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="" />
        </div>
      </div>
    </div>
    <!-- 暂未支持的币种 -->
    <div class="asset-list">
      <div v-for="(item, index) in assetOtherList" :key="index" class="list">
        <div class="list-left">
          <img class="list-icon" :src="item.imgUrl" :alt="item.type" />
          <span class="list-type" :class="item.status || 'unbind'">{{ item.type }}</span>
        </div>
        <div class="list-right">
          <template v-if="item.status">
            <div>
              <p class="list-right-text withdraw">
                <span>{{ item.withdraw }}</span
                >待提现
              </p>
              <p class="list-right-text total">{{ item.total }}总收益</p>
            </div>
          </template>
          <template v-else>
            <p class="list-right-unbind">即将上线,敬请期待</p>
          </template>
          <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { precision } from '@/common/precisionConversion'
import iconEOS from '@/assets/img/icon_EOS.svg'
import iconONT from '@/assets/img/icon_ONT.svg'
import iconETH from '@/assets/img/icon_ETH.svg'
import iconBTC from '@/assets/img/icon_BTC.svg'
import iconRMB from '@/assets/img/icon_RMB.svg'

export default {
  name: 'Asset',
  props: ['id'],
  data() {
    return {
      assetList: [
        {
          type: 'EOS',
          imgUrl: iconEOS,
          status: true,
          withdraw: 0,
          total: 0
        },
        {
          type: 'ONT',
          imgUrl: iconONT,
          status: true,
          withdraw: 0,
          total: 0
        }
      ],
      // 暂未支持的币种
      assetOtherList: [
        {
          type: 'ETH',
          imgUrl: iconETH,
          status: false,
          withdraw: 0,
          total: 0
        },
        {
          type: 'BTC',
          imgUrl: iconBTC,
          status: false,
          withdraw: 0,
          total: 0
        },
        {
          type: 'RMB',
          imgUrl: iconRMB,
          status: false,
          withdraw: 0,
          total: 0
        }
      ]
    }
  },
  computed: {},
  created() {
    this.getBalance()
  },
  methods: {
    jumpTo(index) {
      if (!this.assetList[index].status) return
      this.$router.push({
        name: 'AssetType',
        params: {
          type: this.assetList[index].type
        }
      })
    },
    // 获取账户资产列表 暂时没有EOS数据
    async getBalance() {
      await this.$backendAPI
        .getBalance()
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            if (res.data.data.length === 0) return
            // 筛选数据
            const filterArr = symbol => res.data.data.filter(i => i.symbol === symbol)
            const filterArrONT = filterArr('ONT')
            const filterArrEOS = filterArr('EOS')

            if (filterArrEOS.length !== 0) {
              // eos
              this.assetList[0].withdraw = precision(filterArrEOS[0].amount, filterArrEOS[0].symbol)
              this.assetList[0].total = precision(
                filterArrEOS[0].totalIncome,
                filterArrEOS[0].symbol
              )
            }

            if (filterArrONT.length !== 0) {
              // ont
              this.assetList[1].withdraw = precision(filterArrONT[0].amount, filterArrONT[0].symbol)
              this.assetList[1].total = precision(
                filterArrONT[0].totalIncome,
                filterArrONT[0].symbol
              )
            }
          } else {
            this.$toast.fail({
              duration: 1000,
              message: `${res.data.message}`
            })
          }
        })
        .catch(err => {
          console.error(err)
          this.$toast.fail({ duration: 1000, message: '获取数据失败' })
        })
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
