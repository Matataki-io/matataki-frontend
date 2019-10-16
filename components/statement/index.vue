<template>
  <el-dialog
    :title="$t('publish.originalStatement')"
    :visible.sync="dialogVisible"
    width="600px"
    center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="br10"
  >
    <div class="text-content">
      <p>
        {{ $t('publish.statement') }}
      </p><p>
        {{ $t('publish.statement1') }}
      </p><p>
        {{ $t('publish.statement2') }}
      </p><p>
        {{ $t('publish.statement3') }}
      </p><p>
        {{ $t('publish.statement4') }}
      </p><p>
        {{ $t('publish.statement5') }}
      </p><p>
        {{ $t('publish.statement6') }}
      </p><p>
        {{ $t('publish.statement7') }}
      </p><p>
        {{ $t('publish.statement8') }}
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeButton(false)">
        {{ $t('cancel') }}
      </el-button>
      <el-button type="primary" @click="closeButton(true)">
        {{ $t('confirm') }}
      </el-button>
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
  }
}
</style>
