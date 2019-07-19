<template>
  <div class="original mw">
    <BaseHeader :pageinfo="{ title: pageTitle }" :has-bottom-border-line="true" />
    <ArticlesList :id="id" ref="ArticlesList" :listtype="'original'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticlesList from './ArticlesList.vue'

export default {
  name: 'Original',
  components: { ArticlesList },
  props: ['id'],
  data() {
    return {
      editing: false,
      userTitle: ''
    }
  },
  computed: {
    ...mapGetters(['isMe'])
  },
  watch: {
    isMe() {
      this.toggleTitle()
    }
  },
  created() {
    this.toggleTitle()
  },
  methods: {
    toggleTitle() {
      const { isMe, id } = this
      this.pageTitle = isMe(id) ? '我的原创' : '他的原创'
    }
  }
}
</script>
<style scoped>
.original {
  background-color: #f7f7f7;
  padding-bottom: 20px;
  padding-top: 45px;
  min-height: 100%;
}
</style>
