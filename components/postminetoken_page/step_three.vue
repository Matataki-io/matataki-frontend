<template>
  <div class="container">
    <p class="token-title">步骤3：有奖小调研（选填）</p>
    <el-form
      ref="tokenForm"
      :model="tokenForm"
      :rules="rules"
      label-width="80px"
      class="token-form"
    >
      <p class="survey-title">基本信息</p>
      <el-form-item label="自我介绍" prop="introduction">
        <el-input
          v-model="tokenForm.introduction"
          type="textarea"
          show-word-limit
          maxlength="200"
          :rows="5"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="您的年龄" prop="age">
        <el-input v-model="tokenForm.age" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="手机号码" prop="number">
        <el-input v-model="tokenForm.number" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="职业领域" prop="career">
        <el-input v-model="tokenForm.career" placeholder="请输入内容" />
      </el-form-item>
      <p class="survey-title">基本信息</p>

      <el-form-item label="领域" prop="field">
        <el-input v-model="tokenForm.field" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="平台" prop="platform">
        <el-input v-model="tokenForm.platform" placeholder="请输入内容" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="tokenForm.nickname" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model="tokenForm.link" placeholder="请输入内容" />
      </el-form-item>
      <div class="token-checked">
        <el-checkbox v-model="tokenForm.interview">
          是否愿意参与Fan票产品的用户访谈？
        </el-checkbox>
      </div>
      <div class="token-line" />
      <p class="survey-title">其他问答</p>
      <el-form-item label="您如何了解到了Fan票？" prop="know" class="label-line">
        <el-input
          v-model="tokenForm.know"
          type="textarea"
          show-word-limit
          maxlength="200"
          :rows="5"
          placeholder="请输入内容"
        />
      </el-form-item>

      <el-form-item label="为什么想要发行Fan票？" prop="publish" class="label-line">
        <el-input
          v-model="tokenForm.publish"
          type="textarea"
          show-word-limit
          maxlength="200"
          :rows="5"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="您希望了解什么信息？" prop="info" class="label-line">
        <el-input
          v-model="tokenForm.info"
          type="textarea"
          show-word-limit
          maxlength="200"
          :rows="5"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="您会如何推广自己的Fan票？" prop="promote" class="label-line">
        <el-input
          v-model="tokenForm.promote"
          type="textarea"
          show-word-limit
          maxlength="200"
          :rows="5"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>

    <div class="token-footer">  
      <a class="h-rule" href="http://andoromeda.mikecrm.com/a93Le8z" target="_blank">
        任何反馈<svg-icon icon-class="arrow" class="icon" />
      </a>
      <a href="javascript:;" class="f-btn prev" @click="prev">上一步</a>
      <a href="javascript:;" class="f-btn next" @click="next('tokenForm')">下一步</a>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'

export default {
  data() {
    return {
      tokenForm: {
        introduction: '',
        age: '',
        number: '',
        career: '',
        field: '',
        platform: '',
        nickname: '',
        link: '',
        interview: false,
        know: '',
        publish: '',
        info: '',
        promote: '',
      },
      
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    tokenForm: {
      deep: true,
      handler() {
        this.postSurveyInfo()
      }
    }
  },
  created() {
    if (process.browser) {
      this.minetokenApplicationSurvey()
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    prev() {
      this.$emit('prev')
    },
    getUserTokenInfo() {},
    // 保存fan票内容
    postSurveyInfo: debounce(async function () {
      let data = {
        introduction: this.tokenForm.introduction,
        age: this.tokenForm.age,
        number: this.tokenForm.number,
        career: this.tokenForm.career,
        field: this.tokenForm.field,
        platform: this.tokenForm.platform,
        nickname: this.tokenForm.nickname,
        link: this.tokenForm.link,
        interview: this.tokenForm.interview ? 0 : 1,
        know: this.tokenForm.know,
        publish: this.tokenForm.publish,
        info: this.tokenForm.info,
        promote: this.tokenForm.promote,
      }
      await this.$utils.factoryRequest(this.$API.apiMinetokenApplicationSurvey(data))
    }, 300),
    next(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            introduction: this.tokenForm.introduction,
            age: this.tokenForm.age,
            number: this.tokenForm.number,
            career: this.tokenForm.career,
            field: this.tokenForm.field,
            platform: this.tokenForm.platform,
            nickname: this.tokenForm.nickname,
            link: this.tokenForm.link,
            interview: this.tokenForm.interview ? 0 : 1,
            know: this.tokenForm.know,
            publish: this.tokenForm.publish,
            info: this.tokenForm.info,
            promote: this.tokenForm.promote,
          }

          this.$emit('done', data)

        } else {
          return false
        }
      })
    },
    // 获取已经提交过的信息
    async minetokenApplicationSurvey() {
      const result = await this.$utils.factoryRequest(this.$API.apiMinetokenApplicationSurveyGet())
      if (result) {
        const { data } = result
        this.tokenForm.introduction = data.introduction
        this.tokenForm.age = data.age
        this.tokenForm.number = data.number
        this.tokenForm.career = data.career
        this.tokenForm.field = data.field
        this.tokenForm.platform = data.platform
        this.tokenForm.nickname = data.nickname
        this.tokenForm.link = data.link
        this.tokenForm.interview = data.interview === 0 ? true : false
        this.tokenForm.know = data.know
        this.tokenForm.publish = data.publish
        this.tokenForm.info = data.info
        this.tokenForm.promote = data.promote
      }
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
.token-form {
  margin: 20px 0;
  max-width: 400px;
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


/deep/ .label-line {
  .el-form-item__label {
    display: block;
    width: 100% !important;
    text-align: left !important;
  }
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.token-line {
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;
}
.survey-title {
font-size:16px;
font-weight:500;
color:rgba(0,0,0,1);
line-height:22px;
padding: 0;
margin: 20px 0;
}
.token-checked {
  margin: 20px 0;
}
</style>