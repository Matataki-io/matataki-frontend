<template>
  <el-dialog
    title="原创声明"
    :visible.sync="dialogVisible"
    width="600px"
    center
    custom-class="br10"
  >
    <div class="text-content">
      <p>
        勾选本原创声明，即代表您确认并承诺该文章，包括文章中的使用的图片等其他元素，是由您本人（或持有该账号之组织）独立创作完成，或者已取得原作权利人的使用许可。有如下情况的文章请勿勾选本原创声明：
      </p><p>
        1.歪曲、篡改、抄袭、剽窃他人创作而产生的作品，
      </p><p>
        2.文章主要篇幅为诸如“法律、法规，国家机关的决议、决定、命令和其他具有立法、行政、司法性质的文件、时事新闻、历法、通用数表、通用表格和公式”等的公共内容；
      </p><p>
        3.转发他人作品形成的内容，
      </p><p>
        4.大篇幅引用他人内容或文章主要内容为他人作品，如书摘、文摘、报摘等；
      </p><p>
        5.文章主体系整合、汇编他人作品内容
      </p><p>
        6.通过其他侵犯著作权或其他权益方式形成的内容。
      </p><p>
        在取得原作者或权利人同意后，对作品进行改编、翻译再创作的，视同原创。
      </p><p>
        智能签名鼓励用户发布原创文章，勾选本原创声明的文章会展示原创标识。
        但本原创声明仅是您对文章内容原创性的单方承诺，并不表示智能签名认可了文章的原创性。
        若您在勾选本原创声明后，文章被证明并非独立原创，智能签名将按照平台规范删除等。
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeButton(false)">取 消</el-button>
      <el-button type="primary" @click="closeButton(true)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: this.visible
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
    closeButton(val) {
      this.$emit('close', val)
      this.closeDialog()
    }
  }
}
</script>

<style lang="less" scoped>
.text-content {
  p {
    font-size: 14px;
    line-height: 1.5;
    word-break: keep-all;
  }
}
</style>
