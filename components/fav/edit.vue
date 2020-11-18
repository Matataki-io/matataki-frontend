<template>
  <m-dialog
    v-model="editFavShowModal"
    width="446px"
    title="收藏夹信息"
  >
    <favForm :form="form" type="edit" @edit-done="editDone" />
  </m-dialog>
</template>

<script>
import favForm from './form'
export default {
  name: 'EditFav',
  components: {
    favForm
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
      editFavShowModal: false,
    }
  },
  watch: {
    value(newVal) {
      this.editFavShowModal = newVal
    },
    editFavShowModal(newVal) {
      this.$emit('input', newVal)
    },
  },
  methods: {
    editDone() {
      this.$emit('edit-done')
      this.editFavShowModal = false
    }
  }
}
</script>