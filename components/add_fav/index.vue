<template>
  <m-dialog
    v-model="createFavShowModal"
    width="420px"
    title="添加到收藏夹"
  >
    <div class="content">
      <div class="group-list">
        <ul>
          <li v-for="(item, i) in favRelatedList" :key="i">
            <label class="">
              <el-checkbox v-model="item.related" @change="v => $emit('handle-change', { val: v, fid: item.id })" /><i /><span :title="item.name" class="fav-title">{{ item.name }}</span>
              <i v-if="item.status === 1" class="personal">
                [私密]
              </i>
              <span class="count">{{ item.count }}</span>
            </label>
          </li>
        </ul>
        <!--
        <div class="add-group">
          <div class="add-btn">
            新建收藏夹
          </div>
        </div>-->
      </div>
    </div>
    <div class="form-button">
      <el-button type="primary" size="medium" @click="handleFormFavOnSubmit('formFav')">
        新建收藏夹
      </el-button>
    </div>
  </m-dialog>
</template>

<script>

export default {
  name: 'AddFav',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    favRelatedList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      createFavShowModal: false,
      formFav: {
        name: '',
        brief: '',
        status: true
      },
      rulesFav: {
        name: [
          { required: true, message: '请输入收藏夹名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
  
  },
  watch: {
    value(newVal) {
      this.createFavShowModal = newVal
    },
    createFavShowModal(newVal) {
      this.$emit('input', newVal)
    },

  },
  methods: {
    // 创建收藏夹
    async favCreate() {
      const data = {
        name: this.formFav.name,
        brief: this.formFav.brief,
        status: this.formFav.status ? '0' : '1'
      }
      const res = await this.$utils.factoryRequest(this.$API.favCreate(data))
      if (res) {
        console.log('res', res)
      } else {
        // 
      }
    },
    // 创建收藏夹表单提交处理
    handleFormFavOnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.favCreate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>

<style lang="less" scoped>
.form-fav {
  /deep/ .el-form-item__label {
    line-height: inherit;
  }
}
.form-button {
  text-align: center;
}
</style>