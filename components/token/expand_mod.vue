<template>
  <div class="expandmod">
    <h2 class="token-title">
      {{ $t('token.expandMod') }}
    </h2>
    <div class="expandmod-list">
      <router-link :to="{ name: 'home' }" class="expandmod-list-card">
        <div>
          <img class="matataki-logo" src="@/assets/img/matataki_logo_small.png" alt="Matataki Logo">
          <p>
            瞬Matataki
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  // props: {
  //   minetokenToken: {
  //     type: Object,
  //     required: true
  //   },
  // },
}
</script>
<style lang="less" scoped>
@card-width: 248px;

.expandmod {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  &-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(@card-width, 1fr));
    grid-gap: 20px 20px;
    justify-content: space-between;
    &-card {
      min-width: @card-width;
      &.disable {
        cursor: default;
        -webkit-filter: grayscale(1);
        filter: grayscale(100%);
        div:hover {
          color: transparent;
          border-color: #DBDBDB;
          background-color: transparent;
        }
      }
      div {
        height: 128px;
        border-radius:8px;
        border:1px solid #DBDBDB;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &:hover {
          color: #542DE0;
          border-color: #ccc0f6;
          background-color: #eeeafc;
        }
        img {
          &.matataki-logo {
            width: 55px;
            height: 55px;

          }
        }
        p {
          color: black;
          font-size:16px;
          font-weight:600;
          line-height:22px;
          margin: 5px 0 0;
        }
      }
    }
  }
}
.token-title {
  font-size: 24px;
  font-weight: bold;
  color: @black;
  line-height: 33px;
  padding: 0;
  margin: 0 0 20px;
}
@media screen and (max-width: 600px) {
  @card-width-130px: 130px;
  .token-title {
    font-size: 20px;
  }
  .expandmod-list {
    grid-template-columns: repeat(auto-fill, minmax(@card-width-130px, 1fr));
    &-card {
      min-width: @card-width-130px;
    }
  }
}
</style>
