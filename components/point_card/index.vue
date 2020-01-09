<template>
  <div class="card">
    <div class="card-info">
      <span class="card-type">{{ assetType }}</span>
      <h2 :style="{ color: `${assetColor}` }" class="card-pricing">
        {{ assetAmount }}
      </h2>
    </div>
    <div class="card-info">
      <span class="card-date">{{ friendlyDate }}</span>
    </div>
    <div class="card-info">
      <span class="card-title">{{ asset.title || '' }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import { isNDaysAgo } from '@/common/methods';
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'AssetCard',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  computed: {
    friendlyDate() {
      return moment(this.asset.create_time).format('MMMDo HH:mm')
    },
    assetAmount() {
      return this.asset.amount > 0 ? '+' + this.asset.amount : this.asset.amount
    },
    assetColor() {
      if (this.asset.amount < 0) {
        return '#d74e5a'
      } else if (this.asset.amount) {
        return '#41b37d'
      } else {
        return '#000000'
      }
    },
    assetType() {
      const { status, type } = this.asset
      const pointTypes = {
        read: this.$t('pointCard.read'),
        read_like: this.$t('pointCard.read_like'),
        read_dislike: this.$t('pointCard.read_dislike'),
        read_referral: this.$t('pointCard.read_referral'),
        beread: this.$t('pointCard.beread'),
        read_new: this.$t('pointCard.read_new'),
        beread_new: this.$t('pointCard.beread_new'),
        publish: this.$t('pointCard.publish'),
        publish_referral: this.$t('pointCard.publish_referral'),
        reg_inviter: this.$t('pointCard.reg_inviter'),
        reg_invitee: this.$t('pointCard.reg_invitee'),
        reg_invite_finished: this.$t('pointCard.reg_invite_finished'),
        login: this.$t('pointCard.login'),
        profile: this.$t('pointCard.profile'),
        comment_pay: this.$t('pointCard.comment_pay'),
        comment_income: this.$t('pointCard.comment_income')
      }
      return pointTypes[type]
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  margin: 10px 0;
  box-sizing: border-box;
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #DBDBDB;
  &:nth-last-of-type(1) {
    border: none;
  }
  &-pricing {
    padding: 0;
    margin: 0;
    font-size:20px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-type {
    font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-title {
    font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &-info {
      margin: 0 6px 0 0;
    }
    .copy-hash {
      width: 16px;
    }
  }
  &-date {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}

</style>
