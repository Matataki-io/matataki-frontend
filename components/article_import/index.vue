<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="460px"
    :show-close="false"
    :close-on-click-modal="false"
    class="import"
    @close="$emit('close')"
  >
    <el-input v-model="url" placeholder="请输入文章网址链接，包含http(s)://" />
    <p class="des">
      目前支持：链闻、橙皮书、微信文章
    </p>
    <div class="checkbox">
      <el-checkbox v-model="checkedSelf">
        我是原作者
      </el-checkbox>
      <el-checkbox v-model="checkedAuthorize">
        我已有授权
      </el-checkbox>
    </div>
    <p class="des">
      我确认本人是该内容的合法权利人。如果以上信息不完全属实，本人将承担由此产生的一切法律责任。
    </p>
    <div class="statement">
      <el-checkbox v-model="statement">
        我已阅读并同意该责任声明
      </el-checkbox>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="importFunc">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { strTrim, internetUrl } from '@/utils/reg'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      url: '',
      checkedSelf: true,
      checkedAuthorize: true,
      statement: false,
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
    }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    async importFunc() {
      const url = strTrim(this.url)
      if (!internetUrl(url)) return this.$message.error('请输入正确的地址')
      this.loading = true
      const res = await this.$API.importArticle(url)
      // console.log(res)
      if (res.code === 0) {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.$emit('importArticle', res.data)
      } else this.$message.error('导入失败,目前只支持: 链闻、橙皮书、微信文章')
      this.loading = false
      this.closeDialog()
    }
  }
}
</script>

<style lang="less">
.import .el-dialog__header {
  padding: 0;
}

.import {
  .checkbox {
    margin-bottom: 20px;
  }
  .des {
    font-size:14px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height: 1.5;
  }
}
</style>
