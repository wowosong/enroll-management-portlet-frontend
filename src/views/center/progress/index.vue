<template>
  <div class="progress">
    <div class="rate_hint">
      <div class="hint_img">
        <img src="@/imgs/pass.png" v-if="stempInfo.ifEnter == 1">
        <img src="@/imgs/sh.png" v-if="stempInfo.ifEnter != 1">
      </div>
      <div class="hint_info">
        <template v-if="stempInfo.ifEnter == null">报名<span class="color1">成功</span>，请按学校通知时间到校现场确认，并参加面试（笔试）~</template>
        <div v-if="stempInfo.ifPayment != 1">
          <template v-if="stempInfo.ifEnter == 1">
            <div>您<span class="color1">已被录取</span><span class="block">请在截止时间前完成缴费~</span></div>
            <div class="over_hint">缴费截止时间：2019-06-10</div>
            <span class="btn" @click="viewScore()">查看成绩</span>

            <div v-if="!reserveObj">
              <!--<el-form-item label="预约缴费时间段:" prop="dataTime" required>-->
              <!--<el-date-picker-->
              <!--v-model="formData.dataTime"-->
              <!--type="date"-->
              <!--placeholder="选择日期" style="width:180px">-->
              <!--</el-date-picker>-->
              <!--<el-time-picker-->
              <!--is-range-->
              <!--v-model="formData.timeRang"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始时间"-->
              <!--end-placeholder="结束时间"-->
              <!--placeholder="选择时间范围" style="width:360px">-->
              <!--</el-time-picker>-->
              <!--</el-form-item>-->
              <span style="color: #00ff00">预约线下缴费的时间段</span>（友情提示：为了节省您宝贵的时间，可进行缴费时间预约）
              <reserve :planId="planId" @serReserve="serReserve"/>
              <el-button style="width: 200px; position: relative; left: 33%;" size="mini" @click="submit()"
                         type="primary" round>提交
              </el-button>
            </div>
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
          <template v-if="stempInfo.ifEnter == 0">
            <div>您<span class="color1">未已被录取</span></div>
            <div class="over_hint">人生的机会还有很多哦...</div>
            <span class="btn" @click="viewScore()">查看成绩</span>
          </template>
        </div>
        <template v-if="stempInfo.ifPayment == 1 && stempInfo.divideClassesStatus == null">
          恭喜您，缴费成功！<span>{{stempInfo.payAmount}} 元</span>
          <table class="table_list">
            <thead>
            <tr>
              <th>报名卡号</th>
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
          <p class="pay_hint">友情提示：若需要退学退费，请线下联系学校财务。</p>

        </template>
        <template v-if="stempInfo.divideClassesStatus == 1 && stempInfo.ifReport == null">分班与寝室分配已公布~
          <table class="table_list">
            <thead>
            <tr>
              <th>报名卡编号</th>
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
        </template>
        <template v-if="stempInfo.ifReport == 1">请按学校通知时间到校报到，并填写报到信息~
          <div class="btn sub_btn">填写报到信息</div>
        </template>
      </div>
    </div>
    <!--成绩-->

    <el-dialog title="查看成绩" :visible.sync="scoreDialogVisible" width="800px">
      <table class="my-table">
        <thead>
        <tr>
          <th>报名卡编号</th>
          <th>姓名</th>
          <th v-for="stuScore in nowStuInfo.scores">{{stuScore.name}}</th>
        </tr>
        </thead>
        <tr>
          <td>{{nowStuInfo.signCardCode}}</td>
          <td>{{nowStuInfo.stuName}}</td>
          <td
            v-for="stuScore in nowStuInfo.scores"><span>{{stuScore.testScore}}</span>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="scoreDialogVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import reserve from "./reserve_comp"

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
      }
    },
    mounted() {
      this.query()
    },
    components: {
      reserve,
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
      getReserve(id){
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
          vm.stempInfo = xhr.data
          vm.planId = xhr.data.planId;
          if (vm.stempInfo.paymentReserve) {
            vm.getReserve(vm.stempInfo.paymentReserve);
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
        vm.scoreDialogVisible = true;
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
  }
</style>
