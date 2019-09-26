<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="460px"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="import br10"
    @close="$emit('close')"
  >
    <el-input v-model="url" :placeholder="$t('publish.importInput')" />
    <p class="des gray">
      {{ $t('p.importDes1') }}
    </p>
    <p class="des" />
    <p class="des">
      {{ $t('p.importDes2') }}
    </p>
    <div class="statement">
      <el-checkbox v-model="statement">
        {{ $t('p.importAgree') }}
      </el-checkbox>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">
        {{ $t('cancel') }}
      </el-button>
      <el-button :loading="loading" type="primary" :disabled="!statement" @click="importFunc">
        {{ $t('confirm') }}
      </el-button>
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
      if (!internetUrl(url)) return this.$message.error(this.$t('p.importAddressError'))
      this.loading = true
      const res = await this.$API.importArticle(url)
      // console.log(res)
      if (res.code === 0) {
        this.$message.success(this.$t('p.importSuccess'))
        const templateLink = `<br />${this.$t('p.importAddress')}[${url}](${url})`
        res.data.content += templateLink
        this.$emit('importArticle', res.data)
      } else this.$message.error(this.$t('p.importError'))
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
