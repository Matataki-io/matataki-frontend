<template>
  <div class="token-banner">
    <div class="token-decoration">
      <img class="decoration" src="@/assets/img/token_banner_decoration.svg">
    </div>
    <img class="token-fan" src="@/assets/img/token_banner_fan.png">

    <div class="token-content">
      <img class="token-text" src="@/assets/img/token_banner_text.png">
      <div class="token-btn">
        <a href="https://www.yuque.com/matataki/matataki/hgc2e6" target="_blank" class="token-more more hvr-float">了解更多</a>
        <a
          v-if="showPublishBtn"
          href="javascript:;"
          class="token-more publish hvr-float"
          @click="push"
        >
          发行Fan票
        </a>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    showPublishBtn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
  },
  methods: {
    push() {
      if (this.isLogined) {
        this.$router.push({ name: 'postminetoken' })
      } else {
        this.$store.commit('setLoginModal', true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.token-banner {
  width: 100%;
  border-radius: 10px;
  min-height: 290px;
  background-color: #ece7ff;
  border-radius: 10px;
  position: relative;
  text-align: center;
  background-image: url("../assets/img/dynamic_banner_bc.png");
  background-size: cover;
  display: flex;
  align-items: center;
  position: relative;
}
.token-decoration {
  position: absolute;
  left: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 10px;
  user-select: none;
  .decoration {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
}
.token-fan {
  position: absolute;
  right: -26px;
  bottom: 0;
  user-select: none;
  height: 343px;
}
.token-content {
  margin-left: 200px;
  margin-right: 20px;

  .token-text {
    max-width: 430px;
    width: 100%;
    user-select: none;
  }
  .token-btn {
    display: flex;
    align-items: flex-start;
  }
  .token-more {
    display: inline-block;
    width: 160px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    margin-top: 10px;
    text-align: center;
    padding: 5px 0;
    &.more {
      background-color: @purpleDark;
      margin-right: 20px;
    }
    &.publish {
      background-color: #FA6400;
    }
  }
}

@media screen and (max-width: 1240px) {
  .token-fan {
    right: 0;
  }
}
@media screen and (max-width: 1100px) {
  .token-decoration {
    display: none;
  }
  .token-content {
    margin-left: 20px;
  }
}
@media screen and (max-width: 900px) {
  .token-fan {
    width: 260px;
    top: auto;
    bottom: 0;
  }
}

@media screen and (max-width: 700px) {
  .token-fan {
    display: none;
  }
}

@media screen and (max-width: 540px) {
  .token-content .token-more {
    width: 110px;
  }
}
</style>