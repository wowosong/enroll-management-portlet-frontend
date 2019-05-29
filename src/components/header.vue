<template>
  <div class="container header">
    <header>
      <div class="main-wrap">
        <div class="logo-wrap clearfix">
          <img v-if="!$route.query.enroll" src="@/imgs/logo.png" @click="goHome" class="logo">
          <img v-else src="@/imgs/logo2.png"  width="175px" height="29px">
          <div class="menu-main">
            <ul>
              <li @click="goHome" :class="active=='home'?'active':''">首页</li>
              <li v-if="!isLogin" @click="goPlan" :class="active=='plan'?'active':''">网上报名</li>
              <li v-if="isLogin" @click="goCenter" :class="active=='center'?'active':''">个人中心</li>
            </ul>
          </div>
          <template v-if="!isLogin && !$route.query.enroll">
            <a v-if="!isPhone" @click="goPlan"><i class="iconfont">&#xe619;</i>首次报名</a>
            <a v-else @click="goLogin">登录</a>
          </template>
          <template v-if="isLogin && !$route.query.enroll">
            <a>
              <label @click="goCenter">
                <img v-if="userInfo.accountAvatar" :src="avatar_url+userInfo.accountAvatar">
                <img v-else src="@/imgs/avatar.png">
                <span class="user-name">{{userInfo.userName}}</span>
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
    computed: {
      userInfo: function () {
        return this.$store.state.userInfo
      },
      isLogin: function () {
        return this.$store.state.isLogin
      },
      isPhone: function () {
        return this.$store.state.isPhone
      },
      active:function () {
        return this.$store.state.active
      }
    },
    methods: {
      // logo 跳转首页
      goHome() {
        // 设置导航栏状态
        localStorage.setItem('active','home');
        this.$store.commit('setMenu', 'home');
        this.$router.push('/')
      },
      //首次报名 跳转计划列表
      goPlan() {
        // 设置导航栏状态
        localStorage.setItem('active','plan');
        this.$store.commit('setMenu', 'plan');
        this.$router.push({path: '/plan'})
      },
      // 头像 跳转个人中心
      goCenter() {
        // 设置导航栏状态
        localStorage.setItem('active','center');
        this.$store.commit('setMenu', 'center');
        this.$router.push({path: '/center'})
      },
      //登录
      goLogin() {
        this.$router.push({path: '/login'})
      },
      //  退出
      logout() {
        // 清除token
        localStorage.removeItem('accesstoken');
        // 清空用户信息
        this.$store.commit('getUserInfo', {});
        // 重置登录状态
        this.$store.commit('changeLogin', false);
        // 设置导航栏状态
        this.$store.commit('setMenu', 'home');
        localStorage.setItem('active','home');
        this.$router.push('/')
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

  .logo-wrap {
    cursor: pointer;
    box-sizing: border-box;
    .logo {
      width: 277px;
      height: 58px;
      margin-top: 9px;
      float: left;
    }
    .menu-main{
      float: left;
      margin-left: 80px;
      ul{
        font-size: 18px;
      }
      li{
        width: 150px;
        text-align: center;
        float: left;
        margin-left: 15px;
        &:hover{
          background: #aa2f33;
        }
      }
      li.active{
        background: #aa2f33;
      }
    }
    a {
      color: #fff;
      float: right;
      label {
        display: inline-block;
        line-height: 21px;
        cursor: pointer;
      }
      i {
        margin-right: 5px;
      }
      img {
        width: 22px;
        height: 21px;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: bottom;
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
