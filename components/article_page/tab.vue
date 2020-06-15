<template>
  <div class="main-all">
    <div class="main-head__nav">
      <ul class="nav-title">
        <li
          v-for="(item, index) in head"
          :key="index"
        >
          <router-link
            :class="index === idx && 'active'"
            :to="{name: item.url}"
          >
            {{ item.lab }}
          </router-link>
        </li>
      </ul>
      <slot name="sort" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    idx: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      head: [
        {
          url: 'article',
          lab: this.$t('home.allCreation'),
        },
        {
          url: 'article-latest',
          lab: this.$t('home.latestCreation'),
        },
        // {
        //   url: 'article-circle',
        //   lab: this.$t('home.fanCircle'),
        // },
        // {
        //   url: 'article-follow',
        //   lab: this.$t('home.myFocus'),
        // }
      ]
    }
  },
}
</script>

<style lang="less" scoped>
.main-head__nav {
  // height: 50px;
  // margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .nav-title {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    li {
      margin: 0 40px 0 0;
      a {
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 500;
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: #B2B2B2;
        &.active {
          color: rgba(0, 0, 0, 1);
        }
        em {
          font-size: 20px;
          font-style: normal;
          color: @purpleDark;
        }
      }
    }
  }
}

// 小于992
@media screen and (max-width: 992px) {
  .main-head__nav .nav-title li a {
    font-size: 16px;
  }
}


@media screen and (max-width: 540px) {
  .main-head__nav .nav-title li {
    margin-right: 20px;
    a {
      font-size: 14px;
    }
  }
}
</style>