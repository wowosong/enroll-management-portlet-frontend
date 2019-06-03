<template>
  <div class="progress">
    <div class="rate_hint">
      <div class="hint_img">
        <img src="@/imgs/pass.png" v-if="stempInfo.ifEnter == 1">
        <img src="@/imgs/sh.png" v-if="stempInfo.ifEnter != 1">
      </div>
      <div class="hint_info">

        <!-- 完成报名 -->
        <template v-if="stempInfo.regStatus != 1">
          <p>您于<span class="color1">{{stempInfo.createTime | dateFormatYmd}}</span>完成网上报名，请在<span
            class="color1">“报名信息”</span>页面完善信息~
          </p>
          <p>并按学校通知时间<span class="color1">到校现场确认</span>，打印{{str}}卡~</p>
        </template>

        <!-- 完成测试卡 -->
        <template v-if="stempInfo.regStatus == 1 && stempInfo.ifEnter == null">
          <p>您于<span class="color1">{{stempInfo.modifyTime | dateFormatYmd}}</span>到校办理了{{str}}卡~</p>
          <p>并按{{str}}卡的{{str}}时间到校<span class="color1">参加{{str}}</span>~</p>
        </template>
        <!-- 录取结果-->
        <div v-if="!stempInfo.ifPayment">
          <div v-if="stempInfo.ifEnter == 1">
            <!-- 录取 -->
            <template v-if="!expireFlag">
              <!-- 预约缴费 -->
              <template v-if="!reserveObj">
                <div class="bottomBorder">
                  <div>
                    您于
                    <span class="color1">
                    {{stempInfo.admitTime | dateFormatYmd}}
                  </span>
                    被学校录取
                    <span v-if="stempInfo.scholarship">
                    ，并获得奖学金{{stempInfo.scholarship}}~
                  </span>
                  </div>
                  <div class="over_hint">
                    请在截止时间前完成缴费~
                    <span class="color1">
                    (缴费截止时间：{{stempInfo.paymentDeadline | dateFormatYmd}})
                  </span>
                  </div>
                </div>
                <!--<span class="btn" @click="viewScore()">查看成绩</span>-->
                <div class="bottomBorder"
                     v-if="nowStuInfo && nowStuInfo.scores && nowStuInfo.scores.length">
                  <table class="my-table" v-if="!isPhone">
                    <thead>
                    <tr>
                      <th>{{str}}卡编号</th>
                      <th>姓名</th>
                      <th v-for="stuScore in nowStuInfo.scores">{{stuScore.name}}</th>
                    </tr>
                    </thead>
                    <tr>
                      <td>{{nowStuInfo.signCardCode}}</td>
                      <td>{{nowStuInfo.stuName}}</td>
                      <td v-for="stuScore in nowStuInfo.scores"><span>{{stuScore.testScore}}</span>
                      </td>
                    </tr>
                  </table>
                  <div v-if="isPhone" class="phone_scores">
                    <div><span>{{str}}卡编号：</span>{{nowStuInfo.signCardCode}}</div>
                    <div><span>姓名：</span>{{nowStuInfo.stuName}}</div>
                    <div v-for="(stuScore,index) in nowStuInfo.scores" :key="index"><span>{{stuScore.name}}：</span>{{stuScore.testScore}}
                    </div>
                  </div>
                </div>
                <div>
                  <span style="color: #00ff00">预约线下缴费的时间段</span>（友情提示：为了节省您宝贵的时间，可进行缴费时间预约）
                  <reserve :planId="planId" @serReserve="serReserve"/>
                  <el-button style="width: 200px; position: relative; left: 33%;" size="mini" @click="submit()"
                             type="primary" round>提交
                  </el-button>
                </div>
              </template>

              <!-- 预约缴费成功 -->
              <template v-if="reserveObj">
                <div>
                  <i class="el-icon-circle-check" style="color: #00ff00">
                    请在预约时间段前往学校缴费
                  </i>
                </div>
                <div style="color: #ff0000">
                  {{reserveObj.reserveDate | dateFormatYmd}}&nbsp;{{reserveObj.timeText}}
                </div>
              </template>
            </template>
            <!-- 逾期未缴费 -->
            <template v-if="expireFlag">
              <p>您<span class="color1">逾期未缴费</span>，视为自动放弃录取资格~</p>
            </template>
          </div>
          <!-- 未录取 -->
          <template v-if="stempInfo.ifEnter == 0">
            <div>您<span class="color1">未已被录取</span></div>
            <div class="over_hint">人生的机会还有很多哦...</div>
            <!--<span class="btn" @click="viewScore()">查看成绩</span>-->
            <div v-if="nowStuInfo && nowStuInfo.scores && nowStuInfo.scores.length">
              <table class="my-table" v-if="!isPhone">
                <thead>
                <tr>
                  <th>{{str}}卡编号</th>
                  <th>姓名</th>
                  <th v-for="stuScore in nowStuInfo.scores">{{stuScore.name}}</th>
                </tr>
                </thead>
                <tr>
                  <td>{{nowStuInfo.signCardCode}}</td>
                  <td>{{nowStuInfo.stuName}}</td>
                  <td v-for="stuScore in nowStuInfo.scores"><span>{{stuScore.testScore}}</span>
                  </td>
                </tr>
              </table>
              <div v-if="isPhone" class="phone_scores">
                <div><span>{{str}}卡编号：</span>{{nowStuInfo.signCardCode}}</div>
                <div><span>姓名：</span>{{nowStuInfo.stuName}}</div>
                <div v-for="(stuScore,index) in nowStuInfo.scores" :key="index"><span>{{stuScore.name}}：</span>{{stuScore.testScore}}
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- 缴费成功 -->
        <template v-if="stempInfo.ifPayment == 1 && stempInfo.divideClassesStatus == null">
          <p>您于<span class="color1">{{stempInfo.payTime | dateFormatYmd}}</span>到校完成缴费，缴费金额<span
            class="color1">{{stempInfo.payAmount}}元</span>~
          </p>
          <table class="table_list" v-if="!isPhone">
            <thead>
            <tr>
              <th>{{str}}卡编号</th>
              <th>姓名</th>
              <th>身份证号</th>
              <th>奖学金（元）</th>
              <th>应缴费（元）</th>
            </tr>
            </thead>
            <tr>
              <td>{{stempInfo.signCardCode}}</td>
              <td>{{stempInfo.stuName}}</td>
              <td>{{stempInfo.idCard}}</td>
              <td>{{stempInfo.scholarship}}</td>
              <td>{{stempInfo.payAmount}}</td>
            </tr>
          </table>
          <div v-if="isPhone" class="pay_info">
            <div><span>{{str}}卡编号：</span>{{stempInfo.signCardCode}}</div>
            <div><span>姓名：</span>{{stempInfo.stuName}}</div>
            <div><span>身份证号：</span>{{stempInfo.idCard}}</div>
            <div><span>奖学金(元)：</span>{{stempInfo.scholarship}}</div>
            <div><span>应缴费(元)：</span>{{stempInfo.payAmount}}</div>
          </div>
          <p class="pay_hint">友情提示：若需要退学退费，请线下联系学校财务。</p>
        </template>
        <!-- 分班结果 -->
        <template v-if="stempInfo.divideClassesStatus == 1 && stempInfo.ifReport == null">分班与寝室分配已公布~
          <table class="table_list" v-if="!isPhone">
            <thead>
            <tr>
              <th>{{str}}卡编号</th>
              <th>姓名</th>
              <th>身份证号</th>
              <th>校区</th>
              <th>年级</th>
              <th>所属班级</th>
              <th>所属寝室</th>
            </tr>
            </thead>
            <tr>
              <td>{{stempInfo.signCardCode}}</td>
              <td>{{stempInfo.stuName}}</td>
              <td>{{stempInfo.idCard}}</td>
              <td>{{stempInfo.campusName}}</td>
              <td>{{stempInfo.gradeName}}</td>
              <td>{{stempInfo.className}}</td>
              <td>{{stempInfo.dormitoryName}}</td>
            </tr>
          </table>
          <div v-if="isPhone" class="pay_info">
            <div><span>{{str}}卡编号：</span>{{stempInfo.signCardCode}}</div>
            <div><span>姓名：</span>{{stempInfo.stuName}}</div>
            <div><span>身份证号：</span>{{stempInfo.idCard}}</div>
            <div><span>校区：</span>{{stempInfo.campusName}}</div>
            <div><span>年级：</span>{{stempInfo.gradeName}}</div>
            <div><span>所属班级：</span>{{stempInfo.className}}</div>
            <div><span>所属寝室：</span>{{stempInfo.dormitoryName}}</div>
          </div>
        </template>
        <!-- 报到成功 -->
        <template v-if="stempInfo.ifReport == 1">您于<span class="color1">{{stempInfo.modifyTime | dateFormatYmd}}</span>完成到校报到注册手续~
        </template>
        <!-- 逾期未报到 -->
        <template v-if="false">您<span class="color1">逾期未到学校报到</span>，视为自动放弃入学资格~</template>
      </div>

      <!-- 填写报到信息 -->
      <template v-if="stempInfo.ifReport == 1">请按学校通知时间<span class="color1">到校报到</span>，并<span
        class="color1">填写报到信息</span>~
        <!-- <reportInfo></reportInfo> -->
      </template>
    </div>
    <!--成绩-->

    <el-dialog title="查看成绩" :visible.sync="scoreDialogVisible" :width="isPhone ? '100%' : '800px'">
      <div v-if="isPhone" class="phone_scores">
        <div><span>{{str}}卡编号：</span>{{nowStuInfo.signCardCode}}</div>
        <div><span>姓名：</span>{{nowStuInfo.stuName}}</div>
        <div v-for="(stuScore,index) in nowStuInfo.scores" :key="index"><span>{{stuScore.name}}：</span>{{stuScore.testScore}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="scoreDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import reserve from "./reserve_comp"
  import reportInfo from "./report_info"

  export default {
    data() {
      return {
        stempInfo: {},
        formData: {
          dataTime: '',
          timeRang: ''
        },
        erRegister: {
          id: '',
          paymentReserve: ''
        },
        tableQuery: {
          page: 1,
          size: 10,
          filter: {
            regId: ""
          }
        },
        scoreDialogVisible: false,
        nowStuInfo: {},
        rules: {
          dataTime: []
        },
        planId: "",
        reserveObj: null,
        expireFlag: false,
        planInfo:{},
        str:''
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
      },
    },
    mounted() {
      if(this.$store.state.userInfo.id){
        this.query();
        this.viewScore();
      }

    },
    components: {
      reserve,
      reportInfo
    },
    methods: {
      serReserve(id) {
        const vm = this;
        let obj = {
          id: vm.stempInfo.id,
          paymentReserve: id,
        }
        http.post("/gateway/enroll/erPayment/reserve", obj).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.getReserve(id)
        });
      },
      getReserve(id) {
        const vm = this;
        http.get("/gateway/enroll/erPayment/reserve/" + id).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.reserveObj = xhr.data.data;

        });
      },
      query() {
        let vm = this;
        let idCard = window.userInfo.idCard;
        http.get("/gateway/enroll/api/erRegister/admissionsProgress/" + idCard).then((xhr) => {
          if (xhr.code) {
            return;
          }
          vm.stempInfo = xhr.data;
          vm.getPlanInfo();
          vm.expireFlag = false
          if (vm.stempInfo.paymentDeadline) {
            vm.expireFlag = new Date(vm.stempInfo.paymentDeadline).getTime() + (24 * 60 * 60 * 1000) < new Date().getTime();
          }
          vm.planId = xhr.data.planId;
          if (vm.stempInfo.paymentReserve) {
            vm.getReserve(vm.stempInfo.paymentReserve);
          }
        });
      },
      getPlanInfo() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erEnrollPlan/" + vm.stempInfo.planId).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.planInfo = xhr.data.data;
          if(xhr.data.data.phaseName == '高中'){
            vm.str = '测试'
          }else{
            vm.str = '面谈'
          }
        });
      },
      submit() {
        let vm = this;
        if (vm.formData.dataTime != '' && vm.formData.timeRang != '') {

          vm.erRegister.id = vm.stempInfo.id;
          vm.erRegister.paymentReserve = moment(vm.formData.dataTime).format('YYYY-MM-DD')
            + '  ' + moment(vm.formData.timeRang[0]).format('HH:mm:ss') + '~' + moment(vm.formData.timeRang[1]).format('HH:mm:ss');

          http.put("/gateway/enroll/api/erRegister/updatePayTime", vm.erRegister).then((xhr) => {
            if (xhr.data.code) {
              return;
            }
            vm.query();
          })
        } else {
          vm.$message({
            message: "请填写缴费时间!",
            type: "warning"
          });
        }
      },
      viewScore() {
        let vm = this;
        // vm.scoreDialogVisible = true;
        vm.tableQuery.filter.regId = vm.stempInfo.id;
        let obj = $.extend({}, vm.tableQuery, {
          filter: eduFilterParam(vm.tableQuery.filter)
        });
        http.get("/gateway/enroll/api/erEnter/page", {params: obj}).then(function (xhr) {
          vm.tableData = xhr.data;
          if (vm.tableData.aaData && vm.tableData.aaData.length > 0) {
            vm.nowStuInfo = vm.tableData.aaData[0];
          }
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  .block {
    display: block;
  }

  .progress {
    padding: 40px 20px 20px 60px;
  }

  .rate_hint {
    font-size: 16px;
    .hint_img {
      float: left;
    }
    img {
      width: 20px;
    }
    .hint_info {
      margin-left: 40px;
      line-height: 26px;
    }
  }

  .color1 {
    color: #aa2f33;
  }

  .btn {
    width: 95px;
    line-height: 30px;
    text-align: center;
    // background: #aa2f33;
    color: #aa2f33;
    border: 1px solid #aa2f33;
    border-radius: 4px;
    margin: 0 auto;
    display: inline-block;
    // margin-left: 10px;
    cursor: pointer;
  }

  .btn:hover,
  .sub_btn {
    background: #aa2f33;
    color: #fff;
  }

  .sub_btn {
    margin-left: 300px;
    margin-top: 40px;
  }

  .table_list {
    width: 100%;
    margin: 20px 0;
    thead {
      background: #f7f7f7;
      color: #999;
    }
    td, th {
      height: 48px;
      border: 1px solid #ddd;
      text-align: center;
    }
  }

  .pay_hint {
    text-align: right;
    color: #666;
  }

  .my-table {
    width: 100%;
    max-width: 100%;
    border: 1px solid #e5e7ea;
    font-size: 12px;
    table-layout: fixed;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    text-align: center;
  }

  .my-table {
    border-bottom: none;
    border-right: none;
  }

  .my-table td, th {
    border-right: 1px solid #e5e7ea;
    border-bottom: 1px solid #e5e7ea;
  }

  .my-table thead th {
    background-color: #f0f4fa;
    font-size: 14px;
    color: rgb(51, 51, 51);
  }

  .my-table th {
    padding: 10px;
  }

  .my-table td {
    padding: 12px;
  }

  .my-table tr:nth-child(2n) td {
    background: #fafafa;
  }
</style>
<style lang="less" scoped>
  //warp
  .bottomBorder {
    border-bottom: 1px #e5e7ea solid;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .is_phone {
    .block {
      display: inline;
    }
    .block::before {
      content: '，';
    }
    .progress {
      padding: 50px 20px;
    }
    .rate_hint {
      text-align: center;
      .hint_info {
        margin-left: 0;
      }
      .hint_img {
        float: none;
        text-align: center;
      }
      img {
        width: 68px;
        margin-bottom: 30px;
      }
      .over_hint {
        color: #999;
        font-size: 14px;
      }
    }
    .btn {
      width: 50%;
      line-height: 30px;
      color: #2f3861;
      border: 1px solid #2f3861;
      border-radius: 4px;
      margin: 0 auto;
      display: block;
      margin-top: 10px;
    }
    .phone_scores {
      & > div {
        margin: 5px 0;
        text-align: left;
        span {
          display: inline-block;
          width: 88px;
          text-align: right;
        }
      }
    }
    .pay_info {
      border: 1px solid #eee;
      & > div {
        border-bottom: 1px solid #eee;
        text-align: left;
        padding: 5px 0;
        span {
          display: inline-block;
          width: 110px;
          text-align: right;
        }
      }
      & > div:last-child {
        border-bottom: none;
      }
    }
  }
</style>
