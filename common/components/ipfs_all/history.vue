<template>
  <div class="history">
    <p>{{ $t('ipfsHash.history.description') }}</p>
    <div class="note">
      {{ $t('ipfsHash.history.selectNode') }}
      <div class="note-item">
        <el-radio v-model="historyPreviewSelect" label="mttk">
          Matataki
        </el-radio>
        <el-radio v-model="historyPreviewSelect" label="infura">
          Infura
        </el-radio>
        <el-radio v-model="historyPreviewSelect" label="ipfs">
          IPFS.io
        </el-radio>
      </div>
    </div>
    <el-table
      :data="articleIpfsInfomation"
      height="400"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="#" width="70" />
      <el-table-column prop="htmlHash" :label="$t('ipfsHash.history.table.hash')" width="460">
        <template slot-scope="scope">
          {{ scope.row.htmlHash }}
          <svg-icon
            class="copy-hash"
            icon-class="copy"
            @click="copy(scope.row.htmlHash)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="datetime" :label="$t('ipfsHash.history.table.createdAt')" />
      <el-table-column fixed="right" :label="$t('ipfsHash.history.table.action')" width="100">
        <template slot-scope="scope">
          <a :href="scope.row.preview" target="_blank">
            <el-button type="text" size="small">
              {{ $t('ipfsHash.history.action.preview') }}
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    articleIpfsArray: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      historyPreviewSelect: 'mttk',
      ipfsNodeMap: {
        mttk: 'https://ipfs.mttk.net/ipfs/',
        ipfs: 'https://ipfs.io/ipfs/',
        infura: 'https://ipfs.infura.io/ipfs/'
      }
    }
  },
  computed: {
    articleIpfsInfomation() {
      return this.articleIpfsArray
        .slice() // clone array so no side effect on the original array
        .sort((a, b) => b.id - a.id)
        .map(item => {
          const datetime = new Date(item.createdAt).toLocaleString()
          const preview = `${this.selectedNode}${item.htmlHash}`
          return { ...item, datetime, preview }
        })
    },
    selectedNode() {
      return this.ipfsNodeMap[this.historyPreviewSelect]
    }
  },
  methods: {
    copy(val) {
      this.$copyText(val).then(
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
      )
    }
  }
}
</script>
<style lang="less" scoped>
.note {
  margin-bottom: 10px;
}
.note-item {
  display: inline-block;
  margin-left: 10px;
}
.copy-hash {
  cursor: pointer;
}

@media screen and (max-width: 500px) {
  .note-item {
    display: block;
    margin-left: 0;
    margin: 10px;
    /deep/ .el-radio {
      margin-right: 10px;
    }
  }
  
}
</style>