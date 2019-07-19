<template>
  <div class="reward mw">
    <BaseHeader :pageinfo="{ title: pageTitle }" :has-bottom-border-line="true" />
    <ArticlesList :id="id" ref="ArticlesList" :listtype="'reward'" />
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
      playerincome: null,
      editing: false,
      user: '',
      pageTitle: ''
    }
  },
  computed: {
    ...mapGetters(['isMe'])
  },
  created() {
    const { isMe, id } = this
    this.user = isMe(id) ? '我的用户页' : `${id} 的用户页`
    this.pageTitle = isMe(id) ? '我的投资' : `${id} 的投资`
    document.title = `${this.user} - SmartSignature`
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.reward {
  background-color: #f7f7f7;
  padding-bottom: 20px;
  padding-top: 45px;
  min-height: 100%;
}
</style>
