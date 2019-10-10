<template>
  <div class="container home-wrap">
    <div class="banner">
      <div class="main-wrap clearfix']">
        <div class="sign-btn">
          <a v-if="!isLogin" @click="goPlan">首次报名</a>
          <a v-if="isLogin" @click="goCenter">查看报名</a>
        </div>
        <!--登录框-->
        <div class="login" v-if="!isLogin && !isPhone">
          <h1>已报名登录</h1>
          <div class="user-error" v-if="userError">{{userError}}</div>
          <div class="pwd-error" v-if="pwdError">{{pwdError}}</div>
          <div class="login-item m-b">
            <i class="iconfont">&#xe618;</i>
            <input v-model="loginForm.username" placeholder="请输入第一监护人手机号"/>
          </div>
          <div class="login-item">
            <i class="iconfont">&#xe69e;</i>
            <input :type="isPwd ? 'password': 'text'" maxlength="18" @blur="changePwd" v-model="loginForm.password" placeholder="初始化密码为证件号后六位"/>
            <i class="iconfont fr pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
            <i class="iconfont fr pointer" v-else @click="isPwd = !isPwd">&#xe6b8;</i>
          </div>
          <div class="pwd-wrap clearfix">
            <el-checkbox v-model="isRemember">记住密码</el-checkbox>
            <a @click="showResetPwd = true">忘记密码</a>
          </div>
          <div class="login-btn" @click="login">
            <a>登录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="notice-wrap clearfix">
      <div class="swiper-container swiper-hide">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(i,index) in noticeSlide" :key="index"
               :style="{backgroundImage:'url('+i.imgUrl+')'}">
            <div class="slide-desc">{{i.desc}}</div>
          </div>
        </div>
        <!-- Add Arrows -->
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>
      <div class="notice-main">
        <div class="notice-title">通知公告<a @click="moreNotice()"><span>更多</span> <i class="iconfont">&#xe6e9;</i></a>
        </div>
        <ul class="notice-list" v-if="noticeList && noticeList.length > 0">
          <li v-for="(item,index) in noticeList" :key="index" v-if="index<5">
            <p @click="showNotice(item)">{{item.noticeTitle}}</p>
            <span>{{item.publishTime | dateFormatYmd}}</span>
          </li>
        </ul>
        <!--暂无数据-->
        <div class="no_data" v-else></div>
      </div>
    </div>
    <!--找回密码-->
    <reset_pwd v-if="showResetPwd" @cancelFn="cancelResetPwd"></reset_pwd>
  </div>

</template>

