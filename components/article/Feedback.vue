<template>
  <el-dialog
    :visible.sync="showModal"
    width="400px"
    :show-close="false"
    :lock-scroll="false"
    custom-class="my-dialog"
  >
    <div class="feedback-outer">
      <img :src="fbImg" alt="" class="icon">
      <div class="feedback-title">
        <p>阅读新文章</p>
        <p>已获得5个SS积分</p>
      </div>
      <p class="bottom-tip">阅读3天内发表的新文章可额外获得5个SS积分</p>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import completedImg from '@/assets/img/completed.svg'
import newImg from '@/assets/img/new.svg'
export default {
  name: "FeedbackModal",
  components: {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    fbImg() {
      return newImg
    }
  },
  watch: {
    showModal(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.showModal = val;
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.feedback-outer {
  padding: 20px 40px 40px;
  text-align: center;
}
.icon {
  width: 150px;
}
.feedback-title {
  margin-top: 30px;
  p {
    font-size: 18px;
    color: #000000;
    font-weight: 700;
    line-height: 28px;
    margin: 0;
  }
}
.bottom-tip {
  margin: 30px 0 0 0;
  font-size: 14px;
  color: #B2B2B2;
  line-height: 18px;
}
</style>
