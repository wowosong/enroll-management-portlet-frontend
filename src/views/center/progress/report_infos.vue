<template>
  <div class="content">
    <!-- 本人信息 -->
    <div v-show="cuid == 1 ">
      <div class="top-title">本人信息</div>
      <div class="box">
        <ul class="list">
          <li v-for="(it,index) in brInfo" :key="index">
            <div class="title-box">
              <span class="name">
                <span class="show" v-if="it.isRequired == 1">*</span>
                {{it.fieldName}}:
              </span>
              <div class="item-box">
                <!-- <div class="el-box"> -->
                <span v-if="it.domType == 3 && flag" class="sel-box">
                  <el-select clearable v-model="it.fieldValue">
                    <el-option
                      v-for="item in enumMap[it.fieldCode]"
                      :key="item.seiValue"
                      :label="item.seiName"
                      :value="item.seiValue"
                      :style="width='100%'"
                    />
                  </el-select>
                </span>
                <el-date-picker
                  v-else-if="it.domType == 4 && (it.fieldValue == '' || it.editable)"
                  type="date"
                  placeholder="选择出生日期"
                  v-model="it.fieldValue"
                  format="yyyy-MM-dd"
                  class="sel-csrq"
                ></el-date-picker>
                <el-cascader
                  v-model="it.fieldValue"
                  v-else-if="it.domType == 5 && flag && it.editable"
                  filterable
                  :options="addList"
                  @change="handleChange"
                 
                />
                <el-autocomplete
                  v-model="it.fieldValue"
                  :fetch-suggestions="querySearch"
                  v-else-if="it.domType == 8 && flag && it.editable"
                  placeholder="请输入内容"
                 style="width: 100%"
                />
                <span v-else class="el-input">
                    <span class="el-inputs">
                  <el-input
                    v-model="it.fieldValue"
                    type="text"
                    :placeholder="it.reamkText"
                    :disabled="it.isEdit != 1 && it.fieldValue != '' && !it.editable"
                  ></el-input>
                  </span>
                </span>
                <span v-if="it.fieldClass.indexOf('append') != -1" class="el-input el-input-bs">
                    <el-input v-model="it.remark" type="text" :placeholder="it.reamkText"></el-input>
                </span>
                <!-- <div v-if="!isPhone" class="pc-input">
                  <el-input
                    v-model="it.remark"
                    :placeholder="it.reamkText"
                    class="inputs"
                    v-if="it.reamkText != ''"
                  ></el-input>
                </div> -->
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="items-btn-box">
        <el-button @click="clickDown(1)" class="item-btn">保存至下一步</el-button>
      </div>
      
    </div>
    <!-- 家长信息 -->
    <div v-show="cuid == 2 ">
      <div class="top-title">家长信息</div>
      <div class="box">
        <ul class="list">
          <li v-for="(parent,index) in parentInfo" :key="index">
            <div class="title-box">
              <span class="name">
                <span class="show" v-if="parent.isRequired == 1">*</span>
                {{parent.fieldName}}:
              </span>

              <div class="item-box">
                <span v-if="parent.domType == 3 && flag">
                  <el-select clearable v-model="parent.fieldValue">
                    <el-option
                      v-for="item in enumMap[parent.fieldCode]"
                      :key="item.seiValue"
                      :label="item.seiName"
                      :value="item.seiValue"
                    />
                  </el-select>
                </span>
                <span v-else class="el-input">
                    <span v-if="parent.fieldText != ''">{{parent.fieldValue}}</span>
                    <span v-if="parent.fieldText == ''">
                  <el-input
                    v-model="parent.fieldValue"
                    type="text"
                    :placeholder="parent.reamkText"
                    :disabled="parent.isEdit != 1 && parent.fieldValue != '' && !parent.editable"
                  ></el-input>
                  </span>
                </span>

                <span v-if="parent.fieldClass.indexOf('append') != -1">
                  <el-input v-model="parent.remark" type="text" :placeholder="parent.reamkText"></el-input>
                </span>
               
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="parents-btn-box">
        <el-button @click="clickUpdata" class="item">上一步</el-button>
        <el-button @click="clickDown(2)" class="item">保存至下一步</el-button>
      </div>
    </div>
    <!-- 其他信息 -->
    <div v-show="cuid == 3">
      <div class="top-title">其他信息</div>
      <div class="box">
        <ul class="list">
          <li v-for="(other,index) in otherInfo" :key="index">
            <div class="title-box">
              <span class="name">
                <span class="show" v-if="other.isRequired == 1">*</span>
                {{other.fieldName}}:
              </span>

              <div class="item-box">
                <span v-if="other.domType == 3 && flag">
                  <el-select clearable v-model="other.fieldValue">
                    <el-option
                      v-for="item in enumMap[other.fieldCode]"
                      :key="item.seiValue"
                      :label="item.seiName"
                      :value="item.seiValue"
                    />
                  </el-select>
                  <span v-if="other.fieldClass.indexOf('append') != -1">
                    <el-input v-model="other.remark" type="text"></el-input>
                  </span>
                </span>
                <span v-else class="el-input">
                    <span v-if="other.fieldText != ''">{{other.fieldValue}}</span>
                    <span v-if="other.fieldText == ''">
                  <el-input
                    v-model="other.fieldValue"
                    type="text"
                    :placeholder="other.reamkText"
                    :disabled="other.isEdit != 1 && other.fieldValue != '' && ! other.editable"
                  ></el-input>
                    </span>
                </span>

                <span v-if="other.fieldClass.indexOf('append') != -1">
                  <el-input v-model="other.remark" type="text" :placeholder="other.reamkText"></el-input>
                </span>
              
              </div>
             
            </div>
          </li>
        </ul>
      </div>
      <div class="other-btn-box">
        <div class="btn-box">
          <el-button @click="clickUpdata" class="item-other">上一步</el-button>
          <el-button @click="clickX(false)" class="item-other">保存</el-button>
        </div>
        <div class="btn-submit-box">
          <el-button @click="clickX(true)" class="item-submit">保存并提交</el-button>
        </div>
      </div>
    </div>
    <template>
      <el-button :plain="true" @click="open3" v-if="isJG">警告</el-button>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      brInfo: [], // 本人信息
      parentInfo: [], // 家长信息
      otherInfo: [], // 其他信息
      info: [],
      configList: [],
      enumMap: {},
      itemMap: {},
      addList: [],
      flag: false,
      cuid: 1, // 当前页面
      isJG: false,
      isPhone: null,
      isSubmit: false, // 判断点击保存还是保存并提交  保存为false  保存提交为ture
      list: [
        {
          id: 1,
          name: "本人信息"
        },
        {
          id: 2,
          name: "家长信息"
        },
        {
          id: 3,
          name: "其他信息"
        }
      ]
    };
  },
  created() {
    let vm = this;
     
    vm.getAddList();
    http.get(
        "/gateway/enroll/api/erReport/getByReportInfo/" +
          localStorage.getItem("planid") +
          "/" +
          localStorage.getItem("regid")
      )
      .then(xhr => {
        if(xhr.data.fieldInfos.length == 0) {
          vm.$message.warning("请导入表单信息");
          return
        }
        console.log(xhr)
        vm.configList = xhr.data;
        vm.brInfo = []; // 本人信息
        vm.parentInfo = []; // 家长
        vm.otherInfo = []; // 其他
        let idx = 0;
        let parentTemp = [];
        let temp = ["s_g", "s_h", "s_j"
        // , "s_i", "s_k"
        ];
        //处理数据字典下拉列表数据
        if (vm.configList.fieldInfos && vm.configList.fieldInfos.length) {
          let map = {};
          for (let field of vm.configList.fieldInfos) {
            if (field.dicUri) {
              map[field.fieldCode] = field.dicUri;
            }
          }
          if (map && map != {}) {
            vm.getOtherEnum(map);
          }
        }
        for (let i of vm.configList.fieldInfos) {
          vm.$set(i, "editable", false);
          if (!i.fieldValue) {
            i.fieldValue = "";
            i.editable = true;
          }
          if (i.classifyName == "本人信息") {
            vm.brInfo.push(i);
          } else if (i.classifyName == "家长信息") {
            vm.parentInfo.push(i);
            if (vm.configList.flag) {
              i.batNum = 1;
              if (temp.indexOf(i.fieldCode) != -1) {
                let temp = _.cloneDeep(i);
                temp.batNum = 2;
                parentTemp.push(temp);
                idx = vm.parentInfo.length;
              }
            }
          } else {
            vm.otherInfo.push(i);
          }
        }
        if (vm.parentInfo && parentTemp && parentTemp.length) {
          vm.parentInfo = vm.parentInfo
            .slice(0, idx)
            .concat(parentTemp)
            .concat(vm.parentInfo.splice(idx));
        }
      });
    
    this.isPhone = this.$store.state.isPhone;
    // this.items = res.data.fieldInfos
  },
  mounted: {},
  methods: {
    getAddList() {
      const vm = this;
      vm.addList = [];
      http.get("/gateway/enroll/erRegister/locals").then(xhr => {
        if (xhr.data.code) {
          return;
        }
        if (!xhr.data.data || !xhr.data.data.length) {
          return;
        }
        vm.addList = xhr.data.data;
        vm.flag = true;
      });
    },
    querySearch(queryString, cb) {
      let restaurants = this.schoolList;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.seiName.toLowerCase().indexOf(queryString.toLowerCase()) !=
          -1
        );
      };
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
      ]).then(function(list) {
        vm.schoolList = _.filter(list[0].data, function(i) {
          if (i.code == "XXLB") {
            vm.$set(i, "value", i.seiName);
          }
          return i.code == "XXLB";
        });
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
          let items = {};
          for (let enumItem of list[0].data) {
            if (enumItem.code == key) {
              enums.push(enumItem);
              items[enumItem.seiValue] = enumItem.seiName;
            }
          }
          for (let c of codes) {
            vm.enumMap[c] = enums;
            vm.itemMap[c] = items;
          }
          vm.flag = true;
        }
      });
    },
    clickX(e) {
      //console.log(this.other);
      let vm = this;

       vm.$ispreview = 1
      localStorage.is = 1
      console.log(vm.$ispreview)
      let saveData = [];
      saveData = saveData
        .concat(vm.brInfo)
        .concat(vm.parentInfo)
        .concat(vm.otherInfo);
      if (saveData && saveData.length > 0) {
        let mobileRes = /^1[34578]\d{9}$/;
        for (let i of saveData) {
          //判断带*的是否填写
          if (i.isRequired == 1) {
            if (!i.fieldValue) {
              vm.$message.warning("带*号的为必填项！");
              return;
            }
          }
          if (
            i.fieldCode == "s_h" &&
            i.fieldValue &&
            !mobileRes.test(i.fieldValue)
          ) {
            vm.$message.warning("请输入正确格式的监护人手机号");
            return;
          }

          if (i.fieldCode == "s_birthday" && i.fieldValue) {
            i.fieldValue = moment(i.fieldValue).format("YYYY-MM-DD HH:mm:ss");
          }

          if (i.fieldCode == "s_hjszd" && i.fieldValue) {
            if (i.fieldValue.indexOf("/") == -1) {
              i.fieldValue = i.fieldValue.join(",");
            }
          }
          //把i.fieldText 置为''
          i.fieldText = "";
          if (vm.enumMap[i.fieldCode]) {
            let items = vm.enumMap[i.fieldCode];
            for (let item of items) {
              if (item.seiValue == i.fieldValue) {
                i.fieldText = item.seiName;
                break;
              }
            }
          }
        }
      }

      vm.isSubmit = e;

      http.post(
          "/gateway/enroll/api/erReport/insertFieldInfo/" +
            localStorage.getItem("regid") +
            "/" +
            localStorage.getItem("planid") +
            "/" +
            vm.isSubmit,
            saveData
        )
        .then(res => {
          //console.log(res);
          if(res.data.code == 0) {
            vm.$emit('nodefn')
          }
        });
      
    },
    // 点击上一步
    clickUpdata() {
      this.cuid = this.cuid - 1;
    },
    //  下一步
    clickDown(e) {
      let that = this;
        console.log(that.brInfo)
    //      parentInfo: [], // 家长信息
    //   otherInfo: [], // 其他信息
    //   
      let i = 0
    if(e == 1){
        that.brInfo.forEach(item => {
            if(item.fieldValue == '' && item.isRequired == 1){
                return i = 1
            }
        });
        if(i == 1 ) {
            that.open3()
        }else {
            that.cuid = that.cuid + 1;
        }
    }
    if(e == 2){
        that.parentInfo.forEach(item => {
            if(item.fieldValue == '' && item.isRequired == 1){
                return i = 1
            }
        });
        if(i == 1 ) {
            that.open3()
        }else {
            that.cuid = that.cuid + 1;
        }
    }
    },
    open3() {
      this.$message({
        message: "带*的是必填项",
        type: "warning"
      });
    },
    handleChange() {}
  }
};
</script>
<style lang="less" scoped>
.content {
  border-top: 1px solid #cccccc;
  margin-top: 30px;
  .top-title {
    border-left: 10px solid #97330e;
    margin-top: 30px;
    line-height: 30px;
    padding-left: 8px;
  }
  .box {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #cccccc;
  }
}
.el-inputs {
    width: 100%;
}
.el-select {
    display: block;
}
.el-cascader {
    width: 220px;
}
.el-input {
    width: 100%;
}
.sel-csrq {
    width: 220px;
}
.show {
  color: red;
  padding-right: 2px;
}
.name {
  display: inline-block;
  width: 150px;
  color: #666666;
  text-align: right;
}
.vlue {
  display: inline-block;
}
.list li {
  margin-top: 30px;
  line-height: 35px;
}
.item-box {
  display: flex;
  align-items: center;
  width: 80%;
  padding-left: 10px;
  line-height: 35px;
}
.title-box {
  display: flex;
  flex-wrap: wrap;
}
.el-box {
  display: flex;
  width: 100%;
}
.sel-box {
  margin-right: 10px;
  display: inline-block;
  width: 220px;
}
.inputs {
  width: 100%;
}
.item {
  margin: 0 auto;
  text-align: center;
}
.parents-btn-box,
.items-btn-box {
  width: 30%;
  text-align: center;
  margin: 0 auto;
}
.item-btn {
  width: 100%;
}
.pc-input {
  width: 100%;
}
.other-btn-box {
  width: 30%;
  margin: 0 auto;
  .btn-box {
    display: flex;
    justify-content: space-between;
    .item-other {
      width: 45%;
    }
  }
}
.btn-submit-box {
  margin-top: 5px;
  .item-submit {
    width: 100%;
    background: #333465;
    color: #ffffff;
  }
}
.item-submit:hover {
  background: #5c5d84;
  .el-autocomplete {
      width: 100%;
  }
}
@media screen and (max-width: 480px) {
  .content {
    border-top: 1px solid #cccccc;
    margin-top: 20px;
    box-sizing: border-box;
    .top-title {
      border-left: 10px solid #97330e;
      margin-top: 20px;
      line-height: 20px;
    }
    .box {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid #cccccc;
    }
  }
  .name {
    display: inline-block;
    width: 130px;
    height: 40px;
    color: #666666;
    text-align: left;
    font-size: 14px;
  }
  .el-input {
    // margin-top: 5px;
  }
  .el-box {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .el-select {
      width: 100%;
  }
  .el-inputs {
      width: 100%;
  }
  .sel-input {
       border: 1px solid #cccccc;
  }
  .inputs {
    border: 1px solid #cccccc;
    width: 100%;
    box-sizing: border-box;
  }
  .item-box {
    width: calc(100% - 130px);
    border-radius: 8px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
  .isPhone-input {
    width: 100%;
    margin-top: 10px;
  }
  .el-input-bs {
      margin-top: 5px
  }
  .show-a {
    top: 10px;
  }
  .sel-box {
    margin-right: 0;
    line-height: 40px;
    width: 100%;
  }
  .parents-btn-box {
    width: 75%;
    display: flex;
    justify-content: space-between;
  }
  .other-btn-box {
    width: 75%;
  }
  .items-btn-box {
    width: 75%;
  }
  .list li {
    margin-top: 10px;
    line-height: 35px;
  }
}
</style>
