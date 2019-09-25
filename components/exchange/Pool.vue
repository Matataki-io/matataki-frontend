<template>
  <div>
    <div class="hYLPFg">
      <div class="caRvnP" @click="psShow = true">
          <span class="gclSjj">添加流动金</span>
          <i class="el-icon-arrow-down"></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>存入</span>
          </div>
          <div>余额：0.084</div>
        </div>
        <div class="jbRmQG">
          <input
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            value="0.01"
          />
          <button class="iAoRgd" @click="tlShow = true;currentClick = 'inputToken'">
            <span class="rTZzf">
              {{ form.inputToken.symbol || '请选择'}}
              <i class="el-icon-arrow-down"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr"></div>
      <div class="haryqg">
        <i class="el-icon-plus gHgbDu"></i>
      </div>
      <div class="jJSpkX"></div>
    </div>
    <div class="kvFQhz">
      <div class="iNUelT">
        <div class="OpDFW">
          <div class="jUAxZT">
            <span>存入</span>
          </div>
          <div>余额：0.084</div>
        </div>
        <div class="jbRmQG">
          <input
            class="gcotIA"
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="0.0"
            value="0.01"
          />
          <button class="iAoRgd" @click="tlShow = true;currentClick = 'outputToken'">
            <span class="rTZzf">
              {{ form.outputToken.symbol || '请选择'}}
              <i class="el-icon-arrow-down"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="hYLPFg">
      <div class="exKIZr"></div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">兑换率</span><span>-</span>
      </div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">当前资金池大小</span><span>-</span>
      </div>
      <div class="lfiYXW">
        <span class="sc-hORach icyNSS">你的资金池份额（%）</span><span>-</span>
      </div>
    </div>
    <div class="mHVYT">
      <span class="fZbbbs">选取通证继续</span>
      <i class="el-icon-arrow-down"></i>
    </div>
    <div class="iUPTxf">
      <div class="hRyusy">
        <div>你正在出售
          <span class="iDChvK">
            <span class="jbXIaP">1 ETH</span>
          </span> for at least
          <span class="iDChvK">
            <span class="jbXIaP">1026.3265 BAT</span>
          </span>
        </div>
        <div class="sc-bsbRJL kxtVAF">固定预期利率
          <span class="iDChvK">
            <span class="jbXIaP">1%</span>
          </span>
        </div>
      </div>
    </div>
    <div class="hGStes">
      <button disabled class="jBltiI">添加流动金</button>
    </div>
    <OrderModal v-model="orderShow" :order="{...order,...form}"></OrderModal>
    <TokenListModal v-model="tlShow" @selectToken="selectToken"></TokenListModal>
    <PoolSelectModal v-model="psShow"></PoolSelectModal>
  </div>
</template>

<script>
import OrderModal from './OrderModal'
import TokenListModal from './TokenList'
import PoolSelectModal from './PoolSelect'
export default {
  components: {
    OrderModal,
    TokenListModal,
    PoolSelectModal
  },
  data() {
    return {
      psShow: false,
      tlShow: false,
      currentClick: '',
      orderShow: false,
      form: {
        input: '',
        inputToken: {},
        output: '',
        outputToken: {}
      },
      options: [
        {
          value: 0,
          label: 'CNY'
        }
      ],
      order: {}
    }
  },
  async asyncData() {},
  mounted() {
  },
  methods: {
    selectToken(token) {
      this.form[this.currentClick] = token
    },
    onSubmit(type) {
      this.$API
        .wxpay({
          total: this.form.input,
          title: '购买Token',
          type, // type类型见typeOptions：add，buy_token，sale_token
          token_id: this.form.outputToken.id,
          token_amount: this.form.output,
          limit_value: 0
        })
        .then(res => {
          this.order = res
          this.orderShow = true
        })
    }
  }
}
</script>
<style lang="less" scoped src="./index.less"></style>
