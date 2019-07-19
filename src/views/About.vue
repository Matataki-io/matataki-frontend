<template>
  <div class="about mw">
    <BaseHeader :pageinfo="{ left: 'back', title: '关于我们', rightPage: 'home' }" />
    <div class="about-card">
      <h1 class="about-title">{{ items.title }}</h1>
      <p class="about-detail">{{ items.detail }}</p>
      <div v-for="(item, idx) in items.content" :key="idx" class="about-content">
        <h3>{{ item.title }}</h3>
        <p v-for="(itemChild, idxChild) in item.detail" :key="idxChild">
          {{ itemChild }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import items from '../assets/QuestionAndAnswer.json'

export default {
  name: 'About',
  data: () => ({
    items
  })
}
</script>

<style scoped>
.about {
  background: #f7f7f7;
  margin: 0 auto;
  padding: 55px 0 0;
  text-align: center;
  min-height: 100%;
  box-sizing: border-box;
}

.about-card {
  margin: 0 10px 10px 10px;
  text-align: center;
  /* max-width: 335px; */
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 5px 3px rgba(233, 233, 233, 0.5);
  border-radius: 8px;
  padding: 18px;
  color: rgba(0, 0, 0, 1);
  text-align: left;
}
h1.about-title {
  font-size: 16px;
  text-align: center;
  font-weight: bolder;
  border-bottom: 1px solid #eee;
  padding: 0 0 6px 0;
}
p.about-detail {
  font-size: 12px;
  font-weight: 400;
  margin: 10px 0;
  line-height: 1.5;
}
.about-content {
  margin: 14px 0;
}
.about-content h3 {
  font-size: 14px;
  font-weight: 600;
}
.about-content p {
  font-size: 12px;
  line-height: 1.5;
  margin: 6px 0;
}
</style>
