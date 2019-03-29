<template>
  <div class="container">
    <div :class="['banner',{'banner-after':isLogin}]">
      <div :class="['main-wrap', 'clearfix',{'banner-after':isLogin,'no-p-t':isLogin}]">
        <div :class="['sign-btn',{'isSign-btn':isLogin}]">
          <a v-if="!isLogin">首次报名</a>
          <a v-if="isLogin">查看报名</a>
        </div>
        <div class="login" v-if="!isLogin">
          <h1>已报名登录</h1>
          <div class="login-item m-b">
            <i class="iconfont">&#xe618;</i>
            <input placeholder="请输入手机号"/>
          </div>
          <div class="login-item">
            <i class="iconfont">&#xe69e;</i>
            <input type="password" v-if="isPwd" placeholder="初始化密码为身份证号后六位"/>
            <input type="text" v-if="!isPwd" placeholder="初始化密码为身份证号后六位"/>
            <i class="iconfont fr pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
            <i class="iconfont fr pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
          </div>
          <div class="pwd-wrap clearfix">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <a>忘记密码</a>
          </div>
          <div class="login-btn">
            <a>登录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="notice-wrap clearfix">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide slide1">
            <div class="slide-desc">校园景观1</div>
          </div>
          <div class="swiper-slide slide2">
            <div class="slide-desc">校园景观2</div>
          </div>
          <div class="swiper-slide slide3">
            <div class="slide-desc">校园景观3</div>
          </div>
        </div>
        <!-- Add Arrows -->
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>
      <div class="notice-main">
        <div class="notice-title">通知公告<a>更多 <i class="iconfont">&#xe6e9;</i></a></div>
        <ul class="notice-list">
          <li v-for="(item,index) in noticeList" :key="index" v-if="index<5">
            {{item.title}}
            <span>{{item.createTime | dateFormatYmd}}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        checked: true,
        isPwd: true,
        isLogin: true,
        noticeList: [{
          title: '2019春季锦江校区小升初报到通知',
          createTime: 1553702400000
        }, {
          title: '2019春季锦江校区小升初报到通知',
          createTime: 1553702400000
        }, {
          title: '2019春季锦江校区小升初报到通知',
          createTime: 1553702400000
        }, {
          title: '2019春季锦江校区小升初面试成绩公告',
          createTime: 1553702400000
        }, {
          title: '2019春季锦江校区小升初报到通知',
          createTime: 1553702400000
        }, {
          title: '2019春季锦江校区小升初报到通知',
          createTime: 1553702400000
        }, {
          title: '2019春季锦江校区小升初面试录取通知',
          createTime: 1553702400000
        }]
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        var mySwiper = new Swiper('.swiper-container', {
          loop: true,
          autoplay: {
            delay: 8000,//4秒切换一次
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{
    background: #fff;
  }
  .banner {
    height: 420px;
    background: url(~css_img/banner.jpg) no-repeat center;
  }

  .main-wrap {
    padding-top: 58px;
    background: url(~css_img/banner.jpg) no-repeat center;
    position: relative;
    height: 100%;
    .sign-btn {
      width: 168px;
      height: 73px;
      line-height: 73px;
      background: url(~css_img/btn.png) no-repeat center;
      text-align: center;
      position: absolute;
      left: 50%;
      bottom: 50px;
      transform: translateX(-50%);
      a {
        display: block;
        color: #fff;
        font-size: 20px;
      }
    }
    .isSign-btn {
      left: 318px;
      transform: translateX(0);
    }
    .login {
      float: right;
      width: 318px;
      height: 325px;
      background: #fff;
      border-radius: 4px;
      padding: 24px;
      box-sizing: border-box;
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

  .no-p-t {
    padding-top: 0;
  }

  .banner-after {
    background: url(~css_img/banner1.jpg) no-repeat center;
  }

  .fr {
    float: right;
  }

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #c5c5c5;
  }

  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #c5c5c5;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #c5c5c5;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #c5c5c5;
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
    .slide1 {
      background-image: url(~css_img/notice1.jpg);
    }

    .slide2 {
      background-image: url(~css_img/notice1.jpg);
    }

    .slide3 {
      background-image: url(~css_img/notice1.jpg);
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
        i {
          font-size: 12px;
        }
      }
    }
    .notice-list {
      width: 100%;
      li {
        margin-top: 16px;
        cursor: pointer;
        span {
          color: #999;
          font-size: 12px;
          float: right;
        }
      }
    }
  }


</style>
<style lang="less">
  .login {
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333333;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #2f3861;
      border-color: #2f3861;
    }
  }

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
