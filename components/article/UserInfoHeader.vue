<template>
  <div class="Post-Author">
    <div class="AuthorInfo">
      <avatar class="Avatar" :size="'38px'" :src="article.avatar" @click="$router.push(`/user/${article.uid}`)" />
      <div class="AuthorInfo-content">
        <router-link :to="`/user/${article.uid}`">
          <span class="UserLink AuthorInfo-name">{{ article.nickname || article.author }}</span>
        </router-link>
        <span class="Post-Time">发布于{{ article.articleCreateTimeComputed }}</span>
        <span class="View-Num">
          <svg-icon class="icon" icon-class="read" />
          {{ article.read || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  },
  props: {
    article: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`
    }
  }
}
</script>

<style scoped lang="less">
.Avatar {
  background: #fff;
  border-radius: 50%;
  vertical-align: top;
  height: 38px;
  width: 38px;
}
.AuthorInfo-content {
  display: flex;
  align-items: center;
}
.Post-Author {
  display: flex;
  align-items: center;
  .AuthorInfo {
    flex: 1 1;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .AuthorInfo-name {
    margin-left: 14px;
    font-size:18px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:33px;
  }
}
.Post-Time {
  margin-left: 18px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:33px;
}
.View-Num {
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:33px;
  margin-left: 18px;
  display: flex;
  align-items: center;
  .icon {
    font-size: 22px;
    margin-right: 6px;
  }
}
.Post-Time, .View-Num {
  .info-font();
}
</style>
