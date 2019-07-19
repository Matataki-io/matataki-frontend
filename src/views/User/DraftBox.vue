<template>
  <div class="draftbox mw">
    <BaseHeader :pageinfo="{ left: 'back', title: '我的草稿', rightPage: 'home' }" />
    <BasePull
      :loading-text="'无草稿'"
      :params="params"
      :api-url="apiUrl"
      :need-access-token="true"
      :is-obj="{ type: 'Object', key: 'data' }"
      @getListData="getListData"
    >
      <DraftBoxList
        v-for="(item, index) in draftBoxList"
        :key="item.id"
        class="card-margin"
        :draftbox="item"
        :index="index"
        @delId="delId"
      />
    </BasePull>
    <Prompt
      v-model="prompt"
      :content="{
        title: '是否删除草稿？',
        confirmText: '删除草稿',
        cancelText: '不删除'
      }"
      @confirm="confirmDel"
    />
  </div>
</template>

<script>
import DraftBoxList from './DraftBoxList.vue'
import { Prompt } from '@/components/'

export default {
  name: 'DeaftBox',
  components: {
    DraftBoxList,
    Prompt
  },
  data() {
    return {
      prompt: false,
      params: {},
      apiUrl: 'draftboxList',
      draftBoxList: [],
      delModel: false,
      currentData: {}
    }
  },
  mounted() {},
  methods: {
    getListData(res) {
      // console.log(res)
      this.draftBoxList = res.list
    },
    confirmDel() {
      const { id, index } = this.currentData
      this.prompt = false
      this.asyncSuccessDel(id, index)
    },
    delId(data) {
      this.currentData = data
      this.prompt = true
    },
    // 删除草稿
    async asyncSuccessDel(id, index) {
      try {
        const response = await this.$backendAPI.delDraft({ id })
        if (response.status !== 200) return console.log('自动删除草稿失败,请手动删除')
        this.draftBoxList.splice(index, 1) // 前端手动删除一下数据
        this.$Modal.remove()
      } catch (error) {
        return console.log('自动删除草稿失败,请手动删除')
      }
    }
  }
}
</script>
<style scoped lang="less">
.draftbox {
  background-color: #f7f7f7;
  padding-bottom: 20px;
  padding-top: 45px;
  min-height: 100%;
}
.card-margin {
  margin-bottom: 10px;
}
</style>
