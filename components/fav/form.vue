<template>
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
      <slot name="button" />
      <el-button
        type="primary"
        size="medium"
        :loading="submitLoading"
        @click="handleFormFavOnSubmit('formFav')"
      >
        提交
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  name: 'FavForm',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
      },
      submitLoading: false // submit button loading
    }
  },
  watch: {
    // 如果是编辑 并且传参数进来了
    form: {
      deep: true,
      handler() {
        this.initForm()
      }
    }

  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      console.log('init form', this.form)
      if (this.type === 'edit' && !isEmpty(this.form)) {
        this.formFav.name = this.form.name
        this.formFav.brief = this.form.brief
        this.formFav.status = this.form.status
      }
    },
    // 创建收藏夹
    async favCreate() {
      this.submitLoading = true
      const data = {
        name: this.formFav.name,
        brief: this.formFav.brief,
        status: this.formFav.status ? '0' : '1'
      }
      const res = await this.$utils.factoryRequest(this.$API.favCreate(data))
      this.submitLoading = false

      if (res) {
        console.log('res', res)
        this.$emit('create-done')
        this.$message({
          message: '创建收藏夹成功',
          type: 'success'
        })
        this.$refs['formFav'].resetFields()
      } else {
        this.$message({
          message: '创建收藏夹失败',
          type: 'error'
        })
      }
    },
    // 编辑收藏夹
    async favEdit() {
      this.submitLoading = true
      const data = {
        fid: this.form.fid,
        name: this.formFav.name,
        brief: this.formFav.brief,
        status: this.formFav.status ? '0' : '1'
      }
      const res = await this.$utils.factoryRequest(this.$API.favEdit(data))
      this.submitLoading = false

      if (res) {
        console.log('res', res)
        this.$emit('edit-done')
        this.$message({
          message: '编辑收藏夹成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '编辑收藏夹失败',
          type: 'error'
        })
      }
    },
    // 创建收藏夹表单提交处理
    handleFormFavOnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // form 空 并且 form 也没有 fid
          if (this.type === 'create') {
            this.favCreate()
          } else if (this.type === 'edit' && this.form.fid) {
            this.favEdit()
          } else {
            console.log('type ', this.type)
          }
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