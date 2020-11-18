<template>
  <m-dialog
    v-model="createFavShowModal"
    width="446px"
    title="收藏夹信息"
  >
    <CreateFavForm :form="form" @create-done="createFavShowModal = false" />
  </m-dialog>
</template>

<script>
import CreateFavForm from './form'
export default {
  name: 'EditFav',
  components: {
    CreateFavForm
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      default: () => {}
    }
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