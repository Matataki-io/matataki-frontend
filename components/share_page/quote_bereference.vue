<template>
  <BasePull
    class="container"
    :url-replace="$route.params.id + ''"
    :params="pull.params"
    :api-url="pull.apiUrl"
    :loading-text="$t('not')"
    :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
    :need-access-token="true"
    :auto-request-time="nowTime"
    @getListData="getListData"
  >
    <!-- <card @getArticle="getArticle" v-for="(item, index) in pull.list" :key="index" :card="item"></card> -->
    <template v-for="(item, index) in referenceList">
      <shareInsideCard cardType="read" v-if="item.type === 'inside'" class="list-card" :key="'shareInsideCard' + index" :idx="index"></shareInsideCard>
      <shareOuterCard cardType="read" v-if="item.type === 'outer'" class="list-card" :key="'shareOuterCard' + index" :idx="index"></shareOuterCard>
    </template>
  </BasePull>
</template>

<script>
// import card from './quote_bereference_card.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
export default {
  components: {
    // card,
    shareOuterCard,
    shareInsideCard,
  },
  props: {
    nowTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      referenceList: [
        {
          type: 'inside'
        },
        {
          type: 'outer'
        },
        {
          type: 'inside'
        },
        {
          type: 'outer'
        }
      ],
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'postsPosts',
        list: []
      },
    }
  },
  methods: {
    getListData(res) {
      // console.log('res2', res)
      let arr = []
      if (res) {
          res.list.map(i => {
          arr.push({
            url: `${process.env.VUE_APP_PC_URL}/p/${i.id}`,
            title: i.title,
          })
        })
        this.pull.list = arr
      }
    },
    getArticle(idInt, popEvent) {
      this.$emit('getArticle', idInt, popEvent)
    }
  }
}
</script>


<style lang="less" scoped>
.container {
  overflow: auto;
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  bottom: 0;
  padding: 0 10px;
}
.list-card {
  margin-top: 20px;
  background-color: transparent;
  &:nth-child(1) {
    margin-top: 0;
  }
}
</style>