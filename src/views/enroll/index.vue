<template>
  <div class="bg-white">
    <div class="login">
      <div class="msg">提示：验证码为证件号后六位。</div>
      <div class="user-error" v-if="userError">{{userError}}</div>
      <div class="pwd-error" v-if="pwdError">{{pwdError}}</div>
      <div class="login-item m-b-16">
        <i class="iconfont">&#xe602;</i>
        <input v-model="loginForm.username" placeholder="手机号(第一监护人手机)"/>
      </div>
      <div class="login-item">
        <i class="iconfont">&#xe609;</i>
        <input v-model="loginForm.password" placeholder="请输入验证码(用于核实填写人身份)"/>
      </div>
      <div class="login-btn" @click="login">
        <a>验证</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
    mounted() {
      localStorage.clear();
      this.$store.commit('changeLogin', false);
    },
    methods: {
      // 验证登陆信息是否可以提交
      vaildFn() {
        let vm = this;
        let mobileRes = /^1[34578]\d{9}$/;
        vm.userError = '';
        vm.pwdError = '';
        if (!vm.loginForm.username) {
          vm.userError = '请输入手机号码';
          return false
        }
        if (!mobileRes.test(vm.loginForm.username)) {
          vm.userError = '请输入正确格式的手机号码';
          return false
        }
        if (!vm.loginForm.password) {
          vm.pwdError = '请输入验证码';
          return false
        }
        return true
      },
      // 登录
      login() {
        let vm = this;
        let flag = this.vaildFn();
        if (flag) {
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
              vm.pwdError = xhr.data.message;
            } else {
              let dataToken = xhr.data;
              localStorage.setItem('accesstoken', JSON.stringify(dataToken));
              if (xhr.data && xhr.data.access_token) {
                vm.$store.commit('changeLogin', true);
                vm.$router.push({path: '/center', query: {enroll: true}});
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .bg-white {
    background: #fff;
  }

  .login {
    width: 85%;
    margin: 22px auto 0;
    box-sizing: border-box;
    position: relative;
    .pwd-error, .user-error {
      position: absolute;
      color: #f40002;
    }
    .msg {
      color: #f40002;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .pwd-error {
      top: 126px;
    }
    .user-error {
      top: 68px;
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
    .login-btn {
      text-align: center;
      background: #2f3861;
      border-radius: 4px;
      margin-top: 22px;
      margin-bottom: 22px;
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
</style>
