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
                  :style="width='100%'"
                />
                <el-autocomplete
                  v-model="it.fieldValue"
                  type='text'
                  :maxlength='50'
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
                      :maxlength="it.textLength"
                      :placeholder="it.reamkText"
                    ></el-input>
                  </span>
                </span>
                <span v-if="it.fieldClass.indexOf('append') != -1" class="el-input el-input-bs">
                    <el-input v-model="it.remark" type="text" :maxlength="it.textLength" :placeholder="it.reamkText"></el-input>
                </span>
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
                      :style="width='100%'"
                    />
                  </el-select>
                </span>
                <span v-else class="el-input">
                    <span v-if="parent.fieldText != ''">{{parent.fieldValue}}</span>
                    <span v-if="parent.fieldText == ''">
                  <el-input
                    v-model="parent.fieldValue"
                    type="text"
                    :style="width='100%'"
                    :maxlength="50"
                    :placeholder="parent.reamkText"
                    :disabled="parent.isEdit != 1 && parent.fieldValue != '' && !parent.editable"
                  ></el-input>
                  </span>
                </span>

                <span v-if="parent.fieldClass.indexOf('append') != -1">
                  <el-input v-model="parent.remark" type="text" :placeholder="parent.reamkText" :maxlength="50"></el-input>
                </span>

              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="parents-btn-box">
        <el-button @click="clickUpdata" class="item">上一步</el-button>
        <el-button @click="clickDown(2,parentInfo)" class="item">保存至下一步</el-button>
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
                    <el-input v-model="other.remark" type="text" :maxlength="50"></el-input>
                  </span>

                </span>
                 <span v-else-if="other.domType == 7 && flag ">
                            <el-button  @click="downloadSq()" v-if="!isPhone">下载申请表</el-button>
                            <div v-if="!isPhone" style='margin-top: 10px;'>
                            <el-upload
                                :action= "url"
                                list-type="picture-card"
                                :limit= 1
                                :file-list="fileList"
                                :on-success="handlePictureCardPreviews"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                              </el-upload>
                              <el-dialog :visible.sync="dialogVisible" style="width: 100%;" class="is">
                                <img width="100%" :src="dialogImageUrl" alt="">
                                <!-- <img width="100%" :src="imgUrl + id" alt=""> -->
                              </el-dialog>
                            </div>
                            <span v-if="isPhone">
                              <el-upload
                                class="upload-demo"
                                :action= 'url'
                                :limit= 1
                                :on-success="handleChanges"
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip"></div>
                              </el-upload>
                            </span>
                  </span>
                <span v-else class="el-input">
                    <span v-if="other.fieldText != ''">{{other.fieldValue}}</span>
                    <span v-if="other.fieldText == ''">
                  <el-input
                    v-model="other.fieldValue"
                    type="text"
                    :maxlength="50"
                    :placeholder="other.reamkText"
                    :disabled="other.isEdit != 1 && other.fieldValue != '' && ! other.editable"
                  ></el-input>
                    </span>
                </span>

                <span v-if="other.fieldClass.indexOf('append') != -1">
                  <el-input v-model="other.remark" type="text" :placeholder="other.reamkText" :maxlength="50"></el-input>
                </span>

              </div>
              <span v-if="other.domType == 3 && flag ">
                <span v-if="other.reamkText != null" class="showText">{{other.reamkText}}</span>
              </span>
             <span v-if="other.domType == 7 && flag ">
              <span class="showText" v-if="!isPhone">{{other.reamkText}}</span>
               <span v-if="isPhone" class="showText">填写提示：周末离校方式若为自行离校的情况，须提交《自行离校申请》。请在“电脑端”打开此网页并下载打印申请表，填写后拍照上传。</span>
             </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="other-btn-box">
        <div class="btn-box">
          <el-button @click="clickUpdata" class="item-other">上一步</el-button>
          <el-button @click="clickX(false,otherInfo)" class="item-other">保存</el-button>
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
      dialogImageUrl: '',
      id: localStorage.getItem('imgId'),
      dialogVisible: false,
      url: '/gateway/zuul/filesystem/api/upload/simpleupload?userId=' + window.userInfo.id,
      imgUrl: '/gateway/zuul/filesystem/api/image/thumbnail/',
      fileList: [
        { name: '',
          url: ''
        }],
      brInfo: [], // 本人信息
      parentInfo: [], // 家长信息
      otherInfo: [], // 其他信息
      info: [],
      userId: window.userInfo.id,
      configList: [],
      enumMap: {},
      itemMap: {},
      addList: [],
      fileInfo: [],
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
    vm.dialogImageUrl = localStorage.getItem('dialogImageUrl')
    // vm.dialogImageUrl = vm.imgUrl + vm.id
    http.get(vm.imgUrl + vm.id).then(xhr=> {
      console.log('=======xhr=',xhr)
      vm.fileList[0].url = xhr.url
      // vm.fileList[0].name = xhr.name
    })
    // console.log(window.userInfo.id)
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
		console.log('xhr',xhr);
        vm.configList = xhr.data;
        vm.fileInfo = vm.configList.fileInfo;
        vm.brInfo = []; // 本人信息
        vm.parentInfo = []; // 家长
        vm.otherInfo = []; // 其他
        let idx = 0;
        let parentTemp = [];
        let temp = ["s_g", "s_h", "s_j"];
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
		console.log('configList.fieldInfos:-------------',vm.configList.fieldInfos)
         for (let i of vm.configList.fieldInfos) {
            vm.$set(i,"editable",false)
            if(!i.fieldValue) {
              i.fieldValue = ''
              i.editable = true;
            }
            if (i.classifyName == '本人信息') {
              vm.brInfo.push(i);
            } else if (i.classifyName == '家长信息') {
              vm.parentInfo.push(i);
                if(vm.configList.flag) {
                    if(!i.batNum) {
                      i.batNum = 1;
                    }
                  if(temp.indexOf(i.fieldCode)!=-1) {
                    let temp = _.cloneDeep(i);
                    //temp.batNum = 2;
                    if(temp.batNum == 2) {
                      i.batNum = 1;
                      i.fieldValue = "";
                      i.fieldText = ""
                    } else {
                      temp.batNum = 2;
                    }

                    if (temp.fieldValue == i.fieldValue) {
                      temp.fieldValue = "";
                    }
                    if (temp.fieldText == i.fieldText) {
                      temp.fieldText = "";
                    }

                    temp.editable = true;
                    parentTemp.push(temp);
                    idx = vm.parentInfo.length;
                  }
                }
            } else {
			  console.log('--------------',vm.otherInfo)
              vm.otherInfo.push(i);
            }
          }
           for(let i of vm.parentInfo) {
            if(i.fieldCode == "s_g" && i.batNum == 1) {
              i.fieldName = '监护人姓名';
            }
            if(i.fieldCode == "s_g" && i.batNum == 2) {
              i.fieldName = '监护人姓名';
            }

            if(i.fieldCode == "s_h" && i.batNum == 1) {
              i.fieldName = '监护人手机号';
            }
            if(i.fieldCode == "s_h" && i.batNum == 2) {
              i.fieldName = '监护人手机号';
            }
            if(i.fieldCode == "s_j" && i.batNum == 1) {
              i.fieldName = '监护人工作单位';
            }
            if(i.fieldCode == "s_j" && i.batNum == 2) {
              i.fieldName = '监护人工作单位';
            }
          }
           if(vm.parentInfo && parentTemp && parentTemp.length) {
            for(let i of parentTemp) {
              if(i.fieldCode == "s_g") {
                i.fieldName = '监护人2姓名';
              }
              if(i.fieldCode == "s_h") {
                i.fieldName = '监护人2手机号';
              }
              if(i.fieldCode == "s_j") {
                i.fieldName = '监护人2工作单位';
              }
            }
            vm.parentInfo = vm.parentInfo.slice(0,idx).concat(parentTemp).concat(vm.parentInfo.splice(idx));
          }

      });

    vm.isPhone = vm.$store.state.isPhone;
  },
  mounted(){
    let vm = this
    if(this.dialogImageUrl) {
      this.dialogImageUrl = vm.imgUrl + vm.id
      console.log('====00=====',this.dialogImageUrl)
    }
  },
  methods: {
    handlePictureCardPreviews(file) {
      let vm = this
      // console.log('2=======',file.data)
	  console.log('location',file.data)
      let v = file.data
      vm.fileInfo.push({
                fileId: v.id,
                fileName: v.filename,
                fileSize: v.filesize,
                fileExt: v.ext
              });
      localStorage.setItem('imgId',v.id)
    },
    handlePictureCardPreview(file){
      //console.log(f)
      this.dialogImageUrl = file.url;
      localStorage.setItem('dialogImageUrl',this.dialogImageUrl)
        this.dialogVisible = true;
         console.log('1--------',file)
    },
    handleRemove(file, fileList) {
      let vm = this
      //  console.log(file, fileList);
       http.get(vm.imgUrl + vm.id).then(xhr=> {
      console.log('=======xhr=',xhr)

      // vm.fileList[0].name = xhr.name
    })
    },
     handleChanges(files) {
      let v = files.data
	  // vm.brInfo
      this.fileInfo.push({
                fileId: v.id,
                fileName: v.filename,
                fileSize: v.filesize,
                fileExt: v.ext
              });
       console.log(this.fileInfo)
      }
    ,
    downloadSq() {
      window.location.href = "/gateway/enroll/erReport/downloadSqTemp?access_token="
        + (JSON.parse(localStorage.getItem("accesstoken")).access_token  ? JSON.parse(localStorage.getItem("accesstoken")).access_token : "");
      },
       //上传附件
      showUploadAttach() {
        let vm = this;
        window.fileUpload({
          title: "上传附件",
          uploadFileMaxNum: 5,
          extensions: "",
          confirm: function(files) {
            _.forEach(files, function(v) {
              window.updateFileStatus(v.id, function() {
              });
              vm.fileInfo.push({
                fileId: v.id,
                fileName: v.filename,
                fileSize: v.filesize,
                fileExt: v.ext
              });
            });
          }

        });
      },
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
    clickX(e,a) {
    let vm = this;
    console.log('=========',a)
      vm.$ispreview = 1
      localStorage.is = 1
     // console.log(vm.$ispreview)
      let saveData = [];
      saveData = saveData
        .concat(vm.brInfo)
        .concat(vm.parentInfo)
        .concat(vm.otherInfo);
      if (saveData && saveData.length > 0) {
        let mobileRes = /^1[3456789]\d{9}$/;
        for (let i of saveData) {
          //判断带*的是否填写
          if (i.isRequired == 1) {
				console.log('--------------',i.isrequired)
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
      console.log(vm.isSubmit)
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
          console.log('===res=',saveData);
          vm.saveFileInfo();
          if(res.data.code == 0) {
            vm.$emit('nodefn')
          }
        });

    },
    saveFileInfo() {
        let vm = this;
          http.post("/gateway/enroll/api/erReport/saveFileInfo/" +  localStorage.getItem("regid"), vm.fileInfo).then(function (xhr) {
            if (xhr.data.code)
            console.log('===xhr=',xhr);
          });
      },
    // 点击上一步
    clickUpdata() {
      this.cuid = this.cuid - 1;
    },
    //  下一步
    clickDown(e,a) {
      let that = this;
      let mobileRes = /^1[3456789]\d{9}$/;
      console.log(e,a)
      let i = 0
      switch(e){
        case 1:
           _.forEach(that.brInfo,item => {
              if(item.fieldValue == '' && item.isRequired == 1){
                  return i = 1
              }
          });
          if(i == 1 ) {
              that.open3()
          }else {
              that.cuid = that.cuid + 1;
          }
          break;
          case 2:
             that.parentInfo.forEach(item => {
              if(item.fieldValue == '' && item.isRequired == 1){
                  return i = 1
              }
              if(item.fieldCode == "s_h" || item.fieldCode == 's_jjlxr_phone' ){
                if(item.fieldValue == '') {
                  return
                }else if(!mobileRes.test(item.fieldValue)){

                    console.log('======',mobileRes.test(item.fieldValue))
                    console.log('--',item.fieldValue)
                     return i = 2;
                }
          }
          });
          if(i == 1 || i == 2 ) {
            if(i == 1) {
                that.open3()
            }
            if(i == 2) {
                that.$message.warning("请输入正确格式的监护人手机号");
            }

          }else {
              that.cuid = that.cuid + 1;
          }
            break;
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
.showText {
  color: #ff7575;
  font-size: 14px;
}
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
  .showText {
    font-size: 12px;
    text-align: left;
  }
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
    margin-top: 5px;
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
<style>
@media screen and (max-width: 480px) {
  .el-input {
    border: none;
    border: 1px solid #cccccc;
  }
  .upload-demo .el-upload-list--text {
    width: 200px;
  }
}
/* .content .item-box span  {
  width: 100%;
} */
</style>
