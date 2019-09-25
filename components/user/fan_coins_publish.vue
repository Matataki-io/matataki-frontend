<template>
  <div class="coins-publish">
    <div class="fl ac coins-head">
      <h1>
        申请发行粉丝币
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
      <el-form-item label="简称" prop="abbreviation">
        <el-input v-model="form.abbreviation" class="input" placeholder="请输入粉丝币简称" />
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
            lazy
            :src="coinsCover"
            fit="cover"
          />
          <div class="cover-full" @click="removeCoinsIcon">
            <i class="el-icon-delete remove" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="发行数量" prop="number">
        <el-input v-model="form.number" class="input" placeholder="请输入首次发行数量(最多发行1亿)" />
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="form.agree">
          我声明粉丝币为本人自愿发行，由本人承担一切法律责任
        </el-checkbox>
        <el-button :disabled="!form.agree" type="primary" class="publish-btn" @click="submitForm('form')">
          发币
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload/index.vue'
import { toPrecision } from '@/utils/precisionConversion'

export default {
  components: {
    imgUpload
  },
  data() {
    return {
      form: {
        name: '',
        abbreviation: '',
        number: '',
        coinsIcon: '',
        agree: false
      },
      rules: {
        name: [
          { required: true, message: '请输入粉丝币名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        abbreviation: [
          { required: true, message: '请输入粉丝币简称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        coinsIcon: [
          // { required: true, message: '请输上传图标' }
        ],
        number: [
          { required: true, message: '请输入首次发行数量', trigger: 'blur' },
          { min: 1, max: 9, message: '首次发行数量一亿', trigger: 'blur' }
        ]
      },
      imgUploadDone: 0 // 图片是否上传完成
    }
  },
  computed: {
    coinsCover() {
      return this.form.coinsIcon ? this.$backendAPI.getAvatarImage(this.form.coinsIcon) : ''
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
      const { name, abbreviation } = this.form
      const data = {
        name: name,
        symbol: abbreviation,
        decimals: 100
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
      console.log(res)
      this.form.coinsIcon = res.data.data.cover
      this.imgUploadDone += Date.now()
    },
    removeCoinsIcon() {
      this.form.coinsIcon = ''
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
}
.publish-btn {
  display: block;
  width: 100px;
  // background: @purpleDark;
  // border-color: @purpleDark;
}

</style>
