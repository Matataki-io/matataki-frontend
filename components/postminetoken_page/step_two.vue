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
        <div class="upload">
          <img-upload
            v-show="!coinsCover"
            :img-upload-done="imgUploadDone"
            update-type="coins"
            class="coins-upload-content"
            @doneImageUpload="doneImageUpload"
          >
            <div
              slot="uploadButton" 
              class="upload-logo"
            >
              <i class="el-icon-plus" />
            </div>
          </img-upload>
          <div v-show="coinsCover" class="coina-cover">
            <el-image
              :src="coinsCover"
              fit="cover"
              class="tokens-image"
            />
            <div
              class="cover-full"
              @click="removeCoinsIcon"
            >
              <i class="el-icon-delete remove" />
            </div>
          </div>

          <p class="upload-text">请上传512*512大小的PNG格式图片作为粉丝币logo</p>
        </div>
        <!-- <el-input v-model="tokenForm.logo" /> -->
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="tokenForm.name"
          class="token-input"
          maxlength="20"
          show-word-limit
        />
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
        <el-input
          v-model="tokenForm.symbol"
          class="token-input"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="brief">
        <span slot="label">
          简介
          <el-tooltip
            effect="dark"
            content="简介"
            placement="top"
            class="tag-help"
          >
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </span>
        <el-input
          v-model="tokenForm.brief"
          class="token-input"
          type="textarea"
          maxlength="100"
          :rows="6"
          show-word-limit
        />
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
        <el-checkbox-group v-model="tokenForm.tag" class="token-checkbox">
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
      <a class="h-rule" href="http://andoromeda.mikecrm.com/a93Le8z" target="_blank">
        任何反馈<svg-icon icon-class="arrow" class="icon" />
      </a>
      <a href="javascript:;" class="f-btn prev" @click="prev">上一步</a>
      <a href="javascript:;" class="f-btn next" @click="next('tokenForm')">下一步</a>
    </div>
  </section>
</template>
<script>
import { debounce, isEmpty } from 'lodash'
import imgUpload from '@/components/imgUpload/index.vue'
import { tagList } from '@/common/config/minetoken_tag'
export default {
  components: {
    imgUpload,
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 校验Symbol
    const checkSymbol = async (rule, value, callback) => {
      const res = await this.$API.apiMinetokenApplicationVerify({ symbol: value })
      if (res.code !== 0) {
        callback(new Error('缩写不能重复~'))
      } else {
        callback()
      }
    }
    return {
      tokenForm: {
        logo: '',
        name: '',
        symbol: '',
        brief: '',
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
          { validator: checkSymbol, trigger: 'blur' },
        ],
        brief: [
          { required: true, message: '请输入简介', trigger: 'blur' },
        ],
        tag: [
          { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        ],
      },
      imgUploadDone: 0, // 图片是否上传完成

    }
  },
  computed: {
    coinsCover() {
      return this.tokenForm.logo ? this.$ossProcess(this.tokenForm.logo) : ''
    },
  },
  watch: {
    tokenForm: {
      deep: true,
      handler() {
        let { status } = this.$route.query
        if (status !== 'modify') {
          this.postTokenForm()
        }
      }
    }
  },
  created() {
    if (process.browser) {
      this.getUserTokenInfo()

      if (!isEmpty(this.info)) {
        this.setForm(this.info)
      }
      
    }
  },
  methods: {
    // 设置用户表单信息
    setForm(info) {
      this.tokenForm.logo = info.logo
      this.tokenForm.name = info.name
      this.tokenForm.symbol = info.symbol
      this.tokenForm.brief = info.brief
      this.tokenForm.tag =  this.tagDataToShow(info.tag.split(','))
    },
    // 数据转换显示
    tagDataToShow(data) {
      if (data.length <= 0) return []
      return data.map(i => tagList[i]).filter(Boolean)
    },
    // 数据转换提交
    tagDataToPost(data) {
      if (data.length <= 0) return []

      let arr = []
      for (let i = 0, len = data.length; i < len; i++) {
        for(const key in tagList) {
          if (data[i] === tagList[key]) {
            arr.push(key)
          }
        }
      }

      return arr
    },
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
        logo: this.tokenForm.logo,
        name: this.tokenForm.name,
        symbol: this.tokenForm.symbol,
        brief: this.tokenForm.brief,
        tag: this.tagDataToPost(this.tokenForm.tag)
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
            logo: this.tokenForm.logo,
            name: this.tokenForm.name,
            symbol: this.tokenForm.symbol,
            brief: this.tokenForm.brief,
            tag: this.tagDataToPost(this.tokenForm.tag)
          }
          this.$emit('done', data)

        } else {
          return false
        }

      })
    },
    // 完成上传
    doneImageUpload(res) {
      console.log(res)
      this.tokenForm.logo = res.data.data.cover
      this.imgUploadDone += Date.now()
    },
    // 删除图标
    removeCoinsIcon() {
      this.tokenForm.logo = ''
    },
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
  max-width: 500px;
  .token-input {
    width: 240px;
  }
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

/deep/ .token-checkbox {
  .el-checkbox {
    border-radius: 4px;
    border: 1px solid #542de0;
    background-color: #fff;
    color: #542de0;
    padding: 0 25px;
    margin-right: 10px;
    line-height: 30px;
    .el-checkbox__input {
      display: none;
    }
    .el-checkbox__label {
      padding-left: 0;
    }
    &.is-checked {
      background-color: #542de0;
      .el-checkbox__label {
        padding-left: 0;
        color: #fff;
      }
    }
  }
}
.upload {
  display: flex;
  align-items: flex-end;
  &-logo {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    border: 1px solid rgba(219, 219, 219, 1);
    display: flex;
    flex: 0 0 60px;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    box-sizing: border-box;
    color: #b2b2b2;
  }
  &-text {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    padding: 0;
    margin: 0 0 0 10px;
  }
}
.coins-upload-content {
  width: 60px;
  height: 60px;
  overflow: hidden;
}
.coina-cover {
  width: 60px;
  height: 60px;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  background: #ececec;
  border: 1px solid #ececec;
  &:hover .cover-full {
    display: flex;
  }
  .cover-full {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    // display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: none;
    .remove {
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>