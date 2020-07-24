<template>
  <section class="container">
    <p class="token-title">步骤2：设置您的Fan票信息</p>

    <el-form
      ref="tokenForm"
      :model="tokenForm"
      :rules="tokenRules"
      label-width="80px"
      class="token-form"
    >
      <el-form-item label="图标" prop="logo">
        <el-input v-model="tokenForm.logo" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="tokenForm.name" />
      </el-form-item>
      <el-form-item prop="symbol">
        <span slot="label">
          缩写
          <el-tooltip
            effect="dark"
            content="缩写"
            placement="top"
            class="tag-help"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </span>
        <el-input v-model="tokenForm.symbol" />
      </el-form-item>
      <el-form-item prop="tag">
        <span slot="label">
          标签
          <el-tooltip
            effect="dark"
            content="标签"
            placement="top"
            class="tag-help"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </span>
        <el-checkbox-group v-model="tokenForm.tag">
          <el-checkbox label="个人" />
          <el-checkbox label="组织" />
          <el-checkbox label="产品" />
          <el-checkbox label="MEME" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <p class="token-remarks">请勿设置具有迷惑性、误导性的Fan票信息</p>
    <p class="token-remarks mb20">请勿设置违反国家法律法规的Fan票信息</p>
    <div class="token-line" />
    <p class="token-comment title">首次发行：</p>
    <p class="token-comment">1. 首次发行的时候会自动默认发行 1000 个Fan票</p>

    <p class="token-comment title">手动增发：</p>
    <p class="token-comment">1. 首次发行成功后即可立即操作手动增发</p>
    <p class="token-comment">1. 每次增发后需要等待10天可再次增发</p>

    <div class="token-footer">  
      <a class="h-rule" href="#" target="_blank">
        任何反馈<svg-icon icon-class="arrow" class="icon" />
      </a>
      <a href="javascript:;" class="f-btn prev" @click="prev">上一步</a>
      <a href="javascript:;" class="f-btn next" @click="next('tokenForm')">下一步</a>
    </div>
  </section>
</template>
<script>
import { debounce } from 'lodash'
export default {
  data() {
    return {
      tokenForm: {
        logo: '',
        name: '',
        symbol: '',
        tag: [],
      },
      tokenRules: {
        logo: [
          { required: true, message: '请上传图标', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        symbol: [
          { required: true, message: '请输入缩写', trigger: 'blur' },
        ],
        tag: [
          { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        ],
      }
    }
  },
  watch: {
    tokenForm: {
      deep: true,
      handler() {
        this.postTokenForm()
      }
    }
  },
  created() {
    if (process.browser) {
      this.getUserTokenInfo()
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 提交信息
    async postTokenInfo(data) {
      await this.$utils.factoryRequest(this.$API.apiMinetokenApplication(data))
    },
    getUserTokenInfo() {},
    // 保存fan票内容
    postTokenForm: debounce(async function () {
      let data = {
        type: 'draft',
        logo: this.tokenForm.log,
        name: this.tokenForm.name,
        symbol: this.tokenForm.symbol,
        tag: this.tokenForm.tag,
      }
      await this.$utils.factoryRequest(this.$API.apiMinetokenApplication(data))

    }, 300),
    prev() {
      this.$emit('prev')
    },
    next(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            type: 'submit',
            logo: this.tokenForm.log,
            name: this.tokenForm.name,
            symbol: this.tokenForm.symbol,
            tag: this.tokenForm.tag,
          }
          let result = await this.$utils.factoryRequest(this.$API.apiMinetokenApplication(data))
          if (result) {
            this.$emit('done')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.token-title {
  font-size: 16px;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  padding: 0;
  margin: 0;
}
.token-remarks {
  font-size: 14px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 20px;
  padding: 0;
  margin: 10px 0;
  &.mb20 {
    margin-bottom: 20px;
  }
}
.token-line {
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;
}
.token-form {
  margin: 20px 0;
  max-width: 400px;
}

.token-comment {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
  padding: 0;
  margin: 10px 0;
  &.title {
    margin-top: 20px;
  }
}

.h-rule {
  font-size: 16px;
  font-weight: 500;
  color: rgba(250, 100, 0, 1);
  line-height: 22px;
  margin-right: 20px;
  .icon {
    transition: all 0.2s;
    margin-left: 4px;
  }
  &:hover {
    text-decoration: underline;
    .icon {
      transform: translateX(4px);
    }
  }
}
.token-footer {
  margin-top: 200px;
  text-align: right;
  .f-btn {
    width: 300px;
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    display: inline-block;
    text-align: center;
    &.next {
      background: rgba(250, 100, 0, 1);
      color: rgba(255, 255, 255, 1);
      border: 1px solid rgba(250, 100, 0, 1);
    }
    &.prev {
      background-color: #fff;
      border: 1px solid rgba(250, 100, 0, 1);
      color: rgba(250, 100, 0, 1);
      margin-right: 20px;
    }
  }
}
</style>