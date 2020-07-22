<template>
  <div
    class="card"
    :class="active && 'active'"
    @click="$emit('set-active')"
  >
    <p class="card-float">
      {{ data.name }}
      <span
        v-if="data.float !== 0"
        :class="data.float < 0 && 'red'"
      >
        {{ data.float > 0 ? `${data.float}` : data.float }}%
      </span>
    </p>
    <h3 class="card-value">
      {{ value }}
    </h3>
    <div class="card-bottom">
      <div
        v-if="data.openChart"
        class="card-bottom-add"
        :class="permanent && 'active'"
        @click.stop="$emit('switch-permanent')"
      >
        <svg-icon icon-class="chart" />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    permanent: {
      type: Boolean,
      default: false,
    }
  },
  // data() {
  //   return {
  //     active: 0
  //   }
  // },
  computed: {
    value() {
      return this.data.symbol ? `${this.data.symbol} ${this.data.value}` : this.data.value
    }
  },
}
</script>
<style lang="less" scoped>
.card {
  height: 72px;
  border-radius: 8px;
  background: #F1F1F1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid white;
  cursor: pointer;
  &.active {
    border: 2px solid #886CFF;
    .card-value {
      color: #542DE0;
    }
  }
  &:hover {
    border: 2px solid #886CFF;
    background-color: #eeeafc;
    .card-value {
      color: #542DE0;
    }
  }
  &-float {
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: black;
    line-height: 17px;
    white-space: nowrap;
    span {
      color: #15AD8B;
      white-space: nowrap;
      &.red {
        color: #FB6877;
      }
    }
  }
  &-value {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: black;
    line-height: 28px;
    text-align: center;
    white-space: nowrap;
  }
  &-bottom {
    display: flex;
    justify-content: flex-end;
    height: 20px;
    &-add {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      background: #B2B2B2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: #896DF0;
      }
      &.active {
        background: #542DE0;
      }
    }
  }
}
@media screen and (max-width: 600px) {
  .card {
    &-value {
      font-size: 16px;
    }
  }
}
</style>
