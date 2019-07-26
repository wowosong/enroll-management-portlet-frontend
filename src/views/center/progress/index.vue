<template>
  <div>
    <div class="progress" v-loading="isLoading">
      <div class="rate_hint">
        <div class="hint_img">
          <img src="@/imgs/pass.png" v-if="stempInfo.ifEnter == 1">
          <img src="@/imgs/sh.png" v-if="stempInfo.ifEnter != 1">
        </div>
        <div class="hint_info">

          <!-- 完成报名 -->
          <template v-if="stempInfo.regStatus != 1">
            <p class="text-left">您于<span class="color1">{{stempInfo.createTime | dateFormatYmd}}</span>完成网上报名，请在<span
              class="color1">“报名信息”</span>页面完善信息~
            </p>
            <p class="text-left">并按学校通知时间<span class="color1">到校现场确认</span>，打印{{str}}卡~</p>
          </template>

          <!-- 完成测试卡 -->
          <template v-if="stempInfo.regStatus == 1 && stempInfo.ifEnter == null">
            <p class="text-left">您于<span class="color1">{{stempInfo.modifyTime | dateFormatYmd}}</span>到校办理了{{str}}卡~
            </p>
            <p class="text-left">并按{{str}}卡的{{str}}时间到校<span class="color1">参加{{str}}</span>~</p>
            <span v-if="!isPhone" class="uniform-btn m-t" @click="print">打印面谈卡</span>
          </template>
          <!-- 录取结果-->
          <div v-if="!stempInfo.ifPayment">
            <div v-if="stempInfo.ifEnter == 1">
              <!-- 录取 -->
              <template v-if="!expireFlag">
                <!-- 预约缴费 -->
                <template v-if="!reserveObj">
                  <div class="bottomBorder">
                    <div class="text-left">
                      您于
                      <span class="color1">
                    {{stempInfo.admitTime | dateFormatYmd}}
                  </span>
                      被学校录取
                      <span v-if="stempInfo.scholarship">
                    ，并获得本学年奖学金{{stempInfo.scholarship}}元~
                  </span>
                    </div>
                    <div class="text-left font-12" v-if="stempInfo.remark">备注：{{stempInfo.remark}}</div>
                    <div class="over_hint text-left">
                      请在截止时间前完成缴费~
                      <span class="color1">
                    (缴费截止时间：{{stempInfo.paymentDeadline | dateFormatYmd}})
                  </span>
                    </div>
                  </div>
                  <!--成绩-->
                  <div class="score-wrap" v-if="nowStuInfo.isShowScore == 1">
                    <div class="score-header bottomBorder">
                      <span class="score-txt">成绩</span>
                    </div>
                    <!--h5-->
                    <el-form label-width="120px" label-position="left" v-if="isPhone">
                      <el-form-item label="姓名：">{{nowStuInfo.stuName}}</el-form-item>
                      <el-form-item label="身份证/护照号：">{{nowStuInfo.idCard}}</el-form-item>
                      <template v-for="(stuScore,index) in nowStuInfo.scores">
                        <el-form-item :label="stuScore.name">{{stuScore.testScore}}</el-form-item>
                      </template>
                    </el-form>
                    <!--pc-->
                    <table class="my-table" v-if="!isPhone">
                      <thead>
                      <tr>
                        <th>姓名</th>
                        <th width="160px">身份证/护照号</th>
                        <th v-for="(stuScore,index) in nowStuInfo.scores" :key="index">
                          {{stuScore.name}}
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>{{nowStuInfo.stuName}}</td>
                        <td>{{nowStuInfo.idCard}}</td>
                        <td v-for="(stuScore,index) in nowStuInfo.scores" :key="index">
                          {{stuScore.testScore}}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--缴费-->
                  <div class="score-wrap">
                    <div class="score-header bottomBorder">
                      <span class="score-txt">缴费:请选择支付方式</span>
                      <el-radio-group v-model="isOnLine">
                        <el-radio v-if="planInfo.onLine" label="onLine">在线缴费</el-radio>
                        <el-radio v-if="planInfo.underLine" label="underLine">线下缴费</el-radio>
                      </el-radio-group>
                      <span class="down-file" v-if="false">点击下载《缴费标准》</span>
                    </div>
                    <div class="pay-tips text-left">
                      <span class="color1">缴费金额</span>
                    </div>
                    <!--h5-->
                    <el-form label-width="120px" label-position="left" v-if="isPhone">
                      <el-form-item label="姓名：">{{nowStuInfo.stuName}}</el-form-item>
                      <el-form-item label="身份证/护照号：">{{nowStuInfo.idCard}}</el-form-item>
                      <el-form-item label="本学年奖学金：">{{nowStuInfo.scholarship || 0}}</el-form-item>
                      <el-form-item label="应缴费：">{{nowStuInfo.assessment || 0}}</el-form-item>
                    </el-form>
                    <!--pc-->
                    <table class="my-table" v-if="!isPhone">
                      <thead>
                      <tr>
                        <th>姓名</th>
                        <th>身份证/护照号</th>
                        <th>本学年奖学金(元)</th>
                        <th>应缴费(元)</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>{{nowStuInfo.stuName}}</td>
                        <td>{{nowStuInfo.idCard}}</td>
                        <td>{{nowStuInfo.scholarship || 0}}</td>
                        <td>{{nowStuInfo.assessment || 0}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <template v-if="isOnLine == 'underLine'">
                      <div class="pay-tips text-left">
                        <span class="color1">预约线下缴费的时间段</span>（友情提示：为了节省您宝贵的时间，可进行缴费时间预约）
                      </div>
                      <reserve :planId="planId" @serReserve="serReserve"/>
                    </template>
                    <div class="sign-btn">
                      <template v-if="isOnLine == 'underLine'">
                        <button class="save" @click="submit">提交预约</button>
                      </template>
                      <template v-else>
                        <div class="agreement">
                          <a @click="payDialog = true">点击查看《在线缴费须知》</a>
                          <a target="_blank" href="http://openhome.cmbchina.com/pay/H5Pay/AppIntro/SceneIntro.aspx">点击查看《招行一网通介绍》</a>
                          <el-checkbox v-model="isAgree">我已同意并了解《在线缴费须知》事项。</el-checkbox>
                        </div>
                        <template v-if="isPhone">
                          <button :disabled="!isAgree" :class="['save',{'disabled':!isAgree}]" @click="getAgrNo('h5')">
                            在线支付
                          </button>
                        </template>
                        <template v-if="!isPhone">
                          <button :disabled="!isAgree" :class="['save',{'disabled':!isAgree}]" @click="getAgrNo('web')">
                            在线支付
                          </button>
                        </template>
                      </template>
                    </div>
                  </div>
                </template>

                <!-- 预约缴费成功 -->
                <template v-if="reserveObj">
                  <div class="text-left">
                    <i class="el-icon-circle-check" style="color: #00ff00">
                      请在预约时间段前往学校缴费
                    </i>
                  </div>
                  <div class="text-left" style="color: #ff0000">
                    {{reserveObj.reserveDate | dateFormatYmd}}&nbsp;{{reserveObj.timeText}}
                  </div>
                </template>
              </template>
              <!-- 逾期未缴费 -->
              <template v-if="expireFlag">
                <p class="text-left">您<span class="color1">逾期未缴费</span>，视为自动放弃录取资格~</p>
              </template>
            </div>
            <!-- 未录取 -->
            <template v-if="stempInfo.ifEnter == 0">
              <div class="text-left">您<span class="color1">未被录取</span></div>
              <div class="over_hint text-left">人生的机会还有很多哦...</div>
              <!--<span class="btn" @click="viewScore()">查看成绩</span>-->
              <!--  未录取,并且显示成绩开关==1 显示成绩 -->
              <!--成绩-->
              <div class="score-wrap" v-if="nowStuInfo.isShowScore == 1">
                <div class="score-header bottomBorder">
                  <span class="score-txt">成绩</span>
                </div>
                <!--h5-->
                <el-form label-width="120px" label-position="left" v-if="isPhone">
                  <el-form-item label="姓名：">{{nowStuInfo.stuName}}</el-form-item>
                  <el-form-item label="身份证/护照号：">{{nowStuInfo.idCard}}</el-form-item>
                  <template v-for="(stuScore,index) in nowStuInfo.scores">
                    <el-form-item :label="stuScore.name">{{stuScore.testScore}}</el-form-item>
                  </template>
                </el-form>
                <!--pc-->
                <table class="my-table" v-if="!isPhone">
                  <thead>
                  <tr>
                    <th>姓名</th>
                    <th width="160px">身份证/护照号</th>
                    <th v-for="(stuScore,index) in nowStuInfo.scores" :key="index">
                      {{stuScore.name}}
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>{{nowStuInfo.stuName}}</td>
                    <td>{{nowStuInfo.idCard}}</td>
                    <td v-for="(stuScore,index) in nowStuInfo.scores" :key="index">
                      {{stuScore.testScore}}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
          <!-- 缴费成功 -->
          <template v-if="stempInfo.ifPayment == 1 && stempInfo.divideClassesStatus != 1 && stempInfo.startReportInfo != 1">
            <p class="bottomBorder text-left">您<span v-if="stempInfo.payTime == null">已</span><span v-if="stempInfo.payTime != null">于</span><span class="color1">{{stempInfo.payTime | dateFormatYmd}}</span>到校完成缴费，缴费金额<span
              class="color1">{{stempInfo.payAmount || 0}}元</span>，请及时完成
              <span class="color1">校服登记</span>~
              <span class="uniform-btn" @click="changeTab">校服登记</span>
            </p>
            <div class="pay_info">
              <div><span>姓名：</span>{{stempInfo.stuName}}</div>
              <div><span>身份证/护照号：</span>{{stempInfo.idCard}}</div>
              <div><span>本学年奖学金：</span>{{stempInfo.scholarship || 0}}元</div>
              <div><span>实际缴费：</span>{{stempInfo.payAmount || 0}}元</div>
              <template v-if="stempInfo.paymentType == 1">
                <div><span>订单号：</span>{{stempInfo.orderNumber}}</div>
                <div><span>交易流水号：</span>{{stempInfo.paymentNum}}</div>
                <div><span>订单交易时间：</span>{{stempInfo.payTime | dateFormatYmdHm}}</div>
              </template>
            </div>
            <p class="pay_hint" style="text-align: left">(友情提示：若需要退学退费，请线下联系学校财务)</p>
          </template>
          <!-- 分班结果 -->
          <template v-if="stempInfo.divideClassesStatus == 1 && stempInfo.ifReport != 1 ">
            <div v-if="!isPhone" class="fb-box">
            您的班级信息: <span class="color1 fbgl" v-if="stempInfo.className != ''">{{stempInfo.className}}</span> <span class="color1 fbgl" v-if="stempInfo.className == ''">暂未分班</span> 您的寝室信息: <span class="color1">{{stempInfo.dormitoryName}}</span>
             </div>
             <div v-if="isPhone" class="fb-box">
               <p>您的班级信息: <span class="color1">{{stempInfo.className}}</span></p>
               <p>您的寝室信息: <span class="color1">{{stempInfo.dormitoryName}}</span></p>
             </div>
          </template>
          <!-- <template v-if="stempInfo.divideClassesStatus == 1 && stempInfo.ifReport != 1  ">分班与寝室分配已公布~
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
          </template> -->
          <!-- 报到成功 -->
          <template v-if="stempInfo.ifReport == 1">您<span v-if="stempInfo.modifyTime == null || stempInfo.modifyTime == ''">已</span><span v-if="stempInfo.modifyTime != '' || stempInfo.modifyTime != null">于</span><span
            class="color1">{{stempInfo.modifyTime | dateFormatYmd}}</span>完成到校报到注册手续~
          </template>
          <!-- 逾期未报到 -->
          <template v-if="false">您<span class="color1">逾期未到学校报到</span>，视为自动放弃入学资格~</template>
        </div>

        <!-- 填写报到信息 -->
        <template v-if="stempInfo.ifReport != 1  && stempInfo.startReportInfo == 1">
          

        <div v-if="stempInfo.ifSubmit != 1">

          <div v-if="(stempInfo.ifSubmit == null || stempInfo.ifSubmit == 0) && is" >
           请<span class="color1">填写报到信息</span>并按学校通知时间<span class="color1">到校报到</span>
          <reportInfo @nodefn='ismod'></reportInfo>
          </div>

         <div v-else-if="stempInfo.ifSubmit == 0 && !is" >
           <!-- 预览 -->
           <div class="bd-box">
             <span> 您已完成报到信息填写,请按学校通知时间<span class="color1">到校报到</span></span> <span class="xg-nav" v-if="stempInfo.ifSubmit != 1" @click="clickModify">修改</span>
           </div>
              <preview></preview>
         </div>
         </div>
          <div v-else>
            <div>
           <!-- 预览 -->
           <div class="bd-box">
             <span> 您已完成报到信息填写,请按学校通知时间<span class="color1">到校报到</span></span> <span class="xg-nav" v-if="stempInfo.ifSubmit != 1" @click="clickModify">修改</span>
           </div>
              <preview></preview>
         </div>
          </div>

        </template>
      </div>
    </div>
    <!--缴费须知-->
    <el-dialog title="在线缴费须知" center :visible.sync="payDialog" width="600px">
      <ul class="pay-know">
        <li>请准备一张银行卡，确认卡内金额满足缴费；</li>
        <li>请确认该卡的银行预留手机号能正常接收短信；</li>
        <li>请确认是本人信息后，点击界面下方的“支付”按钮进入招行一网通界面缴费；</li>
        <li>若是招行一网通新用户，需手机注册，同时添加银联银行卡；</li>
        <li>不要点击任何形式推送的缴费网页链接；</li>
        <li>缴费票据请报到时到校打印；</li>
        <li>缴费前请仔细阅读《招行一网通介绍》；</li>
        <li>本人已阅读须知，并承担相应责任。</li>
      </ul>
    </el-dialog>
    <card v-if="planId && stempInfo.id" :planId="planId" :regId="stempInfo.id"/>
  </div>
</template>
<script>
  import reserve from "./reserve_comp"
  import reportInfo from "./report_infos"
  import card from "./card"
  import preview from './report_preview'
  export default {
    components: {
      reserve,
      reportInfo,
      card,
      preview
    },
    filters: {
      dateFormatHms: function (date) {
        if (date) {
          return moment(date).format('YYYYMMDDHHmmss');
        }
      },
      dateFormat: function (date) {
        if (date) {
          return moment(date).format('YYYYMMDD');
        }
      },
    },
    data() {
      return {
        showCard: false,
        payDialog: false,
        isAgree: false,
        isLoading: false,
        stempInfo: {},
        is: true,
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
        planInfo: {},
        str: '',
        isOnLine: 'onLine',
        orderNo: '',
        jsonTest: '',
        //协议号
        agrNo: '',
        merchantSerialNo: '',
        amount: ''
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
      },
    },
    created() {
    //console.log(this.is)
      this.query()
    },
    mounted() {
      this.orderNo = localStorage.getItem('orderNo');
      if (this.orderNo) {
        this.paySuccess();
      }
      this.query();
    },
    methods: {
       // 点击保存
      ismod() {
        //console.log(11111)
        this.is = !this.is 
        this.query()
      },
      // 点击修改
      clickModify() {
        this.is = true
        // this.stempInfo.ifSubmit = null
      },
      serReserve(id) {
        const vm = this;
        let obj = {
          id: vm.stempInfo.id,
          paymentReserve: id,
        };
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
        vm.isLoading = true;
        let idCard = window.userInfo.idCard;
        http.get("/gateway/enroll/api/erRegister/admissionsProgress/" + idCard).then((xhr) => {
          if (xhr.code) return;
          vm.isLoading = false;
          vm.stempInfo = xhr.data;
          vm.viewScore();
          vm.getPlanInfo();
          vm.expireFlag = false;
          if (vm.stempInfo.paymentDeadline) {
            vm.expireFlag = new Date(vm.stempInfo.paymentDeadline).getTime() + (24 * 60 * 60 * 1000) < new Date().getTime();
          }
          vm.planId = xhr.data.planId;
          localStorage.planid = xhr.data.planId;
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
          vm.planInfo.onLine = false;
          vm.planInfo.underLine = false;
          if(vm.planInfo.paymentType){
            vm.planInfo.paymentType = vm.planInfo.paymentType.split(',');
            if(vm.planInfo.paymentType.length>=2){
              vm.isOnLine = 'onLine';
              vm.planInfo.onLine = true;
              vm.planInfo.underLine = true;
            }else{
              if(vm.planInfo.paymentType[0] == '1'){
                vm.isOnLine = 'onLine';
                vm.planInfo.onLine = true;
              }
              if(vm.planInfo.paymentType[0] == '2'){
                vm.isOnLine = 'underLine';
                vm.planInfo.underLine = true;
              }
            }
          }
          if (xhr.data.data.phaseName == '高中') {
            vm.str = '测试'
          } else {
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
      },
      //获取客户协议号
      getAgrNo(type) {
        let vm = this;
        http.get(`/gateway/enroll/erCmbPay/getAgrNo/${vm.stempInfo.id}`).then(function (xhr) {
          //生成协议号
          let charactors = "1234567890";
          let random = '';
          for (let j = 1; j <= 4; j++) {
            random = random + charactors.charAt(parseInt(10 * Math.random()));
          }
          let date = new Date();
          if (xhr.bodyText) {
            vm.agrNo = xhr.bodyText;
          } else {
            vm.agrNo = 'agrNo' + date.getTime() + random;
          }
          vm.merchantSerialNo = 'ms' + date.getTime() + random;
          vm.payBefore(type)
        });
      },
      //支付前调用
      payBefore(type) {
        let vm = this;
        //生成订单号
        let charactors = "1234567890";
        let random = '';
        for (let j = 1; j <= 4; j++) {
          random = random + charactors.charAt(parseInt(10 * Math.random()));
        }
        let date = new Date();
        vm.orderNo = 'JX' + vm.$options.filters['dateFormat'](date.getTime()) + date.getTime() + random;
        vm.amount = random / 10;
        let obj = {
          regId: vm.stempInfo.id, // 注册id
          mobileNo: vm.stempInfo.guardianPhone,
          payType: type == 'h5' ? 1 : 2,
          amount: vm.amount, // nowStuInfo.assessment
          orderNo: vm.orderNo,
          agrNo: vm.agrNo
        };
        if (type == 'web') {
          obj.payDesc = '嘉祥招生缴费'
        }
        http.post("/gateway/enroll/erCmbPay/insert", obj).then(function (xhr) {
          if (xhr.status == 2) {
            vm.$message.warning('请重新支付');
            return
          } else {
            localStorage.setItem('orderNo', vm.orderNo);
            if (type == 'h5') {
              vm.PayCost()
            } else {
              vm.ScanPay()
            }
          }
        });
      },
      //网页支付
      PayCost() {
        let vm = this;
        let date = new Date();
        let jsonRequestData = {
          "version": "1.0",
          "charset": "UTF-8",
          "sign": "",
          "signType": "SHA-256",
          "reqData": {
            "dateTime": vm.$options.filters['dateFormatHms'](date.getTime()), //  当前时间按yyyyMMddHHmmss获取
            "branchNo": "0028", //  分行号
            "merchantNo": "000133", //  商户号
            "date": vm.$options.filters['dateFormat'](date.getTime()),    //  当前日期按yyyyMMdd获取
            "orderNo": vm.orderNo,  //  订单号,商户定义(32位,支持数字,字母)
            "amount": vm.amount,   //  金额 vm.nowStuInfo.assessment? vm.nowStuInfo.assessment:0
            "payNoticePara": `${vm.stempInfo.id}|14786154890`,//注册id电话 vm.stempInfo.guardianPhone
            "payNoticeUrl": 'http://zs.jxfls.com/gateway/enroll/erCmbPay/payNotice',    //  支付成功回调地址
            "returnUrl": 'http://zs.jxfls.com/center?progress=true',
            "agrNo": vm.agrNo,    //  客户协议号,商户生成,确保客户与协议号一一对应
            "merchantSerialNo": vm.merchantSerialNo, //  首次签约必填,协议开通请求流水号，开通协议时必填。
            "signNoticeUrl": 'http://zs.jxfls.com/gateway/enroll/erCmbPay/signNotice',
          }
        };
        http.post('/gateway/enroll/erCmbPay/getSignStr', jsonRequestData.reqData)
          .then((xhr) => {
            jsonRequestData.sign = xhr.bodyText;
            let form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //下面为在form表单中添加查询参数
            form.attr('id', 'ajaxForm');
            form.attr('target', '');
            form.attr('method', 'post');
            form.attr('action', window.systemParameter.CmbBank_B2B_Pay + "/netpayment/BaseHttp.dll?MB_EUserPay");
            let input = $('<input>');
            input.attr('type', 'hidden');
            input.attr('name', 'jsonRequestData');
            input.attr('value', JSON.stringify(jsonRequestData));
            form.append(input);   //将查询参数控件提交到表单上
            $('body').append(form);  //将表单放置在web中
            form.submit();   //表单提交
          })
      },
      //扫码支付
      ScanPay() {
        let vm = this;
        let date = new Date();
        let jsonRequestData = {
          "version": "1.0",
          "charset": "UTF-8",
          "sign": "",
          "signType": "SHA-256",
          "reqData": {
            "dateTime": this.$options.filters['dateFormatHms'](date.getTime()),
            "branchNo": "0028",
            "merchantNo": "000133",
            "date": this.$options.filters['dateFormat'](date.getTime()),
            "orderNo": vm.orderNo,  //  订单号
            "amount": vm.amount,//vm.nowStuInfo.assessment
            "payNoticePara": `${vm.stempInfo.id}|14786154890`,//注册id电话
            "payNoticeUrl": 'http://zs.jxfls.com/gateway/enroll/erCmbPay/payNotice',
            "returnUrl": 'http://zs.jxfls.com/center?progress=true',
            "productDesc": '扫码支付', //  扫码描述
            "agrNo": vm.agrNo,    //  客户协议号,商户生成,确保客户与协议号一一对应
            "merchantSerialNo": vm.merchantSerialNo, //  首次签约必填,协议开通请求流水号，开通协议时必填。
            "signNoticeUrl": 'http://zs.jxfls.com/gateway/enroll/erCmbPay/signNotice',
          }
        };
        http.post('/gateway/enroll/erCmbPay/getSignStr', jsonRequestData.reqData)
          .then((xhr) => {
            jsonRequestData.sign = xhr.bodyText;
            let form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //下面为在form表单中添加查询参数
            form.attr('id', 'ajaxForm');
            form.attr('target', '');
            form.attr('method', 'post');

            form.attr('action', window.systemParameter.CmbBank_B2B_Pay + "/netpayment/BaseHttp.dll?PC_EUserPay");
            let input = $('<input>');
            input.attr('type', 'hidden');
            input.attr('name', 'jsonRequestData');
            input.attr('value', JSON.stringify(jsonRequestData));
            form.append(input);   //将查询参数控件提交到表单上
            $('body').append(form);  //将表单放置在web中
            form.submit();   //表单提交
          })
      },
      //  支付成功回调
      paySuccess() {
        let vm = this;
        http.get("/gateway/enroll/erCmbPay/singleOrder?orderNo=" + vm.orderNo).then(function (xhr) {
          if (xhr.body.returnStatus == 0) {
            // 回调成功

          }
        });
      },
      changeTab() {
        this.$emit('changeTab')
      },
      //打印测试卡
      print() {
        window.print();
      }
    }
  }
</script>
<style lang="less" scoped>
.xg-nav {
    float: right;
    position: relative;
    right: 20%;
    border: 1px solid #000000;
    padding: 5px 15px;
    border-radius: 2px;
    font-size: 16px;
    cursor: pointer;
  }
  .fbgl {
    padding-right: 20px;
  }
  .fb-box {
    text-align: left;
  }
  .block {
    display: block;
  }

  .progress {
    padding: 40px 0 60px;
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

  .sign-btn {
    text-align: center;
    margin-top: 24px;
    button {
      width: 120px;
      height: 40px;
      border: none;
      line-height: 40px;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .save {
      background: #2f3861;
      margin: 0 8px;
    }
    .disabled {
      background-color: rgba(204, 204, 204, 1);
    }
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

  .score-wrap {
    .score-header {
      padding-bottom: 12px;
      line-height: 1;
      margin-top: 24px;
      margin-bottom: 12px;
      .score-txt {
        margin-right: 24px;
        border-left: 6px solid #aa2f33;
        padding-left: 10px;
      }
      .down-file {
        float: right;
        font-size: 12px;
        cursor: pointer;
        color: #00a2d4;
      }
    }

  }

  .pay_info {
    margin-top: 24px;
    & > div {
      text-align: left;
      padding: 5px 0;
      span {
        display: inline-block;
        width: 140px;
      }
    }
    & > div:last-child {
      border-bottom: none;
    }
  }

  .pay_hint {
    margin-top: 24px;
  }

  .pay-tips {
    margin: 12px 0;
    font-size: 12px;
  }

  .uniform-btn {
    font-size: 12px;
    color: #2f3861;
    border: 1px solid #2f3861;
    border-radius: 4px;
    display: inline-block;
    padding: 4px 30px;
    margin-left: 12px;
    cursor: pointer;
  }

  .m-t {
    margin-top: 16px;
  }

  .font-12 {
    font-size: 12px;
  }

  .agreement {
    text-align: left;
    font-size: 12px;
    margin-bottom: 24px;
    a {
      display: block;
      color: #409eff;
    }
  }

  .pay-know {
    line-height: 2;
    list-style: decimal;
    padding: 0 16px;
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
      padding: 16px;
    }
    .rate_hint {
      text-align: center;
      .hint_info {
        margin-left: 0;
      }
      .hint_img {
        margin-right: 8px;
      }
      img {
        width: 24px;
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
      margin: 10px auto;
      display: block;
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
    .score-wrap {
      text-align: left;
      .score-txt {
        margin-bottom: 16px;
        display: block;
      }
    }
    .over_hint {
      margin-left: 24px;
    }
    .text-left {
      text-align: left;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .font-12 {
      margin-left: 24px;
    }
    .uniform-btn {
      padding: 0 12px;
    }
  }
</style>
<style lang="less">
  .el-checkbox__label {
    font-size: 12px;
    color: #aa2f33;
  }

  .is_phone {
    .el-dialog {
      width: 90% !important;
    }
  }

</style>
