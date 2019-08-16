<template>
  <div>
    <div class="line" />
    <div class="money">
      <p class="money-title">
        <i
          class="el-icon-arrow-left"
          @click="$emit('toggleWithdraw', 0)"
        />钱包余额
      </p>
      <p class="money-num">
        {{ withdrawData.head.amount }}
      </p>
    </div>
    <div class="line" />

    <div class="withdraw-content">
      <div v-for="(item, index) in withdrawData.list" :key="index" class="withdraw-content-list">
        <p class="withdraw-content-title">
          {{ item.title }}
          <span>{{ item.titleDes }}</span>
        </p>
        <div class="list-des">
          <el-input
            v-model="item.value"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
          />
        </div>
      </div>
    </div>

    <div class="withdraw-des">
      <p v-for="(item, index) in withdrawData.des" :key="index">
        {{ item }}
      </p>
    </div>
    <button class="with" @click="withdrawButton">
      提现
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'
import { strTrim } from '@/utils/reg'

export default {
  props: {
    type: {
      type: String,
      default: 'EOS'
    }
  },
  data() {
    return {
      eosWithdraw: {
        head: {
          amount: 0
        },
        list: [
          {
            title: '提现地址',
            titleDes: '',
            placeholder: '输入或长按黏贴地址',
            value: '',
            des: '',
            disabled: false
          },
          {
            title: '标签 MEMO',
            titleDes: '(填写错误可能导致资产损失,请仔细核对)',
            placeholder: '输入或长按粘贴标签',
            value: '',
            des: '',
            disabled: false
          },
          {
            title: '数量',
            titleDes: '(默认全部，不可修改)',
            placeholder: '输入或长按黏贴地址',
            value: 0,
            des: 'EOS',
            disabled: true
          },
          {
            title: '手续费',
            titleDes: '(限时由智能签名官方支付)',
            placeholder: '输入或长按黏贴地址',
            value: 0,
            des: 'EOS',
            disabled: true
          }
        ],
        des: [
          '最小提币数量为：0.5 EOS。',
          '提现数量默认为全部EOS余额。',
          '如需提币到交易所，请填写正确的 memo。',
          '请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
        ]
      },
      ontWithdraw: {
        head: {
          amount: 0
        },
        list: [
          {
            title: '提现地址',
            titleDes: '',
            placeholder: '输入或长按黏贴地址',
            value: '',
            des: '',
            disabled: false
          },
          {
            title: '数量',
            titleDes: '(默认全部，不可修改)',
            placeholder: '输入或长按黏贴地址',
            value: 0,
            des: 'ONT',
            disabled: true
          },
          {
            title: '手续费',
            titleDes: '(限时由智能签名官方支付)',
            placeholder: '输入或长按黏贴地址',
            value: 0.01,
            des: 'ONG',
            disabled: true
          }
        ],
        des: [
          '最小提币数量为：1 ONT。',
          '提现数量默认为全部ONT余额的正整数部分。',
          '请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
        ]
      },
      withdrawData: null
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    currentUserInfo() {
      this.writeAddres()
    }
  },

  created() {
    if (this.type === 'EOS') this.withdrawData = this.eosWithdraw
    else if (this.type === 'ONT') this.withdrawData = this.ontWithdraw

    this.getBalance(this.type)
    this.writeAddres()
  },

  methods: {
    ...mapActions(['withdraw']),

    // 获取账户资产列表 暂时没有EOS数据
    async getBalance(type) {
      await this.$backendAPI
        .getBalance()
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            if (res.data.data.length === 0) return
            // 筛选数据
            const filterArr = symbol => res.data.data.filter(i => i.symbol === symbol)
            const filterArrONT = filterArr('ONT')
            const filterArrEOS = filterArr('EOS')

            // EOS or ONT
            if (type === 'EOS' && filterArrEOS.length !== 0) {
              const amount = precision(filterArrEOS[0].amount, filterArrEOS[0].symbol)
              this.withdrawData.head.amount = amount
              this.withdrawData.list[2].value = amount
            } else if (type === 'ONT' && filterArrONT.length !== 0) {
              const amount = precision(filterArrONT[0].amount, filterArrONT[0].symbol)
              this.withdrawData.head.amount = amount
              this.withdrawData.list[1].value = Math.floor(amount) // ont 向下取整
            }
          } else {
            this.$message.error('res.data.message')
          }
        })
        .catch(error => {
          console.error(error)
          this.$message.error({ duration: 1000, message: '获取数据失败' })
        })
    },
    writeAddres() {
      // 如果登陆的平台等于进入的币提现类型 默认带上提现地址
      if (this.currentUserInfo.idProvider === this.type) { this.withdrawData.list[0].value = this.currentUserInfo.name }
    },
    withdrawButton() {
      if (this.withdrawData.head.amount <= 0) return this.$message.error('没有可以提现的余额')
      if (!this.withdrawData.list[0].value) return this.$message.error('请输入提现地址')

      // 最小金额限制
      if (this.type === 'EOS' && this.withdrawData.head.amount < 0.5) { return this.$message.error('提现EOS不能小于0.5') }
      if (this.type === 'ONT' && this.withdrawData.head.amount < 1) { return this.$message.error('提现ONT不能小于1') }

      const beforeClose = async () => {
        await this.withdraw({
          tokenName: this.type,
          amount:
              this.type === 'EOS'
                ? strTrim(`${this.withdrawData.list[2].value}`)
                : strTrim(`${this.withdrawData.list[1].value}`),
          toaddress: strTrim(`${this.withdrawData.list[0].value}`),
          memo: this.type === 'EOS' ? strTrim(`${this.withdrawData.list[1].value}`) : '' // eos 交易所需要填写memo标签
        })
          .then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$message({
                message: '已发起提现请求,请耐心等待提现金额到',
                type: 'success'
              })
              this.$emit('withdrawDone')
              this.getBalance(this.type)
            } else this.$message.error(res.data.message)
          })
          .catch(err => {
            console.error(err)
            this.$message.error('提现失败')
          })
      }
      this.$confirm('确认提现?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        beforeClose()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.money {
  padding: 40px 0;
  &-title {
    padding: 0;
    margin: 0;
    font-size: 20px;
    font-weight: 400;
    color: rgba(0,0,0,1);
  }
  &-num {
    padding: 0;
    margin: 4px 0 0;
    font-size: 38px;
    color: rgba(0,0,0,1);
  }
}
.line{
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;
}
.withdraw-content {
  margin: 40px 0 10px;
  background-color: #fff;
  padding: 0;

  &-list {
    text-align: left;
    padding: 0;
    margin: 0 0 14px;
  }
  &-title {
    font-size:18px;
    color:rgba(0,0,0,1);
    padding: 0;
    margin: 0 0 12px;
    span {
      font-size: 12px;
      font-weight: 400;
      color:rgba(0,0,0,1);
    }
  }
  .list-des {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.withdraw-des {
  margin: 10px 0 0;
  text-align: left;
  line-height: 1.5;
  p {
    font-size:14px;
    color:rgba(0,0,0,.35);
    padding: 4px 0;
    margin: 0;
  }
}

.withdraw-button-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.withdraw-button {
  font-size:16px;
  font-weight:700;
  color:rgba(255,255,255,1);
  padding: 12px 0;
  margin: 20px;
  border-radius: 6px;
  display: block;
  background-color: #1C9CFE;
  cursor: pointer;
  text-align: center;
}

.with {
  width:300px;
  height:40px;
  background:@blue;
  border-radius: @borderRadius6;
  color: #fff;
  border: none;
  outline: none;
  margin: 40px auto 0;
  display: block;
  cursor: pointer;
}
</style>
