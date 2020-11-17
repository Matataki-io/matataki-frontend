<template>
  <m-dialog
    v-model="createFavShowModal"
    width="420px"
    title="添加到收藏夹"
    class="add-fav"
  >
    <div v-if="step === 0" class="content">
      <div class="group-list">
        <ul>
          <li v-for="(item, i) in favRelatedList" :key="i">
            <label class="fav-label">
              <el-checkbox
                v-model="item.related"
                @change="
                  (v) => $emit('handle-change', { val: v, fid: item.id })
                "
              />
              <span :title="item.name" class="fav-title">{{ item.name }}</span>
              <i v-if="item.status === 1" class="personal">
                [私密]
              </i>
              <span class="count">{{ item.count }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="step === 0" class="form-button">
      <el-button
        type="primary"
        size="medium"
        class="btn"
        @click="step = 1"
      >
        新建收藏夹
      </el-button>
    </div>

    <div v-if="step === 1" class="content-create">
      <CreateFavForm @create-done="createFavDone">
        <el-button slot="button" size="medium" @click="step = 0">
          返回
        </el-button>
      </CreateFavForm>
    </div>
  </m-dialog>
</template>

<script>
import CreateFavForm from './form'
export default {
  name: 'AddFav',
  components: {
    CreateFavForm,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    favRelatedList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      createFavShowModal: false,
      step: 0, // 0 收藏夹列表 1 创建收藏夹
    }
  },
  computed: {},
  watch: {
    value(newVal) {
      this.createFavShowModal = newVal
    },
    createFavShowModal(newVal) {
      this.$emit('input', newVal)
    },
  },
  methods: {
    // 创建收藏夹完成
    createFavDone() {
      // 1. 需要刷新收藏夹列表
      // 2. 需要返回到列表页面
      this.$emit('reload-fav')
      this.step = 0
    }
  },
}
</script>

<style lang="less" scoped>
.add-fav {
  /deep/ .el-dialog__body {
    padding: 0;
  }
}
.form-button {
  text-align: center;
  border-top: 1px solid #e5e9ef;
  margin: 0 36px;
  .btn {
    margin-top: 18px;
    margin-bottom: 18px;
  }
}
.content-create {
  padding: 24px 36px;
}
.content {
  padding: 0 36px;
  height: 300px;
  overflow: auto;
  .group-list {
    max-height: 300px;
    padding-bottom: 14px;
    ul {
      position: relative;
      margin-top: 24px;
      min-height: 210px;
      list-style: none;
      outline: none;
      li {
        padding-bottom: 24px;
        font-size: 14px;
        color: #222;
        cursor: pointer;
        &:hover {
          color: #542de0;
        }
        .fav-label {
          cursor: pointer;
          display: block;
          .count {
            float: right;
            color: #6d757a;
            font-size: 12px;
          }
        }
        .personal {
          color: #999;
          font-style: initial;
        }
        .fav-title {
          max-width: 220px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          margin-left: 18px;
        }
      }
    }
  }
}
</style>