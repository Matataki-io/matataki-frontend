<template>
  <m-dialog
    v-model="createFavShowModal"
    width="446px"
    title="收藏夹信息"
  >
    <CreateFavForm type="create" @create-done="createFavShowModal = false" />
  </m-dialog>
</template>

<script>
import CreateFavForm from './form'
export default {
  name: 'CreateFav',
  components: {
    CreateFavForm
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
}
</script>