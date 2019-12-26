<template>
  <router-link :to="{name: 'ring-id', params: { id: card.token_id }}" target="_blank">
    <div v-if="card" class="token-card">
      <div class="img-frame">
        <el-image v-if="logo" :src="logo" :alt="card.symbol" class="img-frame">
          <div slot="error">
            <img :alt="card.symbol" src="@/assets/img/share-bg.svg">
          </div>
        </el-image>
      </div>
      <div class="title">
        {{ card.symbol }}的Fan圈
      </div>
    </div>
  </router-link>
</template>

<script>
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { recommend, paginationData, getTags, tokenTokenList } from '@/api/async_data_api.js'
import { extractChar, regRemoveContent } from '@/utils/reg'

export default {
  transition: 'page',
  components: {
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    logo() {
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    }
  }
}
</script>
<style lang="less" scoped>
  .token-card {
    width:177px;
    height:239px;
    border-radius: 10px;
    background:white;
    margin-right: 18px;
    margin-bottom: 20px;
    float: left;
    transition: all 0.3s;
    &:hover {
      transform: translate(0, -4px);
      box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
    }
    &.add {
      border: 1px dashed #dbdbdb;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 40px;
      color: #dbdbdb;
      overflow: hidden;
      text-decoration: none;
      width: 175px;
      height: 237px;
      span {
        font-size: 12px;
        margin: 4px 0 0;
        padding: 0;
        color: #dbdbdb;
      }
    }
    overflow: hidden;
    .img-frame {
      width:177px;
      height:177px;
      border-bottom: 1px solid #9d9d9d38;
      img {
        // width:177px;
        height:177px;
      }
    }
    .title {
      color: black;
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
    }
  }
</style>
