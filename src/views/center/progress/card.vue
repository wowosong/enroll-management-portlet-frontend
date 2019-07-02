<template>
  <div class="print-box">
    <!--<el-button @click="print" class="print-btn">打印</el-button>-->
    <div class="print-item">
      <div class="m-a">
        <div class="title-wrap">
          <div class="title">
            <div class="logo"><img src="~css_img/logo1.png"></div>
            <div v-if="planInfo.planSn">
              <span v-html="planInfo.planSn.replace(/#/g, '<p>')"/>
            </div>
          </div>
        </div>
        <table class="confirm_table">
          <tbody>
          <tr>
            <td class="f-th">编号</td>
            <td  colspan="3">{{regInfo.signCardCode}}</td>
            <td rowspan="4" style="padding: 0;width: 140px">
              <img v-if="regInfo.photoId" :src="fileUrl + '/file/thumbnail/' + regInfo.photoId"
                   @error="errorImg($event,'image')" width="100%" style="height: 164px">
            </td>
          </tr>
          <tr>
            <td class="f-th">姓名</td>
            <td>{{regInfo.stuName}}</td>
            <td class="f-th">性别</td>
            <td>{{genderMap[regInfo.stuGender]}}</td>
          </tr>
          <tr>
            <td class="f-th">身份证号</td>
            <td colspan="3">{{regInfo.idCard}}</td>
          </tr>
          <tr>
            <td class="f-th">生源类型</td>
            <td>{{regInfo.localTypeStr}}</td>
            <td class="f-th">报名年级</td>
            <td>{{planInfo.gradeName}}</td>
          </tr>
          <tr v-for="i in 2">
            <td class="f-th">监护人{{i}}</td>
            <td>{{regInfo.parents[i-1]["s_g"]}}</td>
            <td class="f-th">手机</td>
            <td colspan="2">{{regInfo.parents[i-1]["s_h"]}}</td>
          </tr>
          <tr>
            <td class="f-th">现就读学校</td>
            <td colspan="4">{{regInfo.nowSchool}}</td>
          </tr>
          <tr v-if="planInfo.phaseName != '高中'">
            <td class="f-th">志愿复核</td>
            <td colspan="4">{{regInfo.otherData.s_q}}</td>
          </tr>
          <tr>
            <td class="f-th">
              {{(planInfo.phaseName != '高中'?"面谈":"测试")}}时间
            </td>
            <td colspan="4">{{regInfo.otherData.s_r}}</td>
          </tr>
          <tr>
            <td class="f-th">监护人承诺</td>
            <td colspan="4" style="line-height: 26px;padding: 20px">{{planInfo.custodianWord}}</td>
          </tr>
          <tr>
            <td class="f-th">监护人签字</td>
            <td></td>
            <td class="f-th">打印时间</td>
            <td colspan="2">{{now | dateFormatYmdHm}}</td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
    <div class="line"></div>
    <div class="print-item">
      <div class="m-a">
        <div class="title-wrap">
          <div class="title">
            <div class="logo"><img src="~css_img/logo1.png"></div>
            <div v-if="planInfo.planSn">
              <span v-html="planInfo.planSn.replace(/#/g, '<p>')"/>
            </div>
          </div>
        </div>
        <table class="confirm_table">
          <tbody>
          <tr>
            <td class="f-th">编号</td>
            <td colspan="3">{{regInfo.signCardCode}}</td>
            <td rowspan="4" style="padding: 0;width: 140px">
              <img v-if="regInfo.photoId" :src="fileUrl + '/file/thumbnail/' + regInfo.photoId"
                   width="100%"
                   style="height: 164px">
            </td>
          </tr>
          <tr>
            <td class="f-th">姓名</td>
            <td>{{regInfo.stuName}}</td>
            <td class="f-th">性别</td>
            <td>{{genderMap[regInfo.stuGender]}}</td>
          </tr>
          <tr>
            <td class="f-th">身份证号</td>
            <td colspan="3">{{regInfo.idCard}}</td>
          </tr>
          <tr>
            <td class="f-th">生源类型</td>
            <td>{{regInfo.localTypeStr}}</td>
            <td class="f-th">报名年级</td>
            <td>{{planInfo.gradeName}}</td>
          </tr>
          <tr>
            <td class="f-th">
              {{(planInfo.phaseName != '高中'?"面谈":"测试")}}时间
            </td>
            <td colspan="4">{{regInfo.otherData["s_r"]}}</td>
          </tr>
          <tr>
            <td class="f-th">须知</td>
            <td colspan="4" style="line-height: 26px;padding: 20px"><span v-html="planInfo.planRemark"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      planId:{
        type:String,
        default:''
      },
      regId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        now: new Date(),
        guardianPromise: "我确认：交给学校的《报名信息单》，信息准确无误，并与成都市招办“小升初网络应用服务平台”上的信息一致，否则，我愿意为此承担一切相关的责任。",
        fileUrl: window.systemParameter.FILE_SYSTEM_URL,
        genderMap: {
          0: "未知的性别",
          1: "男",
          2: "女",
          9: "未说明的性别"
        },
        planInfo: {},
        regInfo: {
          otherData: {},
          parents: [
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""}
          ],
          rewards: [
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""}
          ]
        },
      };
    },
    mounted() {
      let vm = this;
      if (!vm.planId || !vm.regId) {
        vm.planInfo = {};
        vm.regInfo = {
          otherData: {},
          parents: [
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""}
          ],
          rewards: [
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""}
          ]
        };
        return;
      }
      vm.getPlanInfo();
      vm.getRegView();
    },
    methods: {
      getPlanInfo() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erEnrollPlan/" + vm.planId).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.planInfo = xhr.data.data;
          vm.planInfo.planRemark = vm.planInfo.planRemark.replace(/[\n\r]/g, "<br>");
        });
      },
      getRegView() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erRegister/view/" + vm.regId).then((xhr) => {
          if (xhr.code) {
            return;
          }
          let data = xhr.data;
          data.tagStrlist = [];
          for (let i = 0; i < 2; i++) {
            if (!data.parents[i]) {
              data.parents[i] = {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""};
            }
          }
          vm.regInfo = data;
          if (!vm.regInfo.otherData) {
            vm.regInfo.otherData = {};
          }
        });
      },
      //  打印
      print() {
        window.print();
      }
    }
  };
