<template>
  <div class="card" @click.stop="$router.push({ name: 'User', params: { id } })">
    <div class="avatar">
      <img v-if="avatarList" v-lazy="avatarList" :src="avatarList" alt="avatar" />
    </div>
    <div class="card-list">
      <p class="list-name">{{ list.nickname || list.username || list.followed }}</p>
      <p class="list-des">{{ list.fans }}粉丝</p>
    </div>
    <span
      v-if="!list.is_follow"
      class="follow-button dark"
      @click.stop="$emit('followOrUnfollowUser', { id, type: 1, index, indexList })"
    >
      <svg-icon icon-class="add" />
      关注
    </span>
    <span
      v-else
      class="follow-button"
      @click.stop="$emit('followOrUnfollowUser', { id, type: 0, index, indexList })"
      >已关注</span
    >
  </div>
</template>

<script>
export default {
  props: ['list', 'ownerId', 'index', 'indexList'],
  computed: {
    id() {
      const { list, ownerId } = this
      return Number(list.uid) === Number(ownerId) ? list.fuid : list.uid
    },
    avatarList() {
      return this.list.avatar ? this.$backendAPI.getAvatarImage(this.list.avatar) : ''
    }
  },
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  padding: 20px;
  display: flex;
  align-items: center;
  background: #fff;
  margin: 0 0 10px 0;
  justify-content: space-between;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
  flex: 0 0 60px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.card-list {
  flex: 1;
  text-align: left;
  position: relative;
  padding-left: 10px;
  height: 60px;
  box-sizing: border-box;
  overflow: hidden;
}
.list-name {
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
  margin: 8px 0 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.list-des {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 17px;
  margin: 6px 0 0 0;
}

.follow-button {
  flex: 0 0 63px;
  width: 63px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 1);
  padding: 4px 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 17px;
  box-sizing: border-box;
  cursor: pointer;
  &.dark {
    background-color: #000;
    color: #fff;
  }
}
</style>
