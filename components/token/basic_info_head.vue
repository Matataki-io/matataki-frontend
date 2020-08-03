<template>
  <div class="container-padding">
    <div class="token-detail">
      <div class="fl">
        <c-token-popover :token-id="Number(minetokenToken.id)">
          <avatar :src="logo" size="120px" />
        </c-token-popover>
        <div class="token-detail-info">
          <div class="fl info-line">
            <div class="token-info-title bold">
              {{ minetokenToken.symbol }}
            </div>
            <div>
              <p class="token-info-sub">
                {{ minetokenToken.name }}
              </p>
            </div>
            <div>
              <a
                class="help-link"
                href="https://www.matataki.io/p/977"
                target="_blank"
              >{{ $t('token.whatIsAFanTicket') }}</a>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              {{ $t('token.founder') }}：
            </div>
            <div>
              <p class="token-info-sub">
                <c-user-popover :user-id="Number(minetokenToken.uid)">
                  <router-link :to="{name: 'user-id', params: {id: minetokenToken.uid}}" target="_blank">
                    {{ minetokenUser.nickname || minetokenUser.username }}
                  </router-link>
                </c-user-popover>
              </p>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              {{ $t('token.releaseTime') }}：
            </div>
            <div>
              <p class="token-info-sub">
                {{ friendlyDate }}
              </p>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              {{ $t('token.tags') }}：
            </div>
            <div v-if="tags && tags.length === 0">
              <p class="token-info-sub">
                无标签
              </p>
            </div>
            <div v-else class="token-info-sub" style="display: flex;">
              <div v-for="(tag, index) in tags" :key="index" style="margin-right:0.5rem;">
                <el-button size="small">
                  {{ {...tagPattern.find(item => item.label === tag.tag)}.name || tag.tag }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="fl info-line">
            <div
              class="token-info-title"
              v-html="$t('token.summary')"
            />
            <div>
              <p class="token-info-sub">
                {{ minetokenToken.brief || $t('not') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <router-link
        v-if="isLogined || balance"
        :to="{ name: 'token' }"
        tag="div"
        class="balance"
      >
        {{ $t('token.owned') }}：{{ balance }} {{ minetokenToken.symbol }}
        <i class="el-icon-arrow-right" />
      </router-link>
      <div class="share-btn">
        <a
          :href="'http://rinkeby.etherscan.io/address/' + minetokenToken.contract_address"
          target="_blank"
        >
          <el-button
            class="link-btn"
            size="small"
          >
            <svg-icon icon-class="eth_mini" />
            {{ $t('token.viewOnChain') }}
          </el-button>
        </a>
        <el-button
          class="btn"
          size="small"
          @click="shareModalShow = true"
        >
          <svg-icon icon-class="share_new" />
          {{ $t('share') }}
        </el-button>
        <el-button
          v-if="isMyToken"
          class="link-btn"
          size="small"
          @click="switchDisplayAngle"
        >
          {{ displayAngle === 'client' ? '管理视角' : '粉丝视角' }}
          <svg-icon icon-class="switch" />
        </el-button>
      </div>

      <p
        v-if="!minetokenToken.contract_address"
        class="warning"
      >
        {{ $t('token.waitPatiently') }}
      </p>
    </div>
    <share
      :share-modal-show="shareModalShow"
      :img="logo"
      :minetoken-token="minetokenToken"
      :minetoken-user="minetokenUser"
      @input="val => shareModalShow = val"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'
import share from '@/components/token/token_share.vue'

export default {
  components: {
    avatar,
    share
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
    minetokenExchange: {
      type: Object,
      required: true
    },
    isMyToken: {
      type: Boolean,
      default: false
    },
    balance: {
      type: Number,
      default: 0
    },
    tags: {
      type: Array,
      default: (() => [])
    }
  },
  data() {
    const setDisplayAngle = () => {
      if (this.$route.name === 'token-id')
        return this.isMyToken ? this.$route.params.displayAngle || 'creator' : 'client'
      else
        return 'client'
    }
    return {
      shareModalShow: false,
      displayAngle: setDisplayAngle(), // 创建者、客户
      tagPattern: [
        {name:'个人', label: 'personal', checked: false},
        {name:'组织', label: 'organization', checked: false},
        {name: '产品', label: 'product', checked: false},
        { name: 'MEME', label: 'meme', checked: false}
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    logo() {
      if (!this.minetokenToken.logo) return ''
      return this.minetokenToken.logo
        ? this.$ossProcess(this.minetokenToken.logo, { h: 160 })
        : ''
    },
    amount() {
      const tokenamount = precision(
        this.minetokenToken.total_supply || 0,
        'CNY',
        this.minetokenToken.decimals
      )
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    friendlyDate() {
      return this.moment(this.minetokenToken.create_time).format('lll')
    }
  },
  watch: {
    displayAngle(val) {
      this.$emit('display-angle', val)
      let text = val === 'client' ? '现在是粉丝视角' : '现在是管理视角'
      this.$message.success(`切换成功，${text}`)
    }
  },
  mounted() {
  },
  methods: {
    switchDisplayAngle() {
      if(!this.isMyToken) return console.error('No permission to switch perspectives')
      this.displayAngle = this.displayAngle === 'client' ? 'creator' : 'client'
    }
  }
}
</script>
<style lang="less" scoped>
.container-padding {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}

.token-detail {
  position: relative;
  margin: 20px auto 0;
  padding: 20px;
  background: @white;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}
.info-line {
  margin: 6px 0;
}
.token-detail-info {
  width: 60%;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 400;
  color: @black;
  line-height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.token-info-title {
  // width: 70px;
  flex: 0 0 80px;
  &.bold {
    font-weight: bold;
    font-size: 24px;
  }
}
.token-info-sub {
  padding: 0 0 0 10px;
  margin: 0;
  a {
    color: #542de0;
  }
}
.share-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
  .btn {
    padding: 7px 21px;
    font-size: 14px;
    border-radius: 6px;
    margin-left: 5px;
  }
  .link-btn {
    padding: 7px 7px;
    font-size: 14px;
    border-radius: 6px;
  }
}

.help-link {
  font-size: 14px;
  color: #868686;
  text-decoration: underline;
  margin-left: 20px;
}
.balance {
  position: absolute;
  font-weight: 400;
  font-size: 16px;
  right: 20px;
  top: 20px;
  cursor: pointer;
  &:hover {
    color: #542de0;
  }
}

@media screen and (max-width: 1200px) {
}

// 小于992
@media screen and (max-width: 992px) {
}

// <600
@media screen and (max-width: 600px) {
  .balance,
  .share-btn {
    position: initial;
    margin-top: 10px;
  }
  .token-detail {
    padding: 10px;
  }
  .token-detail-info {
    width: 100%;
  }
  .token-detail /deep/ .g-avatar {
    width: 60px !important;
    height: 60px !important;
    flex: 0 0 60px;
  }
  
  .token-detail-info,
  .balance {
    font-size: 14px;
  }

  .token-info-title.bold {
    font-size: 20px;
  }
}

@media screen and (max-width: 540px) {
}
</style>
