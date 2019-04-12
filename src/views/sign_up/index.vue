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
          <p class="item-tit">基本信息</p>
          <template v-if="!saveFlag">
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
                      <el-input v-model="regInfo.stuName"></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="身份证号:" prop="idCard" id="formData_idCardNum">
                    <el-col :span="12">
                      <el-input v-model="regInfo.idCard" @change="idCardNumFn"></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="出生日期:" prop="stuBirthday">
                    <el-col :span="12">
                      <el-input v-model="regInfo.stuBirthday" readonly></el-input>
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
                    <el-col :span="22">
                      <!--省市区县(传省市区id)-->
                      <!--<cityPicker :selectedFn="getArea"></cityPicker>-->
                      <el-cascader
                        style="width: 100%"
                        filterable
                        :options="addList"
                        v-model="regInfo.stuAdds"/>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="现就读学校:">
                    <el-col :span="12">
                      <el-input v-model="regInfo.nowSchool"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="现就读年级:" prop="nowGrade">
                    <el-col :span="12">
                      <el-select clearable v-model="regInfo.nowGrade">
                        <el-option
                          v-for="item in gradeList"
                          :key="item.id"
                          :label="item.gradeName"
                          :value="item.id"/>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="总分年级排名/年级人数:">
                    <el-row>
                      <el-col :span="6" class="m-r-12">
                        <el-input type="number" min="1" step="1" v-model="regInfo.otherData['s_a']"></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-input type="number" min="1" step="1" v-model="regInfo.otherData['s_b']"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
                <div class="user-info-table">
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
                      <tr v-for="i in 2" :key="i">
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
                        <tr v-for="i in 3" :key="i">
                          <td>
                            <el-date-picker
                              placeholder="年/月/日"
                              @change="changeDate"
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
              <!--间隔线-->
              <div class="line"></div>
              <!--登录密码-->
              <div class="sign-pwd" id="pwd">
                <p class="item-tit">登录密码</p>
                <div class="sign-pwd-tit">
                  请设置密码，建议使用数字、字母、字符的组合密码且长度超过6位
                  <p>若未设置密码，下次登录的密码为“身份证号后六位”</p>
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
              <button class="save" @click="save('ruleForm')">保存</button>
              <button class="cancel" @click="cancel('ruleForm')">取消</button>
            </div>
          </template>
          <!--预览信息-->
          <div v-else>
            <baseInfo :formData="regInfo"></baseInfo>
            <!--间隔线-->
            <div class="line"></div>
            <div class="sign-btn">
              <button class="submit" @click="submitForm">提交报名</button>
            </div>
          </div>
        </div>
      </div>
      <!--nav-->
      <div class="sign-right">
        <div class="nav_point">
          <div class="point" :class="{active:current == 'info'}" @click="pointFn('info')">基本信息</div>
          <div class="point" :class="{active:current == 'pwd'}" @click="pointFn('pwd')">登录密码</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import baseInfo from './comp/baseInfo'
  import cityPicker from '@/components/cityPicker'

  export default {
    name: "index",
    components: {baseInfo, cityPicker},
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
        saveFlag: false,
        gradeMap: {},
        operation: "",
        otherEnum: "",
        enumMap: {},
        saving: false,

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
          stuBirthday: [{required: true, message: '必填项', trigger: 'change'}],
          stuGender: [{required: true, message: '必填项', trigger: 'change'}]
        },
        // 性别数据
        genderList: [{
          seiValue: 0,
          seiName: "男"
        }, {
          seiValue: 1,
          seiName: "女"
        }],
        // 登录信息
        loginForm: {},
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
      saveInfo() {
        const vm = this;
        vm.saving = true;
        vm.regInfo.planId = vm.planId;
        vm.regInfo.nowGradeName = vm.gradeMap[vm.regInfo.nowGrade]
        vm.regInfo.rewardFile = [];
        if (vm.fileList && vm.fileList.length) {
          for (let file of vm.fileList) {
            vm.regInfo.rewardFile.push({fieldText: file.fileName, fieldValue: file.fileId});
          }
        }
        vm.regInfo.localStr = "";
        let al = vm.addList;
        for (let key of vm.regInfo.stuAdds) {
          let obj = al[key];
          vm.regInfo.localStr += obj.label;
          if (obj.children && obj.children.length) {
            al = obj.children;
          }
        }
        if (vm.regInfo.stuAdds && vm.regInfo.stuAdds.length) {
          vm.regInfo.stuAdd = vm.regInfo.stuAdds.join(",");
        }
        for (let i = 0; i < 3; i++) {
          let reward = vm.regInfo.rewards[i];
          for (let key in reward) {
            let value = reward[key];
            if (value) {
              if (key == "s_c") {
                value = vm.enrollCommon.dateFormatYmd(value);
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
        vm.regInfo.createId = "00001111000011110000111100001111"
        http.post("/enroll/api/erRegister", vm.regInfo).then((xhr) => {
          vm.saving = false;
          if (xhr.data.code) {
            return;
          }
          vm.saveFlag = true;
        })
      },
      getReg() {
        const vm = this;
        vm.planFlag = true;
        http.get("/enroll/erRegister/empty").then((xhr) => {
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
        var enumCodes = "studentsType,xsbq";
        Promise.all([
          http.get("/gateway/platform/mobile/enum/queryByCodes/" + enumCodes)
        ]).then(function (list) {
          vm.stuTypes = _.filter(list[0].data, function (i) {
            return i.code == "studentsType";
          });
          vm.tagList = _.filter(list[0].data, function (i) {
            return i.code == "xsbq";
          });
        });
      },
      getAddList() {
        const vm = this;
        vm.addList = [];
        http.get("/enroll/erRegister/locals").then((xhr) => {
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
        http.get("/enroll/erEnrollPlan/" + vm.planId).then((xhr) => {
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
      // 查询性别
      // queryGender() {
      //   let vm = this;
      //   http.get('/gateway/platform/mobile/enum/queryByCodes/XingBie').then(function (xhr) {
      //     let arr = [];
      //     _.each(xhr.data, function (v) {
      //       if (v.seiValue != 3)
      //         arr.push(v)
      //     });
      //     vm.genderList = arr;
      //   })
      // },
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
      //省市区组件method
      getArea(e) {

      },
      // 保存
      save(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            vm.saveInfo();
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
      color: #666;
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
              margin-right: 15px;
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
            }
            .table input {
              width: 100%;
              border: none;
              outline: none;
              padding: 0 15px;
              color: #606266;
            }
            .table thead,
            .table tbody tr.tit {
              background: #f7f7f7;
            }
            .table td.tit {
              background: #f7f7f7;
            }
            .table th {
              border-bottom: 1px solid #ccc;
              border-left: 1px solid #ccc;
              height: 40px;
              color: #999;
            }
            .table > tbody > tr > td {
              height: 40px;
              border-bottom: 1px solid #ccc;
              border-left: 1px solid #ccc;
              text-align: center;
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
    .el-radio__input.is-checked + .el-radio__label {
      color: #2f3861;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #2f3861;
      background: #2f3861;
    }
  }
</style>
