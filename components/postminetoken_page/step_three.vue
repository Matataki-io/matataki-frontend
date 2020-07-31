<template>
  <div class="container">
    <p class="token-title">步骤3：有奖小调研（选填）</p>
    <p class="token-description">参与调研后，通过了Fan票申请即有可能得到Fan票空投奖励</p>
    <el-form
      ref="tokenForm"
      :model="tokenForm"
      label-width="90px"
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
      <p class="survey-title">主要创作者身份</p>

      <el-form-item label="创作领域" prop="field">
        <section class="fl">
          <el-select
            v-model="tokenForm.field"
            placeholder="请选择"
            clearable
            style="width: 40%;"
          >
            <el-option
              v-for="item in fieldOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- "其他-XX" -->
          <el-input
            v-if="tokenForm.field === '其他'"
            v-model="tokenForm.fieldOther"
            style="width: 56%;margin-left: auto;"
            placeholder="请输入内容"
          />
        </section>
      </el-form-item>
      <el-form-item label="创作平台" prop="platform">
        <section class="fl">
          <el-select
            v-model="tokenForm.platform"
            placeholder="请选择"
            clearable
            style="width: 40%;"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- "其他-XX" -->
          <el-input
            v-if="tokenForm.platform === '其他'"
            v-model="tokenForm.platformOther"
            style="width: 56%;margin-left: auto;"
            placeholder="请输入内容"
          />
        </section>
      </el-form-item>

      <el-form-item label="创作者昵称" prop="nickname">
        <el-input v-model="tokenForm.nickname" placeholder="请填写" />
      </el-form-item>
      <el-form-item label="主页链接" prop="link">
        <el-input v-model="tokenForm.link" placeholder="请输入内容">
          <template slot="prepend">
            Http://
          </template>
        </el-input>
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
      <a href="javascript:;" class="f-btn next" @click="next('tokenForm')">提交申请</a>
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
        fieldOther: '', // 其他平台
        platform: '',
        platformOther: '',
        nickname: '',
        link: '',
        interview: false,
        know: '',
        publish: '',
        info: '',
        promote: '',
      },

      fieldOptions: [
        {
          value: '财经',
          label: '财经'
        }, {
          value: '宠物',
          label: '宠物'
        }, {
          value: '动漫',
          label: '动漫'
        }, {
          value: '房产',
          label: '房产'
        }, {
          value: '星座运势搞笑',
          label: '星座运势搞笑'
        }, {
          value: '家后',
          label: '家后'
        }, {
          value: '教育',
          label: '教育'
        }, {
          value: '车',
          label: '车'
        }, {
          value: '科技',
          label: '科技'
        }, {
          value: '科学',
          label: '科学'
        }, {
          value: '心理情感',
          label: '心理情感'
        }, {
          value: '旅游',
          label: '旅游'
        }, {
          value: '美食',
          label: '美食'
        }, {
          value: '文学',
          label: '文学'
        }, {
          value: '汽车',
          label: '汽车'
        }, {
          value: '摄影',
          label: '摄影'
        },{
          value: '古玩收藏',
          label: '古玩收藏'
        },{
          value: '时尚美汝',
          label: '时尚美汝'
        },{
          value: '社会时政',
          label: '社会时政'
        },{
          value: '数码',
          label: '数码'
        },{
          value: '体育健身',
          label: '体育健身'
        },{
          value: '人文历史',
          label: '人文历史'
        },{
          value: '游戏电竟',
          label: '游戏电竟'
        },{
          value: '娱乐影视',
          label: '娱乐影视'
        },{
          value: '孕产育儿',
          label: '孕产育儿'
        },{
          value: '职场',
          label: '职场'
        },{
          value: '生活百科',
          label: '生活百科'
        },{
          value: '创意设计',
          label: '创意设计'
        },{
          value: '其他',
          label: '其他'
        }
      ],

      platformOptions: [
        {
          value: '微信公众号',
          label: '微信公众号'
        }, {
          value: '哔哩哔哩',
          label: '哔哩哔哩'
        }, {
          value: '简书',
          label: '简书'
        }, {
          value: '知乎',
          label: '知乎'
        }, {
          value: '抖音',
          label: '抖音'
        }, {
          value: '快手',
          label: '快手'
        }, {
          value: '微博',
          label: '微博'
        }, {
          value: '头条号',
          label: '头条号'
        }, {
          value: '豆瓣',
          label: '豆瓣'
        }, {
          value: '小红书',
          label: '小红书'
        }, {
          value: '知识星球',
          label: '知识星球'
        }, {
          value: '领英',
          label: '领英'
        }, {
          value: 'QQ空间',
          label: 'QQ空间'
        }, {
          value: '网易Lofter',
          label: '网易Lofter'
        }, {
          value: 'CSDN',
          label: 'CSDN'
        }, {
          value: '百度贴吧',
          label: '百度贴吧'
        },{
          value: '百家号',
          label: '百家号'
        },{
          value: '趣头条',
          label: '趣头条'
        },{
          value: '喜马拉雅',
          label: '喜马拉雅'
        },{
          value: '其他',
          label: '其他'
        }
      ],
    }
  },
  watch: {
    tokenForm: {
      deep: true,
      handler() {
        let { status } = this.$route.query
        if (status !== 'modify') {
          this.postSurveyInfo()
        }
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
        field: this.tokenForm.field === '其他' ? this.tokenForm.field + '-' + this.tokenForm.fieldOther : this.tokenForm.field,
        platform: this.tokenForm.platform === '其他' ? this.tokenForm.platform + '-' + this.tokenForm.platformOther : this.tokenForm.platform,
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
            field: this.tokenForm.field === '其他' ? this.tokenForm.field + '-' + this.tokenForm.fieldOther : this.tokenForm.field,
            platform: this.tokenForm.platform === '其他' ? this.tokenForm.platform + '-' + this.tokenForm.platformOther : this.tokenForm.platform,
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
        this.tokenForm.nickname = data.nickname
        this.tokenForm.link = data.link
        this.tokenForm.interview = data.interview === 0 ? true : false
        this.tokenForm.know = data.know
        this.tokenForm.publish = data.publish
        this.tokenForm.info = data.info
        this.tokenForm.promote = data.promote


        let field = data.field.split('-')
        if (field[0] === '其他') {
          this.tokenForm.field = '其他'
          this.tokenForm.fieldOther = field[1]
        } else {
          this.tokenForm.field = field[0]
          this.tokenForm.fieldOther = ''
        }

        let platform = data.platform.split('-')
        if (platform[0] === '其他') {
          this.tokenForm.platform = '其他'
          this.tokenForm.platformOther = platform[1]
        } else {
          this.tokenForm.platform = platform[0]
          this.tokenForm.platformOther = ''
        }
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
.token-description {
  font-size: 14px;
  color: #333;
  line-height: 22px;
  padding: 0;
  margin: 10px 0 0 0;
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