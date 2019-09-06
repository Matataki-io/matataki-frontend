<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="460px"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="import br10"
    @close="$emit('close')"
  >
    <el-input v-model="url" placeholder="请输入文章网址链接，包含http(s)://" />
    <p class="des gray">
      目前支持：链闻、橙皮书、微信、简书文章。
    </p>
    <p class="des" />
    <p class="des">
      如若在本平台发表的内容发声侵权行为，SS官方有权下架该作品，并保留向侵权作者追究法律责任的权利。
    </p>
    <div class="statement">
      <el-checkbox v-model="statement">
        我同意
      </el-checkbox>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button :loading="loading" type="primary" :disabled="!statement" @click="importFunc">确 定</el-button>
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
        const templateLink = `<br />来源链接：[${url}](${url})`
        res.data.content += templateLink
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
  .des {
    font-size:14px;
    font-weight:400;
    color: #565656;
    line-height: 1.5;
    &.gray {
      color: #6f6f6f;
    }
    &:nth-of-type(1) {
      margin-bottom: 30px;
    }
  }
}
</style>
