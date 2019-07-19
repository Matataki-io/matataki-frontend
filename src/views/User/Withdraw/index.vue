<template>
  <div class="mw withdraw">
    <BaseHeader :pageinfo="{ title: '提现' }" />
    <div class="withdraw-head">
      <div class="withdraw-head-type">
        <img :src="withdrawData.head.logo" :alt="withdrawData.head.type" />
        {{ withdrawData.head.type }}
      </div>
      <span class="withdraw-head-amount">{{ withdrawData.head.amount }}</span>
    </div>

    <div class="withdraw-content">
      <div v-for="(item, index) in withdrawData.list" :key="index" class="withdraw-content-list">
        <p class="withdraw-content-title">
          {{ item.title }}
          <span>{{ item.titleDes }}</span>
        </p>
        <div class="list-des">
          <input
            v-model="item.value"
            type="text"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
          />
          <span>{{ item.des }}</span>
        </div>
      </div>
    </div>

    <div class="withdraw-des">
      <p v-for="(item, index) in withdrawData.des" :key="index">{{ item }}</p>
    </div>

    <div class="withdraw-button-content">
      <a href="javascript:;" class="withdraw-button" @click="withdrawButton">提现</a>
    </div>
  </div>
</template>

<script>
import { precision } from '@/common/precisionConversion'
import { mapActions, mapGetters } from 'vuex'
import iconEOS from '@/assets/img/icon_EOS.svg'
import iconONT from '@/assets/img/icon_ONT.svg'
import { strTrim } from '@/common/reg'

export default {
  name: 'Withdraw',
  props: ['id', 'type'],
  data() {
    return {
      eosWithdraw: {
        head: {
          logo: iconEOS,
          type: 'EOS',
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
          logo: iconONT,
          type: 'ONT',
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
    // 认为是用户手动切换非法地址  考虑要不要移到路由里面去拦截
    const assetTypeArr = ['EOS', 'ONT']
    if (!assetTypeArr.includes(this.type)) this.$router.push({ name: 'home' })

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
            this.$toast.fail({ duration: 1000, message: `${res.data.message}` })
          }
        })
        .catch(error => {
          console.error(error)
          this.$toast.fail({ duration: 1000, message: '获取数据失败' })
        })
    },
    // 提示
    toastMessage(message, type = '') {
      if (!type) this.$toast({ duration: 1000, message })
      else this.$toast[type]({ duration: 1000, message })
    },
    async withdrawButton() {
      if (this.withdrawData.head.amount <= 0) return this.toastMessage('没有可以提现的余额')
      if (!this.withdrawData.list[0].value) return this.toastMessage('请输入提现地址')

      // 最小金额限制
      if (this.type === 'EOS' && this.withdrawData.head.amount < 0.5)
        return this.toastMessage('提现EOS不能小于0.5')
      if (this.type === 'ONT' && this.withdrawData.head.amount < 1)
        return this.toastMessage('提现ONT不能小于1')

      const beforeClose = async (action, done) => {
        if (action === 'confirm') {
          done()
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
                //this.toastMessage(res.data.message, 'success');
                this.$dialog.alert({
                  title: '请求成功！',
                  message: '已发起提现请求,请耐心等待提现金额到账'
                })
                this.getBalance(this.type).then(() => {
                  this.$navigation.cleanRoutes() // 清除路由记录
                })
              } else this.toastMessage(res.data.message, 'fail')
              done()
            })
            .catch(err => {
              console.error(err)
              this.$dialog.alert({
                title: '提现失败',
                message: ''
              })
              //this.toastMessage('提现失败', 'fail');
              done()
            })
        } else done()
      }
      this.$dialog.confirm({ message: '确认提现?', beforeClose })
      return true
    },
    writeAddres() {
      // 如果登陆的平台等于进入的币提现类型 默认带上提现地址
      if (this.currentUserInfo.idProvider === this.type)
        this.withdrawData.list[0].value = this.currentUserInfo.name
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
