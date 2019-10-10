<template>
  <div class="card">
    <div class="fl">
      <span class="info">{{ friendlyDate }}</span>
      <span class="info">{{ friendlyDate }}</span>
    </div>
    <div>
      <h3 class="title">
        1
      </h3>
      <div class="detail">
        rmb123
        <img src="" alt="">
        rmb123
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
      return this.asset.amount
    },
    assetColor() {
      return '#FB6877'
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
  created() {
    console.log('asset', this.asset)
  },
  methods: {}
}
</script>

<style scoped lang="less">
.card {}
</style>
