<template>
  <div class="fl card">
    <router-link :to="{name: 'token-id', params: { id: card.id }}">
      <avatar :src="cover" size="45px" />
    </router-link>
    <div class="fl cards-content">
      <div class="card-info">
        <router-link :to="{name: 'token-id', params: { id: card.id }}">
          <h2 class="card-info-symbol">
            {{ card.symbol || '暂无' }}
          </h2>
        </router-link>
        <p class="card-info-name">
          {{ card.name || '暂无' }}
        </p>
        <p class="card-info-name">
          {{ card.brief || '暂无' }}
        </p>
      </div>
      <div class="card-user">
        <router-link class="fl ac" :to="{name: 'user-id', params: { id: card.uid }}">
          <avatar :src="coverUser" size="30px" />
          <span class="card-username">{{ card.nickname || card.username }}</span>
        </router-link>
        <!-- <div class="card-user-icon">
          持仓占位
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
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
  computed: {
    cover() {
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    },
    coverUser() {
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    }
  }
}
</script>
<style lang="less" scoped>
.card {
  padding: 20px 0;
  border-bottom: 1px solid #dbdbdb;
  // &:nth-last-child(1) {
  //   border-bottom: 1px solid #dbdbdb;
  // }
}
.cards-content {
  flex: 1;
  margin-left: 10px;
}

.card-info {
  width: 50%;
  &-symbol {
    font-size:20px;
    font-weight:400;
    color: @black;
    line-height:28px;
    padding: 0;
    margin: 0;
  }
  &-name {
    font-size:14px;
    font-weight:400;
    color:@gray;
    line-height:20px;
    padding: 0;
    margin: 4px 0 0 0;
  }
}

.card-user {
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: column;
}
.card-username {
  margin-left: 6px;
  font-size:14px;
  font-weight:400;
  color: @black;
  line-height:20px;
}
.card-user-icon {
  display: flex;
  flex: 1;
  align-items: flex-end;
}
</style>