<script>
  import reset_pwd from './comp/reset_pwd'
  import slide1 from '@/imgs/notice1.jpg'

  export default {
    name: "index",
    components: {reset_pwd},
    data() {
      return {
        // 是否记住密码
        isRemember: true,
        // 是否明文密码
        isPwd: true,
        // 登录错误提示
        userError: '',
        pwdError: '',
        //是否显示找回密码
        showResetPwd: false,
        // 登录信息
        loginForm: {
          username: '',
          password: '',
          grant_type: 'password'
        },

        noticeList: [],
        noticeSlide: [
          {
            desc: '校园景观1',
            imgUrl: slide1
          },
          {
            desc: '校园景观2',
            imgUrl: slide1
          },
          {
            desc: '校园景观3',
            imgUrl: slide1
          }
        ]
      }
    },
    mounted() {
      this.init();
      //初始化公告数据
      this.initNotice();
    },
    computed: {
      isLogin: function () {
        return this.$store.state.isLogin
      },
      isPhone: function () {
        return this.$store.state.isPhone
      }
    },
    methods: {
      // 初始化method
      init() {
        // 公告swiper初始化
        var mySwiper = new Swiper('.swiper-container', {
          loop: true,
          autoplay: {
            delay: 8000,//4秒切换一次
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
        // 是否记住密码
        let loginInfo = localStorage.getItem('loginInfo') ? localStorage.getItem('loginInfo') : '';
        if (loginInfo) {
          let temp = loginInfo.split('&');
          this.loginForm.username = temp[0];
          this.loginForm.password = temp[1];
        }

      },
      moreNotice() {
        this.$router.push({path: '/notice'});
      },
      showNotice(data) {
        this.$router.push({path: '/notice/detail', query: {id:data.id}});
      },
      changePwd(){
        let pattern = /^[a-zA-Z0-9]{6,18}$/;
        this.pwdError = '';
        if(!pattern.test(this.loginForm.password)){
          this.pwdError = '密码长度在6-18位之间';
          this.userError = '';
        }
      },
      // 验证登陆信息是否可以提交
      vaildFn() {
        let vm = this;
        let mobileRes = /^\d{8,15}?$/;
        vm.userError = '';
        vm.pwdError = '';
        if (!vm.loginForm.username) {
          vm.userError = '请输入第一监护人手机号';
          return false
        }
        if (!mobileRes.test(vm.loginForm.username)) {
          vm.userError = '请输入正确格式的手机号';
          return false
        }
        if (!vm.loginForm.password) {
          vm.pwdError = '请输入密码';
          return false
        }
        return true
      },
      initNotice() {
        //初始化数据
        let vm = this;
        http.get("/gateway/enroll/api/erNotice/portalQuery", {params: vm.filter}).then(function (xhr) {
          vm.noticeList = xhr.data.data;
        })
      },
      // 登录
      login() {
        let vm = this;
        let flag = this.vaildFn();
        if (flag) {
          // 记住密码 用户信息存localStorage
          let loginInfo = '';
          loginInfo = vm.loginForm.username + "&" + vm.loginForm.password;
          if (vm.isRemember) {
            localStorage.setItem('loginInfo', loginInfo)
          } else {
            localStorage.removeItem('loginInfo')
          }
          http.post('/gateway/auth/oauth/token', vm.loginForm, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic YnJvd3Nlcjo='
            },
            emulateJSON: true,
            transformRequest: [function (data) {
              let ret = '';
              Object.keys(data).map(key => {
                ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
              });
              return ret
            }]
          }).then(function (xhr) {
            if (xhr.data.code == '20001') {
              vm.userError = xhr.data.message;
            } else {
              let dataToken = xhr.data;
              localStorage.setItem('accesstoken', JSON.stringify(dataToken));
              if (xhr.data && xhr.data.access_token) {
                localStorage.setItem('active', 'center');
                vm.$store.commit('changeLogin', true);
                vm.$store.commit('setMenu', 'center');
              }
            }
          })
        }
      },
      // 首次报名 跳转计划列表
      goPlan() {
        // 设置导航栏状态
        localStorage.setItem('active', 'plan');
        this.$store.commit('setMenu', 'plan');
        this.$router.push({path: '/plan'});
      },
      // 查看报名 跳转个人中心
      goCenter() {
        // 设置导航栏状态
        localStorage.setItem('active', 'center');
        this.$store.commit('setMenu', 'center');
        this.$router.push({path: '/center'})
      },
      // 取消找回密码
      cancelResetPwd() {
        let vm = this;
        vm.showResetPwd = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background: #fff;
  }

  .banner {
    height: 420px;
    background: url(~css_img/banner.jpg) no-repeat center;
    background-size: cover;
  }

  .main-wrap {
    padding-top: 58px;
    background: url(~css_img/banner.jpg) no-repeat center;
    background-size: cover;
    position: relative;
    height: 100%;
    .sign-btn {
      width: 250px;
      height: 80px;
      line-height: 80px;
      background: -webkit-linear-gradient(left,#ff7d94, #f79c6e);
      background: -o-linear-gradient(left,#ff7d94, #f79c6e);
      background: -moz-linear-gradient(left,#ff7d94, #f79c6e);
      background: linear-gradient(to right,#ff7d94, #f79c6e); /* 标准的语法（必须放在最后） */
      border-radius: 40px;
      text-align: center;
      position: absolute;
      left: 47%;
      bottom: 42px;
      transform: translateX(-47%);
      a {
        display: block;
        color: #fff;
        font-size: 36px;
        font-weight: bold;
      }
    }
    .login {
      float: right;
      width: 318px;
      height: 325px;
      background: #fff;
      border-radius: 4px;
      padding: 24px;
      box-sizing: border-box;
      position: relative;
      .pwd-error, .user-error {
        position: absolute;
        color: #f40002;
      }
      .pwd-error {
        top: 190px;
      }
      .user-error {
        top: 125px;
      }
      h1 {
        padding-left: 16px;
        line-height: 24px;
        border-left: 4px solid #aa2f33;
        font-size: 18px;
        font-weight: normal;
        color: #333;
        margin-bottom: 25px;
      }
      .login-item {
        height: 45px;
        border-bottom: 1px solid #e6e6e6;
        line-height: 45px;
        i {
          color: #999;
          margin-right: 10px;
          font-size: 18px;
        }
        .pointer {
          cursor: pointer;
        }
      }
      input {
        outline: none;
        border: none;
        width: 190px;
      }
      .pwd-wrap {
        margin-top: 30px;
        a {
          float: right;
          color: #aa2f33;
        }
      }
      .login-btn {
        text-align: center;
        background: #2f3861;
        border-radius: 4px;
        margin-top: 22px;
        a {
          display: block;
          height: 46px;
          color: #fff;
          font-size: 14px;
          line-height: 46px;
        }
      }
    }
    .m-b {
      margin-bottom: 20px;
    }
  }

  .fr {
    float: right;
  }

  .notice-wrap {
    width: 1120px;
    margin: 40px auto;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .swiper-container {
    width: 380px;
    height: 210px;
    float: left;
    .swiper-slide {
      background-position: center;
      background-size: cover;
      position: relative;
      border-radius: 4px;
      .slide-desc {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  .notice-main {
    margin-left: 420px;
    .notice-title {
      width: 100%;
      border-bottom: 1px solid #aa2f33;
      color: #aa2f33;
      font-size: 18px;
      padding-bottom: 12px;
      a {
        float: right;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #aa2f33;
        }
        i {
          font-size: 12px;
        }
      }
    }
    .notice-list {
      width: 100%;
      margin-top: 12px;
      li {
        cursor: pointer;
        position: relative;
        line-height: 34px;
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 100px;
        }
        span {
          display: block;
          color: #999;
          font-size: 12px;
          position: absolute;
          right: 0;
          top: 0;
        }
        &:hover {
          color: #aa2f33;
        }
      }
    }
  }
</style>
<style lang="less">
  .swiper-container {
    .swiper-button-next, .swiper-button-prev {
      background-color: rgba(0, 0, 0, 0.5);
      background-size: 13px 22px;
      padding: 20px 15px;
      width: 13px;
      height: 22px;
      box-sizing: border-box;
    }
    .swiper-button-next {
      right: 0;
    }
    .swiper-button-prev {
      left: 0;
    }
  }
</style>
