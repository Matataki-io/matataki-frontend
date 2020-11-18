<template>
  <m-dialog
    v-model="createFavShowModal"
    width="446px"
    title="收藏夹信息"
  >
    <favForm type="create" @create-done="createDone" />
  </m-dialog>
</template>

<script>
import favForm from './form'
export default {
  name: 'CreateFav',
  components: {
    favForm
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      createFavShowModal: false,
    }
  },
  watch: {
    value(newVal) {
      this.createFavShowModal = newVal
    },
    createFavShowModal(newVal) {
      this.$emit('input', newVal)
    },
  },
  methods: {
    createDone() {
      this.$emit('create-done')
      this.createFavShowModal = false
    }
  }
}
</script>