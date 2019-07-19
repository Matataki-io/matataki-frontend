<template>
  <BasePull
    :loading-text="'暂无评论'"
    :params="params"
    :api-url="apiUrl"
    :is-refresh="false"
    :auto-request-time="autoRequestTime"
    :need-access-token="true"
    :is-obj="isObj"
    :immediate-check="false"
    @getListData="getListData"
  >
    <CommentCard v-for="(item, index) in articles" :key="index" :comment="item" :type="type" />
  </BasePull>
</template>

<script>
import { CommentCard } from '@/components/'
import { mapGetters } from 'vuex'

export default {
  components: { CommentCard },
  props: ['signId', 'isRequest', 'type'],
  data() {
    return {
      params: {
        signid: this.signId
      },
      apiUrl: 'commentsList',
      articles: [],
      autoRequestTime: 0,
      timer: null,
      isObj: {
        type: 'newObject',
        key: 'data',
        kes: null
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    signId(newVal) {
      this.params = {
        signid: newVal
      }
    },
    isRequest(newVal) {
      console.log(newVal)
      if (newVal) {
        this.timer = setInterval(() => {
          if (this.autoRequestTime >= 2) {
            clearInterval(this.timer)
            this.$emit('stopAutoRequest', false)
          }
          this.autoRequestTime += 1
        }, 2000)
      } else {
        clearInterval(this.timer)
      }
    }
  },

  created() {},

  methods: {
    getListData(res) {
      console.log(res)
      if (
        this.isRequest &&
        res.data.data.length !== 0 &&
        res.data.data[0].author === this.currentUserInfo.name
      ) {
        this.$emit('stopAutoRequest', false)
      }
      this.articles = res.list
    }
  }
}
</script>
