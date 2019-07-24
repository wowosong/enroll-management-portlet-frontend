<template>
  <div class="comm_main clearfix" :class="{is_has_child:tabIndex != null}">
    <div class="title" v-if="$route.query && !$route.query.enroll">
      <span @click="goback"></span>
      {{title}}
    </div>
    <div class="user_info">
      <img v-if="userInfo.accountAvatar" :src="avatar_url + accountAvatar">
      <img v-else src="@/imgs/avatar1.png">
      <p>{{userName}}</p>
    </div>
    <div class="comm_item float_left">
      <div class="center_tabs clearfix">
        <span @click="tabIndexFn(0)" :class="{active:tabIndex == 0}"><img src="@/imgs/warp/center_tab1.png">{{titleList[0]}}</span>
        <span @click="tabIndexFn(1)" :class="{active:tabIndex == 1}"><img src="@/imgs/warp/center_tab2.png">{{titleList[1]}}</span>
        <span v-if="regInfo.ifPayment == 1" @click="tabIndexFn(2)" :class="{active:tabIndex == 2}"><img src="@/imgs/warp/center_tab1.png">{{titleList[2]}}</span>
        <span @click="tabIndexFn(3)" :class="{active:tabIndex == 3}"><img src="@/imgs/warp/center_tab3.png">{{titleList[3]}}</span>
        <div class="tab_active_border" :style="'left:'+left+'px'"></div>
      </div>
      <signUpWidget v-if="tabIndex == 0" @changeTitle="changeTitle" ref="signUp"></signUpWidget>
      <progressWidget v-if="tabIndex == 1" @changeTab="changeTab"></progressWidget>
      <!--校服登记-->
      <schooluniformWidget v-if="tabIndex == 2"></schooluniformWidget>
      <accountWidget v-if="tabIndex == 3"></accountWidget>
    </div>
    <div class="comm_item float_right">
      <div class="campus_tit">嘉祥官网</div>
      <div class="campus_list">http://www.jxfls.com</div>
      <!-- <div class="no_data"></div> -->
    </div>
  </div>
</template>
<script>
  import progressWidget from './progress/index'
  import signUpWidget from './sign_up/index'
  import schooluniformWidget from './schooluniform/index'
  import accountWidget from './account/index'

  export default {
    components: {
      progressWidget,
      signUpWidget,
      accountWidget,
      schooluniformWidget
    },
    data() {
      return {
        tabIndex: 0,
        left: 30,
        title: '个人中心',
        titleList: ['报名信息', '招生进度', '校服登记', '账号安全'],
        userName: userInfo.userName,
        avatar_url: window.systemParameter.FILE_SYSTEM_URL + "/file/thumbnail/",
        accountAvatar: userInfo.accountAvatar,
        regId: '',
        regInfo:{}
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
      },
      userInfo: function () {
        return this.$store.state.userInfo
      },
    },
    mounted() {
      if (this.isPhone) {
        this.tabIndex = null
        $("#app>div").addClass("phone_center")
      }
      let progress = this.$route.query ? this.$route.query.progress : false //是否直接显示招生进度
      if (progress) {
        this.tabIndex = 1
      }
      if (this.$route.query && this.$route.query.enroll) {
        this.tabIndex = 0
      }
      this.tabIndexFn(this.tabIndex);
      this.init();
    },
    methods: {
      init() {
        const vm = this;
        http.get("/gateway/enroll/api/erRegister/byPhone", {params: {phoneNum: window.userInfo.idCard}}).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.regId = xhr.data.data.regId;
          localStorage.regid =  xhr.data.data.regId;
          vm.getReg();
        })
      },
      getReg() {
        const vm = this;
        http.get("/gateway/enroll/api/erRegister/Clothes/" + vm.regId).then((xhr) => {
          if (xhr.code) return;
          vm.regInfo = xhr.data;
        });
      },
      tabIndexFn(index) {
        let tempIndex = index;
        if (index != null) {
          if(this.regInfo.ifPayment != 1 && tempIndex == 3){
            tempIndex = tempIndex - 1;
          }
          this.tabIndex = index
          this.left = tempIndex * 132 + 30
          this.title = this.titleList[index]
        }
      },
      goback() {//判断是返回上一页还是显示tab首页
        if (this.tabIndex == 0 && this.title != '报名信息') {
          this.title = '报名信息'
          this.$refs.signUp.goBackFn()
        } else {
          this.tabIndex = this.tabIndex != null ? null : this.$router.back(-1)
        }
      },
      changeTitle(data) {
        this.title = data;
        if (this.isPhone) {
          this.tabIndex = null;
        }
      },
      changeTab(){
       this.tabIndexFn(2)
      },
    },
    destroyed() {
      if (this.isPhone) {
        $("#app>div").removeClass("phone_center")
      }
    }
  }
</script>

<style scoped lang="less">
  .float_left {
    min-height: 100%;
  }

  .user_info, .title {
    display: none;
  }

  .campus_list {
    padding: 12px 20px 10px 20px;
    color: #666;
    cursor: pointer;
  }

  .campus_list:hover {
    color: #aa2f33;
  }

  .campus_tit {
    border-left: 4px solid #aa2f33;
    padding-left: 16px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    line-height: 16px;
  }

  .center_tabs {
    border-bottom: 1px solid #E6E6E6;
    font-size: 18px;
    color: #999;
    position: relative;
    padding: 10px 0 30px 0;
    span {
      margin: 0 30px;
      cursor: pointer;
      float: left;
      img {
        display: none;
      }
    }
    span.active,
    span:hover {
      color: #333;
    }
    .tab_active_border {
      position: absolute;
      bottom: 0;
      border-bottom: 2px solid #333;
      width: 70px;
      left: 30px;
      transition: left .3s;
    }
  }
</style>
<style lang="less" scoped>
  //warp版本
  .is_phone {
    .comm_main {
      background: #fff;
    }
    .float_right {
      display: none;
    }
    .user_info {
      text-align: center;
      padding: 20px;
      border-bottom: 10px solid #eee;
      display: block;
      img {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        border: 2px solid #eee;
      }
      p {
        margin-top: 15px;
      }
    }
    .float_left {
      padding: 0;
      min-height: auto;
    }
    .center_tabs {
      border-bottom: none;
      span {
        display: block;
        border-bottom: 1px solid #eee;
        float: none;
        margin: 0;
        margin-left: 16px;
        height: 60px;
        line-height: 60px;
        color: #333;
        background: url(~@/imgs/warp/right.png) no-repeat;
        background-position: 94% center;
        background-size: 6px 11px;
        img {
          width: 23px;
          vertical-align: middle;
          margin-right: 10px;
          display: inline-block;
        }
      }
      .tab_active_border {
        display: none;
      }
    }
    .title {
      background: #2f3861;
      text-align: center;
      position: relative;
      height: 45px;
      line-height: 45px;
      color: #fff;
      font-size: 16px;
      display: block;
      span {
        background: url(~@/imgs/warp/back.png) no-repeat center;
        background-size: 11px 20px;
        position: absolute;
        top: 0;
        left: 5px;
        width: 45px;
        height: 45px;
      }
    }
    .is_has_child {
      .user_info, .center_tabs {
        display: none;
      }
    }
  }
</style>
<style lang="less">
  //warp版本
  .is_phone {
    .phone_center {
      .header, .footer {
        display: none;
      }
    }
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #2f3861;
  }
  .el-radio__input.is-checked .el-radio__inner{
    background: #2f3861;
    border-color: #2f3861;
  }
</style>
