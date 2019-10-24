<template>
  <div class="fl card">
    <avatar size="45px" />
    <div class="fl cards-content">
      <div class="card-info">
        <h2 class="card-info-symbol">
          DDD
        </h2>
        <p class="card-info-name">
          蠢朋克钱多多币
        </p>
        <p class="card-info-name">
          蠢朋克钱多多币是由鼎鼎大名的蠢朋克组合所设置的粉丝币，被广大币圈玩家所看好，一推出币价便直线上涨。
        </p>
      </div>
      <div class="card-user">
        <div class="fl ac">
          <avatar size="30px" />
          <span class="card-username">xxxxxxx</span>
        </div>
        <div class="card-user-icon">
          持仓占位
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  }
}
</script>
<style lang="less" scoped>
.card {
  padding: 20px 0;
  border-top: 1px solid #dbdbdb;
  &:nth-last-child(1) {
    border-bottom: 1px solid #dbdbdb;
  }
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
