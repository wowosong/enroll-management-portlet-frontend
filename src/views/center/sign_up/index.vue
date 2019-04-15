<template>
  <div class="user_info">
    <div class="user_school">
      <span class="school_item">报名校区：{{planInfo.campusName}}</span>
      <span class="school_item">报名年级：{{planInfo.gradeName}}</span>
      <span v-if="!idEdit" class="float_r edit_btn" @click="idEdit = !idEdit">修改</span>
      <span v-if="idEdit" class="import_hint float_r">提示：报名提交后不支持修改"必填项"，只支持修改"非必填项</span>
    </div>
    <div class="show_edit" v-if="idEdit">
      <el-form :model="regInfo" :rules="rules" ref="ruleForm" label-width="172px">
        <div class="user_img">
          <img src="@/imgs/404.png">
          <div class="upload_btn">上传照片</div>
          <p class="upload_hint">本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</p>
        </div>
        <div class="basic_info clearfix">
          <el-form-item label="学生姓名:" required style="margin-bottom:5px">
            {{regInfo.stuName}}
          </el-form-item>
          <el-form-item label="身份证号:" required style="margin-bottom:5px">
            {{regInfo.idCard}}
          </el-form-item>
          <el-form-item label="出生日期:" required style="margin-bottom:5px">
            {{regInfo.stuBirthday}}
          </el-form-item>
          <el-form-item label="性别:" required style="margin-bottom:5px">
            {{genderMap[regInfo.stuGender]}}
          </el-form-item>
          <el-form-item label="户籍所在地:">
            <el-cascader
              style="width: 100%"
              filterable
              :options="addList"
              v-model="regInfo.stuAdds"/>
          </el-form-item>
          <el-form-item label="现就读学校:">
            <el-input v-model="regInfo.nowSchool" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="现就读年级:">
            <el-select clearable v-model="regInfo.nowGrade">
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.gradeName"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="总分年级排名/年级人数:">
            <el-input
              type="number"
              min="1"
              step="1"
              v-model="regInfo.otherData['s_a']"
              placeholder="年级排名"
              style="width:98px"/>
            <el-input
              type="number"
              min="1"
              step="1"
              v-model="regInfo.otherData['s_b']"
              placeholder="年级人数"
              style="width:98px"/>
          </el-form-item>
        </div>
        <el-form-item label="监护人:" label-width="82px">
          <table class="table_list">
            <thead>
            <tr>
              <th>姓名</th>
              <th>手机</th>
              <th>学历</th>
              <th>工作单位</th>
              <th>职务</th>
            </tr>
            </thead>
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
          </table>
        </el-form-item>
        <el-form-item label="获奖信息:" label-width="82px">
          <table class="table_list">
            <thead>
            <tr>
              <th>获奖时间</th>
              <th>获奖名称</th>
              <th>奖项等级</th>
            </tr>
            </thead>
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
          </table>
        </el-form-item>
        <el-form-item label="获奖附件:" label-width="82px">
          <div class="img_thumbnail">
            <img src="@/imgs/404.png">
            <div class="big_btn_l" @click="showBigImg()"></div>
          </div>
          <div class="upload_item">
            <div class="up_idcard" @click="uploaddDutyFile">
              <template><img src="@/imgs/upload.png">上传证件</template>
            </div>
            <div class="hint prove">证明您的获奖情况</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="show_info" v-if="!idEdit">
      <table>
        <tbody>
        <tr>
          <td rowspan="4" width="30%"><img src="@/imgs/404.png" class="user_img"></td>
          <td width="84px" align="right">学生姓名：</td>
          <td width="130px">{{regInfo.stuName}}</td>
          <td width="162px" align="right">身份证号：</td>
          <td>{{regInfo.idCard}}</td>
        </tr>
        <tr>
          <td align="right">出生日期：</td>
          <td>{{regInfo.stuBirthday | dateFormatYmd}}</td>
          <td align="right">性别：</td>
          <td>{{genderMap[regInfo.stuGender]}}</td>
        </tr>
        <tr>
          <td align="right">户籍所在地：</td>
          <td>{{regInfo.localStr}}</td>
          <td align="right">现就读学校：</td>
          <td>{{regInfo.nowSchool}}</td>
        </tr>
        <tr>
          <td align="right">现就读年级：</td>
          <td>{{regInfo.nowGradeName}}</td>
          <td align="right">总分年级排名/年级人数：</td>
          <td>{{regInfo.otherData['s_a']}}/{{regInfo.otherData['s_b']}}</td>
        </tr>
        </tbody>
      </table>
      <table>
        <tbody>
        <tr>
          <td width="82px" valign="top" align="right">监护人：</td>
          <td>
            <table class="table_list">
              <thead>
              <tr>
                <th>姓名</th>
                <th>手机</th>
                <th>学历</th>
                <th>工作单位</th>
                <th>职务</th>
              </tr>
              </thead>
              <tr v-for="i in 2" :key="i">
                <td>
                  {{regInfo.parents[i-1]['s_g']}}
                </td>
                <td>
                  {{regInfo.parents[i-1]['s_h']}}
                </td>
                <td>
                  {{regInfo.parents[i-1]['s_i']}}
                </td>
                <td>
                  {{regInfo.parents[i-1]['s_j']}}
                </td>
                <td>
                  {{regInfo.parents[i-1]['s_k']}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <div class="table-item">
          <div v-if="regInfo.rewards && regInfo.rewards.length">
            <label>获奖信息:</label>
            <div v-for="(item, idx) in regInfo.rewards" :key="idx">
              {{item['s_c']}} {{item['s_d']}} {{item['s_e']}}
            </div>
            <div v-if="regInfo.rewardFile && regInfo.rewardFile.length ">
              <label>获奖附件:</label>
              <div class="up_idcard" @click="showBig">
                <img
                  v-if="regInfo.rewardFile[0].fieldValue"
                  :src="imgUrl+regInfo.rewardFile[0].fieldValue"
                  @error="errorImg($event,'image')">
                <div class="big_btn_l" @click="showBigImg()"></div>
                <i class="el-icon-zoom-in"></i>
              </div>
            </div>
          </div>
        </div>
        </tbody>
      </table>
    </div>
    <div class="big_img" v-if="isShowBigImg">
      <div class="img_main">
        <span class="close_btn" @click="isShowBigImg = false"></span>
        <img :src="imgUrl+regInfo.rewardFile[0].fieldValue">
      </div>
    </div>
  </div>
</template>
<script>
  import cityPicker from '@/components/cityPicker'

  export default {
    components: {
      cityPicker
    },
    data() {
      return {
        // 绑数据
        userInfo: window.userInfo,
        planInfo: {},
        regInfo: {
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
        planId: "",
        regId: "",
        editFlag: false,
        addList: [],
        gradeList: [],
        fileList: [],
        saveFlag: false,
        gradeMap: {},
        operation: "",
        otherEnum: "",
        enumMap: {},
        saving: false,
        // 性别数据
        genderList: [{
          seiValue: 0,
          seiName: "男"
        }, {
          seiValue: 1,
          seiName: "女"
        }],
        genderMap: {1: "女", 0: "男"},

        // 原始
        idEdit: false,
        isShowBigImg: false,
        bigFileId: '',
        bigImgUrl: '/gateway/zuul/filesystem/api/data/original/',
        imgUrl: '/gateway/zuul/filesystem/api/image/thumbnail/',
        formData: {
          name: '张三三',
          idCard: 510923199205185908,
          birth: '1992-05-18',
          gender: '女',
          address: "案件司法是解放军爱的飒飒的会计法",
          grade: '0',
          rank: 1,
          number: 1000
        },
        options: [
          {
            value: '0',
            label: '一年级'
          },
          {
            value: '2',
            label: '二年级'
          },
        ],
        rules: {}
      }
    },
    mounted() {
      const vm = this;
      vm.getEnum();
      vm.getAddList();
      vm.getGradeList();
      http.get("/enroll/api/erRegister/byPhone", {params: {phoneNum: vm.userInfo.logonName}}).then((xhr) => {
        if (xhr.data.code) {
          return;
        }
        vm.planId = xhr.data.data.planId;
        vm.regId = xhr.data.data.regId;
        vm.getPlanInfo();
        vm.getReg();
      })

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
        if (vm.regInfo.stuAdds && vm.regInfo.stuAdds.length) {
          vm.regInfo.stuAdd = vm.regInfo.stuAdds.join(",");
          for (let key of vm.regInfo.stuAdds) {
            let obj = {};
            for (let addObj of al) {
              if (addObj.value == key) {
                obj = addObj;
                break;
              }
            }
            vm.regInfo.localStr += obj.label;
            if (obj.children && obj.children.length) {
              al = obj.children;
            }
          }
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
        // vm.regInfo.creatorId = "00001111000011110000111100001111"
        http.put("/enroll/api/erRegister", vm.regInfo).then((xhr) => {
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
        http.get("/enroll/api/erRegister/" + vm.regId).then((xhr) => {
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
          if (vm.regInfo.rewardFile && vm.regInfo.rewardFile.length) {
            for (let file of vm.regInfo.rewardFile) {
              vm.fileList.push({fileName: file.fieldText, fileId: file.fieldValue})
            }
          }
          if (vm.regInfo.stuAdd) {
            vm.regInfo.stuAdds = vm.regInfo.stuAdd.split(",");
          }
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
          http.get("/gateway/platform/api/enum/queryByCodes/" + enumCodes)
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
      showBigImg() {

      },
    }
  }
</script>
<style lang="less" scoped>
  .user_school {
    margin: 30px 0 30px 0;
  }

  .import_hint {
    color: #999;
  }

  .float_r {
    float: right;
  }

  .school_item {
    margin-right: 20px;
  }

  .edit_btn {
    color: #aa2f33;
    cursor: pointer;
  }

  .edit_btn:hover {
    color: #de0b12;
  }

  .show_info {
    table {
      width: 100%;
      margin-bottom: 10px;
    }
    .user_img {
      width: 130px;
      height: 170px;
      margin-left: 30px;
    }
  }

  .show_edit {
    position: relative;
    .user_img {
      position: absolute;
      width: 130px;
      left: 40px;
      img {
        width: 130px;
        height: 170px;
        border: 1px solid #ccc;
      }
    }
    .upload_btn {
      border: 1px solid #ccc;
      line-height: 40px;
      text-align: center;
      color: #666;
      margin-top: 20px;
      cursor: pointer;
      background: url('~@/imgs/upload.png') no-repeat 40px center;
      padding-left: 20px;
    }
    .upload_hint {
      font-size: 12px;
      color: #999;
      margin-top: 20px;
    }
    .basic_info {
      margin-left: 180px;
    }
  }

  .table_list {
    width: 100%;
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

  .pin_wink {
    width: 80%;
    td {
      height: 30px;
    }
  }

  .img_thumbnail {
    display: inline-block;
    width: 150px;
    height: 100px;
    border: 1px solid #ccc;
    padding: 4px;
    position: relative;
    vertical-align: top;
    img {
      width: 100%;
      height: 100%;
    }
    .big_btn_l {
      position: absolute;
      top: 2px;
      right: 2px;
      bottom: 2px;
      left: 2px;
      z-index: 1;
      background: url(~@/imgs/big_btn.png) no-repeat rgba(0, 0, 0, .2);
      background-position: 115px 65px;
      cursor: pointer;
    }
  }

  .big_img {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    z-index: 1000;
  }

  .big_img .img_main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }

  .big_img img {
    max-height: 100%;
    max-width: 100%;
  }

  .close_btn {
    width: 36px;
    height: 36px;
    background: url(~@/imgs/close.png) no-repeat;
    display: block;
    position: absolute;
    right: -18px;
    top: -18px;
    cursor: pointer;
  }

  .upload_item {
    display: inline-block;
  }

  .upload_item .up_idcard {
    border: 1px solid #ccc;
    line-height: 100px;
    height: 100px;
    border-radius: 2px;
    text-align: center;
    width: 150px;
    color: #999;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 30px;
  }

  .upload_item .up_idcard img {
    vertical-align: middle;
    margin-right: 5px;
  }

  .upload_item .card {
    float: left;
  }

  .upload_item .hint {
    line-height: 20px;
    padding: 5px 0;
    font-size: 12px;
    width: 160px;
    background: url(~@/imgs/hint.png) no-repeat;
    background-size: 100% 100%;
    padding-left: 18px;
    display: inline-block;
    margin-top: 70px;
  }

  .area_margin {
    margin: 0 !important;
  }
</style>
<style lang="less">
  .table_list {
    .el-input__inner {
      border: none;
    }
  }
</style>


