<template>
  <m-dialog
    v-model="createFavShowModal"
    width="446px"
    title="收藏夹信息"
  >
    <el-form
      ref="formFav"
      label-position="top"
      :model="formFav"
      :rules="rulesFav"
      class="form-fav"
    >
      <el-form-item label="收藏夹名称" prop="name">
        <el-input
          v-model="formFav.name"
          placeholder="收藏夹名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="简介：">
        <el-input
          v-model="formFav.brief"
          type="textarea"
          :rows="7"
          placeholder="可填写简介"
          maxlength="200"
          show-word-limit
        />
        <el-checkbox v-model="formFav.status">
          公开收藏夹
        </el-checkbox>
      </el-form-item>
      <div class="form-button">
        <el-button type="primary" size="medium" @click="handleFormFavOnSubmit('formFav')">
          提交
        </el-button>
      </div>
    </el-form>
  </m-dialog>
</template>

<script>

export default {
  name: 'CreateFav',
  props: {
    value: {
      type: Boolean,
      required: true
    },
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