<template>
  <div class="container sign-wrap">
    <div class="comm_main" v-loading="saving">
      <div class="sign-left">
        <h6 class="sign-tit">[{{planInfo.campusName}}]{{planInfo.yearName}}{{planInfo.planName}}</h6>
        <div class="sign-subttit">
          报名校区：<span>{{planInfo.campusName}}</span> 报名年级：<span>{{planInfo.gradeName}}</span>
          <span class="update-txt" v-if="regInfo.regStatus==0" @click="editFlag=true;">修改</span>
        </div>
        <!--基本信息-->
        <div class="sign-main" id="info">
          <p class="item-tit tit750">基本信息</p>
          <template>
            <el-form :model="regInfo" :rules="rules" ref="ruleForm" label-width="170px">
              <div class="basic-info">
                <div class="user-img">
                  <div class="user_photo">
                    <img :src="imgUrl+regInfo.photoId" v-if="regInfo.photoId">
                  </div>
                  <div class='img_null' v-if="userImgErr">证件照不能为空</div>
                  <div class="up_suerphoto" v-if="!regInfo.photoId" @click="uploadPicture">
                    <img src="@/imgs/upload.png">上传证件照
                  </div>
                  <p v-if="!regInfo.photoId">本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</p>
                </div>
                <div class="user-info">
                  <el-form-item label="学生姓名:" prop="stuName" id="formData_name">
                    <el-col :span="12">
                      <el-input v-model="regInfo.stuName" placeholder="请填写"></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="身份证号:" prop="idCard" id="formData_idCardNum">
                    <el-col :span="12">
                      <el-input v-model="regInfo.idCard" placeholder="请填写" @change="idCardNumFn"></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="出生日期:" prop="stuBirthday">
                    <el-col :span="12">
                      <el-input v-model="regInfo.stuBirthday" placeholder="0000-00-00" readonly></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="性别:" prop="stuGender" id="formData_gender">
                    <el-radio-group v-model="regInfo.stuGender">
                      <el-radio v-for="(gender,index) in genderList" :key="index" :label="gender.seiValue">
                        {{gender.seiName}}
                      </el-radio>
                    </el-radio-group>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="户籍所在地:">
                    <el-col :span="12">
                      <!--省市区县(传省市区id)-->
                      <!--<cityPicker :selectedFn="getArea"></cityPicker>-->
                      <el-cascader
                        placeholder="请填写"
                        style="width: 100%"
                        filterable
                        :options="addList"
                        v-model="regInfo.stuAdds"/>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="现就读学校:">
                    <el-col :span="12">
                      <el-autocomplete
                        v-model="regInfo.nowSchool"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"/>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="现就读年级:" prop="nowGrade">
                    <el-col :span="12">
                      <el-select clearable v-model="regInfo.nowGrade" placeholder="请填写">
                        <el-option
                          v-for="item in gradeList"
                          :key="item.id"
                          :label="item.gradeName"
                          :value="item.id"/>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <!--手机浏览器显示-->
                  <template v-if="isPhone">
                    <el-form-item label="总分年级排名">
                      <el-row>
                        <el-col :span="12">
                          <el-input type="number" min="1" step="1" placeholder="请填写"
                                    v-model="regInfo.otherData['s_a']"></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="年级人数:">
                      <el-row>
                        <el-col :span="12">
                          <el-input type="number" min="1" step="1" placeholder="请填写"
                                    v-model="regInfo.otherData['s_b']"></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </template>
                  <!--pc 显示-->
                  <template v-else>
                    <el-form-item label="总分年级排名/年级人数:">
                      <el-row>
                        <el-col :span="6" class="m-r-12">
                          <el-input type="number" min="1" step="1" placeholder="请填写"
                                    v-model="regInfo.otherData['s_a']"></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-input type="number" min="1" step="1" placeholder="请填写"
                                    v-model="regInfo.otherData['s_b']"></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </template>

                </div>
                <!--pc 显示-->
                <div class="user-info-table" v-if="!isPhone">
                  <div class="table-item">
                    <label>监护人:</label>
                    <table class="table">
                      <thead>
                      <tr>
                        <th>姓名</th>
                        <th>手机</th>
                        <th>学历</th>
                        <th>工作单位</th>
                        <th>职务</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="i in 2" :key="i" class="input-no-border">
                        <td>
                          <el-input :maxlength="20" v-model="regInfo.parents[i-1]['s_g']"/>
                        </td>
                        <td>
                          <el-input :maxlength="20" v-model="regInfo.parents[i-1]['s_h']"/>
                        </td>
                        <td>
                          <el-input :maxlength="10" v-model="regInfo.parents[i-1]['s_i']"/>
                        </td>
                        <td>
                          <el-input :maxlength="50" v-model="regInfo.parents[i-1]['s_j']"/>
                        </td>
                        <td>
                          <el-input :maxlength="30" v-model="regInfo.parents[i-1]['s_k']"/>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="table-item">
                    <label>获奖信息:</label>
                    <div>
                      <table class="table">
                        <thead>
                        <tr>
                          <th>获奖时间</th>
                          <th>奖项名称</th>
                          <th>奖项等级</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="i in 3" :key="i" class="input-no-border">
                          <td>
                            <el-date-picker
                              placeholder="年/月/日"
                              v-model="regInfo.rewards[i-1]['s_c']"
                              type="date"/>
                          </td>
                          <td>
                            <el-input
                              placeholder="奖项名称（限20字）"
                              :maxlength="20"
                              v-model="regInfo.rewards[i-1]['s_d']"/>
                          </td>
                          <td>
                            <el-input
                              placeholder="奖项等级（限10字）"
                              :maxlength="10"
                              v-model="regInfo.rewards[i-1]['s_e']"/>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      <div class="table-item-tag">填写示例：2018年3月1日 四川省级科创比赛 一等奖</div>
                    </div>
                  </div>
                  <div class="table-item">
                    <label>获奖附件:</label>
                    <div class="up_idcard" @click="uploadEnclosure">
                      <template v-if="!fileList || !fileList.length">
                        <img src="@/imgs/upload.png">上传证件
                      </template>
                      <img v-else :src="imgUrl+fileList[0].fileId" class="card">
                    </div>
                    <div class="hint">证明您的获奖情况</div>

                  </div>
                </div>
              </div>
              <!--手机浏览器 显示-->
              <template v-if="isPhone">
                <!--间隔线-->
                <div class="line"></div>
                <!--监护人信息-->
                <div class="guardian_info">
                  <p class="item-tit tit750">
                    监护人信息
                    <span v-if="!guardianOpen" @click="guardianOpen = !guardianOpen">展开<i
                      class="el-icon-arrow-down"></i> </span>
                    <span v-else @click="guardianOpen = !guardianOpen">收起 <i class="el-icon-arrow-up"></i> </span>
                  </p>
                  <template v-for="i in 2" v-if="guardianOpen">
                    <el-form-item label="姓名:">
                      <el-input :maxlength="20" placeholder="请填写" v-model="regInfo.parents[i-1]['s_g']"/>
                    </el-form-item>
                    <el-form-item label="手机:">
                      <el-input :maxlength="20" placeholder="请填写" v-model="regInfo.parents[i-1]['s_h']"/>
                    </el-form-item>
                    <el-form-item label="学历:">
                      <el-input :maxlength="10" placeholder="请填写" v-model="regInfo.parents[i-1]['s_i']"/>
                    </el-form-item>
                    <el-form-item label="工作单位:">
                      <el-input :maxlength="50" placeholder="请填写" v-model="regInfo.parents[i-1]['s_j']"/>
                    </el-form-item>
                    <el-form-item label="职务:">
                      <el-input :maxlength="30" placeholder="请填写" v-model="regInfo.parents[i-1]['s_k']"/>
                    </el-form-item>
                    <div class="line-1" v-if="i==1"></div>
                  </template>
                </div>
                <!--间隔线-->
                <div class="line"></div>
                <!--获奖信息-->
                <div class="prize_info">
                  <p class="item-tit tit750">
                    获奖信息
                    <span v-if="!prizeOpen" @click="prizeOpen = !prizeOpen">展开<i
                      class="el-icon-arrow-down"></i> </span>
                    <span v-else @click="prizeOpen = !prizeOpen">收起 <i class="el-icon-arrow-up"></i> </span>
                  </p>
                  <template v-for="i in 3" v-if="prizeOpen">
                    <el-form-item label="获奖时间:">
                      <el-date-picker placeholder="年/月/日" v-model="regInfo.rewards[i-1]['s_c']" type="date"/>
                    </el-form-item>
                    <el-form-item label="奖项名称:">
                      <el-input placeholder="奖项名称（限20字）" :maxlength="20" v-model="regInfo.rewards[i-1]['s_d']"/>
                    </el-form-item>
                    <el-form-item label="奖项等级:">
                      <el-input placeholder="奖项等级（限10字）" :maxlength="10" v-model="regInfo.rewards[i-1]['s_e']"/>
                    </el-form-item>
                    <div class="line-1" v-if="i == 3"></div>
                    <el-form-item label="获奖附件:" v-if="i == 3">
                      <div class="up_idcard" @click="uploadEnclosure">
                        <template v-if="!fileList || !fileList.length">
                          <img src="@/imgs/upload.png">上传证件
                        </template>
                        <img v-else :src="imgUrl+fileList[0].fileId" class="card">
                      </div>
                    </el-form-item>
                    <div class="line-1" v-if="i == 1 || i == 2"></div>
                  </template>
                </div>
              </template>
              <!--间隔线-->
              <div class="line"></div>
              <!--登录密码-->
              <div class="sign-pwd" id="pwd">
                <p class="item-tit">登录密码</p>
                <div class="sign-pwd-tit">
                  请设置密码，建议使用字符的组合密码且长度超过6位
                  <p>注：若未设置密码，下次登录的密码为“身份证号后六位”</p>
                </div>
                <el-row>
                  <el-col :span="16" :offset="4">
                    <el-form-item label="登录名:" prop="phoneNum">
                      <el-col :span="18">
                        <el-input v-model="regInfo.phoneNum" placeholder="请输入手机号"></el-input>
                      </el-col>
                      <!--错误信息-->
                      <template slot="error" slot-scope="scope">
                        <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                      </template>
                    </el-form-item>
                    <el-form-item label="设置密码:" prop="pwd">
                      <el-col :span="18">
                        <el-input v-if="!isPwd" type="password" v-model="regInfo.pwd"
                                  placeholder="默认密码 (身份证号后六位)">
                          <template slot="suffix">
                            <i class="iconfont pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
                            <i class="iconfont pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
                          </template>
                        </el-input>
                        <el-input v-if="isPwd" type="text" v-model="regInfo.pwd">
                          <template slot="suffix">
                            <i class="iconfont pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
                            <i class="iconfont pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
                          </template>
                        </el-input>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="确认密码:" prop="repwd">
                      <el-col :span="18">
                        <el-input v-if="!isRePwd" type="password" v-model="regInfo.repwd"
                                  placeholder="默认密码 (身份证号后六位)">
                          <template slot="suffix">
                            <i class="iconfont pointer" v-if="!isRePwd" @click="isRePwd = !isRePwd">&#xe60d;</i>
                            <i class="iconfont pointer" v-if="isRePwd" @click="isRePwd = !isRePwd">&#xe6b8;</i>
                          </template>
                        </el-input>
                        <el-input v-if="isRePwd" type="text" v-model="regInfo.repwd">
                          <template slot="suffix">
                            <i class="iconfont pointer" v-if="!isRePwd" @click="isRePwd = !isRePwd">&#xe60d;</i>
                            <i class="iconfont pointer" v-if="isRePwd" @click="isRePwd = !isRePwd">&#xe6b8;</i>
                          </template>
                        </el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <div class="sign-btn">
              <button class="save" @click="save('ruleForm')">提交报名</button>
              <button class="cancel" @click="cancel('ruleForm')">取消</button>
            </div>
          </template>
        </div>
      </div>
      <!--nav-->
      <div class="sign-right">
        <div class="nav_point">
          <div class="point" :class="{active:current == 'info'}" @click="pointFn('info')">基本信息</div>
          <div class="point" :class="{active:current == 'pwd'}" @click="pointFn('pwd')">登录密码</div>
        </div>
      </div>
      <el-dialog title="警告" :visible.sync="saveFlag">
        <div>
          确定提交报名？提交后以下信息将<span style="color: red">不支持修改</span>：
        </div>
        <!--todo 分割线 -->
        <el-row>
          <el-col :span="10">
            * 学生姓名：{{regInfo.stuName}}
          </el-col>
          <el-col :span="10">
            * 身份证号：{{regInfo.idCard}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            * 出生日期：{{regInfo.stuBirthday | dateFormatYmd}}
          </el-col>
          <el-col :span="10">
            * 性别：{{genderMap[regInfo.stuGender]}}
          </el-col>
        </el-row>
        <div slot="footer">
          <el-button @click="saveFlag=false">取消</el-button>
          <el-button @click="saveInfo" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        // 绑数据
        planInfo: {},
        regInfo: {
          photoId: "",
          regStatus: 0,
          otherData: {},
          parents: [
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
          ],
          rewards: [
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""}
          ],
        },
        editFlag: false,
        addList: [],
        gradeList: [],
        fileList: [],
        planId: "",
        regId: "",
        gradeMap: {},
        operation: "",
        otherEnum: "",
        enumMap: {},
        saving: false,
        saveFlag: false,
        // 性别数据
        genderList: [{
          seiValue: 1,
          seiName: "男"
        }, {
          seiValue: 2,
          seiName: "女"
        }],
        genderMap: {2: "女", 1: "男"},
        schoolList: [],

        // 原始
        current: 'info',
        isShow: false,
        userImgErr: false,
        isPwd: false,
        isRePwd: false,
        imgUrl: '/gateway/zuul/filesystem/api/image/thumbnail/',
        // 报名表信息
        formData: {
          campusName: '锦江校区',
          className: '初一',
          planYear: 2019,
          auditStatus: -1,
          enrollFileId: '',
          info: {
            status: false,
            pictureFileId: '',
            birthDate: '',
            guardianInfo: [
              {
                name: '',
                tel: '',
                education: '',
                workPlace: '',
                post: ''
              },
              {
                name: '',
                tel: '',
                education: '',
                workPlace: '',
                post: ''
              }
            ],
            username: '',
            pwd: '',
            repwd: ''
          }
        },
        // 表单验证
        rules: {
          stuName: [{required: true, message: '必填项', trigger: 'blur'}],
          idCard: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 15, max: 18, message: '格式有误', trigger: 'blur'}
          ],
          phoneNum: [{required: true, message: '必填项', trigger: 'blur'}],
          stuBirthday: [{required: true, message: '必填项', trigger: 'blur'}],
          stuGender: [{required: true, message: '必填项', trigger: 'blur'}]
        },
        //  监护人信息是否展开
        guardianOpen: false,
        // 获奖信息是否展开
        prizeOpen:false
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
      }
    },
    mounted() {
      const vm = this;
      vm.planId = this.$route.query.id
      // 查询性别
      vm.getEnum();
      vm.getAddList();
      vm.getGradeList();
      vm.getPlanInfo();
      vm.getReg();
      // this.queryGender();
    },
    methods: {
      querySearch(queryString, cb) {
        let restaurants = this.schoolList;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.seiName.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      saveInfo() {
        const vm = this;
        vm.saving = true;
        vm.regInfo.planId = vm.planId;
        vm.regInfo.nowGradeName = vm.gradeMap[vm.regInfo.nowGrade];
        vm.regInfo.rewardFile = [];
        if (vm.fileList && vm.fileList.length) {
          for (let file of vm.fileList) {
            vm.regInfo.rewardFile.push({fieldText: file.fileName, fieldValue: file.fileId});
          }
        }
        // vm.regInfo.localStr = "";
        let al = vm.addList;
        if (vm.regInfo.stuAdds && vm.regInfo.stuAdds.length) {
          vm.regInfo.stuAdd = vm.regInfo.stuAdds.join(",");
          // for (let key of vm.regInfo.stuAdds) {
          //   let obj = {};
          //   for (let addObj of al) {
          //     if (addObj.value == key) {
          //       obj = addObj;
          //       break;
          //     }
          //   }
          //   vm.regInfo.localStr += obj.label;
          //   if (obj.children && obj.children.length) {
          //     al = obj.children;
          //   }
          // }
        }
        for (let i = 0; i < 3; i++) {
          let reward = vm.regInfo.rewards[i];
          for (let key in reward) {
            let value = reward[key];
            if (value) {
              if (key == "s_c") {
                value = moment(value).format('YYYY-MM-DD');
              }
              vm.$set(reward, key, value + "#," + value);
            }
          }
          if (i < 2) {
            let parent = vm.regInfo.parents[i];
            for (let key in parent) {
              let value = parent[key];
              if (value) {
                vm.$set(parent, key, value + "#," + value);
              }
            }
          }
        }
        if (vm.regInfo.otherData) {
          for (let key in vm.regInfo.otherData) {
            let value = vm.regInfo.otherData[key];
            if (value) {
              if (vm.enumMap[key]) {
                let items = vm.enumMap[key];
                let text = "";
                for (let item of items) {
                  if (item.seiValue == value) {
                    text = item.seiName;
                    break;
                  }
                }
                vm.$set(vm.regInfo.otherData, key, value + "#," + text);
              } else {
                vm.$set(vm.regInfo.otherData, key, value + "#," + value);
              }
            }
          }
        }
        vm.regInfo.creatorId = "00001111000011110000111100001111"
        http.post("/gateway/enroll/api/erRegister", vm.regInfo).then((xhr) => {
          vm.saving = false;
          if (xhr.data.code) {
            return;
          }
          vm.regId = xhr.data.data;
          vm.saveFlag = false;
          vm.$router.push({path: '/'})
          // todo 跳转到个人中心页面 or 登录页面
        })
      },
      getReg() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erRegister/empty").then((xhr) => {
          if (xhr.code) {
            return;
          }
          let data = xhr.data;
          for (let i = 0; i < 3; i++) {
            if (!data.rewards[i]) {
              let obj = {s_c: "", s_d: "", s_e: ""};
              data.rewards[i] = obj;
            } else {
              // vm.regInfo.rewards[i].s_c = new Date(vm.regInfo.rewards[i].s_c);
            }
            if (i != 2 && !data.parents[i]) {
              data.parents[i] = {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""};
            }
          }
          vm.regInfo = data;
          if (!vm.regInfo.otherData) {
            vm.regInfo.otherData = {}
          }
          vm.fileList = [];
          if (vm.regInfo.erFields && vm.regInfo.erFields.length) {
            let map = {};
            for (let field of vm.regInfo.erFields) {
              if (field.dicUri) {
                map[field.fieldCode] = field.dicUri;
              }
            }
            if (map && map != {}) {
              vm.getOtherEnum(map);
            }
          }
        });
      },
      getOtherEnum(fieldMap) {
        const vm = this;
        let pam = {};
        let dicUris = [];
        vm.enumMap = {};
        for (let key in fieldMap) {
          if (!pam[fieldMap[key]]) {
            pam[fieldMap[key]] = key;
          } else {
            pam[fieldMap[key]] = pam[fieldMap[key]] + "," + key;
          }
          dicUris.push(fieldMap[key]);
        }
        Promise.all([
          http.get("/gateway/platform/api/enum/queryByCodes/" + dicUris.join(","))
        ]).then(function (list) {
          for (let key in pam) {
            let codes = [];
            let enums = [];
            let fieldCode = pam[key];
            if (fieldCode.indexOf(",")) {
              for (let code of fieldCode.split(",")) {
                codes.push(code);
              }
            } else {
              codes.push(fieldCode);
            }
            for (let enumItem of list[0].data) {
              if (enumItem.code == key) {
                enums.push(enumItem);
              }
            }
            for (let c of codes) {
              vm.enumMap[c] = enums;
            }
          }
        });
      },
      getEnum() {
        let vm = this;
        var enumCodes = "studentsType,xsbq,XXLB";
        Promise.all([
          http.get("/gateway/platform/api/enum/queryByCodes/" + enumCodes)
        ]).then(function (list) {
          vm.stuTypes = _.filter(list[0].data, function (i) {
            return i.code == "studentsType";
          });
          vm.tagList = _.filter(list[0].data, function (i) {
            return i.code == "xsbq";
          });
          vm.schoolList = _.filter(list[0].data, function (i) {
            if (i.code == "XXLB") {
              vm.$set(i, "value", i.seiName);
            }
            return i.code == "XXLB";
          });
        });
      },
      getAddList() {
        const vm = this;
        vm.addList = [];
        http.get("/gateway/enroll/erRegister/locals").then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          if (!xhr.data.data || !xhr.data.data.length) {
            return;
          }
          vm.addList = xhr.data.data;
        });
      },
      getGradeList() {
        const vm = this;
        http.get('/gateway/platform/grade/param').then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.gradeList = xhr.data.data;
          if (vm.gradeList.length) {
            for (let grade of vm.gradeList) {
              vm.gradeMap[grade.id] = grade.gradeName;
            }
          }
        });
      },
      getPlanInfo() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erEnrollPlan/" + vm.planId).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.planInfo = xhr.data.data;
        });
      },

      pointFn(type) {
        document.getElementById(type).scrollIntoView();
        this.current = type
      },

      // 根据身份证号码识别出生日期
      idCardNumFn() {
        let vm = this;
        vm.regInfo.idCard = $.trim(vm.regInfo.idCard);
        let idCardNum = vm.regInfo.idCard;
        let pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (pattern.test(idCardNum)) {
          vm.regInfo.stuBirthday = idCardNum.substring(6, 10) + "-" + idCardNum.substring(10, 12) + "-" + idCardNum.substring(12, 14);
        } else {
          vm.regInfo.stuBirthday = ''
        }
      },
      // 上传证件
      uploadPicture() {
        let vm = this;
        fileUpload({
          title: '上传证件照片',
          uploadFileMaxNum: 1,
          mimeTypes: '.png,.jpg,.jpeg',
          confirm: function (files) {
            vm.regInfo.photoId = files[0].id;
            if (vm.regInfo.photoId) {
              vm.userImgErr = false
            }
          }
        });
      },
      // 上获奖附件
      uploadEnclosure() {
        let vm = this;
        fileUpload({
          title: '上传获奖附件',
          uploadFileMaxNum: 1,
          mimeTypes: '.png,.jpg,.jpeg,.pdf',
          confirm: function (files) {
            // 成功回调
            let f = files[0];
            vm.fileList.push({
              fileName: f.filename,
              fileId: _.trim(f.id),
            });
          }
        });
      },

      // 保存
      save(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            vm.saveFlag = true;
          } else {
            if (!vm.formData.info.name) return document.getElementById('formData_name').scrollIntoView();

            if (!vm.formData.info.idCardNum) return document.getElementById('formData_idCardNum').scrollIntoView();

            if (!vm.formData.info.gender) return document.getElementById('formData_gender').scrollIntoView();
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消
      cancel(formName) {
        // let vm = this;
        // vm.$refs[formName].resetFields();
        // vm.formData.info.status = !vm.formData.info.status
        // todo 返回首页
      },
      // 提交报名
      submitForm() {
        const vm = this;
        if (!vm.regId) {
          vm.$message.warning("注册账号失败，无法提交，请重试！");
          return;
        }
        vm.saving = true;
        http.put("/gateway/enroll/api/erRegister/confirm", {id: vm.regId}).then((xhr) => {
          vm.saving = false;
          if (xhr.data.code) {
            return;
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped>
  .comm_main {
    position: relative;
  }

  .sign-left {
    margin: 0 320px 0 0;
    padding: 40px 20px 30px;
    box-sizing: border-box;
    .sign-tit {
      color: #333;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
    }
    .sign-subttit {
      border-bottom: 1px solid #e2e1e1;
      padding-bottom: 10px;
      margin-top: 30px;
      span {
        color: #aa2f33;
        margin-right: 24px;
      }
      .update-txt {
        float: right;
        color: #00b7ee;
        cursor: pointer;
      }
    }
    .sign-main {
      margin: 30px 0;
      .item-tit {
        color: #666;
        margin-bottom: 30px;
      }
      .basic-info {
        .user-img {
          width: 160px;
          margin-left: 60px;
          position: absolute;
          left: 0;
          .user_photo {
            width: 160px;
            height: 200px;
            border: 1px solid #ccc;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .up_suerphoto {
            border: 1px solid #ccc;
            line-height: 40px;
            text-align: center;
            color: #666;
            margin-top: 20px;
            cursor: pointer;
            img {
              margin-right: 10px;
              vertical-align: middle;
            }
          }
          p {
            color: #999;
            font-size: 12px;
            margin-top: 20px;
          }
          .img_null {
            color: #eb2727;
            top: 200px;
            left: 0;
            position: absolute;
          }
        }
        .user-info {
          margin-left: 240px;
        }
        .user-info-table {
          margin-left: 60px;
          .table-item {
            display: flex;
            margin-bottom: 20px;
            label {
              display: inline-block;
              width: 100px;
              text-align: right;
              color: #606266;
              flex-shrink: 0;
              padding-right: 12px;
            }
            .table-item-tag {
              color: #999;
              font-size: 12px;
              margin-top: 5px;
            }
            .up_idcard {
              border: 1px solid #ccc;
              line-height: 80px;
              height: 80px;
              border-radius: 2px;
              text-align: center;
              width: 120px;
              color: #999;
              display: inline-block;
              vertical-align: top;
              cursor: pointer;
              .card {
                width: 100%;
                height: 100%;
              }
            }
            .hint {
              line-height: 20px;
              padding: 5px 0;
              font-size: 12px;
              width: 160px;
              background: url(~css_img/hint.png) no-repeat;
              background-size: 100% 100%;
              padding-left: 18px;
              display: inline-block;
              margin-top: 50px;
            }
            .table {
              width: 620px;
              border-top: 1px solid #ccc;
              border-right: 1px solid #ccc;
              text-align: center;
              th, td {
                border-bottom: 1px solid #ccc;
                border-left: 1px solid #ccc;
                height: 36px;
              }
              th {
                font-weight: normal;
                color: #999;
              }
              input {
                width: 100%;
                border: none;
                outline: none;
                padding: 0 15px;
                color: #606266;
              }
              thead tr th {
                background: #f7f7f7;
              }
            }
          }
        }
      }
      .sign-pwd {
        .sign-pwd-tit {
          text-align: center;
          margin-bottom: 12px;
          color: #999;
          p {
            color: #aa2f33;
            margin-top: 8px;
          }
        }
      }
      .sign-btn {
        text-align: center;
        button {
          width: 118px;
          height: 40px;
          border: none;
          line-height: 40px;
          color: #fff;
          margin: 0 8px;
          border-radius: 4px;
          letter-spacing: 5px;
        }
        .save {
          background: #2f3861;
        }
        .cancel {
          background: none;
          color: #333;
        }
        .submit {
          background: #eeeeee;
          width: 300px;
          color: #333;
        }
      }
    }
  }

  .sign-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }

  .sign-left, .sign-right {
    background: #fff;
    border-radius: 4px;
  }

  .m-r-12 {
    margin-right: 12px;
  }

  .line {
    border-bottom: 1px solid #e2e1e1;
    margin: 30px 0;
  }

  .pointer {
    cursor: pointer;
  }

  .error-info {
    color: #F56C6C;
    i {
      margin-left: 10px;
      margin-right: 5px;
    }
  }
</style>
<style lang="less">
  .sign-wrap {
    .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
    .input-no-border {
      .el-input__inner {
        border: none !important;
      }
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #2f3861;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #2f3861;
      background: #2f3861;
    }
  }
</style>
<style lang="less">
  @media screen and (max-width: 750px) {
    #app {
      .sign-wrap {
        .comm_main {
          margin: 0;
        }
        .sign-left {
          width: 100%;
          margin: 0;
          padding: 0;
          .sign-tit {
            font-size: 16px;
            padding-top: 24px;
          }
          .sign-tit, .sign-subttit {
            text-align: center;
          }
          .sign-subttit {
            color: #666;
            margin-top: 16px;
            padding-bottom: 24px;
            border-bottom: 10px solid #eff3f5;
            .update-txt {
              display: none;
            }
            span {
              color: #333;
              margin-right: 0;
            }
            &::before, span:first-child::after {
              content: "●";
              color: #bebebe;
              font-size: 12px;
            }
            &::before {
              padding-right: 5px;
            }
            span:first-child::after {
              margin-left: 24px;
            }
          }
          .sign-main {
            .item-tit {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              border-left: 3px solid #aa2f33;
              padding-left: 5px;
              line-height: 16px;
            }
            .el-col-12 {
              width: 68%;
            }
            .tit750 {
              margin-left: 16px;
              margin-right: 16px;
              span {
                float: right;
                font-size: 12px;
                font-weight: normal;
                color: #aa2f33;
              }
            }
            .basic-info, .guardian_info {
              input {
                border: none;
              }
            }
            .basic-info, .sign-pwd, .guardian_info, .prize_info {
              padding: 0 16px;
            }
            .user-img {
              display: none;
            }
            .user-info {
              margin-left: 0;
            }
            .el-form-item__label {
              width: 100px !important;
            }
            .el-form-item__content {
              margin-left: 100px !important;
            }
            .sign-pwd {
              .sign-pwd-tit {
                font-size: 12px;
              }
              .el-col-offset-4{
                margin-left: 0;
              }
              .el-col-16{
                width: 100%;
              }
            }
            .sign-btn {
              padding-bottom: 24px;
            }
          }
        }
        .sign-right {
          display: none;
        }
        .line {
          border-width: 10px;
        }
        .line-1 {
          border-bottom: 1px solid #e2e1e1;
          margin-bottom: 24px;
        }
      }
    }
  }
</style>
