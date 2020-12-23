<template>
  <div class="management">
    <h2 class="token-title">
      {{ $t('token.tokenManagement') }}
    </h2>
    <div class="management-list">
      <router-link :to="{ name: 'editminetoken' }" class="management-list-card">
        <div>
          <img class="basic-settings" src="@/assets/img/token/basic_settings.png" alt="Basic Settings">
          <p>
            {{ $t('basic-settings') }}
          </p>
        </div>
      </router-link>
      <router-link :to="{ name: 'liquidity-mint' }" class="management-list-card">
        <div>
          <img class="liquidity-management" src="@/assets/img/token/liquidity_management.png" alt="Liquidity Management">
          <p>
            {{ $t('liquidity-management') }}
          </p>
        </div>
      </router-link>
      <a href="Javascript:;" class="management-list-card disable">
        <div>
          <img class="marketing" src="@/assets/img/token/marketing.png" alt="Marketing">
          <p>
            {{ $t('marketing') }}
          </p>
        </div>
      </a>
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

.management {
  background: @white;
  padding: 20px;
  border-radius: @br10;
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
          &.basic-settings {
            width: 50.7px;
            height: 60px;

          }
          &.liquidity-management {
            width: 78px;
            height: 66px;
          }
          &.marketing {
            width: 55px;
            height: 50px;
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
  .management-list {
    grid-template-columns: repeat(auto-fill, minmax(@card-width-130px, 1fr));
    &-card {
      min-width: @card-width-130px;
    }
  }
}
</style>
