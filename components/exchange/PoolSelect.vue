<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    width="450px"
    :lock-scroll="false"
    custom-class="br10 black-theme-dialog"
  >
    <div class="container">
      <button v-for="(item, i) in poolOptions" :key="item.id" :class="[ 'cwefbr', i === currentPool ? 'MODE' : '']" @click="selectPool(i)">
        {{ item.text }}
      </button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
export default {
  name: 'PoolSelectModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Number,
      default: 0
    }
  },
  computed: {
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  },
  data() {
    return {
      showModal: false,
      currentPool: 0,
      poolOptions: [
        {
          id: 0,
          text: '添加流动金'
        },{
          id: 1,
          text: '删除流动金'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    selectPool(i) {
      this.showModal = false
      if (this.currentPool !== i) {
        this.currentPool = i
        this.$emit('selectPool', this.poolOptions[i])
      }
    }
  }
}
</script>

<style lang="less">
.black-theme-dialog {
  background-color: rgb(32, 33, 36);
  .el-dialog__body {
    padding: 10px 0 0 0;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #ffffff;
  }
}
</style>
<style scoped lang="less">
.container {
  background-color: rgb(32, 33, 36);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 2rem 2rem;
  .cwefbr.MODE {
    background-color: rgb(32, 33, 36);
    font-weight: 500;
    color: rgb(220, 107, 229);
    border-radius: 3rem;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(51, 51, 51);
    border-image: initial;
  }
  .cwefbr {
    display: flex;
    cursor: pointer;
    color: rgb(196, 196, 196);
    font-size: 1rem;
    flex-flow: row nowrap;
    padding: 1rem;
    text-decoration: none;
  }
  button {
    cursor: pointer;
    user-select: none;
    font-size: 1rem;
    color: rgb(255, 255, 255);
    background-color: rgb(32, 33, 36);
    box-sizing: border-box;
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 3rem;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    outline: none;
  }
}
</style>
