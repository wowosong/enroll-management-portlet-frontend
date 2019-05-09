<template>
  <div>
    <div class="login">
      <div class="user-error" v-if="userError">{{userError}}</div>
      <div class="pwd-error" v-if="pwdError">{{pwdError}}</div>
      <div class="login-item m-b-16">
        <i class="iconfont">&#xe602;</i>
        <input v-model="loginForm.username" placeholder="手机号"/>
      </div>
      <div class="login-item">
        <i class="iconfont">&#xe609;</i>
        <input type="password" v-model="loginForm.password" v-if="isPwd" placeholder="初始化密码为证件号后六位"/>
        <input type="text" v-model="loginForm.password" v-if="!isPwd" placeholder="初始化密码为证件号后六位"/>
        <i class="iconfont fr pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
        <i class="iconfont fr pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
      </div>
      <div class="pwd-wrap clearfix">
        <el-checkbox v-model="isRemember">记住密码</el-checkbox>
        <a @click="$router.push('/reset')">忘记密码</a>
      </div>
      <div class="login-btn" @click="login">
        <a>登录</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        // 是否记住密码
        isRemember: true,
        // 是否明文密码
        isPwd: true,
        // 登录错误提示
        userError: '',
        pwdError: '',
        // 登录信息
        loginForm: {
          username: '',
          password: '',
          grant_type: 'password'
        },
      }
    },
    mounted(){
      // 是否记住密码
      let loginInfo = localStorage.getItem('loginInfo') ? localStorage.getItem('loginInfo') : '';
      if (loginInfo) {
        let temp = loginInfo.split('&');
        this.loginForm.username = temp[0];
        this.loginForm.password = temp[1];
      }
    },
    methods: {
      // 验证登陆信息是否可以提交
      vaildFn() {
        let vm = this;
        let mobileRes = /^1[34578]\d{9}$/;
        vm.userError = '';
        vm.pwdError = '';
        // if (!mobileRes.test(vm.loginForm.username)) {
        //   vm.userError = '请输入正确格式的手机号码';
        //   return false
        // }
        if (!vm.loginForm.username) {
          vm.userError = '请输入手机号码';
          return false
        }
        if (!vm.loginForm.password) {
          vm.pwdError = '请输入密码';
          return false
        }
        return true
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
                vm.$store.commit('changeLogin', true);
                localStorage.setItem('active','center');
                vm.$store.commit('setMenu', 'center');
                vm.$router.push({path:'/center',query:{progress:true}});
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .login {
    width: 85%;
    margin: 62px auto 0;
    box-sizing: border-box;
    position: relative;
    .pwd-error, .user-error {
      position: absolute;
      color: #f40002;
    }
    .pwd-error {
      top: 98px;
    }
    .user-error {
      top: 40px;
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
      height: 41px;
      border: 1px solid #e5e5e5;
      line-height: 41px;
      padding: 0 12px;
      i {
        color: #a0a0a0;
        margin-right: 10px;
        font-size: 18px;
        /*display: inline-block;*/
      }
      .pointer {
        cursor: pointer;
      }
    }
    input {
      outline: none;
      border: none;
      background: none;
      width: 200px;
      height: 100%;
    }
    .pwd-wrap {
      margin-top: 30px;
      a {
        float: right;
      }
    }
    .login-btn {
      text-align: center;
      background: #2f3861;
      border-radius: 4px;
      margin-top: 22px;
      a {
        display: block;
        height: 44px;
        color: #fff;
        font-size: 14px;
        line-height: 44px;
      }
    }
  }
  .m-b-16 {
    margin-bottom: 16px;
  }
  .fr{
    float: right;
  }
</style>
