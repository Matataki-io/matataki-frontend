<template>
  <div>
    <div class="token-help">
      <a href="https://www.yuque.com/matataki/matataki" target="_blank">
        Fan票使用手册
        <i class="el-icon-arrow-right" />
      </a>
    </div>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      class="input-form"
      label-width="80px"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          class="input"
          placeholder="请输入Fan票名称"
        />
      </el-form-item>

      <el-form-item
        label="缩写"
        prop="symbol"
      >
        <el-input
          v-model="form.symbol"
          :disabled="!isPost"
          class="input"
          placeholder="请输入Fan票缩写(发行后不可修改)"
        />
      </el-form-item>
      <el-form-item
        label="标签"
        prop="tag"
        class="form-tags"
      >
        <el-checkbox-group v-model="form.tags">
          <el-checkbox-button
            v-for="(tag, index) in tags" 
            :key="index"
            :label="tag.label"
          >
            {{ tag.name }}
          </el-checkbox-button>
        </el-checkbox-group>
        <el-tooltip
          effect="dark"
          content="主体选择不影响相关功能"
          placement="right"
          class="tag-help"
        >
          <svg-icon
            class="help-icon"
            icon-class="help"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="图标"
        prop="logo"
      >
        <el-input
          v-model="form.logo"
          style="display: none;"
          class="input"
        />
        <img-upload
          v-show="!coinsCover"
          :img-upload-done="imgUploadDone"
          update-type="coins"
          class="coins-upload-content"
          @doneImageUpload="doneImageUpload"
        >
          <div
            slot="uploadButton"
            class="coins-upload"
          >
            <i class="el-icon-plus add" />
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
      </el-form-item>
      <!-- 编辑页面不需要显示 -->
      <el-form-item
        v-if="isPost"
        label="发行数量"
        prop="number"
      >
        <el-input
          v-model="form.number"
          class="input"
          placeholder="请输入首次发行数量(最多发行1亿)"
        />
      </el-form-item>

      <el-form-item
        label="简介"
        prop="brief"
      >
        <el-input
          v-model="form.brief"
          class="input"
          maxlength="50"
          placeholder="简介"
        />
      </el-form-item>
      <el-form-item
        label="介绍"
        prop=""
      >
        <el-input
          v-model="form.introduction"
          :rows="6"
          class="input"
          type="textarea"
          maxlength="1000"
          show-word-limit
          placeholder="介绍"
        />
      </el-form-item>

      <el-form-item
        :label="$t('social.relatedWebsites')"
        prop=""
      >
        <div
          v-for="(item, index) in about"
          :key="index"
          class="fl ac about-input"
        >
          <el-input
            v-model="about[index].name"
            class="input web-name"
            placeholder="网站名称"
            :maxlength="20"
          />
          <el-input
            v-model="about[index].url"
            class="input"
            :placeholder="$t('social.fillLink')"
            :maxlength="255"
          />
          <!-- <div v-if="index === 0" class="about-input-btn" @click="aboutAdd">
            <i class="el-icon-plus" />
          </div> -->

          <div
            v-if="about.length > 1"
            class="about-input-btn"
            @click="abountLess(index)"
          >
            <i class="el-icon-minus" />
          </div>
        </div>

        <div
          v-if="about.length < 5"
          class="about-input-btn add"
          @click="aboutAdd"
        >
          <i class="el-icon-plus" />
        </div>
      </el-form-item>

      <el-form-item
        :label="$t('social.socialAccount')"
        prop=""
      >
        <div
          v-for="(item, index) in social"
          :key="index"
          class="social-item"
        >
          <p class="social-title">
            {{ item.name }}
            <span v-html="item.tooltip" />
          </p>
          <div class="fl">
            <div class="social-icons">
              <socialIcon :icon="item.symbol" />
            </div>
            <el-input
              v-model="item.value"
              :placeholder="item.placeholder"
              class="social-input"
            />
          </div>
        </div>
      </el-form-item>

      <el-form-item style="margin:40px 0 0 0;">
        <el-checkbox
          v-if="isPost"
          v-model="form.agree"
        >
          我声明Fan票为本人自愿发行，由本人承担一切法律责任
        </el-checkbox>
        <el-button
          :disabled="!form.agree"
          type="primary"
          class="publish-btn"
          @click="submitForm('form')"
        >
          {{ isPost ? '发行Fan票' : '保存' }}
        </el-button>
        <p
          v-if="isPost"
          class="tips"
        >
          创建Fan票过程需要上链，请耐心等候。
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imgUpload from '@/components/imgUpload/index.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import { getCookie } from '@/utils/cookie'
import socialIcon from '@/components/social_icon/index.vue'
import socialTypes from '@/config/social_types'
export default {
  components: {
    imgUpload,
    socialIcon
  },
  data() {
    const checkSymbol = (rule, value, callback) => {
      const reg = /^[A-Z]+$/
      const res = reg.test(this.form.symbol)
      if (!res) {
        callback(new Error('Fan票缩写仅限大写英文字符'))
      } else {
        callback()
      }
    }
    return {
      checked: false,
      tokenId: null,
      selected: [],
      tags: [
        {name:'个人', label: 'personal', checked: false}, 
        {name:'组织', label: 'organization', checked: false}, 
        {name: '产品', label: 'product', checked: false}, 
        { name: 'MEME', label: 'meme', checked: false}
      ],
      form: {
        name: '',
        symbol: '',
        tags: [],
        number: '',
        logo: '',
        brief: '',
        introduction: '',
        agree: false
      },
      rules: {
        name: [
          { required: true, message: '请输入Fan票名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        // 编辑页面不需要校验
        symbol: [
          { required: true, message: '请输入Fan票缩写', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: ['blur', 'change'] },
          { validator: checkSymbol, trigger: ['blur', 'change'] }
        ],
        tag: [
          { required: false, message: '请选择至少一种标签:', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请输上传图标' }
        ],
        // 编辑页面不需要校验
        number: [
          { required: true, message: '请输入首次发行数量', trigger: 'blur' },
          { min: 1, max: 9, message: '首次发行数量一亿', trigger: ['blur', 'change'] }
        ],
        brief: [
          { required: true, message: '请输入简介', trigger: 'blur' },
          { min: 1, max: 100, message: '简介最多100字', trigger: ['blur', 'change'] }
        ]
      },
      imgUploadDone: 0, // 图片是否上传完成
      about: [{
        url: '',
        name: ''
      }],
      social: [
        {
          symbol: 'QQ',
          icon: 'qq1',
          name: 'QQ：',
          tooltip: '',
          placeholder: this.$t('thirdParty.qqAccount'),
          url: '',
          value: ''
        },
        {
          symbol: 'Wechat',
          icon: 'wechat',
          name: `${this.$t('thirdParty.wechat')}：`,
          tooltip: '',
          placeholder: this.$t('thirdParty.wechatAccount'),
          url: '',
          value: ''
        },
        {
          symbol: 'Weibo',
          icon: 'weibo1',
          name: `${this.$t('thirdParty.weibo')}：`,
          tooltip: `(https://www.weibo.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: this.$t('thirdParty.weibo') + this.$t('thirdParty.usernameNoFullUrl'),
          url: 'https://www.weibo.com',
          value: ''
        },
        {
          symbol: 'Telegram',
          icon: 'tg',
          name: 'Telegram：',
          tooltip: '',
          placeholder: `Telegram ${this.$t('username')}`,
          url: '',
          value: ''
        },
        {
          symbol: 'Twitter',
          icon: 'twitter1',
          name: 'Twitter：',
          tooltip: `(https://twitter.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Twitter${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://twitter.com',
          value: ''
        },
        {
          symbol: 'Facebook',
          icon: 'fb',
          name: 'Facebook：',
          tooltip: `(https://facebook.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Facebook${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://facebook.com',
          value: ''
        },
        {
          symbol: 'Github',
          icon: 'github1',
          name: 'Github：',
          tooltip: `(https://github.com/<span>${this.$t('thirdParty.account')}</span>)`,
          placeholder: `Github${this.$t('thirdParty.usernameNoFullUrl')}`,
          url: 'https://github.com',
          value: ''
        }
      ],
      tokenDetailData: {},
      addToLoading: false
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    totalAmount() {
      if (this.tokenDetailData.token) {
        const tokenamount = precision(this.tokenDetailData.token.total_supply, 'CNY', this.tokenDetailData.token.decimals)
        return this.$publishMethods.formatDecimal(tokenamount, 4)
      } else return 0
    },
    coinsCover() {
      return this.form.logo ? this.$ossProcess(this.form.logo) : ''
    },
    isPost() {
      return this.$route.name === 'postminetoken'
    }
  },
  created() {
  },
  mounted() {
    if (!getCookie('ACCESS_TOKEN')) return this.$router.go(-1)
    this.tokenDetail()

    if (!this.isPost) this.form.agree = true
  },
  methods: {
    async tokenDetail() {
      await this.$API.tokenDetail().then(res => {
        if (res.code === 0) {
          if (res.data.token) {
            if (res.data.tags.length > 0) {
              this.tags.forEach((tag) => {
                res.data.tags.forEach(e => {
                  if (e.tag === tag.label) {
                    this.form.tags.push(tag.label)
                  }
                }) 
              })
            }
            if (this.isPost) {
              this.$router.push({
                name: 'editminetoken'
              })
            } else {
              const { token } = res.data
              this.form.name = token.name
              this.form.symbol = token.symbol
              this.form.logo = token.logo
              this.form.brief = token.brief
              this.form.introduction = token.introduction
              this.tokenId = token.id
              this.tokenDetailData = res.data

              this.minetokenGetResources(token.id)
            }
          }
        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
        }
      })
    },
    async minetokenTokenId(id) {
      const { name, logo, brief, tags, introduction } = this.form
      const data = {
        name: name,
        brief: brief,
        tags,
        introduction,
        logo: logo
      }
      const res = await this.$API.minetokenTokenId(data, id)
      if (res.code === 0) return res.message
      else throw res.message
    },
    // 初始发fan票不需要调用mint接口
    async minetokenMint() {
      const { number } = this.form
      const data = {
        amount: toPrecision(number, 'CNY')
      }
      this.$message('正在增发中，请稍等片刻。')
      this.addToLoading = true
      const res = await this.$API.minetokenMint(data)
      this.addToLoading = false
      if (res.code === 0) {
        this.$message({ showClose: true, message: res.message, type: 'success'})
        this.tokenDetail()
      } else {
        this.$message({ showClose: true, message: res.message, type: 'error' })
      }
    },
    async minetokenResources(id) {
      const aboutArray = this.about.filter(i => i)
      const socialFilter = this.social.filter(i => socialTypes.includes(i.symbol))
      const socialArray = socialFilter.map(i => {
        return {
          type: i.symbol,
          content: i.value
        }
      })

      const data = {
        websites: aboutArray,
        socials: socialArray
      }
      const res = await this.$API.minetokenResources(data, id)
      if (res.code === 0) return res.message
      else throw res.message
    },
    async minetokenCreate() {
      const { name, symbol, tags, logo, brief, introduction, number } = this.form
      const data = {
        name: name,
        symbol: symbol,
        decimals: 4,
        tags: tags,
        brief: brief,
        introduction,
        logo: logo,
        initialSupply: toPrecision(number, 'CNY') + '' // to string type
      }
      await this.$API.minetokenCreate(data)
        .then(res => {
          if (res.code === 0) this.minetokenDone(res.data)
          else this.$message({ showClose: true, message: res.message, type: 'error' })
        })
    },
    async minetokenGetResources(id) {
      await this.$API.minetokenGetResources(id).then(res => {
        if (res.code === 0) {
          const socialFilter = res.data.socials.filter(i => socialTypes.includes(i.type)) // 过滤
          const socialFilterEmpty = socialFilter.filter(i => i.content) // 过滤
          // this.resourcesSocialss = socialFilterEmpty

          socialFilterEmpty.map(i => {
            const index = this.social.findIndex(j => j.symbol === i.type)
            // ~ 运算符 用于判断index 为 -1的情况 如果index为-1 ~index 等于 0
            if (~index) this.social[index].value = i.content
          })
          // this.resourcesWebsites = res.data.websites
          if (res.data.websites.length > 0) this.about = res.data.websites
        } else {
          this.$message({ showClose: true, message: res.message, type: 'success'})
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    minetokenDone(data) {
      Promise.all([this.minetokenResources(data)])
        .then(values => {
          // console.log(values)
          this.$message.success(values[0])
          this.$router.push({
            name: 'minetoken'
          })
        }).catch(err => {
          this.$message.error(err)
          console.log(err)
        })
    },
    minetokenEdit(id) {
      Promise.all([this.minetokenTokenId(id), this.minetokenResources(id)])
        .then(values => {
          // console.log(values)
          this.$message.success(values[0])
        }).catch(err => {
          this.$message.error(err)
          console.log(err)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isPost) this.minetokenCreate()
          else this.minetokenEdit(this.tokenId)
        } else return false
      })
    },
    // 完成上传
    doneImageUpload(res) {
      // console.log(res)
      this.form.logo = res.data.data.cover
      this.imgUploadDone += Date.now()
    },
    removeCoinsIcon() {
      this.form.logo = ''
    },
    aboutAdd() {
      if (this.about.length >= 5) return
      this.about.push({
        url: '',
        name: ''
      })
    },
    abountLess(i) {
      if (this.about.length <= 1) return
      this.about.splice(i, 1)
    },
    addCoins() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.$prompt('增发数量(总量最多发行一亿)', '提示', {
        inputPattern: /^\d{0,9}$/,
        inputErrorMessage: '请输入数字(总量最多发行一亿)',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if ((Number(value) + Number(this.totalAmount)) > 100000000) return this.$message({ showClose: true, message: '发行总量不能超过一亿', type: 'warning'})
        if (Number(value) > 0) {
          this.form.number = Number(value)
          this.minetokenMint()
        }
      }).catch(() => {
        // 不写这个取消时候会报错
      })
    }
  }
}
</script>

<style lang="less" scoped>
.coins-head {
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 33px;
    padding: 0;
    margin: 0;
  }
  .help-icon {
    color: rgba(219, 219, 219, 1);
    margin-left: 10px;
    margin-right: 10px;
  }
  .help-link {
    font-size: 14px;
    color: #868686;
    line-height: 20px;
    text-decoration: underline;
    margin-left: 10px;
  }

  .click-box {
    flex: 1;
    text-align: right;
    padding-right: 10px;
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
    max-width: 400px;
    &.web-name {
      max-width: 150px;
      margin-right: 5px;
    }
  }
  .social-input {
    max-width: 340px;
  }
}
.publish-btn {
  display: block;
}

.form-tags {
  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
  }
}

.tag-help {
  margin-left: 1rem;
}

.tokens-image {
  width: 100%;
  height: 100%;
}
.about-input {
  margin: 0 0 10px;
  width: 100%;
}
.about-input-btn {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
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
.social-item {
  display: inline-block;
  width: 100%;
}
.social-title {
  padding: 0;
  margin: 12px 0 10px 60px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
  span {
    span {
      color: red;
    }
  }
}
.social-icons {
  width: 60px;
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  margin: 0;
}
.tips {
  padding: 0;
  margin: 10px 0 0 0;
  line-height: 1.5;
  color: #848484;
  font-size: 14px;
}

.token-help {
  display: flex;
  a {
    font-size: 16px;
    color: black;
    &:hover {
      color: #542DE0;
    }
  }
}

@media screen and (max-width: 640px) {
  .token-help a {
    font-size: 14px;
  }
  .coins-head {
    display: block;
  }
  .coins-head .click-box {
    margin-right: 0;
    margin-top: 10px;
    text-align: left;
    flex: none;
  }
  .coins-head .help-link {
    margin-top: 10px;
    margin-left: 0;
  }

  .input-form {
    margin-top: 0;

    /deep/ .el-form-item__label {
      display: block;
      text-align: left;
      float: left;
    }
    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
    /deep/ .el-checkbox {
      width: 100%;
      overflow: hidden;
    }
    /deep/ .el-checkbox__label {
      white-space: initial;
    }
  }
  .publish-btn {
    min-width: 200px;
    text-align: center;
    margin: 0 auto;
  }
  .form-tags {
  /deep/ .el-form-item__content {
    display: inline-block;
  }
}
}
</style>

<style>
.social-title span span {
  color: red;
}
</style>
