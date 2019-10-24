<template>
  <div class="coins-publish">
    <div class="fl ac coins-head">
      <h1>
        {{ isPost ? '申请发行粉丝币' : '编辑粉丝币' }}
      </h1>
      <el-tooltip effect="dark" content="如何发行你的粉丝币?" placement="top-start">
        <svg-icon
          class="help-icon"
          icon-class="help"
        />
      </el-tooltip>
      <a class="help-link" target="_blank" href="">如何发行你的粉丝币?</a>
    </div>

    <el-form ref="form" :rules="rules" class="input-form" :model="form" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="input" placeholder="请输入粉丝币名称" />
      </el-form-item>
      <!-- 编辑页面不需要显示 -->
      <el-form-item v-if="isPost" label="缩写" prop="abbreviation">
        <el-input v-model="form.abbreviation" class="input" placeholder="请输入粉丝币缩写(发行后不可修改)" />
      </el-form-item>
      <el-form-item label="图标" prop="coinsIcon">
        <el-input v-model="form.coinsIcon" style="display: none;" class="input" />
        <img-upload
          v-show="!coinsCover"
          :img-upload-done="imgUploadDone"
          update-type="coins"
          class="coins-upload-content"
          @doneImageUpload="doneImageUpload"
        >
          <div slot="uploadButton" class="coins-upload">
            <i class="el-icon-plus add" />
          </div>
        </img-upload>
        <div
          v-show="coinsCover"
          class="coina-cover"
        >
          <el-image
            :src="coinsCover"
            fit="cover"
            class="tokens-image"
          />
          <div class="cover-full" @click="removeCoinsIcon">
            <i class="el-icon-delete remove" />
          </div>
        </div>
      </el-form-item>
      <!-- 编辑页面不需要显示 -->
      <el-form-item v-if="isPost" label="发行数量" prop="number">
        <el-input v-model="form.number" class="input" placeholder="请输入首次发行数量(最多发行1亿)" />
      </el-form-item>

      <el-form-item label="简介" prop="profile">
        <el-input v-model="form.profile" class="input" placeholder="简介" />
      </el-form-item>
      <el-form-item label="介绍" prop="">
        <el-input
          v-model="form.number"
          class="input"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
          placeholder="介绍"
        />
      </el-form-item>

      <el-form-item label="相关网站" prop="">
        <div v-for="(item, index) in about" :key="index" class="fl ac about-input">
          <el-input v-model="about[index]" class="input" placeholder="请填写网站" />
          <!-- <div v-if="index === 0" class="about-input-btn" @click="aboutAdd">
            <i class="el-icon-plus" />
          </div> -->

          <div v-if="about.length > 1" class="about-input-btn" @click="abountLess(index)">
            <i class="el-icon-minus" />
          </div>
        </div>

        <div v-if="about.length < 5" class="about-input-btn add" @click="aboutAdd">
          <i class="el-icon-plus" />
        </div>
      </el-form-item>

      <el-form-item label="社交帐号" prop="">
        <div v-for="(item, index) in social" :key="index">
          <p class="social-title">
            {{ item.name }}
            <span v-html="item.tooltip" />
          </p>
          <div class="fl">
            <div class="social-icon">
              <socialIcon :icon="item.icon" />
            </div>
            <el-input v-model="item.value" class="social-input" :placeholder="item.placeholder" />
          </div>
        </div>
      </el-form-item>

      <el-form-item style="margin:40px 0 0 0;">
        <el-checkbox v-model="form.agree">
          我声明粉丝币为本人自愿发行，由本人承担一切法律责任
        </el-checkbox>
        <el-button :disabled="!form.agree" type="primary" class="publish-btn" @click="submitForm('form')">
          {{ isPost ? '发币' : '保存' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload/index.vue'
import { toPrecision } from '@/utils/precisionConversion'

import socialIcon from '@/components/social_icon/index.vue'

export default {
  components: {
    imgUpload,
    socialIcon
  },
  data() {
    const checkSymbol = (rule, value, callback) => {
      const reg = /^[A-Z]+$/
      const res = reg.test(this.form.abbreviation)
      if (!res) {
        callback(new Error('粉丝币缩写仅限大写英文字符'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        abbreviation: '',
        number: '',
        coinsIcon: '',
        profile: '',
        agree: false
      },
      rules: {
        name: [
          { required: true, message: '请输入粉丝币名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        // 编辑页面不需要校验
        abbreviation: [
          { required: !this.isPost, message: '请输入粉丝币缩写', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: ['blur', 'change'] },
          { validator: checkSymbol, trigger: ['blur', 'change'] }
        ],
        coinsIcon: [
          { required: true, message: '请输上传图标' }
        ],
        // 编辑页面不需要校验
        number: [
          { required: !this.isPost, message: '请输入首次发行数量', trigger: 'blur' },
          { min: 1, max: 9, message: '首次发行数量一亿', trigger: ['blur', 'change'] }
        ],
        profile: [
          { required: true, message: '请输入简介', trigger: 'blur' },
          { min: 1, max: 100, message: '简介最多100字', trigger: ['blur', 'change'] }
        ]
      },
      imgUploadDone: 0, // 图片是否上传完成
      about: [''],
      social: [
        {
          symbol: 'qq',
          icon: 'qq1',
          name: 'QQ：',
          tooltip: '',
          placeholder: 'QQ帐号',
          url: '',
          value: ''
        },
        {
          symbol: 'wechat',
          icon: 'wechat',
          name: '微信：',
          tooltip: '',
          placeholder: '微信号',
          url: '',
          value: ''
        },
        {
          symbol: 'weibo',
          icon: 'weibo1',
          name: '微博：',
          tooltip: '(https://www.weibo.com/<span>帐号</span>)',
          placeholder: '微博用户名(不需要完整URL)',
          url: 'https://www.weibo.com',
          value: ''
        },
        {
          symbol: 'telegram：',
          icon: 'tg',
          name: 'Telegram：',
          tooltip: '',
          placeholder: 'Telegram用户名',
          url: '',
          value: ''
        },
        {
          symbol: 'telegram：',
          icon: 'twitter1',
          name: 'Twitter：',
          tooltip: '(https://twitter.com/<span>帐号</span>)',
          placeholder: 'Twitter用户名(不需要完整URL)',
          url: 'https://twitter.com',
          value: ''
        },
        {
          symbol: 'facebook：',
          icon: 'fb',
          name: 'Facebook：',
          tooltip: '(https://facebook.com/<span>帐号</span>)',
          placeholder: 'Facebook用户名(不需要完整URL)',
          url: 'https://facebook.com',
          value: ''
        },
        {
          symbol: 'github',
          icon: 'github1',
          name: 'Github：',
          tooltip: '(https://github.com/<span>帐号</span>)',
          placeholder: 'Github用户名(不需要完整URL)',
          url: 'https://github.com',
          value: ''
        }
      ]
    }
  },
  computed: {
    coinsCover() {
      return this.form.coinsIcon ? this.$backendAPI.getAvatarImage(this.form.coinsIcon) : ''
    },
    isPost() {
      return this.$route.name === 'postminetoken'
    }
  },
  methods: {
    async minetokenMint() {
      const { number } = this.form
      const data = {
        amount: toPrecision(number, 'CNY')
      }
      await this.$API.minetokenMint(data)
        .then(res => {
          if (res.code === 0) {
            this.$emit('publishToken')
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    async minetokenCreate() {
      const { name, abbreviation, coinsIcon, profile } = this.form
      const data = {
        name: name,
        symbol: abbreviation,
        decimals: 100,
        profile: profile, // 确定后端定义字段后再次修改
        logo: coinsIcon
      }
      await this.$API.minetokenCreate(data)
        .then(res => {
          if (res.code === 0) {
            this.minetokenMint()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) this.minetokenCreate()
        else return false
      })
    },
    // 完成上传
    doneImageUpload(res) {
      // console.log(res)
      this.form.coinsIcon = res.data.data.cover
      this.imgUploadDone += Date.now()
    },
    removeCoinsIcon() {
      this.form.coinsIcon = ''
    },
    aboutAdd() {
      if (this.about.length >= 5) return
      this.about.push('')
    },
    abountLess(i) {
      if (this.about.length <= 1) return
      this.about.splice(i, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.coins-publish {
  padding: 10px;
}
.coins-head {
  margin: 20px 0 20px;
  h1 {
    font-size:24px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:33px;
    padding: 0;
    margin: 0;
  }
  .help-icon {
    color:rgba(219,219,219,1);
    margin-left: 10px;
    margin-right: 10px;
  }
  .help-link {
    font-size:14px;
    color:rgba(178,178,178,1);
    line-height:20px;
    text-decoration: underline;
  }
}
.coina-cover {
  width: 90px;
  height: 90px;
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
      font-size: 26px;
      color: #fff;
    }
  }
}
.coins-upload-content {
  width: 90px;
  height: 90px;
  overflow: hidden;
}
.coins-upload {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  .add {
    font-size: 26px;
    color: #8c939d;
  }
}
.input-form {
  margin-top: 30px;
  .input {
    width: 400px;
  }
  .social-input {
    width: 340px;
  }
}
.publish-btn {
  display: block;
  width: 100px;
  // background: @purpleDark;
  // border-color: @purpleDark;
}

.tokens-image {
  width: 100%;
  height: 100%;
}
.about-input {
  margin: 0 0 10px;
}
.about-input-btn {
  width: 24px;
  height: 24px;
  background-color: @purpleDark;
  color: @white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 0 0 0 10px;
  cursor: pointer;
  &.add {
    margin-left: 0;
  }
}
.social-title {
  padding: 0;
  margin: 12px 0 10px 60px;
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:20px;
  span {
    span {
      color: red;
    }
  }
}
.social-icon {
  width: 60px;
}
</style>

<style>
.social-title span span {
  color:red;
}
</style>
