<template>
  <div class="container sign-wrap">
    <div class="comm_main">
      <div class="sign-left">
        <h6 class="sign-tit">[{{formData.campusName}}]{{formData.planYear}}小升初招生计划</h6>
        <div class="sign-subttit">报名校区：<span>{{formData.campusName}}</span> 报名年级：<span>{{formData.className}}</span>
        </div>
        <!--基本信息-->
        <div class="sign-main" id="info">
          <p class="item-tit">基本信息
            <template v-if="formData.auditStatus == -1 || formData.auditStatus == 2">
              <span v-if="!formData.info.status">修改</span>
            </template>
          </p>
          <el-form :model="formData.info" :rules="rules" ref="ruleForm" label-width="170px">
            <div class="basic-info">
              <div class="user-img">
                <div class="user_photo">
                  <img :src="imgUrl+formData.info.pictureFileId" v-if="formData.info.pictureFileId">
                </div>
                <div class='img_null' v-if="userImgErr">证件照不能为空</div>
                <div class="up_suerphoto" v-if="!isShow" @click="uploadPicture">
                  <img src="@/imgs/upload.png">上传证件
                </div>
                <p v-if="!formData.info.status">本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</p>
              </div>
              <div class="user-info">
                <el-form-item label="学生姓名:" prop="name" id="formData_name">
                  <el-col :span="12">
                    <el-input v-model="formData.info.name"></el-input>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="身份证号:" prop="idCardNum" id="formData_idCardNum">
                  <el-col :span="12">
                    <el-input v-model="formData.info.idCardNum" @change="idCardNumFn"></el-input>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="出生日期:" prop="birthDate">
                  <el-col :span="12">
                    <el-input v-model="formData.info.birthDate" readonly></el-input>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="性别:" prop="gender" id="formData_gender">
                  <el-radio-group v-model="formData.info.gender">
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
                  <el-col :span="18">
                  </el-col>
                </el-form-item>
                <el-form-item label="现就读学校:">
                  <el-col :span="12">
                    <el-input v-model="formData.info.nowSchoolName"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="现就读年级:" prop="nowClassName">
                  <el-col :span="12">
                    <el-select v-model="formData.info.nowClassName" placeholder="请选择">
                      <!--<el-option-->
                      <!--v-for="item in options"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                      <!--</el-option>-->
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="总分年级排名/年级人数:">
                  <el-row>
                    <el-col :span="6" class="m-r-12">
                      <el-input v-model="formData.info.ranking"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="formData.info.personCount"></el-input>
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
                    <tr v-for="item in formData.info.guardianInfo">
                      <td><input type="text" v-model="item.name"></td>
                      <td><input type="text" v-model="item.tel"></td>
                      <td><input type="text" v-model="item.education"></td>
                      <td><input type="text" v-model="item.workPlace"></td>
                      <td><input type="text" v-model="item.post"></td>
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
                      <tr v-for="item in formData.info.guardianInfo">
                        <td>
                          <el-date-picker v-model="item.name" type="date" placeholder="年-月-日"></el-date-picker>
                        </td>
                        <td><input type="text" v-model="item.tel"></td>
                        <td><input type="text" v-model="item.tel"></td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="table-item-tag">填写示例：2018年3月1日 四川省级科创比赛 一等奖</div>
                  </div>
                </div>
                <div class="table-item">
                  <label>获奖附件:</label>
                  <div class="up_idcard">
                    <template v-if="!formData.enrollFileId">
                      <img src="@/imgs/upload.png">上传证件
                    </template>
                    <img v-if="formData.enrollFileId" :src="imgUrl+formData.enrollFileId" class="card">
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
                  <el-form-item label="登录名:" prop="username">
                    <el-col :span="18">
                      <el-input v-model="formData.info.username" placeholder="请输入手机号"></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="设置密码:" prop="pwd">
                    <el-col :span="18">
                      <el-input v-if="!isPwd" type="password" v-model="formData.info.pwd" placeholder="默认密码 (身份证号后六位)">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                      <el-input v-if="isPwd" type="text" v-model="formData.info.pwd">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="确认密码:" prop="repwd">
                    <el-col :span="18">
                      <el-input v-if="!isRePwd" type="password" v-model="formData.info.repwd" placeholder="默认密码 (身份证号后六位)">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="!isRePwd" @click="isRePwd = !isRePwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="isRePwd" @click="isRePwd = !isRePwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                      <el-input v-if="isRePwd" type="text" v-model="formData.info.repwd">
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

          <!--间隔线-->
          <div class="line"></div>
          <div class="sign-btn">
            <button class="submit" @click="submitForm">提交报名</button>
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
  export default {
    name: "index",
    data() {
      return {
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
            username:'',
            pwd:'',
            repwd:''
          }
        },
        // 表单验证
        rules: {
          name: [{required: true, message: '必填项', trigger: 'blur'}],
          idCardNum: [
            {required: true, message: '必填项', trigger: 'blur'},
            { min: 15, max: 18, message: '格式有误', trigger: 'blur' }
            ],
          username: [{required: true, message: '必填项', trigger: 'blur'}],
          birthDate: [{required: true, message: '必填项', trigger: 'change'}],
          gender: [{required: true, message: '必填项', trigger: 'change'}]
        },
        // 性别数据
        genderList: [],
        // 登录信息
        loginForm: {},
      }
    },
    mounted() {
      // 查询性别
      this.queryGender();
    },
    methods: {
      pointFn(type) {
        document.getElementById(type).scrollIntoView();
        this.current = type
      },
      // 查询性别
      queryGender() {
        let vm = this;
        http.get('/gateway/platform/mobile/enum/queryByCodes/XingBie').then(function (xhr) {
          let arr = [];
          _.each(xhr.data, function (v) {
            if (v.seiValue != 3)
              arr.push(v)
          });
          vm.genderList = arr;
        })
      },
      // 根据身份证号码识别出生日期
      idCardNumFn() {
        let vm = this;
        vm.formData.info.idCardNum = $.trim(vm.formData.info.idCardNum);
        let idCardNum = vm.formData.info.idCardNum;
        let pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (pattern.test(idCardNum)) {
          vm.formData.info.birthDate = idCardNum.substring(6, 10) + "-" + idCardNum.substring(10, 12) + "-" + idCardNum.substring(12, 14);
        } else {
          vm.formData.info.birthDate = ''
        }
      },
      // 上传图片
      uploadPicture() {
        let vm = this;
        fileUpload({
          title: '上传附件照片',
          uploadFileMaxNum: 1,
          formats: 'png,jpg,jpeg',
          extensions: 'png,jpg,jpeg',
          confirm: function (files) {
            vm.formData.info.pictureFileId = files[0].id;
            if (vm.formData.info.pictureFileId) {
              vm.userImgErr = false
            }
          }
        });
      },
      // 保存
      save(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            if(!vm.formData.info.name) return document.getElementById('formData_name').scrollIntoView();

            if(!vm.formData.info.idCardNum)return document.getElementById('formData_idCardNum').scrollIntoView();

            if(!vm.formData.info.gender) return document.getElementById('formData_gender').scrollIntoView();
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消
      cancel(formName) {
        this.$refs[formName].resetFields();
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
    }
    .sign-main {
      margin: 30px 0;
      .item-tit {
        color: #666;
        margin-bottom: 30px;
        span {
          float: right;
          color: #00b7ee;
          cursor: pointer;
        }
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