</script>
<style lang="less" scoped>
  .print-box {
    width: 900px;
    display: none;
    padding: 50px;
    .title-wrap {
      text-align: center;
      font-size: 30px;
      margin-bottom: 20px;
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #30385c;
        font-family: "NSimSun";
        font-weight: bold;
        .logo {
          width: 70px;
          height: 77px;
          margin-right: 20px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      p {
        color: #000;
        font-size: 28px;
      }
    }
  }

  .print-item {
    border: 1px solid #cccccc;
    background: rgba(255, 255, 255, 0.5) url("~css_img/card-bg.png") no-repeat center center;
    .m-a {
      margin: 20px 40px 20px;
    }
  }

  .print-item:last-child {
    background-size: 320px;
  }

  .confirm_table {
    width: 100%;

    td {
      font-size: 18px;
      height: 40px;
      border: 1px solid #cbc7c7;
      padding: 0 32px;
      color: #333;
    }
    .f-th {
      width: 128px;
      background: #fbfbfb;
      color: #000;
      text-align: center;
      padding: 0;
    }
  }

  .line {
    border-bottom: 2px dashed #e5e7ea;
    margin: 20px 0;
  }

</style>
<style lang="less">
  @media print {
    .progress,.header, .footer,.center_tabs,.float_right {
      display: none;
    }
    .comm_main{
      width: 900px;
      margin-top: 0;
    }
    .float_left{
      width: 100%;
      padding: 0;
    }
    .print-box {
      display: block !important;
      background: #fff;
    }
  }

  @page {
    size: A4;
    margin: 0;
  }

</style>
