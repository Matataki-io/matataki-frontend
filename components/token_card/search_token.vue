<template>
  <router-link :to="{name: 'token-id', params: { id: card.id }}" class="fl token-card" tag="div">
    <div>
      <avatar :src="cover" size="60px" />
    </div>
    <div class="card-info">
      <h2 v-html="card.symbol" class="search-res" />
      <p v-html="card.name" class="search-res" />
      <p v-html="card.brief" class="search-res" />
    </div>
    <div>
      <!-- <router-link :to="{name: 'user-id', params: { id: currentUserInfo.id }}" class="fl ac">
        <avatar :src="avatar" size="30px" />
        <span class="card-username">{{ currentUserInfo.nickname || currentUserInfo.name }}</span>
      </router-link> -->
    </div>
  </router-link>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // avatar: ''
    }
  },
  computed: {
    cover() {
      return this.card.logo ? this.$ossProcess(this.card.logo, { h: 90 }) : ''
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.token-card {
  margin: 20px auto 20px;
  padding: 20px;
  background: @white;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: translate(0, -4px);
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  }
  .card-info {
    -webkit-box-flex: 1;
    flex: 1;
    margin-left: 10px;
    h2 {
      font-size: 20px;
      font-weight: 400;
      color: #000;
      line-height: 28px;
      padding: 0;
      margin: 0;
    }
    P {
      font-size: 14px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 20px;
      padding: 0;
      margin: 4px 0 0 0;
      width: 400px;
    }
  }
  .card-username {
    margin-left: 6px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
  }
}
</style>

<style lang="less">
.search-res em {
  font-weight: bold;
  font-style: normal;
  color: @purpleDark;
}
</style>
