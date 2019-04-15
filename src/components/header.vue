<template>
  <div class="container">
    <header>
      <div class="main-wrap">
        <div class="logo clearfix">
          <img src="@/imgs/logo.png" @click="goHome">
          <a v-if="!isLogin" @click="goPlan"><i class="iconfont">&#xe619;</i>首次报名</a>
          <template v-else>
            <a>
              <label @click="goCenter">
                <img :src="avatar_url+userInfo.accountAvatar" @error="errorImg($event,'avatar')">
                {{userInfo.userName}}
              </label>
              <span class="logout" @click="logout">退出</span>
            </a>
          </template>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        avatar_url: window.systemParameter.FILE_SYSTEM_URL + "/file/thumbnail/",
      }
    },
    mounted() {
    },
    computed: {
      userInfo: function () {
        return this.$store.state.userInfo
      },
      isLogin: function () {
        return this.$store.state.isLogin
      }
    },
    methods: {
      // logo 跳转首页
      goHome() {
        this.$router.push('/')
      },
      //首次报名 跳转计划列表
      goPlan() {
        this.$router.push({path: '/plan'})
      },
      // 头像 跳转个人中心
      goCenter() {
        this.$router.push({path: '/center'})
      },
      //  退出
      logout() {
        // 清除token
        localStorage.removeItem('accesstoken');
        // 清空用户信息
        this.$store.commit('getUserInfo', {});
        // 重置登录状态
        this.$store.commit('changeLogin', false);
      }
    }
  }
</script>
<style scoped lang="less">
  header {
    background: #2f3861;
    color: #fff;
    height: 77px;
    line-height: 77px;
    border-bottom: 3px solid #aa2f33;
  }

  .logo {
    cursor: pointer;
    box-sizing: border-box;
    a {
      color: #fff;
      float: right;
      label {
        cursor: pointer;
      }
      i {
        margin-right: 5px;
      }
      img {
        width: 41px;
        height: 38px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    img {
      vertical-align: middle;
    }
    .logout {
      margin-left: 16px;
      &:hover {
        color: #aa2f33;
      }
    }
  }
</style>
